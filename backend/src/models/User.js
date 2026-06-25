import { getDBClient } from "../lib/db.js";

class User {
    static async findOne({ where: { email } }) {
        const client = getDBClient();
        const result = await client.query(
            "SELECT id, email, password FROM users WHERE email = $1 LIMIT 1",
            [email]
        );
        return result.rows[0] || null;
    }

    static async create({ email, password }) {
        const client = getDBClient();
        const result = await client.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, password",
            [email, password]
        );
        return result.rows[0] || null;
    }
}

export default User;
 