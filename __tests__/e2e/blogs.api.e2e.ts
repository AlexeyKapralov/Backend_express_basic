import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/utils";

const request = require('supertest');

describe('', () => {
    beforeAll( async () => {
        await request(app).delete(`${SETTINGS.PATH.TESTS}/data`)
    })

    it('should get blogs', async () => {
        const response = await request(app)
            .get(`${SETTINGS.PATH.BLOGS}`)
            .expect(HTTP_STATUSES.OK_200)
            .expect([])
    });

});