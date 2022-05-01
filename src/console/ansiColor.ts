export enum AnsiColor {
    Red = 31,
    Green = 32,
    Yellow = 33,
    Blue = 34,
    Magenta = 35,
    Cyan = 36,
    White = 37
}

export class AnsiColorHelper {
    public static getColored(color: AnsiColor | undefined, content: string): string {
        if (color === undefined) {
            return content;
        }
        const coloredString = '\u001b[' + color + 'm';
        return coloredString + content + '\u001b[39m';
    }
}