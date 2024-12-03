import { InferSchemaType, Schema, model } from "mongoose";
import validator from "validator";


const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // removed extra whitespace
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Ensures email is stored in lowercase
    validate: [validator.isEmail, "Invalid email format"], // Email validation
    select: false, // Prevents email from being fetched by default
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  }
}, { timestamps: true });

// Infer the TypeScript type from the schema
type User = InferSchemaType<typeof userSchema>;

// Export the model
export default model<User>('User', userSchema);