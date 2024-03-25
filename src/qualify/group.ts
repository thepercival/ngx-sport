import { RoundNumber } from '../round/number';
import { HorizontalPoule } from '../poule/horizontal';
import { Competition } from '../competition';
import { Place } from '../place';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { CompetitionSport } from '../competition/sport';
import { ScoreConfig } from '../score/config';
import { AgainstQualifyConfig } from './againstConfig';
import { Identifiable } from '../identifiable';
import { AgainstGame } from '../game/against';
import { TogetherGame } from '../game/together';
import { QualifyTarget } from './target';
import { QualifyPathNode } from './pathNode';
import { BalancedPouleStructure } from '../poule/structure/balanced';
import { GameState } from '../game/state';
import { Category } from '../category';
import { StructureCell } from '../structure/cell';
import { StartLocation } from '../competitor/startLocation';
import { QualifyDistribution } from './distribution';
import { VerticalMultipleQualifyRule } from './rule/vertical/multiple';
import { VerticalSingleQualifyRule } from './rule/vertical/single';
import { HorizontalSingleQualifyRule } from './rule/horizontal/single';
import { HorizontalMultipleQualifyRule } from './rule/horizontal/multiple';

import { CompetitionSportGetter } from '../competition/sport/getter';
import { NrOfDropOuts } from '../ranking/calculator/end';
import { map } from 'rxjs';

export class QualifyGroup extends Identifiable {
    static readonly QUALIFYORDER_CROSS = 1;
    static readonly QUALIFYORDER_RANK = 2;
    static readonly QUALIFYORDER_CUSTOM1 = 4;
    static readonly QUALIFYORDER_CUSTOM2 = 5;

    protected number: number
    protected childRound: Round;
    protected distribution: QualifyDistribution = QualifyDistribution.HorizontalSnake;
    protected firstSingleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule | undefined;
    protected multipleRule: HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule | undefined;

