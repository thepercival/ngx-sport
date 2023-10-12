
import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '../../qualify/group';
import { EndRankingItem } from '../item/end';
import { Place } from '../../place';
import { RoundRankingCalculator } from './round';
import { QualifyTarget } from '../../qualify/target';
import { HorizontalSingleQualifyRule } from '../../qualify/rule/horizontal/single';
import { GameState } from '../../game/state';
import { Category } from '../../category';
import { VerticalSingleQualifyRule } from '../../qualify/rule/vertical/single';
import { VerticalMultipleQualifyRule } from '../../qualify/rule/vertical/multiple';
import { HorizontalMultipleQualifyRule } from '../../qualify/rule/horizontal/multiple';

export class EndRankingCalculator {

    private currentRank: number = 1;

    constructor(private category: Category) {
    }

    getItems(): EndRankingItem[] {
        this.currentRank = 1;
        const getItems = (round: Round): EndRankingItem[] => {
            let items: EndRankingItem[] = [];
            round.getQualifyGroups(QualifyTarget.Winners).forEach(qualifyGroup => {
                items = items.concat(getItems(qualifyGroup.getChildRound()));
            });
            if (round.getGamesState() === GameState.Finished) {
                items = items.concat(this.getDropouts(round));
            } else {
                items = items.concat(this.getDropoutsNotFinished(round));
            }
            round.getQualifyGroups(QualifyTarget.Losers).slice().reverse().forEach(qualifyGroup => {
                items = items.concat(getItems(qualifyGroup.getChildRound()));
            });
            return items;
        };
        const items = getItems(this.category.getRootRound());
        return items.sort((itemA: EndRankingItem, itemB: EndRankingItem): number => {
            return itemA.getUniqueRank() - itemB.getUniqueRank();
        });
    }

    protected getDropoutsNotFinished(round: Round): EndRankingItem[] {
        const items: EndRankingItem[] = [];
        const nrOfDropouts: number = round.getNrOfPlaces() - round.getNrOfPlacesChildren();
        for (let i = 0; i < nrOfDropouts; i++) {
            items.push(new EndRankingItem(this.currentRank, this.currentRank++, undefined));
        }
        return items;
    }

    protected getDropouts(round: Round): EndRankingItem[] {
        let dropouts: EndRankingItem[] = [];
        let nrOfDropouts = round.getNrOfDropoutPlaces(); // 12 => 10 = 2 nrOfDropouts
        while (dropouts.length < nrOfDropouts) {
            [QualifyTarget.Winners, QualifyTarget.Losers].every((qualifyTarget: QualifyTarget) => {
                round.getHorizontalPoules(qualifyTarget).every((horPoule: HorizontalPoule) => {
                    const horPouleDropouts = this.getHorizontalPouleDropouts(horPoule);
                    // console.log('horPouleDropouts length ' + horPouleDropouts.length);
                    let horPouleDropout = horPouleDropouts.pop();
                    while (dropouts.length < nrOfDropouts && horPouleDropout !== undefined) {
                        dropouts.push(horPouleDropout);
                        horPouleDropout = horPouleDropouts.pop();
                    }
                    return dropouts.length < nrOfDropouts;
                });
                return dropouts.length < nrOfDropouts;
            });
        }
        return dropouts;
    }

    protected getHorizontalPouleDropouts(horizontalPoule: HorizontalPoule): EndRankingItem[] {
        const rankingCalculator = new RoundRankingCalculator();
        const rankingPlaces: Place[] = rankingCalculator.getPlacesForHorizontalPoule(horizontalPoule);
        // console.log('rankingPlaces length ' + rankingPlaces.length);
        rankingPlaces.splice(0, this.getHorizontalPouleNrOfQualifiers(horizontalPoule));
        return rankingPlaces.map((place: Place) => {
            return new EndRankingItem(this.currentRank, this.currentRank++, place.getStartLocation());
        });
    }

    getHorizontalPouleNrOfQualifiers(horizontalPoule: HorizontalPoule): number {
        const qualifyRule = horizontalPoule.getQualifyRuleNew();
        if (qualifyRule === undefined) {
            return 0;
        }
        if (qualifyRule instanceof HorizontalSingleQualifyRule || qualifyRule instanceof VerticalSingleQualifyRule) {
            return qualifyRule.getMappings().length;
        } // else if (qualifyRule instanceof HorizontalMultipleQualifyRule) {
        return qualifyRule.getNrOfToPlaces(); 
        // } 
        // throw new Error('non-horizontalQualifyRule not supported');
    }

    // protected getVerticalPouleDropouts(horizontalPoule: HorizontalPoule): EndRankingItem[] {
    //     const rankingCalculator = new RoundRankingCalculator();
    //     const rankingPlaces: Place[] = rankingCalculator.getPlacesForHorizontalPoule(horizontalPoule);
    //     rankingPlaces.splice(0, this.getHorizontalNrOfDropouts(horizontalPoule));
    //     return rankingPlaces.map((place: Place) => {
    //         return new EndRankingItem(this.currentRank, this.currentRank++, place.getStartLocation());
    //     });
    // }

    // getVerticalNrOfDropouts(horizontalPoule: HorizontalPoule): number {
    //     const qualifyRule = horizontalPoule.getQualifyRuleNew();
    //     if (qualifyRule === undefined) {
    //         return 0;
    //     }
        
    //     if (qualifyRule instanceof VerticalSingleQualifyRule) {
    //         throw new Error('calculate nr of dropouts'); // @TODO CDK
    //     } else if (qualifyRule instanceof VerticalMultipleQualifyRule) {
    //         throw new Error('calculate nr of dropouts'); // @TODO CDK
    //     }
    //     throw new Error('non-verticalQualifyRule not supported');
    // }

}
