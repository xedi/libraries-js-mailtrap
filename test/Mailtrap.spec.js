import expect from 'must';
import Mailtrap from '../lib/Mailtrap';
import Client from '../lib/Client';

describe('Mailtrap', () => {
    beforeEach(function() {
        Mailtrap.client = undefined;
        Mailtrap.mailtrap_url = undefined;
        Mailtrap.api_token = undefined;
    });

    describe('setMailtrapUrl', () => {
        it('Should pass the custom URL through to the client', (done) => {
            Mailtrap.setMailtrapUrl('https://test.test');

            Client.base_url.must.be.equal('https://test.test');

            done();
        });
    });

    describe('setApiToken', () => {
        it('Should pass the token through to the client', (done) => {
            Mailtrap.setApiToken('token');

            Client.api_token.must.be.equal('token');

            done();
        });
    });

    describe('resetClient', () => {
        it('Should reset the Client back to default', (done) => {
            Mailtrap.setApiToken('token')
                .setMailtrapUrl('http://test.test')
                .resetClient();

            expect(Client.base_url).must.be.undefined();
            expect(Client.api_token).must.be.undefined();

            done();
        });
    });
});
