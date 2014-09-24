var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/datashare', function(err, db) {
    if (err) throw err;

    db.collection('images').find({},function(err,cursor){

        function processDoc(err, doc) {
           if (err) throw err;
           if (doc === null){

               db.collection('images').count(function(err,countImages){
                   if (err) throw err;
                   console.log('Total images: ',countImages);

                   db.collection('images').count({'tags': {'$all': ['kittens']}}, function(err,countTags) {
                       console.log('Total kittens: ',countTags);
                       return db.close();
                   });
               })

           }else {

               db.collection('albums').count({'images': {'$all': [doc._id]}}, function (err, count) {
                   if (err) throw err;
                   else if (count == 0) {

                       db.collection('images').remove({_id: doc._id}, function (err) {
                           if (err) throw err;
                           cursor.nextObject(processDoc);
                       });

                   } else {
                       cursor.nextObject(processDoc);
                   }
               })
           }

       }
        cursor.nextObject(processDoc);
    })
});