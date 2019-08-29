describe('Message', () => {
    describe('list', () => {
        it('Should return an empty Collection for no results');
        it('Should return a Collection of Message instances');
    });

    describe('find', () => {
        it('Should return a single Message instance');
    });

    describe('markRead', () => {
        it('Should mark a Message instance as read');
    });

    describe('delete', () => {
        it('Should delete a Message instance');
    });

    describe('getHTMLBody', () => {
        it('Should return the HTML content of the message body');
    });
});
