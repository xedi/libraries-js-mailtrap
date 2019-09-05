import Model from './Model';
import Message from './Message';

/**
 * Inbox Class
 * @extends {Model}
 */
class Inbox extends Model {
    /**
     * List all Inboxes
     *
     * @static
     * @async
     *
     * @return {Collection<Inbox>}  Collection of Inboxes
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
     * @param  {string} inbox_id  Inbox id
     *
     * @return {Inbox}  The requested inbox
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
     * @return {Promise}  API Progress
     */
    clean() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/clean`);
    }

    /**
     * Mark all messages in this inbox as read
     *
     * @async
     *
     * @return {Promise}  API Progress
     */
    markAllRead() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/all_read`);
    }

    /**
     * Get the Messages for this inbox.
     *
     * @async
     *
     * @return {Collection<Message>}  API Progress - Will resolve to a Collection of Messages.
     */
    messages() {
        return this.loadRelationship('messages', () => {
            return Message.where('inbox_id', this.attr('id'))
                .get();
        });
    }

    /**
     * Wait for a Message matching given parameters to be received.
     *
     * @async
     *
     * @param  {Object} params  Parameters to filter the emails by
     * @param  {Number} [timeout=6000]  How long we should wait
     * @param  {Number} [interval=1000]  How long between each check
     *
     * @return {Promise}  Promise Object representing the Progress
     */
    waitForMessages(params, timeout = 6000, interval = 1000) {
        const message_filter = (messages) => {
            let filtered = messages;

            for (let key in params) {
                if (Object.prototype.hasOwnProperty.call(params, key)) {
                    filtered = filtered.where(key, params[key]);
                }
            }

            return filtered;
        };
        const message_check = (messages) => {
            return ! messages.isEmpty();
        };

        return new Promise((resolve, reject) => {
            const interval_id = setInterval(
                () => {
                    this.messages()
                        .then((messages) => {
                            let filtered_messages = message_filter(messages);

                            if (message_check(filtered_messages)) {
                                clearInterval(interval_id);
                                resolve(filtered_messages);
                            } else {
                                this.unsetRelationship('messages');
                            }
                        },
                        (error) => {
                            clearInterval(interval_id);
                            clearTimeout(timeout_id);
                            reject(error);
                        });
                },
                interval
            );

            const timeout_id = setTimeout(
                () => {
                    clearInterval(interval_id);

                    reject(
                        new Error(
                            'Timed out waiting for a message that matches the provided parameters.'
                        )
                    );
                },
                timeout
            );
        });
    }
}

module.exports = Inbox;
