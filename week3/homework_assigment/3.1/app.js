var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/school', function(err, db) {
    if (err) throw err;

    db.collection('students').find({}, function(err,cursor){

        function processDoc(err, doc) {
           if (err) throw err;
           if (doc === null)return db.close();

            //Get index of lowest homework score
            var index=getIndexOfLowestHomeworkScore(doc);

           if (index != undefined) {
               //Remove it
               doc.scores.splice(index,1);
               db.collection('students').save(doc,function (err, result) {
                   if (err) throw err;
                   console.log('isUpdated: ',result,'.Document: ',JSON.stringify(doc))
                   cursor.nextObject(processDoc);
               });
           }
           else {
               console.log('Document', JSON.stringify(doc),' has not been modified.');
               cursor.nextObject(processDoc);
           }
       }
        cursor.nextObject(processDoc);
    })

    function getIndexOfLowestHomeworkScore(student) {
        var scores = student.scores;
        var lowScore,index;

        if (scores != undefined) {
            for (var i=0;i<student.scores.length;i++) {
                var scoreType = student.scores[i];
                if (scoreType.type == 'homework' &&(lowScore == undefined || scoreType.score < lowScore.score)) {
                        lowScore = scoreType;
                        index = i;
                }
            }
        }
        return index;
    }
});