import axios from "axios";


export const backend = "https://chawlacomponents.com"


const apis = axios.create({
    baseURL: backend,
})


// axios interceptors
apis.interceptors.response.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error

    // rearrange error message
    let message = error.message;
    if (error.response?.data) {
        if (error.response.data.message) {
            message = error.response.data.message
        } else if (typeof error.response.data === "string") {
            message = error.response.data
        }
    }
    error.message = message
    return Promise.reject(error);
})


// axios interceptors
apis.interceptors.request.use(function (config) {
    // here some value set in headers


    return config;
}, function (error) {
    // Do something with request error

})




export default apis