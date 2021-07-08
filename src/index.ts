const prompts = require('prompts');

import { Processor } from './core/processors/processor';
import { NumbersProcessor } from './core/processors/numbers-processor';
import { FibonacciProcessor } from './core/processors/fibonacci-processor';

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

(async () => {
  const fibonacciProcessor = new FibonacciProcessor(1000);
  const numbersProcessor = new NumbersProcessor(fibonacciProcessor);
  const processor = new Processor(numbersProcessor);

  try {
    let response = await prompts(questions[0]);
    const { 'number-frequency': frequencyInSeconds } = response;

    if(!isNaN(frequencyInSeconds)) {
      processor.frequencyToRefreshInSeconds = frequencyInSeconds;
      processor.startEmittingNumbers();
      response = await prompts(questions[1]);
      processor.processResponse(frequencyInSeconds);
    }
  
    // Loop numbers
    while (response['number-frequency'] !== 'quit') {
      response = await prompts(questions[2]);
      processor.processResponse(response['number-frequency']);
    }
  } catch (erro) {
    console.error(erro);
  }

})();


