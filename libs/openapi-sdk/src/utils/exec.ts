/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect'
import { spawn } from 'child_process'
export function exec(
  command: string,
  args: string[],
  logger: BuilderContext['logger'],
) {
  logger.info(`Running: ${command}, with args: ${args}`)
  return new Promise<BuilderOutput>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
    })
    child.stdout.on('data', (data: string) => logger.info(`${data}`))
    child.stderr.on('data', (data: string) => logger.warn(`${data}`))
    child.on('close', (code, signal) => {
      if (code !== 0) {
        logger.error(`Error building: '${command} ${args.join(' ')}'`)
        logger.error(`exit code: ${code}`)
        return reject(
          new Error(
            `Openapi was not successful - exit code: ${code} - signal: ${signal}`,
          ),
        )
      }
      logger.info(`Openapi sdk generated`)
      return resolve({ success: code === 0 })
    })
  })
}
