(
  function(doc) {
    if (doc.type!=='client') return;
    emit(doc._id, { value: doc._id, label: doc.name })
  }
)
