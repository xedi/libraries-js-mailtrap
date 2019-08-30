/**
 * A Query Object helps convert database like querying into API params
 * @class
 */
class Query {
    /**
     * Construct an instance of a Query
     *
     * @constructor
     *
     * @param  {Model} model  The model the query relates to
     */
    constructor(model) {
        this.model = model;

        this.wheres = {};
    }

    /**
     * Add a condition to the query
     *
     * @param  {string} key  The alias for the condition
     * @param  {mixed} value  The Condition
     *
     * @return {Query}  Query Instance
     */
    where(key, value) {
        this.wheres[key] = value;

        return this;
    }

    /**
     * Perform the Query
     *
     * @param  {string} [id]  Optional id to search by
     *
     * @return {(Collection<Model>|Model)}  A Model or Collection of Models
     */
    get(id) {
        if (! id) {
            return this.model.list(this.wheres);
        }

        return this.model.find(id, this.wheres);
    }
}

module.exports = Query;
