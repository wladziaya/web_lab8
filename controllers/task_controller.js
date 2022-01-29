const TaskService = require('../services/task_service')
const RepeatService = require('../services/repeat_service')
const PlatformService = require('../services/platform_service')

const Session = require('../entities/session')
const Logger = require('../utils/logger')

const { getRequestBody, noJSONBodyHandler: operationFailedHandler } = require('../utils/util')

const { STATUS_CODES, MIME_TYPES, LOGS_FILEPATH, ERROR_MESSAGES } = require('../config')

const logger = new Logger(LOGS_FILEPATH, __filename)

class TaskController {

    constructor() {
        this.taskService = new TaskService()
        this.repeatService = new RepeatService()
        this.platformService = new PlatformService()
    }

    // POST
    async create(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)  
            const { title, url, dttm, delta, repeatTitle, platformTitle } = body
            const session = await Session.get(client)
    
            const taskId = await this.taskService.create(title, dttm, url, session['user_id'], 1)
            await logger.debug('Create: Task created')
    
            await this.repeatService.create(delta, repeatTitle, taskId)
            await logger.debug('Create: Repeat created')
    
            await this.platformService.create(platformTitle, taskId)
            await logger.debug('Create: Platform created')
           
            res.writeHead(STATUS_CODES.CREATED, {'Content-Type': MIME_TYPES.JSON})
            return {taskId}
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // GET
    async findAll(client) {
        try {
            const { res } = client
            const session = await Session.get(client)
            res.writeHead(STATUS_CODES.OK, {'Content-Type': MIME_TYPES.JSON})
            const tasks = await this.taskService.findAllByUserId(session['user_id'])
            await logger.debug(`FindAll: ${tasks.length} Tasks found`)
            return tasks
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // PUT 
    async update(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const { taskId, title, url, dttm, delta, repeatTitle, platformTitle } = body
            const session = await Session.get(client)
    
            const successUpdate = await this.taskService.update(taskId, title, dttm, url, session['user_id'])
            await logger.debug(`Update: successUpdate=${successUpdate}`)

            if (!successUpdate) return operationFailedHandler(res, ERROR_MESSAGES.CANNOT_UPDATE_TASK)
    
            await this.repeatService.update(delta, repeatTitle, taskId)
    
            await this.platformService.update(platformTitle, taskId)
            
            res.writeHead(STATUS_CODES.NO_CONTENT)
            return ''
        } catch (error) {
            await logger.error(error.message)
        }
    }

    // DELETE
    async delete(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const session = await Session.get(client)
            const successDelete = await this.taskService.delete(session['user_id'], body.taskId)
            await logger.debug(`Delete: successDelete=${successDelete}`)

            if (!successDelete) return operationFailedHandler(res, ERROR_MESSAGES.CANNOT_DELETE_TASK)

            res.writeHead(STATUS_CODES.NO_CONTENT)
            return ''
        } catch (error) {
            await logger.error(error.message)
        }
    }

}

module.exports = TaskController