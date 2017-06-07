
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('favorites', function(favorite) {
    favorite.increments();
    favorite.integer('book_id').references('id').inTable('books').onDelete('cascade').notNullable();
    favorite.integer('user_id').references('id').inTable('users').onDelete('cascade').notNullable();
    favorite.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('favorites');
};
