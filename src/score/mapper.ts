import { Score } from '../score';
import { Game } from '../game';
import { Injectable } from '@angular/core';
import { JsonScore } from './json';
import { JsonAgainstScore } from './against/json';
import { AgainstGame } from 'src/game/against';
import { AgainstScore } from './against';
import { AgainstScoreHelper } from './againstHelper';
import { TogetherScore } from './together';
import { JsonTogetherScore } from './together/json';
import { TogetherGamePlace } from 'src/game/place/together';

@Injectable({
    providedIn: 'root'
})
export class ScoreMapper {

    constructor() { }

    toAgainstObject(json: JsonAgainstScore, game: AgainstGame, score?: AgainstScore): AgainstScore {
        if (score === undefined) {
            score = new AgainstScore(game, json.home, json.away, json.phase, json.number);
        }
        score.setId(json.id);
        return score;
    }

    toTogetherObject(json: JsonTogetherScore, gamePlace: TogetherGamePlace, score?: TogetherScore): TogetherScore {
        if (score === undefined) {
            score = new TogetherScore(gamePlace, json.score, json.phase, json.number);
        }
        score.setId(json.id);
        return score;
    }

    toJsonAgainst(score: AgainstScore): JsonAgainstScore {
        return {
            id: score.getId(),
            home: score.getHome(),
            away: score.getAway(),
            phase: score.getPhase(),
            number: score.getNumber()
        };
    }

    toJsonTogether(score: TogetherScore): JsonTogetherScore {
        return {
            id: score.getId(),
            score: score.getScore(),
            phase: score.getPhase(),
            number: score.getNumber()
        };
    }
}
