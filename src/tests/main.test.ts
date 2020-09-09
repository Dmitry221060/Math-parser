import { expect } from 'chai';

import Calculator from '../models/calculator';

describe('Calculator', () => {
  const calculator = new Calculator();

  describe('.run', () => {
    let rawString: string,
      result: number | null;

    it('can parse string', () => {
      rawString = '2+2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 + 2 );
    });

    it('doesn\'t care about spacing', () => {
      rawString = '  2 +    2 ';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 + 2 );
    });

    it('can sum two int', () => {
      rawString = '5 + 3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5 + 3 );
    });

    it('can\'t see the difference between dot and semicolon in floats', () => {
      rawString = '5.2 + 3,3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.2 + 3.3 );
    });

    it('can sum two float', () => {
      rawString = '5.2 + 3.3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.2 + 3.3 );
    });

    it('can sum int and float', () => {
      rawString = '5 + 3.3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5 + 3.3 );
    });

    it('understands floats in dot notation', () => {
      rawString = '.2 + .3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 0.2 + 0.3 );
    });

    it('can handle floating point math', () => {
      rawString = '0.1 + 0.2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 0.3 );
    });

    it('can sum more than two numbers', () => {
      rawString = '5 + 3.3 + 14 + 9.1 + 7.7';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5 + 3.3 + 14 + 9.1 + 7.7 );
    });

    it('returns the entered number if no operation was specified', () => {
      rawString = '5.2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.2 );
    });

    it('can substract two int', () => {
      rawString = '5 - 3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5 - 3 );
    });

    it('can substract two float', () => {
      rawString = '5.5 - 3.3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.5 - 3.3 );
    });

    it('can substract int and float', () => {
      rawString = '5 - 3.5';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5 - 3.5 );
    });

    it('can substract float and int', () => {
      rawString = '5.5 - 3';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.5 - 3 );
    });

    it('understands negative numbers', () => {
      rawString = '-5.5 + 7';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( -5.5 + 7 );
    });

    it('can return negative answer', () => {
      rawString = '3 - 5.5';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 3 - 5.5 );
    });

    it('can substract more than two numbers', () => {
      rawString = '5.5 - 3.3 - 12 - 5';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.5 - 3.3 - 12 - 5 );
    });

    it('can perform different operations in one expression', () => {
      rawString = '5.5 + 11.25 - 3.4';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.5 + 11.25 - 3.4 );
    });

    it('can multiply two numbers', () => {
      rawString = '3 * 5.5';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 3 * 5.5 );
    });

    it('multiplies before summing', () => {
      rawString = '2 + 2 * 2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 + 2 * 2 );
    });

    it('can divide two numbers', () => {
      rawString = '15 / 2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 15 / 2 );
    });

    it('divides before summing', () => {
      rawString = '2 + 2 / 2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 + 2 / 2 );
    });
  });
});
