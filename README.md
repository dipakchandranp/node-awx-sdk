# node-awx-sdk

node-aws-sdk is a utility library for connecting a node js application to Ansible AWX using ReST APIs.

## Installation

```
npm install node-awx-sdk

```

## Usage

```
// require node-awx-sdk module
cosnt AwxSdk  = require("node-awx-sdk")

// initialize with your configuration
const awx = new AwxSdk(config);

// Call services:
awx.call();

awc.callDynamic();

```
