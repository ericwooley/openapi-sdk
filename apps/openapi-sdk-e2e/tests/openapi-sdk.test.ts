import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing'
jest.setTimeout(20*1000);
describe('openapi-sdk e2e', () => {
  describe('--directory flag', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('openapi-sdk')
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await runNxCommandAsync(
        `generate @ericwooley/openapi-sdk:openapi-sdk ${plugin} --directory subdir`,
      )
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/openapi.yml`),
      ).not.toThrow()
      done()
    })
  })
  it('should create openapi-sdk', async (done) => {
    const uniqLib = uniq('openapi-sdk')
    ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
    await runNxCommandAsync(
      `generate @ericwooley/openapi-sdk:openapi-sdk ${uniqLib}`,
    )

    const result = await runNxCommandAsync(`digest ${uniqLib}`)
    expect(() =>
      checkFilesExist(`libs/${uniqLib}/generated/index.ts`),
    ).not.toThrow()
    expect(() =>
      checkFilesExist(`libs/${uniqLib}/generated/document.ts`),
    ).not.toThrow()
    expect(result.stdout).toContain('Openapi sdk generated')
    done()
  })

  describe('build', () => {
    it('should build the package', async (done) => {
      const libName = 'openapi-sdk-test-lib'
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await runNxCommandAsync(
        `generate @ericwooley/openapi-sdk:openapi-sdk ${libName}`,
      )
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
