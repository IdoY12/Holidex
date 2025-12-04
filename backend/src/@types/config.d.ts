declare global {
  interface AppConfig {
    app: {
      port: number
      name: string
      secret: string
      jwtSecret: string
    }
    db: {
      host: string
      port: number
      username: string
      password: string
      database: string
    }
    s3: {
      bucket: string
      connection: {
        endpoint: string
        region: string
        credentials: {
          accessKeyId: string
          secretAccessKey: string
        }
        forcePathStyle: boolean
      }
    }
    io: {
      host: string
      port: number
    }
  }
} 

export {}
