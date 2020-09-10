import { ParsingResult, IParsingResult } from './defs';
import IParser from './defs';
import DefaultExpression from '../expression';
import { ExpressionConfig, Operator, ValidationException } from '../expression/defs';

const sumFunc = (a: number, b: number) => a + b;
const subtractFunc = (a: number, b: number) => a - b;
const multiplyFunc = (a: number, b: number) => a * b;
const divideFunc = (a: number, b: number) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

const config: ExpressionConfig = {
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  operators: [
    new Operator('+', 1, sumFunc, true),
    new Operator('-', 1, subtractFunc, true),
    new Operator('*', 2, multiplyFunc),
    new Operator('/', 2, divideFunc)
  ],
  floatPoint: ['.', ','],
  braces: [ ['(', ')'] ],
};

class DefaultParser implements IParser {
  public parse(raw: string): IParsingResult {
    const expression = new DefaultExpression(config);

    let tempNumber = ''; // Numbers constructed during parsing

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];
      if (char === ' ') continue;

      const charType = this.define(char);
      if (charType === 'unknown')
        return new ParsingResult(new ValidationException(`Unexpected character ${char}`));

      if (charType === 'number') {
        tempNumber += char;
        continue;
      }

      if (charType === 'floatPoint') {
        tempNumber += '.';
        continue;
      }

      if (tempNumber) expression.register('number', tempNumber);
      expression.register(charType, char);
      if (expression.validationError) return new ParsingResult(expression.validationError);
      tempNumber = '';
    }

    if (tempNumber) expression.register('number', tempNumber);
    if (expression.validationError) return new ParsingResult(expression.validationError);

    return new ParsingResult(null, expression);
  }

  private define(char: string): string {
    if (config.numbers.includes(char)) return 'number';
    if (config.floatPoint.includes(char)) return 'floatPoint';
    if (config.operators.find(e => e.value === char)) return 'operator';
    if (config.braces.flat().includes(char)) return 'brace';
    return 'unknown';
  }
}

export default DefaultParser;
