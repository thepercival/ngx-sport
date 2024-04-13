
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
import { QualifyDistribution } from '../../qualify/distribution';

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
        const nrOfDropouts = round.getNrOfDropoutPlaces();
        while (nrOfDropouts.amount > 0) {

            const distribution = round.getParentQualifyGroup()?.getDistribution() ?? QualifyDistribution.HorizontalSnake;
            if (distribution === QualifyDistribution.HorizontalSnake ) {
                round.getHorizontalPoules(QualifyTarget.Winners).every(horPoule => {
                    const horPouleDropouts = this.getHorizontalPouleDropouts(horPoule, nrOfDropouts);
                    dropouts = dropouts.concat(horPouleDropouts);
                    return nrOfDropouts.amount > 0;
                });
            } else {
                const roundDropouts = this.getPoulesDropouts(round, nrOfDropouts);
                dropouts = dropouts.concat(roundDropouts);
            }
        }

        return dropouts;
    }

    protected getHorizontalPouleDropouts(horizontalPoule: HorizontalPoule, nrOfDropouts: NrOfDropOuts): EndRankingItem[] {
        let dropOutPlaces = [];
        const rankingCalculator = new RoundRankingCalculator();
        const rankedPlaces: Place[] = rankingCalculator.getPlacesForHorizontalPoule(horizontalPoule);
        let nrOfQualifiers = this.getHorizontalPouleNrOfQualifiers(horizontalPoule);
        rankedPlaces.splice(0, nrOfQualifiers);        
        while (nrOfDropouts.amount > 0 && rankedPlaces.length > 0) {
            dropOutPlaces.push( rankedPlaces.shift() );
            nrOfDropouts.amount--;
        }

        return dropOutPlaces.map((dropOutPlace: Place) => {
            return new EndRankingItem(this.currentRank, this.currentRank++, dropOutPlace.getStartLocation());
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

    protected getPoulesDropouts(round: Round, nrOfDropouts: NrOfDropOuts): EndRankingItem[] {
        let dropOutPlaces = [];
        const places = round.getPlaces(Round.ORDER_POULE_NUMBER);
        let nrOfDropoutPlaces = round.getNrOfDropoutPlaces();
        
        const nrOfWinners = round.getNrOfPlacesChildren(QualifyTarget.Winners);
        
        places.splice(0, nrOfWinners);
        while (nrOfDropouts.amount > 0 && nrOfDropoutPlaces.amount > 0) {
            const placeToAdd = places.shift();
            dropOutPlaces.push(placeToAdd);
            nrOfDropouts.amount--;
            nrOfDropoutPlaces.amount--;
        }

        return dropOutPlaces.map((dropOutPlace: Place) => {
            return new EndRankingItem(this.currentRank, this.currentRank++, dropOutPlace.getStartLocation());
        });
    }
}

export interface NrOfDropOuts {
    amount: number;
}