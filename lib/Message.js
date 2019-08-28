import Model from './Model';
import Mailtrap from './Mailtrap';

class Message extends Model {
    list(params) {
        return tap(Mailtrap.getClient(), (client) => {
            return client.get(`api/v1/inboxes/${params['inbox_id']}/messages`)
                .then((response) => Message.hydrate(response));
        });
    }

    find(id, params) {
        return tap(Mailtrap.getClient(), (client) => {
            return client.get(`api/v1/inboxes/${params['inbox_id']}/messages/${id}`)
                .then((response) => new Message(response));
        });
    }

    markRead() {
        return this.patch(`api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    delete() {
        return this.delete(`api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}`);
    }

    getHTMLBody() {
        return this.get(`api/v1/inboxes/${this.attr('inbox_id')}/messages/${this.attr('id')}/body.html`);
    }
}

module.exports = Message;
