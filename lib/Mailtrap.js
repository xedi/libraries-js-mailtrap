import Client from './Client';

class Mailtrap {
    static setMailtrapUrl(url) {
        this.mailtrap_url = url;

        return this;
    }

    static setApiToken(token) {
        this.api_token = token;

        return this;
    }

    static getClient() {
        if (this.client === undefined) {
            this.client = new Client(this.api_token, this.mailtrap_url);
        }

        return this.client;
    }

    static clearClient() {
        this.client = undefined;

        return this;
    }
}

module.exports = Mailtrap;
