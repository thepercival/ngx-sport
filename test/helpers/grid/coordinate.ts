export class Coordinate {
    public constructor(protected x: number, protected y: number) {
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public addX(x: number): Coordinate {
        return new Coordinate(this.getX() + x, this.getY());
    }

    public addY(y: number): Coordinate {
        return new Coordinate(this.getX(), this.getY() + y);
    }

    public add(x: number, y: number): Coordinate {
        return new Coordinate(this.getX() + x, this.getY() + y);
    }

    public incrementX(): Coordinate {
        return new Coordinate(this.getX() + 1, this.getY());
    }

    public incrementY(): Coordinate {
        return new Coordinate(this.getX(), this.getY() + 1);
    }

    public decrementX(): Coordinate {
        return new Coordinate(this.getX() - 1, this.getY());
    }

    public decrementY(): Coordinate {
        return new Coordinate(this.getX(), this.getY() - 1);
    }
}