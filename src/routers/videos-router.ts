import {Request, Response, Router} from "express";
import {app} from "../app";

export const videosRouter = Router({})

export const videos = [
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
]

const resolutionsEnum = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

function isValidResolution(resolution: string[]) {
    for (let i = 0; i < resolution.length; i++) {
        if (!resolutionsEnum.includes(resolution[i])) {
            return false;
        }
    }
    return true;
}

function validateVideoData(req: any, res: any, next: any) {
    const {title, author, availableResolutions, minAgeRestriction, publicationDate, canBeDownloaded} = req.body;
    const errorsMessages = []

    if (!title || title.length > 40) {
        errorsMessages.push(
            {
                message: "the inputModel has incorrect values or undefined",
                field: "title"
            }
        )

    }

    if (!author || author.length > 20) {

        errorsMessages.push(
            {
                message: "the inputModel has incorrect values or undefined",
                field: "author"
            }
        )
    }

    if (minAgeRestriction) {
        if (!Number.isInteger(minAgeRestriction)) {
            errorsMessages.push(
                {
                    message: "incorrect type",
                    field: "minAgeRestriction"
                }
            )
        }

        if (minAgeRestriction > 18) {
            errorsMessages.push(
                {
                    message: "incorrect values",
                    field: "minAgeRestriction"
                }
            )
        }
    }

    if (availableResolutions) {
        if (!isValidResolution(availableResolutions)) {
            errorsMessages.push(
                {
                    message: "the inputModel has incorrect values",
                    field: "availableResolutions"
                }
            )
        }
    }


    if (canBeDownloaded) {
        if (typeof canBeDownloaded !== 'boolean'){
            errorsMessages.push(
                {
                    message: "the inputModel has incorrect values",
                    field: "canBeDownloaded"
                }
            )
        }
    }

    if (publicationDate) {
        if ( !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(publicationDate) ) {
            errorsMessages.push(
                {
                    message: "the inputModel has incorrect values",
                    field: "publicationDate"
                }
            )
        }
    }

    if (errorsMessages.length !== 0) {
        return res.status(400).json({errorsMessages})
    }
    // Если все данные прошли валидацию, продолжаем обработку запроса
    next();
}

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.post('/', validateVideoData, (req: Request, res: Response) => {

    const maxId = videos.reduce((max, video) => (video.id > max ? video.id : max), -1)
    const myDate = new Date().toISOString()
    const nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
    let canBeDownloaded = false
    if (req.body.canBeDownloaded) {
        canBeDownloaded = req.body.canBeDownloaded
    }
    let minAgeRestriction = null
    if (req.body.minAgeRestriction) {
        minAgeRestriction = req.body.minAgeRestriction
    }

    const newVideo =
        {
            id: maxId + 1,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: canBeDownloaded,
            minAgeRestriction: minAgeRestriction,
            createdAt: myDate,
            publicationDate: nextDate,
            availableResolutions: req.body.availableResolutions
        }

    videos.push(newVideo)

    res.status(201).send(newVideo)
})

app.get(`/:id`, (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        res.status(200).send(video)
    } else {
        res.send(404)
    }
})

app.put(`/:id`, validateVideoData, (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        video.title = req.body.title
        video.author = req.body.author
        video.availableResolutions = req.body.availableResolutions
        video.canBeDownloaded = req.body.canBeDownloaded
        if (req.body.minAgeRestriction) {
            video.minAgeRestriction = req.body.minAgeRestriction
        } else video.minAgeRestriction = null

        if (req.body.publicationDate) {
            video.publicationDate = req.body.publicationDate
        } else {
            video.publicationDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
        }
        res.send(204)
    } else {
        res.status(404).json(
            {
                errorsMessages: [
                    {
                        message: "Video is not found"
                    }
                ]
            }
        )
    }

})

app.delete(`/:id`, (req: Request, res: Response) => {

    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.send(204)
            return
        }
    }

    res.send(404)

})