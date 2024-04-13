import {MongoClient} from "mongodb";
import {SETTINGS} from "../settings";

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type DbType = {
    blogs: BlogType[],
    posts: PostType[]
}

const mongo_url = SETTINGS.MONGO_URL
console.log(mongo_url)
if (!mongo_url) {
    throw new Error('!!! Url did not found')
}
const client = new MongoClient(mongo_url)
const db = client.db()
export const blogsCollection = db.collection<BlogType>('blogs')

export async function runDb() {
    try {
        await client.connect()
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('!!! Cannot connect to db')
    }
}
