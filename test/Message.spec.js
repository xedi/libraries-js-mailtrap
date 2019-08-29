import expect from 'must';
import nock from 'nock';
import Message from '../lib/Message';
import Collection from '../lib/Collection';
import Mailtrap from '../lib/Mailtrap';
import list_fixture from './Fixtures/Message/list';
import find_fixture from './Fixtures/Message/find';

describe('Message', () => {
    before(() => {
        Mailtrap
            .setMailtrapUrl('http://test.test')
            .setApiToken('token');
    });

    describe('list', () => {
        it('Should return an empty Collection for no results', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    '[]'
                );

            Message.list({ 'inbox_id': 'abc' })
                .then((messages) => {
                    try {
                        expect(messages).to.be.instanceof(Collection);
                        expect(messages.items).to.be.empty();

                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it('Should return a Collection of Message instances', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    list_fixture
                );

            Message.list({ 'inbox_id': 'abc' })
                .then((messages) => {
                    try {
                        expect(messages).to.be.instanceof(Collection);
                        expect(messages.items.length).to.be.equal(2);

                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });

    describe('find', () => {
        it('Should return a single Message instance', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages/123')
                .reply(
                    200,
                    find_fixture
                );

            Message.find(123, { inbox_id: "abc" })
                .then((message) => {
                    try {
                        expect(message).to.be.instanceof(Message);

                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });

    describe('markRead', () => {
        it('Should mark a Message instance as read');
    });

    describe('delete', () => {
        it('Should delete a Message instance');
    });

    describe('getHTMLBody', () => {
        it('Should return the HTML content of the message body');
    });
});
