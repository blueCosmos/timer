import { timer, Subscription } from 'rxjs';
import { NumbersProcessor } from './numbers-processor';

export class Processor {
  private timedSubscription?: Subscription;
  private _frequencyInMilliseconds: number = 0;
  private _lastLoggedTime: number = 0;
  private _timeLogged: number = 0;
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

  public get lastLoggedTime() {
    return this._lastLoggedTime;
  }

  public get paused() {
    return this._paused;
  }

  public get timeLogged() {
    return this._timeLogged;
  }
  
  constructor(private numbersProcessor: NumbersProcessor,
              frequencyToRefreshInSeconds: number = 0) {
    this.frequencyToRefreshInSeconds = frequencyToRefreshInSeconds;
  }

  public onResume(): void {
    this._paused = false;
    console.log('\ntimer resumed');
    this._lastLoggedTime = Date.now();
  
    // Set a one-time timeout for (frequencyInMilliseconds - timeLogged) + (lastLoggedTime)
    const timeDifference = (this._frequencyInMilliseconds - this._timeLogged);
  
    if (timeDifference > 0) {
      this.emitNumbers(timeDifference, this._frequencyInMilliseconds);
      this._timeLogged = Date.now();
    }
  }

  public onPause(): void {
    this._paused = true;
    console.log('\ntimer halted');
    this._timeLogged = Date.now() - this._lastLoggedTime;
  
    if (this.timedSubscription) {
      this.timedSubscription.unsubscribe();
    }
  }

  public processResponse(response: any) {
    this._lastLoggedTime = Date.now();

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
        this.numbersProcessor.rememberNumber(+response);  
    }   
  }

  public startEmittingNumbers(): void {
    this.emitNumbers(this._frequencyInMilliseconds, this._frequencyInMilliseconds);
  }

  private emitNumbers(firstTimeFrequency: number, secondTimeFrequency: number): void {
    if (this.timedSubscription) {
      this.timedSubscription.unsubscribe();
    }
    this.timedSubscription = timer(firstTimeFrequency, secondTimeFrequency)
                              .subscribe((val: number) => this.numbersProcessor.emitNumbers());
  }

}