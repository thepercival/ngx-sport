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

    toObject(json: JsonPerson, association: Association, disableCache?: boolean): Person {
        let cachedPerson = (disableCache !== true) ? this.cache.get(json.id) : undefined;
        let person: Person;
        if (cachedPerson === undefined) {
            person = new Person(json.firstName, json.nameInsertion, json.lastName);
            person.setId(json.id);
            this.cache.set(+person.getId(), person);
        } else {
            person = cachedPerson;
        }
        if (json.imageUrl) {
            person.setImageUrl(json.imageUrl);
        }
        if (json.players) {
            json.players.forEach(jsonPlayer => this.playerMapper.toObject(jsonPlayer, association, person));
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

export class PersonMap extends Map<number, Person> {

}

