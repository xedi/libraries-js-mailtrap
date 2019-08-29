import Model from './Model';
import Message from './Message';

/**
 * Inbox Class
 */
class Inbox extends Model {
    /**
     * List all Inboxes
     *
     * @static
     * @async
     *
     * @return {[Collection<Inbox>]} - Collection of Inboxes
     */
    static list() {
        return this._get('/api/v1/inboxes')
            .then((response) => Inbox.hydrate(response.data));
    }

    /**
     * Get a particular inbox
     *
     * @static
     * @async
     *
     * @param  {string} inbox_id - Inbox id
     *
     * @return {[?Inbox]} - The requested inbox
     */
    static find(inbox_id) {
        return this._get(`/api/v1/inboxes/${inbox_id}`)
            .then((response) => new Inbox(response.data));
    }

    /**
     * Delete all messages out of the inbox
     *
     * @async
     *
     * @return {Promise} - API Progress
     */
    clean() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/clean`);
    }

    /**
     * Mark all messages in this inbox as read
     *
     * @async
     *
     * @return {Promise} - API Progress
     */
    markAllRead() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/all_read`);
    }

    /**
     * Get the Messages for this inbox.
     *
     * @async
     *
     * @return {[Collection<Message>]} - API Progress - Will resolve to a Collection of Messages.
     */
    messages() {
        return this.loadRelationship('messages', () => {
            return Message.where('inbox_id', this.attr('id'))
                .get();
        });
    }
}

module.exports = Inbox;
