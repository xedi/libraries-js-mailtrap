import {withResults} from './utils';
import {map, merge} from 'lodash';
import Collection from './Collection';
import Query from './Query';
import Mailtrap from './Mailtrap';

class Model {
    static hydrate(items) {
        return new Collection(
            map(items, (item) => new this(item))
        );
    }

    constructor(attributes = {}) {
        this.attributes = attributes;
        this.relations = {};
    }

    _get(path, params) {
        return this.performRequest('GET', path, params);
    }

    _post(path, params) {
        return this.performRequest('POST', path, params);
    }

    _patch(path, params) {
        return this.performRequest('PATCH', path, params);
    }

    _delete(path, params) {
        return this.performRequest('DELETE', path, params);
    }

    performRequest(method, path, params, update_attributes = true) {
        return withResults(Mailtrap.getClient(), (client) => {
            let promise = client.request(method, path, params);

            if (update_attributes) {
                promise.then((response) => this.updateAttributes(response.data));
            }

            return promise;
        });
    }

    updateAttributes(attributes = []) {
        this.attributes = merge(this.attributes, attributes);

        return this;
    }

    static where(key, value) {
        return new Query(this)
            .where(key, value);
    }

    loadRelationship(relationship, loadFn) {
        if (!(relationship in this.relations)) {
            this.relations[relationship] = loadFn.call(this);
        }

        return this.relations[relationship];
    }

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
     * @return {mixed}
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
     * @return {mixed}
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
     * @return {self}
     */
    setAttribute(attribute, value) {
        this.attributes[attribute] = value;

        return this;
    }
}

module.exports = Model;
