import { timer, Subscription } from 'rxjs';
import { UserInterface } from '../ui/user-interface';
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
              private ui: UserInterface,
              frequencyToRefreshInSeconds: number = 0) {
    this.frequencyToRefreshInSeconds = frequencyToRefreshInSeconds;
  }

  public processResponse(response: any) {
    switch (response) {
      case 'halt':
        if (this._paused) {
          this.ui.warn('Already paused!');
        } else {
          this.onPause();
        }
        
        break;
      case 'resume':
        if (!this._paused) {
          this.ui.warn('Not paused. Timer is unaffected');
        } else {
          this.onResume();
        }
  
        break;
      case 'quit':
        if (this.timedSubscription) {
          this.timedSubscription.unsubscribe();
        }
        this.numbersProcessor.emitNumbers();
        this.ui.log('\nThanks for playing, press any key to exit.');
        break;
      default:
        if (isNaN(response)) {
          throw new Error('Invalid number!');
        }
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
    this.ui.log('\ntimer resumed');
  
    let timeDifference = this._frequencyInMilliseconds >= this._timeElapsedSinceLastEmit
            ? (this._frequencyInMilliseconds - this._timeElapsedSinceLastEmit) : 0;

    this.emitNumbers(timeDifference, this._frequencyInMilliseconds);
  }

  private onPause(): void {
    this._paused = true;
    this.ui.log('\ntimer halted');

    if (this._timeLastEmitted !== 0) {
      this._timeElapsedSinceLastEmit = Date.now() - this._timeLastEmitted;
    }
  
    if (this.timedSubscription) {
      this.timedSubscription.unsubscribe();
    }
  }

}