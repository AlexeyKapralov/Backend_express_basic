import { Request, Response } from "express";
import { app } from ".";

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});
