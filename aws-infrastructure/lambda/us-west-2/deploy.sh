#!/bin/bash

cp -r ../../../app/common/ common
cp -r ../../../app/pull-requests pull-requests
cp ../../../package.json package.json
cp ../../../package-lock.json package-lock.json

npm install --only=prod

serverless deploy --stage $1 --region us-west-2

rm -r common
rm -r pull-requests
rm -r node_modules
rm package.json
rm package-lock.json