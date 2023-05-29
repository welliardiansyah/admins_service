// import { randomBytes } from 'crypto';
import { FirebaseDynamicLinks } from 'firebase-dynamic-links';
import moment from 'moment';
import momenttz from 'moment-timezone';
import { extname } from 'path';

export const check24HrsFormat = (time: string): boolean => {
  const TIME_FORMAT_24HRS_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

  return TIME_FORMAT_24HRS_REGEX.test(time);
};

export const editFileName = (req: any, file: any, callback: any) => {
  // const random_number = parseInt('0.' + randomBytes(4).toString('hex'), 16);
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

export const imageAndPdfFileFilter = (req: any, file: any, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
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

export const createUrl = function (filename: any) {
  if (typeof filename == 'undefined' || filename == null || filename == '') {
    return '';
  } else {
    return process.env.BASEURL_API + '/api/v1/catalogs/image' + filename;
  }
};

export const dbOutputTime = function (input: Record<string, any>) {
  if (input != null) {
    if (
      typeof input.approved_at != 'undefined' &&
      input.approved_at != null &&
      input.approved_at != 'undefined' &&
      input.approved_at != ''
    ) {
      input.approved_at = momenttz(input.approved_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      typeof input.created_at != 'undefined' &&
      input.created_at != null &&
      input.created_at != 'undefined' &&
      input.created_at != ''
    ) {
      input.created_at = momenttz(input.created_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    if (
      typeof input.updated_at != 'undefined' &&
      input.updated_at != null &&
      input.updated_at != 'undefined' &&
      input.updated_at != ''
    ) {
      input.updated_at = momenttz(input.updated_at)
        .tz('Asia/Jakarta')
        .format('YYYY-MM-DD HH:mm:ss');
    }
  }
  return input;
};

export const deleteCredParam = function (input: Record<string, any>) {
  delete input.approved_at;
  delete input.created_at;
  delete input.updated_at;
  delete input.deleted_at;
  delete input.director_password;
  delete input.password;
  delete input.owner_password;
  delete input.pic_password;
  delete input.pic_finance_password;
  delete input.pic_operational_password;
  // delete input.token_reset_password;
  return input;
};

export const delParamNoActiveUpdate = function (input: Record<string, any>) {
  delete input.updated_at;
  delete input.deleted_at;
  delete input.director_password;
  delete input.password;
  delete input.owner_password;
  delete input.pic_password;
  delete input.pic_finance_password;
  delete input.pic_operational_password;
  return input;
};

export const delExcludeParam = function (input: Record<string, any>) {
  delete input.updated_at;
  delete input.deleted_at;
  delete input.director_password;
  delete input.password;
  delete input.owner_password;
  delete input.pic_password;
  delete input.pic_finance_password;
  delete input.pic_operational_password;
  dbOutputTime(input);
  return input;
};

export const formatingOutputTime = function formatingOutputTime(
  time: string | Date,
) {
  return momenttz(time).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

export const formatingOutputTimeYYYYMMDDNoTZ =
  function formatingOutputTimeYYYYMMDD(time: string | Date) {
    return momenttz(time).format('YYYY-MM-DD');
  };

export const getCurrentTime = function getCurrentTime() {
  return momenttz().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

export const formatNumber = function formatNumber(num) {
  return num
    ? num
        .toString()
        .replace(',', '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    : 0;
};

export const addTime = function addTime(time: string, min: number) {
  return momenttz(time)
    .add(min, 'minutes')
    .tz('Asia/Jakarta')
    .format('YYYY-MM-DD HH:mm:ss');
};

export const calculateRemainingTime = function calculateRemainingTime(
  maxTime: string,
  minTime: string,
) {
  return momenttz
    .duration(momenttz(maxTime).unix() - momenttz(minTime).unix(), 'second')
    .asSeconds();
};

export const formatingAllOutputTimeIso8601 =
  function formatingAllOutputTimeIso8601(object: any, tzOffset = 7): any {
    tzOffset = tzOffset ? tzOffset : 7;
    for (const key in object) {
      if (object[key] && (key.endsWith('_at') || key.endsWith('_date'))) {
        object[key] = this.formatingOutputTimeIso8601(object[key], tzOffset);
      }
      if (object[key] && typeof object[key] === 'object') {
        this.formatingAllOutputTimeIso8601(object[key], tzOffset);
      }
    }

    return object;
  };

export const formatingOutputTimeIso8601 = function formatingOutputTimeIso8601(
  time: string | Date,
  tzOffset: number,
) {
  return momenttz(time).utcOffset(tzOffset).toISOString(true);
};

export const formatDate = function formatDate(
  time: string | Date,
  tzOffset = 7,
) {
  return momenttz(time)
    .utcOffset(tzOffset ? tzOffset : 7)
    .format(`DD/MM/YYYY HH:mm ${tzOffset ? '(ZZ)' : ''}`);
};

export const getDay = function getDay(time: string | Date, tzOffset = 7) {
  return momenttz(time)
    .utcOffset(tzOffset ? tzOffset : 7)
    .format('dddd');
};

export const formatingAllOutputTime = function formatingAllOutputTime(
  object: any,
): any {
  for (const key in object) {
    if (object[key] && key.endsWith('_at')) {
      object[key] = this.formatingOutputTime(object[key]);
    }
    if (object[key] && typeof object[key] === 'object') {
      this.formatingAllOutputTime(object[key]);
    }
  }

  return object;
};

export const removeAllFieldPassword = function removeAllFieldPassword(
  object: any,
) {
  for (const key in object) {
    if (key.endsWith('password')) {
      delete object[key];
    } else if (object[key] && typeof object[key] === 'object') {
      this.removeAllFieldPassword(object[key]);
    }
  }
};

export const getDistanceInKilometers = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // km
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const dLatRadian = (dLat * Math.PI) / 180;
  const dLonRadian = (dLon * Math.PI) / 180;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLatRadian / 2) * Math.sin(dLatRadian / 2) +
    Math.sin(dLonRadian / 2) *
      Math.sin(dLonRadian / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const hideName = (name: string) => {
  return name.replace(/(?<=\w{1,})\w/g, '*');
};

export const getStoreOperationalStatus = (
  is_store_status: boolean,
  currTime: string,
  currWeekDay: number,
  curShiftHour: any[],
): boolean => {
  const isCurrentDay = curShiftHour.find(
    (row) => row.day_of_week == String(currWeekDay),
  );

  const respectShiftTime = isCurrentDay.shifts.find((e) =>
    currTime >= e.open_hour && currTime < e.close_hour ? true : false,
  );

  return is_store_status && respectShiftTime !== null && isCurrentDay.is_open
    ? true
    : false;
};

const STYLE_HEADER =
  "font-weight:700;min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;align-self: stretch;";
const CONTENT =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 20px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;";
const CONTENT16 =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 16px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;";
const CONTENT16BOLD =
  "min-height: 10px;left: 0px;top: 40px;font-family: 'Lato';font-style: normal;font-size: 16px;line-height: 24px;font-feature-settings: 'pnum'on, 'lnum'on;color: #26272A;flex: none;order: 1;align-self: stretch;flex-grow: 0;font-weight: 700;";
const PLACEHOLDER =
  "font-family: 'Lato';font-style: normal;font-weight: 400;font-size: 14px;line-height: 24px;color: rgba(38, 39, 42, 0.5);";

export const generateEmailUrlVerification = async (
  name: string,
  link: string,
): Promise<string> => {
  // const fbLink = new FirebaseDynamicLinks(process.env.FIREBASE_API_KEY);
  // const { shortLink } = await fbLink.createLink({
  //   dynamicLinkInfo: {
  //     domainUriPrefix: 'https://web.inovatif78.com',
  //     link,
  //   },
  // });

  const message = `
  <p style="${STYLE_HEADER}">Hai, ${name || 'User'}!</p>
  <p style="${CONTENT}"> Untuk verifikasi Email Anda klik link berikut: <a href="${link}">${link}</a> . </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk Inovatif 78. <br>
  WASPADA PENIPUAN! </p>`;
  return message;
};

export const generateMessageChangeActiveEmail = (name: string): string => {
  // const message = `
  // Hai, ${name || 'User'}!
  // <br><br>
  // Alamat email Anda berhasil diperbaharui, Anda dapat login pada aplikasi Inovatif 78 menggunakan email ini.`;
  const message = `
  <h1 style="${STYLE_HEADER}>Hai, ${name || 'User'}!</h1>
  <p style="${CONTENT}"> Alamat email Anda berhasil diperbaharui, Anda dapat login pada aplikasi Inovatif 78 menggunakan email ini.</p>`;
  return message;
};

export const generateMessageResetPassword = async (
  name: string,
  link: string,
): Promise<string> => {
  // const fbLink = new FirebaseDynamicLinks(process.env.FIREBASE_API_KEY);
  // const { shortLink } = await fbLink.createLink({
  //   dynamicLinkInfo: {
  //     domainUriPrefix: 'https://web.inovatif78.com',
  //     link,
  //   },
  // });

  const shortLink = await {
    dynamicLinkInfo: {
      domainUriPrefix: 'https://web.inovatif78.com',
      link,
    },
  };

  // const message = `
  // Hai, ${name || 'User'}!
  // <br><br>
  // Untuk mengubah Kata Sandi Anda, Klik link berikut: <a href="${shortLink}">${shortLink}</a> . <br>
  // JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk Inovatif 78. <br>
  // WASPADA PENIPUAN!`;

  const message = `
  <h1 style="${STYLE_HEADER}>Hai, ${name || 'User'}!</h1>
  <p style="${CONTENT}"> Untuk mengubah Kata Sandi Anda, Klik link berikut: <a href="${shortLink}">${shortLink}</a> . </p>
  <p style="${CONTENT}"> JANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk Inovatif 78. <br>
  WASPADA PENIPUAN! </p>`;
  return message;
};

export const generateMessageCreateTicket = async (
  name: string,
  no_ticket: string,
): Promise<string> => {
  const ticketBanner = 'https:/inovatif78/images/banner.png';
  const message = `
  <p style="${STYLE_HEADER}"> Dear, ${name || 'User'}! </p>
  <p style="${CONTENT16}"> Terima kasih telah menghubungi Pusat Bantuan Inovatif 78. </p>
  <p style="${CONTENT16}"> Kami sangat menghargai setiap masukan yang dapat membuat pelayanan kami lebih baik untuk Anda. </p>
  <p style="${CONTENT16}"> Kami sampaikan laporan Anda dengan nomor ${no_ticket} telah kami terima. </p>
  <p style="${CONTENT16}"> Mohon maaf atas ketidaknyamanan yang Anda alami. Mohon kesediaannya untuk menunggu, kami akan segera membalas laporan Anda. </p> <br/>
  <p style="${CONTENT16}"> Salam Hangat, </p>
  <p style="${CONTENT16BOLD}"> Emily </p>
  <p style="${CONTENT16}"> Inovatif 78 Customer Service </p>
  <img src="${ticketBanner}" width="100%" />
  <p style="${PLACEHOLDER}"> Email ini dibuat secara otomatis. Mohon tidak membalas email ini. </p>
  `;
  return message;
};

export const generateSmsUrlVerification = async (
  name: string,
  link: string,
): Promise<string> => {
  // const fbLink = new FirebaseDynamicLinks(process.env.FIREBASE_API_KEY);
  // const { shortLink } = await fbLink.createLink({
  //   dynamicLinkInfo: {
  //     domainUriPrefix: 'https://web.inovatif78.com',
  //     link,
  //   },
  // });

  const shortLink = await {
    dynamicLinkInfo: {
      domainUriPrefix: 'https://web.inovatif78.com',
      link,
    },
  };

  const message = `Hai, ${
    name || 'User'
  }!\n\nUntuk verifikasi No HP Anda klik link berikut: ${shortLink} .\nJANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk Inovatif 78.\nWASPADA PENIPUAN!
  `;
  return message;
};

export const generateSmsChangeActiveNoHp = (name: string): string => {
  const message = `Hai, ${
    name || 'User'
  }!\n\nNo HP Anda berhasil diperbaharui, Anda dapat login pada aplikasi Inovatif 78 menggunakan No HP ini.!`;
  return message;
};

export const generateSmsResetPassword = async (
  name: string,
  link: string,
): Promise<string> => {
  // const fbLink = new FirebaseDynamicLinks(process.env.FIREBASE_API_KEY);
  // const { shortLink } = await fbLink.createLink({
  //   dynamicLinkInfo: {
  //     domainUriPrefix: 'https://web.inovatif78.com',
  //     link,
  //   },
  // });

  const shortLink = await {
    dynamicLinkInfo: {
      domainUriPrefix: 'https://web.inovatif78.com',
      link,
    },
  };

  const message = `Hai, ${
    name || 'User'
  }!\n\nUntuk mengubah Kata Sandi Anda, Klik link berikut: ${shortLink} .\nJANGAN BAGIKAN LINK TERSEBUT KE SIAPAPUN termasuk Inovatif 78.\nWASPADA PENIPUAN!`;
  return message;
};
