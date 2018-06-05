import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Competition } from '../competition';
import { CompetitionRepository } from '../competition/repository';
import { IPoule, PouleRepository } from '../poule/repository';
import { QualifyRuleRepository } from '../qualify/repository';
import { QualifyService } from '../qualify/service';
import { SportRepository } from '../repository';
import { Round } from '../round';
import { IRoundConfig, RoundConfigRepository } from './config/repository';

/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
        private configRepos: RoundConfigRepository,
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
        round = new Round(competition, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        // round.setName(json.name);
        round.setQualifyOrder(json.qualifyOrder);
        this.configRepos.jsonToObjectHelper(json.config, round);
        this.pouleRepos.jsonArrayToObject(json.poules, round);
        json.childRounds.forEach((jsonChildRound) => {
            this.jsonToObjectHelper(jsonChildRound, competition, round, round.getChildRound(jsonChildRound.winnersOrLosers));
        });
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
    poules: IPoule[];
    childRounds: IRound[];
}
