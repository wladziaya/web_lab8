const TaskGateway = require('../table_gateways/task_gateway')

class TaskService {

    constructor() {
        this.taskGateway = new TaskGateway()
    }

    async create(title, dttm, url, userId, statusId) {
        return await this.taskGateway.create(title, dttm, url, userId, statusId)
    }

    async findAllByUserId(userId) {
        return await this.taskGateway.findAllByUserId(userId)
    }

    async update(id, title, dttm, url, userId) {
        return await this.taskGateway.update(id, title, dttm, url, userId)
    }

    async delete(userId, id) {
        return await this.taskGateway.delete(userId, id)
    }

}

module.exports = TaskService