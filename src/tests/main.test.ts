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

    it('understands a single number', () => {
      rawString = '5.2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 5.2 );
    });

    it('understands a single number with it sign', () => {
      rawString = '+5.2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( +5.2 );
    });

    it('understands a single number with it sign', () => {
      rawString = '-5.2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( -5.2 );
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

    it('can parse brackets', () => {
      rawString = '(2 + 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2) );
    });

    it('сalculates value in brackets before subtracting', () => {
      rawString = '1 - (2 + 3)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 1 - (2 + 3) );
    });

    it('сalculates value in brackets before multiplication', () => {
      rawString = '2 * (2 + 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 * (2 + 2) );
    });

    it('can parse brackets in the middle of expression', () => {
      rawString = '2 - (2 + 2) * 2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 - (2 + 2) * 2 );
    });

    it('can parse nested brackets', () => {
      rawString = '2 + (2 - (2 + 2))';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 + (2 - (2 + 2)) );
    });

    it('can parse brackets around single number', () => {
      rawString = '(2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2) );
    });

    it('can parse brackets around single number', () => {
      rawString = '(-2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (-2) );
    });

    it('can parse sign in front of brackets', () => {
      rawString = '-(2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( -(2) );
    });

    it('can parse meaningless brackets', () => {
      rawString = '((((2 + 2))) - 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( ((((2 + 2))) - 2) );
    });

    it('doesn\'t break the order of operations in brackets', () => {
      rawString = '(2 + 2 * 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2 * 2) );
    });

    it('can apply operator to two brackets', () => {
      rawString = '(2 + 2) - (1 + 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2) - (1 + 2) );
    });

    it('can parse float in dot notation next to open bracket', () => {
      rawString = '(.5 + 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (0.5 + 2) );
    });

    it('multiplies the number by bracket if operator is missing', () => {
      rawString = '2(2 + 2)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( 2 * (2 + 2) );
    });

    it('multiplies the bracket by number if operator is missing', () => {
      rawString = '(2 + 2)2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2) * 2 );
    });

    it('multiplies the bracket by float in dot notation if operator is missing', () => {
      rawString = '(2 + 2).2';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2) * 0.2 );
    });

    it('multiplies two bracket if operator is missing', () => {
      rawString = '(2 + 2)(7 - 3)';
      result = calculator.run(rawString).answer;
      expect(result).to.be.equal( (2 + 2) * (7 - 3) );
    });
  });
});
