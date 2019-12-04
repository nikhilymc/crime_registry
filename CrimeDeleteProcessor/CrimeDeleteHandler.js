const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { TextDecoder } = require('text-encoding/lib/encoding');
const crypto = require('crypto');
const { InternalError } = require('sawtooth-sdk/processor/exceptions');

//function to display the errors
var _toInternalError = function (err) {
  console.log(" in error message block");
  var message = err.message ? err.message : err;
  throw new InternalError(message);
};

function hash(v) {
  return crypto.createHash('sha512').update(v).digest('hex');
}

const FAMILY_NAME = "CrimeRegistrydelete";
var decoder = new TextDecoder('utf8');

function deletedetails(context, adh, id) {
  const name = "CrimeRegistry";
  let address = hash(name).substr(0, 6) + hash(adh).substr(0, 32) + hash(id).substr(0, 32);
  context.addReceiptData(Buffer.from("Case deleted from aadhaar No :  " + adh, 'utf8'));
  return context.deleteState([address]);
}

class CrimeDeleteHandler extends TransactionHandler {
  constructor() {
    super(FAMILY_NAME, ["1.0"]);
  }
  apply(transactionProcessRequest, context) {
    try {
      let PayloadBytes = decoder.decode(transactionProcessRequest.payload);
      let Payload = PayloadBytes.toString().split(',');
      let action = Payload[0];
      if (action === "Delete-details") {
        return deletedetails(context, Payload[1], Payload[2])
      }
    }
    catch(err){
      _toInternalError(err);
     }
  }
}

module.exports = CrimeDeleteHandler;