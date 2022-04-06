import { QualifyTarget } from "../qualify/target";

export class StructurePathNode {
    // private next: StructurePathNode | undefined;

    constructor(private qualifyTarget: QualifyTarget | undefined, private qualifyGroupNumber: number, private previous?: StructurePathNode) {

    }

    createNext(qualifyTarget: QualifyTarget, qualifyGroupNumber: number): StructurePathNode {
        const path = new StructurePathNode(qualifyTarget, qualifyGroupNumber, this);
        // this.next = path;
        return path;
    }

    pathToString(): string {
        if (this.previous === undefined) {
            return this.nodeToString();
        }
        return this.previous.pathToString() + this.nodeToString();
    }

    protected nodeToString(): string {
        return this.qualifyTargetToString() + this.qualifyGroupNumber;
    }

    protected qualifyTargetToString(): string {
        return this.qualifyTarget ?? '';
    }

    getLevel(): number {
        return this.previous ? this.previous.getLevel() + 1 : 1;
    }
}