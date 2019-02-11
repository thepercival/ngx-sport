import { Competition } from '../competition';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { Round } from '../round';
import { RoundNumberConfig } from '../round/number/config';


export class RoundNumber {
    protected competition: Competition;
    protected number: number;
    protected previous: RoundNumber;
    protected next: RoundNumber;
    protected rounds: Round[] = [];
    protected config: RoundNumberConfig;
    protected id: number;

    constructor(competition: Competition, previous?: RoundNumber) {
        this.competition = competition;
        this.previous = previous;
        this.number = previous === undefined ? 1 : previous.getNumber() + 1;
        this.competition = competition;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    hasNext(): boolean {
        return this.next !== undefined;
    }

    getNext(): RoundNumber {
        return this.next;
    }

    removeNext() {
        this.next = undefined;
    }

    hasPrevious(): boolean {
        return this.previous !== undefined;
    }

    getPrevious(): RoundNumber {
        return this.previous;
    }

    createNext(): RoundNumber {
        this.next = new RoundNumber(this.getCompetition(), this);
        return this.getNext();
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getNumber(): number {
        return this.number;
    }

    getFirst() {
        if (this.getPrevious() !== undefined) {
            return this.getPrevious().getFirst();
        }
        return this;
    }

    isFirst() {
        return (this.getPrevious() === undefined);
    }

    getRounds() {
        return this.rounds;
    }

    getPoules(): Poule[] {
        let poules: Poule[] = [];
        this.getRounds().forEach(round => {
            poules = poules.concat(round.getPoules());
        });
        return poules;
    }

    getPlaces(): PoulePlace[] {
        let places = [];
        this.getPoules().forEach(poule => {
            places = places.concat(poule.getPlaces());
        });
        return places;
    }

    getARound(): Round {
        return this.getRounds()[0];
    }

    getConfig(): RoundNumberConfig {
        return this.config;
    }

    setConfig(config: RoundNumberConfig) {
        this.config = config;
    }

    needsRanking(): boolean {
        return this.getRounds().some(round => round.needsRanking());
    }

    getState(): number {
        if (this.getRounds().every(round => round.getState() === Game.STATE_PLAYED)) {
            return Game.STATE_PLAYED;
        } else if (this.getRounds().some(round => round.getState() !== Game.STATE_CREATED)) {
            return Game.STATE_INPLAY;
        }
        return Game.STATE_CREATED;
    }

    isStarted(): boolean {
        return this.getState() > Game.STATE_CREATED;
    }
}
