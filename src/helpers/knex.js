const knex = require('knex')({
    client: 'pg',
    connection: 'postgres://ydqebfay:8j0Gx-PNrUIeY4s7bGWAS13dhNL7i5nJ@baasu.db.elephantsql.com:5432/ydqebfay',
    searchPath: 'knex,public',
    useNullAsDefault:true
});

module.exports = knex;