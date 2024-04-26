import { body, query } from 'express-validator'

export const loginValidation = body('login')
	.trim()
	.isLength({ min: 3, max: 10 })
	.matches('^[a-zA-Z0-9_-]*$')
	.exists()

export const passwordValidation = body('password')
	.trim()
	.isLength({ min: 6, max: 20 })
	.exists()

export const emailValidation = body('email').trim().isURL().exists()

export const sortByValidation = query('sortBy').trim().default('createdAt')
export const sortDirectionValidation = query('sortDirection')
	.trim()
	.isIn(['asc', 'desc'])
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

//     pageSize: number
//     searchLoginTerm: string
//     searchEmailTerm: string
