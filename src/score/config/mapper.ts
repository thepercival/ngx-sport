import { Injectable } from '@angular/core';
import { CompetitionSportMapper } from 'src/competition/sport/mapper';
import { ScoreConfig } from '../config';
import { Round } from 'src/qualify/group';
import { CompetitionSport } from 'src/competition/sport';
import { JsonScoreConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class ScoreConfigMapper {

    constructor(private competitionSportMapper: CompetitionSportMapper) {
    }

    toObject(json: JsonScoreConfig, competitionSport: CompetitionSport, round: Round,
        config?: ScoreConfig, previous?: ScoreConfig): ScoreConfig {
        if (config === undefined) {
            config = new ScoreConfig(competitionSport, round, previous);
        }
        config.setId(json.id);
        config.setDirection(json.direction);
        config.setMaximum(json.maximum);
        config.setEnabled(json.enabled);
        if (json.next !== undefined) {
            this.toObject(json.next, competitionSport, round, config.getNext(), config);
        }
        return config;
    }

    toJson(scoreConfig: ScoreConfig): JsonScoreConfig {
        const nextScoreConfig = scoreConfig.getNext();
        return {
            id: scoreConfig.getId(),
            competitionSport: this.competitionSportMapper.toJson(scoreConfig.getCompetitionSport()),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            enabled: scoreConfig.getEnabled(),
            next: nextScoreConfig ? this.toJson(nextScoreConfig) : undefined
        };
    }
}


