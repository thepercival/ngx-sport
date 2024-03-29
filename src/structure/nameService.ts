import { GamePlace } from "../game/place";
import { Place } from "../place";
import { Poule } from "../poule";
import { Round } from "../qualify/group";
import { RoundRankService } from "../qualify/roundRankCalculator";
import { QualifyTarget } from "../qualify/target";
import { PouleStructureNumberMap } from "./pouleStructureNumberMap";
import { RoundNumber } from "../round/number";
import { StartLocationMap } from "../competitor/startLocation/map";
import { StartLocation } from "../competitor/startLocation";
import { StructureCell } from "./cell";
import { HorizontalSingleQualifyRule } from "../qualify/rule/horizontal/single";
import { HorizontalMultipleQualifyRule } from "../qualify/rule/horizontal/multiple";
import { VerticalSingleQualifyRule } from "../qualify/rule/vertical/single";
import { VerticalMultipleQualifyRule } from "../qualify/rule/vertical/multiple";


export class StructureNameService {
    private roundRankService: RoundRankService;
    private pouleStructureNumberMap: PouleStructureNumberMap | undefined;
    private htmlOutput: boolean = true;

    constructor(private startLocationMap?: StartLocationMap) {
        this.roundRankService = new RoundRankService();
    }

    enableConsoleOutput(): void {
        this.htmlOutput = false;
    }

    getStartLocationMap(): StartLocationMap | undefined {
        return this.startLocationMap;
    }

    getQualifyTargetDescription(qualifyTarget: QualifyTarget, multiple: boolean = false): string {
        const descr = qualifyTarget === QualifyTarget.Winners ? 'winnaar' : (qualifyTarget === QualifyTarget.Losers ? 'verliezer' : '');
        return ((multiple && (descr !== '')) ? descr + 's' : descr);
    }

    getRoundNumberName(roundNumber: RoundNumber): string {
        const structureCellsSameName = this.getStructureCellsSameName(roundNumber);
        return structureCellsSameName !== undefined ? structureCellsSameName : this.getOrdinalOutput(roundNumber.getNumber()) + ' ronde';
    }

    /**
    *   als allemaal dezelfde naam dan geef die naam
    *   als verschillende namen geef dan xde ronde met tooltip van de namen
    */
    getStructureCellName(structureCell: StructureCell): string {
        const roundsSameName = this.getRoundsSameName(structureCell);
        return roundsSameName !== undefined ? roundsSameName : this.getOrdinalOutput(structureCell.getRoundNumber().getNumber()) + ' ronde';
    }

    getRoundName(round: Round, sameName: boolean = false): string {
        if (this.roundAndParentsNeedsRanking(round) || !this.childRoundsHaveEqualDepth(round)) {
            return this.getOrdinalOutput(round.getNumberAsValue()) + ' ronde';
        }

        const nrOfRoundsToGo = this.getMaxDepth(round);
        if (nrOfRoundsToGo >= 1) {
            return this.getHtmlFractalNumber(Math.pow(2, nrOfRoundsToGo)) + ' finale';
        }
        if (round.getNrOfPlaces() === 2 && sameName === false) {
            const rank = this.roundRankService.getRank(round) + 1;
            return this.getOrdinalOutput(rank) + ' / ' + this.getOrdinalOutput(rank + 1) + ' pl';
        }
        return 'finale';
    }

    getPouleName(poule: Poule, withPrefix: boolean): string {
        let pouleName = '';
        if (withPrefix === true) {
            pouleName = poule.needsRanking() ? 'poule ' : 'wed. ';
        }
        const pouleStructureNumber = this.getPouleStructureNumberMap(poule.getRound()).get(poule) - 1;
        const secondLetter = pouleStructureNumber % 26;
        if (pouleStructureNumber >= 26) {
            const firstLetter = (pouleStructureNumber - secondLetter) / 26;
            pouleName += this.getPouleLetter(firstLetter);
        }
        pouleName += this.getPouleLetter(secondLetter + 1);
        return pouleName;
    }

    protected getPouleLetter(structureNumber: number): string {
        return (String.fromCharCode('A'.charCodeAt(0) + structureNumber - 1));
    }

