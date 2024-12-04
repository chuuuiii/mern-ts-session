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

    //session
    // req.session.userId = newUser._id;

    // Respond with success
      res.status(201).json({ success: true, data: { id: newUser._id, username: newUser.username, email: newUser.email } })

  } catch (error) {
    //Pass the error to the next middleware
    next(error)
  }
};


interface LoginBody {
  username: string,
  password: string,
}


export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
       res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
       res.status(401).json({ success: false, message: 'Invalid credentials' });
    }


    const passwordMatch = await bcrypt.compare(password, user?.password as string); 

    if (!passwordMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    
      res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};



