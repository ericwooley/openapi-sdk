# nx-openapi-plugin

Create packages that automatically generate a typescript sdk from an open api spec.
## Example

For example, if you wanted to generate an sdk for you auth service:
```
nx g @ericwooley/openapi-sdk:openapi-sdk auth-sdk
```
Would create `lib/auth-sdk`. Inside `lib/auth-sdk`, is a new file openapi.yml. Replace the contents of `openapi.yml`, with your spec. Then run:

```
nx digest auth-sdk
```
You will now have a src folder inside `lib/auth-sdk`, it is generated code, but it's recommended that you commit it.


### Using the SDK
 `sdk` contains the TS code to interact with your api.

```ts
import { DefaultApi } from '@myorg/auth-sdk`
const authApi = new DefaultApi({
  basePath: 'http://localhost:8080/auth',
  baseOptions: {
    withCredentials: true,
  },
})
```

If you want to use the doc with some swagger tools:
```ts
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { openapiDoc } from '@myorg/auth-sdk`

const app = express();
app.use('/openapi', swaggerUi.serve, swaggerUi.setup(authOpenapiDocument));
```
#### Some useful libraries for working with swagger
* [swagger-express-validator](https://www.npmjs.com/package/swagger-express-validator)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [swagger-node](https://github.com/swagger-api/swagger-node)
* [swagger-view for vs code](https://marketplace.visualstudio.com/items?itemName=Arjun.swagger-viewer)

## Installation & Usage

**You must have java installed**

This project depends on the [openapi generator project](https://openapi-generator.tech/), which uses java to build and sdk from an openapi spec. It is build in java, and so java is required.


Install the openapi-sdk plugin

`yarn add @ericwooley/openapi-sdk --dev` or
`npm i @ericwooley/openapi-sdk --save-dev`

generate an sdk.

`nx g @ericwooley/openapi-sdk:openapi-sdk my-sdk`

In `lib/my-sdk`, you will see a file: `openapi.yml`

Edit that file according to your openapi needs.

When you want to generate an sdk run `nx digest my-sdk` and your typescript will be generated.

# Development
## Testing
Unit tests are hard with these kind of projects. Schema does have some useful unit tests `nx test openapi-sdk`

The real testing is done by the e2e test `nx e2e openapi-sdk-e2e`

## Publishing
use `./publish.sh patch`, which will create a new release and publish it with the `next` tag.
publish.sh forwards all arguments to `npm version`

`./release.sh` will take the current version and make it the latest.

* dependencies and versions are copied from the root package.json

## Road Map
If anyone ends up using this, we could add more options to pass down to the openapi generator. Currently it uses [typescript-axios](https://openapi-generator.tech/docs/generators/typescript-axios)

--------------------------------------------------------------------------------


This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>
