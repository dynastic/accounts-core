import { API_BASE, API_V0_ROUTES } from "./Constants";
import { DynasticAccountsAuthedAPI } from "./AuthedAPI";
import { prefix } from "./util";

export class DynasticAccountsAPI {
    API_V0 = API_V0_ROUTES;

    constructor(public clientID: string, public clientSecret: string, public apiBaseURL = API_BASE) {
        // Prefix API routes with base URL
        this.API_V0 = prefix(this.API_V0, apiBaseURL);
    }

    getAuthedAPI(token: string): DynasticAccountsAuthedAPI {
        return new DynasticAccountsAuthedAPI(token, this);
    }
}
