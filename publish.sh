#!/usr/bin/env bash

## this requires jq

echo $(dirname $0)
CURRENT_VERSION=$(cat package.json | jq .version)
nx build openapi-sdk || exit 0
npm version "$@" || exit 0
NEW_VERSION=$(cat package.json | jq .version)
DEPENDENCIES=$(cat package.json | jq .dependencies)
BUILD_PACKAGE_JSON="./dist/libs/openapi-sdk/package.json"
cat $BUILD_PACKAGE_JSON | jq ".version = $NEW_VERSION | .dependencies = $DEPENDENCIES" >"$BUILD_PACKAGE_JSON.tmp"
rm $BUILD_PACKAGE_JSON
mv "$BUILD_PACKAGE_JSON.tmp" $BUILD_PACKAGE_JSON
cp README.md dist/libs/openapi-sdk/
npm publish ./dist/libs/openapi-sdk --access public --tag next
git push
git push --tags
