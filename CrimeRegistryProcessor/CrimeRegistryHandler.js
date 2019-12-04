const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding');
const crypto = require('crypto');
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions');

//function to display the errors
var _toInternalError = function (err) {
  console.log(" in error message block");
  var message = err.message ? err.message : err;
  throw new InternalError(message);
};

function hash(v) {
  return crypto.createHash('sha512').update(v).digest('hex');
}

const FAMILY_NAME = "CrimeRegistry";
const NAMESPACE = hash(FAMILY_NAME).substring(0, 6);

var encoder = new TextEncoder('utf8');
var decoder = new TextDecoder('utf8');

function writeToStore(context, address, msg) {
  let msgBytes = encoder.encode(msg);
  let entries = {};
  entries[address] = msgBytes;
  context.setState(entries);
}

function adddetails(context, adh, nam, id, typ, dist, ps, ts) {
  let address = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32) + hash(id).substr(0, 32);
  let msg = [adh, nam, id, typ, dist, ps, ts]
  return context.getState([address]).then(function (data) {
    if (data[address] == null || data[address] == "" || data[address] == []) {
      return writeToStore(context, address, msg);
    } else {
      throw new InvalidTransaction("Case details already exists!");
    }
  })
}

function updatedetails(context, adh, nam, id, typ, dist, ps, ts) {
  let address = hash(FAMILY_NAME).substr(0, 6) + hash(adh).substr(0, 32) + hash(id).substr(0, 32);
  let msg = [adh, nam, id, typ, dist, ps, ts]
  return context.getState([address]).then(function (data) {
    if (data[address] != null && data[address] != "" && data[address] != []) {
      let msg_status = msg[6];
      let msgB = encoder.encode(msg);
      attribute = [['message_status',msg_status.toString()]]
      context.addEvent('CrimeRegistry/UpdateEvent',attribute,msgB)
      return writeToStore(context, address, msg);
    } else {
      throw new InvalidTransaction("Case details not exists!");
    }
  })
}

class CrimeRegistryHandler extends TransactionHandler {
  constructor() {
    super(FAMILY_NAME, ["1.0"], [NAMESPACE]);
  }
  apply(transactionProcessRequest, context) {
    try {
      let PayloadBytes = decoder.decode(transactionProcessRequest.payload);
      let Payload = PayloadBytes.toString().split(',');
      let action = Payload[0];
      if (action === "Add-details") {
        return adddetails(context, Payload[1], Payload[2], Payload[3], Payload[4], Payload[5], Payload[6], Payload[7])
      }
      if (action === "Update-details") {
        return updatedetails(context, Payload[1], Payload[2], Payload[3], Payload[4], Payload[5], Payload[6], Payload[7])
      }
    }
    catch(err){
      _toInternalError(err);
     }
  }
}

module.exports = CrimeRegistryHandler;