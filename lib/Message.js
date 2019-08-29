import Model from './Model';

/**
 * A Message
 */
class Message extends Model {
    /**
     * List all Models associated with the given inbox
     *
     * @static
     *
     * @param  {Object} params - Collection of parameters
     * @param  {string} params.inbox_id - Inbox that the messages belong to
     *
     * @return {Collection<Message>} - Collection of Messages
     */
    static list(params) {
        return this._get(`/api/v1/inboxes/${params['inbox_id']}/messages`)
            .then((response) => Message.hydrate(response.data));
    }

    /**
     * Find a particular Message by ID
     *
     * @static
     *
     * @param  {string} id - Id of the Message
     * @param  {Object} params - Collection of Parameters
     * @param {string} params.inbox_id - Inbox that the message belongs to
     *
     * @return {?Message} - Message Instance
     */
    static find(id, params) {
        return this._get(`/api/v1/inboxes/${params['inbox_id']}/messages/${id}`)
            .then((response) => new Message(response.data));
    }

    /**
     * Mark the Message as read
     *
     * @return {Promise} - API Progress
     */
    markRead() {
        return this._patch(`/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    /**
     * Delete the Message
     *
     * @return {Promise} - API Progress
     */
    delete() {
        return this._delete(`/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    /**
     * Retreive the HTML -formatted body of the message
     *
     * @return {Promise} - API Progress
     */
    getHtmlBody() {
        return this.performRequest(
            'GET',
            `/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}/body.html`,
            [],
            false
        );
    }
}

module.exports = Message;
