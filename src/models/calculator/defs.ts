import IParser from '../parsers/defs';
import { CalculationResult } from '../expression/defs';

export default interface ICalculator {
  parser: IParser;
  run(raw: string): CalculationResult;
}
