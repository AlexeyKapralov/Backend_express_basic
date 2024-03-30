import {config} from 'dotenv'

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        DEL_ALL: '/testing/all-data',
        VIDEOS: '/videos',
    }
}
