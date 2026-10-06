import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })
dotenv.config({ path: path.join(process.cwd(), 'prisma', '.env') })

export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  auth_token: process.env.AUTH_TOKEN,
  auth_token_expires_in: process.env.AUTH_TOKEN_EXPIRES_IN,
  refresh_token: process.env.REFRESH_TOKEN,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  otp_token: process.env.OTP_TOKEN,
  otp_token_expires_in: process.env.OTP_TOKEN_EXPIRES_IN,
  cloude_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  cloude_api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY,
  cloude_secret_key: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_SECRET_KEY,
  sslStoreId: process.env.SSL_STORE_ID,
  sslStorePass: process.env.SSL_STORE_PASS,
}
