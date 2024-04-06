export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}
export const db: dbType = {
    blogs: [
        {id: `string`, name: `string`, description: `string`, websiteUrl: `string`},
        {id: `string`, name: `balabash`, description: `string`, websiteUrl: `string`},
    ]
}

export type dbType = {
    blogs: BlogType[]
}
