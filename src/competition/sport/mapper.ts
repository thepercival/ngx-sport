import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportMapper } from '../../sport/mapper';
import { FieldMapper } from '../../field/mapper';
import { JsonCompetitionSport } from './json';
import { CompetitionSport } from '../sport';
import { Field } from '../../field';
import { AgainstSportVariant } from '../../sport/variant/against';
import { SingleSportVariant } from '../../sport/variant/single';
import { AllInOneGameSportVariant } from '../../sport/variant/all';
import { GameMode } from '../../planning/gameMode';
import { Sport } from '../../sport';
import { JsonPersistSportVariant } from '../../sport/variant/json';

@Injectable({
    providedIn: 'root'
})
export class CompetitionSportMapper {
    protected cache: CompetitionSportMap = {};

    constructor(private sportMapper: SportMapper, private fieldMapper: FieldMapper) {
    }

    toObject(json: JsonCompetitionSport, competition: Competition, disableCache?: boolean): CompetitionSport {
        if (disableCache !== true && this.cache[json.id]) {
            return this.cache[json.id];
        }
        const sport = this.sportMapper.toObject(json.sport);
        const competitionSport = new CompetitionSport(sport, competition, this.toVariant(json, sport));
        json.fields.map(jsonField => this.fieldMapper.toObject(jsonField, competitionSport));
        competitionSport.setId(json.id);
        this.cache[competitionSport.getId()] = competitionSport;
        return competitionSport;
    }

    toVariant(json: JsonCompetitionSport, sport: Sport): SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant {
        if (json.gameMode === GameMode.Single) {
            return new SingleSportVariant(sport, json.nrOfGamePlaces, json.gameAmount);
        } else if (json.gameMode === GameMode.Against) {
            return new AgainstSportVariant(sport, json.nrOfHomePlaces, json.nrOfAwayPlaces, json.gameAmount);
        }
        return new AllInOneGameSportVariant(sport, json.gameAmount);
    }

    toJson(competitionSport: CompetitionSport): JsonCompetitionSport {
        let jsonVariant = this.variantToJson(competitionSport.getVariant());
        let json: JsonCompetitionSport = {
            id: competitionSport.getId(),
            sport: this.sportMapper.toJson(competitionSport.getSport()),
            fields: competitionSport.getFields().map((field: Field) => this.fieldMapper.toJson(field)),
            gameMode: jsonVariant.gameMode,
            nrOfHomePlaces: jsonVariant.nrOfHomePlaces,
            nrOfAwayPlaces: jsonVariant.nrOfAwayPlaces,
            nrOfH2H: jsonVariant.nrOfH2H,
            nrOfGamePlaces: jsonVariant.nrOfGamePlaces,
            gameAmount: jsonVariant.gameAmount
        }
        return json;
    }

    variantToJson(variant: SingleSportVariant | AgainstSportVariant | AllInOneGameSportVariant): JsonPersistSportVariant {
        let json: JsonPersistSportVariant = {
            gameMode: 0, nrOfHomePlaces: 0, nrOfAwayPlaces: 0, nrOfH2H: 0, nrOfGamePlaces: 0, gameAmount: 0
        }
        if (variant instanceof SingleSportVariant) {
            json.gameMode = GameMode.Single;
            json.nrOfGamePlaces = variant.getNrOfGamePlaces();
            json.gameAmount = variant.getGameAmount();
        } else if (variant instanceof AgainstSportVariant) {
            json.gameMode = GameMode.Against;
            json.nrOfHomePlaces = variant.getNrOfHomePlaces(),
                json.nrOfAwayPlaces = variant.getNrOfAwayPlaces(),
                json.nrOfH2H = variant.getNrOfH2H()
        } else {
            json.gameMode = GameMode.AllInOneGame;
            json.gameAmount = variant.getGameAmount();
        }
        return json;
    }
}

export interface CompetitionSportMap {
    [key: string]: CompetitionSport;
}
