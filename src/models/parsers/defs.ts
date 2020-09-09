import Expression from '../expression';

export default interface IParser {
  parse(raw: string): IParsingResult;
}

export interface IParsingResult {
  error: null | Error;
  expression: null | Expression;
}

export class ParsingResult implements IParsingResult {
  public error: null | Error;
  public expression: null | Expression;

  public constructor(error: null | Error, expression: null | Expression = null) {
    this.error = error;
    this.expression = expression;
    return this;
  }
}
