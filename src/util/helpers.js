export const history = require("history").createBrowserHistory({
    basename: '',
    forceRefresh: false,
    keyLength: 6,
    getUserConfirmation: (message, callback) => callback(window.confirm(message))
});