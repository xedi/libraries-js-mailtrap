import {map, every, isFunction, filter, isString, isObject, includes as inArray} from 'lodash';

/**
 * Collection is an Array-type object
 * @class
 */
class Collection {
    /**
     * New Collection Instance
     *
     * @constructor
     *
     * @param  {Array}  [items=[]]  Objects to store in the collection
     */
    constructor(items = []) {
        this.items = items;
    }

    /**
     * Count of the contents of the Collection
     *
     * @return {Integar}  Number of items in the Collection
     */
    count() {
        return (this.items || []).length;
    }

    /**
     * Assess whether the collection is empty
     *
     * @return {Boolean}  Whether or not the Collection is empty
     */
    isEmpty() {
        return ! this.count();
    }

    /**
     * Perform a map function over each of the items within the Collection
     *
     * @param  {Function} fn  Mapping function
     *
     * @return {Collection}  A new Collection instance
     */
    map(fn) {
        return new Collection(
            map(this.items, fn)
        );
    }

    /**
     * Iterate over each item within the Collection and apply a predicate.
     *
     * @param  {Function} predicate  Truthy function
     *
     * @return {Bool}  Whether every element passed the test
     */
    every(predicate) {
        return every(this.items, predicate);
    }

    /**
     * Perform the provided function for each item and wait for any promises returned
     *
     * @param  {Function} fn - Callback to execute with each iteration
     *
     * @return {Promise}  Promise object representing the results of each invocation of the callback
     */
    eachPromise(fn) {
        let promises = [];

        if (! isFunction(fn)) {
            throw new TypeError(`Invalid Argument: expected Function but got ${typeof fn}`);
        }

        for (let item of this.items) {
            let result = fn(item);

            if (result instanceof Promise) {
                promises.push(result);
            }
        }

        if (promises.length) {
            return Promise.all(promises)
                .then(() => this);
        }

        return Promise.resolve(this);
    }

    /**
     * Filter the contents of a Collection
     *
     * @param  {Function} [callback]  Optional condition function
     *
     * @return {Collection}  A new Collecton instance
     */
    filter(callback = null) {
        if (callback) {
            return new Collection(filter(this.items, callback));
        }

        return new Collection(filter(this.items));
    }

    /**
     * Filter the Collection via a where statement
     *
     * @param  {string} key  Name of the attribute to filter by
     * @param  {*} [operator]  Comparison operator to use, or the value to compare against
     * @param  {*} [value]  The value to compare against
     *
     * @return {Collection}  Filtered Collection
     */
    where(key, operator, value) {
        if (key === undefined) {
            throw new Error('Key is a required parameter');
        }

        return this.filter(this.operatorForWhere(...arguments)); // eslint-disable-line prefer-rest-params
    }

    /**
     * Find an appropriate comparison operator for the Where instruction
     *
     * @param  {string} key  Name of the attribute to filter by
     * @param  {*} [operator]  Comparison operator to use, or the value to compare against
     * @param  {*} [value]  The value to compare against
     *
     * @return {Function}  Comparison function
     */
    operatorForWhere(key, operator, value) {
        switch (arguments.length) {
            case 2:
                value = operator;
                operator = '=';
                break;
            case 1:
                value = true;
                operator = '=';
                break;
        }

        return (item) => {
            const retrieved = item.attr(key);

            let strings = filter([retrieved, value], (val) => {
                return isString(val);
            });

            if (strings.length < 2 && (filter([retrieved, value], isObject)).length === 1) {
                return inArray(operator, ['!=', '<>', '!==']);
            }

            switch (operator) {
                default:
                case '=':
                case '==': return retrieved == value; // eslint-disable-line eqeqeq
                case '!=':
                case '<>': return retrieved != value; // eslint-disable-line eqeqeq
                case '<': return retrieved < value;
                case '>': return retrieved > value;
                case '<=': return retrieved <= value;
                case '>=': return retrieved >= value;
                case '===': return retrieved === value;
                case '!==': return retrieved !== value;
            }
        };
    }
}

module.exports = Collection;
