export default interface IExpression {
  validationError: null | ValidationException;
  calculate(): CalculationResult;
  register(type: string, entity: string): ValidationException | null;
}

export interface ExpressionConfig {
  numbers: string[];
  floatPoint: string[];
  operators: Operator[];
  braces: [string, string][];
}

export class ValidationException extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface ICalculationResult {
  error: null | Error;
  answer: null | number;
}

export class CalculationResult implements ICalculationResult {
  public error: null | Error;
  public answer: null | number;

  public constructor(error: null | Error, answer: null | number = null) {
    this.error = error;
    this.answer = answer;
  }
}

export interface IEntity {
  type: 'number' | 'operator';
  value: string;
}

export class Entity implements IEntity {
  public type: 'number' | 'operator';
  public value: string;

  public constructor(type: 'number' | 'operator', value: string) {
    this.type = type;
    this.value = value;
  }
}

export interface IOperator extends IEntity {
  priority: number;
  mightBePartOfNumber: boolean;
  execute(a: number, b: number): number;
  FPMCorrection(unsafe: number): string;
}

export class Operator extends Entity implements IOperator {
  public priority: number;
  public mightBePartOfNumber: boolean;
  public execute: (a: number, b: number) => number;

  public constructor(
    char: string,
    priority: number,
    execute: (a: number, b: number) => number,
    mightBePartOfNumber = false
  ) {
    super('operator', char);
    this.priority = priority;
    this.execute = execute;
    this.mightBePartOfNumber = mightBePartOfNumber;
  }

  public FPMCorrection(unsafe: number): string {
    return parseFloat( unsafe.toFixed(12) ).toString();
  }
}
