/* eslint valid-jsdoc: ["error", {"requireReturnDescription": false}] */
import {map, every} from 'lodash';

/**
 * Collection is an Array-type object
 */
class Collection {
    /**
     * New Collection Instance
     *
     * @param  {Array}  items - Objects to store in the collection
     */
    constructor(items = []) {
        this.items = items;
    }

    /**
     * Count of the contents of the Collection
     *
     * @return {Integar}
     */
    count() {
        return (this.items || []).length;
    }

    isEmpty() {
        return ! this.count();
    }

    map(fn) {
        return map(this.items, fn);
    }

    every(predicate) {
        return every(this.items, predicate);
    }

    /**
     * Perform the provided function for each item and wait for any promises returned
     *
     * @param  {Function} fn - Callback to execute with each iteration
     *
     * @return {Promise}
     */
    eachPromise(fn) {
        let promises = [];

        if (!(fn instanceof Function)) {
            throw new TypeError(`Invalid Argument: expected Function but got ${typeof fn}`);
        }

        for (let item of this.items) {
            let result = fn(item);

            if (result instanceof Promise) {
                promises.push(result);
            }
        }

        if (promises.length) {
            return Promise.all(promises);
        }

        return new Promise().resolse();
    }
}

module.exports = Collection;
