import express, { json } from 'express'
import logger from './middlewares/error/logger';
import responder from './middlewares/error/responder';
import config from 'config'
import sequelize from './db/sequelize';
import cors from 'cors'
import { createAppBucketIfNotExists } from './aws/aws';
import fileUpload from 'express-fileupload';
import authRouter from './routers/auth';
import enforceAuth from './middlewares/enforce-auth';
import notFound from './middlewares/not-found';
import vacationsRouter from './routers/vacations';
import likesRouter from './routers/likes';
import reportsRouter from './routers/reports';

const app = express()

const port = config.get<number>('app.port')
const appName = config.get<string>('app.name')
const secret = config.get<string>('app.secret')

console.log(`app secret is ${secret}`)

app.use(cors())

app.use(json())
app.use(fileUpload())

app.use('/auth', authRouter)
app.use(enforceAuth)
app.use('/vacations', vacationsRouter)
app.use('/likes', likesRouter)
app.use('/reports',reportsRouter)


app.use(notFound)

app.use(logger)
app.use(responder)


// sequelize.sync()
sequelize.sync({ alter: true })
// sequelize.sync({ force: process.argv[2] === 'sync' })

createAppBucketIfNotExists()

// testUpload()

console.log(process.argv)

app.listen(port, () => console.log(`${appName} started on port ${port}`))