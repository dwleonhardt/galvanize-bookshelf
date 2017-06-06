
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('users', function(users) {
    users.increments();
    users.string('first_name').notNullable().defaultTo('');
    users.string('last_name').notNullable().defaultTo('');
    users.string('email').notNullable().unique();
    users.specificType('hashed_password', 'char(60)').notNullable();
    users.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users');
};
