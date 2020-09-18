import { Tree } from '@angular-devkit/schematics'
import { SchematicTestRunner } from '@angular-devkit/schematics/testing'
import { createEmptyWorkspace } from '@nrwl/workspace/testing'
import { join } from 'path'

import { OpenapiSdkSchematicSchema } from './schema'

describe('openapi-sdk schematic', () => {
  let appTree: Tree
  const options: OpenapiSdkSchematicSchema = {
    name: 'test',
    description: 'a test description',
    exportBuiltDoc: false,
  }

  const testRunner = new SchematicTestRunner(
    '@ericwooley/openapi-sdk',
    join(__dirname, '../../../collection.json'),
  )

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty())
  })

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('openapi-sdk', options, appTree).toPromise(),
    ).resolves.not.toThrowError()
  })
})
