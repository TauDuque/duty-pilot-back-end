const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'duty_pilot',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS duties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_duties_created_at ON duties(created_at DESC);
`;

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    const client = await pool.connect();

    await client.query(createTableQuery);

    console.log('✓ Database tables created successfully');

    // Check if table exists and show structure
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'duties'
      ORDER BY ordinal_position;
    `);

    console.log('✓ Table structure:');
    result.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    client.release();
    await pool.end();

    console.log('✓ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
