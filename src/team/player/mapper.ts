import { Injectable } from '@angular/core';
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
          new Date(json.start),
          new Date(json.end),
          json.line,
          json.marketValue
        );

        player.setId(json.id);

        return player;
    }

    toJson(player: Player): JsonPlayer {
        return {
          id: player.getId(),
          team: this.teamMapper.toJson(player.getTeam()),
          start: player.getStartDateTime().toISOString(),
          end: player.getEndDateTime().toISOString(),
          line: player.getLine(),
          marketValue: player.getMarketValue()
        };
    }
}

