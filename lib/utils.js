module.exports = {
    tap(value, cb) {
        cb(value);

        return value;
    },
    withResults(value, cb = null) {
        return cb === null ? value : cb(value);
    },
};
