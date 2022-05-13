import { Game } from '../game';
import { CompetitionSport } from '../competition/sport';
import { AgainstQualifyConfig } from '../qualify/againstConfig';
import { Place } from '../place';
import { Poule } from '../poule';
import { AgainstGamePlace } from './place/against';
import { AgainstScore } from '../score/against';
import { AgainstSide } from '../against/side';
import { GameState } from './state';

export class AgainstGame extends Game {
    protected scores: AgainstScore[] = [];
    protected homeExtraPoints: number = 0;
    protected awayExtraPoints: number = 0;

    constructor(poule: Poule, batchNr: number, protected startDateTime: Date, competitionSport: CompetitionSport, protected gameRoundNumber: number) {
        super(poule, batchNr, startDateTime, competitionSport);
        poule.getAgainstGames().push(this);
        this.state = GameState.Created;
    }

    getGameRoundNumber(): number {
        return this.gameRoundNumber;
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

    getAgainstQualifyConfig(): AgainstQualifyConfig {
        return this.getRound().getValidAgainstQualifyConfig(this.competitionSport);
    }

    getFinalPhase(): number {
        if (this.scores.length === 0) {
            return 0;
        }
        return this.scores[this.scores.length - 1].getPhase();
    }

    public getHomeExtraPoints(): number {
        return this.homeExtraPoints;
    }

    public setHomeExtraPoints(homeExtraPoints: number): void {
        this.homeExtraPoints = homeExtraPoints;
    }

    public getAwayExtraPoints(): number {
        return this.awayExtraPoints;
    }

    public setAwayExtraPoints(awayExtraPoints: number): void {
        this.awayExtraPoints = awayExtraPoints;
    }
}
