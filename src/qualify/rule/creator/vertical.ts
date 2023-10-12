import { Place } from "../../../place";
import { Poule } from "../../../poule";
import { HorizontalPoule } from "../../../poule/horizontal";
import { QualifyGroup, Round } from "../../group";
import { QualifyPlaceMapping } from "../../placeMapping";
import { QualifyTarget } from "../../target";
import { VerticalMultipleQualifyRule } from "../vertical/multiple";
import { VerticalSingleQualifyRule } from "../vertical/single";

export class VerticalQualifyRuleCreator {

    constructor() {
    }

    public createRules(fromRoundHorPoules: HorizontalPoule[], qualifyGroup: QualifyGroup) {
            
        const childRound = qualifyGroup.getChildRound();
        const childPlaces = this.getRoundPlaces(childRound, qualifyGroup.getTarget());
        
        let previous: VerticalSingleQualifyRule | undefined;
        fromRoundHorPoules.forEach((fromHorPoule: HorizontalPoule) => {            
            const fromHorPoulePlaces = fromHorPoule.getPlaces().slice();
            while ( fromHorPoulePlaces.length > 0 && childPlaces.length > 0) {
                // SingleRule
                if( fromHorPoulePlaces.length <= childPlaces.length) {                
                    const placeMappings = this.fromPlacesToMappings(fromHorPoulePlaces, childPlaces);
                    previous = new VerticalSingleQualifyRule(fromHorPoule, qualifyGroup, placeMappings, previous );                    
                } else {
                    const toPlaces = [];

                    let fromHorPoulePlace = fromHorPoulePlaces.shift();                    
                    while( fromHorPoulePlace !== undefined && childPlaces.length > 0 ) {                        
                        toPlaces.push(childPlaces.shift());
                        // placeMappings.push(new QualifyPlaceMapping(fromHorPoulePlace, childPlace));
                        fromHorPoulePlace = fromHorPoulePlaces.shift();                    
                    }
   
                    new VerticalMultipleQualifyRule(fromHorPoule, qualifyGroup, toPlaces );
                }
            }   
        });
        // console.log(qualifyGroup.getFirstVerticalRule());
    }

    protected getRoundPlaces(round: Round, target: QualifyTarget): Place[] {
        let roundPlacesByPoule = this.getRoundPlacesByPoule(round, target);
        let roundPlaces: Place[] = [];
        roundPlacesByPoule.forEach((pouleRoundPlaces: Place[] ) => {
            if (target === QualifyTarget.Losers) {
                roundPlaces = roundPlaces.concat(pouleRoundPlaces)
            } else {
                roundPlaces = roundPlaces.concat(pouleRoundPlaces)
            }
        });
        return roundPlaces;
    }

    protected getRoundPlacesByPoule(round: Round, target: QualifyTarget): (Place[])[] {
        if ( target === QualifyTarget.Losers) {
            return round.getPoules().slice().reverse().map((poule: Poule): Place[] => {
                return poule.getPlaces().slice().reverse();
            })    
        }
        return round.getPoules().map((poule: Poule): Place[] => {
            return poule.getPlaces().slice();
        })
    }

    protected fromPlacesToMappings(fromHorPoulePlaces: Place[], childPlaces: Place[]): QualifyPlaceMapping[] {
        const mapping = [];
        let fromHorPoulePlace = fromHorPoulePlaces.shift();
        while (fromHorPoulePlace !== undefined) {
            
            const childPoulePlace = childPlaces.shift();
            if( childPoulePlace === undefined ) {
                throw new Error('childPoulePlace should not be undefined');
            }
            mapping.push( new QualifyPlaceMapping(fromHorPoulePlace, childPoulePlace ) );
            fromHorPoulePlace = fromHorPoulePlaces.shift();
        }
        return mapping;
    }      
}