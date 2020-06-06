import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing'
describe('openapi-sdk e2e', () => {
  it('should create openapi-sdk', async (done) => {
    const plugin = uniq('openapi-sdk')
    ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
    await runNxCommandAsync(
      `generate @ericwooley/openapi-sdk:openapi-sdk ${plugin}`,
    )

    const result = await runNxCommandAsync(`build ${plugin}`)
    expect(() =>
      checkFilesExist(`libs/${plugin}/src/index.ts`),
    ).not.toThrow()
    expect(result.stdout).toContain('Openapi sdk generated')
    done()
  })

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('openapi-sdk')
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await runNxCommandAsync(
        `generate @ericwooley/openapi-sdk:openapi-sdk ${plugin} --directory subdir`,
      )
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/openapi.yml`),
      ).not.toThrow()
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/tsconfig.json`),
      ).not.toThrow()
      done()
    })
  })

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('openapi-sdk')
      ensureNxProject('@ericwooley/openapi-sdk', 'dist/libs/openapi-sdk')
      await runNxCommandAsync(
        `generate @ericwooley/openapi-sdk:openapi-sdk ${plugin} --tags e2etag,e2ePackage`,
      )
      const nxJson = readJson('nx.json')
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage'])
      done()
    })
  })
})
