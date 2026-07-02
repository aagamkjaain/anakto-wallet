import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

// Get absolute path of wallet.db in workspace root
const dbPath = path.resolve(process.cwd(), 'wallet.db');

export async function POST(req) {
  try {
    const { address, lowerLimit, upperLimit } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Connect to database
    const db = new sqlite3.Database(dbPath);

    // Wrap sqlite operations in Promises
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        // Create table if it doesn't exist
        db.run(
          `CREATE TABLE IF NOT EXISTS limits (
            address TEXT PRIMARY KEY,
            lower_limit REAL,
            upper_limit REAL
          )`,
          (err) => {
            if (err) reject(err);
          }
        );

        // Insert or update limits
        db.run(
          `INSERT OR REPLACE INTO limits (address, lower_limit, upper_limit) VALUES (?, ?, ?)`,
          [address.toLowerCase(), lowerLimit, upperLimit],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    db.close();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error in setlimits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
