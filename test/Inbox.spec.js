import expect from 'must';
import nock from 'nock';
import Mailtrap from '../lib/Mailtrap';
import Message from '../lib/Message';
import Inbox from '../lib/Inbox';
import Collection from '../lib/Collection';
import list_fixture from './Fixtures/inboxes/list';
import find_fixture from './Fixtures/inboxes/find';
import clean_fixture from './Fixtures/inboxes/clean';
import all_read_fixture from './Fixtures/inboxes/all_read';
import messages_fixture from './Fixtures/inboxes/messages';

describe('Inbox', () => {
    before(() => {
        Mailtrap
            .setMailtrapUrl('http://test.test')
            .setApiToken('token');
    });

    describe('list', () => {
        it('Should return an empty Collection for no results', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes')
                .reply(
                    200,
                    JSON.stringify([])
                );

            Inbox.list().then((inboxes) => {
                try {
                    expect(inboxes).to.be.an.instanceof(Collection);
                    expect(inboxes.isEmpty()).to.be.true();

                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it('Should return a Collection of Inboxes', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes')
                .reply(
                    200,
                    list_fixture
                );

            Inbox.list().then((inboxes) => {
                try {
                    expect(inboxes).to.be.an.instanceof(Collection);
                    expect(inboxes.count()).to.be.equal(2);
                    expect(inboxes.every((inbox) => inbox instanceof Inbox))
                        .to.be.true();

                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    describe('find', () => {
        it('Should return a single inbox if an id is provided', (done) => {
            nock('http://test.test')
                .get('/api/v1/inboxes/abc')
                .reply(
                    200,
                    find_fixture
                );

            Inbox.find("abc").then((inbox) => {
                try {
                    expect(inbox).to.be.an.instanceof(Inbox);
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    describe('clean', () => {
        it('Should call the clean endpoint', (done) => {
            let inbox = new Inbox(JSON.parse(find_fixture));

            nock('http://test.test')
                .patch('/api/v1/inboxes/abc/clean')
                .reply(
                    200,
                    clean_fixture
                );

            inbox.clean().then(() => {
                try {
                    expect(inbox.attr('emails_count')).to.be.equal(0);

                    done();
                } catch (error) {
                    done(error);
                }
            });
        });
    });

    describe('markAllRead', () => {
        it('Should mark all messages as read', (done) => {
            let inbox = new Inbox(JSON.parse(find_fixture));

            nock('http://test.test')
                .patch('/api/v1/inboxes/abc/all_read')
                .reply(
                    200,
                    all_read_fixture
                );

            inbox.markAllRead()
                .then(() => {
                    expect(inbox.attr('emails_unread_count')).to.be.equal(0);

                    done();
                });
        });
    });

    describe('messages', () => {
        it('Should return all messages in the inbox', (done) => {
            let inbox = new Inbox(JSON.parse(find_fixture));

            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    messages_fixture
                );

            inbox.messages()
                .then((messages) => {
                    try {
                        expect(messages).to.be.instanceof(Collection);
                        expect(messages.count()).to.be.equal(2);
                        expect(messages.every(message => message instanceof Message)).to.be.true();

                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });
});