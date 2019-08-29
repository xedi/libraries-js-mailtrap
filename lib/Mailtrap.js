import Client from './Client';
import Inbox from './Inbox';

class Mailtrap {
    static setMailtrapUrl(url) {
        Client.setBaseUrl(url);

        return this;
    }

    static setApiToken(token) {
        Client.setAuthorizationToken(token);

        return this;
    }

    static resetClient() {
        Client.reset();

        return this;
    }

    static inboxes() {
        return Inbox.list();
    }

    static inbox(inbox_id) {
        return Inbox.find(inbox_id);
    }
}

module.exports = Mailtrap;
