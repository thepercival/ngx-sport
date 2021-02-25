import { Referee } from '../referee';
import { Competition } from '../competition';
import { Injectable } from '@angular/core';
import { JsonReferee } from './json';

@Injectable({
    providedIn: 'root'
})
export class RefereeMapper {

    toObject(json: JsonReferee, competition: Competition): Referee {
        const existingField: Referee | undefined = this.getFromCompetition(json.id, competition);
        const referee: Referee = existingField ? existingField : new Referee(competition, json.initials, json.priority);
        referee.setId(json.id);
        referee.setName(json.name);
        referee.setInfo(json.info);
        referee.setEmailaddress(json.emailaddress);
        return referee;
    }

    getFromCompetition(id: string | number, competition: Competition): Referee | undefined {
        return competition.getReferees().find((refereeIt: Referee) => refereeIt.getId() === id);
    }

    updateObject(json: JsonReferee, referee: Referee): Referee {
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
