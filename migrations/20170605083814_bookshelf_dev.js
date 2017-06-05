
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('books', function(book) {
    book.increments();
    book.string('title').notNullable().defaultTo('');
    book.string('author').notNullable().defaultTo('');
    book.string('genre').notNullable().defaultTo('');
    book.text('description').notNullable().defaultTo('');
    book.text('cover_url').notNullable().defaultTo('');
    book.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('books');
};
