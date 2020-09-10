import IExpression from '../expression/defs';

export default interface IParser {
  parse(raw: string): IParsingResult;
}

export interface IParsingResult {
  error: null | Error;
  expression: null | IExpression;
}

export class ParsingResult implements IParsingResult {
  public error: null | Error;
  public expression: null | IExpression;

  public constructor(error: null | Error, expression: null | IExpression = null) {
    this.error = error;
    this.expression = expression;
    return this;
  }
}
