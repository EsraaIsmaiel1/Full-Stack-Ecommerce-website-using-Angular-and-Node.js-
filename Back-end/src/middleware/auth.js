import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import ErrorApi from '../utils/errorAPI.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers['authToken'];
  if (!token) {
    return next(new ErrorApi(`You have to login first`, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.currentUser = decoded;
  } catch (err) {
    return next(new ErrorApi(`Invalid Token`, 401));
  }
  return next();
});

export const isAllowed =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.currentUser.role)) {
      next();
    } else return next(new ErrorApi("You don't have access to this page"));
  };
