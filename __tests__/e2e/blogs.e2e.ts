import {agent as request} from "supertest";
import {app} from "../../src/app";

describe('', () => {
    it('should get version', async () => {
        await request(app)
            .get('/')
            .expect({version: '1'})
    })
})