import { db } from '../../../db/db'
import { SortDirection } from 'mongodb'
import { IPaginator } from '../../../common/types/paginator'
import { IBlogViewModel } from '../models/blogView.model'
import { IPostViewModel } from '../../posts/models/postView.model'
import { IQueryModel } from '../../../common/types/query.model'
import {getBlogViewModel} from "../mappers/blogsMappers";
import {getPostViewModel} from "../../posts/mappers/postMappers";
import {BlogModel} from "../domain/blogs.dto";
import {PostModel} from "../../posts/domain/post.dto";

export const blogsQueryRepository = {
	async getBlogs(query: IQueryModel): Promise<IPaginator<IBlogViewModel>> {

		const newQuery = { name: { $regex: query.searchNameTerm ?? '', $options: 'i' } }

		const res = await BlogModel
			.find(newQuery)
			.sort( { [query.sortBy!]: query.sortDirection as SortDirection} )
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.lean()

		const countDocs = await BlogModel
			.countDocuments(newQuery)

		return {
			pagesCount: Math.ceil(countDocs / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: countDocs,
			items: res.map(getBlogViewModel)
		}
	},

	async getBlogByID(id: string) {
		const result = await BlogModel.findOne({
			_id: id
		})
		return result ? getBlogViewModel(result) : undefined
	},

	async getPostsByBlogID(id: string, query: IQueryModel): Promise<IPaginator<IPostViewModel> | undefined> {

		const res = await PostModel
			.find({ blogId: id })
			.sort({[query.sortBy!]: query.sortDirection as SortDirection})
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.lean()

		const countDocs = await PostModel
			.countDocuments({ blogId: id })

		if (res.length > 0) {
			return {
				pagesCount: Math.ceil(countDocs / query.pageSize!),
				page: query.pageNumber!,
				pageSize: query.pageSize!,
				totalCount: countDocs,
				items: res.map(getPostViewModel)
			}
		} else {
			return undefined
		}
	}
}