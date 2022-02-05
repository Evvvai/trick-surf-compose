// tslint:disable-next-line:no-var-requires
const MySQLEvents = require('@rodrigogs/mysql-events')
import { db } from './config'
import AmqpProducer from './producer'
import { newComplete, newPlayer, newRecord, newTrick } from './utils'

/* A trigger that reacts to a new change in the database, made to catch new completes and records */
const program = async () => {
  const producer = new AmqpProducer()
  await producer.connect()

  // Create MySQLEvents
  const instance = new MySQLEvents(db, {
    startAtEnd: true, // to record only new binary logs
  })

  await instance.start()
  console.log('MySQLEvents started')

  instance.addTrigger({
    name: 'Monitor all SQL Statements',
    expression: process.env.DATABASE_SUBSCRIBTION + '.*', // listen to surfgxds database
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: (event: any) => {
      switch (event.type) {
        case 'INSERT':
          switch (event.table) {
            // Completes
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'completes':
              newComplete(event, producer)
              break

            // Time Records
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'twr_update':
              newRecord(event, producer, 'twr')
              break

            // Speed Records
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'swr_update':
              newRecord(event, producer, 'swr')
              break

            // New trick
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'tricks':
              // newTrick(event, producer)
              break

            // New player
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'players':
              newPlayer(event, producer)
              break
          }
          break
        default:
          break
      }
    },
  })

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error)
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error)
}
program().then()
