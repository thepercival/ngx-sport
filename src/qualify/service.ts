import { Competitor } from '../competitor';
import { Game } from '../game';
import { Poule } from '../poule';
import { HorizontalPoule } from '../poule/horizontal';
import { PoulePlace } from '../pouleplace';
import { RoundRankingItem } from '../ranking/item';
import { RankingService } from '../ranking/service';
import { Round } from '../round';
import { QualifyGroup } from './group';
import { QualifyReservationService } from './reservationservice';
import { QualifyRuleMultiple } from './rule/multiple';
import { QualifyRuleSingle } from './rule/single';


export class QualifyService {
    private rankingService: RankingService;
    private poulesPlayed = {};
    private roundPlayed: boolean;
    private reservationService: QualifyReservationService;

    constructor(private round: Round, ruleSet: number) {
        this.rankingService = new RankingService(round, ruleSet);
    }

    setQualifiers(filterPoule?: Poule): PoulePlace[] {
        let changedPoulePlaces: PoulePlace[] = [];

        const setQualifiersForHorizontalPoule = (horizontalPoule: HorizontalPoule) => {
            const multipleRule = horizontalPoule.getQualifyRuleMultiple();
            if (multipleRule) {
                changedPoulePlaces = changedPoulePlaces.concat(this.setQualifiersForMultipleRuleAndReserve(<QualifyRuleMultiple>multipleRule));
            } else {
                horizontalPoule.getPlaces().forEach(place => {
                    if (filterPoule !== undefined && place.getPoule() !== filterPoule) {
                        return;
                    }
                    const singleRule = <QualifyRuleSingle>place.getToQualifyRule(horizontalPoule.getWinnersOrLosers());
                    changedPoulePlaces.push(this.setQualifierForSingleRuleAndReserve(singleRule));
                });
            }
        }
        this.round.getQualifyGroups().forEach(qualifyGroup => {
            this.reservationService = new QualifyReservationService(qualifyGroup.getChildRound());
            qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                setQualifiersForHorizontalPoule(horizontalPoule);
            });
        });
        return changedPoulePlaces;
    }

    protected setQualifierForSingleRuleAndReserve(ruleSingle: QualifyRuleSingle): PoulePlace {
        const fromPlace = ruleSingle.getFromPlace();
        const poule = fromPlace.getPoule();
        const rank = fromPlace.getNumber();
        const competitor = this.getQualifiedCompetitor(poule, rank);
        ruleSingle.getToPlace().setCompetitor(competitor);
        this.reservationService.reserve(ruleSingle.getToPlace().getPoule().getNumber(), poule);
        return ruleSingle.getToPlace();
    }

    protected setQualifiersForMultipleRuleAndReserve(ruleMultiple: QualifyRuleMultiple): PoulePlace[] {
        let changedPoulePlaces: PoulePlace[] = [];
        const toPlaces = ruleMultiple.getToPlaces();
        if (!this.isRoundPlayed()) {
            toPlaces.forEach((toPlace) => {
                toPlace.setCompetitor(undefined);
                changedPoulePlaces.push(toPlace);
            });
            return changedPoulePlaces;
        }
        const rankingItems: RoundRankingItem[] = this.rankingService.getItemsForHorizontalPoule(ruleMultiple.getFromHorizontalPoule());
        const rankedPoulePlaces: PoulePlace[] = rankingItems.map(rankingItem => {
            return rankingItem.getRound().getPoulePlace(rankingItem.getPlaceLocation());
        });
        while (rankedPoulePlaces.length > toPlaces.length) {
            ruleMultiple.getWinnersOrLosers() === QualifyGroup.WINNERS ? rankedPoulePlaces.pop() : rankedPoulePlaces.unshift();
        }
        toPlaces.forEach(toPlace => {
            const toPouleNumber = toPlace.getPoule().getNumber();
            const rankedPoulePlace = this.reservationService.getFreeAndLeastAvailabe(toPouleNumber, rankedPoulePlaces);
            toPlace.setCompetitor(rankedPoulePlace.getCompetitor());
            changedPoulePlaces.push(toPlace);
            rankedPoulePlaces.splice(rankedPoulePlaces.indexOf(rankedPoulePlace), 1);
        });
        return changedPoulePlaces;
    }

    protected getQualifiedCompetitor(poule: Poule, rank: number): Competitor {
        if (!this.isPoulePlayed(poule)) {
            return undefined;
        }
        const pouleRankingItems: RoundRankingItem[] = this.rankingService.getItemsForPoule(poule);
        const rankingItem = this.rankingService.getItemByRank(pouleRankingItems, rank);
        const poulePlace = poule.getPlace(rankingItem.getPlaceLocation().getPlaceNr());
        return poulePlace ? poulePlace.getCompetitor() : undefined;
    }

    protected isRoundPlayed(): boolean {
        if (this.roundPlayed === undefined) {
            this.roundPlayed = this.round.getPoules().every(poule => this.isPoulePlayed(poule));
        }
        return this.roundPlayed;
    }

    protected isPoulePlayed(poule: Poule): boolean {
        if (this.poulesPlayed[poule.getNumber()] === undefined) {
            this.poulesPlayed[poule.getNumber()] = (poule.getState() === Game.STATE_PLAYED);
        }
        return this.poulesPlayed[poule.getNumber()]
    }
}

export interface INewQualifier {
    competitor: Competitor;
    poulePlace: PoulePlace;
}
