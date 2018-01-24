import { Game } from '../game';
import { Poule } from '../poule';
import { PoulePlace } from '../pouleplace';
import { QualifyRule } from '../qualifyrule';
import { Ranking } from '../ranking';
import { Round } from '../round';
import { Team } from '../team';

/**
 * Created by coen on 18-10-17.
 */

export class QualifyService {
    private parentRound: Round;

    constructor(private childRound: Round) {
        this.parentRound = childRound.getParentRound();
    }

    createObjectsForParentRound() {
        console.log('createObjectsForParentRound()');
        const parentRoundPoulePlacesPerNumber = this.parentRound.getPoulePlacesPerNumber(this.childRound.getWinnersOrLosers());
        const orderedByPlace = true;
        const childRoundPoulePlacesOrderedByPlace = this.childRound.getPoulePlaces(orderedByPlace);
        if (this.childRound.getWinnersOrLosers() === Round.LOSERS) {
            childRoundPoulePlacesOrderedByPlace.reverse();
        }

        let nrOfShifts = 0;
        while (childRoundPoulePlacesOrderedByPlace.length > 0) {
            const qualifyRule = new QualifyRule(this.parentRound, this.childRound);
            // from places
            let poulePlaces;
            {
                // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS) {
                poulePlaces = parentRoundPoulePlacesPerNumber.shift();
                for (let shiftTime = 0; shiftTime < nrOfShifts; shiftTime++) {
                    poulePlaces.push(poulePlaces.shift());
                }
                nrOfShifts++;
                // }
                // else {
                //   poulePlaces = poulePlacesPerNumberParentRound.pop();
                // }
                poulePlaces.forEach(function (poulePlaceIt) {
                    qualifyRule.addFromPoulePlace(poulePlaceIt);
                });
            }

            // to places
            for (let nI = 0; nI < poulePlaces.length; nI++) {
                if (childRoundPoulePlacesOrderedByPlace.length === 0) {
                    break;
                }
                let toPoulePlace;
                // if ( this.childRound.getWinnersOrLosers() === Round.WINNERS ) {
                toPoulePlace = childRoundPoulePlacesOrderedByPlace.shift();
                // }
                // else {
                // toPoulePlace = poulePlacesOrderedByPlaceChildRound.pop();
                // }
                qualifyRule.addToPoulePlace(toPoulePlace);
            }
        }
    }

    removeObjectsForParentRound() {
        let fromQualifyRules = this.childRound.getFromQualifyRules().slice();
        fromQualifyRules.forEach(function (qualifyRuleIt) {
            while (qualifyRuleIt.getFromPoulePlaces().length > 0) {
                qualifyRuleIt.removeFromPoulePlace();
            }
            while (qualifyRuleIt.getToPoulePlaces().length > 0) {
                qualifyRuleIt.removeToPoulePlace();
            }
            qualifyRuleIt.setFromRound(undefined);
            qualifyRuleIt.setToRound(undefined);
        });
        fromQualifyRules = undefined;
    }

    oneMultipleToSingle() {
        const fromQualifyRules = this.parentRound.getToQualifyRules();
        const multiples = fromQualifyRules.filter(function (qualifyRuleIt) {
            return qualifyRuleIt.isMultiple();
        });
        if (multiples.length !== 1) {
            return;
        }

        const multiple = multiples.pop();
        // console.log(multiple.getWinnersOrLosers(), multiple);
        const multipleFromPlaces = multiple.getFromPoulePlaces().slice();
        while (multiple.getFromPoulePlaces().length > 1) {
            multiple.removeFromPoulePlace(multipleFromPlaces.pop());
        }
    }

    // getActiveQualifyRules( winnersOrLosers: number ): QualifyRule[] {
    // let qualifyRules: QualifyRule[] = [];
    // const poulePlacesByNumber = this.round.getPoulePlaces( true );
    // if( winnersOrLosers === Round.WINNERS ){
    //  while
    //
    //  poulePlacesByNumber.forEach( (poulePlaceIt) => )
    // }
    // return qualifyRules;
    // }

    getActivePoulePlaceNumber(winnersOrLosers: number) {
        // als winners dan
    }

    getNewQualifiers(parentPoule: Poule): INewQualifier[] {
        if (parentPoule.getRound() !== this.parentRound) {
            return [];
        }
        const rules = this.getRulesToProcess(parentPoule);
        console.log(rules);
        let qualifiers: INewQualifier[] = [];
        rules.forEach(rule => {
            qualifiers = qualifiers.concat(this.getQualifiers(rule));
        });
        return qualifiers;
    }

