module.exports = {
    tap(value, cb) {
        cb(value);

        return value;
    },
    with(value, cb = null) {
        return cb === null ? value : cb(value);
    }
};
