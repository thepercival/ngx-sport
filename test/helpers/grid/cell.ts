import { AnsiColor, AnsiColorHelper } from "../../../public-api";

export class GridCell {
    protected color: AnsiColor | undefined;

    public constructor(protected value: string) {
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(value: string): void {
        this.value = value;
    }

    public getColor(): AnsiColor | undefined {
        return this.color;
    }

    public setColor(color: AnsiColor | undefined): void {
        this.color = color;
    }

    public toString() {
        if (this.color === undefined) {
            return this.value;
        }
        return AnsiColorHelper.getColored(this.color, this.value);
    }
}