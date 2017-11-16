// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://ydqebfay:8j0Gx-PNrUIeY4s7bGWAS13dhNL7i5nJ@baasu.db.elephantsql.com:5432/ydqebfay',
    searchPath: 'public',
    setNullAsDefault: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
