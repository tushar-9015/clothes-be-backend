import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  if (!id) {
    throw new Error('User ID is required to generate token');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
