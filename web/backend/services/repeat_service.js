const RepeatGateway = require('../table_gateways/repeat_gateway')

class RepeatService {

    constructor() {
        this.repeatGateway = new RepeatGateway()
    }

    async create(delta, title, taskId) {
        return await this.repeatGateway.create(delta, title, taskId)
    }

    async update(delta, title, taskId) {
        return await this.repeatGateway.update(delta, title, taskId)
    }

}

module.exports = RepeatService