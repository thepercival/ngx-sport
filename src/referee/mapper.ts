import { Referee } from '../referee';
import { Competition } from '../competition';
import { Injectable } from '@angular/core';
import { JsonReferee } from './json';

@Injectable({
    providedIn: 'root'
})
export class RefereeMapper {

    constructor() { }

    toObject(json: JsonReferee, competition: Competition, referee?: Referee): Referee {
        if (referee === undefined) {
            referee = new Referee(competition, json.rank);
        }
        referee.setId(json.id);
        referee.setInitials(json.initials);
        referee.setName(json.name);
        referee.setInfo(json.info);
        referee.setEmailaddress(json.emailaddress);
        return referee;
    }

    toJson(referee: Referee): JsonReferee {
        return {
            id: referee.getId(),
            rank: referee.getRank(),
            initials: referee.getInitials(),
            name: referee.getName(),
            emailaddress: referee.getEmailaddress(),
            info: referee.getInfo()
        };
    }
}
