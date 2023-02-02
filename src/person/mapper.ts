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
    protected cache: PersonMap = new PersonMap();

    constructor(protected teamMapper: TeamMapper, protected playerMapper: PlayerMapper) {
    }

    protected createObject(json: JsonPerson): Person {
        return new Person(json.firstName, json.nameInsertion, json.lastName);
    }

    toObject(json: JsonPerson, association: Association, disableCache?: boolean): Person {
        let cachedPerson = (disableCache !== true) ? this.cache.get(+json.id) : undefined;
        let person: Person;
        if (cachedPerson === undefined) {
            person = this.createObject(json);
            person.setId(json.id);
            this.cache.set(+person.getId(), person);
        } else {
            person = cachedPerson;
        }       
        return person;
    }

    toJson(person: Person): JsonPerson {
        return {
            id: +person.getId(),
            firstName: person.getFirstName(),
            nameInsertion: person.getNameInsertion(),
            lastName: person.getLastName()
        };
    }
}

export class PersonMap extends Map<number, Person> {

}

