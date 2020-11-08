import { Formation } from '../formation';

export class FormationLine {
    protected formation: Formation;

    constructor(formation: Formation, protected number: number, protected nrOfPlayers: number) {
        this.setFormation(formation);
    }

    protected setFormation(formation: Formation) {
        formation.getLines().push(this);
        this.formation = formation;
    }

    public getNrOfPlayers(): number {
        return this.nrOfPlayers;
    }

    public getNumber(): number {
        return this.number;
    }

}