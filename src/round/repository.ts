import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Competition } from '../competition';
import { CompetitionRepository } from '../competition/repository';
import { IPoule, PouleRepository } from '../poule/repository';
import { QualifyRuleRepository } from '../qualifyrule/repository';
import { QualifyService } from '../qualifyrule/service';
import { SportRepository } from '../repository';
import { Round } from '../round';
import { IRoundConfig, RoundConfigRepository } from './config/repository';
import { IRoundScoreConfig, RoundScoreConfigRepository } from './scoreconfig/repository';


/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private configRepos: RoundConfigRepository,
        private scoreConfigRepos: RoundScoreConfigRepository,
        private pouleRepos: PouleRepository,
        private competitionRepos: CompetitionRepository,
        private qualifyRuleRepos: QualifyRuleRepository,
        router: Router) {
        super(router);
        this.url = super.getApiUrl() + 'voetbal/' + this.getUrlpostfix();
    }

    getUrlpostfix(): string {
        return 'rounds';
    }

    jsonArrayToObject(jsonArray: IRound[], competition: Competition, parentRound?: Round): Round[] {
        const objects: Round[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObjectHelper(json, competition, parentRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObjectHelper(json: IRound, competition: Competition, parentRound?: Round, round?: Round): Round {
        if (round === undefined && json.id !== undefined) {
            round = this.cache[json.id];
        }
        if (round === undefined) {
            round = new Round(competition, parentRound, json.winnersOrLosers);
            round.setId(json.id);
            this.cache[round.getId()] = round;
        }
        // round.setName(json.name);
        round.setQualifyOrder(json.qualifyOrder);
        this.configRepos.jsonToObjectHelper(json.config, round);
        round.setScoreConfig(this.scoreConfigRepos.jsonToObjectHelper(json.scoreConfig, round));
        this.pouleRepos.jsonArrayToObject(json.poules, round);
        this.jsonArrayToObject(json.childRounds, competition, round);
        if (parentRound !== undefined) {
            const qualifyService = new QualifyService(round);
            qualifyService.createObjectsForParentRound();
        }
        return round;
    }

    objectsToJsonArray(objects: Round[]): IRound[] {
        const jsonArray: IRound[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJsonHelper(object));
        }
        return jsonArray;
    }

    objectToJsonHelper(object: Round): IRound {
        return {
            id: object.getId(),
            number: object.getNumber(),
            winnersOrLosers: object.getWinnersOrLosers(),
            qualifyOrder: object.getQualifyOrder(),
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
    qualifyOrder: number;
    name: string;
    config: IRoundConfig;
    scoreConfig: IRoundScoreConfig;
    poules: IPoule[];
    childRounds: IRound[];
}
