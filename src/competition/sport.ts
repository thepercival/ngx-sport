import { Competition } from '../competition';
import { Sport } from '../sport';
import { Field } from '../field';
import { Identifiable } from '../identifiable';
import { Single } from '../sport/variant/single';
import { AllInOneGame } from '../sport/variant/allInOneGame';
import { AgainstH2h } from '../sport/variant/against/h2h';
import { AgainstGpp } from '../sport/variant/against/gamesPerPlace';
import { PointsCalculation } from '../ranking/pointsCalculation';

export class CompetitionSport extends Identifiable {
    protected fields: Field[] = [];
    protected hasNextDefaultScoreConfigX: boolean = true;

    constructor(
        protected sport: Sport, 
        protected competition: Competition,
        protected defaultPointsCalculation: PointsCalculation,
        protected defaultWinPoints: number,
        protected defaultDrawPoints: number,
        protected defaultWinPointsExt: number,
        protected defaultDrawPointsExt: number,
        protected defaultLosePointsExt: number,
        protected variant: Single | AgainstH2h | AgainstGpp | AllInOneGame) {
        super();
        this.competition.getSports().push(this);
    }

    getSport(): Sport {
        return this.sport;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getDefaultPointsCalculation(): PointsCalculation {
        return this.defaultPointsCalculation;
    }

    getDefaultWinPoints(): number {
        return this.defaultWinPoints;
    }

    getDefaultDrawPoints(): number {
        return this.defaultDrawPoints;
    }

    getDefaultWinPointsExt(): number {
        return this.defaultWinPointsExt;
    }

    getDefaultDrawPointsExt(): number {
        return this.defaultDrawPointsExt;
    }

    getDefaultLosePointsExt(): number {
        return this.defaultLosePointsExt;
    }


    hasNextDefaultScoreConfig(): boolean {
        return this.hasNextDefaultScoreConfigX;
    }

    getFields(): Field[] {
        return this.fields;
    }

    getField(priority: number): Field | undefined {
        return this.fields.find(fieldIt => priority === fieldIt.getPriority());
    }

    getVariant(): Single | AgainstH2h | AgainstGpp | AllInOneGame {
        return this.variant;
    }
}
