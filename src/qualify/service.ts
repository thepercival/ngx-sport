import { Competitor } from '../competitor';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { Place } from '../place';
import { QualifyGroup, Round } from './group';
import { QualifyReservationService } from './reservationservice';
import { RoundRankingCalculator } from '../ranking/calculator/round';
import { QualifyTarget } from './target';
import { QualifyPlaceMapping } from './placeMapping';
import { RoundRankingItem } from '../ranking/item/round';
import { GameState } from '../game/state';
import { QualifyDistribution } from './distribution';
import { HorizontalSingleQualifyRule } from './rule/horizontal/single';
import { HorizontalMultipleQualifyRule } from './rule/horizontal/multiple';
import { VerticalSingleQualifyRule } from './rule/vertical/single';
import { VerticalMultipleQualifyRule } from './rule/vertical/multiple';

export class QualifyService {
    private roundRankingCalculator: RoundRankingCalculator;
    private poulesFinished: FinishedPoulesMap = {};
    private roundFinished: boolean | undefined;

    constructor(private round: Round) {
        this.roundRankingCalculator = new RoundRankingCalculator();
    }

    setQualifiers(filterPoule?: Poule): Place[] {
        let changedPlaces: Place[] = [];

        const setQualifiersForHorSingleRule = (singleRule: HorizontalSingleQualifyRule | VerticalSingleQualifyRule, reservationService: QualifyReservationService) => {
            singleRule.getMappings().forEach((qualifyPlaceMapping: QualifyPlaceMapping) => {
                const fromPlace = qualifyPlaceMapping.getFromPlace();
                if (filterPoule !== undefined && fromPlace.getPoule() !== filterPoule) {
                    return;
                }
                this.setQualifierForPlaceMappingAndReserve(qualifyPlaceMapping, reservationService);
                changedPlaces.push(qualifyPlaceMapping.getToPlace());
            });
        };
        this.round.getQualifyGroups().forEach((qualifyGroup: QualifyGroup) => {
            const reservationService = new QualifyReservationService(qualifyGroup.getChildRound());
            if( qualifyGroup.getDistribution() === QualifyDistribution.HorizontalSnake) {
                
                let singleRule = qualifyGroup.getFirstHorSingleRule();
                while (singleRule !== undefined) {
                    setQualifiersForHorSingleRule(singleRule, reservationService);
                    singleRule = singleRule.getNext();
                }
                const multipleRule = qualifyGroup.getHorizontalMultipleRule();
                if (multipleRule) {
                    changedPlaces = changedPlaces.concat(this.setQualifiersForHorMultipleRuleAndReserve(multipleRule, reservationService));
                }
            } else {
                
                let verticalRule = qualifyGroup.getFirstVerticalRule();
                while (verticalRule !== undefined) {
                    if( verticalRule instanceof VerticalSingleQualifyRule) {
                        setQualifiersForHorSingleRule(verticalRule, reservationService);
                    } else {
                        changedPlaces = changedPlaces.concat(this.setQualifiersForHorMultipleRuleAndReserve(verticalRule, reservationService));
                    }
                    
                    verticalRule = verticalRule.getNext();
                }
            }
            
        });
        return changedPlaces;
    }

    protected setQualifierForPlaceMappingAndReserve(
        qualifyPlaceMapping: QualifyPlaceMapping,
        reservationService: QualifyReservationService): void {
        
        const poule = qualifyPlaceMapping.getFromPlace().getPoule();
        const rank = qualifyPlaceMapping.getFromPlace().getPlaceNr();
        const qualifiedPlace = this.getQualifiedPlace(poule, rank);
        qualifyPlaceMapping.getToPlace().setQualifiedPlace(qualifiedPlace);
        reservationService.reserve(qualifyPlaceMapping.getToPlace().getPoule().getNumber(), poule);
    }

    protected setQualifiersForHorMultipleRuleAndReserve(ruleMultiple: HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule, reservationService: QualifyReservationService): Place[] {
        const changedPlaces: Place[] = [];
        const toPlaces = ruleMultiple.getToPlaces();
        
        if (!this.isRoundFinished()) {
            toPlaces.forEach((toPlace: Place) => {
                toPlace.setQualifiedPlace(undefined);
                changedPlaces.push(toPlace);
            });
            return changedPlaces;
        }
        const round = ruleMultiple.getFromRound();
        const rankingPlaceLocations: PlaceLocation[] =
            this.roundRankingCalculator.getPlaceLocationsForMultipleRule(ruleMultiple);

        while (rankingPlaceLocations.length > toPlaces.length) {
            ruleMultiple.getQualifyTarget() === QualifyTarget.Winners ? rankingPlaceLocations.pop() : rankingPlaceLocations.shift();
        }
        toPlaces.forEach((toPlace: Place) => {
            const toPouleNumber = toPlace.getPoule().getNumber();
            const rankingPlaceLocation = reservationService.getFreeAndLeastAvailabe(toPouleNumber, round, rankingPlaceLocations);
            toPlace.setQualifiedPlace(round.getPlace(rankingPlaceLocation));
            changedPlaces.push(toPlace);
            rankingPlaceLocations.splice(rankingPlaceLocations.indexOf(rankingPlaceLocation), 1);
        });
        return changedPlaces;
    }

    protected getQualifiedPlace(poule: Poule, rank: number): Place | undefined {
        if (!this.isPouleFinished(poule)) {
            return undefined;
        }
        const pouleRankingItems: RoundRankingItem[] = this.roundRankingCalculator.getItemsForPoule(poule);
        const rankingItem = this.roundRankingCalculator.getItemByRank(pouleRankingItems, rank);
        return rankingItem ? poule.getPlace(rankingItem.getPlaceLocation().getPlaceNr()) : undefined;
    }

    protected isRoundFinished(): boolean {
        if (this.roundFinished === undefined) {
            this.roundFinished = this.round.getPoules().every(poule => this.isPouleFinished(poule));
        }
        return this.roundFinished;
    }

    protected isPouleFinished(poule: Poule): boolean {
        if (this.poulesFinished[poule.getNumber()] === undefined) {
            this.poulesFinished[poule.getNumber()] = (poule.getGamesState() === GameState.Finished);
        }
        return this.poulesFinished[poule.getNumber()];
    }
}

export interface NewQualifier {
    competitor: Competitor;
    place: Place;
}

interface FinishedPoulesMap {
    [key: number]: boolean;
}