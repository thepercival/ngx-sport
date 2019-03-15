export class PoulePlaceLocation {
    public constructor(
        private pouleNr: number, private placeNr: number
    ) { }

    getPouleNr(): number {
        return this.pouleNr;
    }

    getPlaceNr(): number {
        return this.placeNr;
    }
}