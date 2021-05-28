import Cache from '@blued-core/cache-intl'

export interface Loggers { accessLog: (res: any) => any, errorLog: (res: any) => any }

export interface LoggerIntl {
  logType: string
  logPath: string
  isLocal?: boolean
  cache?: Cache<Loggers>
  getLogger: (logType: string) => LoggerClient
  buildLogger: (logType: string) => Loggers
}

export interface LoggerClient {
  access: (data?: Record<string, any>) => void
  error: (error: Error, data?: Record<string, any>) => void
}

export default abstract class Logger implements LoggerIntl {
  public logType: string

  private colors: any

  constructor (
    public logPath: string,
    public cache: Cache<Loggers>,
    public isLocal: boolean = false
  ) {
    if (isLocal) {
      this.colors = require('colors')
    }
  }

  getLogger (logType: string) {
    const logger = this.buildLogger(logType)
    const { colors, isLocal } = this
    const now = Date.now()
    const datetime = formatTime(now)

    return {
      access (data?: Record<string, any>) {
        if (isLocal) {
          console.log(colors.green(data))
        }
        logger.accessLog({
          ...data,
          ms_timestamp: now,
          datetime,
        })
      },
      error (error: Error, data?: Record<string, any>) {
        const err = {
          err_msg: error.message,
          err_name: error.name,
          err_stack: error.stack,
          error,
        }

        const results = { ...err, ...data, ms_timestamp: now, datetime }

        // 添加本地环境的colors输出
        if (isLocal) {
          console.error(colors.red(results))
        }
        logger.errorLog(results)
      },
    }
  }

  abstract buildLogger (logType: string): Loggers
}

function formatTime(time: number): string {
  const date = new Date(time)
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const H = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return `${Y}-${M < 10 ? `0${M}` : M}-${D} ${H}:${m}:${s}`
}
