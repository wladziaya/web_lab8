const mysql = require('mysql2/promise')
const { db, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const CREATE_SQL = 'INSERT INTO platform VALUES(NULL, ?, ?)'
const UPDATE_SQL = 'UPDATE platform SET title = ? WHERE task_id = ?'

class PlatformGateway {

    async create(title, taskId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(CREATE_SQL, [title, taskId])
                return rows.insertId
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't create platform: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async update(title, taskId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(UPDATE_SQL, [title, taskId])
                return rows.changedRows > 0
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't update platform: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }
}

module.exports = PlatformGateway