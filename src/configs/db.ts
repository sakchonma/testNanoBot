import mongoose from "mongoose"
mongoose.Promise = global.Promise
import AgendaController from './agenda'
class MongooseController {
  constructor(app: any) {
    this.db = null
    this.agendaController = new AgendaController(app)
  }

  db: any
  agendaController: any

  async connect(cb: any) {
    try {
      const agendaEnv = process.env.AGENDA || false;
      this.db = await mongoose.connect(process.env.DB_DEV_URI || '',)
      if (agendaEnv == "1") {
        this.agendaController.connect((err: any, agenda: any) => {
          if (err) return cb(err)
          console.log('Mongoose Ready!')
          return cb(null, {
            db: this.db,
            agenda: agenda
          })
        })
      } else {
        return cb(null, {
          db: this.db,
          agenda: null
        })
      }

    } catch (err) {
      console.log('Mongoose connect error', err)
    }
  }
}

export default MongooseController