import {agent as request} from "supertest"
import {app} from "../src/app";
import {StatusCodes} from "http-status-codes";

describe('app', () => {
    it('should return "All is working"', () => {
        request(app).get('/').expect(StatusCodes.OK).expect('All is working');
    })
})