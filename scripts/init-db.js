const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'duty_pilot',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

const createTablesQuery = `
  -- Create lists table
  CREATE TABLE IF NOT EXISTS lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Create duties table (if not exists) - without list_id initially
  CREATE TABLE IF NOT EXISTS duties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes (except list_id index, which will be created after column exists)
  CREATE INDEX IF NOT EXISTS idx_duties_created_at ON duties(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_lists_created_at ON lists(created_at DESC);
`;

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    const client = await pool.connect();

    // Create tables
    await client.query(createTablesQuery);

    console.log('✓ Database tables created successfully');

    // Add list_id column to duties if it doesn't exist (for existing databases)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'duties' AND column_name = 'list_id'
        ) THEN
          ALTER TABLE duties ADD COLUMN list_id UUID REFERENCES lists(id) ON DELETE CASCADE;
        END IF;
      END $$;
    `);

    // Create index for list_id after ensuring column exists
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_duties_list_id ON duties(list_id);
    `);

    // Add status column to duties if it doesn't exist
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'duties' AND column_name = 'status'
        ) THEN
          ALTER TABLE duties ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';
        END IF;
      END $$;
    `);

    // Create default list if it doesn't exist
    const defaultListResult = await client.query(`
      SELECT id FROM lists WHERE name = 'Minhas Tarefas' LIMIT 1
    `);

    if (defaultListResult.rows.length === 0) {
      await client.query(`
        INSERT INTO lists (name) VALUES ('Minhas Tarefas')
      `);
      console.log('✓ Default list "Minhas Tarefas" created');
    }

    // Show table structures
    console.log('\n✓ Lists table structure:');
    const listsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'lists'
      ORDER BY ordinal_position;
    `);
    listsResult.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    console.log('\n✓ Duties table structure:');
    const dutiesResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'duties'
      ORDER BY ordinal_position;
    `);
    dutiesResult.rows.forEach((row) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    client.release();
    await pool.end();

    console.log('\n✓ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();
