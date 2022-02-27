import { AgainstGpp } from "./against/gamesPerPlace";
import { AgainstH2h } from "./against/h2h";
import { AllInOneGame } from "./allInOneGame";
import { Single } from "./single";

export class SportWithFields {
    constructor(protected variant: Single | AgainstH2h | AgainstGpp | AllInOneGame, protected nrOfFields: number) {
        ;
    }

    getNrOfFields(): number {
        return this.nrOfFields;
    }

    getVariant(): Single | AgainstH2h | AgainstGpp | AllInOneGame {
        return this.variant;
    }
}