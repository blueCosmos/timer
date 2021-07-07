# Timer

## Description

This is a CLI application that does the following:

1. On start up, the program will ask you for the frequency in which the screen will display a set of numbers.
2. After this, you will be invited to enter numbers which the program will remember and display at the frequency entered in step 1.
3. If the number entered is a fibonacci number, the program will tell you 'FIB'.

If at any time, you enter one of the commands in the section below instead of a number, the command will be executed instead.

## Commands

The commands are case-sensitive.

`halt`: Pause the display of numbers.
`resume`: Resume the display of numbers.
`quit`: To exit the program.

## Installation and Running

To install, do `yarn install`.

To run, `yarn start`.

## Running as a Docker

To build the Docker image, do `docker build . -t timer:latest`.

To run the Docker image, do `docker run -it -p 30000:8080 timer:latest`.

## Testing

To test, do `yarn test`.  If you want to test in watch mode, do `yarn test:watch`.

## Development

To develop, run `yarn dev`.

