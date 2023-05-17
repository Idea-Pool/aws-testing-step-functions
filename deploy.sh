set -e

aws cloudformation deploy --template-file aws/cf-template.yml --stack-name image-processing-demo --capabilities CAPABILITY_NAMED_IAM

inBucketName=`aws cloudformation describe-stack-resource --stack-name image-processing-demo --logical-resource-id ImageInBucket --query 'StackResourceDetail.PhysicalResourceId' --output text`

aws s3 cp apple.png s3://$inBucketName/apple.png

npm run build

zip -r9q -j index.zip ./build/

aws lambda update-function-code --function-name ImageTransformDemoLambda --zip-file fileb://index.zip --publish --no-cli-pager