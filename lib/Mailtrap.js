import Client from './Client';
import Inbox from './Inbox';

/**
 * Mailtrap Facade
 */
class Mailtrap {
    /**
     * Set the base url of the client to an alternative URL
     *
     * @param {string} url - Alternative URL
     *
     * @chainable
     *
     * @returns {[Mailtrap]} - Mailtrap Facade
     */
    static setMailtrapUrl(url) {
        Client.setBaseUrl(url);

        return this;
    }

    /**
     * Set the API Token for the Mailtrap API
     *
     * @param {string} token - Authorization Token
     *
     * @chainable
     *
     * @returns {[Mailtrap]} - Mailtrap Facade
     */
    static setApiToken(token) {
        Client.setAuthorizationToken(token);

        return this;
    }

    /**
     * Reset the Client back to it's default configuration
     *
     * @chainable
     *
     * @returns {[Mailtrap]} - Mailtrap Facade
     */
    static resetClient() {
        Client.reset();

        return this;
    }

    /**
     * List Inboxes
     *
     * @return {[Collection<Inbox>]} - Collection of available Inboxes
     */
    static inboxes() {
        return Inbox.list();
    }

    /**
     * Get a particular inbox
     *
     * @param  {string} inbox_id - Inbox ID
     *
     * @return {[?Inbox]} - The Inbox
     */
    static inbox(inbox_id) {
        return Inbox.find(inbox_id);
    }
}

module.exports = Mailtrap;
