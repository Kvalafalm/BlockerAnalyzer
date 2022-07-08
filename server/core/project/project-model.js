import pkg from 'mongoose';
const { Schema, model } = pkg;

const schema = new Schema({
  externalId: { type: String },
  name: { type: String },
  statuses: [
    {
      name: { type: String },
      id: { type: Number },
      typeOfStatus: { type: Number },
    },
  ],
  lastRequest: { type: Map },
});

export default model('project', schema);
