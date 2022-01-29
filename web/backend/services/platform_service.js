const PlatformGateway = require('../table_gateways/platform_gateway')

class PlatformService {

    constructor() {
        this.platformGateway = new PlatformGateway()
    }

    async create(title, taskId) {
        return await this.platformGateway.create(title, taskId)
    }

    async update(title, taskId) {
        return await this.platformGateway.update(title, taskId)
    }
}

module.exports = PlatformService