
export class BravoDate {
    public static FromString (dateISOString?: string):Date {
        var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)(?:([\+-])(\d{2})\:(\d{2}))?Z?$/.exec(dateISOString);
        if (a) {
            return new Date(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]);
        }
        return null;
    }
    public static FromDate (dateValue: Date): Date {
        return dateValue;
    }
    public static dateForForm(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }
    public static dateForFormWithTime(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
    public static dateForSave(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    }
    public static dateForSaveWithTime(date: Date): Date {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    }
}