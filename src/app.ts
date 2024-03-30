import express, {Request, Response} from 'express'
import cors from 'cors'
import {SETTINGS} from "./settings";

export const app = express()
app.use(express.json())

app.use(cors())


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
]

const resolutionsEnum = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']


// Тип данных видео
type VideoData = {
    id: number,
    title: string;
    author: string;
    canBeDownloaded: boolean | false,
    minAgeRestriction: number | null,
    createdAt: Date,
    publicationDate: Date,
    availableResolutions: typeof resolutionsEnum | null;
};

function isValidResolution(resolution: string[]) {
    for (let i = 0; i < resolution.length; i++) {
        if (!resolutionsEnum.includes(resolution[i])) {
            return false;
        }
    }
    return true;
}

function validateVideoData(req: any, res: any, next: any) {
    const {title, author, availableResolutions, minAgeRestriction, publicationDate} = req.body;

    if (!title || title.length > 40) {
        return res.status(400).json(
            {
                errorsMessages: [
                    {
                        message: "the inputModel has incorrect values or undefined",
                        field: "title"
                    }
                ]
            })
    }

    if (!author || author.length > 20) {
        return res.status(400).json(
            {
                errorsMessages: [
                    {
                        message: "the inputModel has incorrect values or undefined",
                        field: "length"
                    }
                ]
            })
    }

    if (minAgeRestriction) {
        if (!Number.isInteger(minAgeRestriction)) {
            return res.status(400).json(
                {
                    errorsMessages: [
                        {
                            message: "incorrect type",
                            field: "minAgeRestriction"
                        }
                    ]
                })
        }

        if (minAgeRestriction.length > 20) {
            return res.status(400).json(
                {
                    errorsMessages: [
                        {
                            message: "incorrect values",
                            field: "minAgeRestriction"
                        }
                    ]
                })
        }
    }

    if (availableResolutions) {
        if (!isValidResolution(availableResolutions)) {
            return res.status(400).json({
                errorsMessages: [
                    {
                        message: "the inputModel has incorrect values",
                        field: "availableResolutions"
                    }
                ]
            })
        }
    }


    if (publicationDate) {

    }
    // Если все данные прошли валидацию, продолжаем обработку запроса
    next();
}

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({version: '1.0'})
})

app.get(SETTINGS.PATH.VIDEOS, (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.post(`${SETTINGS.PATH.VIDEOS}`, validateVideoData, (req: Request, res: Response) => {

    const maxId = videos.reduce((max, video) => (video.id > max ? video.id : max), -Infinity)
    const myDate = new Date().toISOString()
    const nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()

    const newVideo =
        {
            id: maxId + 1,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: myDate,
            publicationDate: nextDate,
            availableResolutions: req.body.availableResolutions
        }

    videos.push(newVideo)

    res.status(200).send(newVideo)
})

app.get(`${SETTINGS.PATH.VIDEOS}/:id`, (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    if (video) {
        res.status(200).send(video)
    } else {
        res.status(404).json({error: `If video for passed id doesn't exist`})
    }
})

app.put(`${SETTINGS.PATH.VIDEOS}/:id`, validateVideoData, (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +req.params.id)
    let curDate = new Date().toISOString()
    let nextDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
    if (video) {
        video.title = req.body.title
        video.author = req.body.author
        video.availableResolutions = req.body.availableResolutions
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.publicationDate
        video.createdAt = curDate

        if (req.body.publicationDate) {
            video.publicationDate = req.body.publicationDate
        } else {
            video.publicationDate = nextDate
        }
        res.send(video)
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

app.delete(`${SETTINGS.PATH.VIDEOS}/:id`, (req: Request, res: Response) => {

    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.send(204)
            return
        }
    }

    res.send(404)

})

app.delete(SETTINGS.PATH.DEL_ALL, (req: Request, res: Response) => {
    videos.splice(0, videos.length);
    res.send(204)
})


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