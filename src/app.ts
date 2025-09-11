'use strict';

import dotenv from 'dotenv'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import express from 'express'
import Redis from 'ioredis';
import { Collection, Document } from "mongodb";
dotenv.config()

import routes from './routes'
import MongooseController from './configs/db'
import { EventEmitter } from 'events';
import { IPoolType } from "./types/jobs"
const PORT = process.env.PORT

const app = express()
app.use(helmet())
app.use(bodyParser.json({ limit: "10mb" }))
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }))

const mongooseController = new MongooseController(app)

mongooseController.connect(async (err: any, result: any) => {
    if (err) throw err.message

    try {
        const db = result.db
        const agenda = result.agenda;
        const connection = db.connection;
        const agendaEnv = process.env.AGENDA || null
        if (agendaEnv == "1") {
            const jobsCollection: Collection<Document> = connection.db.collection("jobs");

            const result = await jobsCollection.deleteMany({});
            console.log(
                `CLEAR JOB DONE { deletedCount: ${result.deletedCount} } `
            );
            const emitter = new EventEmitter()
            emitter.on("CREATE_FETCH", async (data: IPoolType) => {
                var job = agenda.create("JOB-FETCH", data)
                job.schedule(data.date_tigger)
                await job.save()
            })
            agenda.on("ready", () => {
                agenda.start()
            })
        }

        db.connection.on('connected', () => console.log("Server api connected to MongoDB !", "MONGODB"))

        db.connection.on('error', (err: any) => {
            console.log("Server api MongoDB Error" + err, "MONGODB")
        })

        db.connection.on('disconnected', () => console.log("Server api disconnected from MongoDB !", "MONGODB"))
        const redis_env = process.env.REDIS_URL || null
        if (redis_env) {
            const redis = new Redis(redis_env);

            redis.set("test", "Radis Ready!");
            redis.get("test").then(console.log);
        }

        app.use('/api', routes)
        app.listen(PORT, async () => {
            if (agendaEnv == "1") {

            }
            console.log("Server api is ready on!!")
        })

    } catch (error) {
        console.log(error)
    }
})