    protected getRulesToProcess(parentPoule: Poule): QualifyRule[] {
        if (parentPoule.getRound().getState() === Game.STATE_PLAYED) {
            return parentPoule.getRound().getToQualifyRules();
        }
        let qualifyRules = [];
        if (parentPoule.getState() === Game.STATE_PLAYED) {
            parentPoule.getPlaces().forEach(poulePlace => {
                qualifyRules = qualifyRules.concat(poulePlace.getToQualifyRules().filter(qualifyRule => !qualifyRule.isMultiple()));
            });
        }
        return qualifyRules;
    }

    protected getQualifiers(rule: QualifyRule): INewQualifier[] {
        // bij meerdere fromPoulePlace moet ik bepalen wie de beste is

        const newQualifiers: INewQualifier[] = [];

        if (!rule.isMultiple()) {
            const toPoulePlace = rule.getToPoulePlaces()[0];
            const fromPoulePlace = rule.getFromPoulePlaces()[0];
            const fromRankNr = fromPoulePlace.getNumber();
            const rankingService = new Ranking(Ranking.RULESSET_WC);
            const fromPoule = fromPoulePlace.getPoule();
            const ranking: PoulePlace[] = rankingService.getPoulePlacesByRankSingle(fromPoule.getPlaces(), fromPoule.getGames());
            const qualifiedTeam = ranking[fromRankNr - 1].getTeam();
            return [{ poulePlace: toPoulePlace, team: qualifiedTeam }];
        }

        // multiple

        // {
        //     if ( $oRound->getState() != Voetbal_Factory::STATE_PLAYED )
        //         continue;

        //     $oRankedFromPlaces = Voetbal_PoulePlace_Factory::createObjects();
        //     {
        //         $oFromPoulePlaces = $oQualifyRule->getFromPoulePlaces();
        //         foreach( $oFromPoulePlaces as $oFromPoulePlace )
        //         {
        //             $oRankedPlacesTmp = $oFromPoulePlace->getPoule()->getPlacesByRank()[ $oFromPoulePlace->getNumber() + 1 ];
        //             $oRankedFromPlaces->add( $oRankedPlacesTmp );
        //         }
        //     }

        //     Voetbal_Ranking::putPromotionRule( $oRound->getCompetitionSeason()->getPromotionRule() );
        //     Voetbal_Ranking::putGameStates( Voetbal_Factory::STATE_PLAYED );
        //     Voetbal_Ranking::updatePoulePlaceRankings( null, $oRankedFromPlaces );
        //     $oRankedPlaces = Voetbal_Ranking::getPoulePlacesByRanking( null, $oRankedFromPlaces );

        //     $oToPlaces = $oQualifyRule->getToPoulePlaces();
        //     $nNrOfToPlaces = $oToPlaces->count();
        //     $arrConfigs = $oQualifyRule->getConfig();

        //     $nTotalRank = 0; $nCount = 1;
        //     foreach( $oRankedPlaces as $oRankedPlace ) {

        //         if ( $nCount++ > $nNrOfToPlaces ) { break; }
        //         $nTotalRank += pow( 2, $oRankedPlace->getPoule()->getNumber() );
        //     }

        //     $arrConfig = $arrConfigs[ $nTotalRank ];

        //     $nCount = 1;
        //     foreach( $oRankedPlaces as $oRankedPlace )
        //     {
        //         if ( $nCount++ > $nNrOfToPlaces ) { break; }
        //         $nIndex = array_search( pow( 2, $oRankedPlace->getPoule()->getNumber() ), $arrConfig );
        //         $nI = 0;
        //         foreach ( $oToPlaces as $oToPlace )
        //         {
        //             if ( $nI++ === $nIndex ) {
        //                 $oToPlace->addObserver( $oPoulePlaceDbWriter );
        //                 $oToPlace->putTeam( $oRankedPlace->getTeam() );
        //             }
        //         }
        //     }
        // }

        return [];
    }

    //             $oQualifyRule = $oQualifyRulePP->getQualifyRule();
    //             if ( $oQualifyRule->isSingle() )
    //             {
    //                 $oToPoulePlace = $oQualifyRulePP->getToPoulePlace();
    //                 $oToPoulePlace->addObserver( $oPoulePlaceDbWriter );

    //                 $oQualifiedTeam = $oRankedPoulePlaces[ $oPoulePlace->getNumber() + 1 ]->getTeam();
    //                 $oToPoulePlace->putTeam( $oQualifiedTeam );
    //             }
    //             else
    //             {
    //                 if ( $oRound->getState() != Voetbal_Factory::STATE_PLAYED )
    //                     continue;

