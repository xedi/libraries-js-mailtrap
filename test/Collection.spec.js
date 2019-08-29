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
        it('Should return true if there are no items in the Collection', (done) => {
            let collection = new Collection();

            expect(collection.isEmpty()).to.be.true();
            done();
        });

        it('Should return false if there are items in the Collection', (done) => {
            let collection = new Collection([ "foo", "bar" ]);

            expect(collection.isEmpty()).to.be.false();
            done();
        });
    });

    describe('eachPromise', () => {
        it('Should throw a TypeError if iterator is not a function', (done) => {
            let collection = new Collection([ "foo", "bar" ]);

            /*
                We need to assert that our instance function, when called with a
                parameter that is not a function, will throw a TypeError.

                `must.throw()` automatically calls our method with a scope of
                null, so we must bind the scope of our instance and specify any
                parameters now.
             */
            collection.eachPromise.bind(collection, 'a string').must.throw(
                TypeError,
                "Invalid Argument: expected Function but got string"
            );

            done();
        });

        it('Should invoke the provided function for each iteration and wait for the promises returned', (done) => {
            let collection = new Collection([ "foo", "bar" ]);

            collection
                .eachPromise(function () {
                    return Promise.resolve();
                })
                .must.resolve.to.equal(collection);

            done();
        });

        it('Should invoke the provided function for each iteration and return a resolved promise', (done) => {
            let collection = new Collection([ "foo", "bar" ]);

            collection
                .eachPromise(function (item) {
                    return item;
                })
                .must.resolve.to.equal(collection);

            done();
        });
    });
});
