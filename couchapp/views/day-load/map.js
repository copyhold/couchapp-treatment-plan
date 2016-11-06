(function(doc) {
  if (!doc.visits) return null;
  
  doc.visits.forEach(function(visit) {
    var start = new Date(visit.start);
    var end = new Date(visit.end);
    var diff = end - start;
    
    emit([start.getFullYear(), start.getMonth(), start.getDate()], Math.round(diff / 60000));
  });
})
