import { Competitor } from '../competitor';
import { PlaceLocation } from '../place/location';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { Place } from '../place';
import { RankedRoundItem } from '../ranking/item';
import { RankingService } from '../ranking/service';
import { Round } from '../round';
import { QualifyGroup } from './group';
import { QualifyReservationService } from './reservationservice';
import { QualifyRuleMultiple } from './rule/multiple';
import { QualifyRuleSingle } from './rule/single';
import { State } from '../state';


export class QualifyService {
    private rankingService: RankingService;
    private poulesPlayed = {};
    private roundPlayed: boolean;
    private reservationService: QualifyReservationService;

    constructor(private round: Round, ruleSet: number) {
        this.rankingService = new RankingService(round, ruleSet);
    }

    setQualifiers(filterPoule?: Poule): Place[] {
        let changedPlaces: Place[] = [];

        const setQualifiersForHorizontalPoule = (horizontalPoule: HorizontalPoule) => {
            const multipleRule = horizontalPoule.getQualifyRuleMultiple();
            if (multipleRule) {
                changedPlaces = changedPlaces.concat(this.setQualifiersForMultipleRuleAndReserve(<QualifyRuleMultiple>multipleRule));
            } else {
                horizontalPoule.getPlaces().forEach(place => {
                    if (filterPoule !== undefined && place.getPoule() !== filterPoule) {
                        return;
                    }
                    const singleRule = <QualifyRuleSingle>place.getToQualifyRule(horizontalPoule.getWinnersOrLosers());
                    changedPlaces.push(this.setQualifierForSingleRuleAndReserve(singleRule));
                });
            }
        };
        this.round.getQualifyGroups().forEach(qualifyGroup => {
            this.reservationService = new QualifyReservationService(qualifyGroup.getChildRound());
            qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                setQualifiersForHorizontalPoule(horizontalPoule);
            });
        });
        return changedPlaces;
    }

    protected setQualifierForSingleRuleAndReserve(ruleSingle: QualifyRuleSingle): Place {
        const fromPlace = ruleSingle.getFromPlace();
        const poule = fromPlace.getPoule();
        const rank = fromPlace.getNumber();
        const competitor = this.getQualifiedCompetitor(poule, rank);
        ruleSingle.getToPlace().setCompetitor(competitor);
        this.reservationService.reserve(ruleSingle.getToPlace().getPoule().getNumber(), poule);
        return ruleSingle.getToPlace();
    }

    protected setQualifiersForMultipleRuleAndReserve(ruleMultiple: QualifyRuleMultiple): Place[] {
        const changedPlaces: Place[] = [];
        const toPlaces = ruleMultiple.getToPlaces();
        if (!this.isRoundPlayed()) {
            toPlaces.forEach((toPlace) => {
                toPlace.setCompetitor(undefined);
                changedPlaces.push(toPlace);
            });
            return changedPlaces;
        }
        const round = ruleMultiple.getFromRound();
        const rankedPlaceLocations: PlaceLocation[] =
            this.rankingService.getPlaceLocationsForHorizontalPoule(ruleMultiple.getFromHorizontalPoule());

        while (rankedPlaceLocations.length > toPlaces.length) {
            ruleMultiple.getWinnersOrLosers() === QualifyGroup.WINNERS ? rankedPlaceLocations.pop() : rankedPlaceLocations.shift();
        }
        toPlaces.forEach(toPlace => {
            const toPouleNumber = toPlace.getPoule().getNumber();
            const rankedPlaceLocation = this.reservationService.getFreeAndLeastAvailabe(toPouleNumber, round, rankedPlaceLocations);
            toPlace.setCompetitor(this.rankingService.getCompetitor(rankedPlaceLocation));
            changedPlaces.push(toPlace);
            rankedPlaceLocations.splice(rankedPlaceLocations.indexOf(rankedPlaceLocation), 1);
        });
        return changedPlaces;
    }

    protected getQualifiedCompetitor(poule: Poule, rank: number): Competitor {
        if (!this.isPoulePlayed(poule)) {
            return undefined;
        }
        const pouleRankingItems: RankedRoundItem[] = this.rankingService.getItemsForPoule(poule);
        const rankingItem = this.rankingService.getItemByRank(pouleRankingItems, rank);
        const place = poule.getPlace(rankingItem.getPlaceLocation().getPlaceNr());
        return place.getCompetitor();
    }

    protected isRoundPlayed(): boolean {
        if (this.roundPlayed === undefined) {
            this.roundPlayed = this.round.getPoules().every(poule => this.isPoulePlayed(poule));
        }
        return this.roundPlayed;
    }

    protected isPoulePlayed(poule: Poule): boolean {
        if (this.poulesPlayed[poule.getNumber()] === undefined) {
            this.poulesPlayed[poule.getNumber()] = (poule.getState() === State.Finished);
        }
        return this.poulesPlayed[poule.getNumber()];
    }
}

export interface INewQualifier {
    competitor: Competitor;
    place: Place;
}
