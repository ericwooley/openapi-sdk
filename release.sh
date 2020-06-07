#!/usr/bin/env bash

## this requires jq

echo $(dirname $0)
CURRENT_VERSION=$(cat package.json | jq .version -r);
npm dist-tag rm "@ericwooley/openapi-sdk@$CURRENT_VERSION" next
npm dist-tag add "@ericwooley/openapi-sdk@$CURRENT_VERSION" latest
npm dist-tag add "@ericwooley/openapi-sdk@$CURRENT_VERSION" stable

