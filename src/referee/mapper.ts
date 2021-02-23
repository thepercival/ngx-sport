import { Referee } from '../referee';
import { Competition } from '../competition';
import { Injectable } from '@angular/core';
import { JsonReferee } from './json';

@Injectable({
    providedIn: 'root'
})
export class RefereeMapper {
    protected cache: RefereeMap = {};

    toNewObject(json: JsonReferee, competition: Competition): Referee {
        const referee = new Referee(competition, json.initials, json.priority);
        referee.setId(json.id);
        this.cache[referee.getId()] = referee;
        return this.updateObject(json, referee);
    }

    toExistingObject(json: JsonReferee): Referee {
        const referee = this.cache[json.id];
        if (referee === undefined) {
            throw Error('referee does not exists in mapper-cache');
        }
        return this.updateObject(json, referee);
    }

    protected updateObject(json: JsonReferee, referee: Referee): Referee {
        referee.setName(json.name);
        referee.setInfo(json.info);
        referee.setEmailaddress(json.emailaddress);
        return referee;
    }

    toJson(referee: Referee): JsonReferee {
        return {
            id: referee.getId(),
            priority: referee.getPriority(),
            initials: referee.getInitials(),
            name: referee.getName(),
            emailaddress: referee.getEmailaddress(),
            info: referee.getInfo()
        };
    }
}

export interface RefereeMap {
    [key: number]: Referee;
}
