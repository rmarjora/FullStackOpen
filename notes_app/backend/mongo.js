const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const username = "rasmusmarjorantaatlas"
const password = process.argv[2]

const url = `mongodb+srv://${username}:${password}@cluster0.navdk5j.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

function addNote(content, important) {
  const note = new Note({
    content: content,
    important: important,
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})