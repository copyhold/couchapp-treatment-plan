/**
 * Map function - use `emit(key, value)1 to generate rows in the output result.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#reduce-and-rereduce-functions
 *
 * @param {object} doc - Document Object.
 */
(function(doc) {
  doc.visits.forEach(function(visit) {
    var day = new Date(visit.start);
    
    emit([day.getFullYear(), day.getMonth(), day.getDate()],
         {
           visit: visit,
           client: {
             name: doc.name,
             value: doc._id
           }
         });
  });
})
