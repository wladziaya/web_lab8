const TaskService = require('../services/task_service')
const RepeatService = require('../services/repeat_service')
const PlatformService = require('../services/platform_service')

const Task = require('../entities/task')
const Repeat = require('../entities/repeat')
const Platform = require('../entities/platform')

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
    
            const task = new Task(undefined, title, url, dttm, session['user_id'], 1)
            const taskId = await this.taskService.create(task)
            await logger.debug('Create: Task created')
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.create(repeat)
            await logger.debug('Create: Repeat created')
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.create(platform)
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
            const tasks = await this.taskService.findAll(session['user_id'])
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
    
            const task = new Task(taskId, title, url, dttm, session['user_id'], 1)
            const successUpdate = await this.taskService.update(task)
            await logger.debug(`Update: successUpdate=${successUpdate}`)

            if (!successUpdate) return operationFailedHandler(res, ERROR_MESSAGES.CANNOT_UPDATE_TASK)
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.update(repeat)
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.update(platform)
            
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