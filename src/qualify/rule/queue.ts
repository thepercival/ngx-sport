import { QualifyRule } from '../../qualify/rule';
import { Round } from '../../round';

export class QualifyRuleQueue {
    static readonly START = 1;
    static readonly END = 2;

    private qualifyRules: QualifyRule[] = [];

    constructor() {
    }

    add(startEnd: number, qualifyRule: QualifyRule, ) {
        if (startEnd === QualifyRuleQueue.START) {
            this.qualifyRules.push(qualifyRule);
        } else {
            this.qualifyRules.unshift(qualifyRule);
        }
    }    

    remove( startEnd: number ) {
        return startEnd === QualifyRuleQueue.START ? this.qualifyRules.shift() : this.qualifyRules.pop();
    }

    isEmpty(): boolean {
        return this.qualifyRules.length === 0;
    }

    toggle( startEnd: number ): number {
        return startEnd === QualifyRuleQueue.START ? QualifyRuleQueue.END : QualifyRuleQueue.START;
    }

    /**
     * bij 5 poules, haal 2 na laatste naar achterste plek
     * 
     * @param round 
     */
    shuffleIfUnevenAndNoMultiple( nrOfPoules: number ) {
        if( (nrOfPoules % 2) === 0 || nrOfPoules < 3) {
            return;
        }
        const lastItem = this.qualifyRules[this.qualifyRules.length-1];
        if( lastItem && lastItem.isMultiple() ) {
            return;
        }
        const index = ( this.qualifyRules.length - 1) - ( ( ( nrOfPoules + 1 ) / 2 ) - 1 );        
        const x = this.qualifyRules.splice( index, 1);
        this.qualifyRules.push(x.pop());        
    }
}