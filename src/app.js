const express = require('express')
require("dotenv").config({ path: `./src/env/${process.env.NODE_ENV}.env`});
require("./db_connection/conn")
const router = require("./routes/user_route")

const app = express()
const {error_middleware} = require("./middleware/error_middleware")
app.use(express.json());
app.use('/api',router );


const PORT = process.env.PORT;
app.use(error_middleware);
app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})
