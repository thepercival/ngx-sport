import { RoundNumber } from '../round/number';
import { HorizontalPoule } from '../poule/horizontal';
import { Competition } from '../competition';
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
import { SingleQualifyRule } from './rule/single';
import { MultipleQualifyRule } from './rule/multiple';
import { QualifyTarget } from './target';
import { StructurePathNode } from '../structure/path';
import { BalancedPouleStructure } from '../poule/structure/balanced';
export class QualifyGroup extends Identifiable {
    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected number: number
    protected childRound: Round;
    protected firstSingleRule: SingleQualifyRule | undefined;
    protected multipleRule: MultipleQualifyRule | undefined;

    constructor(protected parentRound: Round, protected target: QualifyTarget, nextRoundNumber: RoundNumber, number?: number) {
        super();
        this.number = number ? number : this.parentRound.getQualifyGroups(this.getTarget()).length + 1;
        this.parentRound.getQualifyGroups(this.getTarget()).splice(this.number - 1, 0, this);
        this.childRound = new Round(nextRoundNumber, this);
    }

    getParentRound(): Round {
        return this.parentRound;
    }

    getTarget(): QualifyTarget {
        return this.target;
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

    getFirstSingleRule(): SingleQualifyRule | undefined {
        return this.firstSingleRule;
    }

    setFirstSingleRule(singleRule: SingleQualifyRule | undefined): void {
        this.firstSingleRule = singleRule;
    }

    getMultipleRule(): MultipleQualifyRule | undefined {
        return this.multipleRule;
    }

    setMultipleRule(multipleRule: MultipleQualifyRule | undefined): void {
        this.multipleRule = multipleRule;
    }

    getNrOfSingleRules(): number {
        return this.getFirstSingleRule()?.getLast().getNumber() ?? 0;
    }

    getNrOfToPlaces(): number {
        let nrOfToPlaces = 0;
        const firstSingleRule = this.getFirstSingleRule();
        if (firstSingleRule !== undefined) {
            nrOfToPlaces = firstSingleRule.getNrOfToPlaces() + firstSingleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
        }
        const multipleRule = this.getMultipleRule();
        if (multipleRule !== undefined) {
            nrOfToPlaces += multipleRule.getNrOfToPlaces();
        }
        return nrOfToPlaces;
    }

    getNext(): QualifyGroup | undefined {
        return this.getParentRound().getQualifyGroup(this.getTarget(), this.getNumber() + 1);
    }

    getRule(toPlace: Place): SingleQualifyRule | MultipleQualifyRule {
        let singleRule = this.firstSingleRule;
        while (singleRule !== undefined) {
            try {
                if (singleRule.getFromPlace(toPlace) !== undefined) {
                    return singleRule;
                }
            } catch (e) { }
            singleRule = singleRule.getNext();
        }
        const multipleRule = this.getMultipleRule();
        if (multipleRule === undefined || !multipleRule.hasToPlace(toPlace)) {
            throw Error('de kwalificatieregel kan niet gevonden worden');
        }
        return multipleRule;
    }

    getFromPlace(toPlace: Place): Place | undefined {
        let singleRule = this.getRule(toPlace);
        if (singleRule instanceof SingleQualifyRule) {
            return singleRule.getFromPlace(toPlace);
        }
        return undefined;
    }

    isBorderGroup(): boolean {
        return this.getNext() === undefined;
    }

    detach() {
        this.detachRules();
        const qualifyGroups = this.getParentRound().getQualifyGroups(this.getTarget());
        const idx = qualifyGroups.indexOf(this);
        qualifyGroups.splice(idx, 1);
        this.getChildRound().detach();
    }

    detachRules() {
        if (this.multipleRule !== undefined) {
            this.multipleRule.detach();
            this.multipleRule = undefined;
        }
        if (this.firstSingleRule !== undefined) {
            this.firstSingleRule.detach();
            this.firstSingleRule = undefined;
        }
    }
}

export class Round extends Identifiable {
    static readonly ORDER_NUMBER_POULE = 1;
    static readonly ORDER_POULE_NUMBER = 2;

