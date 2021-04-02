import { Place } from "../place";
import { Poule } from "../poule";
import { QualifyRuleSingle } from "./rule/single";

/**
 * kunnen aangeven uit welke poules een bepaalde plek afkomstig is 
 */
export class QualifyOriginCalculator {

    getPossibleOverlapses(poule1: Poule, poule2: Poule): number {
        const possibleOriginsMap = new OriginMap();
        this.addPossibleOrigin(poule1, possibleOriginsMap);
        this.fillPossibleOriginMap(poule1, possibleOriginsMap);

        const possibleOrigins = this.getPossibleOrigins(poule2);
        possibleOrigins.unshift(poule2);
        return possibleOrigins.filter((originPoule: Poule): boolean => {
            return possibleOriginsMap.has(originPoule.getStructureLocation());
        }).length;
    }

    getPossibleOrigins(poule: Poule): Poule[] {
        const previousOrigins = this.getPossiblePreviousPoules(poule);
        if (previousOrigins.length === 0) {
            return [];
        }
        let origins: Poule[] = [];
        previousOrigins.forEach((previousOrigin: Poule) => {
            this.addPossibleOrigin(previousOrigin, origins);
            origins = origins.concat(this.getPossibleOrigins(previousOrigin));
        });
        return origins;
    }

    protected fillPossibleOriginMap(poule: Poule, originMap: OriginMap) {
        const previousOrigins = this.getPossiblePreviousPoules(poule);
        if (previousOrigins.length === 0) {
            return;
        }
        previousOrigins.forEach((previousOrigin: Poule) => {
            this.addPossibleOrigin(previousOrigin, originMap);
            this.fillPossibleOriginMap(previousOrigin, originMap);
        });
    }

    protected addPossibleOrigin(poule: Poule, origins: Poule[] | OriginMap) {
        if (origins instanceof OriginMap) {
            origins.set(poule.getStructureLocation(), poule);
        } else {
            if (origins.indexOf(poule) < 0) {
                origins.push(poule);
            }
        }
    }

    protected getPossiblePreviousPoules(poule: Poule): Poule[] {
        const parentQualifyGroup = poule.getRound().getParentQualifyGroup();
        if (parentQualifyGroup !== undefined && parentQualifyGroup.getMultipleRule() !== undefined) {
            return parentQualifyGroup.getParentRound().getPoules();
        }
        let possiblePreviousPoules: Poule[] = [];
        poule.getPlaces().forEach((place: Place) => {
            possiblePreviousPoules = possiblePreviousPoules.concat(this.getPlacePossiblePreviousPoules(place));
        });
        return possiblePreviousPoules;
    }

    protected getPlacePossiblePreviousPoules(place: Place): Poule[] {
        const parentQualifyGroup = place.getRound().getParentQualifyGroup();
        if (parentQualifyGroup === undefined) {
            return [];
        }
        try {
            const rule = parentQualifyGroup.getRule(place);
            if (rule instanceof QualifyRuleSingle) {
                return [rule.getFromPlace(place).getPoule()];
            }
            return parentQualifyGroup.getParentRound().getPoules();
        } catch (e) {
            return [];
        }
    }
}

class OriginMap extends Map<string, Poule> { }