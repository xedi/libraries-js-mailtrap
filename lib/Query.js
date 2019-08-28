class Query {
    constructor(model) {
        this.model = model;

        this.wheres = {};
    }

    where(key, value) {
        this.wheres[key] = value;

        return this;
    }

    get(id) {
        if (typeof id === undefined) {
            return this.model.list(this.wheres);
        }

        return this.model.find(id, this.wheres);
    }
}
