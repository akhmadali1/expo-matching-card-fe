import axios from 'axios'

const instance = axios.create({
    baseURL:`${process.env.NEXT_PUBLIC_BASE_API_HOST}`,
    headers: {
        'Access-Control-Allow-Origin' : `*, ${process.env.NEXT_PUBLIC_API_HOST}`,
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Accept': 'application/json, text/plain, /',
        'Content-Type': 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'ApiKey' : `${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    // withCredentials: false
})

instance.interceptors.response.use((response) => response.data);
export default instance;
