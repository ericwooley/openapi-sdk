#!/usr/bin/env bash

## this requires jq

echo $(dirname $0)
CURRENT_VERSION=$(cat package.json | jq .version);
echo "using version: $CURRENT_VERSION"
nx build openapi-sdk || exit 0;
yarn np  --no-publish || exit 0;
NEW_VERSION=$(cat package.json | jq .version);
BUILD_PACKAGE_JSON="./dist/libs/openapi-sdk/package.json"
cat $BUILD_PACKAGE_JSON  | jq ".version = $NEW_VERSION" > "$BUILD_PACKAGE_JSON.tmp"
rm $BUILD_PACKAGE_JSON
mv "$BUILD_PACKAGE_JSON.tmp" $BUILD_PACKAGE_JSON
npm publish ./dist/libs/openapi-sdk --access public
