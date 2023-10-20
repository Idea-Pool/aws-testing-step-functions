# Testing AWS Step Functions Locally with Mocks

This folder contains examples on how to set up AWS Step Function testing locally using full mocked services.  
The provided example will work with the state machine described in [this repository](../../aws/state-machine.asl.json).  

## Prerequisites
1. Docker installed & running.
2. NPM + NodeJS

## How to execute tests
All tests are executed when running `npm test`.

## What is this code good for?
This setup showcases testing AWS State Machines using Mocked services. In this example you are able to test
the logic of the State Machine itself, and when/how branching happens, without reaching out to real Lambda code.  