import { Game } from '../game';
import { CompetitionSport } from '../competition/sport';
import { QualifyAgainstConfig } from '../qualify/againstConfig';
import { Place } from '../place';
import { Poule } from '../poule';
import { State } from '../state';
import { AgainstGamePlace } from './place/against';
import { AgainstScore } from '../score/against';
import { AgainstSide } from '../against/side';

export class AgainstGame extends Game {
    protected scores: AgainstScore[] = [];

    constructor(poule: Poule, batchNr: number, competitionSport: CompetitionSport) {
        super(poule, batchNr, competitionSport);
        poule.getAgainstGames().push(this);
        this.state = State.Created;
    }

    isParticipating(place: Place, side?: AgainstSide): boolean {
        return this.getSidePlaces(side).find(gamePlace => gamePlace.getPlace() === place) !== undefined;
    }

    getAgainstPlaces(): AgainstGamePlace[] {
        return <AgainstGamePlace[]>this.places;
    }

    getSidePlaces(side?: AgainstSide): AgainstGamePlace[] {
        if (side === AgainstSide.Home) {
            return this.getHomePlaces();
        } else if (side === AgainstSide.Away) {
            return this.getAwayPlaces();
        }
        return this.getAgainstPlaces();
    }

    getHomePlaces(): AgainstGamePlace[] {
        return this.getAgainstPlaces().filter((place: AgainstGamePlace) => place.getSide() === AgainstSide.Home);
    }

    getAwayPlaces(): AgainstGamePlace[] {
        return this.getAgainstPlaces().filter((place: AgainstGamePlace) => place.getSide() === AgainstSide.Away);
    }

    getScores(): AgainstScore[] {
        return this.scores;
    }

    getSide(place: Place): AgainstSide | undefined {
        if (this.isParticipating(place, AgainstSide.Home)) {
            return AgainstSide.Home;
        } else if (this.isParticipating(place, AgainstSide.Away)) {
            return AgainstSide.Away;
        }
        return undefined;
    }

    getQualifyAgainstConfig(): QualifyAgainstConfig | undefined {
        return this.getRound().getValidQualifyAgainstConfig(this.competitionSport);
    }

    getFinalPhase(): number {
        if (this.scores.length === 0) {
            return 0;
        }
        return this.scores[this.scores.length - 1].getPhase();
    }
}
