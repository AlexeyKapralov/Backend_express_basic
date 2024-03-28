import {Router} from 'express'
import {getVideosController} from './getVideoController'
// import {createVideoController} from './createVideoController'
// import {findVideoController} from './findVideoController'
// import {deleteVideoController} from './deleteVideoController'

export const videosRouter = Router()

videosRouter.get('/', getVideosController)
// videosRouter.post('/', createVideoController)
// videosRouter.get('/:id', findVideoController)
// videosRouter.delete('/:id', deleteVideoController)
// ...

