# THIS IS NOT READY
Don't try to use it yet.

# nx-openapi-plugin

Create packages that automatically generate a typescript sdk from an open api spec.
## Example

For example, if you wanted to generate an sdk for you auth service:
```
nx g @ericwooley/openapi-sdk:openapi-sdk auth-sdk
```
Would create `lib/auth-sdk`. Inside `lib/auth-sdk`, is a new file openapi.yml. Replace the contents of `openapi.yml`, with your spec. Then run:

```
nx build auth-sdk
```

You will now have 2 new folders, `lib/auth-sdk/document` and `lib/auth-sdk/sdk` which contain generated files.

### SDK
 `sdk` contains the TS code to interact with your api.

```ts
import {DefaultApi} from '@myorg/auth-sdk`
const authApi = new DefaultApi({
  basePath: 'http://localhost:8080/auth',
  baseOptions: {
    withCredentials: true,
  },
})
```

`document` contains the fully, self contained openapi document in ts. You can use it for swagger ui, or whatever you like.
```ts
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import authOpenapiDocument from '@myorg/auth-sdk-document`

const app = express();
app.use('/openapi', swaggerUi.serve, swaggerUi.setup(authOpenapiDocument));
```
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

When you want to generate an sdk run `nx build my-sdk` and your typescript will be generated.

## Testing
Unit tests are hard with these kind of projects. Schema does have some useful unit tests `nx test openapi-sdk`

The real testing is done by the e2e test `nx e2e openapi-sdk-e2e`

## Publishing
use `./publish.sh patch`, which will create a new release.
publish.sh forwards all arguments to `npm version`

* dependencies and versions are copied from the root package.json

## Road Map
If anyone ends up using this, we could add more options to pass down to the openapi generator. Currently it uses [typescript-axios](https://openapi-generator.tech/docs/generators/typescript-axios)

--------------------------------------------------------------------------------


This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>
