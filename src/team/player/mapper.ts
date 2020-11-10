import { Injectable } from '@angular/core';
import { Association } from '../../association';
import { Period } from '../../period';
import { Person } from '../../person';
import { TeamMapper } from '../mapper';
import { Player } from '../player';
import { JsonPlayer } from './json';

@Injectable({
    providedIn: 'root'
})
export class PlayerMapper {

    constructor(protected teamMapper: TeamMapper) { }

    toObject(json: JsonPlayer, person: Person, association: Association): Player {

        const player = new Player(
            this.teamMapper.toObject(json.team, association),
            person,
            new Period(new Date(json.startDateTime), new Date(json.endDateTime)),
            json.line);

        player.setId(json.id);

        return player;
    }

    toJson(player: Player): JsonPlayer {
        return {
            id: player.getId(),
            team: this.teamMapper.toJson(player.getTeam()),
            startDateTime: player.getPeriod().getStartDateTime().toISOString(),
            endDateTime: player.getPeriod().getEndDateTime().toISOString(),
            line: player.getLine()
        };
    }
}

