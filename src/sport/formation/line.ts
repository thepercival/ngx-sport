import { Formation } from '../formation';

export class FormationLine {
    constructor(protected formation: Formation, protected number: number, protected nrOfPlayers: number) {
        this.formation.getLines().push(this);
    }

    public getNrOfPlayers(): number {
        return this.nrOfPlayers;
    }

    public getNumber(): number {
        return this.number;
    }

}