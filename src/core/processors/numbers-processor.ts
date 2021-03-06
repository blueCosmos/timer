import { NumberContainer } from '../definitions/definitions';
import { UserInterface } from '../ui/user-interface';
import {FibonacciProcessor } from './fibonacci-processor';

export class NumbersProcessor {
  private listOfNumbers: Array<NumberContainer> = [];

  constructor(private fibonacciProcessor: FibonacciProcessor,
              private ui: UserInterface) {

  }

  public processNumber(newNumber: number): void {
    this.addOrUpdateEntry(newNumber);
    if (this.fibonacciProcessor.isFibonacci(newNumber)) {
      this.ui.log('FIB');
    }
  }

  public emitNumbers(): void {
    if (this.listOfNumbers.length === 0) {
      return;
    }
    
    this.ui.log(`\r${this.getNumbersInDescendingTotalOrder()}`);
  }

  private getNumbersInDescendingTotalOrder(): string {
    this.listOfNumbers.sort((el1, el2) => el2.total - el1.total);
    let msg: string = '';
  
    for(let i = 0; i < this.listOfNumbers.length; i++) {
      msg = `${msg}, ${this.listOfNumbers[i].num}:${this.listOfNumbers[i].total}`.replace(/^,\s/,'');
    }

    return msg;
  }

  private addOrUpdateEntry(newNumber: number): void {
    // Get number
    const foundNumber: NumberContainer | undefined = this.listOfNumbers.find(el => el.num === newNumber);
    if(!foundNumber) {
      this.listOfNumbers.push(<NumberContainer>{ num: newNumber, total: 1});
    } else {
      foundNumber.total++;
    }
  }
}