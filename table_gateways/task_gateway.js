const mysql = require('mysql2/promise')
const { db, LOGS_FILEPATH } = require('../config')

const Logger = require('../utils/logger')
const logger = new Logger(LOGS_FILEPATH, __filename)

const CREATE_SQL = 'INSERT INTO task VALUES (NULL, ?, ?, ?, ?, ?)'
const FIND_ALL_BY_USERNAME_SQL = `
    SELECT t.id, t.title, t.url, t.dttm, r.delta, r.title AS repeatTitle, p.title AS platformTitle
    FROM task AS t
    INNER JOIN \`repeat\` AS r ON t.id = r.task_id
    INNER JOIN \`platform\` AS p ON t.id = p.task_id
    WHERE user_id = ?;
`
const UPDATE_SQL = `
    UPDATE task SET
    user_id = ?, title = ?, url = ?, dttm = ?
    WHERE id = ? AND user_id = ?
`
const DELETE_SQL = 'DELETE FROM task WHERE user_id = ? AND id = ?'

class TaskGateway {

    async create(title, dttm, url, userId, statusId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(CREATE_SQL, [userId, title, url, dttm, statusId])
                return rows.insertId
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't create new task: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async findAllByUserId(userId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(FIND_ALL_BY_USERNAME_SQL, [userId])
                return rows
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't find tasks of user with id=${userId}: ${error}}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async update(id, title, dttm, url, userId) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(UPDATE_SQL, [userId, title, url, dttm, id, userId])
                return rows.changedRows > 0
            } finally { await conn.end() }
        } catch (error) {
            const message = `Can't update task: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

    async delete(userId, id) {
        try {
            const conn = await mysql.createConnection(db)
            try {
                const [rows] = await conn.execute(DELETE_SQL, [userId, id])
                return rows.affectedRows > 0
            } finally { await conn.end() }
        } catch(error) {
            const message = `Can't delete task with user_id=${userId} and id=${id}: ${error}`
            await logger.error(message)
            throw new Error(message)
        }
    }

}

module.exports = TaskGateway