/**
 * Created by coen on 13-2-17.
 */

export class ExternalObject {
    static readonly MAX_LENGTH_EXTERNALID = 100;

    protected id: number;
    protected externalId: string;

    constructor(
        protected importableObjectId: number,
        protected externalSystemId: number
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

    getExternalSystemId(): number {
        return this.externalSystemId;
    }

    getExternalId(): string {
        return this.externalId;
    }

    setExternalId(externalId: string) {
        this.externalId = externalId;
    }
}

export interface ImportableObject {
    getId(): number;
}
