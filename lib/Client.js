import axios from 'axios';

/**
 * HTTP Client
 * @class
 */
class Client {
    /**
     * @constructor
     *
     * @param  {string} api_token  Authorization token required to access Mailtrap
     * @param  {String} [mailtrap_url=https://mailtrap.io]  Base URL of the Mailtrap service
     */
    constructor(api_token, mailtrap_url = 'https://mailtrap.io') {
        this.base_url = mailtrap_url;
        this.api_token = api_token;
    }

    /**
     * Prepare an absolute url
     *
     * @private
     *
     * @param  {string} path  Provided URL
     *
     * @return {string}  Absolute URL
     */
    prepareUrl(path) {
        let url = path;

        if (path.indexOf('//') === -1) {
            url = this.base_url + path;
        }

        return url;
    }

    /**
     * Prepare the Request Headers
     *
     * @private
     *
     * @return {Object}  Request Headers
     */
    prepareRequestHeaders() {
        let headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
        };

        if (this.api_token) {
            headers.Authorization = `Token token=${this.api_token}`;
        }

        return headers;
    }

    /**
     * Perform a HTTP Request
     *
     * @param  {string} method - HTTP Verb
     * @param  {string} path - URL to perform the request on
     * @param  {Object} data - Data to pass along with the request
     *
     * @return {Promise} - API Progress
     */
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
            crossDomain: true,
        };

        return axios(config);
    }

    /**
     * Perform a GET request
     *
     * @param  {string} path  URL
     * @param  {Object} [data]  Data to pass along with the request
     *
     * @return {Promise}  API Progress
     */
    get(path, data) {
        const url = this.prepareUrl(path);
        const headers = this.prepareRequestHeaders();

        const request = new Request(
            url,
            {
                method: 'GET',
                headers: headers,
                credentials: 'include',
            }
        );

        return fetch(request);
    }

    /**
     * Perform a POST request
     *
     * @param  {string} path  URL
     * @param  {Object} [data]  Data to pass along with the request
     *
     * @return {Promise}  API Progress
     */
    post(path, data) {
        return this.request('POST', path, data);
    }

    /**
     * Perform a PATCH request
     *
     * @param  {string} path  URL
     * @param  {Object} [data]  Data to pass along with the request
     *
     * @return {Promise}  API Progress
     */
    patch(path, data) {
        return this.request('PATCH', path, data);
    }

    /**
     * Perform a DELETE request
     *
     * @param  {string} path  URL
     * @param  {Object} [data]  Data to pass along with the request
     *
     * @return {Promise}  API Progress
     */
    delete(path, data) {
        return this.request('DELETE', path, data);
    }

    /**
     * Get a new instance of the Client class
     *
     * @static
     *
     * @return {Client}  Client instance
     */
    static newInstance() {
        return new this(
            this.api_token,
            this.base_url
        );
    }

    /**
     * Set the base url the client is to use
     *
     * @param {string} url  Desired url
     *
     * @returns {Client}  Client Class
     */
    static setBaseUrl(url) {
        this.base_url = url;

        return this;
    }

    /**
     * Set the Authorization token required for the Mailtrap service
     *
     * @param {string} token - Authorization token
     *
     * @returns {Client}  Client class
     */
    static setAuthorizationToken(token) {
        this.api_token = token;

        return this;
    }

    /**
     * Reset the Client back to its default settings
     *
     * @returns {Client} - Client class
     */
    static reset() {
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
