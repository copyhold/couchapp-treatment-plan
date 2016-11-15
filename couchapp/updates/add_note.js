function(doc, req) {
  if (!doc) return [null, 'no note added - create user first'];
  var params = req.form;//JSON.parse(req.body);
  var note = {
      "created_at": Date().toString(),
      "text":       (params.text),
      "author":     req.userCtx.name
    };
  if (!doc.notes) doc.notes = []
  doc.notes.push(note);
  return [doc, 'added note'];
}

