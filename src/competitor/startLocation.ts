export class StartLocation {
    public constructor(
        protected categoryNr: number, protected pouleNr: number, protected placeNr: number
    ) { }

    getCategoryNr(): number {
        return this.categoryNr;
    }

    getPouleNr(): number {
        return this.pouleNr;
    }

    getPlaceNr(): number {
        return this.placeNr;
    }

    getStartId(): string {
        return this.getCategoryNr() + '.' + this.getPouleNr() + '.' + this.getPlaceNr();
    }
}
