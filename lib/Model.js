import {withResults} from './utils';
import {map, merge} from 'lodash';
import Collection from './Collection';
import Query from './Query';
import Client from './Client';

/**
 * Abstract Model Class
 */
class Model {
    /**
     * Hydrate a Collection with Models
     *
     * @static
     *
     * @param  {array} items - Array of dehydrated models
     *
     * @return {[Collection<Model>]} - Collection of Models
     */
    static hydrate(items) {
        return new Collection(
            map(items, (item) => new this(item))
        );
    }

    /**
     * Construct a Model instance
     *
     * @constructor
     *
     * @param  {Object} attributes - Properties of the Model
     */
    constructor(attributes = {}) {
        this.attributes = attributes;
        this.relations = {};
    }

    /**
     * Perform a GET Query
     *
     * @static
     *
     * @param  {string} path - URL to perform the request on
     * @param  {?Object} params - Parameters to be sent with the request
     *
     * @return {Promise} - API Progress
     */
    static _get(path, params) {
        return withResults(Client.newInstance(), (client) => {
            return client.request('GET', path, params);
        });
    }

    /**
     * Perform a GET Query
     *
     * @param  {string} path - URL to perform the request on
     * @param  {?Object} params - Parameters to be sent with the request
     *
     * @return {Promise} - API Progress
     */
    _get(path, params) {
        return this.performRequest('GET', path, params);
    }

    /**
     * Perform a POST Request
     *
     * @param  {string} path - URL to perform the request on
     * @param  {?Object} params - Parameters to be sent with the request
     *
     * @return {Promise} - API Progress
     */
    _post(path, params) {
        return this.performRequest('POST', path, params);
    }

    /**
     * Perform a PATCH Request
     *
     * @param  {string} path - URL to perform the request on
     * @param  {?Object} params - Parameters to be sent with the request
     *
     * @return {Promise} - API Progress
     */
    _patch(path, params) {
        return this.performRequest('PATCH', path, params);
    }

    /**
     * Perform a DELETE Request
     *
     * @param  {string} path - URL to perform the request on
     * @param  {?Object} params - Parameters to be sent with the request
     *
     * @return {Promise} - API Progress
     */
    _delete(path, params) {
        return this.performRequest('DELETE', path, params);
    }

    /**
     * Perform a HTTP Request
     *
     * @param  {string}  method - HTTP VERB
     * @param  {string}  path - URL to follow
     * @param  {Object}  params - Parameters to be sent with the request
     * @param  {Boolean} update_attributes - Should the model update itself with the response
     *
     * @return {Promise} - API Progress
     */
    performRequest(method, path, params, update_attributes = true) {
        return withResults(Client.newInstance(), (client) => {
            let promise = client.request(method, path, params);

            if (update_attributes) {
                promise.then((response) => this.updateAttributes(response.data));
            }

            return promise;
        });
    }

    /**
     * Update the internal attributes list with some new ones.
     *
     * @param  {Array}  attributes - new attributes
     *
     * @chainable
     *
     * @returns {[Model]} - Model instance
     */
    updateAttributes(attributes = []) {
        this.attributes = merge(this.attributes, attributes);

        return this;
    }

    /**
     * Used to chain together parameters
     *
     * @static
     *
     * @param  {string} key - Alias of the condition
     * @param  {mixed} value - Condition
     *
     * @return {[Query]} - A Query Object
     */
    static where(key, value) {
        return new Query(this)
            .where(key, value);
    }

    /**
     * Load the relationship of the Model
     *
     * @param  {string} relationship - Name of the Relationship
     * @param  {Function} loadFn - The function that loads the data
     *
     * @return {mixed} - Collection of Models or a Model
     */
    loadRelationship(relationship, loadFn) {
        if (!(relationship in this.relations)) {
            this.relations[relationship] = loadFn.call(this);
        }

        return this.relations[relationship];
    }

    /**
     * Remove a relation from the internal cache.
     *
     * @param  {string} relationship - Name of the Relationship
     *
     * @chainable
     *
     * @returns {[Model]} - Model Instance
     */
    unsetRelationship(relationship) {
        if (relationship in this.relations) {
            delete this.relations[relationship]; // not performant but blah
        }

        return this;
    }

    /**
     * Get/Set an attribute
     *
     * @param  {string} attribute - Attribute Name
     * @param  {?mixed} value - Optional value to assign
     *
     * @chainable
     *
     * @return {mixed} - Value requested or instance of the Model
     */
    attr(attribute, value) {
        if (value === undefined) {
            return this.getAttribute(attribute);
        }

        return this.setAttribute(attribute, value);
    }

    /**
     * Get an attribute
     *
     * @param  {string} attribute - Attribute Name
     *
     * @return {mixed} - Value requested
     */
    getAttribute(attribute) {
        return this.attributes[attribute];
    }

    /**
     * Set an Attribute
     *
     * @param  {string} attribute - Attribute Name
     * @param  {mixed} value - Value to assign
     *
     * @chainable
     *
     * @returns {[Model]} - Model Instance
     */
    setAttribute(attribute, value) {
        this.attributes[attribute] = value;

        return this;
    }
}

module.exports = Model;
