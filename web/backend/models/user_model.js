const mysql = require('mysql2/promise')
const { db } = require('../config')

class UserModel {

    constructor() {
        this.storage = []
    }

    async save(user) {
        try {
            const { username, password, firstName, lastName } = user
            const sql = 'INSERT INTO user VALUES (NULL, ?, ?, ?, ?)'
            const conn = await mysql.createConnection(db)
            await conn.query(sql, [username, password, firstName, lastName])
            await conn.end()
            return true
        } catch (error) {
            throw new Error(error)
        }
    }

    async findUserByUsername(username) {
        try {
            const sql = 'SELECT * FROM user WHERE username = ?'
            const conn = await mysql.createConnection(db)
            const [rows] = await conn.query(sql, [username])
            await conn.end()
            return rows[0]
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = UserModel