/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect'
import { Observable, from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { BuildBuilderSchema } from './schema'
import { join } from 'path'
import { getSourceRoot } from '../../utils/normalize'
import * as SwaggerParser from '@apidevtools/swagger-parser'
import { promises as fs } from 'fs'
import { exec } from '../../utils/exec'

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return from(getSourceRoot(context)).pipe(
    mergeMap(async (sourceRoot) => {
      const { openapiFile, sdkFolder } = options
      context.logger.info(`digesting ${openapiFile} -> ${sdkFolder}`)
      const bundledOutFile = join(options.sdkFolder, 'document.ts')
      await SwaggerParser.validate(openapiFile)
      const bundled = await SwaggerParser.bundle(openapiFile)
      await fs.mkdir(options.sdkFolder, { recursive: true })
      await fs.writeFile(
        bundledOutFile,
        `
/* eslint-disable */
/* THIS IS A GENERATED FILE
 * DO NOT EDIT IT DIRECTLY
 * edit ../openapi.yml and run
 * \`nx build ${context.target}\` to rebuild this file.
 */
export default ${JSON.stringify(bundled, null, 2)}
      `.trim(),
      )
      return await exec(
        'npx',
        [
          `openapi-generator`,
          'generate',
          '-i',
          openapiFile,
          '-g',
          options.generatorType,
          `--additional-properties=${options.additionalOptions}`,
          '-o',
          sdkFolder,
        ],
        context.logger,
      )
    }),
  )
}

export default createBuilder(runBuilder)