import crypto from 'crypto';
import pkg from 'elliptic';

const { ec } = pkg;

export const generateHash = (...args) => {
  return crypto.createHash('sha256').update(args.sort().join('')).digest('hex');
};
export const createEllipticHash = new ec('secp256k1');
