const { TransactionProcessor } = require('sawtooth-sdk/processor');
const CrimeDeleteHandler = require('./CrimeDeleteHandler');

const address = 'tcp://validator:4004';

const transactionProcesssor = new TransactionProcessor(address);

transactionProcesssor.addHandler(new CrimeDeleteHandler());

transactionProcesssor.start();