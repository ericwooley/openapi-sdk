# nx-openapi-plugin

generate an sdk from an open api spec.

## Installation


**You must have java installed**
This project depends on the [openapi generator project](https://openapi-generator.tech/), which uses java to build and sdk from an openapi spec. It is build in java, and so java is required.


Install the openapi-sdk plugin
`yarn add @ericwooley/openapi-sdk --dev` or
`npm i @ericwooley/openapi-sdk --save-dev`

generate an sdk.
`nx g @ericwooley/openapi-sdk:openapi-sdk my-sdk`

In `lib/my-sdk`, you will see a file: `openapi.yml`

Edit that file according to your openapi needs.

When you want to generate an sdk run `nx build my-sdk` and your typescript will be generated.

## Road Map
If anyone ends up using this, we could add more options to pass down to the openapi generator. Currently it uses [typescript-axios](https://openapi-generator.tech/docs/generators/typescript-axios)

--------------------------------------------------------------------------------


This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>
