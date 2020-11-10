import { Injectable } from '@angular/core';
import { Association } from '../association';
import { Person } from '../person';
import { PlayerMapper } from '../team/player/mapper';
import { JsonPerson } from './json';

@Injectable({
    providedIn: 'root'
})
export class PersonMapper {

    constructor(protected playerMapper: PlayerMapper) { }

    toObject(json: JsonPerson, association: Association, existingPerson: Person | undefined): Person {
        const person = existingPerson ? existingPerson : new Person(json.firstName, json.nameInsertion, json.lastName);
        person.setId(json.id);
        if (json.players) {
            json.players.forEach(jsonPlayer => this.playerMapper.toObject(jsonPlayer, person, association));
        }
        return person;
    }

    toJson(person: Person): JsonPerson {
        return {
            id: +person.getId(),
            firstName: person.getLastName(),
            nameInsertion: person.getNameInsertion(),
            lastName: person.getLastName()
        };
    }
}

