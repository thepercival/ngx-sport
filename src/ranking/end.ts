import { Game } from '../game';
import { HorizontalPoule } from '../poule/horizontal';
import { QualifyGroup } from '../qualify/group';
import { RoundRankingItem } from '../ranking/item';
import { Round } from '../round';
import { EndRankingItem } from './item';
import { RankingService } from './service';

/* tslint:disable:no-bitwise */

export class EndRanking {

    private currentRank: number;

    constructor(private ruleSet: number) {

    }

    getItems(round: Round): EndRankingItem[] {
        this.currentRank = 0;
        const getItems = (round: Round): EndRankingItem[] => {
            if (round === undefined) {
                return;
            }
            let items: EndRankingItem[] = [];
            round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {
                items = items.concat(this.getItems(qualifyGroup.getChildRound()));
            });

            if (round.getState() === Game.STATE_PLAYED) {
                items = items.concat(this.getDropouts(round));
            } else {
                items = items.concat(this.getDropoutsNotPlayed(round));
            }

            round.getQualifyGroups(QualifyGroup.LOSERS).slice().reverse().forEach(qualifyGroup => {
                items = items.concat(this.getItems(qualifyGroup.getChildRound()));
            });
            return items;
        }
        return getItems(round);
    }

    protected getDropoutsNotPlayed(round: Round): EndRankingItem[] {
        const items: EndRankingItem[] = [];
        const nrOfDropouts: number = round.getNrOfPlaces() - round.getNrOfPlacesChildren();
        for (let i = 0; i < nrOfDropouts; i++) {
            items.push(new EndRankingItem(this.currentRank, this.currentRank++, 'nog onbekend'));
        }
        return items;
    }

    protected getDropouts(round: Round): EndRankingItem[] {
        let dropouts: EndRankingItem[] = [];
        let nrOfDropouts = round.getNrOfDropoutPlaces();
        while (nrOfDropouts > 0) {
            [QualifyGroup.WINNERS, QualifyGroup.LOSERS].some(winnersOrLosers => {
                round.getHorizontalPoules(winnersOrLosers).some(horizontalPoule => {
                    if (horizontalPoule.getQualifyGroup() && horizontalPoule.getQualifyGroup().getNrOfToPlacesTooMuch() === 0) {
                        return nrOfDropouts > 0;
                    }
                    const dropoutsHorizontalPoule = this.getDropoutsHorizontalPoule(horizontalPoule);
                    dropouts = dropouts.concat(dropoutsHorizontalPoule);
                    nrOfDropouts -= dropoutsHorizontalPoule.length;
                    return nrOfDropouts > 0;
                });
                return nrOfDropouts > 0;
            });
        }
        return dropouts;
    }

    // @TODO let op : ga niet elke keer poulestand opnieuw berekenen
    protected getDropoutsHorizontalPoule(horizontalPoule: HorizontalPoule): EndRankingItem[] {
        const rankingService = new RankingService(this.ruleSet);
        const roundRankingItems: RoundRankingItem[] = rankingService.getItemsForHorizontalPoule(horizontalPoule);
        roundRankingItems.splice(0, horizontalPoule.getNrOfQualifiers())
        let rank = 1;
        return roundRankingItems.map(roundRankingItem => {
            const poulePlace = horizontalPoule.getRound().getPoulePlace(roundRankingItem.getPlaceLocation());
            const name = poulePlace.getCompetitor() ? poulePlace.getCompetitor().getName() : 'onbekend';
            return new EndRankingItem(this.currentRank, this.currentRank++, name);
        });
    }
}
