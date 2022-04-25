import { expect } from 'chai';
import useNftStorage from '../src/services/nft-storage';
import useInfura from '../src/services/infura';
import storeNFT from '../src/worker';

// Default NFT data
const imageUrl = "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
const name = "Storing NFT metadata"
const description = "The metaverse is here. Where is it all being stored?"

describe('** Store NFT metadata with NFT.storage', () => {

  it('should return CID hash', async () => {
    const { cid, url, gateway }: any = await useNftStorage(imageUrl, name, description);
    expect(cid).to.be.an('string');
    expect(url).to.be.an('string');
    expect(gateway).to.be.an('string');
    console.log('NFT metadata stored! ', { cid, url, gateway })
  });

});

describe('** Store NFT metadata with Infura', () => {

  it('should return CID hash', async () => {
    const { cid, url, gateway }: any = await useInfura(imageUrl, name, description);
    expect(cid).to.be.an('string');
    expect(url).to.be.an('string');
    expect(gateway).to.be.an('string');
    console.log('NFT metadata stored with Infura!', { cid, url, gateway })
  });

});

// describe('** storeNFT with retry', () => {
//   it('should return retry 3 times before exit', async () => {
//     const result = await storeNFT("https://example-fake-url.com/invalid/image.jpg", name, description)
//     console.info(result)
//   })
// })
