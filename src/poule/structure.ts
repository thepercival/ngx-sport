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