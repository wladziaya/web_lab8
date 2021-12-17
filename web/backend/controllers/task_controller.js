const TaskService = require('../services/task_service')
const RepeatService = require('../services/repeat_service')
const PlatformService = require('../services/platform_service')

const Task = require('../entities/task')
const Repeat = require('../entities/repeat')
const Platform = require('../entities/platform')

const Session = require('../entities/session')

const { getRequestBody } = require('../utils/util')

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
    
            console.log(`[ TaskController ] - create: session`)
            console.log(session)
    
            // todo consider having session check
            if (!session) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                return {'error': {'code': 400}}
            }
    
            const task = new Task(undefined, title, url, dttm, session['user_id'], 0)
            const taskId = await this.taskService.create(task)
            console.log('[ TaskController ] - create: Task created')
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.create(repeat)
            console.log('[ TaskController ] - create: Repeat created')
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.create(platform)
            console.log('[ TaskController ] - create: Platform created')
           
            res.writeHead(200, {'Content-Type': 'application/json'})
            return {taskId}
        } catch (error) {
            console.log(error)
        }
    }

    // GET
    async findAll(client) {
        try {
            const { res } = client
            const session = await Session.get(client)
            res.writeHead(200, {'Content-Type': 'application/json'})    
            return await this.taskService.findAll(session['user_id'])
        } catch (error) {
            console.log(error)
        }
    }

    // PUT 
    async update(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const { taskId, title, url, dttm, delta, repeatTitle, platformTitle } = body
            const session = await Session.get(client)
    
            const task = new Task(taskId, title, url, dttm, session['user_id'], 0)
            const successUpdate = await this.taskService.update(task)
    
            if (!successUpdate) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                return {'error': {'code': 400, 'message': 'Can`t update task: task doesn`t exist or you don`t have rights to update it'}}
            }
    
            const repeat = new Repeat(delta, repeatTitle, taskId)
            await this.repeatService.update(repeat)
    
            const platform = new Platform(platformTitle, taskId)
            await this.platformService.update(platform)
            
            res.writeHead(200, {'Content-Type': 'application/json'})
            return {taskId}
        } catch (error) {
            console.log(error)
        }
    }

    // DELETE
    async delete(client) {
        try {
            const { req, res } = client
            const body = await getRequestBody(req)
            const session = await Session.get(client)
            const successDelete = await this.taskService.delete(session['user_id'], body.taskId)
            if (!successDelete) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                return {'error': {'code': 400, 'message': 'Can`t delete task: task doesn`t exist or you don`t have rights to delete it'}}
            }
            res.writeHead(200, {'Content-Type': 'application/json'})
            return {'taskId': body.taskId}
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = TaskController