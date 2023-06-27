set -e

aws cloudformation deploy --template-file aws/cf-template.yml --stack-name image-processing-demo --capabilities CAPABILITY_NAMED_IAM

inBucketName=`aws cloudformation describe-stack-resource --stack-name image-processing-demo --logical-resource-id ImageInBucket --query 'StackResourceDetail.PhysicalResourceId' --output text`

aws s3 cp apple.png s3://$inBucketName/apple.png

npm run --prefix grayscaler build

zip -r9q -j ./grayscaler/index.zip ./grayscaler/build/

aws lambda update-function-code --function-name GrayscalerLambda --zip-file fileb://grayscaler/index.zip --publish --no-cli-pager

npm run --prefix nsfwcheck build

zip -r9q -j ./nsfwcheck/index.zip ./nsfwcheck/build/

aws lambda update-function-code --function-name NSFWCheckerLambda --zip-file fileb://nsfwcheck/index.zip --publish --no-cli-pager