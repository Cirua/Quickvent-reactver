import pg from "pg";

const { Client } = pg;
let client;

export const getDBClient = () => {
   if (!client) {
      throw new Error("Database client is not initialized. Call connectDB() first.");
   }
   return client;
};

export const connectDB = async () => {
   try {
      const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.PG_URL;
      const useConnectionString = Boolean(connectionString);
      const sslEnabled = process.env.PG_SSL === "true" || process.env.NODE_ENV === "production";

      if (!useConnectionString && process.env.NODE_ENV === "production" && process.env.PG_HOST === "localhost") {
         throw new Error("Invalid production DB config: PG_HOST cannot be localhost. Set DATABASE_URL or POSTGRES_URL.");
      }

      const config = useConnectionString
         ? {
              connectionString,
              ssl: sslEnabled ? { rejectUnauthorized: false } : false,
           }
         : {
              host: process.env.PG_HOST,
              port: Number(process.env.PG_PORT || 5432),
              user: process.env.PG_USER,
              password: process.env.PG_PASSWORD,
              database: process.env.PG_DATABASE,
              ssl: sslEnabled ? { rejectUnauthorized: false } : false,
           };

      client = new Client(config);

      await client.connect();
      await client.query(`
         CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
         )
      `);
      console.log("Connected to the database");
   } catch (error) {
      console.error("Error connecting to the database", error);
      process.exit(1); // 1 means fail and 0 means success
   }
};