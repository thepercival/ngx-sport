
export class Identifiable {
    protected id: string | number = 0;
    getId(): string | number {
        return this.id;
    }

    setId(id: string | number): void {
        this.id = id;
    }
}
