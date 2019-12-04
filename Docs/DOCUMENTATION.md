## code flow/ code structure

**UserClient**

There are 5 async functions in the class Userclient: adddetails, deletedetails, getDetails, getCaseDetails and getreceipt

adddetails is an important function defined in the class that accepts the values that are passed from the index.js and from the aadhaar number and the case id that is passed from the index an address is generated and the data is stored to a payload and passed to createTranscation function with arguments signer,payload,address,publicKey,FAMILY_NAME are passed(in our case input address and output address are the same).

In deletedetails function we need two parameters, aadhaar number and the case id to create an address. The function actually does is delete data from the state for that the user have to submit a transaction to the validator to delete data. Here also the address and key and other values are passed to createTransaction.

getCaseDetails is the other function inside the class that takes address and returns the data from the state from entry point http://rest-api:8008/state/address' to the function which it is called from in json format.

getDetails is the other async function that is used to get case details to anyone with aadhaar number. The function used the data to generate address of the stored data location and that address is passed to the getState function from entry point 'http://rest-api:8008/state?address=address' and then return the result back to the same.

getreceipt is the other async function that is used to get transaction reciept details with transaction id from entry point http://rest-api:8008/receipts?id=transactionid.

createTransaction is a function outside the class which initialises a transaction and with the variables that are send to the function. It the creates a transaction, creates transactionheaderbytes, create transaction, makes transaction to lists, then these list are grouped to batches, batches are grouped to batchlists. And then the data is send to the validator using the rest-api using sendTransaction function at entry point 'http://rest-api:8008/batches'.

**CrimeRegistryTP**

Class CrimeRegistryHandler that is extendeds transaction handler in the class there is a constructor with super, when the instance of the class is created the super is called that is a sawtooth sdk function. And the family name version and namespace are stored. The data from the processor.js is given to the apply method in the patient class here the data is decode back to the normal form and then checks form the action value. If it is "Add-details" then the adddetails function is called if it is "Update-details" the other Update-details function in the processor is called.

adddetails is the other function in the CrimeRegistryHandler which accepts the data,generate address and the crimedetails are stored as a list and these values are passed to the WriteTostore function.

Update-details is the other function in the CrimeRegistryHandler which accepts the data,generate address and the crimedetails are stored as a list and these values are passed to the WriteTostore function to update state details.

WriteTostore is the function used to write data to state using context.setState() 

**CrimeDeleteTP**

Class CrimeDeleteHandler that is extendeds transaction handler in the class there is a constructor with super, when the instance of the class is created the super is called that is a sawtooth sdk function. The data from the processor.js is given to the apply method in the patient class here the data is decode back to the normal form and then checks form the action value. If it is "Delete-details" then the adddetails function is called

Delete-details function accepts the values and creates an address with aadhaar number and case id and then using context.deleteState([address]) the data in the state is deleted.