import PubNub from 'pubnub';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

class PubNubService {
  constructor() {
    this.pubnub = new PubNub({
      publishKey: process.env.PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
      secretKey: process.env.PUBNUB_SECRET_KEY,
      uuid: process.env.PUBNUB_UUID,
    });

    this.pubnub.addListener({
      message: this.handleMessage.bind(this),
    });
  }

  subscribeToChannel(channel) {
    this.pubnub.subscribe({ channels: [channel] });
  }

  publishToChannel(channel, message) {
    this.pubnub.publish({ channel, message }, (status, response) => {
      if (status.error) {
        console.log('Publish error: ', status);
      } else {
        console.log('Message Published with timetoken', response.timetoken);
      }
    });
  }

  handleMessage({ channel, message }) {
    console.log(`Message received on channel ${channel}:`, message);
    // Handle the received message
  }
}

export default new PubNubService();
