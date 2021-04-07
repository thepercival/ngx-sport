import { GridColor } from "./color";

import chalk from 'chalk';

export class GridCell {
    protected color: GridColor | string = GridColor.White;

    public constructor(protected value: string) {
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(value: string): void {
        this.value = value;
    }

    public getColor(): GridColor | string {
        return this.color;
    }

    public setColor(color: GridColor | string): void {
        this.color = color;
    }

    public toString() {
        if (typeof this.color === 'string') {
            return chalk.hex(this.color)(this.value);
        }
        switch (this.color) {
            case GridColor.Red:
                return chalk.red(this.value);
            case GridColor.Green:
                return chalk.green(this.value);
            case GridColor.Yellow:
                return chalk.yellow(this.value);
        }
        return chalk(this.value);
    }
}