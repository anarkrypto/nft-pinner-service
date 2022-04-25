import amqplib from 'amqplib';
import { AMQP_URL } from '../src/config';
const exchange = 'nft.store';
const queue = 'nft.store';
const routingKey = 'nft_store';

(async () => {
  const connection = await amqplib.connect(AMQP_URL, 'heartbeat=60');
  const channel = await connection.createChannel();
  try {

    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

    const id = Math.floor(Math.random() * 10000000)
    const imageUrl = "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
    const name = "Storing NFT metadata"
    const description = "The metaverse is here. Where is it all being stored?"

    console.log("Publishing task...")
    const task = { id, imageUrl, name, description };
    await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(task)));

    console.log('Message published');
  } catch (e) {
    console.error('Error in publishing message', e);
  } finally {
    console.info('Closing channel and connection if available');
    await channel.close();
    await connection.close();
    console.info('Channel and connection closed');
  }
  process.exit(0);
})();
