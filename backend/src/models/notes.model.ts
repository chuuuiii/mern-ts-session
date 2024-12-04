import mongoose, { InferSchemaType, Schema, model } from "mongoose";


const notesSchema = new mongoose.Schema({
  title: {
    type: Schema.Types.String,
    required: true,
    trim: true,
    // maxlength: 50,
  },
  note: {
    type: Schema.Types.String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

notesSchema.index({ title: 1 });

type Notes = InferSchemaType<typeof notesSchema>;

export default model<Notes>('Notes', notesSchema);