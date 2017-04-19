#!/usr/bin/env bash
# Only root has write access in the Amazon Linux image
set -e

# Get 6.x LTS from nodesource
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
yum install -y nodejs

# yum install yarn, per https://yarnpkg.com/en/docs/install#linux-tab
wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
yum install -y yarn

# See https://github.com/webpack/webpack/issues/1479#issuecomment-158194161
# Webpack, the underlying library used by create-react-app for all this magic,
# has various dependencies that cause it to generate a different has for some
# applications depending on their filepath.

# To avoid this, place the frontend in a consistent directory before building
TEMP_FRONTEND=/tmp/frontend
rm -r -f $TEMP_FRONTEND && mkdir $TEMP_FRONTEND && cp -R frontend /tmp && cd $TEMP_FRONTEND
yarn install
yarn build

# Copy result to /var/www/html
SERVER_ROOT="/var/www/html"
rm -r -f $SERVER_ROOT/*
cp --recursive $TEMP_FRONTEND/build/* $SERVER_ROOT
