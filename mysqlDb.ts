import mysql, {Connection} from 'mysql2/promise';

let connection: Connection;

const mysqlDb = {
    async init() {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.PASSWORD_MYSQL || '',
            database: 'inventory'
        })
    },
    async getConnection() {
        return connection;
    }
}

export default mysqlDb;