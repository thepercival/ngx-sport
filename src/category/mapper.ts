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
        const category = new Category(firstRoundNumber.getCompetition(), json.name, json.number, undefined);
        const rootRound = new Round(category, firstRoundNumber, undefined)
        category.setRootRound(rootRound);
        this.roundMapper.toObject(json.rootRound, rootRound);
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
