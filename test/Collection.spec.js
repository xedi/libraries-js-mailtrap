import expect from 'must';
import Collection from '../lib/Collection';

describe('Collection', () => {
    describe('count', () => {
        it('Should return the number of items present in a Collection', (done) => {
            let collection = new Collection([ "foo", "bar" ]);

            expect(collection.count()).to.be.equal(2);
            done();
        });
    });

    describe('isEmpty', () => {
        it('Should return true if there are no items in the Collection');
        it('Should return false if there are items in the Collection');
    });

    describe('eachPromise', () => {
        it('Should invoke the provided function for each iteration and wait for any promises returned');
    });
});
