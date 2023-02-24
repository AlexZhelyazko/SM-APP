import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8800/api/',
    withCredentials: true
})

export  async function getPosts () { 
    const res = await instance.get('posts');
    return res.data
}

export  async function addPost (post:any) { 
    const res = await instance.post('posts', {...post});
    return res.data
}


export  async function addPostImg (img:any) { 
    const res = await instance.post('upload', img);
    return res.data
}

export const makeRequest = axios.create({
    baseURL: "http://localhost:8800/api/",
    withCredentials: true,
  });