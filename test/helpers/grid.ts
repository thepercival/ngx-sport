import { AnsiColor } from "../../public-api";
import { GridCell } from "./grid/cell";
import { Coordinate } from "./grid/coordinate";

export class Grid {

    private grid: GridCell[][] = [];

    public constructor(protected height: number, protected width: number) {
        for (let i = 0; i < this.height; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.width; j++) {
                this.grid[i][j] = new GridCell(' ');
            }
        }
    }

    public getLines(): GridCell[][] {
        return this.grid;
    }

    public setColor(coordinate: Coordinate, color: AnsiColor | undefined): void {
        this.grid[coordinate.getY()][coordinate.getX()].setColor(color);
    }

    public setToLeft(coordinate: Coordinate, char: string): Coordinate {
        this.grid[coordinate.getY()][coordinate.getX()].setValue(char);
        return coordinate.decrementX();
    }

    public setToRight(coordinate: Coordinate, char: string): Coordinate {
        this.grid[coordinate.getY()][coordinate.getX()].setValue(char);
        return coordinate.incrementX();
    }

    public setVertAwayFromOrigin(coordinate: Coordinate, char: string,): Coordinate {
        this.grid[coordinate.getY()][coordinate.getX()].setValue(char);
        return coordinate.incrementY();
    }

    public setVertToOrigin(coordinate: Coordinate, char: string): Coordinate {
        this.grid[coordinate.getY()][coordinate.getX()].setValue(char);
        return coordinate.decrementY();
    }

    private getLineNr(lineNr: number): string {
        const maxStringLength = ('' + this.grid.length).length;
        let lineNrAsString = '' + lineNr;
        while (lineNrAsString.length < maxStringLength) {
            lineNrAsString = ' ' + lineNrAsString;
        }
        return lineNrAsString + ' ';
    }

    public equalsGrid(grid: Grid): boolean {

        for (let lineNr = 1; lineNr <= this.height; lineNr++) {
            if (this.getLineNr(lineNr) !== grid.getLineNr(lineNr)) {
                return false;
            }
        }
        return true;
    }
}