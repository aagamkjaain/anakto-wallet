import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'wallet.db');

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    const db = new sqlite3.Database(dbPath);

    const limits = await new Promise((resolve, reject) => {
      // Create table if it doesn't exist, to prevent querying a non-existent table error
      db.serialize(() => {
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

        db.get(
          `SELECT lower_limit, upper_limit FROM limits WHERE address = ?`,
          [address.toLowerCase()],
          (err, row) => {
            if (err) reject(err);
            else resolve(row || null);
          }
        );
      });
    });

    db.close();

    if (limits) {
      return NextResponse.json({
        lowerLimit: limits.lower_limit,
        upperLimit: limits.upper_limit,
      });
    } else {
      return NextResponse.json({ lowerLimit: null, upperLimit: null });
    }
  } catch (error) {
    console.error('Database error in getlimits:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
