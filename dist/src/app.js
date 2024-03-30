"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./settings");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
// const products = [{title: 'tomato'}, {title: 'orange'}]
// const addresses = [{id: 1, value: 'abasdasd'}, {id: 2, value: 'rewq'}]
const videos = [
    {
        "id": 0,
        "title": "It's men's haircut",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-03-28T19:17:50.042Z",
        "publicationDate": "2024-03-28T19:17:50.042Z",
        "availableResolutions": [
            "P144"
        ]
    },
    {
        "id": 1,
        "title": "Funny cats",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-03-28T19:17:50.042Z",
        "publicationDate": "2024-03-28T19:17:50.042Z",
        "availableResolutions": [
            "P144"
        ]
    }
];
const resolutionsEnum = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
function isValidResolution(resolution) {
    for (let i = 0; i < resolution.length; i++) {
        if (!resolutionsEnum.includes(resolution[i])) {
            return false;
        }
    }
    return true;
}
function validateVideoData(req, res, next) {
    const { title, author, availableResolutions, minAgeRestriction, publicationDate, canBeDownloaded } = req.body;
    const errorsMessages = [];
    if (!title || title.length > 40) {
        errorsMessages.push({
            message: "the inputModel has incorrect values or undefined",
            field: "title"
        });
    }
    if (!author || author.length > 20) {
        errorsMessages.push({
            message: "the inputModel has incorrect values or undefined",
            field: "author"
        });
    }
    if (minAgeRestriction) {
        if (!Number.isInteger(minAgeRestriction)) {
            errorsMessages.push({
                message: "incorrect type",
                field: "minAgeRestriction"
            });
        }
        if (minAgeRestriction.length > 18) {
            errorsMessages.push({
                message: "incorrect values",
                field: "minAgeRestriction"
            });
        }
    }
    if (availableResolutions) {
        if (!isValidResolution(availableResolutions)) {
            errorsMessages.push({
                message: "the inputModel has incorrect values",
                field: "availableResolutions"
            });
        }
    }
    if (canBeDownloaded) {
        if (typeof canBeDownloaded !== 'boolean') {
            errorsMessages.push({
                message: "the inputModel has incorrect values",
                field: "canBeDownloaded"
            });
        }
    }
    if (errorsMessages.length !== 0) {
        return res.status(400).json({ errorsMessages });
    }
    // Если все данные прошли валидацию, продолжаем обработку запроса
    next();
}
exports.app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' });
});
exports.app.get(settings_1.SETTINGS.PATH.VIDEOS, (req, res) => {
    res.status(200).send(videos);
});
exports.app.post(`${settings_1.SETTINGS.PATH.VIDEOS}`, validateVideoData, (req, res) => {
    const maxId = videos.reduce((max, video) => (video.id > max ? video.id : max), -1);
    const myDate = new Date().toISOString();
    const nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
    let canBeDownloaded = false;
    if (req.body.canBeDownloaded) {
        canBeDownloaded = req.body.canBeDownloaded;
    }
    let minAgeRestriction = null;
    if (req.body.minAgeRestriction) {
        minAgeRestriction = req.body.minAgeRestriction;
    }
    const newVideo = {
        id: maxId + 1,
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: canBeDownloaded,
        minAgeRestriction: minAgeRestriction,
        createdAt: myDate,
        publicationDate: nextDate,
        availableResolutions: req.body.availableResolutions
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.get(`${settings_1.SETTINGS.PATH.VIDEOS}/:id`, (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.send(404);
    }
});
exports.app.put(`${settings_1.SETTINGS.PATH.VIDEOS}/:id`, validateVideoData, (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        video.title = req.body.title;
        video.author = req.body.author;
        video.availableResolutions = req.body.availableResolutions;
        video.canBeDownloaded = req.body.canBeDownloaded;
        if (req.body.minAgeRestriction) {
            video.minAgeRestriction = req.body.minAgeRestriction;
        }
        else
            video.minAgeRestriction = null;
        video.createdAt = new Date().toISOString();
        if (req.body.publicationDate) {
            video.publicationDate = req.body.publicationDate;
        }
        else {
            video.publicationDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
        }
        res.send(204);
    }
    else {
        res.status(404).json({
            errorsMessages: [
                {
                    message: "Video is not found"
                }
            ]
        });
    }
});
exports.app.delete(`${settings_1.SETTINGS.PATH.VIDEOS}/:id`, (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
exports.app.delete(settings_1.SETTINGS.PATH.DEL_ALL, (req, res) => {
    videos.splice(0, videos.length);
    res.send(204);
});
// app.get('/products', (req: Request, res: Response) => {
//     if (req.query.title) {
//         let searchString = String(req.query.title)
//
//         res.send(products.filter(p => p.title.indexOf(searchString) > -1))
//     }
//     res.send(products)
// })
// app.get('/addresses', (req: Request, res: Response) => {
//     if (req.query.title) {
//         let searchString = String(req.query.title)
//         res.send(products.filter(p => p.title.indexOf(searchString) > -1))
//     }
//     res.send(addresses)
// })
// app.get('/addresses/:id', (req: Request, res: Response) => {
//     let address = addresses.find(p => p.id === +req.params.id)
//     if (address) {
//         res.send(address)
//     } else {
//         res.send(404)
//     }
//
// })
// app.put('/addresses/:id', (req: Request, res: Response) => {
//     let address = addresses.find(p => p.id === +req.params.id)
//     if (address) {
//         address.value = req.body.title
//         res.send(address)
//     } else {
//         res.send(404)
//     }
//
// })
// app.delete('/addresses/:id', (req: Request, res: Response) => {
//
//     for (let i = 0; i < addresses.length; i++) {
//         if (addresses[i].id === +req.params.id) {
//             addresses.splice(i, 1)
//             res.send(204)
//             return
//         }
//     }
//
//     res.send(404)
//
// })
// app.post('/addresses', (req: Request, res: Response) => {
//     const newAddr = {
//         id: +(new Date()),
//         value: req.body.title
//     }
//     addresses.push(newAddr)
//
//     res.status(201).send(newAddr)
//
// })
