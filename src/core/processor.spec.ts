// const Processor = require('./processor');
// const NumbersProcessor = require('./numbers-processor');
import { Processor } from './processor';
const mockNumbersProcessor = require('./numbers-processor');

jest.mock('./numbers-processor', () => {
  emitNumbers: jest.fn()
});

let cliProcessor;

describe('Processor', () => {
  beforeEach(() => {
    cliProcessor = new Processor(mockNumbersProcessor);
  });

  describe('onResume()', () => {
    beforeEach(() => {
      cliProcessor.onPause();
    });

    it('should pause execution', () => {
      expect(cliProcessor.paused).toBeTruthy();
      cliProcessor.onResume();
      expect(cliProcessor.paused).toBeFalsy();
    });

    it('should call emit numbers on numbers processor', async () => {
      setTimeout(() => {
        expect(mockNumbersProcessor.emitNumbers).toHaveBeenCalled();
      },1000);
    })

  });

});

