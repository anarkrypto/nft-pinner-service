import { NFTStorage, File } from 'nft.storage'
import fetch from 'node-fetch'
import { NFT_STORAGE_API_KEY } from "../config"

const formatFileName = (fileName: string) => fileName.replaceAll(' ', '-').toLowerCase()

// For example's sake, we'll fetch an image from an HTTP URL.
async function getImage(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then(response => {
        if (!response.ok) return reject(response.statusText)
        return response.arrayBuffer().then(arrayBuffer => {
          const type = response.headers.get("Content-Type")
          resolve({ arrayBuffer, type })
        })
      })
      .catch(reject)
  })
}

export default function useNftStorage(imageUrl: string, name: string, description: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const { arrayBuffer, type }: any = await getImage(imageUrl)

      // Mount image file
      const imageType = type.split('/').pop()
      const fileName = imageType ? `${name}.${imageType}` : name
      const imageFile = new File([arrayBuffer], formatFileName(fileName), { type })

      const nft: any = {
        image: imageFile, // use image Blob as `image` field
        name,
        description,
      }

      const client = new NFTStorage({ token: NFT_STORAGE_API_KEY })
      const { ipnft, url } = await client.store(nft)

      resolve({ cid: ipnft, url, gateway: `https://${ipnft}.ipfs.dweb.link/metadata.json` })

    } catch (err) {
      if (typeof (err) === 'object' && 'message' in err) return reject(err.message)
      reject(err)
    }
  })
}