import { Injectable } from '@angular/core';

import { Category } from '../category';
import { RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { Round } from '../qualify/group';
import { JsonCategory } from './json';
import { StructureCell } from '../structure/cell';
import { StructureCellMapper } from '../structure/cell/mapper';

@Injectable({
    providedIn: 'root'
})
export class CategoryMapper {

    constructor(
        private structureCellMapper: StructureCellMapper,
        private roundMapper: RoundMapper
    ) { }

    toObject(json: JsonCategory, firstRoundNumber: RoundNumber, disableCache?: boolean): Category {
        const category = new Category(firstRoundNumber.getCompetition(), json.name, json.number);

        this.structureCellMapper.toObject(json.firstStructureCell, category, firstRoundNumber);

        const rootRound = new Round(category.getFirstStructureCell(), undefined)
        category.setId(json.id);
        this.roundMapper.toObject(json.rootRound, rootRound);
        return category;
    }

    toJson(category: Category): JsonCategory {
        return {
            id: category.getId(),
            name: category.getName(),
            number: category.getNumber(),
            firstStructureCell: this.structureCellMapper.toJson(category.getFirstStructureCell()),
            rootRound: this.roundMapper.toJson(category.getRootRound())
        };
    }
}
