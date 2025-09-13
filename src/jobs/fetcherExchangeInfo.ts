import { fetcherExchangeInfo } from '../utils/fetcherExchangeInfo'
export default (Agenda: any) => {
    Agenda.define('FETCH_EXCHANGE_INFO', async (job: any, done: any) => {
        const getdate = new Date()
        const logInfo = 'FETCH_EXCHANGE_INFO' + ' (' +
            (getdate.getHours() < 10 ? '0' + getdate.getHours() : getdate.getHours()) + ':' +
            (getdate.getMinutes() < 10 ? '0' + getdate.getMinutes() : getdate.getMinutes()) + ':' +
            (getdate.getSeconds() < 10 ? '0' + getdate.getSeconds() : getdate.getSeconds()) + ') '
        console.log(logInfo)
        await fetcherExchangeInfo()
        done()
    })

    Agenda.every('20 * * * * *', 'FETCH_EXCHANGE_INFO')
    Agenda.start()
}