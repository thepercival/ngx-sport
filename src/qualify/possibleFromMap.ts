import { Poule } from "../poule";
import { QualifyGroup, Round } from "./group";
import { QualifyMappingByPlace } from "./mapping/byPlace";
import { QualifyMappingByRank } from "./mapping/byRank";


export class PossibleFromMap {

    protected map: FromPouleMap = {};
    protected empty = true;

    public constructor(protected leafRound: Round, initMap: boolean = false) {
        leafRound.getPoules().forEach((childPoule: Poule) => this.map[childPoule.getNumber()] = []);
        if (initMap) {
            this.initMap(leafRound);
        }
    }

    protected initMap(round: Round): void {
        const qualifyGroup = round.getParentQualifyGroup();
        if (qualifyGroup === undefined) {
            return;
        }
        this.addGroup(qualifyGroup);
    }

    protected addGroup(group: QualifyGroup): void {
        
        let singleRule = group.getFirstSingleRule();
        while (singleRule !== undefined) {
            singleRule.getMappings().forEach((mapping: QualifyMappingByPlace | QualifyMappingByRank) => this.addMapping(mapping));
            singleRule = singleRule.getNext();
        }
        const multipRule = group.getMultipleRule();
        if (multipRule === undefined) {
            return;
        }
        this.empty = false;
        const parentPoules = group.getParentRound().getPoules();
        group.getChildRound().getPoules().forEach((childPoule: Poule) => {
            this.map[childPoule.getNumber()] = parentPoules;
        });
        
    }

    public createParent(): PossibleFromMap | undefined {
        const parentQualifyGroup = this.leafRound.getParentQualifyGroup();
        if (parentQualifyGroup === undefined) {
            return undefined;
        }
        const grandParentQualifyGroup = parentQualifyGroup.getParentRound().getParentQualifyGroup();
        if (grandParentQualifyGroup === undefined) {
            return undefined;
        }
        return new PossibleFromMap(parentQualifyGroup.getParentRound(), true);
    }

    public addMapping(placeMapping: QualifyMappingByPlace | QualifyMappingByRank): void {
        this.empty = false;
        const childPouleNumber = placeMapping.getToPlace().getPoule().getNumber();
        this.map[childPouleNumber].push(placeMapping.getFromPoule());
    }

    public getFromPoules(childPoule: Poule): Poule[] {
        return this.map[childPoule.getNumber()];
    }

    public isEmpty(): boolean {
        return this.empty;
    }
}

interface FromPouleMap {
    [key: number]: Poule[];
}