const prompts = require('prompts');
const _array = require('lodash/array');
const datefns = require('date-fns');

import { timer } from 'rxjs';

let enteredFirstNumber: boolean = false;
let frequencyInMilliseconds: number;
let lastLoggedTime: number;
let timeLogged: number;
let timedSubscription: any;
let paused = false;
let numberDisplayInQueue = [];

const questions = [
  {
    type: 'text',
    name: 'number-frequency',
    message: 'Please input the amount of time in seconds between emitting numbers and their frequency'
  }, 
  {
    type: 'text',
    name: 'number-frequency',
    message: ''
  }
];

const tableOfNumbers:Array<NumberContainer> = [];

(async () => {
  let response = await prompts(questions[0]);
  const { 'number-frequency': frequencyInSeconds }= response;
  lastLoggedTime = Date.now();
  
  if(!isNaN(frequencyInSeconds)) {
    frequencyInMilliseconds = frequencyInSeconds * 1000;
    startEmittingNumbers(frequencyInMilliseconds, frequencyInMilliseconds);
  }

  // Loop numbers
  while (response['number-frequency'] !== 'quit') {
    questions[1].message = returnMsg(enteredFirstNumber);
    response = await prompts(questions[1]);
    enteredFirstNumber = true;
    processResponse(response);
    console.log('Finished', response);
  }
  console.log('quitted')


})();

function processResponse({ 'number-frequency': response}: any) {
  console.log('Processing response', response);
  switch (response) {
    case 'halt':
      if (paused) {
        console.log('Already paused!');
      } else {
        onPause();
      }
      
      break;
    case 'resume':
      if (!paused) {
        console.log('Not paused. Timer is unaffected');
      } else {
        onResume();
      }

      break;
    case 'quit':
      if (timedSubscription) {
        timedSubscription.unsubscribe();
      }
      break;
    default:
      if (!isNaN(response)) {
        rememberNumber(response['number-frequency']);
      }

  }
}

function rememberNumber(newNumber: string | number) {

  if (notFibonacci(newNumber)) {
    addOrUpdateEntry(newNumber);
  } else {
    console.log(newNumber);
  }

}

function returnMsg(firstNumberEntered: boolean): string {
  return `Please enter the ${firstNumberEntered ? 'next' : 'first'} number`;
}

function notFibonacci(newNumber: number | string) {
  return true;
}

function addOrUpdateEntry(newNumber: any): void {
  // Get number
  const foundNumber: NumberContainer | undefined = tableOfNumbers.find(el => el.num === newNumber);

  if(!foundNumber) {
    tableOfNumbers.push(<NumberContainer>{ num: newNumber, total: 1});
  } else {
    foundNumber.total++;
  }

}

function startEmittingNumbers(firstTimeFrequency: number, secondTimeFrequency: number): void {
  if (timedSubscription) {
    timedSubscription.unsubscribe();
  }
  timedSubscription = timer(firstTimeFrequency, secondTimeFrequency).subscribe((val: number) => console.log(firstTimeFrequency));
}

function onPause() {
  paused = true;
  timeLogged = Date.now() - lastLoggedTime;

  if (timedSubscription) {
    timedSubscription.unsubscribe();
  }
}

function onResume() {
  paused = false;
  lastLoggedTime = Date.now();

  // Set a one-time timeout for (frequencyInMilliseconds - timeLogged) + (lastLoggedTime)
  const timeDifference = (frequencyInMilliseconds - timeLogged);
  console.log(timeDifference);

  if (timeDifference > 0) {
    startEmittingNumbers(timeDifference, frequencyInMilliseconds);
  }
}

function emitNumbers() {
  console.log('emitting numbers');
  tableOfNumbers.sort((el1, el2) => el2.total - el1.total);
  let msg: string = '';

  for(let i = 0; i < tableOfNumbers.length; i++) {
    msg = `${msg}, ${tableOfNumbers[i].num}:${tableOfNumbers[i].total}`;
  }

  console.log(msg);
}

interface NumberContainer {
  num: string | number;
  total: number;
}
