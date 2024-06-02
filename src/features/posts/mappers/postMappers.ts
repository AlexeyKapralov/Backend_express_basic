import {IPostDbModel} from "../models/postDb.model";
import {IPostViewModel} from "../models/postView.model";
import {WithId} from "mongodb";

export const getPostViewModel = (data: WithId<IPostDbModel>): IPostViewModel => {
    return {
        id: data._id.toString(),
        title: data.title,
        shortDescription: data.shortDescription,
        content: data.content,
        blogId: data.blogId,
        blogName: data.blogName,
        createdAt: data.createdAt,
    }
}