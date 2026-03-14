import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3"
import config from "config"

export const s3Config = config.get<AppConfig['s3']>('s3')

const s3Client = new S3Client({
    ...s3Config.connection,
    credentials: { ...s3Config.connection.credentials }
})

export async function createAppBucketIfNotExists() {
    try {
        await s3Client.send(
            new CreateBucketCommand({
                Bucket: s3Config.bucket
            })
        )
    } catch (e) {
        throw e
    }
}

export default s3Client