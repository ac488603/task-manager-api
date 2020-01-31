const request = require('supertest')
const app = require('../app')
const Task = require('../models/Task')
const {userOne, userOneID, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should create a new task for user', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description : "write philosphy paper"
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false)
})