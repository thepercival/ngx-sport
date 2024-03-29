import { Category, NameService, Poule, QualifyGroup, Round, RoundNumber, Structure, StructureCell } from "../../../public-api";
import { QualifyTarget } from "../../../src/qualify/target";

export class RangeCalculator {
    // protected const MARGIN = 1;
    public static readonly PADDING = 1;
    public static readonly BORDER = 1;
    protected static readonly PLACEWIDTH = 3;
    protected static readonly HORPLACEWIDTH = 3;
    public static readonly QUALIFYGROUPHEIGHT = 3;

    protected nameService: NameService;

    public constructor() {
        this.nameService = new NameService();
    }

    public getStructureHeight(structure: Structure): number {
        let maxHeight = 0;
        structure.getCategories().forEach((category: Category) => {
            const height = this.getCategoryHeight(category);
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        return maxHeight;
    }

    public getCategoryHeight(category: Category): number {
        const structureCell = category.getFirstStructureCell();
        let height = RangeCalculator.BORDER;
        height += this.getRoundNumberHeight(structureCell.getRoundNumber());

        let nextStructureCell = structureCell.getNext();
        while (nextStructureCell !== undefined) {
            height += this.getQualifyGroupsHeight();
            height += this.getRoundNumberHeight(nextStructureCell.getRoundNumber());
            nextStructureCell = nextStructureCell.getNext();
        }
        return height + RangeCalculator.BORDER;
    }

    public getQualifyGroupsHeight(): number {
        return 3;
    }

    public getStructureWidth(structure: Structure): number {
        let width = 0;
        structure.getCategories().forEach(( category: Category) => {
            width += this.getCategoryWidth(category) + RangeCalculator.PADDING;
        });
        return width - RangeCalculator.PADDING;
    }

    public getCategoryTitle(category: Category): string {
        return category.getName();
    }

    public getCategoryWidth(category: Category): number {
        let structureCell = category.getFirstStructureCell();
        let maxWidth = this.getStructureCellWidth(structureCell);
        let nextStructureCell = structureCell.getNext();
        while (nextStructureCell !== undefined) {
            const currentWidth = this.getStructureCellWidth(nextStructureCell);
            if (currentWidth > maxWidth) {
                maxWidth = currentWidth;
            }
            nextStructureCell = nextStructureCell.getNext();
        }

        const titleWidth = this.getCategoryTitle(category).length;
        if( titleWidth > maxWidth ) {
            maxWidth = titleWidth;
        }
        return RangeCalculator.BORDER + maxWidth + RangeCalculator.BORDER;
    }

    public getStructureCellWidth(structureCell: StructureCell): number {
        let width = 0;
        structureCell.getRounds().forEach((round: Round) => {
            width += this.getRoundWidth(round) + RangeCalculator.PADDING;
        });
        return width - RangeCalculator.PADDING;
    }


    public getRoundNumberHeight(roundNumber: RoundNumber): number {
        const biggestPoule = roundNumber.createPouleStructure().getBiggestPoule();

        const pouleNameHeight = 1;
        const seperatorHeight = 1;
        const height = RangeCalculator.BORDER + pouleNameHeight + seperatorHeight + biggestPoule + RangeCalculator.BORDER;

        return height;
    }

    // public getRoundNumberWidth(roundNumber: RoundNumber): number {
    //     const rounds = roundNumber.getRounds(undefined);
    //     let width = 0;
    //     rounds.forEach((round: Round) => {
    //         width += this.getRoundWidth(round) + RangeCalculator.PADDING;
    //     });
    //     return width - RangeCalculator.PADDING;
    // }

    public getRoundWidth(round: Round): number {
        const widthAllPoules = RangeCalculator.BORDER + RangeCalculator.PADDING
            + this.getAllPoulesWidth(round)
            + RangeCalculator.PADDING + RangeCalculator.BORDER;

        const widthQualifyGroups = this.getQualifyGroupsWidth(round);
        return widthAllPoules > widthQualifyGroups ? widthAllPoules : widthQualifyGroups;
    }

    public getQualifyGroupsWidth(parentRound: Round): number {
        const qualifyGroups = parentRound.getQualifyGroups();
        let widthQualifyGroups = 0;
        qualifyGroups.forEach((qualifyGroup: QualifyGroup) => {
            widthQualifyGroups += this.getRoundWidth(qualifyGroup.getChildRound()) + RangeCalculator.PADDING;
        });
        return widthQualifyGroups - RangeCalculator.PADDING;
    }

    public getAllPoulesWidth(round: Round): number {
        let width = 0;
        round.getPoules().forEach((poule: Poule) => {
            width += this.getPouleWidth(poule) + RangeCalculator.PADDING;
        });
        const horPouleWidth = this.getHorPoulesWidth(round);
        if (horPouleWidth === 0) {
            return width;
        }
        return width + RangeCalculator.PADDING + horPouleWidth;
    }

    public getPouleWidth(poule: Poule): number {
        return RangeCalculator.PLACEWIDTH;
    }

    public getHorPoulesWidth(round: Round): number {
        if (round.getHorizontalPoules(QualifyTarget.Winners).length === 0
            && round.getHorizontalPoules(QualifyTarget.Losers).length === 0) {
            return 0;
        }
        return RangeCalculator.BORDER + RangeCalculator.PADDING + RangeCalculator.HORPLACEWIDTH;
    }
}