import crypto from 'crypto';
import pkg from 'elliptic';

const { ec } = pkg;

export const generateHash = (...args) => {
  const hash = crypto
    .createHash('sha256')
    .update(args.sort().join(''))
    .digest('hex');

  return hash;
};

export const createEllipticHash = new ec('secp256k1');

export const verifySignature = ({ publicKey, data, signature }) => {
  const key = createEllipticHash.keyFromPublic(publicKey, 'hex');
  const result = key.verify(generateHash(data), signature);

  return result;
};
