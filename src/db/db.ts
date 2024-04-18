import {MongoClient} from "mongodb";
import {SETTINGS} from "../setttings";

export type BlogType = {
    _id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type PostType = {
    _id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type DbType = {
    blogs: BlogType[]
    posts: PostType[]
}

const mongo_url = SETTINGS.MONGO_URL
if (!mongo_url) {
    throw new Error('No mongo_url provided')
}
const client = new MongoClient(mongo_url)
const db= client.db(SETTINGS.DB_NAME)
// export const blogsCollection = db.collection<BlogType>('blogs')
export const blogsCollection = db.collection<BlogType>('blogs')
export const postsCollection = db.collection<PostType>('posts')

export async function runDb() {
    try {
        await client.connect()
        console.log('Connected to MongoDB')
    } catch {
        console.log('Failed to connect to MongoDB')
    }
}
