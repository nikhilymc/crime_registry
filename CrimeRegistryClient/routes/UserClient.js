const { createHash } = require('crypto');
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing');
const protobuf = require('sawtooth-sdk/protobuf');
const fetch = require('node-fetch');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1');
const { TextEncoder } = require('text-encoding/lib/encoding');

const FAMILY_VERSION = "1.0";
var encoder = new TextEncoder('utf8');

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

//Function to create transaction
function createTransaction(signer, payload, address, publicKey, FAMILY_NAME) {
    const payloadBytes = encoder.encode(payload)
    // create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: FAMILY_NAME,
        familyVersion: FAMILY_VERSION,
        inputs: [address],
        outputs: [address],
        signerPublicKey: publicKey,
        nonce: "" + Math.random(),
        batcherPublicKey: publicKey,
        dependencies: [],
        payloadSha512: hash(payloadBytes)
    }).finish();

    //create transaction
    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signer.sign(transactionHeaderBytes),//Once the TransactionHeader is constructed, its bytes are then used to create a signature. Resulting signature is stored in the header signature which also act as an Id of the transaction.
        payload: payloadBytes
    });

    // create transactions
    const transactions = [transaction];

    // create batch header
    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: publicKey,
        transactionIds: transactions.map((txn) => txn.headerSignature),//the list of Transaction IDs, in the same order they are listed in the Batch.
    }).finish();

    //create batch
    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signer.sign(batchHeaderBytes),//use same signer
        transactions: transactions,
    });

    //create batch list
    const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
    }).finish();
    sendTransaction(batchListBytes);
}

class UserClient {
    //function to add or update state details
    async adddetails(action, key, adh, nam, id, typ, dist, ps, st) {
        try {
            let FAMILY_NAME = "CrimeRegistry";
            const context = createContext('secp256k1');
            const secp256k1pk = Secp256k1PrivateKey.fromHex(key);
            let signer = new CryptoFactory(context).newSigner(secp256k1pk);
            let address = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32) + hash(id).substr(0, 32);
            let publicKey = signer.getPublicKey().asHex();
            let payload = [action, adh, nam, id, typ, dist, ps, st].join(',')
            createTransaction(signer, payload, address, publicKey, FAMILY_NAME);
        }
        catch (error) {
            console.error(error);
        }
    }

    //Function to delete state details
    async deletedetails(action, key, adh, id) {
        try {
            let FAMILY_NAME = "CrimeRegistry";
            const context = createContext('secp256k1');
            const secp256k1pk = Secp256k1PrivateKey.fromHex(key);
            let signer = new CryptoFactory(context).newSigner(secp256k1pk);
            let address = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32) + hash(id).substr(0, 32);
            let publicKey = signer.getPublicKey().asHex();
            let payload = [action, adh, id].join(',')
            let familyName = "CrimeRegistrydelete";
            createTransaction(signer, payload, address, publicKey, familyName);
        }
        catch (error) {
            console.error(error);
        }
    }

    //function to get data from states starting with assetAddress
    async getDetails(adh) {
        let FAMILY_NAME = "CrimeRegistry";
        let stateRequest = 'http://rest-api:8008/state?address=';
        let assetAddress = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32);
        stateRequest += assetAddress;
        let stateResponse = await fetch(stateRequest);
        let stateJSON = await stateResponse.json();
        return stateJSON;
    }

    //Function to get specific state data
    async getCaseDetails(adh, case_id) {
        let FAMILY_NAME = "CrimeRegistry";
        let stateRequest = 'http://rest-api:8008/state/';
        let assetAddress = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32) + hash(case_id).substr(0, 32);
        stateRequest += assetAddress;
        try {
            let stateResponse = await fetch(stateRequest);
            let stateJSON = await stateResponse.json();
            var data = stateJSON.data;
            var newdata = new Buffer(data, 'base64').toString();
            return newdata;
        } catch (error) {
            console.error(error);
        }
    }
    //Function to view Transaction receipt
    async getreceipt(rec) {
        let receiptRequest = 'http://rest-api:8008/receipts?id=' + rec;
        let receiptResponse = await fetch(receiptRequest);
        let receiptJSON = await receiptResponse.json();
        var data = receiptJSON.data;
        return data;
    }
}

//Function to submit the batchListBytes to the validator
async function sendTransaction(batchListBytes) {

    let resp = await fetch('http://rest-api:8008/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: batchListBytes
    })
}
module.exports.UserClient = UserClient;