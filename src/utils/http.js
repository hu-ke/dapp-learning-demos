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

export const getTrendingNFTs = async() => {
    let { data } = await axios.get(`${baseUrl}/getTrendingNFTs`, )
    return data
}

export const getMyNFTs = async(account) => {
    let { data } = await axios.get(`${baseUrl}/getMyNFTs?account=${account}`, )
    return data
}