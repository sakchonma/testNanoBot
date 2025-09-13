import { fetchPrice } from '../utils/fetchPrice'
export default (Agenda: any) => {
    Agenda.define('FETCH_PRICE', async (job: any, done: any) => {
        const getdate = new Date()
        const logInfo = 'FETCH_PRICE' + ' (' +
            (getdate.getHours() < 10 ? '0' + getdate.getHours() : getdate.getHours()) + ':' +
            (getdate.getMinutes() < 10 ? '0' + getdate.getMinutes() : getdate.getMinutes()) + ':' +
            (getdate.getSeconds() < 10 ? '0' + getdate.getSeconds() : getdate.getSeconds()) + ') '
        console.log(logInfo)
        await fetchPrice()
        done()
    })

    Agenda.every('*/20 * * * *', 'FETCH_PRICE')
    Agenda.start()
}