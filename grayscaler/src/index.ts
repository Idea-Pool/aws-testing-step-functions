import {GetObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {Handler} from 'aws-lambda';
import * as Jimp from 'jimp';

export const handler: Handler = async function (event, context) {
    const s3Client = new S3Client({});

    const command = new GetObjectCommand({Bucket: event.bucket, Key: event.file})
    const s3Item = await s3Client.send(command);
    const byteArray = await s3Item.Body!.transformToByteArray()

    const image = await Jimp.read(Buffer.from(byteArray));
    image.grayscale();

    const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.OUT_BUCKET,
        Key: `${event.file}-grayscale.png`,
        Body: imageBuffer
    })
    await s3Client.send(uploadCommand);
}