import app from './app.js'
import dotenv from 'dotenv'
import { dbConnect } from './db/dbConnection.js';

dotenv.config({path:'./.env'})

const PORT = process.env.PORT || 6000;

dbConnect().then(()=>{
    app.listen(PORT,()=>
        {
            console.log(`Server has started at the port ${PORT}`)
        })
}).catch(()=>{
    console.log('Database connection failed')
})

