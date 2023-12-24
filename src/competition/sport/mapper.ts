import { Injectable } from '@angular/core';

import { Competition } from '../../competition';
import { SportMapper } from '../../sport/mapper';
import { FieldMapper } from '../../field/mapper';
import { JsonCompetitionSport } from './json';
import { CompetitionSport } from '../sport';
import { Field } from '../../field';
import { GameMode } from '../../planning/gameMode';
import { Sport } from '../../sport';
import { JsonPersistSportVariant } from '../../sport/variant/json';
import { AllInOneGame } from '../../sport/variant/allInOneGame';
import { AgainstGpp } from '../../sport/variant/against/gamesPerPlace';
import { AgainstH2h } from '../../sport/variant/against/h2h';
import { Single } from '../../sport/variant/single';

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
        const competitionSport = new CompetitionSport(
            sport, 
            competition, 
            json.defaultPointsCalculation, 
            json.defaultWinPoints,
            json.defaultDrawPoints,
            json.defaultWinPointsExt,
            json.defaultDrawPointsExt,
            json.defaultLosePointsExt,
            this.toVariant(json, sport));
        json.fields.map(jsonField => this.fieldMapper.toObject(jsonField, competitionSport));
        competitionSport.setId(json.id);
        this.cache[competitionSport.getId()] = competitionSport;
        return competitionSport;
    }

    toVariant(json: JsonCompetitionSport, sport: Sport): Single | AgainstH2h | AgainstGpp | AllInOneGame {
        if (json.gameMode === GameMode.Single) {
            return new Single(sport, json.nrOfGamePlaces, json.nrOfGamesPerPlace);
        } else if (json.gameMode === GameMode.Against) {
            if (json.nrOfH2H > 0) {
                return new AgainstH2h(sport, json.nrOfHomePlaces, json.nrOfAwayPlaces, json.nrOfH2H);
            }
            return new AgainstGpp(sport, json.nrOfHomePlaces, json.nrOfAwayPlaces, json.nrOfGamesPerPlace);
        }
        return new AllInOneGame(sport, json.nrOfGamesPerPlace);
    }

    toJson(competitionSport: CompetitionSport): JsonCompetitionSport {
        let jsonVariant = this.variantToJson(competitionSport.getVariant());
        let json: JsonCompetitionSport = {
            id: competitionSport.getId(),
            sport: this.sportMapper.toJson(competitionSport.getSport()),
            defaultPointsCalculation: competitionSport.getDefaultPointsCalculation(),
            defaultWinPoints: competitionSport.getDefaultWinPoints(),
            defaultDrawPoints: competitionSport.getDefaultDrawPoints(),
            defaultWinPointsExt: competitionSport.getDefaultWinPointsExt(),
            defaultDrawPointsExt: competitionSport.getDefaultDrawPointsExt(),
            defaultLosePointsExt: competitionSport.getDefaultLosePointsExt(),
            fields: competitionSport.getFields().map((field: Field) => this.fieldMapper.toJson(field)),
            gameMode: jsonVariant.gameMode,
            nrOfHomePlaces: jsonVariant.nrOfHomePlaces,
            nrOfAwayPlaces: jsonVariant.nrOfAwayPlaces,
            nrOfGamePlaces: jsonVariant.nrOfGamePlaces,
            nrOfH2H: jsonVariant.nrOfH2H,
            nrOfGamesPerPlace: jsonVariant.nrOfGamesPerPlace
        }
        return json;
    }

    variantToJson(variant: Single | AgainstH2h | AgainstGpp | AllInOneGame): JsonPersistSportVariant {

        let json: JsonPersistSportVariant = {
            gameMode: variant.getGameMode(), nrOfHomePlaces: 0, nrOfAwayPlaces: 0, nrOfGamePlaces: 0, nrOfH2H: 0, nrOfGamesPerPlace: 0
        }
        if (variant instanceof Single) {
            json.nrOfGamePlaces = variant.getNrOfGamePlaces();
            json.nrOfGamesPerPlace = variant.getNrOfGamesPerPlace();
        } else if (variant instanceof AgainstH2h) {
            json.nrOfHomePlaces = variant.getNrOfHomePlaces();
            json.nrOfAwayPlaces = variant.getNrOfAwayPlaces();
            json.nrOfH2H = variant.getNrOfH2H();
        } else if (variant instanceof AgainstGpp) {
            json.nrOfHomePlaces = variant.getNrOfHomePlaces();
            json.nrOfAwayPlaces = variant.getNrOfAwayPlaces();
            json.nrOfGamesPerPlace = variant.getNrOfGamesPerPlace();
        } else {
            json.nrOfGamesPerPlace = variant.getNrOfGamesPerPlace();
        }
        return json;
    }

    getMap(competition: Competition): CompetitionSportMap {
        const sportMap: CompetitionSportMap = {};
        competition.getSports().forEach((competitionSport: CompetitionSport) => {
            sportMap[competitionSport.getId()] = competitionSport;
        });
        return sportMap;
    }
}

export interface CompetitionSportMap {
    [key: string]: CompetitionSport;
}
