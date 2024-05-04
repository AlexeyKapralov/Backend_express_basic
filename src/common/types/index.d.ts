import {Request} from 'express' //без этого импорта не будет работать

declare global {
    namespace Express {
        export interface Request {
            userId: string | null
        }
    }
}