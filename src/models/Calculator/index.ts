import ICalculator from './defs';

class Calculator implements ICalculator {



  public run(raw: string): number {
    console.log(raw);
    throw new Error('Method not implemented.');
  }

}

export default Calculator;
