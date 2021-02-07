import { RoundNumber } from '../round/number';
import { HorizontalPoule } from '../poule/horizontal';
import { Competition } from '../competition';
import { Game } from '../game';
import { Place } from '../place';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { State } from '../state';
import { CompetitionSport } from '../competition/sport';
import { ScoreConfig } from '../score/config';
import { QualifyAgainstConfig } from './againstConfig';
import { Identifiable } from '../identifiable';
import { AgainstGame } from '../game/against';
import { TogetherGame } from '../game/together';

export class QualifyGroup {
    static readonly WINNERS = 1;
    static readonly DROPOUTS = 2;
    static readonly LOSERS = 3;

    protected id: number = 0;
    protected winnersOrLosers: number = QualifyGroup.DROPOUTS;
    protected number: number
    protected childRound: Round;
    protected horizontalPoules: HorizontalPoule[] = [];

    constructor(protected round: Round, winnersOrLosers: number, nextRoundNumber: RoundNumber, number?: number) {
        this.number = number ? number : this.round.getQualifyGroups(winnersOrLosers).length;
        this.setWinnersOrLosers(winnersOrLosers);
        this.round.getQualifyGroups(this.getWinnersOrLosers()).splice(this.number, 0, this);
        this.childRound = new Round(nextRoundNumber, this);
    }

    protected addToRoundQualifyGroups() {
        this.round.getQualifyGroups(this.getWinnersOrLosers()).push(this);
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

    getWinnersOrLosers(): number {
        return this.winnersOrLosers;
    }

    setWinnersOrLosers(winnersOrLosers: number): void {
        this.winnersOrLosers = winnersOrLosers;
    }

    getNumber(): number {
        return this.number;
    }

    setNumber(number: number): void {
        this.number = number;
    }

    getChildRound(): Round {
        return this.childRound;
    }

    getHorizontalPoules(): HorizontalPoule[] {
        return this.horizontalPoules;
    }

    isBorderGroup(): boolean {
        const qualifyGroups = this.getRound().getQualifyGroups(this.getWinnersOrLosers());
        return this === qualifyGroups[qualifyGroups.length - 1];
    }

    // isInBorderHoritontalPoule(place: Place): boolean {
    //     const horizontalPoules = this.getHorizontalPoules();
    //     const borderHorizontalPoule = horizontalPoules[horizontalPoules.length - 1];
    //     return borderHorizontalPoule.hasPlace(place);
    // }

    getBorderPoule(): HorizontalPoule {
        return this.horizontalPoules[this.horizontalPoules.length - 1];
    }

    getNrOfPlaces() {
        return this.getHorizontalPoules().length * this.getRound().getPoules().length;
    }

    getNrOfToPlacesTooMuch(): number {
        return this.getNrOfPlaces() - (this.childRound ? this.childRound.getNrOfPlaces() : 0);
    }

    getNrOfQualifiers(): number {
        let nrOfQualifiers = 0;
        this.getHorizontalPoules().forEach(horizontalPoule => nrOfQualifiers += horizontalPoule.getNrOfQualifiers());
        return nrOfQualifiers;
    }
}

export class Round extends Identifiable {
    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    // there are some patterns here, cross, inside-outside and custom
    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected number: RoundNumber;
    protected name: string | undefined;
    protected poules: Poule[] = [];
    protected losersQualifyGroups: QualifyGroup[] = [];
    protected winnersQualifyGroups: QualifyGroup[] = [];
    protected losersHorizontalPoules: HorizontalPoule[] = [];
    protected winnersHorizontalPoules: HorizontalPoule[] = [];
    // protected nrOfDropoutPlaces: number;
    protected structureNumber: number = 0;
    protected scoreConfigs: ScoreConfig[] = [];
    protected qualifyAgainstConfigs: QualifyAgainstConfig[] = [];

    constructor(roundNumber: RoundNumber, protected parentQualifyGroup: QualifyGroup | undefined) {
        super();
        this.number = roundNumber;
        this.number.getRounds().push(this);
        // this.setValue();
    }

    getCompetition(): Competition {
        return this.getNumber().getCompetition();
    }

    getParent(): Round | undefined {
        return this.getParentQualifyGroup()?.getRound();
    }

