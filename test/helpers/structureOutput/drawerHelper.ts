import { AnsiColor, Category, NameService, Place, Poule, QualifyGroup, Round, RoundNumber, Structure, StructureNameService } from "../../../public-api";
import { HorizontalPoule } from "../../../src/poule/horizontal";
import { MultipleQualifyRule } from "../../../src/qualify/rule/multiple";
import { SingleQualifyRule } from "../../../src/qualify/rule/single";
import { QualifyTarget } from "../../../src/qualify/target";
import { GridAlign } from "../grid/align";
import { Coordinate } from "../grid/coordinate";
import { GridDrawer } from "../grid/drawer";
import { RangeCalculator } from "./rangeCalculator";

export class DrawHelper {

    protected nameService: NameService;
    protected structureNameService: StructureNameService | undefined;
    protected rangeCalculator: RangeCalculator;

    public constructor(protected drawer: GridDrawer) {
        this.rangeCalculator = new RangeCalculator();
    }

    private getStructureNameService(): StructureNameService {
        const structureNameService = this.structureNameService;
        if (structureNameService === undefined) {
            throw new Error('structureNameService not set');
        }
        return structureNameService;

    }

    private initNameService(): void {
        this.structureNameService = new StructureNameService();
        this.getStructureNameService().enableConsoleOutput();

    }

    public drawStructure(structure: Structure, origin: Coordinate): Coordinate {
        this.initNameService();
        const roundNumberHeight = this.rangeCalculator.getRoundNumberHeight(structure.getFirstRoundNumber());
        let categoryCoord = this.getCategoryStartCoordinate(origin, structure.getFirstRoundNumber(), structure);
        structure.getCategories().forEach((category: Category) => {
            categoryCoord = this.drawCategory(category, categoryCoord, roundNumberHeight);
        });
        return categoryCoord;
    }

    protected getCategoryStartCoordinate(origin: Coordinate, roundNumber: RoundNumber, structure: Structure): Coordinate {
        const structureWidth = this.rangeCalculator.getStructureWidth(structure);
        const roundNumberWidth = this.rangeCalculator.getRoundNumberWidth(roundNumber);
        const delta = Math.floor((structureWidth - roundNumberWidth) / 2);
        return origin.addX(delta);
    }

    protected drawCategory(category: Category, origin: Coordinate, roundNumberHeight: number): Coordinate {
        const newCoord = this.drawRound(category.getRootRound(), origin, roundNumberHeight, category.getName());
        return newCoord.addX(RangeCalculator.PADDING);
    }

    protected drawRound(round: Round, origin: Coordinate, roundNumberHeight: number, catName?: string): Coordinate {
        this.drawRoundBorder(round, origin, roundNumberHeight);
        if (catName) {
            const width = this.rangeCalculator.getRoundWidth(round);
            catName = catName.substring(0, width - 4);
            const startCoord = origin.addX(Math.round((width - catName.length) / 2));
            this.drawer.drawToRight(startCoord, catName, AnsiColor.Cyan);
        }

        let pouleCoordinate = this.getPoulesStartCoordinate(origin, round);
        round.getPoules().forEach((poule: Poule) => {
            pouleCoordinate = this.drawPoule(poule, pouleCoordinate);
        });
        const qualifyRulesOrigin = this.drawHorPoules(round, pouleCoordinate.incrementX());
        if (qualifyRulesOrigin !== undefined) {
            this.drawQualifyRules(round, qualifyRulesOrigin);
        }

        const nextRoundNumber = round.getNumber().getNext();
        if (nextRoundNumber !== undefined) {
            const nextRoundNumberHeight = this.rangeCalculator.getRoundNumberHeight(nextRoundNumber);
            this.drawQualifyGroups(round, origin.addY(roundNumberHeight), nextRoundNumberHeight);
        }
        const roundWidth = this.rangeCalculator.getRoundWidth(round);
        return origin.addX(roundWidth + RangeCalculator.PADDING);
    }

    protected getPoulesStartCoordinate(origin: Coordinate, round: Round): Coordinate {
        const newCoordinate = origin.add(RangeCalculator.BORDER, RangeCalculator.BORDER);

        const innerRoundWidth = this.rangeCalculator.getRoundWidth(round) - (2 * RangeCalculator.BORDER);
        const poulesWidth = this.rangeCalculator.getAllPoulesWidth(round);
        const delta = Math.floor((innerRoundWidth - poulesWidth) / 2);
        return newCoordinate.addX(delta);
    }

