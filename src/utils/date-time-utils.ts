import momenttz from 'moment-timezone';
import moment from 'moment';

export class DateTimeUtils {
  /**
   *
   * @param date Date format
   * @returns Time format in HH:mm in string
   */
  static DateTimeToUTC(date: Date): string {
    const currentDate = date ? date : new Date();
    return momenttz(currentDate).tz('UTC').format('HH:mm');
  }

  /**
   * Convert military time to gmt offset
   * @param time Date Format 'HH:MM'
   * @param gmt_offset GMT offset from timezone
   */
  static calcClockTimeWithGMTOffset(
    curTime: string,
    gmt_offset: number,
  ): string {
    const inputTime = moment(curTime, 'HH:mm').format('HH:mm');
    return moment(inputTime, 'HH:mm').utcOffset(gmt_offset).format('HH:mm');
  }

  /**
   *
   * @param currTime Current input time clock in HH:mm
   * @param currTimeGMTOffset GMT offset/ timezone from currTime
   * @returns converted clock Time, based on difference by currTimeGMTOffset with UTC +0
   */
  static convertTimeToUTC(currTime: string, currTimeGMTOffset: number): string {
    if (!currTime) {
      currTime = '00:00';
    }
    const gmtOffset = this.getDiffFromUTCOffset(currTimeGMTOffset);

    const inputTime = moment(currTime, 'HH:mm').format('HH:mm');
    return moment(inputTime, 'HH:mm').utcOffset(gmtOffset).format('HH:mm');
  }

  /**
   *
   * @returns Day of Week (0-6) in number
   */
  static getDayOfWeekInWIB(): number {
    const serverDate = new Date();
    const weekDayInWIB = momenttz(serverDate)
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD');
    return parseInt(moment(weekDayInWIB).format('d'), 10);
  }

  /**
   *
   * @returns Day of Week in word (Mon, Tue, ... Sun)
   */
  static getWordDayOfWeekInWIB(): string {
    const serverDate = new Date();
    const weekDayInWIB = momenttz(serverDate)
      .tz('Asia/Jakarta')
      .format('YYYY-MM-DD');

    return moment(weekDayInWIB).format('ddd').toString().toLowerCase();
  }

  /**
   *
   * @param day_in_number number - day in number format ('d')
   * @returns Day of week in 'ddd' format
   */
  static convertToDayOfWeek(day_in_number: number) {
    return moment(day_in_number, 'd').format('ddd').toString().toLowerCase();
  }

  /**
   *
   * @param day_of_week string - string from day of week in format('ddd')
   * @returns Day of week in 'd' format
   */
  static convertToDayOfWeekNumber(day_of_week: string): number {
    const dayOfWeek = moment(day_of_week, 'ddd').format('d');
    return parseInt(dayOfWeek, 10);
  }

  /**
   *
   * @param gmt_offset current input GMT offset
   * @returns GMT offset difference from UTC - 8 OR (-8) - UTC Offset
   */
  static getDiffFromUTCOffset(gmt_offset: number): number {
    return gmt_offset >= 0 ? 0 - gmt_offset : gmt_offset * -1;
  }

  static getNewThisWeekDate(currentDate: Date) {
    return moment(currentDate).subtract(1, 'week').startOf('day');
  }

  static nowToDatetimeMilis = (date: Date): number => {
    const target = momenttz(date);
    const now = momenttz(new Date());
    return momenttz.duration(target.diff(now)).asMilliseconds();
  };
}
