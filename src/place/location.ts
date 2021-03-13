export class PlaceLocation {
    public constructor(
        protected pouleNr: number, protected placeNr: number
    ) { }

    getPouleNr(): number {
        return this.pouleNr;
    }

    getPlaceNr(): number {
        return this.placeNr;
    }

    getRoundLocationId(): string {
        return this.getPouleNr() + '.' + this.getPlaceNr();
    }
}
