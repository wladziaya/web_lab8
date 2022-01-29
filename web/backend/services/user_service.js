const User = require('../entities/user')
const UserGateway = require('../table_gateways/user_gateway')

class UserService {

    constructor() {
        this.userGateway = new UserGateway()
    }

    async create(firstName, lastName, username, password) {
        // todo add data validation
        return await this.userGateway.create(firstName, lastName, username, password)
    }

    async findByUsername(username) {
        try {
            const data = await this.userGateway.findByUsername(username)
            return new User(data['first_name'], data['last_name'], data['username'], data['password'], data['id'])
        } catch (error) {
            if (error instanceof TypeError) return
            throw new Error(error)
        }
    }

    async findById(id) {
        return await this.userGateway.findById(id)
    }

}

module.exports = UserService