    getParentQualifyGroup(): QualifyGroup | undefined {
        return this.parentQualifyGroup;
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

    getQualifyGroup(winnersOrLosers: number, qualifyGroupNumber: number): QualifyGroup | undefined {
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

    getChild(winnersOrLosers: number, qualifyGroupNumber: number): Round | undefined {
        return this.getQualifyGroup(winnersOrLosers, qualifyGroupNumber)?.getChildRound();
    }

    isRoot(): boolean {
        return this.getParent() === undefined;
    }

    getName(): string | undefined {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getPoules(): Poule[] {
        return this.poules;
    }

    getPoule(number: number): Poule | undefined {
        return this.getPoules().find(poule => poule.getNumber() === number);
    }

    getHorizontalPoules(winnersOrLosers: number): HorizontalPoule[] {
        if (winnersOrLosers === QualifyGroup.WINNERS) {
            return this.winnersHorizontalPoules;
        }
        return this.losersHorizontalPoules;
    }

    getHorizontalPoule(winnersOrLosers: number, number: number): HorizontalPoule | undefined {
        return this.getHorizontalPoules(winnersOrLosers).find(horPoule => horPoule.getNumber() === number);
    }

    getFirstPlace(winnersOrLosers: number): Place | undefined {
        return this.getHorizontalPoule(winnersOrLosers, 1)?.getFirstPlace();
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

    getPlace(placeLocation: PlaceLocation): Place | undefined {
        return this.getPoule(placeLocation.getPouleNr())?.getPlace(placeLocation.getPlaceNr());
    }

    getGames(): (AgainstGame | TogetherGame)[] {
        const games: (AgainstGame | TogetherGame)[] = [];
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

    getState(): number {
        if (this.getPoules().every(poule => poule.getState() === State.Finished)) {
            return State.Finished;
        } else if (this.getPoules().some(poule => poule.getState() !== State.Created)) {
            return State.InProgress;
        }
        return State.Created;
    }

    hasBegun(): boolean {
        return this.getState() > State.Created;
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

    getScoreConfigs(): ScoreConfig[] {
        return this.scoreConfigs;
    }

    getScoreConfig(competitionSport: CompetitionSport): ScoreConfig | undefined {
        return this.scoreConfigs.find(scoreConfigIt => scoreConfigIt.getCompetitionSport() === competitionSport);
    }

    getValidScoreConfigs(): ScoreConfig[] {
        return this.getNumber().getCompetitionSports().map(competitionSport => this.getValidScoreConfig(competitionSport));
    }

    getValidScoreConfig(competitionSport: CompetitionSport): ScoreConfig {
        const scoreConfig = this.getScoreConfig(competitionSport);
        if (scoreConfig !== undefined) {
            return scoreConfig;
        }
        const parent = this.getParent();
        if (!parent) {
            throw Error('de ronde heeft geen geldige score-regels');
        }
        const parentScoreConfig = parent.getScoreConfig(competitionSport);
        if (!parentScoreConfig) {
            throw Error('de ronde heeft geen geldige score-regels');
        }
        return parentScoreConfig;
    }

    getQualifyAgainstConfigs(): QualifyAgainstConfig[] {
        return this.qualifyAgainstConfigs;
    }

    getQualifyAgainstConfig(competitionSport: CompetitionSport): QualifyAgainstConfig | undefined {
        return this.qualifyAgainstConfigs.find(qualifyAgainstConfigIt => qualifyAgainstConfigIt.getCompetitionSport() === competitionSport);
    }

    setQualifyAgainstConfig(qualifyagainstConfig: QualifyAgainstConfig) {
        this.qualifyAgainstConfigs.push(qualifyagainstConfig);
    }

    getValidQualifyAgainstConfigs(): (QualifyAgainstConfig)[] {
        return this.getNumber().getCompetitionSports().map(competitionSport => this.getValidQualifyAgainstConfig(competitionSport));
    }

    getValidQualifyAgainstConfig(competitionSport: CompetitionSport): QualifyAgainstConfig {
        const qualifyAgainstConfig = this.getQualifyAgainstConfig(competitionSport);
        if (qualifyAgainstConfig !== undefined) {
            return qualifyAgainstConfig;
        }
        const parent = this.getParent();
        if (!parent) {
            throw Error('de ronde heeft geen geldige punten-instellingen');
        }
        const parentQualifyAgainstConfig = parent.getQualifyAgainstConfig(competitionSport);
        if (!parentQualifyAgainstConfig) {
            throw Error('de ronde heeft geen geldige punten-instellingen');
        }
        return parentQualifyAgainstConfig;
    }

    hasAncestor(ancestor: Round): boolean {
        const parent = this.getParent();
        if (!parent) {
            return false;
        }
        if (parent === ancestor) {
            return true;
        }
        return parent.hasAncestor(ancestor);
    }

}

