import { Injectable } from '@angular/core';

import { RoundNumber } from '../round/number';
import { Round } from '../round';
import { GameMapper } from '../game/mapper';
import { JsonStructure } from '../structure/json';
import { JsonRound } from '../round/json';
import { JsonRoundNumber } from '../round/number/json';

@Injectable({
    providedIn: 'root'
})
export class PlanningMapper {
    constructor(private gameMapper: GameMapper) { }

    toObject(json: JsonStructure, roundNumber: RoundNumber): RoundNumber {
        this.toRoundNumber(json.firstRoundNumber, roundNumber.getFirst(), roundNumber.getNumber());
        this.toRoundGames(json.rootRound, roundNumber.getFirst().getRounds()[0], roundNumber.getFirst(), roundNumber.getNumber());
        this.setRefereePlaces(json.rootRound, roundNumber.getFirst());
        return roundNumber;
    }

    protected toRoundNumber(jsonRoundNumber: JsonRoundNumber, roundNumber: RoundNumber, startRoundNumber: number) {
        if (roundNumber.getNumber() >= startRoundNumber) {
            roundNumber.setHasPlanning(jsonRoundNumber.hasPlanning);
        }
        if (roundNumber.hasNext()) {
            this.toRoundNumber(jsonRoundNumber.next, roundNumber.getNext(), startRoundNumber);
        }
    }
    protected toRoundGames(jsonRound: JsonRound, round: Round, roundNumber: RoundNumber, startRoundNumber: number) {
        if (roundNumber.getNumber() >= startRoundNumber && roundNumber.getHasPlanning()) {
            jsonRound.poules.forEach(jsonPoule => {
                const poule = round.getPoule(jsonPoule.number);
                if (jsonPoule.games !== undefined) {
                    jsonPoule.games.forEach(jsonGame => {
                        this.gameMapper.toObject(jsonGame, poule);
                    });
                }
            });
        }
        jsonRound.qualifyGroups.forEach((jsonQualifyGroup) => {
            const qualifyGroup = round.getQualifyGroup(jsonQualifyGroup.winnersOrLosers, jsonQualifyGroup.number);
            this.toRoundGames(jsonQualifyGroup.childRound, qualifyGroup.getChildRound(), roundNumber.getNext(), startRoundNumber);
        });
    }

    setRefereePlaces(jsonRound: JsonRound, roundNumber: RoundNumber) {
        if (roundNumber.getValidPlanningConfig().getSelfReferee()) {
            const places = roundNumber.getPlaces();
            const games = roundNumber.getGames();
            jsonRound.poules.forEach(jsonPoule => jsonPoule.games.forEach(jsonGame => {
                if (jsonGame.refereePlaceId === undefined) {
                    return;
                }
                const refereePlace = places.find(place => place.getId() === jsonGame.refereePlaceId);
                const game = games.find(gameIt => gameIt.getId() === jsonGame.id);
                game.setRefereePlace(refereePlace);
            }));
        }
        jsonRound.qualifyGroups.forEach(qualifyGroup => {
            this.setRefereePlaces(qualifyGroup.childRound, roundNumber.getNext());
        });
    }
}
