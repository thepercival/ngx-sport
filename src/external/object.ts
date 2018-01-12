/**
 * Created by coen on 13-2-17.
 */

import { ExternalSystem} from './system';

export class ExternalObject{
    protected id: number;
    protected importableObject: any;
    protected externalSystem: ExternalSystem;
    protected externalid: string;

    // constructor
    constructor(
        importableObject: any,
        externalSystem: ExternalSystem,
        externalid: string,
    ){
        this.importableObject = importableObject;
        this.externalSystem = externalSystem;
        this.externalid = externalid;
    }

    getId(): number {
        return this.id;
    };

    setId( id: number): void {
        this.id = id;
    };

    getImportableObject(): any {
        return this.importableObject;
    };

    getExternalSystem(): ExternalSystem {
        return this.externalSystem;
    };

    getExternalid(): string {
        return this.externalid;
    };
}