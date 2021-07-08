import { Processor } from './processor';

const mockNumbersProcessor = require('./numbers-processor');

jest.mock('./numbers-processor', () => ({
  emitNumbers: jest.fn(),
  processNumber: jest.fn()
}));

let cliProcessor;

describe('Processor', () => {
  beforeEach(() => {
    cliProcessor = new Processor(mockNumbersProcessor, 1);
  });

  describe('onResume()', () => {
    let spyObj;

    describe('when numbers have been emitted before', () => {
      beforeEach(() => {
        cliProcessor._timeElapsedSinceLastEmit = 500;
        spyObj = jest.spyOn(cliProcessor, 'emitNumbers');
        cliProcessor.onResume();
      });
  
      it('should set pause to false', () => {
        expect(cliProcessor.paused).toBeFalsy();
      })
  
      it('should call emitNumbers', () => {
        setTimeout(() => {
          expect(mockNumbersProcessor.emitNumbers).toHaveBeenCalled();
        },1000);
      });
      
      it('should call the emitNumbers() with the timeElapsedSinceLastEmit in the first time and frequencyInMilliseconds the second time', () => {
        const timeIntervalDifference = cliProcessor.frequencyInMilliseconds - cliProcessor.timeElapsedSinceLastEmit;
        expect(spyObj).toHaveBeenCalledWith(timeIntervalDifference, cliProcessor.frequencyInMilliseconds);
      })
    });

  });

  describe('onPause()', () => {
    let spyObj;
    beforeEach(() => {
      cliProcessor.onPause();
    });

    it('should set paused to true', () => {
      expect(cliProcessor.paused).toBeTruthy();
    });

    describe('when the processor has never emitted numbers', () => {
      beforeEach(() => {
        cliProcessor.onPause();
      });

      it('should have timeElapsedSinceLastEmit as 0', () => {
        expect(cliProcessor.timeElapsedSinceLastEmit).toBe(0);
      });

      it('should unsubscribe the timer subscription if one exists', () => {
        expect(cliProcessor.timerSubscriptionExists).toBeFalsy;
      });
    });

    describe('when the processor has last emitted numbers', () => {
      beforeEach(async () => {
        cliProcessor._timeElapsedSinceLastEmit = 500;
        cliProcessor.onPause();
      });

      it('should record the timeElapsedSinceLastEmit to be the the difference between the pause and the last time emitNumbers was called', () => {
        // Taking into account processing time
        const isAround = Math.abs(cliProcessor.timeElapsedSinceLastEmit - 500) <= 100;
        expect(isAround).toBeTruthy();
      })

    })
  });

  describe('processResponse', () => {
    let spyObj;
    describe('when called with "halt"', () => {
      beforeEach(() => {
        spyObj = jest.spyOn(cliProcessor, 'onPause');
        cliProcessor.processResponse('halt');
      });

      it('should call onPause()', () => {
        expect(spyObj).toHaveBeenCalled();
      });

      it('should not call onPause again if already paused', () => {
        cliProcessor.processResponse('halt');
        expect(spyObj).toHaveBeenCalledTimes(1);
      });

    });

    describe('when called with "resume"', () => {
      beforeEach(() => {
        spyObj = jest.spyOn(cliProcessor, 'onResume');
        cliProcessor._paused = true;
        cliProcessor.processResponse('resume');
      });      

      it('should call onResume if paused()', () => {
        expect(spyObj).toHaveBeenCalled();
      })

      it('should not call onResume if unpaused', () => {
        cliProcessor._paused = false;
        cliProcessor.processResponse('resume');
        expect(spyObj).toHaveBeenCalledTimes(1);
      });
    });

    describe('when called with quit', () => {
      beforeEach(() => {
        cliProcessor.processResponse('quit');
      })

      it('should unsubscribe any subscriptions', () => {
        expect(cliProcessor.timerSubscriptionExists).toBeFalsy();
      });
    });

    describe('when called with any number', () => {
      const numbers = [53, '45', '2', 9];    

      test.each(numbers)(
        'given %s, the NumbersProcess.processNumber() method should have been called',
        (arg) => {
          cliProcessor.processResponse(arg);
          expect(mockNumbersProcessor.processNumber).toHaveBeenCalledWith(+arg);
        });

    });

  });

});

