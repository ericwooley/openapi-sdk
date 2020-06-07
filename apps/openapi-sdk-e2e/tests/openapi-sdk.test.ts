import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing'
jest.setTimeout(20 * 1000)
async function generate(
  libName: string,
  {
    description = 'test description',
    exportBuiltDoc = true,
    extraArgs = '',
  }: {
    description?: string
    exportBuiltDoc?: boolean
    extraArgs?: string
  } = {},
) {
  await runNxCommandAsync(
    `generate @ericwooley/openapi-sdk:openapi-sdk --description="${description}" --exportBuiltDoc=${exportBuiltDoc} ${libName} ${extraArgs}`.trim(),
  )
}

describe('openapi-sdk e2e', () => {
  describe('--directory flag', () => {
    it('should create src in the specified directory', async (done) => {
      const libName = 'openapi-sdk'
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await generate(libName, { extraArgs: '--directory subdir' })
      expect(() =>
        checkFilesExist(`libs/subdir/${libName}/openapi.yml`),
      ).not.toThrow()
      done()
    })
  })
  it('should create openapi-sdk', async (done) => {
    const libName = 'openapi-sdk'
    ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
    await generate(libName)

    const result = await runNxCommandAsync(`digest ${libName}`)
    expect(() =>
      checkFilesExist(`libs/${libName}/src/index.ts`),
    ).not.toThrow()
    expect(() =>
      checkFilesExist(`libs/${libName}/src/openapiDoc.ts`),
    ).not.toThrow()
    expect(result.stdout).toContain('Openapi sdk generated')
    done()
  })
  it('should create openapi-sdk without apiDock', async (done) => {
    const libName = 'openapi-sdk'
    ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
    await generate(libName, { exportBuiltDoc: false })

    const result = await runNxCommandAsync(`digest ${libName}`)
    expect(() =>
      checkFilesExist(`libs/${libName}/src/index.ts`),
    ).not.toThrow()
    expect(() =>
      checkFilesExist(`libs/${libName}/src/openapiDoc.ts`),
    ).toThrow()
    expect(result.stdout).toContain('Openapi sdk generated')
    done()
  })

  describe('build', () => {
    it('should build the package', async (done) => {
      const libName = 'openapi-sdk-test-lib'
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await generate(libName)
      await runNxCommandAsync(`digest ${libName}`)
      await runNxCommandAsync(`build ${libName}`)
      expect(() =>
        checkFilesExist(`dist/libs/${libName}/dist/index.js`),
      ).not.toThrow()
      expect(() =>
        checkFilesExist(`dist/libs/${libName}/package.json`),
      ).not.toThrow()
      expect(() =>
        checkFilesExist(`libs/libs/${libName}/dist/index.js`),
      ).toThrow()
      done()
    })
  })

  // describe('--tags', () => {
  //   it('should add tags to nx.json', async (done) => {
  //     const plugin = uniq('openapi-sdk')
  //     ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
  //     await runNxCommandAsync(
  //       `generate @ericwooley/openapi-sdk:openapi-sdk ${plugin} --tags e2etag,e2ePackage`,
  //     )
  //     const nxJson = readJson('nx.json')
  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage'])
  //     done()
  //   })
  // })
})
