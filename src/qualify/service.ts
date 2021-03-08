import { Competitor } from '../competitor';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { Place } from '../place';
import { QualifyGroup, Round } from './group';
import { QualifyReservationService } from './reservationservice';
import { QualifyRuleMultiple } from './rule/multiple';
import { QualifyRuleSingle } from './rule/single';
import { State } from '../state';
import { RoundRankingCalculator } from '../ranking/calculator/round';
import { RankedRoundItem } from '../ranking/item/round/ranked';

export class QualifyService {
    private roundRankingCalculator: RoundRankingCalculator;
    private poulesFinished: FinishedPoulesMap = {};
    private roundFinished: boolean | undefined;

    constructor(private round: Round) {
        this.roundRankingCalculator = new RoundRankingCalculator();
    }

    setQualifiers(filterPoule?: Poule): Place[] {
        let changedPlaces: Place[] = [];

        const setQualifiersForHorizontalPoule = (horizontalPoule: HorizontalPoule, reservationService: QualifyReservationService) => {
            const multipleRule = horizontalPoule.getQualifyRuleMultiple();
            if (multipleRule) {
                changedPlaces = changedPlaces.concat(this.setQualifiersForMultipleRuleAndReserve(<QualifyRuleMultiple>multipleRule, reservationService));
            } else {
                horizontalPoule.getPlaces().forEach(place => {
                    if (filterPoule !== undefined && place.getPoule() !== filterPoule) {
                        return;
                    }
                    const singleRule = <QualifyRuleSingle>place.getToQualifyRule(horizontalPoule.getWinnersOrLosers());
                    const toPlace = this.setQualifierForSingleRuleAndReserve(singleRule, reservationService);
                    if (toPlace) {
                        changedPlaces.push(toPlace);
                    }
                });
            }
        };
        this.round.getQualifyGroups().forEach(qualifyGroup => {
            const reservationService = new QualifyReservationService(qualifyGroup.getChildRound());
            qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                setQualifiersForHorizontalPoule(horizontalPoule, reservationService);
            });
        });
        return changedPlaces;
    }

    protected setQualifierForSingleRuleAndReserve(ruleSingle: QualifyRuleSingle, reservationService: QualifyReservationService): Place | undefined {
        const fromPlace = ruleSingle.getFromPlace();
        const poule = fromPlace.getPoule();
        const rank = fromPlace.getNumber();
        const qualifiedPlace = this.getQualifiedPlace(poule, rank);
        const toPlace = ruleSingle.getToPlace();
        if (!toPlace) {
            return undefined;
        }
        toPlace.setQualifiedPlace(qualifiedPlace);
        reservationService.reserve(toPlace.getPoule().getNumber(), poule);
        return toPlace;
    }

    protected setQualifiersForMultipleRuleAndReserve(ruleMultiple: QualifyRuleMultiple, reservationService: QualifyReservationService): Place[] {
        const changedPlaces: Place[] = [];
        const toPlaces = ruleMultiple.getToPlaces();
        if (!this.isRoundFinished()) {
            toPlaces.forEach((toPlace) => {
                toPlace.setQualifiedPlace(undefined);
                changedPlaces.push(toPlace);
            });
            return changedPlaces;
        }
        const round = ruleMultiple.getFromRound();
        const rankedPlaceLocations: PlaceLocation[] =
            this.roundRankingCalculator.getPlaceLocationsForHorizontalPoule(ruleMultiple.getFromHorizontalPoule());

        while (rankedPlaceLocations.length > toPlaces.length) {
            ruleMultiple.getWinnersOrLosers() === QualifyGroup.WINNERS ? rankedPlaceLocations.pop() : rankedPlaceLocations.shift();
        }
        toPlaces.forEach(toPlace => {
            const toPouleNumber = toPlace.getPoule().getNumber();
            const rankedPlaceLocation = reservationService.getFreeAndLeastAvailabe(toPouleNumber, round, rankedPlaceLocations);
            toPlace.setQualifiedPlace(round.getPlace(rankedPlaceLocation));
            changedPlaces.push(toPlace);
            rankedPlaceLocations.splice(rankedPlaceLocations.indexOf(rankedPlaceLocation), 1);
        });
        return changedPlaces;
    }

    protected getQualifiedPlace(poule: Poule, rank: number): Place | undefined {
        if (!this.isPouleFinished(poule)) {
            return undefined;
        }
        const pouleRankingItems: RankedRoundItem[] = this.roundRankingCalculator.getItemsForPoule(poule);
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
            this.poulesFinished[poule.getNumber()] = (poule.getState() === State.Finished);
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