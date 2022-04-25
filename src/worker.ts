import useNftStorage from "./services/nft-storage";
import useInfura from "./services/infura";
import amqplib from 'amqplib';
import { AMQP_URL } from './config';
import { onError, onSuccess } from "./custom/handler";
const QUEUE = 'nft.store';
const RETRY_DELAY = [1000, 5000, 15000]

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

async function retry(promiseFactory: any, retryCount: number) {
    try {
        const delay = RETRY_DELAY[RETRY_DELAY.length - retryCount]
        console.info(`Retrying in ${delay / 1000} seconds...`)
        await sleep(delay)
        return await promiseFactory();
    } catch (err) {
        console.error("Error: ", err)
        if (retryCount <= 1) {
            throw err;
        }
        return await retry(promiseFactory, retryCount - 1);
    }
}

export default function storeNFT(imageUrl: string, name: string, description: string): Promise<any> {
    return new Promise((resolve, reject) => {
        useNftStorage(imageUrl, name, description)
            .then(resolve)
            .catch((err: any) => {
                console.error("Error: ", err)
                retry(() =>
                    Promise.any([
                        useNftStorage(imageUrl, name, description)
                            .catch((err) => {
                                console.error("ERROR [useInfurauseNftStorage]", err)
                                throw (err)
                            }),
                        useInfura(imageUrl, name, description)
                            .catch((err) => {
                                console.error("ERROR [useInfura]", err)
                                throw (err)
                            }),
                    ])
                    , RETRY_DELAY.length)
                    .then(resolve)
                    .catch(reject)
            })
    })
}

async function processMessage(msg) {
    console.log('processing message...');
    try {
        const { id, imageUrl, name, description} = JSON.parse(msg.content.toString())
        const { cid, url, gateway } = await storeNFT(imageUrl, name, description)
        onSuccess({ cid, url, gateway })
    } catch (err) {
        onError(err)
        throw (err)
    }
}

(async () => {
    const connection = await amqplib.connect(AMQP_URL, "heartbeat=60");
    const channel = await connection.createChannel();
    channel.prefetch(10);
    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(QUEUE, { durable: true });
    await channel.consume(QUEUE, async (msg) => {
        try {
            await processMessage(msg)
            await channel.ack(msg);
        } catch (err) {
            await channel.nack(msg);
        }
    },
        {
            noAck: false,
            consumerTag: 'nft_store_consumer'
        });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();
