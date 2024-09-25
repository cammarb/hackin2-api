# Tests Manual

This is the instruction manual to test the API by the following criterias.

## Unit

This runs unit tests only. This does not require a testcontainer setup or a test enviroment variables.

```bash
npm run test:unit
```

## E2E

This creates PostgreSQL and Redis containers from the compose file, and then migrates the prisma schema to the database. A seed test file runs before running the tests with the test enviroment variables.

```bash
./integration-starter.sh
npm run test:e2e
```

## All tests

To run all tests available in one run:

```bash
npm test
```
