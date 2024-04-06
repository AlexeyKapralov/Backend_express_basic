import {app} from "./app";
import {config} from "dotenv";
config()

app.listen(process.env.PORT, () => {
    console.log(`...server started on http://localhost:${process.env.PORT}`)
})