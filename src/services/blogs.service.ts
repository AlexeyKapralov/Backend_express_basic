import {blogsRepository} from "../repositories/blogs.repository";
import {BlogType} from "../db/db";
import {blogViewModelType} from "../features/blogs/models/blogViewModelType";

const getBlogViewModel = (blog: BlogType): blogViewModelType => {
    return {
        id: blog._id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}

export const blogsService = {
    async findBlogs() {
        const result = await blogsRepository.findBlogs()
        if (result) {
            return result.map(getBlogViewModel)
        }
    }
}