    protected drawRoundBorder(round: Round, origin: Coordinate, roundNumberHeight: number): void {
        const width = this.rangeCalculator.getRoundWidth(round);
        // const topLeft = origin.addX(width - 1);
        this.drawer.drawRectangle(origin, new Coordinate(width, roundNumberHeight));
    }

    protected drawPoule(poule: Poule, origin: Coordinate): Coordinate {
        const pouleWidth = this.rangeCalculator.getPouleWidth(poule);
        const pouleName = this.structureNameService.getPouleName(poule, false);
        const nextPouleCoordrinate = this.drawer.drawCellToRight(origin, pouleName, pouleWidth, GridAlign.Center);

        this.drawer.drawLineToRight(origin.addY(1), pouleWidth);

        let placeCoordinate = origin.addY(2);
        poule.getPlaces().forEach((place: Place) => {
            const placeName = this.structureNameService.getPlaceFromName(place, false);
            this.drawer.drawCellToRight(placeCoordinate, placeName, pouleWidth, GridAlign.Center);
            placeCoordinate = placeCoordinate.incrementY();
        });

        return nextPouleCoordrinate.addX(RangeCalculator.PADDING + 1);
    }

    protected drawHorPoules(round: Round, borderOrigin: Coordinate): Coordinate | undefined {
        if (round.getHorizontalPoules(QualifyTarget.Winners).length === 0
            && round.getHorizontalPoules(QualifyTarget.Losers).length === 0) {
            return undefined;
        }

        this.drawer.drawLineVertAwayFromOrigin(borderOrigin, 2 + round.getHorizontalPoules(QualifyTarget.Winners).length);
        const origin = borderOrigin.addX(2);
        this.drawer.drawToRight(origin, QualifyTarget.Winners + ' ' + QualifyTarget.Losers);
        const seperator = origin.incrementY();
        this.drawer.drawToRight(seperator, '- -');

        // winners
        const horWinnersPoules = this.getHorPoulesAsString(round, QualifyTarget.Winners);
        const horPoulesOrigin = seperator.incrementY();
        this.drawer.drawVertAwayFromOrigin(horPoulesOrigin, horWinnersPoules);

        // losers
        const horLosersPoules = this.getHorPoulesAsString(round, QualifyTarget.Losers);
        const losersHorPoulesOrigin = horPoulesOrigin.add(
            RangeCalculator.PADDING + 1,
            round.getHorizontalPoules(QualifyTarget.Losers).length - 1);
        this.drawer.drawVertToOrigin(losersHorPoulesOrigin, horLosersPoules);
        return origin.incrementX();
    }

    protected getHorPoulesAsString(round: Round, qualifyTarget: QualifyTarget): string {
        let value = '';
        round.getHorizontalPoules(qualifyTarget).forEach((horPoule: HorizontalPoule) => {
            value += horPoule.getNumber();
        });
        return value;
    }

    protected drawHorPouleQualifyTarget(qualifyTarget: Poule, origin: Coordinate): void {
        this.drawer.drawToLeft(origin, QualifyTarget.Winners + ' ' + QualifyTarget.Losers);
        const seperator = origin.incrementY();
        this.drawer.drawToLeft(origin, '---');
    }

