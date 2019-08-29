import axios from 'axios';

class Client {
    constructor(api_token, mailtrap_url = 'https://mailtrap.io') {
        this.base_url = mailtrap_url;
        this.api_token = api_token;
    }

    prepareUrl(path) {
        let url = path;

        if (path.indexOf('//') === -1) {
            url = this.base_url + path;
        }

        return url;
    }

    prepareRequestHeaders() {
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
        };

        if (this.api_token) {
            headers.Authorization = `Token token=${this.api_token}`;
        }

        return headers;
    }

    request(method, path, data) {
        const url = this.prepareUrl(path);
        const headers = this.prepareRequestHeaders();
        let query_params = {};
        const should_use_query_params = data &&
            (typeof data === 'object') &&
            methodHasNoBody(method);

        if (should_use_query_params) {
            query_params = data;
            data = undefined;
        }

        const config = {
            url: url,
            method: method,
            headers: headers,
            params: query_params,
            data: data,
            responseType: 'json',
        };

        return axios(config);
    }

    get(path, data) {
        return this.request('GET', path, data);
    }

    post(path, data) {
        return this.request('POST', path, data);
    }

    patch(path, data) {
        return this.request('PATCH', path, data);
    }

    delete(path, data) {
        return this.request('DELETE', path, data);
    }

    static newInstance() {
        return new this(
            this.api_token,
            this.base_url
        );
    }

    static setBaseUrl(url) {
        this.base_url = url;

        return this;
    }

    static setAuthorizationToken(token) {
        this.api_token = token;

        return this;
    }

    static reset()
    {
        this.api_token = undefined;
        this.base_url = undefined;

        return this;
    }
}

module.exports = Client;

const METHODS_WITH_NO_BODY = ['GET', 'HEAD', 'DELETE'];
function methodHasNoBody(method) {
    return METHODS_WITH_NO_BODY.indexOf(method) !== -1;
}
