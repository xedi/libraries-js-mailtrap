import Model from './Model';
import Message from './Message';

class Inbox extends Model {
    static list() {
        return this._get('/api/v1/inboxes')
            .then((response) => Inbox.hydrate(response.data));
    }

    static find(inbox_id) {
        return this._get(`/api/v1/inboxes/${inbox_id}`)
            .then((response) => new Inbox(response.data));
    }

    clean() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/clean`);
    }

    markAllRead() {
        return this._patch(`/api/v1/inboxes/${this.attr('id')}/all_read`);
    }

    messages() {
        return this.loadRelationship('messages', () => {
            return Message.where('inbox_id', this.attr('id'))
                .get();
        });
    }
}

module.exports = Inbox;
