import { Injectable } from '@angular/core';
import { CompetitionSportMapper } from '../../competition/sport/mapper';
import { ScoreConfig } from '../config';
import { Round } from '../../qualify/group';
import { JsonScoreConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class ScoreConfigMapper {

    constructor(private competitionSportMapper: CompetitionSportMapper) {
    }

    toObject(json: JsonScoreConfig, round: Round, config?: ScoreConfig, previous?: ScoreConfig): ScoreConfig {
        if (config === undefined) {
            const competitionSport = this.competitionSportMapper.toObject(json.competitionSport, round.getCompetition());
            config = new ScoreConfig(competitionSport, round, previous);
        }
        config.setId(json.id);
        config.setDirection(json.direction);
        config.setMaximum(json.maximum);
        config.setEnabled(json.enabled);
        if (json.next !== undefined) {
            this.toObject(json.next, round, config.getNext(), config);
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


