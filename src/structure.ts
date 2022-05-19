import { Category } from './category';
import { GameOrder } from './game/order';
import { Poule } from './poule';
import { QualifyGroup, Round } from './qualify/group';
import { QualifyTarget } from './qualify/target';
import { RoundNumber } from './round/number';


export class Structure {
    constructor(
        protected categories: Category[],
        protected firstRoundNumber: RoundNumber
    ) {
    }

    getCategories(): Category[] {
        return this.categories;
    }

    getRootRounds(): Round[] {
        return this.categories.map((category: Category): Round => {
            return category.getRootRound();
        });
    }

    getFirstRoundNumber(): RoundNumber {
        return this.firstRoundNumber;
    }

    getLastRoundNumber(): RoundNumber {
        const getLastRoundNumber = (roundNumber: RoundNumber): RoundNumber => {
            const nextRoundNumber = roundNumber.getNext();
            if (!nextRoundNumber) {
                return roundNumber;
            }
            return getLastRoundNumber(nextRoundNumber);
        };
        return getLastRoundNumber(this.getFirstRoundNumber());
    }



    getRoundNumbers(): RoundNumber[] {
        const roundNumbers: RoundNumber[] = [];
        const addRoundNumber = (roundNumber: RoundNumber) => {
            roundNumbers.push(roundNumber);
            const nextRoundNumber = roundNumber.getNext();
            if (nextRoundNumber) {
                addRoundNumber(nextRoundNumber);
            }
        };
        addRoundNumber(this.getFirstRoundNumber());
        return roundNumbers;
    }

    getRoundNumber(initRoundNumberAsValue: number): RoundNumber | undefined {
        const getRoundNumber = (roundNumberAsValue: number, roundNumber?: RoundNumber): RoundNumber | undefined => {
            if (roundNumber === undefined) {
                return undefined;
            }
            if (roundNumberAsValue === roundNumber.getNumber()) {
                return roundNumber;
            }
            return getRoundNumber(roundNumberAsValue, roundNumber.getNext());
        };
        return getRoundNumber(initRoundNumberAsValue, this.getFirstRoundNumber());
    }

    allPoulesHaveGames(): boolean {
        return this.hasRoundNumberGames(this.getFirstRoundNumber());
    }

    protected hasRoundNumberGames(roundNumber: RoundNumber): boolean {
        if (!roundNumber.allPoulesHaveGames()) {
            return false;
        }
        const nextRoundNumber = roundNumber.getNext();
        return nextRoundNumber === undefined || this.hasRoundNumberGames(nextRoundNumber);
    }

    /* '1W1W2L2L1'
     getStructurePathNode(structurePath: string): StructurePathNode {
 
         const getStructurePathNode = (round: Round, structurePath: string, pathNode: StructurePathNode): StructurePathNode => {
 
             if ( )
                 return pathNode.getNext();
         });
         return getStructurePathNode(this.rootRound, structurePath)
     }
 
 
     convertStringToStructurePathNode(pathNodeAsString: string): StructurePathNode {
 
 
         const getStructurePathNode = (round: Round, structurePath: string, pathNode: StructurePathNode): StructurePathNode => {
             const winnersIdx = structurePath.indexOf(QualifyTarget.Winners);
             const losersIdx = structurePath.indexOf(QualifyTarget.Losers);
             const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
             if (idx < 0) {
                 return pathNode;
             }
             if ( )
                 return pathNode.getNext();
         });
         return getStructurePathNode(this.rootRound, structurePath)
     }*/

    /*convertRootNode(rootNode: string) {
        const winnersIdx = pathNodeAsString.indexOf(QualifyTarget.Winners);
        const losersIdx = pathNodeAsString.indexOf(QualifyTarget.Losers);
        const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
        if (idx < 0) {
            if (pathNodeAsString.length === 0) {
                throw Error('invalid structure-path');
            }


            return new StructurePathNode(undefined, roundNumber)
        } else {
            pathNodeAsString.substr(idx);
        }
    }

    convertStringToStructurePathNode(pathNodeAsString: string, previous?: StructurePathNode): StructurePathNode {

        const winnersIdx = pathNodeAsString.indexOf(QualifyTarget.Winners);
        const losersIdx = pathNodeAsString.indexOf(QualifyTarget.Losers);
        const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
        if (idx < 0) {
            if (pathNodeAsString.length === 0) {
                throw Error('invalid structure-path');
            }
            return new StructurePathNode(undefined, +pathNodeAsString)
        }

        const qualifyTarget = losersIdx

        const getStructurePathNode = (round: Round, structurePath: string, pathNode: StructurePathNode): StructurePathNode => {
            const winnersIdx = structurePath.indexOf(QualifyTarget.Winners);
            const losersIdx = structurePath.indexOf(QualifyTarget.Losers);
            const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
            if (idx < 0) {
                return pathNode;
            }
            if ( )
                return pathNode.getNext();
        });
        return getStructurePathNode(this.rootRound, structurePath)
    }



    getRoundPathNode(structurePath: string, pathNode): StructurePathNode {
        const winnersIdx = structurePath.indexOf(QualifyTarget.Winners);
        const losersIdx = structurePath.indexOf(QualifyTarget.Losers);
        const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
        if (idx < 0) {
            return '';
        }
        this.rootRound
        // find wlornumber
        'XWL2'
    }

    getRound(StructurePathNode: string): {
        this.getFirstRound()
find w or l
'XWL2'
    }
*/
}
