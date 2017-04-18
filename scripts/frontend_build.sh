#!/usr/bin/env bash
# Only root has write access in the Amazon Linux image
set -e

# Get 6.x LTS from nodesource
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
yum install -y nodejs

# yum install yarn, per https://yarnpkg.com/en/docs/install#linux-tab
wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
yum install -y yarn

# cd into the frontend directory, install required dependencies, and run build
cd frontend
yarn install
yarn build
