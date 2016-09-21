(function map(doc) {
  // all docs are clients, so bed id from visits array is a key, next is time
  doc.visits.forEach(function(visit) {
    var day = new Date(visit.start);
    
    emit([visit.bed, day.getFullYear(), day.getMonth(), day.getDate()],
         {
           visit: visit,
           client: {
             name: doc.name,
             id: doc._id
           }
         });
  });
})
