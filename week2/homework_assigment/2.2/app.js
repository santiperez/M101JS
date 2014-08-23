var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/weather', function(err, db) {
    if (err) throw err;

    db.collection('data').find({},{},{sort:{'State':-1,'Temperature':-1}}, function(err,cursor){

        var state='';

        function processDoc(err, doc) {
           if (err) throw err;
           if (doc === null)return db.close();

           if (state != doc.State) {
               state = doc.State;

               //Update document
               doc.month_high=true;
               db.collection('data').save(doc,function (err, result) {
                   if (err) throw err;
                   console.log('isUpdated: ',result,'.Document: ',doc)
                   cursor.nextObject(processDoc);
               });
           }
           else {
               cursor.nextObject(processDoc);
           }
       }
        cursor.nextObject(processDoc);
    })
});