import { Grid } from "../grid";
import { GridAlign } from "./align";
import { GridColor } from "./color";
import { Coordinate } from "./coordinate";

export class GridDrawer {


    // use Color;

    public constructor(protected grid: Grid) {
    }

    public drawToRight(coordinate: Coordinate, value: string, color: GridColor | string = 0): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setToRight(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.decrementX();
    }

    public drawLineToRight(coordinate: Coordinate, length: number, value: string = '-', color: GridColor | string = 0): Coordinate {
        return this.drawToRight(coordinate, this.initString(length, value), color);
    }

    public drawToLeft(coordinate: Coordinate, value: string, color: GridColor | string = 0): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setToLeft(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.incrementX();
    }


    public drawLineToLeft(coordinate: Coordinate, length: number, value: string = '-', color: GridColor | string = 0): Coordinate {
        return this.drawToLeft(coordinate, this.initString(length, value), color);
    }

    public drawLineVertToOrigin(coordinate: Coordinate, length: number, value: string = '|', color: GridColor | string = 0): Coordinate {
        return this.drawVertToOrigin(coordinate, this.initString(length, value), color);
    }

    public drawVertToOrigin(coordinate: Coordinate, value: string, color: GridColor | string = 0): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setVertToOrigin(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.incrementY();
    }

    public drawLineVertAwayFromOrigin(coordinate: Coordinate, length: number, value: string = '|', color: GridColor | string = 0): Coordinate {
        return this.drawVertAwayFromOrigin(coordinate, this.initString(length, value), color);
    }

    public drawVertAwayFromOrigin(coordinate: Coordinate, value: string, color: number | string = 0): Coordinate {
        const valueAsArray: string[] = value.split('');
        let char: string | undefined = valueAsArray.shift();
        while (char !== undefined) {
            this.grid.setColor(coordinate, color);
            coordinate = this.grid.setVertAwayFromOrigin(coordinate, char);
            char = valueAsArray.shift();
        }
        return coordinate.decrementY();
    }

    public drawCellToRight(coordinate: Coordinate, text: string, width: number, align: GridAlign, color: GridColor | string = 0): Coordinate {
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

    drawRectangle(origin: Coordinate, size: Coordinate): void {
        const topRight = this.drawLineToRight(origin, size.getX());
        const bottomRight = this.drawLineVertAwayFromOrigin(topRight, size.getY());
        const bottomLeft = this.drawLineToLeft(bottomRight.decrementX(), size.getX() - 1);
        this.drawLineVertToOrigin(bottomLeft, size.getY());
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
}
