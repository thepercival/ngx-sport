import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { RoundNumber } from '../../round/number';
import { Sport } from '../../sport';
import { Structure } from '../../structure';
import { SportConfig } from '../config';
import { SportCustom } from '../custom';
import { SportScoreConfigService } from '../scoreconfig/service';

@Injectable()
export class SportConfigService {

    constructor(private scoreConfigService: SportScoreConfigService) {
    }

    createDefault(sport: Sport, competition: Competition, structure?: Structure): SportConfig {
        const config = new SportConfig(sport, competition);
        config.setWinPoints(this.getDefaultWinPoints(sport));
        config.setDrawPoints(this.getDefaultDrawPoints(sport));
        config.setWinPointsExt(this.getDefaultWinPointsExt(sport));
        config.setDrawPointsExt(this.getDefaultDrawPointsExt(sport));
        config.setPointsCalculation(SportConfig.POINTS_CALC_GAMEPOINTS);
        config.setNrOfGamePlaces(SportConfig.DEFAULT_NROFGAMEPLACES);
        if (structure) {
            this.addToStructure(config, structure);
        }
        return config;
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

    copy(sourceConfig: SportConfig, competition: Competition): SportConfig {
        const newConfig = new SportConfig(sourceConfig.getSport(), competition);
        newConfig.setWinPoints(sourceConfig.getWinPoints());
        newConfig.setDrawPoints(sourceConfig.getDrawPoints());
        newConfig.setWinPointsExt(sourceConfig.getWinPointsExt());
        newConfig.setDrawPointsExt(sourceConfig.getDrawPointsExt());
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
        const fields = competition.getFields();
        fields.filter(field => field.getSport() === sport).forEach(field => {
            competition.removeField(field);
        });
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
            || sportConfigA.getPointsCalculation() !== sportConfigB.getPointsCalculation()
            || sportConfigA.getNrOfGamePlaces() !== sportConfigB.getNrOfGamePlaces()
        );
    }
}
