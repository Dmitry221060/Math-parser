import IExpression, { ExpressionConfig, Entity, CalculationResult, ValidationException, Operator } from './defs';

const numberRegExp = /^\d+(?:\.\d+)?$/;

type Layer = (Entity | Layer)[];

class Expression implements IExpression {
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

  public calculate(): CalculationResult {
    if (this.validationError)
      return new CalculationResult(this.validationError);

    for (let i = this.layers.length - 1; i >= 0; i--)
      for (let j = 0; j < this.layers[i].length; j++) {
        const layer = this.layers[i][j];

        const operators = layer.filter(e => e instanceof Operator) as Operator[];
        operators.sort((a, b) => b.priority - a.priority);

        for (const operator of operators) {
          const operatorIndex = layer.indexOf(operator);
          let firstArgEntity = layer[operatorIndex - 1];
          let secondArgEntity = layer[operatorIndex + 1];

          if (Array.isArray(firstArgEntity)) {
            if (firstArgEntity.length != 1)
              return new CalculationResult(new ValidationException('Missing operator'));
            firstArgEntity = firstArgEntity[0];
          }
          if (Array.isArray(secondArgEntity)) {
            if (secondArgEntity.length != 1)
              return new CalculationResult(new ValidationException('Missing operator'));
            secondArgEntity = secondArgEntity[0];
          }

          const firstArg = parseFloat( (firstArgEntity as Entity).value );
          const secondArg = parseFloat( (secondArgEntity as Entity).value );

          const baseResult = operator.execute(firstArg, secondArg);
          const clearResult = operator.FPM(baseResult);

          layer.splice(operatorIndex - 1, 3, new Entity('number', clearResult));
        }
      }


    const answer = parseFloat((this.layers[0][0][0] as Entity).value);
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

    this.layers[this.depth][this.layerNumber].push(new Entity('number', entity ));

    return null;
  }

  private registerBraces(entity: string): ValidationException | null {
    const bracePair = this.config.braces.find(e => e.includes(entity));
    if (!bracePair)
      return this.validationError = new ValidationException(`${entity} is not a valid brace`);

    const depthChange = bracePair.indexOf(entity) * 2 - 1;
    const newDepth = this.depth + depthChange;
    if (newDepth < 0)
      return this.validationError = new ValidationException('Unexpected closed brace');

    if (depthChange === 1) {
      const newLayer: Layer = [];
      if (!this.layers[newDepth]) this.layers[newDepth] = [];
      const newLayerNumber = this.layers[newDepth].length;
      this.layers[newDepth][newLayerNumber] = newLayer;

      this.layers[this.depth][this.layerNumber].push(newLayer);

      this.depth = newDepth;
      this.layerNumber = newLayerNumber;
    } else {
      const currentLayer = this.layers[this.depth][this.layerNumber];
      const lastRegistredEntity = currentLayer[currentLayer.length - 1];
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
}

export default Expression;
