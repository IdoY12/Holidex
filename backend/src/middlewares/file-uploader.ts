import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "../aws/aws";
import { NextFunction, Request, Response } from "express";
import config from 'config'
import { UploadedFile } from "express-fileupload";
import { randomUUID } from "crypto";
import { extname } from "path";

declare global {
    namespace Express {
        interface Request {
            imageUrl: string
        }
    }
}

export default async function fileUploader(req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.files) return next()
        if(!req.files.image) return next()
        
        console.log(req.files)

        const {mimetype, data, name } = req.files.image as UploadedFile
        
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: config.get<string>('s3.bucket'),
                Key: `${randomUUID()}${extname(name)}`,
                ContentType: mimetype,
                Body: data
            }
        })
        
        const result = await upload.done()
        let imageKey = result.Key
        req.imageUrl = imageKey
        next()
    } catch(e) {
        next(e)
    }
}