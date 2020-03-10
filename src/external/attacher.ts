export class Attacher {
    static readonly MAX_LENGTH_EXTERNALID = 100;

    protected id: number;
    protected externalId: string;

    constructor(
        protected importableObjectId: number,
        protected externalSourceId: number
    ) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getImportableObjectId(): number {
        return this.importableObjectId;
    }

    getExternalSourceId(): number {
        return this.externalSourceId;
    }

    getExternalId(): string {
        return this.externalId;
    }

    setExternalId(externalId: string) {
        this.externalId = externalId;
    }
}

export interface Importable {
    getId(): number;
}
