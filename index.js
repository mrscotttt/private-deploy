const express = require("express");
const app = express();
const bodyParser = require('body-parser')


app.use(express.json());
app.use(bodyParser.json())

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
app.get('/', async (req, res) => {
    res.json("hello World")
})


const {getTicket,addTicket,updateStatusTicket,getTicketById} = require('./dynamo');


app.get('/ticket',getTicket);
app.get('/ticketById/:id/:sort',getTicketById);
app.post('/addTicket',addTicket);
app.post('/updateStatusTicket',updateStatusTicket);

