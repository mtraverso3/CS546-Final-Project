# Unit Tests

## Overview

This folder contains test files for the project.

The test files are organized to mirror the structure of the project files. 
For example, the test file for the project file `src/main.c` would be located at `test/main.c`.

The tests are written using the Jest testing framework. 
To run the tests, execute the following command:

```bash
npm test
```

This will run all the tests in the project. 
To run a specific test or test file, execute the following command:

```bash
npm test <path-to-test-file>
#or
npm test -- -t <test-name>
```

## Design 
The tests are written using `jest` and `jest-mongodb`. 
They inject a mock database connection into the application and test the application's behavior with the mock database. 

The tests are organized into test suites that correspond to the different parts of the application. 
Each test suite contains tests for the different functions in that part of the application.

### Resources
The resources used to write this are: 
- [Jest](https://jestjs.io/docs/getting-started)
- [Jest MongoDB](https://jestjs.io/docs/mongodb)
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)