import {SETTINGS} from '../src/settings'
import {app} from "../src/app";

const request = require('supertest');

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.DEL_ALL).expect(204)
    })

    it('should get empty array', async () => {

        await request(app)
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, [])
    })

    it('should return 404 for not existing entity', async () => {
        await request(app)
            .get(`${SETTINGS.PATH.VIDEOS}/1`)
            .expect(404)
    })

    it('should get created video', async () => {

        const data = {
            title: "asd",
            author: "asd"
        }

        const createVideo = await request(app)
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(201)

        expect(createVideo.body).toEqual({
            id: expect.any(Number),
            title: data.title,
            author: data.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String)
        })


    })

    it('should return existing entity', async () => {
        const gettingVideo = await request(app)
            .get(`${SETTINGS.PATH.VIDEOS}/0`)
            .expect(200)

        expect(gettingVideo.body).toEqual({
            id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String)
        })
    })

    const updatedEntity = {
        title: "aasd",
        author: "asd",
        availableResolutions: ["P720"],
        canBeDownloaded: true,
        minAgeRestriction: 15,
        publicationDate: "2024-05-02T07:21:14.571Z"
    }
    it('should update existing entity', async () => {

        await request(app)
            .put(`${SETTINGS.PATH.VIDEOS}/0`)
            .send(updatedEntity)
            .expect(204)

    })

    it('should return update entity', async () => {

        const returnedEntity = await request(app)
            .get(`${SETTINGS.PATH.VIDEOS}/0`)
            .expect(200)

        expect(returnedEntity.body).toEqual({
            id: expect.any(Number),
            title: "aasd",
            author: "asd",
            availableResolutions: ["P720"],
            canBeDownloaded: true,
            minAgeRestriction: 15,
            createdAt: expect.any(String),
            publicationDate: "2024-05-02T07:21:14.571Z"
        })

    })


    it('should delete existing entity', async () => {
        await request(app)
            .delete(`${SETTINGS.PATH.VIDEOS}/0`)
            .expect(204)

    })

    it('should get empty array', async () => {

        await request(app)
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, [])
    })
})