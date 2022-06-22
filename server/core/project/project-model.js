import pkg from 'mongoose';
const { Schema, model } = pkg;

const schema = new Schema({
  projectId: { type: String },
  statuses: [
    {
      name: { type: String },
      id: { type: Number },
      typeOfStatus: { type: Number },
    },
  ],
});

export default model('project', schema);
