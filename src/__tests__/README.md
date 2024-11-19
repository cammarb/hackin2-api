# Tests Manual

This is the instruction manual to test the API by the following criterias.

## Unit

This runs unit tests only.

```bash
npm run test:unit
```

## Integration

This creates PostgreSQL and Redis testcontainers, and then migrates the prisma schema to the database. A seed test file runs before running the tests with the test enviroment variables.

```bash
npm run test:integration
```

## All tests

To run all tests available in one run:

```bash
npm test
```
