import { timer, Subscription } from 'rxjs';
import { NumbersProcessor } from './numbers-processor';

export class Processor {
  private timedSubscription?: Subscription;
  private _frequencyInMilliseconds: number = 0;
  private _timeLastEmitted: number = 0;
  private _timeElapsedSinceLastEmit: number = 0;
  private _paused: boolean = false;
  private _frequencyToRefreshInSeconds: number = 0;

  public get frequencyToRefreshInSeconds() {
    return this._frequencyToRefreshInSeconds;
  }

  public set frequencyToRefreshInSeconds(value: number) {
    this._frequencyToRefreshInSeconds = value;
    this._frequencyInMilliseconds = value * 1000;
  }

  public get frequencyInMilliseconds() {
    return this._frequencyInMilliseconds;
  }

  public get timeLastEmitted() {
    return this._timeLastEmitted;
  }

  public get paused() {
    return this._paused;
  }

  public get timeElapsedSinceLastEmit() {
    return this._timeElapsedSinceLastEmit;
  }

  public get timerSubscriptionExists() {
    return this.timedSubscription !== undefined;
  }
  
  constructor(private numbersProcessor: NumbersProcessor,
              frequencyToRefreshInSeconds: number = 0) {
    this.frequencyToRefreshInSeconds = frequencyToRefreshInSeconds;
  }

  public processResponse(response: any) {
    switch (response) {
      case 'halt':
        if (this._paused) {
          console.warn('Already paused!');
        } else {
          this.onPause();
        }
        
        break;
      case 'resume':
        if (!this._paused) {
          console.warn('Not paused. Timer is unaffected');
        } else {
          this.onResume();
        }
  
        break;
      case 'quit':
        if (this.timedSubscription) {
          this.timedSubscription.unsubscribe();
        }
        break;
      default:
        if (isNaN(response)) {
          throw new Error('Invalid number!');
        }
        console.log('calling');
        this.numbersProcessor.processNumber(+response);  
    }   
  }

  public startEmittingNumbers(): void {
    this.emitNumbers(this._frequencyInMilliseconds, this._frequencyInMilliseconds);
  }

  /*****
   * PRIVATE METHODS
   */
  private emitNumbers(firstTimeFrequency: number, secondTimeFrequency: number): void {
    if (this.timedSubscription) {
      this.timedSubscription.unsubscribe();
    }
    this.timedSubscription = timer(firstTimeFrequency, secondTimeFrequency)
                              .subscribe((val: number) => {
                                this.numbersProcessor.emitNumbers();
                                this._timeLastEmitted = Date.now();
                              });
  }

  private onResume(): void {
    this._paused = false;
    console.log('\ntimer resumed');
  
    let timeDifference = this._frequencyInMilliseconds >= this._timeElapsedSinceLastEmit
            ? (this._frequencyInMilliseconds - this._timeElapsedSinceLastEmit) : 0;

    this.emitNumbers(timeDifference, this._frequencyInMilliseconds);
  }

  private onPause(): void {
    this._paused = true;
    console.log('\ntimer halted');

    if (this._timeLastEmitted !== 0) {
      this._timeElapsedSinceLastEmit = Date.now() - this._timeLastEmitted;
    }
  
    if (this.timedSubscription) {
      this.timedSubscription.unsubscribe();
    }
  }

}