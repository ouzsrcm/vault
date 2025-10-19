import { LogLevel } from './enums'

export async function text(message: string, level: LogLevel = LogLevel.INFO) {
    console.log(`[${level.toUpperCase()}]: ${message}`)
}

export async function object(message: string, level: LogLevel = LogLevel.INFO, obj: object) {
    console.log(`[${level.toUpperCase()}]: ${message}`, JSON.stringify(obj))
}