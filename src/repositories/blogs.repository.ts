import { SortDirection } from 'mongodb'
import { blogsCollection, BlogType } from '../db/db'
import { QueryBlogType } from '../utils'
import { blogInputModelType } from '../features/blogs/models/blogInputModelType'

export const blogsRepository = {
	async findBlogs(query: QueryBlogType): Promise<BlogType[]> {
		return await blogsCollection
			.find({
				name: { $regex: query.searchNameTerm || '', $options: 'i' }
			})
			.sort(query.sortBy, query.sortDirection as SortDirection)
			.skip((query.pageNumber - 1) * query.pageSize)
			.limit(query.pageSize)
			.toArray()
	},
	async findBlogById(id: string): Promise<BlogType | null> {
		return await blogsCollection.findOne({
			_id: id
		})
	},
	async countBlogs(filter?: string): Promise<number> {
		return filter
			? await blogsCollection.countDocuments({
					name: { $regex: filter, $options: 'i' }
			  })
			: await blogsCollection.countDocuments()
	},
	async createBlog(blog: BlogType): Promise<boolean> {
		const result = await blogsCollection.insertOne(blog)

		return result.acknowledged ? true : false
	},
	async updateBlog(id: string, body: blogInputModelType): Promise<boolean> {
		const foundBlog = (await blogsCollection.findOne({ _id: id })) as BlogType

		const result = await blogsCollection.updateOne(
			{
				_id: id
			},
			{
				$set: {
					name: body.name ? body.name : foundBlog.name,
					description: body.description
						? body.description
						: foundBlog.description,
					websiteUrl: body.websiteUrl ? body.websiteUrl : foundBlog.websiteUrl
				}
			}
		)

		return result.modifiedCount > 0 ? true : false
	},
	async deleteBlog(id: string): Promise<boolean> {
		const result = await blogsCollection.deleteOne({
			_id: id
		})

		return result.deletedCount > 0 ? true : false
	}
}
