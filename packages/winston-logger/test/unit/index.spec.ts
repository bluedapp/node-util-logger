/* eslint-disable import/no-extraneous-dependencies */
import Logger from '../../src/index'

describe('normal', () => {
  it(`output logs`, done => {
    const loggerClient = new Logger('logs', new Map(), true)
    try {
      const logger = loggerClient.getLogger('test')
      logger.access({ msg: 'test' })
      logger.error(new Error('test error'), { msg: 'test' })
      logger.info({ msg: 'testi info' })
    } catch (e) {
      console.log(e)
    }
    done()
  })
})
