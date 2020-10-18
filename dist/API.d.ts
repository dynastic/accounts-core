import { DynasticAccountsAuthedAPI } from "./AuthedAPI";
export declare class DynasticAccountsAPI {
    clientID: string;
    clientSecret: string;
    apiBaseURL: string;
    API_V0: {
        USER: {
            BASE: string;
        };
    };
    constructor(clientID: string, clientSecret: string, apiBaseURL?: string);
    getAuthedAPI(token: string): DynasticAccountsAuthedAPI;
}
