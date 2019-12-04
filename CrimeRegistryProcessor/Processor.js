const { TransactionProcessor } = require('sawtooth-sdk/processor');
const CrimeRegistryHandler = require('./CrimeRegistryHandler');

const address = 'tcp://validator:4004';

const transactionProcesssor = new TransactionProcessor(address);

transactionProcesssor.addHandler(new CrimeRegistryHandler());

transactionProcesssor.start();