const User = require('../entities/user')
const UserRepository = require('../repositories/user_repository')

class UserService {

    constructor() {
        this.userModel = new UserRepository()
    }

    async save(user) {
        // todo add data validation
        return await this.userModel.save(user)
    }

    async findByUsername(username) {
        const data = await this.userModel.findByUsername(username)
        return new User(data['first_name'], data['last_name'], data['username'], data['password'], data['id'])
    }

}

module.exports = UserService