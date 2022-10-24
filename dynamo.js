const AWS = require('aws-sdk');
var moment = require('moment');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'HelpDesk';

const getTicket = async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
    };
    try{
        const result = await dynamoClient.scan(params).promise();
        // console.log("success")
        for(var i=0;i<(result.Items).length;i++){
            result.Items[i].createTime = await Number(result.Items[i].createTime)
            result.Items[i].lastUpdate = await Number(result.Items[i].lastUpdate)
            result.Items[i].createTimeFormat = await moment(result.Items[i].createTime).format("DD MMM YYYY hh:mm")
            result.Items[i].lastUpdateFormat = await moment(result.Items[i].lastUpdate).format("DD MMM YYYY hh:mm")
            // console.log(result.Items[i].createTime,result.Items[i].createTimeFormat)
        }
        res.status(200).send(result)
    }
    catch(err){
        res.status(400).send({ message: err })
        // console.log("err")
    }
};

const getTicketById = async (req, res) => {
    const params = {
        TableName: TABLE_NAME,
        Key:{
            ticketId: req.params.id,
            createTime: Number(req.params.sort)
        }
    };
    try{
        const result = await dynamoClient.get(params).promise();
        // console.log("success")
        res.status(200).send(result)
    }
    catch(err){
        res.status(400).send({ message: err })
        // console.log("err")
    }
};

const updateStatusTicket = async (req, res) => {
    let ticket = req.body
    ticket.lastUpdate = moment().valueOf() 
    const params = {
        TableName: TABLE_NAME,
        Item: ticket,
    };
    try{
        const result = await dynamoClient.put(params).promise();
        // console.log("update status success")
        // console.log(params.Item)
        res.status(200).send(result)
    }
    catch(err){
        res.status(400).send({ message: err })
        // console.log("update status err")
    }
};

const addTicket = async (req, res) => {
    let now = moment().valueOf()
    let ticket = {
        ticketId: req.body.ticketId ? req.body.ticketId : uuidv4(),
        createTime: req.body.createTime ? req.body.createTime : now,
        description: req.body.description,
        title: req.body.title,
        status: req.body.status,
        contact:{
            name: req.body.contact.name,
            faculty: req.body.contact.faculty,
            major: req.body.contact.major,
            studentId: req.body.contact.studentId,
            telephone: req.body.contact.telephone,
            year: req.body.contact.year,
        },
        lastUpdate: now,
    }
    const params = {
        TableName: TABLE_NAME,
        Item: ticket,
    };
    try{
        const result = await dynamoClient.put(params).promise();
        // console.log("add success")
        // console.log(ticket)
        res.status(200).send(result)
    }
    catch(err){
        res.status(400).send({ message: err })
        // console.log("err")
    }
};

module.exports = {
    getTicket,
    updateStatusTicket,
    getTicketById,
    addTicket
};