    protected drawQualifyRules(round: Round, origin: Coordinate): void {
        const seperator = origin.incrementY();
        let currentCoordinate = this.drawer.drawVertAwayFromOrigin(seperator, '-').incrementY();
        let winnersMultipleRuleCoordinate: Coordinate | undefined;
        // winners
        round.getQualifyGroups(QualifyTarget.Winners).forEach((qualifyGroup: QualifyGroup) => {
            const winnersColor = this.getQualifyGroupColor(qualifyGroup);
            let singleRule = qualifyGroup.getFirstSingleRule();
            while (singleRule !== undefined) {
                currentCoordinate = this.drawer.drawVertAwayFromOrigin(
                    currentCoordinate, this.getQualifyRuleString(singleRule), winnersColor
                ).incrementY();
                singleRule = singleRule.getNext();
            }
            const multipleRule = qualifyGroup.getMultipleRule();
            if (multipleRule !== undefined) {
                winnersMultipleRuleCoordinate = currentCoordinate;
                this.drawer.drawVertAwayFromOrigin(
                    currentCoordinate, this.getQualifyRuleString(multipleRule), winnersColor
                )
            }
        });
        currentCoordinate = seperator.addY(round.getFirstPoule().getPlaces().length);

        // losers
        round.getQualifyGroups(QualifyTarget.Losers).forEach((qualifyGroup: QualifyGroup) => {
            const losersColor = this.getQualifyGroupColor(qualifyGroup);
            let singleRule = qualifyGroup.getFirstSingleRule();
            while (singleRule !== undefined) {
                currentCoordinate = this.drawer.drawVertToOrigin(
                    currentCoordinate, this.getQualifyRuleString(singleRule), losersColor
                ).decrementY();
                singleRule = singleRule.getNext();
            }
            const multipleRule = qualifyGroup.getMultipleRule();
            if (multipleRule !== undefined) {
                let color = losersColor;
                if (winnersMultipleRuleCoordinate !== undefined
                    && winnersMultipleRuleCoordinate.getX() === currentCoordinate.getX()) {
                    color = AnsiColor.Magenta;
                }
                this.drawer.drawVertAwayFromOrigin(
                    currentCoordinate, this.getQualifyRuleString(multipleRule), color
                );
            }
        });
    }

    protected getQualifyRuleString(qualifyRule: MultipleQualifyRule | SingleQualifyRule): string {
        return (qualifyRule instanceof MultipleQualifyRule) ? 'M' : 'S';
    }

    protected drawQualifyGroups(round: Round, origin: Coordinate, nextRoundNumberHeight: number): void {
        let qualifyGroupCoordinate = this.getQualifyGroupsStartCoordinate(origin, round);
        round.getQualifyGroupsLosersReversed().forEach((qualifyGroup: QualifyGroup) => {
            qualifyGroupCoordinate = this.drawQualifyGroup(qualifyGroup, qualifyGroupCoordinate, nextRoundNumberHeight);
        });
    }

    protected getQualifyGroupsStartCoordinate(origin: Coordinate, parentRound: Round): Coordinate {
        const parentRoundWidth = this.rangeCalculator.getRoundWidth(parentRound);
        const qualifyGroupsWidth = this.rangeCalculator.getQualifyGroupsWidth(parentRound);
        const delta = Math.floor((parentRoundWidth - qualifyGroupsWidth) / 2);
        return origin.addX(delta);
    }

    protected drawQualifyGroup(qualifyGroup: QualifyGroup, origin: Coordinate, nextRoundNumberHeight: number): Coordinate {
        const roundWidth = this.rangeCalculator.getRoundWidth(qualifyGroup.getChildRound());

        let selfCoordinate = origin;
        this.drawer.drawCellToRight(selfCoordinate, '|', roundWidth, GridAlign.Center);
        selfCoordinate = selfCoordinate.incrementY();
        const qualifyGroupName = qualifyGroup.getTarget() + qualifyGroup.getNumber();
        const color = this.getQualifyGroupColor(qualifyGroup);
        this.drawer.drawCellToRight(selfCoordinate, qualifyGroupName, roundWidth, GridAlign.Center, color);
        this.drawer.drawCellToRight(selfCoordinate.incrementY(), '|', roundWidth, GridAlign.Center);

        const childRoundCoordinate = origin.addY(RangeCalculator.QUALIFYGROUPHEIGHT);
        this.drawRound(qualifyGroup.getChildRound(), childRoundCoordinate, nextRoundNumberHeight);

        return origin.addX(roundWidth + RangeCalculator.PADDING);
    }

    getQualifyGroupColor(qualifyGroup: QualifyGroup): AnsiColor {
        if (qualifyGroup.getTarget() === QualifyTarget.Winners) {
            switch (qualifyGroup.getNumber()) {
                case 1:
                    return AnsiColor.Green;
            }
            return AnsiColor.Blue;
        }
        switch (qualifyGroup.getNumber()) {
            case 1:
                return AnsiColor.Red;
        }
        return AnsiColor.Yellow;
    }
}