    getPlaceName(place: Place, p_competitorName?: boolean, longName?: boolean): string {
        let competitorName = p_competitorName && this.startLocationMap;
        const startLocation: StartLocation | undefined = place.getStartLocation();
        if (competitorName && this.startLocationMap && startLocation) {
            const competitor = this.startLocationMap.getCompetitor(startLocation);
            if (competitor !== undefined) {
                return competitor.getName();
            }
        }
        if (longName === true) {
            return 'nr. ' + place.getPlaceNr() + ' ' + this.getPouleName(place.getPoule(), true);
        }

        const name = this.getPouleName(place.getPoule(), false);
        return name + place.getPlaceNr();
    }

    getPlacesFromName(gamePlaces: GamePlace[], competitorName: boolean, longName?: boolean): string {
        return gamePlaces.map(gamePlace => this.getPlaceFromName(gamePlace.getPlace(), competitorName, longName)).join(' & ');
    }

    getPlaceFromName(place: Place, competitorName: boolean, longName: boolean = false): string {
        
        competitorName = competitorName ? (this.startLocationMap !== undefined) : false;
        const startLocation: StartLocation | undefined = place.getStartLocation();
        if (competitorName && this.startLocationMap && startLocation) {
            const particpant = this.startLocationMap.getCompetitor(startLocation);
            if (particpant !== undefined) {
                return particpant.getName();
            }
        }

        let fromQualifyRule: HorizontalSingleQualifyRule | HorizontalMultipleQualifyRule | VerticalSingleQualifyRule | VerticalMultipleQualifyRule | undefined;
        try {
            fromQualifyRule = place.getRound().getParentQualifyGroup()?.getRuleByToPlace(place);
        } catch (e) { }
        if (fromQualifyRule === undefined) {
            return this.getPlaceName(place, false, longName);
        } else if (fromQualifyRule instanceof HorizontalSingleQualifyRule) {            

            const mapping = fromQualifyRule.getMappingByToPlace(place);
            if (mapping === undefined) {
                throw Error('mapping not found');
            }
            const fromPlace = mapping.getFromPlace();
            return this.getPlaceFromNameHelper(fromPlace.getPlaceNr(), fromPlace.getPoule(), longName);
        } 
        const balanced = place.getRound().createPouleStructure().isBalanced();
        const absolute = !longName || fromQualifyRule.getQualifyTarget() === QualifyTarget.Winners || balanced;            
        return this.getRankedQualifyRuleName(fromQualifyRule, place, longName, absolute);        
    }

    protected getPlaceFromNameHelper(rank: number, poule: Poule, longName: boolean = false): string {
        const pouleName = this.getPouleName(poule, longName);

        let rankOrdinal = this.getOrdinalOutput(rank);
        if (!longName) {
            return this.getOrdinalOutput(rank) + pouleName;
        }
        if (!poule.needsRanking()) {
            rankOrdinal += ' pl.';
        }
        return rankOrdinal + ' ' + pouleName;
    }


    /*getPlaceNameFrom(fromPlace: Place, longName: boolean): string {
        const rank = fromPlace.getPlaceNr();

        const poule = fromPlace.getPoule();
        const pouleName = this.getPouleName(poule, longName);
        const ordinal = this.getOrdinalOutput(rank) + (!poule.needsRanking() ? ' pl.' : '');
        return longName ? ordinal + ' ' + pouleName : pouleName + rank;
    }*/



    public getQualifyRuleName(rule: HorizontalSingleQualifyRule | HorizontalMultipleQualifyRule | VerticalSingleQualifyRule | VerticalMultipleQualifyRule): string {

        const balanced = rule.getFromRound().createPouleStructure().isBalanced();
        const absolute = rule.getQualifyTarget() === QualifyTarget.Winners || balanced;

        const fromHorPoule = rule.getFromHorizontalPoule();
        const fromNumber = absolute ? fromHorPoule.getAbsoluteNumber() : fromHorPoule.getNumber();

        let name = this.getOrdinalOutput(fromNumber);
        if (rule.getQualifyTarget() === QualifyTarget.Losers && !absolute) {
            return name + ' pl. van onderen';
        }
        return name + ' plekken';
    }

