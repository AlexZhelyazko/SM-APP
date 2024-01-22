import mysql from "mysql";

export const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "[your username]",
  password: "[your password]",
  database: "[db name]",
});
