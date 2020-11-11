import { Injectable } from '@angular/core';
import { PlayerMapper } from '../team/player/mapper';
import { Association } from '../association';
import { Person } from '../person';
import { TeamMapper } from '../team/mapper';
import { JsonPerson } from './json';

@Injectable({
    providedIn: 'root'
})
export class PersonMapper {

    constructor(protected teamMapper: TeamMapper, protected playerMapper: PlayerMapper) {
    }

    toObject(json: JsonPerson, association: Association, existingPerson: Person | undefined): Person {
        const person = existingPerson ? existingPerson : new Person(json.firstName, json.nameInsertion, json.lastName);
        person.setId(json.id);
        if (json.players) {
            json.players.forEach(jsonPlayer => this.playerMapper.toObject(jsonPlayer, association, person));
        }
        return person;
    }

    toJsonn(person: Person): JsonPerson {
        return {
            id: +person.getId(),
            firstName: person.getLastName(),
            nameInsertion: person.getNameInsertion(),
            lastName: person.getLastName()
        };
    }
}

