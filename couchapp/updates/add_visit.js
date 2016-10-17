function(doc, req) {
  if (!doc) return [null, 'no visit created - create user first'];
  var params = req.form;//JSON.parse(req.body);
  doc.visits.push({
      "created_at": Date().toString(),
      "start":      new Date(params.start).toString(),
      "end":        new Date(params.end).toString(),
      "bed":        parseInt(params.bed),
      "author":     req.userCtx.name
    });
  return [doc, 'added visit'];
}
