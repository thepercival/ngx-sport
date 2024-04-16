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
            // console.log('pathNodeAsString', pathNodeAsString);
            const rootNodeRoundNumber = +pathNodeAsString;
            if (isNaN(rootNodeRoundNumber) ) {
                throw new Error('rootNodeRoundNumber is NotANumber 1');
            }
            // console.log('rootNodeRoundNumber', rootNodeRoundNumber);
            return new QualifyPathNode(undefined, rootNodeRoundNumber, undefined);
        }
        const rootNodeRoundNumber = +pathNodeAsString.substring(0, qualifyTargetPos);
        const rootPathNode = new QualifyPathNode(undefined, rootNodeRoundNumber, undefined);
        return this.createPathNodeRecursive(pathNodeAsString, qualifyTargetPos, rootPathNode);
    }

    private createPathNodeRecursive(pathNodeAsString: string, qualifyTargetPos: number, previous: QualifyPathNode): QualifyPathNode {
        // console.log('qualifyTargetPos: ' + qualifyTargetPos);
        // console.log('qualifyTarget from Path: ' + pathNodeAsString.substring(qualifyTargetPos, qualifyTargetPos + 1));        
        const qualifyTargetAsString = pathNodeAsString.substring(qualifyTargetPos, qualifyTargetPos + 1);
        const qualifyTarget = QualifyTarget.Winners === qualifyTargetAsString ? QualifyTarget.Winners : QualifyTarget.Losers;
        // console.log('qualifyTarget', qualifyTarget);

        const roundNumberStartPos = qualifyTargetPos + 1;
        const nextQualifyTargetPos = this.getPosQualifyTargetCharacter(pathNodeAsString, qualifyTargetPos + 1);
        if (nextQualifyTargetPos === false) {
            const qualifyGroupNumber = +pathNodeAsString.substring(roundNumberStartPos);
            if (isNaN(qualifyGroupNumber)) {
                throw new Error('rootNodeRoundNumber is NotANumber 2');
            }
            return previous.createNext(qualifyTarget, qualifyGroupNumber);
        }
        const qualifyGroupNumber = +pathNodeAsString.substring(roundNumberStartPos, nextQualifyTargetPos);
        if (isNaN(qualifyGroupNumber)) {
            // console.log(pathNodeAsString, roundNumberStartPos, nextQualifyTargetPos);
            throw new Error('rootNodeRoundNumber is NotANumber 3');
        }
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
