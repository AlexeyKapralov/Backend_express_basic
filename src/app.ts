import express, {Request, Response} from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";
import {videos, videosRouter} from "./routers/videos-router";

export const app = express()
app.use(express.json())

app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.VIDEOS, videosRouter)

app.delete(SETTINGS.PATH.DEL_ALL, (req: Request, res: Response) => {
    videos.splice(0, videos.length);
    res.send(204)
})