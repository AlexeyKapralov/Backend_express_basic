import {req} from './test-helpers'
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import {SETTINGS} from '../src/settings'

describe('/videos', () => {
    beforeAll(async () => {
        // await req.delete('/testing/all-data')
    })

    it('should get empty array', async () => {
        // setDB()

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        // expect(res.body.length).toBe(0)
    })
    it('should get not empty array', async () => {
        // setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        // expect(res.body.length).toBe(1)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    // ...
    // it('should create', async () => {
    //     setDB()
    //     const newVideo: InputVideoType = {
    //         title: 't1',
    //         author: 'a1',
    //         availableResolution: [Resolutions.P144]
    //         // ...
    //     }
    //
    //     const res = await req
    //         .post(PATH.VIDEOS)
    //         .send(newVideo) // отправка данных
    //         .expect(201)
    //
    //     expect(res.body.availableResolution).toEqual(newVideo.availableResolution)
// ...
    // it('shouldn\'t find', async () => {
    //     setDB(dataset1)
    //
    //     const res = await req
    //         .get(PATH.VIDEOS + '/1')
    //         .expect(404) // проверка на ошибку
// ...
})