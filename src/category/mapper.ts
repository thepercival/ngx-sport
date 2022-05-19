import { Injectable } from '@angular/core';

import { Category } from '../category';
import { RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { Round } from '../qualify/group';
import { JsonCategory } from './json';

@Injectable({
    providedIn: 'root'
})
export class CategoryMapper {

    constructor(
        private roundMapper: RoundMapper
    ) { }

    toObject(json: JsonCategory, firstRoundNumber: RoundNumber, disableCache?: boolean): Category {
        const existingRound = new Round(firstRoundNumber, undefined)
        const round = this.roundMapper.toObject(json.rootRound, existingRound);
        const category = new Category(firstRoundNumber.getCompetition(), json.name, json.number, round);
        return category;
    }

    toJson(category: Category): JsonCategory {
        return {
            id: category.getId(),
            name: category.getName(),
            number: category.getNumber(),
            rootRound: this.roundMapper.toJson(category.getRootRound())
        };
    }
}
