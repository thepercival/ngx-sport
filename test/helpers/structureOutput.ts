import { Structure } from "../../public-api";
import { Grid } from "./grid";
import { GridCell } from "./grid/cell";
import { Coordinate } from "./grid/coordinate";
import { GridDrawer } from "./grid/drawer";
import { DrawHelper } from "./structureOutput/drawerHelper";
import { RangeCalculator } from "./structureOutput/rangeCalculator";

export class StructureOutput {

    protected rangeCalculator: RangeCalculator;

    public constructor() {
        this.rangeCalculator = new RangeCalculator();
    }


    public createGrid(structure: Structure): Grid {
        const width = this.rangeCalculator.getStructureWidth(structure);
        const height = this.rangeCalculator.getStructureHeight(structure);
        const grid = new Grid(height, width);
        // console.log('grid: (' + width +',' + height +')');

        // fill
        const drawer = new GridDrawer(grid);
        const coordinate = new Coordinate(0, 0);
        const drawHelper = new DrawHelper(drawer);
        drawHelper.drawStructure(structure, coordinate);

        return grid;

        //        batchColor = this->useColors() ? (batchNr % 10) : -1;
        //        retVal = 'batch ' . (batchNr < 10 ? ' ' : '') . batchNr;
        //        return this->outputColor(batchColor, retVal);

    }

    public toConsole(structure: Structure, console: Console): void {
        const grid = this.createGrid(structure);

        grid.getLines().forEach((line: GridCell[]) => {
            let lineAsString = '';
            line.forEach((cell: GridCell) => {
                lineAsString += cell.toString();
            });
            console.log(lineAsString);
        });
    }
}
