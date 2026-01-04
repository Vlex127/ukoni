import type { Config } from '@prisma/client'

const config: Config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Liwm2Pkn3Sqh@ep-ancient-term-a4stgkiq-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    },
  },
}

export default config
