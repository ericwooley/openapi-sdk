/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect'
import { Observable, from } from 'rxjs'
import { mergeMap, map } from 'rxjs/operators'
import { BuildBuilderSchema } from './schema'
import { spawnSync } from 'child_process'
import { join } from 'path'
import { inspect } from 'util'
import { getSourceRoot } from '../../utils/normalize'
function exec(
  command: string,
  args: string[],
  logger: BuilderContext['logger'],
) {
  logger.error(`Running: ${command}, with args: ${args}`)
  return new Promise<BuilderOutput>((resolve, reject) => {
    const {
      status,
      signal,
      output: [, stdout, stderr],
    } = spawnSync(command, args, {
      shell: true,
    })
    logger.info(
      inspect({
        status,
        signal,
        stdout: stdout.toString(),
        stderr: stderr.toString(),
      }),
    )
    if (status !== 0) {
      logger.error(`Error building: '${command}'`)
      logger.error(`exit code: ${status}`)
      return reject(new Error(`Program exit: ${status}:${signal}`))
    }
    logger.info(`Success building: '${command}'`)
    logger.error(`exit code: ${status}`)
    return resolve({ success: status === 0 })
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
      return {
        sourceRoot,
        result: await exec(
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
      )}
    }),
    mergeMap(async ({sourceRoot}) => {
      const cwd = process.cwd()
      process.chdir(sourceRoot)
      const result = await exec('npx', ['tsc'], context.logger)
      process.chdir(cwd)
      return result
    }),
    map((result) =>{
      context.logger.info('Builder ran')
      return result
    }),
  )
}

export default createBuilder(runBuilder)
