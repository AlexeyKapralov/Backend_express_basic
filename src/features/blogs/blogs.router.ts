import {Router} from "express";
import {getBlogsController} from "./controllers/getBlogs.controller";
import {
    contentValidation,
    descriptionValidation,
    nameValidation,
    pageNumberValidation,
    pageSizeValidation,
    searchNameTermValidation,
    shortDescriptionValidation,
    sortByValidation,
    sortDirectionValidation,
    titleValidation,
    websiteUrlValidation
} from "../../common/validation/express-validation";
import {inputValidationMiddleware} from "../../middlewares/inputValidation.middleware";
import {authMiddleware} from "../../middlewares/auth.middleware";
import {createBlogsController} from "./controllers/createBlog.controller";
import {getBlogByIdController} from "./controllers/getBlogById.controller";
import {updateBlogByIdController} from "./controllers/updateBlogById.controller";
import {deleteBlogByIdController} from "./controllers/deleteBlogById.controller";
import {getPostsByBlogIDController} from "./controllers/getPostsByBlogId.controller";
import {createPostByBlogIdController} from "./controllers/createPostByBlogId.controller";

export const blogsRouter = Router({})

blogsRouter.get('/',

    searchNameTermValidation,
    sortByValidation,
    sortDirectionValidation,
    pageNumberValidation,
    pageSizeValidation,
    inputValidationMiddleware,

    getBlogsController
)

blogsRouter.get('/:id', getBlogByIdController)

blogsRouter.get('/:id/posts',
    sortByValidation,
    // blogIdParamValidation,
    sortDirectionValidation,
    pageNumberValidation,
    pageSizeValidation,
    inputValidationMiddleware,
    getPostsByBlogIDController
)

blogsRouter.post('/',

    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    createBlogsController
)

blogsRouter.post('/:id/posts',

    authMiddleware,
    // blogIdParamValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    createPostByBlogIdController
)

blogsRouter.put('/:id',
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    updateBlogByIdController
)

blogsRouter.delete('/:id',
    authMiddleware,
    deleteBlogByIdController
)