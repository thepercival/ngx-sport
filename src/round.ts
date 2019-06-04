import { Competition } from './competition';
import { Competitor } from './competitor';
import { Game } from './game';
import { PlaceLocation } from './place/location';
import { Poule } from './poule';
import { HorizontalPoule } from './poule/horizontal';
import { Place } from './place';
import { QualifyGroup } from './qualify/group';
import { RoundNumber } from './round/number';

export class Round {
    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    // there are some patterns here, cross, inside-outside and custom
    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected id: number;
    protected number: RoundNumber;
    protected parentQualifyGroup: QualifyGroup;
    protected name: string;
    protected poules: Poule[] = [];
    protected losersQualifyGroups: QualifyGroup[] = [];
    protected winnersQualifyGroups: QualifyGroup[] = [];
    protected losersHorizontalPoules: HorizontalPoule[] = [];
    protected winnersHorizontalPoules: HorizontalPoule[] = [];
    // protected nrOfDropoutPlaces: number;
    protected structureNumber: number;

    constructor(roundNumber: RoundNumber, parentQualifyGroup?: QualifyGroup) {
        this.number = roundNumber;
        this.setParentQualifyGroup(parentQualifyGroup);
        this.number.getRounds().push(this);
        //this.setValue();
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCompetition(): Competition {
        return this.getNumber().getCompetition();
    }

    getParent(): Round {
        return this.getParentQualifyGroup() ? this.getParentQualifyGroup().getRound() : undefined;
    }

    getParentQualifyGroup(): QualifyGroup {
        return this.parentQualifyGroup;
    }

    protected setParentQualifyGroup(parentQualifyGroup: QualifyGroup) {
        if (parentQualifyGroup !== undefined) {
            parentQualifyGroup.setChildRound(this);
        }
        this.parentQualifyGroup = parentQualifyGroup;
    }

    getNumber(): RoundNumber {
        return this.number;
    }

    getNumberAsValue(): number {
        return this.number.getNumber();
    }

    getStructureNumber(): number {
        return this.structureNumber;
    }

    setStructureNumber(structureNumber: number): void {
        this.structureNumber = structureNumber;
    }

    getQualifyGroups(winnersOrLosers?: number): QualifyGroup[] {
        if (winnersOrLosers === undefined) {
            return this.winnersQualifyGroups.concat(this.losersQualifyGroups);
        }
        return (winnersOrLosers === QualifyGroup.WINNERS) ? this.winnersQualifyGroups : this.losersQualifyGroups;
    }

    getQualifyGroupsLosersReversed() {
        return this.winnersQualifyGroups.concat(this.losersQualifyGroups.slice().reverse());
    }

    getQualifyGroup(winnersOrLosers: number, qualifyGroupNumber: number): QualifyGroup {
        return this.getQualifyGroups(winnersOrLosers).find(qualifyGroup => qualifyGroup.getNumber() === qualifyGroupNumber);
    }

    getBorderQualifyGroup(winnersOrLosers: number): QualifyGroup {
        const qualifyGroups = this.getQualifyGroups(winnersOrLosers);
        return qualifyGroups[qualifyGroups.length - 1];
    }

    getNrOfDropoutPlaces(): number {
        // if (this.nrOfDropoutPlaces === undefined) {
        // @TODO performance check
        return this.getNrOfPlaces() - this.getNrOfPlacesChildren();
        // }
        // return this.nrOfDropoutPlaces;
    }

    // setNrOfDropoutPlaces(nrOfDropoutPlaces: number): void {
    //     this.nrOfDropoutPlaces = nrOfDropoutPlaces;
    // }

    getChildren(): Round[] {
        return this.getQualifyGroups().map(qualifyGroup => qualifyGroup.getChildRound());
    }

    getChild(winnersOrLosers: number, qualifyGroupNumber: number): Round {
        const qualifyGroup = this.getQualifyGroup(winnersOrLosers, qualifyGroupNumber);
        return qualifyGroup ? qualifyGroup.getChildRound() : undefined;
    }

    isRoot(): boolean {
        return this.getParent() === undefined;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPoules(): Poule[] {
        return this.poules;
    }

    getPoule(number: number): Poule {
        return this.getPoules().find(poule => poule.getNumber() === number);
    }

    /**
     * winnerslosers = QualifyGroup.WINNERS
     *  [ A1 B1 C1 ]
     *  [ A2 B2 C2 ]
     *  [ A3 B3 C3 ]
     * winnerslosers = QualifyGroup.LOSERS
     *  [ C3 B3 A3 ]
     *  [ C2 B2 A2 ]
     *  [ C1 B1 A1 ]
     *
     * @param winnersOrLosers
     *
     **/
    getHorizontalPoules(winnersOrLosers: number): HorizontalPoule[] {
        if (winnersOrLosers === QualifyGroup.WINNERS) {
            return this.winnersHorizontalPoules;
        }
        return this.losersHorizontalPoules;
    }

    protected getFirstHorizontalPoule(winnersOrLosers: number): HorizontalPoule {
        return this.getHorizontalPoules(winnersOrLosers)[0];
    }

    getFirstPlace(winnersOrLosers: number): Place {
        return this.getFirstHorizontalPoule(winnersOrLosers).getFirstPlace();
    }

    getPlaces(order?: number): Place[] {
        let places: Place[] = [];
        if (order === Round.ORDER_NUMBER_POULE) {
            this.getHorizontalPoules(QualifyGroup.WINNERS).forEach((poule) => {
                places = places.concat(poule.getPlaces());
            });
        } else {
            this.getPoules().forEach((poule) => {
                places = places.concat(poule.getPlaces());
            });
        }
        return places;
    }

    getPlace(placeLocation: PlaceLocation): Place {
        return this.getPoule(placeLocation.getPouleNr()).getPlace(placeLocation.getPlaceNr());
    }

    getCompetitors(): Competitor[] {
        let competitors: Competitor[] = [];
        for (const poule of this.getPoules()) {
            competitors = competitors.concat(poule.getCompetitors());
        }
        return competitors;
    }

    getNrOfCompetitors(): number {
        let nrOfCompetitors = 0;
        this.getPoules().forEach(poule => nrOfCompetitors += poule.getCompetitors().length);
        return nrOfCompetitors;
    }

    getGames(): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGames().forEach(game => games.push(game));
        });
        return games;
    }

    getNrOfGames(): number {
        let nrOfGames = 0;
        this.getPoules().forEach(poule => {
            nrOfGames += poule.getGames().length;
        });
        return nrOfGames;
    }

    getGamesWithState(state: number): Game[] {
        const games = [];
        this.getPoules().forEach(poule => {
            poule.getGamesWithState(state).forEach(game => games.push(game));
        });
        return games;
    }

    getState(): number {
        if (this.getPoules().every(poule => poule.getState() === Game.STATE_PLAYED)) {
            return Game.STATE_PLAYED;
        } else if (this.getPoules().some(poule => poule.getState() !== Game.STATE_CREATED)) {
            return Game.STATE_INPLAY;
        }
        return Game.STATE_CREATED;
    }

    isStarted(): boolean {
        return this.getState() > Game.STATE_CREATED;
    }

    needsRanking(): boolean {
        return this.getPoules().some(function (pouleIt) {
            return pouleIt.needsRanking();
        });
    }

    getNrOfPlaces(): number {
        let nrOfPlaces = 0;
        this.getPoules().forEach(poule => nrOfPlaces += poule.getPlaces().length);
        return nrOfPlaces;
    }

    getNrOfPlacesChildren(winnersOrLosers?: number): number {
        let nrOfPlacesChildRounds = 0;
        this.getQualifyGroups(winnersOrLosers).forEach(qualifyGroup => {
            nrOfPlacesChildRounds += qualifyGroup.getChildRound().getNrOfPlaces();
        });
        return nrOfPlacesChildRounds;
    }
}
