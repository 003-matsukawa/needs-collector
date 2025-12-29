import pg from 'pg';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const DATABASE_URL = "postgresql://postgres:Bv9breFZ%24%40C55bG@db.hwkjfzopcttedepxfrgw.supabase.co:5432/postgres";

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

async function createUser() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  const userId = generateId();
  const accountId = generateId();
  const hashedPassword = await bcrypt.hash("1515g3genki65003", 10);
  const now = new Date().toISOString();

  try {
    // Delete existing user if exists
    await client.query(`DELETE FROM accounts WHERE user_id IN (SELECT id FROM users WHERE email = $1)`, ['beecome003@bebeecome.com']);
    await client.query(`DELETE FROM users WHERE email = $1`, ['beecome003@bebeecome.com']);

    // Create user
    await client.query(`
      INSERT INTO users (id, name, email, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [userId, 'Jin', 'beecome003@bebeecome.com', true, now, now]);

    // Create credential account
    await client.query(`
      INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [accountId, userId, 'credential', userId, hashedPassword, now, now]);

    console.log('✅ User created successfully!');
    console.log('Email: beecome003@bebeecome.com');
    console.log('Password: 1515g3genki65003');
    console.log('User ID:', userId);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

createUser().catch(console.error);
