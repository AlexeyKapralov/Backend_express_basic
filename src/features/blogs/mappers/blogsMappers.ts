import {IBlogDbModel} from "../models/blogDb.model";
import {IBlogViewModel} from "../models/blogView.model";

export const getBlogViewModel = (data: IBlogDbModel): IBlogViewModel => {
    return {
        id: data._id,
        name: data.name,
        description: data.description,
        websiteUrl: data.websiteUrl,
        createdAt: data.createdAt,
        isMembership: data.isMembership
    }
}