import { AnsiColor, Category, HorizontalMultipleQualifyRule, HorizontalSingleQualifyRule, NameService, Place, Poule, QualifyDistribution, QualifyGroup, Round, RoundNumber, Structure, StructureNameService } from "../../../public-api";
import { HorizontalPoule } from "../../../src/poule/horizontal";
import { VerticalMultipleQualifyRule } from "../../../src/qualify/rule/vertical/multiple";
import { VerticalSingleQualifyRule } from "../../../src/qualify/rule/vertical/single";
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

    public drawStructure(structure: Structure, coordinate: Coordinate): void {
        this.initNameService();
        // const roundNumberHeight = this.rangeCalculator.getRoundNumberHeight(structure.getFirstRoundNumber());
        // console.log('start coordinate: (' + coordinate.getX() + ',' + coordinate.getY() + ')');
        structure.getCategories().forEach((category: Category) => {
            coordinate = this.drawCategory(category, coordinate).addX(RangeCalculator.PADDING);
            // console.log('new coordinate: (' + coordinate.getX() + ',' + coordinate.getY() + ')');
        });
    }

    protected drawCategory(category: Category, coordinate: Coordinate): Coordinate {

        const title = this.rangeCalculator.getCategoryTitle(category);
        const width = this.rangeCalculator.getCategoryWidth(category);
        const height = this.rangeCalculator.getCategoryHeight(category);
        // console.log('start: (' + coordinate.getX() + ',' + coordinate.getY() + '), width: ' + width + ', height: ' + height);
        this.drawer.drawRectangle(coordinate, new Coordinate(width, height), AnsiColor.Cyan);

        const middle = width / 2;
        const titleHalfLength = title.length / 2;
        const startCoord = coordinate.addX(middle - titleHalfLength);
        this.drawer.drawToRight(startCoord, title, AnsiColor.Cyan);

        this.drawRound(category.getRootRound(), coordinate.add(1, 1));
        return new Coordinate(coordinate.addX(width).getX(), coordinate.getY());
    }

    protected drawRound(round: Round, origin: Coordinate): void {
        const roundNumberHeight = this.rangeCalculator.getRoundNumberHeight(round.getStructureCell().getRoundNumber());
        this.drawRoundBorder(round, origin, roundNumberHeight);
        
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
            // const rRoundNumberHeight = this.rangeCalculator.getRoundNumberHeight(round.getNumber());
            this.drawQualifyGroups(round, origin.addY(roundNumberHeight));
        }
        // const roundWidth = this.rangeCalculator.getRoundWidth(round);
        // return origin.addX(roundWidth + RangeCalculator.PADDING);
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
                    && winnersMultipleRuleCoordinate.getX() === currentCoordinate.getX()
                    && winnersMultipleRuleCoordinate.getY() === currentCoordinate.getY()) {
                    color = AnsiColor.Magenta;
                }
                this.drawer.drawVertAwayFromOrigin(
                    currentCoordinate, this.getQualifyRuleString(multipleRule), color
                );
            }            
        });
    }

    protected getQualifyRuleString(qualifyRule: HorizontalMultipleQualifyRule | HorizontalSingleQualifyRule | VerticalMultipleQualifyRule | VerticalSingleQualifyRule): string {
        let descr = '';
        if( qualifyRule instanceof HorizontalMultipleQualifyRule || qualifyRule instanceof VerticalMultipleQualifyRule ) {
            descr = 'M';
        } else {
            descr = 'S';
        }
        return descr;
    }

    protected getDistribution(distribution: QualifyDistribution): string {
        return distribution == QualifyDistribution.HorizontalSnake ? ' (HS)' : ' (V)';
    }

    protected drawQualifyGroups(round: Round, origin: Coordinate): void {
        let qualifyGroupCoordinate = this.getQualifyGroupsStartCoordinate(origin, round);
        round.getQualifyGroupsLosersReversed().forEach((qualifyGroup: QualifyGroup) => {
            qualifyGroupCoordinate = this.drawQualifyGroup(qualifyGroup, qualifyGroupCoordinate);
        });
    }

    protected getQualifyGroupsStartCoordinate(origin: Coordinate, parentRound: Round): Coordinate {
        const parentRoundWidth = this.rangeCalculator.getRoundWidth(parentRound);
        const qualifyGroupsWidth = this.rangeCalculator.getQualifyGroupsWidth(parentRound);
        const delta = Math.floor((parentRoundWidth - qualifyGroupsWidth) / 2);
        return origin.addX(delta);
    }

    protected drawQualifyGroup(qualifyGroup: QualifyGroup, origin: Coordinate): Coordinate {
        const roundWidth = this.rangeCalculator.getRoundWidth(qualifyGroup.getChildRound());

        let selfCoordinate = origin;
        this.drawer.drawCellToRight(selfCoordinate, '|', roundWidth, GridAlign.Center);
        selfCoordinate = selfCoordinate.incrementY();
        const distributionDescr = this.getDistribution(qualifyGroup.getDistribution());
        const qualifyGroupName = qualifyGroup.getTarget() + qualifyGroup.getNumber() + distributionDescr;
        const color = this.getQualifyGroupColor(qualifyGroup);
        this.drawer.drawCellToRight(selfCoordinate, qualifyGroupName, roundWidth, GridAlign.Center, color);
        this.drawer.drawCellToRight(selfCoordinate.incrementY(), '|', roundWidth, GridAlign.Center);

        const childRoundCoordinate = origin.addY(RangeCalculator.QUALIFYGROUPHEIGHT);
        this.drawRound(qualifyGroup.getChildRound(), childRoundCoordinate);

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