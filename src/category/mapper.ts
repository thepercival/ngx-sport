import { Injectable } from '@angular/core';

import { Category } from '../category';
import { RoundMapper } from '../round/mapper';
import { RoundNumber } from '../round/number';
import { Round } from '../qualify/group';
import { JsonCategory } from './json';
import { StructureCell } from '../structure/cell';
import { StructureCellMapper } from '../structure/cell/mapper';
import { QualifyRuleCreator } from '../qualify/rule/creator';
import { HorizontalPouleCreator } from '../poule/horizontal/creator';

@Injectable({
    providedIn: 'root'
})
export class CategoryMapper {

    private qualifyRuleCreator: QualifyRuleCreator;
    

    constructor(
        private structureCellMapper: StructureCellMapper,
        private roundMapper: RoundMapper
    ) { 
        this.qualifyRuleCreator = new QualifyRuleCreator();
        
    }

    toObject(json: JsonCategory, firstRoundNumber: RoundNumber, disableCache?: boolean): Category {
        const category = new Category(firstRoundNumber.getCompetition(), json.name, json.number);

        this.structureCellMapper.toObject(json.firstStructureCell, category, firstRoundNumber);

        const rootRound = new Round(category.getFirstStructureCell(), undefined)
        category.setId(json.id);
        this.roundMapper.toObject(json.rootRound, rootRound);

        this.addQualifyRules(rootRound);        

        return category;
    }

    addQualifyRules(round: Round) {
        this.qualifyRuleCreator.remove(round);    
        this.qualifyRuleCreator.create(round);
        round.getChildren().forEach((childRound: Round) => {
            this.addQualifyRules(childRound);
        });
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
