const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'vF0qlVan41PxqjV8rBgI43buj',
    appSecret: 'rpWszKjoIAdLgYfOic5XzBYStvttPV2rOy1OgDZ8fd5lHaSEGf',
    accessToken: '1637800315167682561-gzeKfJuOJmlGgc4Fzazksk8mMTpfxc',
    accessSecret: 'rpWszKjoIAdLgYfOic5XzBYStvttPV2rOy1OgDZ8fd5lHaSEGf',
});

module.exports = client