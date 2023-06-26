import { CloudFormationClient, DescribeStackResourceCommand } from '@aws-sdk/client-cloudformation';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Handler } from 'aws-lambda';
import * as Jimp from 'jimp';

const getBucketName = async (stackName: string, logicalResourceId: string) => {
    const cloudformationClient = new CloudFormationClient({});
    const describeStackResourceParams = {
      StackName: stackName,
      LogicalResourceId: logicalResourceId
    };
  
    try {
      const describeStackResourceCommand = new DescribeStackResourceCommand(describeStackResourceParams);
      const response = await cloudformationClient.send(describeStackResourceCommand);
      const bucketName = response.StackResourceDetail!.PhysicalResourceId;
      console.log("S3 Bucket Name:", bucketName);
      return bucketName;
    } catch (error) {
      console.error("Error retrieving bucket name:", error); 
    }
  };
  

export const handler: Handler = async function(event, context) {
    const s3Client = new S3Client({});
    const stackName = "image-processing-demo"
    const inBucketName = await getBucketName(stackName, "ImageInBucket");
    const outBucketName = await getBucketName(stackName, "ImageOutBucket");

    const command = new GetObjectCommand({ Bucket: inBucketName, Key: "apple.png" })
    const s3Item = await s3Client.send(command);
    const byteArray = await s3Item.Body!.transformToByteArray()
    
    const image = await Jimp.read(Buffer.from(byteArray));
    image.grayscale();

    const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const uploadCommand = new PutObjectCommand({Bucket: outBucketName, Key: `grayscale-${Date.now()}.png`, Body: imageBuffer})
    await s3Client.send(uploadCommand);
}