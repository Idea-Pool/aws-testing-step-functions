# Testing AWS Step Functions Locally with Mocks

This folder contains examples on how to set up AWS Step Function testing locally using full mocked services.  
The provided example will work with the state machine described in [this repository](../../aws/state-machine.asl.json).  

## Prerequisites
1. Docker installed & running.
2. AWS credentials are configured (via environment variables).
3. NPM + NodeJS.

## How to execute tests
All tests are executed when running `npm test`.

## What is this code good for?
This setup showcases testing AWS State Machines using Mocked services. In this example you are able to test
the logic of the State Machine itself, and when/how branching happens, without reaching out to real Lambda code.  

### Possible issues

When not using Docker for Desktop you might need to change some environment variables so that testcontainers
will work. see [Supported container runtimes](https://node.testcontainers.org/supported-container-runtimes/)   
For `colima` the env variables would be:
```shell
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"  
export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock"
export NODE_OPTIONS=--dns-result-order=ipv4first 
```