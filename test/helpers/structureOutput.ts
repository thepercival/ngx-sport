import { Structure } from "../../public_api";
import { Grid } from "./grid";
import { Coordinate } from "./grid/coordinate";
import { GridDrawer } from "./grid/drawer";
import { DrawHelper } from "./structureOutput/drawerHelper";
import { RangeCalculator } from "./structureOutput/rangeCalculator";

export class StructureOutput {

    protected rangeCalculator: RangeCalculator;

    public constructor() {
        this.rangeCalculator = new RangeCalculator();
    }

    public output(structure: Structure, console: Console): void {
        const grid = this.getGrid(structure);
        const drawer = new GridDrawer(grid);
        const coordinate = new Coordinate(0, 0);
        const drawHelper = new DrawHelper(drawer);
        drawHelper.drawStructure(structure, coordinate);

        //        batchColor = this->useColors() ? (batchNr % 10) : -1;
        //        retVal = 'batch ' . (batchNr < 10 ? ' ' : '') . batchNr;
        //        return this->outputColor(batchColor, retVal);
        grid.output(console);
    }

    protected getGrid(structure: Structure): Grid {
        const width = this.rangeCalculator.getStructureWidth(structure);
        const height = this.rangeCalculator.getStructureHeight(structure);
        return new Grid(height, width);
    }
}
