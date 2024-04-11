import {MongoClient} from "mongodb";

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export const db: dbType = {
    blogs: [
        {id: `id_blog1`, name: `name_blog1`, description: `string`, websiteUrl: `string`},
        {id: `id_blog2`, name: `name_blog2`, description: `string`, websiteUrl: `string`},
    ],
    posts: [
        {
            id: `id_post1`,
            title: `name_post1`,
            shortDescription: `string`,
            content: `string`,
            blogId: `string`,
            blogName: `string`
        },
        {
            id: `id_post2`,
            title: `name_post2`,
            shortDescription: `string`,
            content: `string`,
            blogId: `string`,
            blogName: `string`
        },
    ]
}

export type dbType = {
    blogs: BlogType[],
    posts: PostType[]
}

const mongo_url = process.env.MONGO_URL
console.log(mongo_url)
if (!mongo_url) {
    throw new Error(`! Url didn't find`)
}
const client = new MongoClient(mongo_url)
const db2 = client.db()
export const blogsCollection = db2.collection<BlogType>('blogs')

export async function runDb() {
    try {
        await client.connect()
        await client.db("admin").command({ ping: 1 });
        console.log('Connected succesfully to mongo server')
    } catch {
        console.log(`!!! Can't connect to db`)
        await client.close()
    }
}