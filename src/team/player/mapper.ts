import { Injectable } from '@angular/core';
import { Period } from '../../period';
import { Association } from '../../association';
import { Person } from '../../person';
import { TeamMapper } from '../mapper';
import { JsonPlayer } from './json';
import { Player } from '../player';

@Injectable({
    providedIn: 'root'
})
export class PlayerMapper {

    constructor(protected teamMapper: TeamMapper) {
    }

    toObject(json: JsonPlayer, association: Association, person: Person): Player {
        const player = new Player(
            this.teamMapper.toObject(json.team, association),
            person,
            new Period(new Date(json.start), new Date(json.end)),
            json.line);

        player.setId(json.id);

        return player;
    }

    toJson(player: Player): JsonPlayer {
        return {
            id: player.getId(),
            team: this.teamMapper.toJson(player.getTeam()),
            start: player.getPeriod().getStartDateTime().toISOString(),
            end: player.getPeriod().getEndDateTime().toISOString(),
            line: player.getLine()
        };
    }
}

