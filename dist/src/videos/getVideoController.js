"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideosController = void 0;
const db_1 = require("../db/db");
// import {OutputVideoType} from '../input-output-types/video-types'
// export const getVideosController = (req: Request, res: Response<OutputVideoType[]>) => {
const getVideosController = (req, res) => {
    res
        .status(200)
        .json(db_1.db.videos);
};
exports.getVideosController = getVideosController;
