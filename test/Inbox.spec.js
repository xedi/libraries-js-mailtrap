import expect from 'must';
import nock from 'nock';
import Mailtrap from '../lib/Mailtrap';
import Message from '../lib/Message';
import Inbox from '../lib/Inbox';
import Collection from '../lib/Collection';
import list_fixture from './Fixtures/Inbox/list';
import find_fixture from './Fixtures/Inbox/find';
import clean_fixture from './Fixtures/Inbox/clean';
import all_read_fixture from './Fixtures/Inbox/all_read';
import messages_fixture from './Fixtures/Inbox/messages';
import wait_for_messages_fixture from './Fixtures/Inbox/wait_for_messages';
import wait_for_messages_2_fixture from './Fixtures/Inbox/wait_for_messages_2';

const fake_inbox = JSON.parse(find_fixture);

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
            let inbox = new Inbox(fake_inbox);

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
            let inbox = new Inbox(fake_inbox);

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
            let inbox = new Inbox(fake_inbox);

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

    describe('waitForMessages', () => {
        it('Should return if the message is already received', async () => {
            let inbox = new Inbox(fake_inbox);

            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    wait_for_messages_fixture
                );

            let messages = await inbox.waitForMessages({
                to_email: '123@test.com'
            });

            expect(messages).to.be.instanceof(Collection);
            expect(messages.items).to.have.length(1);
            expect(messages.items[0].attr('to_email')).to.be.equal('123@test.com');
        });

        it('Should iterate until a message is received', async () => {
            let inbox = new Inbox(fake_inbox);

            nock('http://test.test')
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    wait_for_messages_fixture
                )
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    wait_for_messages_2_fixture
                );

            let messages = await inbox.waitForMessages(
                {
                    to_email: '789@test.com'
                },
                undefined,
                500
            );

            expect(messages).to.be.instanceof(Collection);
            expect(messages.items).to.have.length(1);
            expect(messages.items[0].attr('to_email')).to.be.equal('789@test.com');
        });

        it('Should error if the timeout duration is hit', async () => {
            let inbox = new Inbox(fake_inbox);

            nock('http://test.test')
                .persist()
                .get('/api/v1/inboxes/abc/messages')
                .reply(
                    200,
                    '[]'
                );

            try {
                await inbox.waitForMessages(
                    { to_email: 'someone@test.com' },
                    1000,
                    500
                );

                throw new Error('Should have Errored');
            } catch (error) {
                expect(error).to.be.instanceof(Error);
                expect(error.message).to.be.equal(
                    'Timed out waiting for a message that matches the provided parameters.'
                );
            }
        });
    });

    afterEach(() => {
        nock.cleanAll();
    });
});
