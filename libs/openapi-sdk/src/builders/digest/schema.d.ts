import { JsonObject } from '@angular-devkit/core'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BuildBuilderSchema extends JsonObject {
  openapiFile: string
  generatorType: string
  additionalOptions: string
  sdkFolder: string
}
