import { AgainstGpp } from "../sport/variant/against/gamesPerPlace";
import { AgainstH2h } from "../sport/variant/against/h2h";
import { AllInOneGame } from "../sport/variant/allInOneGame";
import { Single } from "../sport/variant/single";

export class PouleStructure extends Array<number> {

    constructor(...nrOfPlaces: number[]) {
        super();
        for (let nrOfPlacesIt of nrOfPlaces) {
            this.push(nrOfPlacesIt);
        }
        this.sort((nrOfPlacesPouleA: number, nrOfPlacesPouleB: number): number => {
            return nrOfPlacesPouleA > nrOfPlacesPouleB ? -1 : 1;
        });
    }

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

    public isBalanced(): boolean {
        return this.getBiggestPoule() === this.getSmallestPoule();
    }

    public isSelfRefereeAvailable(sportVariants: (Single | AgainstH2h | AgainstGpp | AllInOneGame)[]): boolean {
        return this.isSelfRefereeSamePouleAvailable(sportVariants)
            || this.isSelfRefereeOtherPoulesAvailable();
    }

    public isSelfRefereeOtherPoulesAvailable(): boolean {
        return this.getNrOfPoules() > 1;
    }

    public isSelfRefereeSamePouleAvailable(sportVariants: (Single | AgainstH2h | AgainstGpp | AllInOneGame)[]): boolean {
        return sportVariants.every((sportVariant: Single | AgainstH2h | AgainstGpp | AllInOneGame) => {
            if (sportVariant instanceof AllInOneGame) {
                return false;
            }
            return sportVariant.getNrOfGamePlaces() < this.getSmallestPoule();
        });
    }
}