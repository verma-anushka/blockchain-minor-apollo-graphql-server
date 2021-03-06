import { Schema, model } from 'mongoose';

const BlockModel = new Schema(
  {
    data: {
      type: String,
      required: true,
    },
    prevHash: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    timeStamp: {
      type: Date,
      required: true,
    },
    nounce: {
      type: Number,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    shared: {
      type: Array,
      required: false,
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { collection: 'Blockchain' },
);
export default model('BlockModel', BlockModel);
