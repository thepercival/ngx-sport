import { PlaceLocation } from '../../place/location';
import { HorizontalPoule } from '../../poule/horizontal';
import { QualifyGroup, Round } from '../../qualify/group';
import { Structure } from '../../structure';
import { EndRankingItem } from '../item';
import { RankingService } from '../service';
import { State } from '../../state';
import { Place } from '../../place';

/* eslint:disable:no-bitwise */

export class EndRankingService {

    private currentRank: number = 1;

    constructor(private structure: Structure, private ruleSet: number) {
    }

    getItems(): EndRankingItem[] {
        this.currentRank = 1;
        const getItems = (round: Round): EndRankingItem[] => {
            let items: EndRankingItem[] = [];
            round.getQualifyGroups(QualifyGroup.WINNERS).forEach(qualifyGroup => {
                items = items.concat(getItems(qualifyGroup.getChildRound()));
            });
            if (round.getState() === State.Finished) {
                items = items.concat(this.getDropouts(round));
            } else {
                items = items.concat(this.getDropoutsNotPlayed(round));
            }
            round.getQualifyGroups(QualifyGroup.LOSERS).slice().reverse().forEach(qualifyGroup => {
                items = items.concat(getItems(qualifyGroup.getChildRound()));
            });
            return items;
        };
        return getItems(this.structure.getRootRound());
    }

    protected getDropoutsNotPlayed(round: Round): EndRankingItem[] {
        const items: EndRankingItem[] = [];
        const nrOfDropouts: number = round.getNrOfPlaces() - round.getNrOfPlacesChildren();
        for (let i = 0; i < nrOfDropouts; i++) {
            items.push(new EndRankingItem(this.currentRank, this.currentRank++, undefined));
        }
        return items;
    }

    protected getDropouts(round: Round): EndRankingItem[] {
        const rankingService = new RankingService(this.ruleSet);
        let dropouts: EndRankingItem[] = [];
        let nrOfDropouts = round.getNrOfDropoutPlaces();
        while (nrOfDropouts > 0) {
            [QualifyGroup.WINNERS, QualifyGroup.LOSERS].every(winnersOrLosers => {
                round.getHorizontalPoules(winnersOrLosers).every(horizontalPoule => {
                    if (horizontalPoule.getQualifyGroup()?.getNrOfToPlacesTooMuch() === 0) {
                        return nrOfDropouts > 0;
                    }
                    const dropoutsHorizontalPoule = this.getDropoutsHorizontalPoule(horizontalPoule, rankingService);
                    while (nrOfDropouts - dropoutsHorizontalPoule.length < 0) {
                        dropoutsHorizontalPoule.pop();
                    }
                    dropouts = dropouts.concat(dropoutsHorizontalPoule);
                    nrOfDropouts -= dropoutsHorizontalPoule.length;
                    return nrOfDropouts > 0;
                });
                return nrOfDropouts > 0;
            });
        }
        return dropouts;
    }

    protected getDropoutsHorizontalPoule(horizontalPoule: HorizontalPoule, rankingService: RankingService): EndRankingItem[] {
        const rankedPlaces: Place[] = rankingService.getPlacesForHorizontalPoule(horizontalPoule);
        rankedPlaces.splice(0, horizontalPoule.getNrOfQualifiers());
        return rankedPlaces.map(place => {
            return new EndRankingItem(this.currentRank, this.currentRank++, place.getStartLocation());
        });
    }
}
