var MongoClient = require("mongodb").MongoClient;

messagesArray = [];

function postMessage(obj)
{
    // messagesArray.push(obj);
    MongoClient.connect("mongodb://localhost:27017/", (err, dbHost)=>{

        if(err)
        {
            console.log("Error connecting to the server");
        }
        else
        {
            var db = dbHost.db("sldb");
            db.collection("messages", (err, coll)=>{
                if(err)
                {
                    console.log("Error connecting to the collection");
                }
                else
                {
                    coll.insertOne(obj);
                }
            })
        }
    
    });
}

function getAllMessages()
{
    return messagesArray;
}

module.exports={postMessage, getAllMessages}