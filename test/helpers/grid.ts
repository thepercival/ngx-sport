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

    public setColor(coordinate: Coordinate, color: number | string): void {
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

    public output(console: Console): void {
        let lineNr = 1;
        this.grid.forEach((line: GridCell[]) => {
            let lineAsString = '';
            line.forEach((cell: GridCell) => {
                lineAsString += cell.toString();
            });
            console.log(lineAsString);
        });
    }

    private getLineNr(lineNr: number): string {
        const maxStringLength = ('' + this.grid.length).length;
        let lineNrAsString = '' + lineNr;
        while (lineNrAsString.length < maxStringLength) {
            lineNrAsString = ' ' + lineNrAsString;
        }
        return lineNrAsString + ' ';
    }
}