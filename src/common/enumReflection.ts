export class EnumReflection {
    public static getNames<T>(object: T): Array<string> {
        let result = new Array<string>();
        for (let name in object) {
            result.push(name);
        }
        return result;
    }

    public static getValues<T>(object: T): Array<number> {
        let result = new Array<number>();
        for (let name in object) {
            result.push(<any>object[name]);
        }
        return result;
    }
}