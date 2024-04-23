import { config } from 'dotenv'

config()

export const SETTINGS = {
	MONGO_URL: process.env.MONGO_URL,
	PORT: process.env.PORT
}
