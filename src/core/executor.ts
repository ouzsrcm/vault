import { exec } from "child_process"
import * as util from "util"
import * as logger from "./logger"
import { LogLevel } from "./enums"
const execPromise = util.promisify(exec)

export async function executeCommand(command: string) {
    try {
        const { stdout, stderr } = await execPromise(command)
        if (stderr) {
            logger.text(`Error: ${stderr}`, LogLevel.ERROR)
        }
        return stdout
    } catch (error) {
        logger.text(`Error: ${error}`, LogLevel.ERROR)
    }
}