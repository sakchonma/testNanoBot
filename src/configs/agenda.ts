import Agenda from 'agenda'

class AgendaController {
    constructor(app: any) {
        this.app = app
        this.agenda = null
    }

    app: any
    agenda: any

    connect(cb: any) {
        const _this = this;

        _this.agenda = new Agenda({
            db: {
                address: process.env.DB_DEV_URI || '',
                collection: 'jobs'
            }
        }, (err) => {
            if (err) return cb(err)

            _this.agenda._collection.update(
                { $and: [{ lockedAt: { $exists: true } }, { lockedAt: { $ne: null } }], lastFinishedAt: { $exists: false } },
                { $unset: { lockedAt: '', lastModifiedBy: '', lastRunAt: '' }, $set: { nextRunAt: new Date() } },
                { multi: true },
                (e: any) => {
                    if (e) console.error('Unable to remove stale jobs. Starting anyways.')

                    console.log('Agenda Ready!')
                    _this.agenda.start()

                    return cb(null, _this.agenda)
                })
        })
    }
};

export default AgendaController