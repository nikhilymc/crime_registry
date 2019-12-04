## Case Registry

This App is created in Blockchain network using Sawtooth SDK for link persons with criminal activities using aadhaar number, which includes updation and deletion of case details. Hyperledger Sawtooth supports to create a permissioned (private) network which allows Parallel Transaction Execution in a secure, immutable,and tracebile way, with permissioning enabled.

**Existing System:** Case details and their respective evidences play an important role in crime investigations, as it is used to link persons with criminal activities. Currently, case details process are managed entirely manually and its requirements are met by employing a physical handover of evidences and other related details where, at each step, documents are filled in and signed in front of officers. From the time of evidence collection until the time of their exploitation in a legal court, all the case details and evidences may be accessed by multiple parties involved in the investigation that take temporarily their ownership. Hence there occurs a number of chances of evidences get tampered. The existing system is not efficient and it is not secure way to deal with case filing process.

In this project we created an application for case registering and detail updation using Hyperledger Sawtooth which is an enterprise blockchain platform for building distributed ledger applications and networks. In Hyperledger Sawtooth we can specify the business rules appropriate for our application, using the language of our choice, without needing to know the underlying design of the core system. In our project we use JavaScript SDKs. 

**Distributed Ledger:** The blockchain database is shared among potentially untrusted participants (here in this project we have different stations) and is demonstrably identical on all nodes in the network. All participants have the same information. In our project the blockchain database is an unalterable history of all transactions that uses block hashes to make it easy to detect and prevent attempts to alter the history of cases.Case details are tamperproof, transparent,and tracebile

**Permissioning:** All changes are performed by transactions that are signed by known identities (permissioned stations).Each application defines the custom transaction processors for its unique requirements.Sawtooth is built to solve the challenges of permissioned (private) networks. Clusters of Sawtooth nodes can be easily deployed with separate permissioning. There is no centralized service that could potentially leak transaction patterns or other confidential information.The blockchain stores the settings that specify the permissions, such as roles and identities, so that all participants in the network can access this information(Decentralised).

**Parallel Transaction Execution:** Most blockchains require serial transaction execution in order to guarantee consistent ordering at each node on the network. Sawtooth includes an advanced parallel scheduler that splits transactions into parallel flows. Based on the locations in state which are accessed by a transaction,Sawtooth isolates the execution of transactions from one another while maintaining contextual changes. Parallel scheduling provides a substantial potential increase in performance over serial execution and increase the scalability.

**Event System:** Hyperledger Sawtooth supports creating and broadcasting events.This allows our application to Subscribe to events that occur related to the blockchain, here we have event when a new block being committed. Subscribe to application specific events defined by a transaction family(we have an event while updated details with status completed).Relay information about the execution of a transaction back to clients without storing that data in state.Subscriptions are submitted and serviced over a ZMQ Socket.

**Pluggable consensus algorithms:** In a blockchain, consensus is the process of building agreement among a group of mutually distrusting participants. Algorithms for achieving consensus with arbitrary faults generally require some form of voting among a known set of participants. In Sawtooth, the data model and transaction language are implemented in a transaction family. While we expect users to build custom transaction families that reflect the unique requirements of their ledgers. In this project we used only devmode default consensus algorithm


## Setting Up:

**Step 1:** Download the repostory using the command:  
```
git clone https://gitlab.com/davismathew/chd-b4-crimeregistry.git
 ```
**Step 2:** Use the following command to Run the app:Change your working directory to the same directory which is extracted now and see the docker file. (docker-compose.yaml). 

```
 cd crime-registry/
 sudo docker-compose up
 ```
**Step 3:** Open browser and you can see the app running in  http://localhost:3000/:  


**Permissions**

1: Log into the validator container by opening a new terminal window and running the following command.
```
sudo docker exec -it validator bash
```
2: In the validator container create three pairs of keys named Station1,Station2 and MainStation.
```
sawtooth keygen Station1
sawtooth keygen Station2
sawtooth keygen MainStation
```
3: Add your public key to the list of allowed keys,
```
sawset proposal create --key ~/.sawtooth/keys/my_key.priv sawtooth.identity.allowed_keys=$(cat ~/.sawtooth/keys/my_key.pub) --url http://rest-api:8008
```
check this setting use to following command
```
sawtooth settings list --url http://rest-api:8008 --format json
```
4:create a policy that permits all and is named policy_1:
```
sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY *" --url http://rest-api:8008
```
To view the policy enter the following command
```
sawtooth identity policy list --url http://rest-api:8008 --format json
```
5: sets the role for transactor to the policy that permits all
```
sawtooth identity role create --key ~/.sawtooth/keys/my_key.priv transactor policy_1 --url http://rest-api:8008
```
view the role
```
sawtooth identity role list --url http://rest-api:8008 --format json
 ```
6: obtain your public key using the following command.
```
cat ~/.sawtooth/keys/my_key.pub
```
7: Give permission by editing the following command replace the key after PERMIT_KEY with the public key obtained in step 10
```
sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY 03404e1199bcee807d14c8115e338905c8d0fb0d253987b3a555648dcd66ef5e3a" --url http://rest-api:8008
```
8: obtain the public key of Stations
```
cat ~/.sawtooth/keys/Station1.pub
cat ~/.sawtooth/keys/Station2.pub
cat ~/.sawtooth/keys/MainStation.pub
```
9: Give permission to Stations by editing the policy command replace the key after PERMIT_KEY with the public key obtained in step 12
```
sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_1 "PERMIT_KEY 03404e1199bcee807d14c8115e338905c8d0fb0d253987b3a555648dcd66ef5e3a" "PERMIT_KEY 033827395ef3be5a0875278325fe181cba7a2bfed6548bff1ca344ad339886e99d" "PERMIT_KEY 028cf6c2dd6e49ca7cf752300c9868a13617559bc6e39a0686e00f1bb0a3bd1a4e" "PERMIT_KEY 038dee0ba5aec31cfc004826c1a74022fcdc22650f6c15a6c99515bed726601987" --url http://rest-api:8008
```
Check  policy
```
sawtooth identity policy list --url http://rest-api:8008 --format json
```
10:create a new policy, Policy_2 with the key of Main Station
```
sawtooth identity policy create --key ~/.sawtooth/keys/my_key.priv policy_2 "PERMIT_KEY 03404e1199bcee807d14c8115e338905c8d0fb0d253987b3a555648dcd66ef5e3a" "PERMIT_KEY 038dee0ba5aec31cfc004826c1a74022fcdc22650f6c15a6c99515bed726601987" --url http://rest-api:8008
```
11:Aassign policy to CrimeDelete transaction processor
```
sawtooth identity role create --key ~/.sawtooth/keys/my_key.priv transactor.transaction_signer.CrimeRegistrydelete policy_2 --url http://rest-api:8008
```

12: Then display the keys using,
```
cat ~/.sawtooth/keys/Station1.priv
cat ~/.sawtooth/keys/Station2.priv
cat ~/.sawtooth/keys/MainStation.priv
```
**Step 4:** Open browser and you can see the app running in  http://localhost:3000/:

**Step 5:** Obtain the transaction ID using the CLI command: 
```
sudo docker exec -it validator bash
sawtooth transaction list --url http://rest-api:8008
```
END

To view reciept in browser

http://localhost:8008/receipts?id=TRANSACTION-ID 