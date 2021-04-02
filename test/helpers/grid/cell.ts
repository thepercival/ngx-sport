import { GridColor } from "./color";

const chalk = require('chalk');

export class GridCell {
    protected color: GridColor = GridColor.White;

    public constructor(protected value: string) {
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(value: string): void {
        this.value = value;
    }

    public getColor(): number {
        return this.color;
    }

    public setColor(color: number): void {
        this.color = color;
    }

    public toString() {
        switch (this.color) {
            case GridColor.Red:
                return chalk.red(this.value);
            case GridColor.Green:
                return chalk.green(this.value);
            default:
                return chalk.white(this.value);
        }
    }
}