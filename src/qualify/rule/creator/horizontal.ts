import { Place } from "../../../place";
import { Poule } from "../../../poule";
import { HorizontalPoule } from "../../../poule/horizontal";
import { FromPoulePicker } from "../../fromPoulePicker";
import { QualifyGroup, Round } from "../../group";
import { QualifyMappingByPlace } from "../../mapping/byPlace";
import { PossibleFromMap } from "../../possibleFromMap";
import { HorizontalMultipleQualifyRule } from "../horizontal/multiple";
import { HorizontalSingleQualifyRule } from "../horizontal/single";

/**
 * indeling obv 
 * 1 minst vaak tegen iemand die je al eerder bent tegen gekomen
 * 2 beste tegen slechtste
 */
export class HorizontalQualifyRuleCreator {

    private possibleFromMap: PossibleFromMap;

    constructor(leafRound: Round) {
        this.possibleFromMap = new PossibleFromMap(leafRound);
    }

    public createRules(
        fromRoundHorPoules: HorizontalPoule[],
        qualifyGroup: QualifyGroup) {

            
        // const childRoundPlaces = this.getChildRoundPlacesLikeSnake(qualifyGroup);
        // let fromHorPoule: HorizontalPoule | undefined = fromRoundHorPoules.shift();
        // let previousRule: HorizontalSingleQualifyRule | undefined;
        // while (fromHorPoule !== undefined && childRoundPlaces.length >= fromHorPoule.getPlaces().length) {
        //     const toPlaces = childRoundPlaces.splice(0, fromHorPoule.getPlaces().length);
        //     const placeMappings = this.createPlaceMappings(fromHorPoule, toPlaces);
        //     previousRule = new HorizontalSingleQualifyRule(fromHorPoule, qualifyGroup, placeMappings, previousRule);
        //     fromHorPoule = fromRoundHorPoules.shift();
        // }
        // if (fromHorPoule !== undefined && childRoundPlaces.length > 0 && childRoundPlaces !== undefined) {
        //     new HorizontalMultipleQualifyRule(fromHorPoule, qualifyGroup, childRoundPlaces);
        // }   
        
        const childRound = qualifyGroup.getChildRound();
        let nrOfChildRoundPlaces = childRound.getNrOfPlaces();
        const fromHorPoules: HorizontalPoule[] = [];
        while (nrOfChildRoundPlaces > 0) {
            
            const fromRoundHorPoule = fromRoundHorPoules.shift();
            if (fromRoundHorPoule === undefined) {
                throw new Error('fromRoundHorPoule should not be undefined');
            }
            fromHorPoules.push(fromRoundHorPoule);
            nrOfChildRoundPlaces -= fromRoundHorPoule.getPlaces().length;
            
        }
        this.createRulesFromHorPoules(fromHorPoules, qualifyGroup);
    }

    protected createRulesFromHorPoules(fromHorPoules: HorizontalPoule[], qualifyGroup: QualifyGroup) {
        const childRoundPlaces = this.getChildRoundPlacesLikeSnake(qualifyGroup);
        let fromHorPoule: HorizontalPoule | undefined = fromHorPoules.shift();
        let previousRule: HorizontalSingleQualifyRule | undefined;
        while (fromHorPoule !== undefined && childRoundPlaces.length >= fromHorPoule.getPlaces().length) {
            const toPlaces = childRoundPlaces.splice(0, fromHorPoule.getPlaces().length);
            const placeMappings = this.createByPlaceMappings(fromHorPoule, toPlaces);
            previousRule = new HorizontalSingleQualifyRule(fromHorPoule, qualifyGroup, placeMappings, previousRule);
            fromHorPoule = fromHorPoules.shift();
        }
        if (fromHorPoule !== undefined && childRoundPlaces.length > 0 ) {
            new HorizontalMultipleQualifyRule(fromHorPoule, qualifyGroup, childRoundPlaces);
        }

    }

    protected getChildRoundPlacesLikeSnake(qualifyGroup: QualifyGroup): Place[] {
        const horPoules = qualifyGroup.getChildRound().getHorizontalPoules(qualifyGroup.getTarget());
        const places: Place[] = [];
        let reverse = false;
        horPoules.forEach((horPoule: HorizontalPoule) => {
            const horPoulePlaces = horPoule.getPlaces().slice();
            let horPoulePlace: Place | undefined = reverse ? horPoulePlaces.pop() : horPoulePlaces.shift();
            while (horPoulePlace !== undefined) {
                places.push(horPoulePlace);
                horPoulePlace = reverse ? horPoulePlaces.pop() : horPoulePlaces.shift();
            }
            reverse = !reverse;
        })
        return places;
    }

    createByPlaceMappings(fromHorPoule: HorizontalPoule, childRoundPlaces: Place[]): QualifyMappingByPlace[] {
        const picker = new FromPoulePicker(this.possibleFromMap);
        const mappings: QualifyMappingByPlace[] = [];
        const fromHorPoulePlaces = fromHorPoule.getPlaces().slice();
        let childRoundPlace: Place | undefined;
        while (childRoundPlace = childRoundPlaces.shift()) {
            const bestFromPoule = picker.getBestFromPoule(
                childRoundPlace.getPoule(),
                fromHorPoulePlaces.map((place: Place) => place.getPoule()),
                childRoundPlaces.map((place: Place) => place.getPoule()));

            const bestFromPlace = this.removeBestHorizontalPlace(fromHorPoulePlaces, bestFromPoule);
            const placeMapping = new QualifyMappingByPlace(bestFromPlace, childRoundPlace);
            mappings.push(placeMapping);
            this.possibleFromMap.addMappingToMap(placeMapping);
        }
        return mappings;
    }

    protected removeBestHorizontalPlace(fromHorPoulePlaces: Place[], bestFromPoule: Poule): Place {
        const bestPouleNr = bestFromPoule.getNumber();
        const fromPlaces = fromHorPoulePlaces.filter((place: Place) => place.getPouleNr() === bestPouleNr);
        const bestFromPlace = fromPlaces[0];
        if (bestFromPlace === undefined) {
            throw new Error('fromPlace should be found');
        }
        const idx = fromHorPoulePlaces.indexOf(bestFromPlace);
        if (idx < 0) {
            throw new Error('fromPlace should be found');
        }
        fromHorPoulePlaces.splice(idx, 1);
        return bestFromPlace;
    }
}