import IExpression, { ExpressionConfig, Entity, IEntity, CalculationResult, ICalculationResult, ValidationException, Operator, IOperator } from './defs';
import logger from '../../util/logger';

const numberRegExp = /^\d+(?:\.\d+)?$/;

type Layer = (IEntity | Layer)[];

class DefaultExpression implements IExpression {
  public config: ExpressionConfig;
  public validationError: null | ValidationException;
  private depth: number;
  private layerNumber: number;
  private layers: Layer[][];

  public constructor(config: ExpressionConfig) {
    this.config = config;
    this.validationError = null;

    this.depth = 0;
    this.layerNumber = 0;
    this.layers = [
      [ [] ]
    ];
  }

  public calculate(): ICalculationResult {
    this.validate();
    if (this.validationError)
      return new CalculationResult(this.validationError);

    for (let i = this.layers.length - 1; i >= 0; i--)
      for (let j = 0; j < this.layers[i].length; j++) {
        const layer = this.layers[i][j];
        this.softFlatLayer(layer);

        const operators = layer.filter(e => e instanceof Operator) as IOperator[];
        operators.sort((a, b) => b.priority - a.priority);

        for (const operator of operators) {
          const operatorIndex = layer.indexOf(operator);
          const firstArgEntity = layer[operatorIndex - 1];
          const secondArgEntity = layer[operatorIndex + 1];

          const firstArg = parseFloat( (firstArgEntity as IEntity).value );
          const secondArg = parseFloat( (secondArgEntity as IEntity).value );

          let result;
          try {
            result = operator.execute(firstArg, secondArg);
          } catch(e) {
            return new CalculationResult(new ValidationException(`Operator rejected arguments:\n${e}`));
          }
          const safeResult = operator.FPMCorrection(result);

          layer.splice(operatorIndex - 1, 3, new Entity('number', safeResult));
          logger.debug(layer);
        }

        if (layer.length != 1)
          return new CalculationResult(new ValidationException('Missing operator'));
      }


    const answer = parseFloat( (this.layers[0][0][0] as IEntity).value );
    return new CalculationResult(null, answer);
  }

  public register(type: string, entity: string): ValidationException | null {
    if (this.validationError) return this.validationError;

    switch (type) {
      case 'number': return this.registerNumber(entity);
      case 'brace': return this.registerBraces(entity);
      case 'operator': return this.registerOperator(entity);
      default:
        return this.validationError = new ValidationException(`Unexpected entity type ${type}`);
    }
  }

  private registerNumber(entity: string): ValidationException | null {
    if (entity.indexOf('.') === 0) entity = '0' + entity;
    if (!numberRegExp.test(entity))
      return this.validationError = new ValidationException(`${entity} is not a number`);

    const currentLayer = this.layers[this.depth][this.layerNumber];
    const lastRegistredEntity = currentLayer[currentLayer.length - 1];
    if (Array.isArray(lastRegistredEntity)) this.registerOperator('*');

    this.layers[this.depth][this.layerNumber].push(new Entity('number', entity ));

    return null;
  }

  private registerBraces(entity: string): ValidationException | null {
    const bracePair = this.config.braces.find(e => e.includes(entity));
    if (!bracePair)
      return this.validationError = new ValidationException(`${entity} is not a valid brace`);

    const depthChange = -(bracePair.indexOf(entity) * 2 - 1);
    const newDepth = this.depth + depthChange;
    if (newDepth < 0)
      return this.validationError = new ValidationException('Unexpected closed brace');

    const currentLayer = this.layers[this.depth][this.layerNumber];
    const lastRegistredEntity = currentLayer[currentLayer.length - 1];

    if (depthChange === 1) {
      if (lastRegistredEntity !== undefined && !(lastRegistredEntity instanceof Operator))
        this.registerOperator('*');

      const newLayer: Layer = [];
      if (!this.layers[newDepth]) this.layers[newDepth] = [];
      const newLayerNumber = this.layers[newDepth].length;
      this.layers[newDepth][newLayerNumber] = newLayer;

      currentLayer.push(newLayer);

      this.depth = newDepth;
      this.layerNumber = newLayerNumber;
    } else {
      if (lastRegistredEntity === undefined)
        return this.validationError = new ValidationException('Empty layers is not allowed');
      if (lastRegistredEntity instanceof Operator)
        return this.validationError = new ValidationException('Layer may not end with operator');

      this.depth = newDepth;
      this.layerNumber = this.layers[newDepth].length - 1;
    }

    return null;
  }

  private registerOperator(entity: string): ValidationException | null {
    const operator = this.config.operators.find(e => e.value === entity);
    if (!operator)
      return this.validationError = new ValidationException(`${entity} is not a valid operator`);

    const currentLayer = this.layers[this.depth][this.layerNumber];
    const lastRegistredEntity = currentLayer[currentLayer.length - 1];
    if (lastRegistredEntity === undefined) {
      if (!operator.mightBePartOfNumber)
        return this.validationError = new ValidationException('Operator should follow entity or layer');
      this.registerNumber('0');
    }
    if (lastRegistredEntity instanceof Operator)
      return this.validationError = new ValidationException('Operator may not follow another operator');

    this.layers[this.depth][this.layerNumber].push(operator);

    return null;
  }

  private validate(): ValidationException | null {
    if (this.validationError) return this.validationError;

    const firstLayer = this.layers[0][0];
    const lastLayerEntity = firstLayer[firstLayer.length - 1];
    if (lastLayerEntity === undefined)
      return this.validationError = new ValidationException('Empty layers is not allowed');
    if (lastLayerEntity instanceof Operator)
      return this.validationError = new ValidationException('Layer may not end with operator');

    return null;
  }

  private softFlatLayer(layer: Layer) {
    for (let i = 0; i < layer.length; i++) {
      const entityOrLayer = layer[i];
      if (Array.isArray(entityOrLayer)) layer[i] = entityOrLayer[0];
    }
  }
}

export default DefaultExpression;
