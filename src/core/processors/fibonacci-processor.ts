export class FibonacciProcessor {

  private setOfFibonaccis: Set<number>;
  private _thousandthTerm: number = 0;

  public get thousandthTerm() {
    return this._thousandthTerm;
  }

  constructor(private nthTermToLimit: number = 1000) {
    this.setOfFibonaccis = new Set();
    this.calculateFibonaccisUpTo(nthTermToLimit);
  }

  public isFibonacci(newNumber: number): boolean {
    return this.setOfFibonaccis.has(+newNumber);
  }

  /****
   * ASYNCHRONOUS FUNCTIONS
   */
  public async calculateFibonaccisUpTo(nth: number): Promise<void> {
    // Empty existing set
    this.setOfFibonaccis.clear();

    const calculations = (resolve,reject) => {
      if(nth > this.nthTermToLimit) {
        throw new Error('Cannot use numbers past 1000th fibonacci');
      }
  
      let prev = 1;
      let current = 2;
      let count = 3;
      let result = 0;
    
      this.setOfFibonaccis.add(0), this.setOfFibonaccis.add(1), this.setOfFibonaccis.add(2);
      
      while(count < nth) {
        result = prev + current;
        prev = current;
        current = result;
        this.setOfFibonaccis.add(result);
        count++;
      }
  
      this._thousandthTerm = result;
      resolve();
    };
  
    return new Promise(calculations);
  }
}