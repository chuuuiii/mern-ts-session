import { RequestHandler } from "express";


export const requiresAuth: RequestHandler = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    next({ success: false, message: 'User not authenticated' })
  }
};