    public getRankedQualifyRuleName(
        rule: HorizontalMultipleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule,
        toPlace: Place,
        longName: boolean,
        absolute: boolean
    ): string {
        const fromHorPoule = rule.getFromHorizontalPoule();      
        
        let fromRank;
        if (rule instanceof VerticalSingleQualifyRule) {
            const byRankMapping = rule.getMappingByToPlace(toPlace);
            if (byRankMapping === undefined) {
                throw Error('no mapping found');
            }            
            fromRank = byRankMapping.getFromRank();
            // console.log(fromRank);
        } else {
            fromRank = rule.getAbsoluteRankByToPlace(toPlace);
        }

        // CONVERSION FROM HorPoule TO RANK
        const fromRankContainer = absolute ? fromHorPoule.getAbsoluteNumber() : fromHorPoule.getNumber();

        const fromRankOrdinal = this.getOrdinalOutput(fromRank);
        if (!longName) {
            return fromRankOrdinal + '' + fromRankContainer;
        }

        const firstpart = fromRankOrdinal + ' van';

        let name = firstpart + ' ' + this.getOrdinalOutput(fromRankContainer);
        if (rule.getQualifyTarget() === QualifyTarget.Losers && !absolute) {
            name += ' pl. van onderen';
        } else {
            name += ' plekken';
        }
        return name;
    }

    protected childRoundsHaveEqualDepth(round: Round): boolean {
        if (round.getQualifyGroups().length === 1) {
            return true;
        }
        let depthAll: number;
        return round.getQualifyGroups().every(qualifyGroup => {
            const qualifyGroupMaxDepth = this.getMaxDepth(qualifyGroup.getChildRound());
            if (depthAll === undefined) {
                depthAll = qualifyGroupMaxDepth;
            }
            return depthAll === qualifyGroupMaxDepth;
        });
    }

    private getStructureCellsSameName(roundNumber: RoundNumber): string | undefined {
        let structureCellAll: string | undefined;
        roundNumber.getStructureCells().every((structureCell: StructureCell) => {
            const name = this.getStructureCellName(structureCell);
            if (structureCellAll === undefined) {
                structureCellAll = name;
            }
            if (structureCellAll !== name) {
                structureCellAll = undefined;
                return false;
            }
            return true;
        });
        return structureCellAll;
    }

    private getRoundsSameName(structureCell: StructureCell): string | undefined {
        let roundNameAll: string | undefined;
        structureCell.getRounds().every((round) => {
            const roundName = this.getRoundName(round, true);
            if (roundNameAll === undefined) {
                roundNameAll = roundName;
            }
            if (roundNameAll !== roundName) {
                roundNameAll = undefined;
                return false;
            }
            return true;
        });
        return roundNameAll;
    }

    private roundAndParentsNeedsRanking(round: Round): boolean {

        if (!round.needsRanking()) {
            return false;
        }
        const parent = round.getParent();
        if (parent) {
            return this.roundAndParentsNeedsRanking(parent);
        }
        return true;
    }

    private getHtmlFractalNumber(number: number): string {
        if (number === 2 || number === 4) {
            return '&frac1' + number + ';';
        }
        return '<span style="font-size: 80%"><sup>1</sup>&frasl;<sub>' + number + '</sub></span>';
    }

    private getOrdinalOutput(number: number): string {
        return number + (this.htmlOutput ? '<sup>e</sup>' : 'e');
    }

    private getMaxDepth(round: Round): number {
        let biggestMaxDepth = 0;
        round.getChildren().forEach(child => {
            const maxDepth = 1 + this.getMaxDepth(child);
            if (maxDepth > biggestMaxDepth) {
                biggestMaxDepth = maxDepth;
            }
        });
        return biggestMaxDepth;
    }

    private getPouleStructureNumberMap(round: Round): PouleStructureNumberMap {
        if (this.pouleStructureNumberMap === undefined) {
            this.pouleStructureNumberMap = new PouleStructureNumberMap(round.getNumber().getFirst(), this.roundRankService);
        }
        return this.pouleStructureNumberMap;
    }
}