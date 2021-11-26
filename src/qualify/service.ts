import { Competitor } from '../competitor';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { Place } from '../place';
import { QualifyGroup, Round } from './group';
import { QualifyReservationService } from './reservationservice';
import { MultipleQualifyRule } from './rule/multiple';
import { SingleQualifyRule } from './rule/single';
import { State } from '../state';
import { RoundRankingCalculator } from '../ranking/calculator/round';
import { QualifyTarget } from './target';
import { QualifyPlaceMapping } from './placeMapping';
import { RoundRankingItem } from '../ranking/item/round';

export class QualifyService {
    private roundRankingCalculator: RoundRankingCalculator;
    private poulesFinished: FinishedPoulesMap = {};
    private roundFinished: boolean | undefined;

    constructor(private round: Round) {
        this.roundRankingCalculator = new RoundRankingCalculator();
    }

    setQualifiers(filterPoule?: Poule): Place[] {
        let changedPlaces: Place[] = [];

        const setQualifiersForSingleRule = (singleRule: SingleQualifyRule, reservationService: QualifyReservationService) => {
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
            let singleRule = qualifyGroup.getFirstSingleRule();
            while (singleRule !== undefined) {
                setQualifiersForSingleRule(singleRule, reservationService);
                singleRule = singleRule.getNext();
            }
            const multipleRule = qualifyGroup.getMultipleRule();
            if (multipleRule) {
                changedPlaces = changedPlaces.concat(this.setQualifiersForMultipleRuleAndReserve(multipleRule, reservationService));
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

    protected setQualifiersForMultipleRuleAndReserve(ruleMultiple: MultipleQualifyRule, reservationService: QualifyReservationService): Place[] {
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
        const rankingPlaceLocations: PlaceLocation[] =
            this.roundRankingCalculator.getPlaceLocationsForMultipleRule(ruleMultiple);

        while (rankingPlaceLocations.length > toPlaces.length) {
            ruleMultiple.getQualifyTarget() === QualifyTarget.Winners ? rankingPlaceLocations.pop() : rankingPlaceLocations.shift();
        }
        toPlaces.forEach(toPlace => {
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