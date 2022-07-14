import { Category } from "../category";
import { GameState } from "../game/state";
import { Poule } from "../poule";
import { Round } from "../qualify/group";
import { RoundNumber } from "../round/number";

export class StructureCell {
    private rounds: Round[] = [];
    // protected next: StructureCell | undefined;

    constructor(
        private category: Category,
        private roundNumber: RoundNumber) {
        category.getStructureCells().push(this);
        roundNumber.setStructureCell(this);
    }

    getCategory(): Category {
        return this.category;
    }

    getRoundNumber(): RoundNumber {
        return this.roundNumber;
    }

    getRounds(): Round[] {
        return this.rounds;
    }

    getPoules(): Poule[] {
        let poules: Poule[] = [];
        this.getRounds().forEach((round: Round) => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    // hasNext(): boolean {
    //     return this.next !== undefined;
    // }

    getNext(): StructureCell | undefined {
        const nextRoundNumber = this.roundNumber.getNext();
        if (nextRoundNumber === undefined) {
            return undefined;
        }
        try {
            return nextRoundNumber.getStructureCell(this.getCategory());
        } catch (e) {
        }
        return undefined;

    }

    createNext(): StructureCell {
        let nextRoundNumber = this.roundNumber.getNext();
        if (nextRoundNumber === undefined) {
            nextRoundNumber = this.roundNumber.createNext();
        }
        return new StructureCell(this.category, nextRoundNumber);
    }

    // detachFromNext() {
    //     this.next = undefined;
    // }

    // getFirst(): StructureCell {
    //     const previous = this.getPrevious();
    //     return previous ? previous.getFirst() : this;
    // }

    // isFirst(): boolean {
    //     return (this.getPrevious() === undefined);
    // }

    // hasPrevious(): boolean {
    //     return this.previous !== undefined;
    // }

    // getPrevious(): StructureCell | undefined {
    //     return this.previous;
    // }

    getLast(): StructureCell {
        const next = this.getNext();
        return next ? next.getNext() : this;
    }

    // removeNext() {
    //     this.next = undefined;
    // }

    // detachFromPrevious(): void {
    //     if (this.previous === undefined) {
    //         return;
    //     }
    //     this.previous.removeNext();
    //     this.previous = undefined;
    // }

    detach() {

        const nextRoundNumber = this.getRoundNumber().getNext();
        if (nextRoundNumber !== undefined) {
            try {
                const next = this.getCategory().getStructureCell(nextRoundNumber);
                next.detach();
            }
            catch (e) {
            }
        }

        this.getRoundNumber().clearStructureCell(this.getCategory());
        if (this.getRoundNumber().getStructureCells().length === 0) {
            this.getRoundNumber().detach();
        }
    }


    getGamesState(): GameState {
        if (this.getRounds().every(round => round.getGamesState() === GameState.Finished)) {
            return GameState.Finished;
        } else if (this.getRounds().some(round => round.getGamesState() !== GameState.Created)) {
            return GameState.InProgress;
        }
        return GameState.Created;
    }

    hasBegun(): boolean {
        return this.getGamesState() > GameState.Created;
    }

    needsRanking(): boolean {
        return this.getRounds().some(round => round.needsRanking());
    }
}


// export class StructureCellMap extends Map<number, Category> { };