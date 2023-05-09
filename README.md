# aws-testing-step-functions
A repository for implementing example AWS Step Functions and their automated tests

# Work in Progress

Currently the code is not configurable.

### How to build and deploy
1. `npm run build`
1. Zip the build directory content. It should contain an index.js and a map file.
1. An example command to deploy the code as an AWS Lambda: `aws lambda create-function --function-name image-grayscaler --role arn:aws:iam::356926350661:role/image-grayscaler-iam --runtime nodejs18.x --handler index.handler --memory-size 512 --zip-file fileb://index.zip` - The --role parameter should be an IAM role which gives permission to read/write to the `image-transform-example` s3 bucket.
