set -e

aws cloudformation deploy --template-file aws/cf-template.yml --stack-name image-processing-demo --capabilities CAPABILITY_NAMED_IAM

aws s3 cp apple.png s3://imageinbucket/apple.png

npm run build

zip -r9q -j index.zip ./build/

aws lambda update-function-code --function-name ImageTransformDemoLambda --zip-file fileb://index.zip --publish --no-paginate