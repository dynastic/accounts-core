import axios from 'axios';

const prefix = (routes, prefixStr) => {
    var val = Object.assign({}, val);
    for (const key in routes) {
        var value = routes[key];
        if (typeof value == "object" && !Array.isArray(value))
            val[key] = prefix(value, prefixStr);
        else if (Array.isArray(value))
            val[key] = value.map(r => `${prefixStr}${r}`);
        else
            val[key] = `${prefixStr}${value}`;
    }
    return val;
};

/// The API routes. For example, {LOGIN: "/auth/login"}
const API_V0_ROUTES = prefix({
    USER: prefix({
        BASE: "/",
    }, "/user")
}, "/v0");
// Error codes. For example, {BAD_USERNAME: 1001}
const ERROR_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 1000,
    MISSING_FIELDS: 1001,
    INVALID_CREDENTIALS: 1002,
    UNAUTHENTICATED: 1003,
    PASSWORDS_MAY_NOT_MATCH: 1005,
    EMAIL_IN_USE: 1007,
    DEVICE_ALREADY_REGISTERED: 1008,
    HIBP_FLAGGED: 1009,
    HIBP_API_ERROR: 1010,
    ALREADY_HAS_2FA: 1011,
    INVALID_TOTP_TOKEN: 1012,
    NO_2FA: 1013,
    MFA_REQUIRED: 1023,
    OAUTH_FAIL: 1014,
    MISSING_EMAIL: 1015,
    UNVERIFIED_EMAIL: 1016,
    MISSING_RECAPTCHA: 1017,
    INVALID_RECAPTCHA: 1018,
    LINKED_TO_ANOTHER_ACCOUNT: 1019,
    NO_FALLBACK_LOGIN_METHOD: 1020,
    INVALID_SESSION_TOKEN: 1021,
    BANNED: 1022,
    AGREEMENT_REQUIRED: 1023
};
const API_BASE = "https://accounts-api.dynastic.co";
const FRONTEND_BASE = "https://accounts.dynastic.co";

function sendRequest(method, opts, resolve, reject) {
    const queryInURL = typeof opts.query === "string";
    const req = {
        url: opts.url + (queryInURL ? "?" + opts.query : ""),
        method,
        headers: opts.headers,
        params: queryInURL ? undefined : opts.query,
        data: opts.body,
        withCredentials: !opts.disableWithCredentials,
        timeout: typeof opts.timeout === "number" ? opts.timeout * 1000 : undefined
    };
    var parseResponse = (res) => {
        if (!res) {
            return reject(new Error("Didn't get a reply from the server."));
        }
        let body = res.data;
        if (typeof res.data === "string") {
            try {
                body = JSON.parse(res.data);
            }
            catch (e) {
                reject(e);
            }
        }
        const newRes = {
            headers: res.headers,
            body,
            status: res.status
        };
        if (res.status !== 200)
            return reject(newRes);
        resolve(newRes);
    };
    axios.request(req).then(res => parseResponse(res)).catch((err) => parseResponse(err.response));
}
function makeRequest(method, opts) {
    return new Promise((resolve, reject) => {
        if (typeof opts === 'string') {
            opts = { url: opts };
        }
        sendRequest(method, opts, resolve, reject);
    });
}
const HTTPUtils = {
    get: makeRequest.bind(null, 'get'),
    post: makeRequest.bind(null, 'post'),
    put: makeRequest.bind(null, 'put'),
    patch: makeRequest.bind(null, 'patch'),
    del: makeRequest.bind(null, 'delete')
};

const extractAndThrowError = (err) => { throw (err.body && (err.body.error || err.body) || err); };
const extractBody = (promise) => promise.then(res => res.body).catch(extractAndThrowError);
const extractBoolean = (key, promise) => promise.then(res => res.body[key]).catch(extractAndThrowError);
const extractSuccess = (promise) => extractBoolean("success", promise);

class DynasticAccountsAuthedAPI {
    constructor(token, api) {
        this.token = token;
        this.extraHeaders = { Authorization: "Bearer " + token, "X-Dynastic-Client-ID": api.clientID, "X-Dynastic-Client-Secret": api.clientSecret };
        this.api = api;
    }
    getHeaders(headers = {}) {
        return Object.assign(this.extraHeaders, headers);
    }
    /* User API */
    basicUser() {
        return extractBody(HTTPUtils.get({ url: this.api.API_V0.USER.BASE, query: "basic", headers: this.getHeaders(), timeout: 3 }));
    }
}

class DynasticAccountsAPI {
    constructor(apiBaseURL = API_BASE, clientID, clientSecret) {
        this.apiBaseURL = apiBaseURL;
        this.clientID = clientID;
        this.clientSecret = clientSecret;
        this.API_V0 = API_V0_ROUTES;
        // Prefix API routes with base URL
        this.API_V0 = prefix(this.API_V0, apiBaseURL);
    }
    getAuthedAPI(token) {
        return new DynasticAccountsAuthedAPI(token, this);
    }
}



var Spec0 = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var AccountsAPI = Spec0;

export { API_BASE, API_V0_ROUTES, AccountsAPI, DynasticAccountsAPI, DynasticAccountsAuthedAPI, ERROR_CODES, FRONTEND_BASE, HTTPUtils, extractBody, extractBoolean, extractSuccess, prefix };
