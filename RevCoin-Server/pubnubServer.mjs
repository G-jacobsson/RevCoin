import PubNub from 'pubnub';
import dotenv from 'dotenv';
import { blockchain } from './server.mjs';

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
    const messageString = JSON.stringify(message);
    this.pubnub.publish(
      { channel, message: messageString },
      (status, response) => {
        if (status.error) {
          console.log('Publish error: ', status);
        } else {
          console.log('Message Published with timetoken', response.timetoken);
        }
      }
    );
  }

  async handleMessage({ channel, message }) {
    console.log(`Message received on channel ${channel}:`, message);

    try {
      const newBlock = JSON.parse(message);
      console.log('Parsed new block:', newBlock);

      if (blockchain.chain.length < newBlock.index) {
        blockchain.chain.push(newBlock);
        console.log('Blockchain updated with new block:', newBlock);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
}

export default new PubNubService();
