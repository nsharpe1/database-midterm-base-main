const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'postgres', //This should be changed to reflect your actual database
  password: 'Keyin123', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  /*
  const query = `
    CREATE TABLE movies (
      movies_id SERIAL PRIMARY KEY,
      title TEXT,
      year TEXT,
      genre TEXT,
      director_name TEXT
    );
  `;
  await pool.query(query);

  const secondquery = `
    CREATE TABLE customers (
      customers_id SERIAL PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email_address TEXT,
      phone_number TEXT
    );
  `;
  await pool.query(secondquery);
  
  const thirdquery = `
    CREATE TABLE rentals (
      rentals_id SERIAL PRIMARY KEY,
      person_movie_rented TEXT,
      movie_rented TEXT,
      date_movie_rented DATE,
      date_movie_returned DATE,
      movies_id INT REFERENCES movies(movies_id),
      customers_id INT REFERENCES customers(customers_id)
    );
  `;
  await pool.query(thirdquery);
  */
};
/**
 * Inserts a new movie into the Movies table.
 * 
 * @param {string} title Title of the movie
 * @param {string} year
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  const query = {
    text: `INSERT INTO movies (title year genre director_name) VALUES ($1 $2, $3, $4)`,
    values: [title, year, genre, director]
  }
  await pool.query(query);
};

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  const result = await pool.query("SELECT * FROM movies");
  result.rows.forEach((row) => console.log(row));
};

/**
 * Updates a customer's email address.
 * 
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  /*
    UPDATE customers
    SET email_address = 'johndoe@gmail.com'
    WHERE customers_id = 5;
  */

  await pool.query('UPDATE customers SET email_address = $1 WHERE customers_id = $2', [ newEmail, customerId ]);
  console.log('Customer email updated!');
};

/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  /*
    DELETE FROM rentals WHERE customers_id = 3;
    DELETE FROM customers WHERE customers_id = 3;
  */

  await pool.query('DELETE FROM rentals WHERE customers_id = $1', [ customerId ]);
  await pool.query('DELETE FROM customers WHERE customers_id = $1', [ customerId ]);
  console.log("Sucessfully removed customer!");
};

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log('  update <customer_id> <new_email> - Update a customer\'s email');
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], args[2], args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
};

runCLI();
