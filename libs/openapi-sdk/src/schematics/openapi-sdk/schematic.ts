/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  Rule,
  url,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics'
import {
  addProjectToNxJsonInTree,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
  readJsonInTree,
  NxJson,
  updateJsonInTree,
} from '@nrwl/workspace'
import { OpenapiSdkSchematicSchema } from './schema'

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Library

interface NormalizedSchema extends OpenapiSdkSchematicSchema {
  projectName: string
  projectRoot: string
  projectDirectory: string
  parsedTags: string[]
}

function normalizeOptions(
  options: OpenapiSdkSchematicSchema,
): NormalizedSchema {
  const name = toFileName(options.name)
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-')
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : []

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  }
}

function addFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ]),
  )
}

export default function (options: OpenapiSdkSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options)
  return chain([
    updateTsConfig(normalizedOptions),
    updateWorkspace((workspace) => {
      const sdkFolder = `${normalizedOptions.projectRoot}/generated`
      const project = workspace.projects.add({
        name: normalizedOptions.projectName,
        root: normalizedOptions.projectRoot,
        sourceRoot: `${normalizedOptions.projectRoot}`,
        projectType,
      })
      project.targets.add({
        name: 'build',
        builder: '@ericwooley/openapi-sdk:build',
        options: {
          sdkFolder,
          dist: `./dist/libs/${normalizedOptions.projectName}`,
        },
      })
      project.targets.add({
        name: 'digest',
        builder: '@ericwooley/openapi-sdk:digest',
        options: {
          sdkFolder,
          generatorType: 'typescript-axios',
          additionalOptions: `npmName=${normalizedOptions.name},supportsES6=true,withInterfaces=true`,
          openapiFile: `${normalizedOptions.projectRoot}/openapi.yml`,
          exportBuiltDoc: options.exportBuiltDoc,
        },
      })
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    addFiles(normalizedOptions),
  ])
}

function updateTsConfig(options: NormalizedSchema): Rule {
  return chain([
    (host: Tree, context: SchematicContext) => {
      const nxJson = readJsonInTree<NxJson>(host, 'nx.json')
      return updateJsonInTree('tsconfig.json', (json) => {
        const c = json.compilerOptions
        c.paths = c.paths || {}
        delete c.paths[options.name]
        c.paths[`@${nxJson.npmScope}/${options.name}document`] = [
          `${options.projectRoot}/generated/index.ts`,
        ]
        return json
      })(host, context)
    },
  ])
}
