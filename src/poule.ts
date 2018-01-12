/**
 * Created by coen on 27-2-17.
 */
import { Competitionseason } from './competitionseason';
import { Game } from './game';
import { PoulePlace } from './pouleplace';
import { Round } from './round';
import { Team } from './team';


export class Poule {
    protected id: number;
    protected round: Round;
    protected number: number;
    protected name: string;
    protected places: PoulePlace[] = [];
    protected games: Game[] = [];

    // constructor
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

    setRound(round: Round): void {
        // if( this.round != undefined ){ // remove from old round
        //     var index = this.round.getPoules().indexOf(this);
        //     if (index > -1) {
        //         this.round.getPoules().splice(index, 1);
        //     }
        // }
        this.round = round;
        this.round.getPoules().push(this);
    }

    getCompetitionseason(): Competitionseason {
        return this.getRound().getCompetitionseason();
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPlaces(): PoulePlace[] {
        return this.places;
    }

    getTeams(): Team[] {
        const teams: Team[] = [];
        for (const pouleplace of this.getPlaces()) {
            const team = pouleplace.getTeam();
            if (team !== undefined) {
                teams.push(team);
            }
        }
        return teams;
    }

    getGames(): Game[] {
        return this.games;
    }

    getGamesWithState(state: number): Game[] {
        return this.getGames().filter((gameIt) => gameIt.getState() === state);
    }

    getState(): number {
        if (this.getGames().every(game => game.getState() === Game.STATE_PLAYED)) {
            return Game.STATE_PLAYED;
        } else if (this.getGames().some(game => game.getState() !== Game.STATE_CREATED)) {
            return Game.STATE_INPLAY;
        }
        return Game.STATE_CREATED;
    }

    needsRanking(): boolean {
        return (this.getPlaces().length > 2);
    }

    next(): Poule {
        const poules = this.getRound().getPoules();
        return poules[this.getNumber()];
    }

    addPlace(place: PoulePlace) {
        if (place.getNumber() <= this.getPlaces().length) {
            throw new Error('pouleplek kan niet toegevoegd worden, omdat het nummer van de plek kleiner is dan het aantal huidige plekken');
        }
        place.setPoule(this);
        this.getPlaces().push(place);
    }

    removePlace(place: PoulePlace): boolean {
        const index = this.places.indexOf(place);
        if (index === -1) {
            return false;
        }
        this.places.splice(index, 1);
        place.setPoule(undefined);
        this.places.forEach(function (placeIt) {
            if (placeIt.getNumber() > place.getNumber()) {
                placeIt.setNumber(placeIt.getNumber() - 1);
            }
        });
        place.setNumber(undefined);
        return true;
    }

    movePlace(place: PoulePlace, toNumber: number) {
        if (toNumber > this.places.length) {
            toNumber = this.places.length;
        }
        if (toNumber < 1) {
            toNumber = 1;
        }

        // find index of place with same number
        const foundPlace = this.places.find(function (pouleplaceIt) {
            return toNumber === pouleplaceIt.getNumber();
        });

        // remove item
        {
            const index = this.places.indexOf(place);
            if (index === -1) {
                return;
            }
            this.places.splice(index, 1);
        }

        // insert item
        {
            const index = this.places.indexOf(foundPlace);
            // insert item
            this.places.splice(index, 0, place);
        }

        // update numbers from foundPlace
        let number = 1;
        this.places.forEach(function (poulePlaceIt) {
            poulePlaceIt.setNumber(number++);
        });

        return true;
    }
}
