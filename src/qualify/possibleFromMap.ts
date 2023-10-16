import { Poule } from "../poule";
import { QualifyDistribution } from "./distribution";
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
        
        if (group.getDistribution() === QualifyDistribution.Vertical ) {
            if (group.getFirstSingleRule() !== undefined || group.getMultipleRule() !== null) {
                this.addGroupToMap(group);
            }
        } else {

            let singleRule = group.getFirstSingleRule();
            while (singleRule !== undefined) {
                singleRule.getMappings().forEach((mapping: QualifyMappingByPlace | QualifyMappingByRank) => {
                    if (mapping instanceof QualifyMappingByPlace) {
                        this.addMappingToMap(mapping);
                    } 
                });
                singleRule = singleRule.getNext();
            }
            const multipRule = group.getMultipleRule();
            if (multipRule !== undefined) {
                this.addGroupToMap(group);
            }
        }
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

    public addMappingToMap(placeMapping: QualifyMappingByPlace): void {
        this.empty = false;
        const childPouleNumber = placeMapping.getToPlace().getPoule().getNumber();
        this.map[childPouleNumber].push(placeMapping.getFromPoule());
    }

    protected addGroupToMap(group: QualifyGroup): void {
        this.empty = false;
        const parentPoules = group.getParentRound().getPoules();
        group.getChildRound().getPoules().forEach((childPoule: Poule) => {
            this.map[childPoule.getNumber()] = parentPoules;
        });
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