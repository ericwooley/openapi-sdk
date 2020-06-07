/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect'
import { Observable, from } from 'rxjs'
import { BuildBuilderSchema } from './schema'
import { createDirectory } from '@nrwl/workspace'
import { exec } from '../../utils/exec'
import { promises as fs } from 'fs'
import { join } from 'path'
async function compileTS(
  options: BuildBuilderSchema,
  context: BuilderContext,
): Promise<BuilderOutput> {
  const cwd = process.cwd()
  try {
    createDirectory(options.dist)
    context.logger.error(cwd)
    process.chdir(options.sdkFolder)
    await exec('npm', ['i'], context.logger)
    await exec('npx', ['tsc'], context.logger)
    process.chdir(cwd)
    fs.rename(join(options.sdkFolder, 'dist'), join(options.dist, 'dist'))
    fs.copyFile(
      join(options.sdkFolder, 'package.json'),
      join(options.dist, 'package.json'),
    )
  } catch (e) {
    return { success: false }
  } finally {
    process.chdir(cwd)
  }
  return { success: true }
}

export function runBuilder(
  options: BuildBuilderSchema,
  context: BuilderContext,
): Observable<BuilderOutput> {
  return from(compileTS(options, context))
}

export default createBuilder(runBuilder)
