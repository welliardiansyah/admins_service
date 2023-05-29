// import { randomBytes } from 'crypto';
import momenttz from 'moment-timezone';
import { extname } from 'path';
import moment from 'moment';

export class Utils {
  /**
   *
   * @param text string with underscore format ex: "user_test"
   * @returns text with formatted and first char is uppercased ex: "User Test"
   */
  static formatUnderscoreToWord(text: string) {
    const splits = text.split('_').map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return splits.join(' ');
  }
}

export const editFileName = (req: any, file: any, callback: any) => {
  // const random_number = parseInt('0.' + randomBytes(8).toString('hex'), 16);
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(random_number * 16).toString(16))
  //   .join('');
  const randomName = moment().format('x');
  // callback(null, `${name}-${randomName}${fileExtName}`);
  callback(null, `${randomName}-${name}${fileExtName}`);
};

export const imageFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = 'file.image.not_allowed';
    callback(null, false);
  }
  callback(null, true);
};

export const imageJpgPngFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    if (!req.fileValidationError) {
      req.fileValidationError = [];
    }
    const error = {
      value: file.originalname,
      property: file.fieldname,
      constraint: 'file.image.not_allowed',
    };
    req.fileValidationError.push(error);
    callback(null, false);
  }
  callback(null, true);
};

export const formatingOutputTime = function formatingOutputTime(time: string) {
  return momenttz(time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

export const formatingAllOutputTime = function formatingAllOutputTime(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('_at')) {
      object[key] = this.formatingOutputTime(object[key]);
    }
    if (object[key] && typeof object[key] === 'object') {
      this.formatingAllOutputTime(object[key]);
    }
  }
};

export const removeAllFieldPassword = function removeAllFieldPassword(
  object: any,
) {
  for (const key in object) {
    if (object[key] && key.endsWith('password')) {
      delete object[key];
    }
    if (object[key] && typeof object[key] === 'object') {
      this.removeAllFieldPassword(object[key]);
    }
  }
};

export const createUrl = function (filename: any) {
  if (typeof filename == 'undefined' || filename == null || filename == '') {
    return null;
  } else {
    return process.env.BASEURL_API + '/api/v1/customers/image' + filename;
  }
};
