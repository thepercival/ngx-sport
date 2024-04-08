import { Injectable } from '@angular/core';
import { ScoreConfig } from '../config';
import { Round } from '../../qualify/group';
import { JsonScoreConfig } from './json';

@Injectable({
    providedIn: 'root'
})
export class ScoreConfigMapper {

    constructor() {
    }

    toObject(json: JsonScoreConfig, round: Round, config?: ScoreConfig, previous?: ScoreConfig): ScoreConfig {
        if (config === undefined) {
            const competitionSport = round.getCompetition().getSportById(json.competitionSportId);
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
            competitionSportId: scoreConfig.getCompetitionSport().getId(),
            direction: scoreConfig.getDirection(),
            maximum: scoreConfig.getMaximum(),
            enabled: scoreConfig.getEnabled(),
            next: nextScoreConfig ? this.toJson(nextScoreConfig) : undefined,
            isFirst: scoreConfig.isFirst()
        };
    }
}