    constructor(protected parentRound: Round, protected target: QualifyTarget, nextStructureCell: StructureCell, number?: number) {
        super();
        this.number = number ? number : this.parentRound.getQualifyGroups(this.getTarget()).length + 1;
        this.parentRound.getQualifyGroups(this.getTarget()).splice(this.number - 1, 0, this);
        this.childRound = new Round(nextStructureCell, this);
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

    getDistribution(): QualifyDistribution {
        return this.distribution;
    }

    setDistribution(distribution: QualifyDistribution): void {
        this.distribution = distribution;
    }

    getFirstSingleRule(): HorizontalSingleQualifyRule | VerticalSingleQualifyRule | undefined {
        return this.firstSingleRule;
    }

    setFirstSingleRule(singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule | undefined): void {
        this.firstSingleRule = singleRule;
    }

    getMultipleRule(): HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule | undefined {
        return this.multipleRule;
    }

    setMultipleRule(multipleRule: HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule | undefined): void {
        this.multipleRule = multipleRule;
    }

    getNrOfSingleRules(): number {
        let nrOfSingleRules = 0;
        
        let singleRule = this.firstSingleRule;
        while  (singleRule !== undefined) {
            nrOfSingleRules++;
            singleRule = singleRule.getNext();
        }
        return nrOfSingleRules;
    }

    getRulesNrOfToPlaces(): number {
        let nrOfToPlaces = 0;
        
        let singleRule = this.getFirstSingleRule();
        while (singleRule !== undefined) {
            nrOfToPlaces += singleRule.getNrOfMappings(); //() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
            singleRule = singleRule.getNext();
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

    getRuleByToPlace(toPlace: Place): HorizontalSingleQualifyRule | HorizontalMultipleQualifyRule | VerticalSingleQualifyRule | VerticalMultipleQualifyRule {
        
        let singleRule = this.firstSingleRule;
        while (singleRule !== undefined) {
            if (singleRule.getMappingByToPlace(toPlace) !== undefined) {
                return singleRule;
            }
            singleRule = singleRule.getNext();
        }
        const multipleRule = this.getMultipleRule();
        if (multipleRule === undefined || !multipleRule.hasToPlace(toPlace)) {
            throw Error('de horizontale multiple kwalificatieregel kan niet gevonden worden');
        }
        return multipleRule;
    }

    getFromPlace(toPlace: Place): Place | undefined {
        let singleRule = this.getRuleByToPlace(toPlace);
        if (singleRule instanceof HorizontalSingleQualifyRule) {
            const mapping = singleRule.getMappingByToPlace(toPlace);
            return mapping?.getFromPlace();
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
    protected qualifyPathNode: QualifyPathNode;
    protected scoreConfigs: ScoreConfig[] = [];
    protected againstQualifyConfigs: AgainstQualifyConfig[] = [];

    constructor(protected structureCell: StructureCell, protected parentQualifyGroup: QualifyGroup | undefined) {
        super();
        this.structureCell.getRounds().push(this);
        this.qualifyPathNode = this.constructQualifyPathNode();
    }

    getCompetition(): Competition {
        return this.getNumber().getCompetition();
    }

    getCategory(): Category {
        return this.getStructureCell().getCategory();
    }

    getParent(): Round | undefined {
        return this.getParentQualifyGroup()?.getParentRound();
    }

    getParentQualifyGroup(): QualifyGroup | undefined {
        return this.parentQualifyGroup;
    }

    getStructureCell(): StructureCell {
        return this.structureCell;
    }

    getNumber(): RoundNumber {
        return this.structureCell.getRoundNumber();
    }

    getNumberAsValue(): number {
        return this.getNumber().getNumber();
    }

    getNrOfDropoutPlaces(): NrOfDropOuts {
        const nrOfDropOuts = this.getNrOfPlaces() - this.getNrOfPlacesChildren();
        return { amount: nrOfDropOuts };
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
            throw Error('de poule kan niet gevonden worden.');
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
            throw Error('de plek kan niet gevonden worden');
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
            nrOfGames += poule.getNrOfGames();
        });
        return nrOfGames;
    }

    getGamesState(): GameState {
        if (this.getPoules().every(poule => poule.getGamesState() === GameState.Finished)) {
            return GameState.Finished;
        } else if (this.getPoules().some(poule => poule.getGamesState() !== GameState.Created)) {
            return GameState.InProgress;
        }
        return GameState.Created;
    }

    hasBegun(): boolean {
        return this.getGamesState() > GameState.Created;
    }

    hasFinished(): boolean {
        return this.getGamesState() > GameState.Created;
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
        if (parent === undefined) {
            throw Error('de score-regels kunnen niet gevonden worden');
        }
        return parent.getValidScoreConfig(competitionSport);
    }

    getAgainstQualifyConfigs(): AgainstQualifyConfig[] {
        return this.againstQualifyConfigs;
    }

    getAgainstQualifyConfig(competitionSport: CompetitionSport): AgainstQualifyConfig | undefined {
        return this.againstQualifyConfigs.find(againstQualifyConfigIt => againstQualifyConfigIt.getCompetitionSport() === competitionSport);
    }

    setAgainstQualifyConfig(qualifyagainstConfig: AgainstQualifyConfig) {
        this.againstQualifyConfigs.push(qualifyagainstConfig);
    }

    getValidAgainstQualifyConfigs(): AgainstQualifyConfig[] {
        return this.getNumber().getCompetitionSports().map(competitionSport => this.getValidAgainstQualifyConfig(competitionSport));
    }

    getValidAgainstQualifyConfig(competitionSport: CompetitionSport): AgainstQualifyConfig {
        const againstQualifyConfig = this.getAgainstQualifyConfig(competitionSport);
        if (againstQualifyConfig !== undefined) {
            return againstQualifyConfig;
        }
        const parent = this.getParent();
        if (parent === undefined) {
            throw Error('de punten-regels kunnen niet gevonden worden');
        }
        return parent.getValidAgainstQualifyConfig(competitionSport);
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
        const nrOfPoulePlaces = poulePlaces.length; 
        
        const removedPoulePlaces = poulePlaces.splice(nrOfPoulePlaces - 1, 1);

        const sportVariants = poule.getCompetition().getSportVariants();
        const minNrOfPlacesPerPoule = (new CompetitionSportGetter()).getMinNrOfPlacesPerPoule(sportVariants);
        
        if (poulePlaces.length < minNrOfPlacesPerPoule) {
            this.removePoule();
            return nrOfPoulePlaces;
        }
        return removedPoulePlaces.length;
    }

    getFirstPoule(): Poule {
        return this.getPoule(1);
    }

    getLastPoule(): Poule {
        return this.getPoule(this.getPoules().length);
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


    protected constructQualifyPathNode(): QualifyPathNode {
        if (this.parentQualifyGroup === undefined) {
            return new QualifyPathNode(undefined, 1);
        }
        return new QualifyPathNode(
            this.parentQualifyGroup.getTarget(),
            this.parentQualifyGroup.getNumber(),
            this.parentQualifyGroup.getParentRound().getPathNode());
    }

    getPathNode(): QualifyPathNode {
        return this.qualifyPathNode;
    }

    createPouleStructure(): BalancedPouleStructure {
        const nrOfPlaces = this.getPoules().map((poule: Poule): number => poule.getPlaces().length);
        return new BalancedPouleStructure(...nrOfPlaces);
    }

    detach() {
        const rounds = this.getStructureCell().getRounds();
        const idx = rounds.indexOf(this);
        if (idx > -1) {
            rounds.splice(idx, 1);
        }
        if (rounds.length === 0) {
            this.getStructureCell().detach();
        }
        this.parentQualifyGroup = undefined;
    }

    public hasQualified(startLocation: StartLocation): boolean {
        return this.getPoules().some((poule: Poule): boolean => {
            return poule.getPlaceByStartLocation(startLocation) !== undefined;
        });
    }
}

