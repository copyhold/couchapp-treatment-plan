/**
 * List function - use `start()` and `send()` to output headers and content.
 * @link http://docs.couchdb.org/en/latest/couchapp/ddocs.html#listfun
 *
 * @param {object} head - View Head Information. http://docs.couchdb.org/en/latest/json-structure.html#view-head-info-object
 * @param {object} req - Request Object. http://docs.couchdb.org/en/latest/json-structure.html#request-object
 **/
function(head, req) {
  start({
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  })
  var row;
  var out=[];
  while(row=getRow()) {
    out.push(row.value)
  }
  send(JSON.stringify(out))
}
