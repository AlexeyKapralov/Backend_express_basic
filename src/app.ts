import express, {Request, Response} from 'express';
import {SETTINGS} from "./setttings";
import {BlogsRouter} from "./features/blogs/blogs.router";

export const app = express();

app.use(express.json())

app.get('/', (req:Request, res:Response) => {res.send('All is running')})
app.use(SETTINGS.PATH.BLOGS, BlogsRouter)

