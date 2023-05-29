export class SetFieldEmptyUtils {
  apply(data: any, fields: string[]): any {
    fields?.forEach((field) => {
      data[field] = null;
    });

    return data;
  }
}
