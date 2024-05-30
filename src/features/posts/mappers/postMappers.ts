import {IPostDbModel} from "../models/postDb.model";
import {IPostViewModel} from "../models/postView.model";

export const getPostViewModel = (data: IPostDbModel): IPostViewModel => {
    return {
        id: data._id,
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: data.blogName,
        createdAt: data.createdAt,
    }
}