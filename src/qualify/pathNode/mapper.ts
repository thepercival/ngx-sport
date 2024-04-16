import { Injectable } from '@angular/core';

import { QualifyPathNode } from '../pathNode';
import { QualifyTarget } from '../target';

@Injectable({
    providedIn: 'root'
})
export class QualifyPathNodeMapper {
    constructor() {
    }

    toObject(pathNodeAsString: string): QualifyPathNode|undefined {
        if (pathNodeAsString.length === 0) {
            return undefined;
        }
        return this.createRootPathNode(pathNodeAsString);
    }

    toString(qualifyPathNode: QualifyPathNode): string {
        return qualifyPathNode.pathToString();
    }

    private createRootPathNode(pathNodeAsString: string): QualifyPathNode {
        // root
        const qualifyTargetPos = this.getPosQualifyTargetCharacter(pathNodeAsString, 0);
        if (qualifyTargetPos === false) {
            const rootNodeRoundNumber = +pathNodeAsString;
            return new QualifyPathNode(undefined, rootNodeRoundNumber, undefined);
        }
        const rootNodeRoundNumber = +pathNodeAsString.substring(0, qualifyTargetPos);
        const rootPathNode = new QualifyPathNode(undefined, rootNodeRoundNumber, undefined);
        return this.createPathNodeRecursive(pathNodeAsString, qualifyTargetPos, rootPathNode);
    }

    private createPathNodeRecursive(pathNodeAsString: string, qualifyTargetPos: number, previous: QualifyPathNode): QualifyPathNode {
        const qualifyTarget = QualifyTarget[pathNodeAsString.substring(qualifyTargetPos, 1)];

        const roundNumberStartPos = qualifyTargetPos + 1;
        const nextQualifyTargetPos = this.getPosQualifyTargetCharacter(pathNodeAsString, qualifyTargetPos + 1);
        if (nextQualifyTargetPos === false) {
            const qualifyGroupNumber = +pathNodeAsString.substring(roundNumberStartPos);
            return previous.createNext(qualifyTarget, qualifyGroupNumber);
        }
        const qualifyGroupNumber = +pathNodeAsString.substring(roundNumberStartPos, nextQualifyTargetPos - roundNumberStartPos);
        const pathNode = previous.createNext(qualifyTarget, qualifyGroupNumber);
        return this.createPathNodeRecursive(pathNodeAsString, nextQualifyTargetPos, pathNode);
    }

    private getPosQualifyTargetCharacter(pathNodeAsString: string, fromIndex: number): number | false {

        const posFirstWinnersCharacter = pathNodeAsString.indexOf(QualifyTarget.Winners, fromIndex);
        const posFirstLosersCharacter = pathNodeAsString.indexOf(QualifyTarget.Losers, fromIndex);
        if (posFirstWinnersCharacter === -1 && posFirstLosersCharacter === -1) {
            return false;
        }
        if (posFirstWinnersCharacter === -1) {
            return posFirstLosersCharacter;
        }
        if (posFirstLosersCharacter === -1) {
            return posFirstWinnersCharacter;
        }
        return Math.min(posFirstLosersCharacter, posFirstWinnersCharacter);
    }
}
