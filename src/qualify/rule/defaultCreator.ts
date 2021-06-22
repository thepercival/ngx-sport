import { Place } from "../../place";
import { Poule } from "../../poule";
import { HorizontalPoule } from "../../poule/horizontal";
import { QualifyGroup, Round } from "../group";
import { QualifyOriginCalculator } from "../originCalculator";
import { QualifyPlaceMapping } from "../placeMapping";
import { QualifyTarget } from "../target";
import { MultipleQualifyRule } from "./multiple";
import { SingleQualifyRule } from "./single";

/**
 * indeling obv 
 * 1 minst vaak tegen iemand die je al eerder bent tegen gekomen
 * 2 beste tegen slechtste
 */
export class DefaultQualifyRuleCreator {

    private qualifyOriginCalculator = new QualifyOriginCalculator();

    createRules(fromHorPoules: HorizontalPoule[], qualifyGroup: QualifyGroup) {
        const childRoundPlaces = this.getChildRoundPlacesLikeSnake(qualifyGroup);
        let fromHorPoule: HorizontalPoule | undefined = fromHorPoules.shift();
        let previousRule: SingleQualifyRule | undefined;
        while (fromHorPoule !== undefined && childRoundPlaces.length > 0) {
            const toPlaces = childRoundPlaces.splice(0, fromHorPoule.getPlaces().length);
            if (fromHorPoule.getPlaces().length > toPlaces.length) {
                new MultipleQualifyRule(fromHorPoule, qualifyGroup, toPlaces);
            } else {
                const placeMappings = this.createPlaceMappings(fromHorPoule, toPlaces);
                previousRule = new SingleQualifyRule(fromHorPoule, qualifyGroup, placeMappings, previousRule);
            }
            fromHorPoule = fromHorPoules.shift();
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
        const mappings: QualifyPlaceMapping[] = [];
        const fromHorPoulePlaces = fromHorPoule.getPlaces().slice();
        let childRoundPlace: Place | undefined;
        while (childRoundPlace = childRoundPlaces.shift()) {
            const fromHorPoulePlace = this.getBestPick(childRoundPlace, fromHorPoulePlaces, childRoundPlaces);
            const idx = fromHorPoulePlaces.indexOf(fromHorPoulePlace);
            if (idx < 0) {
                continue;
            }
            fromHorPoulePlaces.splice(idx, 1);
            mappings.push(new QualifyPlaceMapping(fromHorPoulePlace, childRoundPlace));
        }
        return mappings;
    }

    protected getBestPick(childRoundPlace: Place, fromHorPoulePlaces: Place[], otherChildRoundPlaces: Place[]): Place {
        const fromHorPoulePlacesWithFewestPouleOrigins = this.getFewestOverlappingPouleOrigins(childRoundPlace.getPoule(), fromHorPoulePlaces);
        if (fromHorPoulePlacesWithFewestPouleOrigins.length === 1) {
            return fromHorPoulePlacesWithFewestPouleOrigins[0];
        }
        const otherChildRoundPoules = this.getOtherChildRoundPoules(otherChildRoundPlaces);
        const fromHorPoulePlacesWithMostOtherPouleOrigins = this.getMostOtherOverlappingPouleOrigins(
            otherChildRoundPoules, fromHorPoulePlacesWithFewestPouleOrigins)
        return fromHorPoulePlacesWithMostOtherPouleOrigins[0];
    }

    protected getFewestOverlappingPouleOrigins(toPoule: Poule, fromHorPoulePlaces: Place[]): Place[] {
        let bestFromPlaces: Place[] = [];
        let fewestOverlappingOrigins: number | undefined;
        fromHorPoulePlaces.forEach((fromHorPoulePlace: Place) => {
            const nrOfOverlappingOrigins = this.getPossibleOverlapses(fromHorPoulePlace.getPoule(), [toPoule]);
            if (fewestOverlappingOrigins === undefined || nrOfOverlappingOrigins < fewestOverlappingOrigins) {
                bestFromPlaces = [fromHorPoulePlace];
                fewestOverlappingOrigins = nrOfOverlappingOrigins;
            } else if (fewestOverlappingOrigins === nrOfOverlappingOrigins) {
                bestFromPlaces.push(fromHorPoulePlace);
            }
        });
        return bestFromPlaces;
    }

    protected getOtherChildRoundPoules(otherChildRoundPlaces: Place[]): Poule[] {
        const poules: Poule[] = [];
        otherChildRoundPlaces.forEach((place: Place) => {
            if (poules.indexOf(place.getPoule()) < 0) {
                poules.push(place.getPoule());
            }
        });
        return poules;
    }

    protected getMostOtherOverlappingPouleOrigins(otherChildRoundPoules: Poule[], fromHorPoulePlaces: Place[]): Place[] {
        let bestFromPlaces: Place[] = [];
        let mostOverlappingOrigins: number | undefined;
        fromHorPoulePlaces.forEach((fromHorPoulePlace: Place) => {
            const nrOfOverlappingOrigins = this.getPossibleOverlapses(fromHorPoulePlace.getPoule(), otherChildRoundPoules);
            if (mostOverlappingOrigins === undefined || nrOfOverlappingOrigins > mostOverlappingOrigins) {
                bestFromPlaces = [fromHorPoulePlace];
                mostOverlappingOrigins = nrOfOverlappingOrigins;
            } else if (mostOverlappingOrigins === nrOfOverlappingOrigins) {
                bestFromPlaces.push(fromHorPoulePlace);
            }
        });
        return bestFromPlaces;
    }

    protected getPossibleOverlapses(fromPoule: Poule, toPoules: Poule[]): number {
        let nrOfOverlapses = 0;
        toPoules.forEach((toPoule: Poule) => {
            nrOfOverlapses += this.qualifyOriginCalculator.getPossibleOverlapses(fromPoule, toPoule);
        });
        return nrOfOverlapses;
    }
}