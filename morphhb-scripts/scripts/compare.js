const utils = require('../utils')

module.exports = (connection, done) => {
  
  console.log(`\nRunning compare script...`)

  const updates = []

  // go through every word and update the status if it should be different

  const select = `SELECT
                    words_enhanced.id,
                    words_enhanced.morph,
                    words_enhanced.status,
                    notes_enhanced.memberId,
                    notes_enhanced.morph as noteMorph,
                    notes_enhanced.verification
                  FROM words_enhanced
                    LEFT JOIN wordnote_enhanced ON (wordnote_enhanced.wordId = words_enhanced.id)
                    LEFT JOIN notes_enhanced ON (wordnote_enhanced.noteId = notes_enhanced.id)
                  ORDER BY words_enhanced.id, notes_enhanced.noteDate DESC`

  connection.query(select, (err, result) => {
    if(err) throw err

    let lastRowWithUniqueWord = {}
    const words = result.filter(row => {
      const noteObj = {
        memberId: row.memberId,
        morph: row.noteMorph,
        verification: row.verification,
      }
      if(row.id == lastRowWithUniqueWord.id) {
        if(lastRowWithUniqueWord.notes[0] && lastRowWithUniqueWord.notes[0].verification) {
          // if verified parsing already present, skip
        } else if(row.verification) {
          // if new note is verfiied, make it the only note
          lastRowWithUniqueWord.notes = [ noteObj ]
        } else if(lastRowWithUniqueWord.notes.every(note => (note.memberId != row.memberId))) {
          // if there is not already a note by this member, add it to the list
          lastRowWithUniqueWord.notes.push(noteObj)          
        }
        return false
      } else {
        row.notes = row.memberId ? [ noteObj ] : []
        delete row.memberId
        delete row.noteMorph
        delete row.verification
        lastRowWithUniqueWord = row
        return true
      }
    })

    words.forEach(word => {
      let newStatus, newMorph
      
      if(word.notes.length == 0) {
        newStatus = 'none'
        newMorph = null
      } else if(word.notes[0].verification) {
        newStatus = 'verified'
        newMorph = word.notes[0].morph
      } else if(word.notes.length == 1) {
        newStatus = 'single'
        newMorph = word.notes[0].morph
      } else if(word.notes.map(note => note.morph).reduce((x, y) => x.includes(y) ? x : [...x, y], []).length == 1) {
        newStatus = 'confirmed'
        newMorph = word.notes[0].morph
      } else {
        newStatus = 'conflict'
        newMorph = null
      }
  
      if(newMorph != word.morph || newStatus != word.status) {
        updates.push(`UPDATE words_enhanced SET morph='${newMorph}', status='${newStatus}' WHERE id=${word.id}`)
      }
    })

    console.log(`  ${updates.length} words needing status or morph update.`)

    utils.doUpdatesInChunks(connection, { updates }, numRowsUpdated => {
    
      console.log(`  ${numRowsUpdated} words had their status or morph updated.`)
      console.log(`Done with compare script.`)
      done()
          
    })
  })
  
}  