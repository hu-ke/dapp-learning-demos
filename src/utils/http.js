import axios from "axios";

const baseUrl =  import.meta.env.VITE_API_BASE || 'http://127.0.0.1:7001'

export const createNFT = async(nft) => {
    let { data } = await axios.post(`${baseUrl}/createNFT`, nft)
    return data
}

export const deleteNFT = async(nft) => {
    let { data } = await axios.post(`${baseUrl}/deleteNFT`, nft)
    return data
}

export const updateNFTAccount = async(nftId, account) => {
    let { data } = await axios.post(`${baseUrl}/updateNFTAccount`, {
        nftId,
        account
    })
    return data
}

export const getMintedNFTs = async(uris) => {
    let { data } = await axios.post(`${baseUrl}/getMintedNFTs`, uris)
    return data
}

export const getMyNFTs = async(account) => {
    let { data } = await axios.get(`${baseUrl}/getMyNFTs?account=${account}`, )
    return data
}