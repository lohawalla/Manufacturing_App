import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

export default class AxiosFactory {
    static createInstance<T = any>(config?: CreateAxiosDefaults<T>): AxiosInstance {
        console.log(config);
        const basePath="https://chawlacomponents.com/"
        const _config: CreateAxiosDefaults<any> = {
            ...config,
            baseURL: basePath + (config?.baseURL || "")
        };
        return axios.create(_config);
    }
}
