import pkg from 'mongoose';
const { Schema, model, Types } = pkg;

const schema = new Schema({
  tags: [{ type: String }],
  idBloker: { type: String },
  idSpace: { type: Types.ObjectId, ref: 'project' },
  idIssue: { type: String, require: true },
  start: { type: Date, require: true },
  end: { type: Date },
  time: { type: Number, default: 0 },
  priority: { type: Number, default: 2 },
  project: { type: String, default: '' },
  typeIssue: { type: String },
  reason: { type: String },
  linkIssue: { type: String },
  decision: { type: String },
  status: { type: String },
  comments: { type: String },
});

export default model('Blocker', schema);
