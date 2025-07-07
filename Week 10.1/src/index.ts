import { Client } from "pg";
require("dotenv").config();

const client = new Client({
    connectionString: process.env.DB_URL,
});

async function createUsersTable() {
    try {
        await client.connect();
        const result = await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table created or already exists.");
    }
    catch (err) {
        console.error("Error creating table:", err);
    }
    finally {
        await client.end();
    }
}


async function insertDatainUserTable(){
    try{
        await client.connect();
        const result = await client.query(`
            INSERT INTO users (username, email, password) VALUES ('mukul3333', 'mukul@gmail.com', 'muku1234')
        `)
        console.log("result is ", result);
    }
    catch(err){
        console.error("Error creating table:", err);
    }
    finally{
        await client.end();
    }
}

async function fetchUserByUsername(username : string) {
    try {
        await client.connect();
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await client.query(query, values);
        if(result.rows.length>0){
            console.log("Fetched user:", result.rows[0]); // assuming username is unique
        }
        else{
            console.log("no user found");
        }
    }
    catch (err) {
        console.error("Error fetching user:", err);
    }
    finally {
        await client.end();
    }
}


// createUsersTable();
// insertDatainUserTable();
fetchUserByUsername("mukul3333");


