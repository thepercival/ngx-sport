import { AnsiColor } from "../../../public-api";
import { Grid } from "../grid";
import { GridAlign } from "./align";
import { Coordinate } from "./coordinate";

export class GridDrawer {


    // use Color;

    public constructor(protected grid: Grid) {
    }

    public drawToRight(coordinate: Coordinate, value: string, color?: AnsiColor | undefined): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setToRight(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.decrementX();
    }

    public drawLineToRight(coordinate: Coordinate, length: number, color?: AnsiColor | undefined, value: string = '-'): Coordinate {
        return this.drawToRight(coordinate, this.initString(length, value), color);
    }

    public drawToLeft(coordinate: Coordinate, value: string, color?: AnsiColor | undefined): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setToLeft(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.incrementX();
    }


    public drawLineToLeft(coordinate: Coordinate, length: number, color?: AnsiColor | undefined, value: string = '-'): Coordinate {
        return this.drawToLeft(coordinate, this.initString(length, value), color);
    }

    public drawLineVertToOrigin(coordinate: Coordinate, length: number, color?: AnsiColor | undefined, value: string = '|'): Coordinate {
        return this.drawVertStringToOrigin(coordinate, this.initString(length, value), color);
    }

    public drawVertArrayToOrigin(
        coordinate: Coordinate, values: string[],
        color: AnsiColor | undefined, horizontalDirection: HorizontalDirection): Coordinate {

        values.forEach((horizontalValue: string) => {
            if (horizontalDirection == HorizontalDirection.Left) {
                this.drawToLeft(coordinate, horizontalValue, color);
            } else {
                this.drawToRight(coordinate, horizontalValue, color);
            }

            coordinate = coordinate.decrementY();
        });
        return coordinate;


    }

    public drawVertStringToOrigin(coordinate: Coordinate, value: string, color?: AnsiColor | undefined): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setVertToOrigin(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.incrementY();
    }

    public drawLineVertAwayFromOrigin(coordinate: Coordinate, length: number, color?: AnsiColor | undefined, value: string = '|'): Coordinate {
       return this.drawVertStringAwayFromOrigin(coordinate, this.initString(length, value), color);
       
    }

    public drawVertArrayAwayFromOrigin(
        coordinate: Coordinate, values: string[], 
        color: AnsiColor | undefined, horizontalDirection: HorizontalDirection): Coordinate {
        
        values.forEach((horizontalValue: string) => {
            if (horizontalDirection == HorizontalDirection.Left ) {
                this.drawToLeft(coordinate, horizontalValue, color);
            } else {
                this.drawToRight(coordinate, horizontalValue, color);
            }

            coordinate = coordinate.incrementY();
        });
        return coordinate;
        
    
    }

    public drawVertStringAwayFromOrigin(
        coordinate: Coordinate, value: string, 
        color?: AnsiColor | undefined): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setVertAwayFromOrigin(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.decrementY();
    }

    public drawCellToRight(coordinate: Coordinate, text: string, width: number, align: GridAlign, color?: AnsiColor | undefined): Coordinate {
        const char = ' ';
        if (text.length > width) {
            text = text.substr(0, width);
        }
        if (align === GridAlign.Center) {
            align = GridAlign.Left;
            while (text.length < width) {
                text = this.addToString(text, char, align);
                align = align === GridAlign.Left ? GridAlign.Right : GridAlign.Left;
            }
        } else {
            while (text.length < width) {
                text = this.addToString(text, char, align);
            }
        }
        return this.drawToRight(coordinate, text, color);
    }

    drawRectangle(origin: Coordinate, size: Coordinate, color?: AnsiColor | undefined): void {
        const topRight = this.drawLineToRight(origin, size.getX(), color);
        const bottomRight = this.drawLineVertAwayFromOrigin(topRight, size.getY(), color);
        const bottomLeft = this.drawLineToLeft(bottomRight.decrementX(), size.getX() - 1, color);
        this.drawLineVertToOrigin(bottomLeft, size.getY(), color);
    }


    public initString(length: number, char: string = ' '): string {
        let retVal = '';
        while (length--) {
            retVal += char;
        }
        return retVal;
    }

    public addToString(text: string, char: string, side: number): string {
        if (side === GridAlign.Right) {
            return text + char;
        }
        return char + text;
    }

    public equalsGrid(grid: Grid): boolean {

        return this.grid.equalsGrid(grid);
    }
}

export enum HorizontalDirection {
    Left = 1,
    Right = 2
}