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
        {id: `id_post1`, title: `name_post1`, shortDescription: `string`, content: `string`, blogId: `string`, blogName: `string`},
        {id: `id_post2`, title: `name_post2`, shortDescription: `string`, content: `string`, blogId: `string`, blogName: `string`},
    ]
}

export type dbType = {
    blogs: BlogType[],
    posts: PostType[]
}