    protected name: string | undefined;
    protected poules: Poule[] = [];
    protected losersQualifyGroups: QualifyGroup[] = [];
    protected winnersQualifyGroups: QualifyGroup[] = [];
    protected losersHorizontalPoules: HorizontalPoule[] = [];
    protected winnersHorizontalPoules: HorizontalPoule[] = [];
    protected structurePathNode: StructurePathNode;
    protected scoreConfigs: ScoreConfig[] = [];
    protected qualifyAgainstConfigs: QualifyAgainstConfig[] = [];

    constructor(protected number: RoundNumber, protected parentQualifyGroup: QualifyGroup | undefined) {
        super();
        this.number.getRounds().push(this);
        this.structurePathNode = this.constructStructurePathNode();
    }

    getCompetition(): Competition {
        return this.getNumber().getCompetition();
    }

    getParent(): Round | undefined {
        return this.getParentQualifyGroup()?.getParentRound();
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

    getNrOfDropoutPlaces(): number {
        return this.getNrOfPlaces() - this.getNrOfPlacesChildren();
    }

    getQualifyGroups(qualifyTarget?: QualifyTarget): QualifyGroup[] {
        if (qualifyTarget === undefined) {
            return this.winnersQualifyGroups.concat(this.losersQualifyGroups);
        }
        return (qualifyTarget === QualifyTarget.Winners) ? this.winnersQualifyGroups : this.losersQualifyGroups;
    }

    getQualifyGroupsLosersReversed() {
        return this.winnersQualifyGroups.concat(this.losersQualifyGroups.slice().reverse());
    }

    getQualifyGroup(qualifyTarget: QualifyTarget, qualifyGroupNumber: number): QualifyGroup | undefined {
        return this.getQualifyGroups(qualifyTarget).find(qualifyGroup => qualifyGroup.getNumber() === qualifyGroupNumber);
    }

    getBorderQualifyGroup(qualifyTarget: QualifyTarget): QualifyGroup {
        const qualifyGroups = this.getQualifyGroups(qualifyTarget);
        return qualifyGroups[qualifyGroups.length - 1];
    }

    getChildren(): Round[] {
        return this.getQualifyGroups().map(qualifyGroup => qualifyGroup.getChildRound());
    }

    getChild(qualifyTarget: QualifyTarget, qualifyGroupNumber: number): Round | undefined {
        return this.getQualifyGroup(qualifyTarget, qualifyGroupNumber)?.getChildRound();
    }

    getRoot(): Round {
        const parent = this.getParent();
        if (parent === undefined) {
            return this;
        }
        return parent.getRoot();
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

    getPoule(number: number): Poule {
        const poule = this.getPoules().find(poule => poule.getNumber() === number);
        if (poule === undefined) {
            throw Error('de poule kan niet gevonden worden');
        }
        return poule;
    }

    getHorizontalPoules(qualifyTarget: QualifyTarget): HorizontalPoule[] {
        if (qualifyTarget === QualifyTarget.Winners) {
            return this.winnersHorizontalPoules;
        }
        return this.losersHorizontalPoules;
    }

    getHorizontalPoule(qualifyTarget: QualifyTarget, number: number): HorizontalPoule {
        const horPoule = this.getHorizontalPoules(qualifyTarget).find(horPoule => horPoule.getNumber() === number);
        if (horPoule === undefined) {
            throw new Error('horizontalPoule can not be undefined');
        }
        return horPoule;
    }

    getFirstPlace(qualifyTarget: QualifyTarget): Place {
        const firstHorizontalPoule = this.getHorizontalPoule(qualifyTarget, 1);
        if (firstHorizontalPoule === undefined) {
            throw Error('de ronde heeft geen uhorizontale poules');
        }
        return firstHorizontalPoule.getFirstPlace();
    }

    getPlaces(order?: number): Place[] {
        let places: Place[] = [];
        if (order === Round.ORDER_NUMBER_POULE) {
            this.getHorizontalPoules(QualifyTarget.Winners).forEach((poule) => {
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
        const place = this.getPoule(placeLocation.getPouleNr()).getPlace(placeLocation.getPlaceNr());
        if (place === undefined) {
            throw Error('de poule kan niet gevonden worden');
        }
        return place;
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

    getNrOfPlacesChildren(qualifyTarget?: QualifyTarget): number {
        let nrOfPlacesChildRounds = 0;
        this.getQualifyGroups(qualifyTarget).forEach(qualifyGroup => {
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

    getValidQualifyAgainstConfigs(): QualifyAgainstConfig[] {
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

    addPlace() {
        const pouleStructure = this.createPouleStructure();
        const pouleNr = pouleStructure.getFirstLesserNrOfPlacesPouleNr();
        new Place(this.getPoule(pouleNr));
    }

    removePlace(): number {
        const pouleStructure = this.createPouleStructure();
        const pouleNr = pouleStructure.getLastGreaterNrOfPlacesPouleNr();
        const poule = this.getPoule(pouleNr);

        const poulePlaces = poule.getPlaces();
        const removedPoulePlaces = poulePlaces.splice(poulePlaces.length - 1, 1);

        if (poulePlaces.length === 1) {
            this.removePoule();
            return 2;
        }
        return removedPoulePlaces.length;
    }

    getFirstPoule(): Poule {
        return this.getPoules()[0];
    }

    getLastPoule(): Poule {
        const poules = this.getPoules();
        return poules[poules.length - 1];
    }


    addPoule(): Poule {
        const lastPoule = this.getLastPoule();
        const poule = new Poule(this);
        lastPoule.getPlaces().forEach((place: Place) => new Place(poule));
        return this.getLastPoule();
    }

    removePoule(): Poule {
        const lastPoule = this.getLastPoule();
        this.poules.splice(this.poules.length - 1, 1);
        if (this.poules.length === 0) {
            this.detach();
        }
        return lastPoule;
    }

    // getChild(getStructurePathNode(structurePath: string): StructurePathNode {
    //     this.getRound()

    //     const getStructurePathNode = (pathNode: StructurePathNode): StructurePathNode => {
    //         const winnersIdx = structurePath.indexOf(QualifyTarget.Winners);
    //         const losersIdx = structurePath.indexOf(QualifyTarget.Losers);
    //         const idx = winnersIdx > losersIdx ? winnersIdx : losersIdx;
    //         if (idx < 0) {
    //             return pathNode;
    //         }

    //         return pathNode.getNext();
    //     });
    //     return getStructurePathNode(this.rootRound)
    // }

    getStructurePathNode(): StructurePathNode {
        return this.structurePathNode;
    }

    protected constructStructurePathNode(): StructurePathNode {
        if (this.parentQualifyGroup === undefined) {
            return new StructurePathNode(undefined, 1);
        }
        return new StructurePathNode(
            this.parentQualifyGroup.getTarget(),
            this.parentQualifyGroup.getNumber(),
            this.parentQualifyGroup.getParentRound().getStructurePathNode());
    }

    createPouleStructure(): BalancedPouleStructure {
        const nrOfPlaces = this.getPoules().map((poule: Poule): number => poule.getPlaces().length);
        return new BalancedPouleStructure(...nrOfPlaces);
    }

    detach() {
        const rounds = this.getNumber().getRounds();
        const idx = rounds.indexOf(this);
        if (idx > -1) {
            rounds.splice(idx, 1);
        }
        if (rounds.length === 0) {
            this.getNumber().detach();
        }
        this.parentQualifyGroup = undefined;
    }
}

