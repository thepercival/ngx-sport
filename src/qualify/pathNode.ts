import { QualifyTarget } from "./target";

export class QualifyPathNode {
    // private next: QualifyPathNode | undefined;

    constructor(private qualifyTarget: QualifyTarget | undefined, private qualifyGroupNumber: number, private previous?: QualifyPathNode) {

    }

    createNext(qualifyTarget: QualifyTarget, qualifyGroupNumber: number): QualifyPathNode {
        const path = new QualifyPathNode(qualifyTarget, qualifyGroupNumber, this);
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