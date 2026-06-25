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
      const useConnectionString = Boolean(process.env.DATABASE_URL);
      const sslEnabled = process.env.PG_SSL === "true" || process.env.NODE_ENV === "production";

      const config = useConnectionString
         ? {
              connectionString: process.env.DATABASE_URL,
              ssl: sslEnabled ? { rejectUnauthorized: false } : false,
           }
         : {
              host: process.env.PG_HOST,
              port: Number(process.env.PG_PORT),
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