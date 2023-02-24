import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8800/api/',
    withCredentials: true
})

export  async function getPosts () { 
    const res = await instance.get('posts');
    return res.data
}