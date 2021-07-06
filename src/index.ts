const prompts = require('prompts');

import { timer } from 'rxjs';
import { NumberContainer } from './core/definitions';

let frequencyInMilliseconds: number;
let lastLoggedTime: number;
let timeLogged: number;
let timedSubscription: any;
let thousandthTerm: number;
let paused = false;

const questions = [
  {
    type: 'text',
    name: 'number-frequency',
    message: 'Please input the amount of time in seconds between emitting numbers and their frequency'
  }, 
  {
    type: 'text',
    name: 'number-frequency',
    message: 'Please enter the first number'
  },
  {
    type: 'text',
    name: 'number-frequency',
    message: 'Please enter the next number'
  }
];

const listOfNumbers:Array<NumberContainer> = [];
const setOfFibonaccis:Set<number> = new Set();

(async () => {
  try {
    await calculateFibonaccisUpTo(1000);
    let response = await prompts(questions[0]);
    const { 'number-frequency': frequencyInSeconds } = response;
    
    if(!isNaN(frequencyInSeconds)) {
      frequencyInMilliseconds = frequencyInSeconds * 1000;
      startEmittingNumbers(frequencyInMilliseconds, frequencyInMilliseconds);
      response = await prompts(questions[1]);
      processResponse(response);
    }
  
    // Loop numbers
    while (response['number-frequency'] !== 'quit') {
      response = await prompts(questions[2]);
      lastLoggedTime = Date.now();
      processResponse(response);
    }
  } catch (erro) {
    console.error(erro);
  }
})();

/****
 * FUNCTIONS 
 */
function processResponse({ 'number-frequency': response}: any) {
  switch (response) {
    case 'halt':
      if (paused) {
        console.warn('Already paused!');
      } else {
        onPause();
      }
      
      break;
    case 'resume':
      if (!paused) {
        console.warn('Not paused. Timer is unaffected');
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
      if (isNaN(response)) {
        throw new Error('Invalid number!');
      }
      rememberNumber(response);

  }
}


function rememberNumber(newNumber: number): void {
  addOrUpdateEntry(newNumber);
  if (isFibonacci(newNumber)) {
    console.log('FIB');
  }
}

function isFibonacci(newNumber: number): boolean {
  return setOfFibonaccis.has(+newNumber);
}

function addOrUpdateEntry(newNumber: any): void {
  // Get number
  const foundNumber: NumberContainer | undefined = listOfNumbers.find(el => el.num === newNumber);
  if(!foundNumber) {
    listOfNumbers.push(<NumberContainer>{ num: newNumber, total: 1});
  } else {
    foundNumber.total++;
  }

}

function startEmittingNumbers(firstTimeFrequency: number, secondTimeFrequency: number): void {
  if (timedSubscription) {
    timedSubscription.unsubscribe();
  }
  timedSubscription = timer(firstTimeFrequency, secondTimeFrequency).subscribe((val: number) => emitNumbers());
}

function onPause() {
  paused = true;
  console.log('\ntimer halted');
  timeLogged = Date.now() - lastLoggedTime;

  if (timedSubscription) {
    timedSubscription.unsubscribe();
  }
}

function onResume() {
  paused = false;
  console.log('\ntimer resumed');
  lastLoggedTime = Date.now();

  // Set a one-time timeout for (frequencyInMilliseconds - timeLogged) + (lastLoggedTime)
  const timeDifference = (frequencyInMilliseconds - timeLogged);

  if (timeDifference > 0) {
    startEmittingNumbers(timeDifference, frequencyInMilliseconds);
  }
}

function emitNumbers() {
  if (listOfNumbers.length === 0) {
    return;
  }

  listOfNumbers.sort((el1, el2) => el2.total - el1.total);
  let msg: string = '';

  for(let i = 0; i < listOfNumbers.length; i++) {
    msg = `${msg}, ${listOfNumbers[i].num}:${listOfNumbers[i].total}`.replace(/^,\s/,'');
  }

  console.log(`\r${msg}`);
  timeLogged = Date.now();
}

/******
 * ASYNC FUNCTIONS
 */
async function calculateFibonaccisUpTo(nth: number): Promise<void> {
  const calculations = (resolve,reject) => {
    if(nth > 1000) {
      throw new Error('Cannot use numbers past 1000th fibonacci');
    }

    let prev = 1;
    let current = 2;
    let count = 1;
    let result = 0;
  
    setOfFibonaccis.add(0), setOfFibonaccis.add(1), setOfFibonaccis.add(2);
    
    while(count <= nth) {
      result = prev + current;
      prev = current;
      current = result;
      setOfFibonaccis.add(result);
      count++;
    }

    thousandthTerm = result;
    resolve();
  };

  return new Promise(calculations);
}

