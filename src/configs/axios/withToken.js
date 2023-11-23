import axios from 'axios'

export default function WithTokenn(token){

let tokens=token
const instance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_API_HOST}`,
    headers: {
        'Authorization': `Bearer ${tokens}`,
        'Access-Control-Allow-Origin' : `*, ${process.env.NEXT_PUBLIC_API_HOST}`,
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With' : 'XMLHttpRequest',
        'ApiKey' : `${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    // withCredentials: true
})


instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // console.log("Response", error.response)
        if (error.response.status === 401) {
            window.location.href = '/401'
        }
        if (error.response.status === 0) {
            window.location.href = '/401'
        }
        return error;
    }
)

return (
    instance
)
}
