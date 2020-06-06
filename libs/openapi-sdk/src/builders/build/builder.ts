/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect'
import { Observable, from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { BuildBuilderSchema } from './schema'
import { spawn } from 'child_process'
import { join } from 'path'
import { getSourceRoot } from '../../utils/normalize'
function exec(
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

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return from(getSourceRoot(context)).pipe(
    mergeMap(async (sourceRoot) => {
      const yamlFile = join(context.workspaceRoot, sourceRoot, 'openapi.yml')
      const outSrc = join(context.workspaceRoot, sourceRoot, 'src')
      return await exec(
        'npx',
        [
          `openapi-generator`,
          'generate',
          '-i',
          yamlFile,
          '-g',
          'typescript-axios',
          `--additional-properties=supportsES6=true,withInterfaces=true`,
          '-o',
          outSrc,
        ],
        context.logger,
      )
    }),
  )
}

export default createBuilder(runBuilder)
