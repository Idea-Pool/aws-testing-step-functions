import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Handler } from 'aws-lambda';
import * as Jimp from 'jimp';

export const handler: Handler = async function(event, context) {
    const s3Client = new S3Client({});

    const command = new GetObjectCommand({ Bucket: "image-transform-example", Key: "example.png" })
    const s3Item = await s3Client.send(command);
    const byteArray = await s3Item.Body!.transformToByteArray()
    
    const image = await Jimp.read(Buffer.from(byteArray));
    image.grayscale();

    const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const uploadCommand = new PutObjectCommand({Bucket: "image-transform-example", Key: `grayscale-${Date.now()}.png`, Body: imageBuffer})
    await s3Client.send(uploadCommand);
}