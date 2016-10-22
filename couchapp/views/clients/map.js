(
  function(doc) {
    if (doc.type!=='client') return;
    var notes = doc.notes
    doc.visits.forEach(function(visit) {
      if (!visit.notes) return
      notes = notes.concat(visit.notes.map(function(note) {
        return {
          text: note.text,
          author: note.author,
          data: visit.start
        }
      }))
    })
    emit(doc._id, { value: doc._id, label: doc.name, address: doc.address, phone: doc.phone, notes: notes })
  }
)
