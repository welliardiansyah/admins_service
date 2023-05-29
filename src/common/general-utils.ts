import { randomBytes } from 'crypto';

exports.randomString = function (panjang) {
  const random_number = parseInt('0.' + randomBytes(8).toString('hex'), 16);
  let result = '';
  const characters =
    '1234567890abcdefghijlmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < panjang; i++) {
    result += characters.charAt(Math.floor(random_number * charactersLength));
  }
  return result;
};

export const deleteCredParam = function (input: Record<string, any>) {
  delete input.approved_at;
  delete input.created_at;
  delete input.updated_at;
  delete input.deleted_at;
  delete input.password;
  delete input.owner_password;
  delete input.token_reset_password;
  return input;
};
