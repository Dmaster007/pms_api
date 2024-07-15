const mongoose = require('mongoose');
const crypto = require('crypto-js');

const issueSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      // Generate a random hash for the ID field
      return crypto.lib.WordArray.random(16).toString(crypto.enc.Hex);
    }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignee: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  progress:{type:String},
  priority:{type:String},
  startDate:{type:Date},
  dueDate:{type:Date},
  category: {type:String},
  title: String,
  content: String,
  isOver:{type : Boolean , default:false },
  createdAt: { type: Date, default: Date.now },
  project:{type: mongoose.Schema.Types.ObjectId , ref:'Project' ,default:'667d2fe8b47bfaaa71545245'},
  status: {type:String ,default:'todo'}
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
