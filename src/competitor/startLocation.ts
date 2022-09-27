export class StartLocation {
    public constructor(
        protected categoryNr: number, protected pouleNr: number, protected placeNr: number
    ) { }

    public getCategoryNr(): number {
        return this.categoryNr;
    }

    public getPouleNr(): number {
        return this.pouleNr;
    }

    public getPlaceNr(): number {
        return this.placeNr;
    }

    public getStartId(): string {
        return this.getCategoryNr() + '.' + this.getPouleNr() + '.' + this.getPlaceNr();
    }

    public equals(startLocation: StartLocation): boolean {
        return startLocation.getCategoryNr() === this.getCategoryNr()
            && startLocation.getPouleNr() === this.getPouleNr()
            && startLocation.getPlaceNr() === this.getPlaceNr();
    }
}
