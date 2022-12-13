const mysql = require('mysql2/promise')
const { db, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const CREATE_SQL = 'INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, ?)'
const FIND_BY_USERNAME_SQL = 'SELECT * FROM user WHERE username = ?'
const FIND_BY_ID_SQL = 'SELECT username, first_name, last_name, `group`, `variant` FROM user WHERE id = ?'

class UserGateway {

    async create(firstName, lastName, username, password, group, variant) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(CREATE_SQL, [username, password, firstName, lastName, group, variant])
                return rows.insertId
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't create User: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async findByUsername(username) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(FIND_BY_USERNAME_SQL, [username])
                return rows[0]
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't find User by username: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async findById(id) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(FIND_BY_ID_SQL, [id])
                console.log(rows[0])
                return rows[0]
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't find User by id: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }
}

module.exports = UserGateway