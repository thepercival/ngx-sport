import { Game } from 'src/game';
import { CompetitionSport } from 'src/competition/sport';
import { QualifyAgainstConfig } from 'src/qualify/againstConfig';
import { Place } from 'src/place';
import { Poule } from 'src/poule';
import { State } from 'src/state';
import { GamePlace } from './place';
import { AgainstGamePlace } from './place/against';
import { AgainstScore } from 'src/score/against';

export class AgainstGame extends Game {
    static readonly Result_Win = 1;
    static readonly Result_Draw = 2;
    static readonly Result_Lost = 3;
    static readonly Home = true;
    static readonly Away = false;

    protected scores: AgainstScore[] = [];

    constructor(poule: Poule, batchNr: number, competitionSport: CompetitionSport) {
        super(poule, batchNr, competitionSport);
        poule.getGames().push(this);
        this.state = State.Created;
    }

    isParticipating(place: Place, homeaway?: boolean): boolean {
        return this.getHomeAwayPlaces(homeaway).find(gamePlace => gamePlace.getPlace() === place) !== undefined;
    }

    getAgainstPlaces(): AgainstGamePlace[] {
        return <AgainstGamePlace[]>this.places;
    }

    getHomeAwayPlaces(homeaway?: boolean): AgainstGamePlace[] {
        if (homeaway !== undefined) {
            return this.getAgainstPlaces().filter((place: AgainstGamePlace) => place.getHomeaway() === homeaway);
        }
        return this.getAgainstPlaces();
    }

    getScores(): AgainstScore[] {
        return this.scores;
    }

    getHomeAway(place: Place): boolean | undefined {
        if (this.isParticipating(place, AgainstGame.Home)) {
            return AgainstGame.Home;
        } else if (this.isParticipating(place, AgainstGame.Away)) {
            return AgainstGame.Away;
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
