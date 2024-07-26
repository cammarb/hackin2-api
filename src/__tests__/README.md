# Tests Manual

This is the instruction manual to test the API by the following criterias.

## Unit

```bash
npm run test:unit
```

This runs unit tests only. This does not require a testcontainer setup or a test enviroment variables.

## E2E

```bash
npm run docker:up -f src/__tests__/testcontainers/compose.yml
npm run testseed
npm run test:e2e
```

This creates PostgreSQL and Redis containers from the compose file, and then migrates the prisma schema to the database. A seed test file runs before running the tests with the test enviroment variables.

## All tests

To run all tests available in one run just run the script below:

```bash
./testenviroment_starter.sh
```
