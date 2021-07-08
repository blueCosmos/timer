import { NumbersProcessor } from './numbers-processor';
import { UserInterface } from '../ui/user-interface';

const mockFibonacciProcessor = require('./fibonacci-processor');
const mockUi = require('../ui/user-interface');

jest.mock('./fibonacci-processor', () => ({
  isFibonacci: jest.fn()
}));

jest.mock('../ui/user-interface', () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('NumbersProcessor', () => {
  let spyObj;
  let cut;
  
  beforeEach(() => {
    cut = new NumbersProcessor(mockFibonacciProcessor, mockUi);
  });

  describe('processNumber()', () => {
    beforeEach(() => {
      spyObj = jest.spyOn(cut,'addOrUpdateEntry');
      cut.processNumber(55);
    });

    it('should call addOrUpdateEntry() with its arg', () => {
      expect(spyObj).toHaveBeenCalledWith(55);
    });

    it('should test whether the argument is a fibonacci', () => {
      expect(mockFibonacciProcessor.isFibonacci).toHaveBeenCalledWith(55);
    });

  });

  describe('getNumbersInDescendingTotalOrder()', () => {
    beforeEach(() => {
      cut.listOfNumbers = [
        {
          num: 55,
          total: 4
        },
        {
          num: 80,
          total: 100
        },
        {
          num: 1000,
          total: 3
        }
      ];
    });

    it('should get back a string with the correct ordering of numbers', () => {
      const msg = cut.getNumbersInDescendingTotalOrder();

      expect(msg).toEqual('80:100, 55:4, 1000:3');
    });

  });

  describe('emitNumbers()', () => {
    beforeEach(() => {
      spyObj = jest.spyOn(cut, 'getNumbersInDescendingTotalOrder');
    });

    describe('when there are numbers in the listOfNumbers', () => {
      beforeEach(() => {
        cut.listOfNumbers = [
          {
            num: 55,
            total: 4
          },
          {
            num: 80,
            total: 100
          },
          {
            num: 1000,
            total: 3
          }
        ]
        cut.emitNumbers();
      });
      
      it('should call getNumbersInDescendingTotalOrder()', () => {
        expect(spyObj).toHaveBeenCalled();
      });
    });

    describe('when there are no numbers in the listOfNumbers', () => {
      beforeEach(() => {
        cut.emitNumbers();
      });
      
      it('should not call getNumbersInDescendingTotalOrder()', () => {
        expect(spyObj).not.toHaveBeenCalled();
      });
    });



  });

  describe('addOrUpdateEntry()', () => {
    beforeEach(() => {
      cut.listOfNumbers = [
        {
          num: 55,
          total: 4
        },
        {
          num: 80,
          total: 100
        },
        {
          num: 1000,
          total: 3
        }
      ];
    });

    describe('when calling with a number that already exists', () => {
      beforeEach(() => {
        cut.addOrUpdateEntry(1000);
      });

      it('should increment the total', () => {

        expect(cut.listOfNumbers[2].total).toBe(4);
      });

    });

    describe('when calling with a number that does not yet exist', () => {
      beforeEach(() => {
        cut.addOrUpdateEntry(300);
      });
     
      it('should create a new entry with 1 as the total', () => {
        expect(cut.listOfNumbers[3].num).toBe(300);
        expect(cut.listOfNumbers[3].total).toBe(1);
      });

    });
  });

});