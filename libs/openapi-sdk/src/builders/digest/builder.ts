/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect'
import { Observable, from } from 'rxjs'
import { BuildBuilderSchema } from './schema'
import { join } from 'path'
import * as SwaggerParser from '@apidevtools/swagger-parser'
import { promises as fs } from 'fs'
import { exec } from '../../utils/exec'

async function digestOpenapiFile(
  options: BuildBuilderSchema,
  context: BuilderContext,
) {
  const { openapiFile, sdkFolder } = options
  context.logger.info(`digesting ${openapiFile} -> ${sdkFolder}`)
  const bundledOutFile = join(options.sdkFolder, 'openapiDoc.ts')
  await SwaggerParser.validate(openapiFile)
  const bundled = await SwaggerParser.bundle(openapiFile)
  await fs.mkdir(options.sdkFolder, { recursive: true })
  const genResult = await exec(
    'npx',
    [
      `@openapitools/openapi-generator-cli@cli-4.3.1`,
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
  if (options.exportBuiltDoc) {
    await fs.writeFile(
      bundledOutFile,
      `
/* eslint-disable */
/* THIS IS A GENERATED FILE
* DO NOT EDIT IT DIRECTLY
* edit ../openapi.yml and run
* \`nx build ${context.target}\` to rebuild this file.
*/
export const openapiDoc = ${JSON.stringify(bundled, null, 2)}
  `.trim(),
    )
    let indexFileContents = (
      await fs.readFile(join(sdkFolder, 'index.ts'))
    ).toString()
    indexFileContents = `
${indexFileContents}
// added by openapi-sdk
export * from './openapiDoc';
`
    await fs.writeFile(join(sdkFolder, 'index.ts'), indexFileContents)
  }
  return genResult
}
export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return from(digestOpenapiFile(options, context))
}

export default createBuilder(runBuilder)
