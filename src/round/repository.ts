import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { IPoule } from 'voetbaljs/src/poule/repository';

import { Competitionseason } from '../competitionseason';
import { CompetitionseasonRepository } from '../competitionseason/repository';
import { PouleRepository } from '../poule/repository';
import { QualifyRuleRepository } from '../qualifyrule/repository';
import { QualifyService } from '../qualifyrule/service';
import { Round } from '../round';
import { IRoundConfig, RoundConfigRepository } from './config/repository';
import { IRoundScoreConfig, RoundScoreConfigRepository } from './scoreconfig/repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundRepository {

    constructor(
        private configRepos: RoundConfigRepository,
        private scoreConfigRepos: RoundScoreConfigRepository,
        private pouleRepos: PouleRepository,
        private competitionseasonRepos: CompetitionseasonRepository,
        private qualifyRuleRepos: QualifyRuleRepository) {
    }

    jsonArrayToObject(jsonArray: IRound[], competitionseason: Competitionseason, parentRound?: Round): Round[] {
        const objects: Round[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competitionseason, parentRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IRound, competitionseason: Competitionseason, parentRound?: Round): Round {
        const round = new Round(competitionseason, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        round.setName(json.name);
        this.configRepos.jsonToObjectHelper(json.config, round);
        round.setScoreConfig(this.scoreConfigRepos.jsonToObjectHelper(json.scoreConfig, round));
        this.pouleRepos.jsonArrayToObject(json.poules, round);
        this.jsonArrayToObject(json.childRounds, competitionseason, round);
        if (parentRound !== undefined) {
            const qualifyService = new QualifyService(round);
            qualifyService.createObjectsForParentRound();
        }
        return round;
    }

    objectsToJsonArray(objects: Round[]): IRound[] {
        const jsonArray: IRound[] = [];
        for (const object of objects) {
            const json = this.objectToJsonHelper(object);
            jsonArray.push(json);
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Round): IRound {
        return {
            id: object.getId(),
            number: object.getNumber(),
            winnersOrLosers: object.getWinnersOrLosers(),
            name: object.getName(),
            config: this.configRepos.objectToJsonHelper(object.getConfig()),
            scoreConfig: this.scoreConfigRepos.objectToJsonHelper(object.getScoreConfig()),
            poules: this.pouleRepos.objectsToJsonArray(object.getPoules()),
            childRounds: this.objectsToJsonArray(object.getChildRounds())
        };
    }
}

export interface IRound {
    id?: number;
    number: number;
    winnersOrLosers: number;
    name: string;
    config: IRoundConfig;
    scoreConfig: IRoundScoreConfig;
    poules: IPoule[];
    childRounds: IRound[];
}
