import { RequestHandler } from "express";
import User from '../models/users.model'
import validator from "validator";
import bcrypt from 'bcrypt';


interface SignupBody {
  username: string,
  email: string,
  password: string,
}

export const signUp: RequestHandler<unknown, unknown, SignupBody, unknown> = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    //Check for missing fields
    if (!username || !email || !password) {
       res.status(400).json({ success: false, message: 'Please provide all the details' })
    }
    //Validate email
    if (!validator.isEmail(email)) {
       res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    //Validate password strength
    if (!validator.isStrongPassword(password, { minLength: 8})) {
      res.status(400).json({ success: false, message: 'Password must include letters, numbers, and symbols' });
    }
    //Check for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' })
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({ username, email, password: hash });

    // Respond with success
      res.status(201).json({ success: true, data: { id: newUser._id, username: newUser.username, email: newUser.email } })

  } catch (error) {
    //Pass the error to the next middleware
    next(error)
  }
};