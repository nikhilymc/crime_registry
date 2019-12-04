const { Stream } = require('sawtooth-sdk/messaging/stream');
const {
        Message,
        EventFilter,
        EventList,
        EventSubscription,
        ClientEventsSubscribeRequest,
        ClientEventsSubscribeResponse
} = require('sawtooth-sdk/protobuf');

const VALIDATOR_URL = "tcp://validator:4004"

// returns the subscription request status 
function checkStatus(response) {
        let msg = ""
        if (response.status === 0) {
                msg = 'subscription : OK'
        } else if (response.status === 1) {
                msg = 'subscription : GOOD '
        } else {
                msg = 'subscription failed !'
        }
        return msg
}

//event message handler 
function getEventsMessage(message) {
        let eventlist = EventList.decode(message.content).events
        eventlist.map(function (event) {
                if (event.eventType == 'sawtooth/block-commit') {
                        console.log("Block commit Event:", event);
                }
                else if (event.eventType == 'CrimeRegistry/UpdateEvent') {
                        console.log("Status Complete Event:", event);
                }
        })
}

function EventSubscribe(URL) {
        let stream = new Stream(URL);
        const blockCommitSubscription = EventSubscription.create({
                eventType: 'sawtooth/block-commit'
        })
        const UpdateSubscription = EventSubscription.create({
                eventType: 'CrimeRegistry/UpdateEvent',
                filters: [EventFilter.create({
                        key: 'message_status',
                        matchString: 'completed',
                        filterType: EventFilter.FilterType.SIMPLE_ANY
                })]
        })
        const subscription_request = ClientEventsSubscribeRequest.encode({
                subscriptions: [blockCommitSubscription, UpdateSubscription]
        }).finish()
        stream.connect(() => {
                stream.send(Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST, subscription_request)
                        .then(function (response) {
                                return ClientEventsSubscribeResponse.decode(response)
                        })
                        .then(function (decoded_Response) {
                                console.log(checkStatus(decoded_Response))
                        })
                //stream.onReceive(getEventsMessage)
        })
}

EventSubscribe(VALIDATOR_URL);