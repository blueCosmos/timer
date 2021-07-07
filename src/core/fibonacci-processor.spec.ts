import { FibonacciProcessor } from "./fibonacci-processor";

describe('FibonacciProcessor', () => {
  let cut;
    
  beforeEach(() => {
    cut = new FibonacciProcessor();
  });

  it('should set the default fibonacci set up to 1000th terms', () => {
    expect(cut.setOfFibonaccis.size).toBe(1000);
  });

  describe('calculateFibonaccisUpTo()', () => {
    beforeEach(async () => {
      await cut.calculateFibonaccisUpTo(6);
    });

    it('should clear the setOfFibonaccis if it already has entries', () => {
      expect(cut.setOfFibonaccis.size).toBe(6);
    });

    test.each([
      0,1,2,3,5,8
    ])('should contain %s',
    (arg) => {
      expect(cut.setOfFibonaccis.has(arg)).toBeTruthy();
    });
    
  });

});