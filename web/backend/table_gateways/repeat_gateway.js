const mysql = require('mysql2/promise')
const { db, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const CREATE_SQL = 'INSERT INTO `repeat` VALUES (NULL, ?, ?, ?)'
const UPDATE_SQL = 'UPDATE `repeat` SET delta = ?, title = ? WHERE task_id = ?'

class RepeatGateway {

    async create(delta, title, taskId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(CREATE_SQL, [delta, title, taskId])
                return rows.insertId
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't create Repeat: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async update(delta, title, taskId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(UPDATE_SQL, [delta, title, taskId])
                return rows.changedRows > 0
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't update Repeat: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

}

module.exports = RepeatGateway