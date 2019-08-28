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
        if (! Mailtrap.client) {
            Mailtrap.client = new Client(this.api_token, this.mailtrap_url);
        }

        return Mailtrap.client;
    }

    static clearClient() {
        Mailtrap.client = undefined;

        return this;
    }
}

module.exports = Mailtrap;
