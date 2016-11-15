function(doc, req) {
  if (doc) return [null, JSON.stringify({ error: true, msg: 'client already registred'})];
  var params = req.form;//JSON.parse(req.body);
  var client = {
    type:       "client",
    name:       params.name,
    _id:        params.tz,
    address:    params.address,
    phone:      params.phone,
    email:      params.email,
    created_at: Date().toString(),
    visits: [ ],
    notes: [ ],
    author:     req.userCtx.name
  };
  return [client, JSON.stringify({ error: false, msg: 'added client'})];
}
