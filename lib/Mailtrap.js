import Client from './Client';
import Inbox from './Inbox';
import Message from './Message';

/**
 * Mailtrap Facade
 * @class
 */
class Mailtrap {
    /**
     * Set the base url of the client to an alternative URL
     *
     * @param {string} url  Alternative URL
     *
     * @returns {Mailtrap}  Mailtrap Facade
     */
    static setMailtrapUrl(url) {
        Client.setBaseUrl(url);

        return this;
    }

    /**
     * Set the API Token for the Mailtrap API
     *
     * @param {string} token  Authorization Token
     *
     * @returns {Mailtrap}  Mailtrap Facade
     */
    static setApiToken(token) {
        Client.setAuthorizationToken(token);

        return this;
    }

    /**
     * Reset the Client back to it's default configuration
     *
     * @returns {Mailtrap}  Mailtrap Facade
     */
    static resetClient() {
        Client.reset();

        return this;
    }

    /**
     * List Inboxes
     *
     * @return {Collection<Inbox>}  Collection of available Inboxes
     */
    static inboxes() {
        return Inbox.list();
    }

    /**
     * Get a particular inbox
     *
     * @param  {string} inbox_id  Inbox ID
     *
     * @return {Inbox}  The Inbox
     */
    static inbox(inbox_id) {
        return Inbox.find(inbox_id);
    }

    /**
     * Get a particular message
     *
     * @param  {string} inbox_id   Inbox ID
     * @param  {string} message_id Message ID
     *
     * @return {Message}  A Message
     */
    static message(inbox_id, message_id) {
        return Message.where('inbox_id', inbox_id)
            .get(message_id);
    }

    /**
     * Get all messages for an inbox
     *
     * @param  {string} inbox_id     Inbox ID
     * @return {Collection<Message>} Collection of Messages
     */
    static messages(inbox_id) {
        return Message.where('inbox_id', inbox_id)
            .get();
    }
}

module.exports = Mailtrap;
