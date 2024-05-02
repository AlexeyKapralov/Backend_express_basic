import {IPostInputModel} from "../features/posts/models/postInput.model";
import {postsRepository} from "../repositories/posts/posts.repository";

//TODO: переписать всё на новый тип Result Type
export const postsService = {
    async createPost(body: IPostInputModel) {
        return await postsRepository.createPost(body)
    },
    async updatePost(id: string, body: IPostInputModel) {
        return await postsRepository.updatePost(id, body)
    },
    async deletePost(id: string) {
        return await postsRepository.deletePost(id)
    }
}