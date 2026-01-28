const {Schema, model} = require('mongoose')

const todoItemSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
})


module.exports = model("TodoItem", todoItemSchema)