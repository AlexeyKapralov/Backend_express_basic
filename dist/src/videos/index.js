"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const getVideoController_1 = require("./getVideoController");
// import {createVideoController} from './createVideoController'
// import {findVideoController} from './findVideoController'
// import {deleteVideoController} from './deleteVideoController'
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter.get('/', getVideoController_1.getVideosController);
// videosRouter.post('/', createVideoController)
// videosRouter.get('/:id', findVideoController)
// videosRouter.delete('/:id', deleteVideoController)
// ...
