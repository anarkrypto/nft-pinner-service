import { create, urlSource } from 'ipfs-http-client'

export default async function useInfura(imageUrl: string, name: string, description: string) {
    return new Promise(async (resolve, reject) => {
        try {
            // connect to infura IPFS API
            const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

            const source = await urlSource(imageUrl)

            const { cid: imageCid } = await client.add(source)

            const metadata = {
                image: imageCid.toV1().toString(),
                name,
                description
            }

            // call Core API methods
            const { cid: metadataCid } = await client.add(Buffer.from(JSON.stringify(metadata)))

            const cidV1 = metadataCid.toV1().toString()

            // Resolve CID and infura gateway uri
            resolve({ cid: cidV1, url: `ipfs://${cidV1}`, gateway:`https://${cidV1}.ipfs.infura-ipfs.io` })
        } catch (err) {
            if (typeof(err) === 'object' && 'message' in err) return reject(err.message)
            reject(err)
        }
    })
}