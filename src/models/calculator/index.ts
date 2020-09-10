import ICalculator from './defs';
import IParser from '../parsers/defs';
import { CalculationResult, ICalculationResult, ValidationException } from '../expression/defs';

import DefaultParser from '../parsers';

class Calculator implements ICalculator {
  public parser: IParser;

  public constructor(parser: IParser = new DefaultParser()) {
    this.parser = parser;
  }

  public run(raw: string): ICalculationResult {
    if (!raw || typeof raw !== 'string')
      return new CalculationResult(new ValidationException('Expression should be non-empty string'));

    const parseResult = this.parser.parse(raw);
    if (parseResult.error) return new CalculationResult(parseResult.error);
    if (!parseResult.expression)
      return new CalculationResult(new Error('Parser return neither expression nor error'));

    const calculateResult = parseResult.expression.calculate();
    return calculateResult;
  }
}

export default Calculator;
