import {app} from "./app";
import {SETTINGS} from "./settings";


app.listen(SETTINGS.PORT, () => {

    console.log('...server started on http://localhost:' + SETTINGS.PORT)
})