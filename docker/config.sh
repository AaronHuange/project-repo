#!/bin/bash
set -e

BUILD_ENV=$1
BUILD_TAG=$2

if [[ -z "${BUILD_ENV}" ]]; then
  echo "BUILD_ENV is empty"
  exit 1
fi

if [[ -z "${BUILD_TAG}" ]]; then
  echo "BUILD_TAG is empty"
  exit 1
fi

echo "env:'${BUILD_ENV}' tag:'${BUILD_TAG}'"

if [ -f "./.env" ]; then
  rm -rf .env
fi

case $BUILD_ENV in
test)
  cp _config_/test/env ./.env
  ;;
dev)
  cp _config_/dev/env ./.env
  ;;
release|prod)
  cp _config_/prod/env ./.env
  echo '' >> ./.env
  echo 'NODE_ENV=production' >> ./.env
  ;;
*)
  ;;
esac
