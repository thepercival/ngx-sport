import { Competition } from '../competition';
import { Sport } from '../sport';
import { Field } from '../field';
import { Identifiable } from '../identifiable';

export class CompetitionSport extends Identifiable {
    protected fields: Field[] = [];

    constructor(protected sport: Sport, protected competition: Competition) {
        super();
        this.competition.getSports().push(this);
    }

    getSport(): Sport {
        return this.sport;
    }

    getCompetition(): Competition {
        return this.competition;
    }

    getFields(): Field[] {
        return this.fields;
    }

    getField(priority: number): Field | undefined {
        return this.fields.find(fieldIt => priority === fieldIt.getPriority());
    }
}
