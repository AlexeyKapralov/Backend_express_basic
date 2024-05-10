import { body, param, query } from 'express-validator'
import { db } from '../../db/db'
import { IUserDbModel } from '../../features/users/models/userDb.model'

export const loginValidation = body(['login'])
	.trim()
	.isLength({ min: 3, max: 10 })
	.matches('^[a-zA-Z0-9_-]*$')
	.custom(async (login: string) => {
		const users = await db.getCollection().usersCollection.find({login: login}).toArray()
		if (users.length > 0) {
			throw new Error('login already exist')
		}
	})

export const loginOrEmailValidation = body(['loginOrEmail'])
	.trim()
	.isLength({ min: 3, max: 10 })
	.matches('^[a-zA-Z0-9_-]*$')
	.exists()

export const passwordValidation = body('password')
	.trim()
	.isLength({ min: 6, max: 20 })
	.exists()

export const emailValidationForRegistration = body('email')
	.trim()
	.isURL()
	.isLength({min:1})
	.custom(async (email: string) => {
		const user:Array<IUserDbModel> = await db.getCollection().usersCollection.find({email: email}).toArray()
		if (user.length > 0) {
			throw new Error('email already use')
		}
	})
export const emailValidationForResend = body('email')
	.trim()
	.isURL()
	.isLength({min:1})
	.custom(async (email: string) => {
		const user:Array<IUserDbModel> = await db.getCollection().usersCollection.find({email: email}).toArray()
		if (user.length === 0) {
			throw new Error('email incorrect')
		}
		if (user[0].isConfirmed) {
			throw new Error('email already is confirmed')
		}
	})

export const sortByValidation = query('sortBy').trim().default('createdAt')
export const sortDirectionValidation = query('sortDirection')
	.trim()
	// .isIn(['asc', 'desc'])
	.default('desc')
export const pageNumberValidation = query('pageNumber')
	.trim()
	.toInt()
	.default(1)
export const pageSizeValidation = query('pageSize').trim().toInt().default(10)
export const searchLoginTermValidation = query('searchLoginTerm')
	.trim()
	.default(null)
export const searchEmailTermValidation = query('searchEmailTerm')
	.trim()
	.default(null)
export const searchNameTermValidation = query('searchNameTerm')
	.trim()
	.default(null)
export const nameValidation = body('name').trim().isLength({ min: 1, max: 15 })
export const descriptionValidation = body('description').trim().isLength({ min: 1, max: 500 })
export const websiteUrlValidation = body('websiteUrl').trim().isLength({ min: 1, max: 100 }).isURL()

export const titleValidation = body('title').trim().isLength({ min: 1, max: 30 })
export const shortDescriptionValidation = body('shortDescription').trim().isLength({ min: 1, max: 100 })
export const contentValidation = body('content').trim().isLength({ min: 1, max: 1000 })

// так не делается, но для задачи нужно и по другому никак
export const blogIdParamValidation = param('id').trim().custom(async value => {
	const blog = await db.getCollection().blogsCollection.findOne({ _id: value })
	if (!blog) {
		throw new Error('blog not found')
	}
})
export const blogIdInBodyValidation = body('blogId').trim().custom(async value => {
	const blog = await db.getCollection().blogsCollection.findOne({ _id: value })
	if (!blog) {
		throw new Error('blog not found')
	}
})

export const contentCommentValidation = body('content')
	.trim()
	.isLength({ min: 20, max: 300 })

export const codeValidation = body('code')
	.trim()
	.isLength({min:1})
	.custom(async code => {
		const user = await db.getCollection().usersCollection.findOne({confirmationCode: code})
		if (!user) {
			throw new Error('user not found')
		}
		if (user.isConfirmed) {
			throw new Error('user already confirmed')
		}
		if (user.confirmationCodeExpired < new Date()) {
			throw new Error('confirmation code expired')
		}
	})

