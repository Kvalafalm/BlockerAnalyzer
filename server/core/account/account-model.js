import pkg from 'mongoose';
const { Schema, model } = pkg;

const schema = new Schema({
  name: { type: String },
  externalServiceType: { type: String },
  externalServiceURL: { type: String },
  login: { type: String },
  password: { type: String },
});

export default model('account', schema);
