import {app} from "./app";
import {SETTINGS} from "./setttings";

app.listen(SETTINGS.port, () => {
    console.log(`Server is running on port http://localhost:${SETTINGS.port}`)
})