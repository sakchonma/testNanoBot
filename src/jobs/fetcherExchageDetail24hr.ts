import { fetchAndSaveExchangeDetails } from '../utils/fetcherExchageDetail24hr'
export default (Agenda: any) => {
    Agenda.define('FETCH_EXCHANGE_24HR', async (job: any, done: any) => {
        const getdate = new Date()
        const logInfo = 'FETCH_EXCHANGE_24HR' + ' (' +
            (getdate.getHours() < 10 ? '0' + getdate.getHours() : getdate.getHours()) + ':' +
            (getdate.getMinutes() < 10 ? '0' + getdate.getMinutes() : getdate.getMinutes()) + ':' +
            (getdate.getSeconds() < 10 ? '0' + getdate.getSeconds() : getdate.getSeconds()) + ') '
        console.log(logInfo)
        await fetchAndSaveExchangeDetails()
        done()
    })

    Agenda.every('40 * * * * *', 'FETCH_EXCHANGE_24HR')
    Agenda.start()
}