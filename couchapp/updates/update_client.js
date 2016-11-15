function(doc, req) {
  if (!doc) return [null, 'no client updated - not found'];
  var params = req.form;//JSON.parse(req.body);
  // if (params.tz) doc._id = params.tz
  if (params.name) doc.name = params.name
  if (params.phone) doc.phone = params.phone
  if (params.email) doc.email = params.email
  if (params.address) doc.address = params.address
  return [doc, 'client updated'];
}