    //                 $oRankedFromPlaces = Voetbal_PoulePlace_Factory::createObjects();
    //                 {
    //                     $oFromPoulePlaces = $oQualifyRule->getFromPoulePlaces();
    //                     foreach( $oFromPoulePlaces as $oFromPoulePlace )
    //                     {
    //                         $oRankedPlacesTmp = $oFromPoulePlace->getPoule()->getPlacesByRank()[ $oFromPoulePlace->getNumber() + 1 ];
    //                         $oRankedFromPlaces->add( $oRankedPlacesTmp );
    //                     }
    //                 }

    //                 Voetbal_Ranking::putPromotionRule( $oRound->getCompetitionSeason()->getPromotionRule() );
    //                 Voetbal_Ranking::putGameStates( Voetbal_Factory::STATE_PLAYED );
    //                 Voetbal_Ranking::updatePoulePlaceRankings( null, $oRankedFromPlaces );
    //                 $oRankedPlaces = Voetbal_Ranking::getPoulePlacesByRanking( null, $oRankedFromPlaces );

    //                 $oToPlaces = $oQualifyRule->getToPoulePlaces();
    //                 $nNrOfToPlaces = $oToPlaces->count();
    //                 $arrConfigs = $oQualifyRule->getConfig();

    //                 $nTotalRank = 0; $nCount = 1;
    //                 foreach( $oRankedPlaces as $oRankedPlace ) {

    //                     if ( $nCount++ > $nNrOfToPlaces ) { break; }
    //                     $nTotalRank += pow( 2, $oRankedPlace->getPoule()->getNumber() );
    //                 }

    //                 $arrConfig = $arrConfigs[ $nTotalRank ];

    //                 $nCount = 1;
    //                 foreach( $oRankedPlaces as $oRankedPlace )
    //                 {
    //                     if ( $nCount++ > $nNrOfToPlaces ) { break; }
    //                     $nIndex = array_search( pow( 2, $oRankedPlace->getPoule()->getNumber() ), $arrConfig );
    //                     $nI = 0;
    //                     foreach ( $oToPlaces as $oToPlace )
    //                     {
    //                         if ( $nI++ === $nIndex ) {
    //                             $oToPlace->addObserver( $oPoulePlaceDbWriter );
    //                             $oToPlace->putTeam( $oRankedPlace->getTeam() );
    //                         }
    //                     }
    //                 }
    //             }
    ///////////////////////////////////////// old end

    // 1 ( removing qualifier & adding/removing poule,  poule ) : rearrange qualifyrules over active-placenumber-line
    // 2 ( adding qualifier ) : determine new active-placenumber-line and do 1


    /*addQualifier( fromRound: Round ) {
        let toRound = this.getNextRound(fromRound);
        console.log(toRound);
        if (toRound == undefined) {
            toRound = this.addRound();
        }
        // determine if new qualifiationrule is needed


        const fromQualifyRules = toRound.getFromQualifyRules();
        const lastFromQualifyRule = fromQualifyRules[fromQualifyRules.length - 1];
        if( lastFromQualifyRule !== undefined && lastFromQualifyRule.isMultiple() ) {
            if ( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) < lastFromQualifyRule.getToPoulePlaces().length ) {
                // edit lastFromQualifyRule

            }
            if ( ( lastFromQualifyRule.getFromPoulePlaces().length - 1 ) === lastFromQualifyRule.getToPoulePlaces().length ) {
                // remove and add multiple

            }
        }

        const fromPoules = fromRound.getPoules();
        if ( fromPoules.length > 1 ) { // new multiple

        }
        else { // new single
            const fromPoule = fromPoules[0];
            const fromPlace = fromPoule.getPlaces().find( function( pouleplaceIt ) {
                return this == pouleplaceIt.getNumber()
            }, toRound.getFromQualifyRules().length + 1 );
            if ( fromPlace === undefined ) { return; }

            const toPoules = toRound.getPoules();
            const toPoule = toPoules[0];
            let toPlace;
            if( lastFromQualifyRule === undefined ) { // just get first
                toPlace = toPoule.getPlaces()[0];
            }
            else { // determine which toPoule and toPlace

            }
            if ( toPlace === undefined ) { return; }

            let qualifyRule = new QualifyRule( fromRound, toRound );
            qualifyRule.addFromPoulePlace( fromPlace );
            qualifyRule.addToPoulePlace( toPlace );
        }
    }*/
}

export interface INewQualifier {
    team: Team;
    poulePlace: PoulePlace;
}
