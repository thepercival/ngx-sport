import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CompetitionRepository } from '../competition/repository';
import { IPoule, PouleRepository } from '../poule/repository';
import { QualifyRuleRepository } from '../qualify/repository';
import { QualifyService } from '../qualify/service';
import { SportRepository } from '../repository';
import { Round } from '../round';
import { RoundNumber } from '../round/number';


/**
 * Created by coen on 3-3-17.
 */
@Injectable()
export class RoundRepository extends SportRepository {

    private url: string;

    constructor(
        private http: HttpClient,
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

    jsonArrayToObject(jsonArray: IRound[], roundNumber: RoundNumber, parentRound?: Round): Round[] {
        const objects: Round[] = [];
        for (const json of jsonArray) {
            const object = this.jsonToObject(json, roundNumber, parentRound);
            objects.push(object);
        }
        return objects;
    }

    jsonToObject(json: IRound, roundNumber: RoundNumber, parentRound?: Round, round?: Round): Round {
        round = new Round(roundNumber, parentRound, json.winnersOrLosers);
        round.setId(json.id);
        // round.setName(json.name);
        round.setQualifyOrder(json.qualifyOrder);
        // this.configRepos.jsonToObject(json.config, roundNumber);
        this.pouleRepos.jsonArrayToObject(json.poules, round);
        if (parentRound !== undefined) {
            const qualifyService = new QualifyService(round.getParent(), round);
            qualifyService.createRules();
        }
        json.childRounds.forEach((jsonChildRound) => {
            this.jsonToObject(jsonChildRound, roundNumber.getNext(), round, round.getChildRound(jsonChildRound.winnersOrLosers));
        });
        return round;
    }

    objectsToJsonArray(objects: Round[]): IRound[] {
        const jsonArray: IRound[] = [];
        for (const object of objects) {
            jsonArray.push(this.objectToJson(object));
        }
        return jsonArray;
    }

    objectToJson(round: Round): IRound {
        return {
            id: round.getId(),
            number: round.getNumberAsValue(),
            winnersOrLosers: round.getWinnersOrLosers(),
            qualifyOrder: round.getQualifyOrder(),
            name: round.getName(),
            poules: this.pouleRepos.objectsToJsonArray(round.getPoules()),
            childRounds: this.objectsToJsonArray(round.getChildRounds())
        };
    }
}

export interface IRound {
    id?: number;
    number: number;
    winnersOrLosers: number;
    qualifyOrder: number;
    name: string;
    poules: IPoule[];
    childRounds: IRound[];
}
