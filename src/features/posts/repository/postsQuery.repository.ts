import {SortDirection, WithId} from 'mongodb'
import { IPostViewModel } from '../models/postView.model'
import { IPaginator } from '../../../common/types/paginator'
import { IQueryModel } from '../../../common/types/query.model'
import {getPostViewModel} from "../mappers/postMappers";
import {PostModel} from "../domain/post.entity";
import {IPostDbModel} from "../models/postDb.model";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
	async getPosts(query: IQueryModel): Promise<IPaginator<IPostViewModel>> {
		const posts: WithId<IPostDbModel>[] = await PostModel
			.find()
			.skip((query.pageNumber! - 1) * query.pageSize!)
			.limit(query.pageSize!)
			.sort({[query.sortBy!]: query.sortDirection as SortDirection})
			.lean()

		const countDocs = await PostModel.countDocuments()

		return {
			pagesCount: Math.ceil(countDocs / query.pageSize!),
			page: query.pageNumber!,
			pageSize: query.pageSize!,
			totalCount: countDocs,
			items: posts.map(getPostViewModel)
		}

	}

	async getPostById(id: string): Promise<IPostViewModel | undefined> {
		const result: WithId<IPostDbModel> | null = await PostModel.findOne({
			_id: id
		})
		return result ? getPostViewModel(result) : undefined
	}
}