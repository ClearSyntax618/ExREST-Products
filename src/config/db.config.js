import pg from 'pg';
const { Pool } = pg;

const uri = process.env.DB_URI;

const pool = new Pool({
    connectionString: uri,
});

export {
    pool
}