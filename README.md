# aws-testing-step-functions
A repository for implementing example AWS Step Functions and their automated tests

# Work in Progress

Currently the code is not configurable.

### How to build and deploy
You can build the project by running `npm run build`.  
For convenience deploy and destroy scripts were created.  
- Make the shell scripts executable: `chmod +x deploy.sh` and `chmod +x destroy.sh`.
- To deploy the application run `./deploy.sh`.
    - Deploys a stack which creates: IAM Role to access all S3 buckets, 2 S3 buckets, a lambda with "Hello World".
    - Uploads `apple.png` to the input s3 bucket.
    - Builds the code using `npm run build`.
    - Zips the contents of the build directory into `index.zip`.
    - Updates the Lambda function with the newly built code.
- To destroy the stack run `./destroy.sh`.
    - Deletes all files from the input and output s3 buckets.
    - Destroys the stack created by `./deploy.sh`.


## To improve
- Make the lambda function configurable without hardcoded values.
- Restrict the created IAM role to only the created buckets.
- Think about ways to give more complexity to the lambda or create 2 lambdas, as we aim to create a state machine in the end.