import { Competitor } from '../competitor';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { Place } from '../place';
import { QualifyGroup, Round } from './group';
import { QualifyReservationService } from './reservationservice';
import { RoundRankingCalculator } from '../ranking/calculator/round';
import { QualifyTarget } from './target';
import { RoundRankingItem } from '../ranking/item/round';
import { GameState } from '../game/state';
import { QualifyDistribution } from './distribution';
import { HorizontalSingleQualifyRule } from './rule/horizontal/single';
import { HorizontalMultipleQualifyRule } from './rule/horizontal/multiple';
import { VerticalSingleQualifyRule } from './rule/vertical/single';
import { VerticalMultipleQualifyRule } from './rule/vertical/multiple';
import { QualifyMappingByRank } from './mapping/byRank';
import { QualifyMappingByPlace } from './mapping/byPlace';

export class QualifyService {
    private roundRankingCalculator: RoundRankingCalculator;
    private poulesFinished: FinishedPoulesMap = {};
    private roundFinished: boolean | undefined;

    constructor(private round: Round) {
        this.roundRankingCalculator = new RoundRankingCalculator();
    }

    setQualifiers(filterPoule?: Poule): Place[] {
        let changedPlaces: Place[] = [];

        const setQualifiersForSingleRule = (singleRule: HorizontalSingleQualifyRule, reservationService: QualifyReservationService) => {
            singleRule.getMappings().forEach((qualifyPlaceMapping: QualifyMappingByPlace) => {
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
            
                
            let singleRule = qualifyGroup.getFirstSingleRule();
            while (singleRule !== undefined) {
                if (singleRule instanceof HorizontalSingleQualifyRule) {
                    setQualifiersForSingleRule(singleRule, reservationService);
                } else {
                    changedPlaces = changedPlaces.concat(
                        this.setQualifiersForRankedRuleAndReserve(singleRule,reservationService)
                        );
                } 
                singleRule = singleRule.getNext();
            }
            const multipleRule = qualifyGroup.getMultipleRule();
            if (multipleRule !== undefined) {
                const changedPlacesTmp = this.setQualifiersForRankedRuleAndReserve(multipleRule, reservationService);                
                changedPlaces = changedPlaces.concat(changedPlacesTmp);
            }
           
            
        });
        return changedPlaces;
    }

    protected setQualifierForPlaceMappingAndReserve(
        qualifyMapping: QualifyMappingByPlace|QualifyMappingByRank,
        reservationService: QualifyReservationService): void {
        
        let rank;
        const poule = qualifyMapping.getFromPoule();
        if (qualifyMapping instanceof QualifyMappingByPlace) {
            rank = qualifyMapping.getFromPlace().getPlaceNr();
        } else {
            rank = qualifyMapping.getFromRank();
        }

        const qualifiedPlace = this.getQualifiedPlace(poule, rank);
        qualifyMapping.getToPlace().setQualifiedPlace(qualifiedPlace);
        reservationService.reserve(qualifyMapping.getToPlace().getPoule().getNumber(), poule);
    }

    protected setQualifiersForRankedRuleAndReserve(rankedRule: HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule, reservationService: QualifyReservationService): Place[] {
        const changedPlaces: Place[] = [];
        const toPlaces = rankedRule.getToPlaces();
        
        if (!this.isRoundFinished()) {
            toPlaces.forEach((toPlace: Place) => {
                toPlace.setQualifiedPlace(undefined);
                changedPlaces.push(toPlace);
            });
            return changedPlaces;
        }
        const round = rankedRule.getFromRound();
        const rankedPlaceLocations: PlaceLocation[] =
            this.roundRankingCalculator.getPlaceLocationsForRankedRule(rankedRule);

        if (rankedRule.getQualifyTarget() === QualifyTarget.Losers ) {
            rankedPlaceLocations.reverse();
        }

        while (rankedPlaceLocations.length > toPlaces.length) {
            rankedPlaceLocations.pop();
        }

        toPlaces.forEach((toPlace: Place) => {
            const toPouleNumber = toPlace.getPoule().getNumber();
            const rankingPlaceLocation = reservationService.getFreeAndLeastAvailabe(toPouleNumber, round, rankedPlaceLocations);
            toPlace.setQualifiedPlace(round.getPlace(rankingPlaceLocation));

            // if( rankedRule instanceof VerticalMultipleQualifyRule ) {
            //     if (rankedRule.getQualifyTarget() === QualifyTarget.Losers) {
            //         console.log('rankingPlaceLocation ', rankingPlaceLocation.getPouleNr() + '.' + rankingPlaceLocation.getPlaceNr());
            //         console.log('toPlace ', toPlace.getPouleNr() + '.' + toPlace.getPlaceNr());
            //     }
            // }

            changedPlaces.push(toPlace);
            const index = rankedPlaceLocations.indexOf(rankingPlaceLocation);
            if (index >= 0 ) {
                rankedPlaceLocations.splice(index, 1);
            }
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