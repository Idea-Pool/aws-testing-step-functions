import {Handler} from "aws-lambda";
import {
    DetectModerationLabelsCommand,
    RekognitionClient,
    DetectModerationLabelsRequest
} from "@aws-sdk/client-rekognition";

export const handler: Handler = async function (event, context) {
    const inBucketName = event.detail.bucket.name;
    const inKeyName = event.detail.object.key;

    const rekognition = new RekognitionClient({});
    const request: DetectModerationLabelsRequest = {
        Image: {
            S3Object: {
                Bucket: inBucketName,
                Name: inKeyName
            }
        },
        MinConfidence: 90
    }

    const data = await rekognition.send(new DetectModerationLabelsCommand(request))

    console.log(`Detected: ${JSON.stringify(data, null, 3)}`)

    return {isNSFW: data.ModerationLabels!.length !== 0, bucket: inBucketName, file: inKeyName}
}