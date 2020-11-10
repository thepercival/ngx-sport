export class PouleStructure extends Array<number> {

    public getNrOfPoules(): number {
        return this.length;
    }

    public getNrOfPlaces(): number {
        return this.reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    public getBiggestPoule(): number {
        return this[0];
    }

    public getSmallestPoule(): number {
        return this[this.length - 1];
    }

    public selfRefereeAvailable(nrOfGamePlaces: number): boolean {
        return this.selfRefereeSamePouleAvailable(nrOfGamePlaces)
            || this.selfRefereeOtherPoulesAvailable();
    }

    public selfRefereeOtherPoulesAvailable(): boolean {
        return this.getNrOfPoules() > 1;
    }

    public selfRefereeSamePouleAvailable(nrOfGamePlaces: number): boolean {
        return this.getSmallestPoule() > nrOfGamePlaces;
    }

    /*public getNrOfPoulesByNrOfPlaces(): array {
        nrOfPoulesByNrOfPlaces = [];
        foreach(this.toArray() as pouleNrOfPlaces) {
            if (array_key_exists(pouleNrOfPlaces, nrOfPoulesByNrOfPlaces) === false) {
                nrOfPoulesByNrOfPlaces[pouleNrOfPlaces] = 0;
            }
            nrOfPoulesByNrOfPlaces[pouleNrOfPlaces]++;
        }
        return nrOfPoulesByNrOfPlaces;
    }*/
}