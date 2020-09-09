import ICalculator from './defs';
import IParser from '../parsers/defs';
import { CalculationResult } from '../expression/defs';

import DefaultParser from '../parsers';

class Calculator implements ICalculator {
  public parser: IParser;

  public constructor(parser: IParser = new DefaultParser()) {
    this.parser = parser;
  }

  public run(raw: string): CalculationResult {
    const parseResult = this.parser.parse(raw);
    if (parseResult.error) return new CalculationResult(parseResult.error);
    if (!parseResult.expression)
      return new CalculationResult(new Error('Parser return neither expression nor error'));

    const calculateResult = parseResult.expression.calculate();
    return calculateResult;
  }
}

export default Calculator;
