# NFT PINNER SERVICE
Upload your NFT image and metadata to IPFS using RabbitMQ queue

#### Install lib dependencies:
```bash
yarn install
```

#### Building:
```bash
yarn build
```

#### Set env
```# Create your .env:
cp example.env .env
```
Then create an api key at https://nft.storage and edit your .env.local with your new **NFT_STORAGE_API_KEY**

#### Testing with mocha:
```bash
yarn test
```

#### Deploy to a container with RabbitMQ:
```bash
docker-compose up
```

#### Publishing to RabbitMQ (test):
Open a new terminal and publish a message to 
```bash
yarn test-publish
```

#### Customize your handler/callback

You can implement your own callbacks by editing the code in [/src/custom/handler.ts](https://github.com/anarkrypto/nft-pinner-service/blob/main/src/custom/handler.ts). This is useful if you want to save the result in a database, transmit in another queue, etc.

**onSuccess**: Function triggered after success. 
```
  {
    cid: "bafyreig6qjssgyu6va4jr3dwly2lnuag5asq4udflohobj4ok6vuwbvw5q",
    url: "ipfs://bafyreig6qjssgyu6va4jr3dwly2lnuag5asq4udflohobj4ok6vuwbvw5q/metadata.json",
    gateway: "https://bafyreig6qjssgyu6va4jr3dwly2lnuag5asq4udflohobj4ok6vuwbvw5q.ipfs.dweb.link/metadata.json"
   }
```

**onError**: Function triggered after the interruption due to some unknown error or after all attempts have failed.
 
