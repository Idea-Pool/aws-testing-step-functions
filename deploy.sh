set -e

stateDefinition=$(<aws/state-machine.asl.json)

noNewLineStateDefinition=$(echo "$stateDefinition" | tr -d '\n')

sed -e "s/STATE_FUNCTION_ASL_JSON/$(echo $noNewLineStateDefinition)/" aws/cf-template.yml > aws/cf-template-tmp.yml

aws cloudformation deploy --template-file aws/cf-template-tmp.yml --stack-name image-processing-demo --capabilities CAPABILITY_NAMED_IAM

inBucketName=`aws cloudformation describe-stack-resource --stack-name image-processing-demo --logical-resource-id ImageInBucket --query 'StackResourceDetail.PhysicalResourceId' --output text`

npm run --prefix nsfwcheck build

zip -r9q -j ./nsfwcheck/index.zip ./nsfwcheck/build/

aws lambda update-function-code --function-name NSFWCheckerLambda --zip-file fileb://nsfwcheck/index.zip --publish --no-cli-pager

npm run --prefix grayscaler build

zip -r9q -j ./grayscaler/index.zip ./grayscaler/build/

aws lambda update-function-code --function-name GrayscalerLambda --zip-file fileb://grayscaler/index.zip --publish --no-cli-pager

aws s3 cp apple.png s3://$inBucketName/apple.png

rm aws/cf-template-tmp.yml