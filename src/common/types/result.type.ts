import {ResultStatus} from "./resultStatus.type";

export type ResultType<T = null> = {
    status: ResultStatus;
    errorMessage?: string;
    extensions?: [{ field: 'id'; message: '' }];
    data: T;
}