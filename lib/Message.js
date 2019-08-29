import {withResults} from './utils';
import Model from './Model';
import Mailtrap from './Mailtrap';

class Message extends Model {
    static list(params) {
        return withResults(Mailtrap.getClient(), (client) => {
            return client.get(`/api/v1/inboxes/${params['inbox_id']}/messages`)
                .then((response) => Message.hydrate(response.data));
        });
    }

    static find(id, params) {
        return withResults(Mailtrap.getClient(), (client) => {
            return client.get(`/api/v1/inboxes/${params['inbox_id']}/messages/${id}`)
                .then((response) => new Message(response.data));
        });
    }

    markRead() {
        return this._patch(`/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    delete() {
        return this._delete(`/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    getHTMLBody() {
        return this._get(`/api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}/body.html`);
    }
}

module.exports = Message;
