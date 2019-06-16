import { Competition } from './competition';
import { Competitor } from './competitor';
import { Game } from './game';
import { Place } from './place';
import { Round } from './round';
import { State } from './state';

export class Poule {
    protected id: number;
    protected round: Round;
    protected number: number;
    protected structureNumber: number;
    protected name: string;
    protected places: Place[] = [];
    protected games: Game[] = [];

    constructor(round: Round, number?: number) {
        if (number === undefined) {
            number = round.getPoules().length + 1;
        }
        this.setRound(round);
        this.setNumber(number);
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

    protected setRound(round: Round): void {
        // if( this.round != undefined ){ // remove from old round
        //     var index = this.round.getPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getPoules().splice(index, 1);
        //     }
        // }
        this.round = round;
        this.round.getPoules().push(this);
    }

    getCompetition(): Competition {
        return this.getRound().getCompetition();
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getStructureNumber(): number {
        return this.structureNumber;
    }

    setStructureNumber(structureNumber: number): void {
        this.structureNumber = structureNumber;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPlaces(): Place[] {
        return this.places;
    }

    getPlace(number: number): Place {
        return this.getPlaces().find(place => place.getNumber() === number);
    }

    getCompetitors(): Competitor[] {
        const competitors: Competitor[] = [];
        this.getPlaces().forEach( place => {
            const competitor = place.getCompetitor();
            if (competitor !== undefined) {
                competitors.push(competitor);
            }
        });
        return competitors;
    }

    getGames(): Game[] {
        return this.games;
    }

    getGamesWithState(state: number): Game[] {
        return this.getGames().filter((gameIt) => gameIt.getState() === state);
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

    getNrOfGamesPerRound() {
        const nrOfPlaces = this.getPlaces().length;
        if ((nrOfPlaces % 2) !== 0) {
            return ((nrOfPlaces - 1) / 2);
        }
        return (nrOfPlaces / 2);
    }

    addPlace(place: Place) {
        if (place.getNumber() <= this.getPlaces().length) {
            throw new Error('pouleplek kan niet toegevoegd worden, omdat het nummer van de plek kleiner is dan het aantal huidige plekken');
        }
        place.setPoule(this);
        this.getPlaces().push(place);
    }
}
