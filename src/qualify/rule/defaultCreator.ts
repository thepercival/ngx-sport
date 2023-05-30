import { Place } from "../../place";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { FromPoulePicker } from "../fromPoulePicker";
import { QualifyGroup, Round } from "../group";
import { QualifyPlaceMapping } from "../placeMapping";
import { PossibleFromMap } from "../possibleFromMap";
import { MultipleQualifyRule } from "./multiple";
import { SingleQualifyRule } from "./single";

/**
 * indeling obv 
 * 1 minst vaak tegen iemand die je al eerder bent tegen gekomen
 * 2 beste tegen slechtste
 */
export class DefaultQualifyRuleCreator {

    private possibleFromMap: PossibleFromMap;

    constructor(leafRound: Round) {
        this.possibleFromMap = new PossibleFromMap(leafRound);
    }

    createRules(fromHorPoules: HorizontalPoule[], qualifyGroup: QualifyGroup) {
        const childRoundPlaces = this.getChildRoundPlacesLikeSnake(qualifyGroup);
        let fromHorPoule: HorizontalPoule | undefined = fromHorPoules.shift();
        let previousRule: SingleQualifyRule | undefined;
        while (fromHorPoule !== undefined && childRoundPlaces.length >= fromHorPoule.getPlaces().length) {
            const toPlaces = childRoundPlaces.splice(0, fromHorPoule.getPlaces().length);
            const placeMappings = this.createPlaceMappings(fromHorPoule, toPlaces);
            previousRule = new SingleQualifyRule(fromHorPoule, qualifyGroup, placeMappings, previousRule);
            fromHorPoule = fromHorPoules.shift();
        }
        if (fromHorPoule !== undefined && childRoundPlaces.length > 0 && childRoundPlaces !== undefined) {
            new MultipleQualifyRule(fromHorPoule, qualifyGroup, childRoundPlaces);
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

    createPlaceMappings(fromHorPoule: HorizontalPoule, childRoundPlaces: Place[]): QualifyPlaceMapping[] {
        const picker = new FromPoulePicker(this.possibleFromMap);
        const mappings: QualifyPlaceMapping[] = [];
        const fromHorPoulePlaces = fromHorPoule.getPlaces().slice();
        let childRoundPlace: Place | undefined;
        while (childRoundPlace = childRoundPlaces.shift()) {
            const bestFromPoule = picker.getBestFromPoule(
                childRoundPlace.getPoule(),
                fromHorPoulePlaces.map((place: Place) => place.getPoule()),
                childRoundPlaces.map((place: Place) => place.getPoule()));

            const bestFromPlace = this.removeBestHorizontalPlace(fromHorPoulePlaces, bestFromPoule);
            const placeMapping = new QualifyPlaceMapping(bestFromPlace, childRoundPlace);
            mappings.push(placeMapping);
            this.possibleFromMap.addPlaceMapping(placeMapping);
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