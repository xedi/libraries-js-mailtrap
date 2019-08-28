import expect from 'must';
import Mailtrap from '../lib/Mailtrap';
import Client from '../lib/Client';

describe('Mailtrap', () => {
    beforeEach(function() {
        Mailtrap.client = undefined;
        Mailtrap.mailtrap_url = undefined;
        Mailtrap.api_token = undefined;
    });

    describe('getClient', () => {
        it('Should return a Client instance', (done) => {
            let client = Mailtrap.getClient();

            client.must.be.an.instanceof(Client);

            done();
        });

        it('Client instance should have defailt url', (done) => {
            let client = Mailtrap.getClient();

            client.base_url.must.be.equal('https://mailtrap.io');

            done();
        });

        it('Client instance should not have a default api token', (done) => {
            let client = Mailtrap.getClient();

            expect(client.api_token).to.be.undefined();

            done();
        });
    });

    describe('setMailtrapUrl', () => {
        it('Should set the Mailtrap URL within the Mailtrap Facade', (done) => {
            Mailtrap.setMailtrapUrl('https://test.test');

            expect(Mailtrap.mailtrap_url).to.be.equal('https://test.test');

            done();
        });

        it('Should pass the custom URL through to the client', (done) => {
            let client = Mailtrap.setMailtrapUrl('https://test.test')
                .getClient();

            client.base_url.must.be.equal('https://test.test');

            done();
        });
    });

    describe('setApiToken', () => {
        it('Should set the Mailtrap token within the Mailtrap Facade', (done) => {
            Mailtrap.setApiToken('token');

            expect(Mailtrap.api_token).to.be.equal('token');

            done();
        });

        it('Should pass the token through to the client', (done) => {
            let client = Mailtrap.setApiToken('token')
                .getClient();

            client.api_token.must.be.equal('token');

            done();
        });
    });

    describe('clearClient', () => {
        it('Should remove the cached Client instance from the Mailtrap facade', (done) => {
            Mailtrap.getClient();
            Mailtrap.clearClient();

            expect(Mailtrap.client).to.be.undefined();

            done();
        });
    });
});
