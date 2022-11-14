import axios, { AxiosResponse } from 'axios';
import { IActivity } from './models/activity';

/** Setting a delay to simulate page loading */
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.interceptors.response.use(async response => {
    try {
        /** Delay the response with a seconds delay*/
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

axios.defaults.baseURL = "https://localhost:7032/api";

/**
 * I want to request a responsebody with my requested type 
 **/ 

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

/** 
 * Should be read as a object with lamda functions
 * Object initializers / object literals
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
 * https://www.youtube.com/watch?v=7d9H34ZVRPg&ab_channel=TheNetNinja 
 **/

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: () => requests.get<IActivity[]>('/activities') 
};

const agent = {
    Activities
};

export default agent;