const mysql = require('mysql2/promise')

const { db, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const GET_SQL = 'SELECT * FROM session WHERE id = ?'
const SAVE_SQL = 'INSERT INTO session VALUES (?, ?, ?)'
const DELETE_SQL = 'DELETE FROM session WHERE id = ?'

class SessionGateway {
    
    async get(token) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(GET_SQL, [token])
                return rows[0]
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't get Session: ${error}`
            await logger.error(message)
            throw new Error(message)
        }   
    }

    async save(token, userId, startTime) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                await conn.execute(SAVE_SQL, [token, userId, startTime])
                return true
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't save Session: ${error}`
            await logger.error(message)
            throw new Error(error)
        }
    }

    async delete(token) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                await conn.execute(DELETE_SQL, [token])
                return true   
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't delete Session: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }
}

module.exports = SessionGateway