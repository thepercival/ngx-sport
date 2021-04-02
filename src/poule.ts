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
    protected againstGames: AgainstGame[] = [];
    protected togetherGames: TogetherGame[] = [];

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

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string | undefined): void {
        this.name = name;
    }

    getPlaces(): Place[] {
        return this.places;
    }

    getPlace(number: number): Place {
        const place = this.getPlaces().find(place => place.getNumber() === number);
        if (place === undefined) {
            throw Error('de pouleplek kan niet gevonden worden');
        }
        return place;
    }

    getGames(): (AgainstGame | TogetherGame)[] {
        return (<(AgainstGame | TogetherGame)[]>this.againstGames).concat(this.togetherGames);
    }

    getAgainstGames(place?: Place): AgainstGame[] {
        if (place === undefined) {
            return this.againstGames;
        }
        return this.againstGames.filter((gameIt: AgainstGame) => {
            return gameIt.isParticipating(place);
        });
    }

    getTogetherGames(): TogetherGame[] {
        return this.togetherGames;
    }

    getStructureLocation(): string {
        return this.getRound().getStructurePathNode().pathToString() + this.getNumber();
    }

    // getTogetherGamePlaces(place?: Place): TogetherGamePlace[] {
    //     let gamePlaces: TogetherGamePlace[] = []
    //     this.togetherGames.forEach((game: TogetherGame) => {
    //         const gamePlacesTmp = game.getTogetherPlaces();
    //         if (place === undefined) {
    //             gamePlaces = gamePlaces.concat(game.getTogetherPlaces());
    //         } else {
    //             gamePlaces = gamePlaces.concat(
    //                 game.getTogetherPlaces().filter((gamePlace: TogetherGamePlace) => gamePlace.getPlace() === place)
    //             );
    //         }
    //     });
    //     return gamePlaces;
    // }

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
