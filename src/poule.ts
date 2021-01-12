import { Competition } from './competition';
import { Game } from './game';
import { AgainstGame } from './game/against';
import { TogetherGame } from './game/together';
import { Identifiable } from './identifiable';
import { Place } from './place';
import { Round } from './qualify/group';
import { State } from './state';

export class Poule extends Identifiable {
    protected number: number;
    protected structureNumber: number = 0;
    protected name: string | undefined;
    protected places: Place[] = [];
    protected games: (AgainstGame | TogetherGame)[] = [];

    constructor(protected round: Round, number?: number) {
        super();
        this.round.getPoules().push(this);
        this.number = number ? number : (round.getPoules().length);
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

    getGames(): (AgainstGame | TogetherGame)[] {
        return this.games;
    }

    getAgainstGames(): AgainstGame[] {
        return <AgainstGame[]>this.games;
    }

    getTogetherGames(): TogetherGame[] {
        return <TogetherGame[]>this.games;
    }

    getState(): number {
        if (this.getGames().length > 0 && this.getGames().every((game: AgainstGame | TogetherGame) => game.getState() === State.Finished)) {
            return State.Finished;
        } else if (this.getGames().some((game: Game) => game.getState() !== State.Created)) {
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
