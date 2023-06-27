set -e

inBucketName=`aws cloudformation describe-stack-resource --stack-name image-processing-demo --logical-resource-id ImageInBucket --query 'StackResourceDetail.PhysicalResourceId' --output text`
aws s3 rm s3://$inBucketName --recursive

outBucketName=`aws cloudformation describe-stack-resource --stack-name image-processing-demo --logical-resource-id ImageOutBucket --query 'StackResourceDetail.PhysicalResourceId' --output text`
aws s3 rm s3://$outBucketName --recursive

aws cloudformation delete-stack --stack-name image-processing-demo