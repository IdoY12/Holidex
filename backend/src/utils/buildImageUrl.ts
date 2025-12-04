import config from "config";

export function buildImageUrl(key: string) {
    const { bucket } = config.get<AppConfig["s3"]>("s3")
    return `http://localhost:4566/${bucket}/${key}`
}
