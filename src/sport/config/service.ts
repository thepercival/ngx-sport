import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { Structure } from '../../structure';
import { SportConfig } from '../config';
import { SportCustom } from '../custom';
import { SportScoreConfigService } from '../scoreconfig/service';
import { SportConfigMapper } from './mapper';
import { JsonSportConfig } from './json';
import { SportMapper } from '../mapper';
import { JsonField } from '../../field/json';

@Injectable({
    providedIn: 'root'
})
export class SportConfigService {
    private scoreConfigService: SportScoreConfigService;
    private sportConfigMapper: SportConfigMapper;
    private sportMapper: SportMapper;

    constructor(
        scoreConfigService: SportScoreConfigService,
        sportConfigMapper: SportConfigMapper,
        sportMapper: SportMapper,
    ) {
        this.scoreConfigService = scoreConfigService;
        this.sportConfigMapper = sportConfigMapper;
        this.sportMapper = sportMapper;
    }

    createDefault(sport: Sport, competition: Competition, structure?: Structure): SportConfig {
        const config = this.sportConfigMapper.toObject(this.createDefaultJson(sport, []), competition);
        if (structure) {
            this.addToStructure(config, structure);
        }
        return config;
    }

    createDefaultJson(sport: Sport, fields: JsonField[]): JsonSportConfig {
        return {
            sport: this.sportMapper.toJson(sport),
            winPoints: this.getDefaultWinPoints(sport),
            drawPoints: this.getDefaultDrawPoints(sport),
            winPointsExt: this.getDefaultWinPointsExt(sport),
            drawPointsExt: this.getDefaultDrawPointsExt(sport),
            losePointsExt: this.getDefaultLosePointsExt(sport),
            pointsCalculation: SportConfig.POINTS_CALC_GAMEPOINTS,
            nrOfGamePlaces: SportConfig.DEFAULT_NROFGAMEPLACES,
            fields: fields
        };
    }

    protected getDefaultWinPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 3 : 1;
    }

    protected getDefaultDrawPoints(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 1 : 0.5;
    }

    protected getDefaultWinPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 2 : 1;
    }

    protected getDefaultDrawPointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.Chess ? 1 : 0.5;
    }

    protected getDefaultLosePointsExt(sport: Sport): number {
        return sport.getCustomId() !== SportCustom.IceHockey ? 0 : 1;
    }

    copy(sourceConfig: SportConfig, competition: Competition): SportConfig {
        const newConfig = new SportConfig(sourceConfig.getSport(), competition);
        newConfig.setWinPoints(sourceConfig.getWinPoints());
        newConfig.setDrawPoints(sourceConfig.getDrawPoints());
        newConfig.setWinPointsExt(sourceConfig.getWinPointsExt());
        newConfig.setDrawPointsExt(sourceConfig.getDrawPointsExt());
        newConfig.setLosePointsExt(sourceConfig.getLosePointsExt());
        newConfig.setPointsCalculation(sourceConfig.getPointsCalculation());
        newConfig.setNrOfGamePlaces(sourceConfig.getNrOfGamePlaces());
        return newConfig;
    }

    addToStructure(config: SportConfig, structure: Structure) {
        let roundNumber: RoundNumber = structure.getFirstRoundNumber();
        while (roundNumber !== undefined) {
            if (roundNumber.hasPrevious() === false || roundNumber.getSportScoreConfigs().length > 0) {
                this.scoreConfigService.createDefault(config.getSport(), roundNumber);
            }
            roundNumber = roundNumber.getNext();
        }
    }

    remove(config: SportConfig, structure: Structure) {
        const competition = config.getCompetition();
        const sportConfigs = competition.getSportConfigs();
        const index = sportConfigs.indexOf(config);
        if (index > -1) {
            sportConfigs.splice(index, 1);
        }
        const sport = config.getSport();

        let roundNumber = structure.getFirstRoundNumber();
        while (roundNumber) {
            const scoreConfigs = roundNumber.getSportScoreConfigs();
            const scoreConfig = scoreConfigs.find(scoreConfigIt => scoreConfigIt.getSport() === sport);
            const idxScore = scoreConfigs.indexOf(scoreConfig);
            if (idxScore >= 0) {
                scoreConfigs.splice(idxScore, 1);
            }
            roundNumber = roundNumber.getNext();
        }
    }

    isDefault(sportConfig: SportConfig): boolean {
        const sport = sportConfig.getSport();
        return (sportConfig.getWinPoints() !== this.getDefaultWinPoints(sport)
            || sportConfig.getDrawPoints() !== this.getDefaultDrawPoints(sport)
            || sportConfig.getWinPointsExt() !== this.getDefaultWinPointsExt(sport)
            || sportConfig.getDrawPointsExt() !== this.getDefaultDrawPointsExt(sport)
            || sportConfig.getLosePointsExt() !== this.getDefaultLosePointsExt(sport)
            || sportConfig.getPointsCalculation() !== SportConfig.POINTS_CALC_GAMEPOINTS
            || sportConfig.getNrOfGamePlaces() !== SportConfig.DEFAULT_NROFGAMEPLACES
        );
    }

    areEqual(sportConfigA: SportConfig, sportConfigB: SportConfig): boolean {
        return (sportConfigA.getSport() !== sportConfigB.getSport()
            || sportConfigA.getWinPoints() !== sportConfigB.getWinPoints()
            || sportConfigA.getDrawPoints() !== sportConfigB.getDrawPoints()
            || sportConfigA.getWinPointsExt() !== sportConfigB.getWinPointsExt()
            || sportConfigA.getDrawPointsExt() !== sportConfigB.getDrawPointsExt()
            || sportConfigA.getLosePointsExt() !== sportConfigB.getLosePointsExt()
            || sportConfigA.getPointsCalculation() !== sportConfigB.getPointsCalculation()
            || sportConfigA.getNrOfGamePlaces() !== sportConfigB.getNrOfGamePlaces()
        );
    }

    public getMaxNrOfGamePlaces(sportConfigs: SportConfig[], teamup: boolean, selfReferee: boolean): number {
        let maxNrOfGamePlaces = 0;

        for (let sportConfig of sportConfigs) {
            const nrOfGamePlaces = this.getNrOfGamePlaces(sportConfig.getNrOfGamePlaces(), teamup, selfReferee);
            if (nrOfGamePlaces > maxNrOfGamePlaces) {
                maxNrOfGamePlaces = nrOfGamePlaces;
            }
        }
        return maxNrOfGamePlaces;
    }

    protected getNrOfGamePlaces(nrOfGamePlaces: number, teamup: boolean, selfReferee: boolean): number {
        if (teamup) {
            nrOfGamePlaces *= 2;
        }
        if (selfReferee) {
            nrOfGamePlaces++;
        }
        return nrOfGamePlaces;
    }
}
