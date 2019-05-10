import { Competitor } from '../competitor';
import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { RoundRankingItem } from '../ranking/item';
import { RankingService } from '../ranking/service';
import { Round } from '../round';
import { QualifyGroup } from './group';
import { QualifyReservationService } from './reservationservice';
import { QualifyRule } from './rule';

export class QualifyService {
    constructor(private parentRound: Round, private childRound: Round, private ruleSet: number) {
    }

    getNewQualifiers(rules: QualifyRule[]): INewQualifier[] {
        let qualifiers: INewQualifier[] = [];
        const qualifyReservationService = new QualifyReservationService(this.childRound);
        qualifyReservationService.reserveSingleRules();
        rules.forEach(rule => {
            qualifiers = qualifiers.concat(this.getQualifiers(rule, qualifyReservationService));
        });
        return qualifiers;
    }

    protected getQualifiers(rule: QualifyRule, qualifyReservationService: QualifyReservationService): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is
        const newQualifiers: INewQualifier[] = [];
        const toPoulePlaces = rule.getToPoulePlaces();
        const toWinnersLosers = rule.getToRound().getWinnersOrLosers();

        if (!rule.isMultiple()) {
            rule.getFromPoulePlaces().forEach(fromPoulePlace => {
                const fromPoule = fromPoulePlace.getPoule();
                let qualifiedCompetitor;
                if (fromPoule.getState() === Game.STATE_PLAYED) {
                    const rank = fromPoulePlace.getNumber();
                    qualifiedCompetitor = this.getQualifiedCompetitor(fromPoulePlace.getPoule(), rank);
                }
                newQualifiers.push({ poulePlace: rule.getToEquivalent(fromPoulePlace), competitor: qualifiedCompetitor });
            });
            return newQualifiers;
        }

        // multiple
        if (rule.getFromRound().getState() !== Game.STATE_PLAYED) {
            toPoulePlaces.forEach((toPoulePlace) => {
                newQualifiers.push({ poulePlace: toPoulePlace, competitor: undefined });
            });
            return newQualifiers;
        }
        const rankingService = new RankingService(this.ruleSet);
        const roundRankingItems: RoundRankingItem[] = rankingService.getItemsForMultipleRule(rule);
        const roundRankingPoulePlaces: PoulePlace[] = this.getPoulePlaces(roundRankingItems, toWinnersLosers);
        while (roundRankingPoulePlaces.length > toPoulePlaces.length) {
            roundRankingPoulePlaces.pop();
        }

        toPoulePlaces.forEach((toPoulePlace) => {
            const toPouleNumber = toPoulePlace.getPoule().getNumber();
            const rankedPoulePlace = qualifyReservationService.getFreeAndLeastAvailabe(toPouleNumber, roundRankingPoulePlaces);
            if (rankedPoulePlace === undefined) {
                return;
            }
            newQualifiers.push({ poulePlace: toPoulePlace, competitor: rankedPoulePlace.getCompetitor() });
            roundRankingPoulePlaces.splice(roundRankingPoulePlaces.indexOf(rankedPoulePlace), 1);
        });
        return newQualifiers;
    }

    getPoulePlaces(rankingItems: RoundRankingItem[], winnersLosers: number): PoulePlace[] {
        const rankingPoulePlaces: PoulePlace[] = rankingItems.map(rankingItem => {
            return rankingItem.getRound().getPoulePlace(rankingItem.getPoulePlaceLocation());
        });
        if (winnersLosers === QualifyGroup.LOSERS) {
            rankingPoulePlaces.reverse();
        }
        return rankingPoulePlaces;
    }

    getQualifiedCompetitor(poule: Poule, rank: number): Competitor {
        const rankingService = new RankingService(this.ruleSet);
        const pouleRankingItems: RoundRankingItem[] = rankingService.getItemsForPoule(poule);
        const rankingItem = rankingService.getItemByRank(pouleRankingItems, rank);
        const poulePlace = poule.getPlace(rankingItem.getPoulePlaceLocation().getPlaceNr());
        return poulePlace ? poulePlace.getCompetitor() : undefined;
    }

    // getRankedPoulePlacesForRound(round: Round, fromPoulePlaces: PoulePlace[]): PoulePlace[] {
    //     const rankingService = new Ranking(Ranking.RULESSET_WC);
    //     const selectedPoulePlaces: PoulePlace[] = [];
    //     fromPoulePlaces.forEach(fromPoulePlace => {
    //         const fromPoule = fromPoulePlace.getPoule();
    //         const fromRankNr = fromPoulePlace.getNumber();
    //         const ranking: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(fromPoule.getPlaces(), fromPoule.getGames());
    //         selectedPoulePlaces.push(ranking[fromRankNr - 1]);
    //     });
    //     return rankingService.getPoulePlacesByRankSingle(selectedPoulePlaces, round.getGames());
    // }

    protected getRankedPoulePlace(rankedPoulePlaces: PoulePlace[], toPoule: Poule): PoulePlace {
        const toCompetitors = toPoule.getCompetitors();
        return rankedPoulePlaces.find(rankedPoulePlace => {
            return !this.hasCompetitor(toCompetitors, rankedPoulePlace.getPoule().getCompetitors());
        });
    }

    protected hasCompetitor(allCompetitors: Competitor[], competitorsToFind: Competitor[]) {
        return allCompetitors.some(competitor => competitorsToFind.some(competitorToFind => competitorToFind === competitor));
    }
}

export interface INewQualifier {
    competitor: Competitor;
    poulePlace: PoulePlace;
}
