import { ParsingResult, IParsingResult } from './defs';
import IParser from './defs';
import Expression from '../expression';
import { ExpressionConfig, Operator } from '../expression/defs';

const config: ExpressionConfig = {
  numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  operators: [
    new Operator('+', 1, (a, b) => a + b, true),
    new Operator('-', 1, (a, b) => a - b, true),
    new Operator('*', 2, (a, b) => a * b),
    new Operator('/', 2, (a, b) => a / b)
  ],
  floatPoint: ['.', ','],
  braces: [ ['(', ')'] ],
};

class DefaultParser implements IParser {
  public parse(raw: string): IParsingResult {
    const expression = new Expression(config);

    let tempNumber = ''; //Numbers constructed during parsing

    for (let i = 0; i < raw.length; i++) {
      const char = raw[i];
      if (char === ' ') continue;

      const charType = this.define(char);
      if (charType === 'unknown')
        return new ParsingResult(new Error(`Unexpected character ${char} in clean input`));

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
