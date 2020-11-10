import { Competition } from './competition';
import { Game } from './game';
import { Place } from './place';
import { Round } from './qualify/group';
import { State } from './state';

export class Poule {
    protected id: number = 0;
    protected number: number;
    protected structureNumber: number = 0;
    protected name: string | undefined;
    protected places: Place[] = [];
    protected games: Game[] = [];

    constructor(protected round: Round, number?: number) {
        this.round.getPoules().push(this);
        this.number = number ? number : (round.getPoules().length + 1);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getRound(): Round {
        return this.round;
    }

    getCompetition(): Competition {
        return this.getRound().getCompetition();
    }

    getNumber(): number {
        return this.number;
    }

    getStructureNumber(): number {
        return this.structureNumber;
    }

    setStructureNumber(structureNumber: number): void {
        this.structureNumber = structureNumber;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }

    getPlaces(): Place[] {
        return this.places;
    }

    getPlace(number: number): Place | undefined {
        return this.getPlaces().find(place => place.getNumber() === number);
    }

    getGames(): Game[] {
        return this.games;
    }

    getState(): number {
        if (this.getGames().length > 0 && this.getGames().every(game => game.getState() === State.Finished)) {
            return State.Finished;
        } else if (this.getGames().some(game => game.getState() !== State.Created)) {
            return State.InProgress;
        }
        return State.Created;
    }

    needsRanking(): boolean {
        return (this.getPlaces().length > 2);
    }

    next(): Poule {
        const poules = this.getRound().getPoules();
        return poules[this.getNumber()];
    }
}
