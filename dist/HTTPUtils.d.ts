export declare type HTTPHeaders = {
    [key: string]: string;
};
declare type HTTPRequest = {
    url: string;
    query?: {
        [key: string]: any;
    } | string;
    body?: any;
    headers?: HTTPHeaders;
    disableWithCredentials?: boolean;
    timeout?: number;
};
export declare type HTTPResponse = {
    status: number;
    headers: {
        [key: string]: string;
    };
    body: any;
};
export interface Response {
    headers: {
        [key: string]: string;
    };
    body: any;
    status: number;
}
export declare type HTTPFunction = (req: string | HTTPRequest) => Promise<HTTPResponse>;
export declare const HTTPUtils: {
    get: HTTPFunction;
    post: HTTPFunction;
    put: HTTPFunction;
    patch: HTTPFunction;
    del: HTTPFunction;
};
export {};
