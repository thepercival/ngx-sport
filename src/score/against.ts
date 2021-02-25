import { AgainstResult } from '../against/result';
import { AgainstSide } from '../against/side';
import { AgainstGame } from '../game/against';
import { Score } from '../score';
import { AgainstScoreHelper } from './againstHelper';

export class AgainstScore extends Score {
    static readonly SCORED = 1;
    static readonly RECEIVED = 2;
    protected helper: AgainstScoreHelper;

    constructor(protected game: AgainstGame, home: number, away: number, phase: number, number?: number) {
        super(phase, number ? number : game.getScores().length + 1);
        this.helper = new AgainstScoreHelper(home, away);
        this.game.getScores().push(this);
    }

    getGame(): AgainstGame {
        return this.game;
    }

    getHome(): number {
        return this.helper.getHome();
    }

    getAway(): number {
        return this.helper.getAway();
    }

    getResult(side: AgainstSide): AgainstResult {
        return this.helper.getResult(side);
    }
}

