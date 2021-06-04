import * as Bunyan from "bunyan"

/**
 * 
 * @param name 
 * @param loglevel  to override log level
 * @returns 
 */
export const getLogger = (name: string, loglevel = "debug") => {
    const level = process.env.LOG_LEVEL as Bunyan.LogLevelString || loglevel
    return Bunyan.createLogger({
        name: name,
        level: level,
        src: true
    })
}