set -e

aws s3 rm s3://imageinbucket --recursive

aws s3 rm s3://imageoutbucket --recursive

aws cloudformation delete-stack --stack-name image-processing-demo