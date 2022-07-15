import { Injectable } from '@angular/core';
import { Category } from '../../category';
import { RoundNumber } from '../../round/number';
import { StructureCell } from '../cell';
import { JsonStructureCell } from './json';


@Injectable({
    providedIn: 'root'
})
export class StructureCellMapper {

    constructor(
    ) {
    }

    toObject(jsonCell: JsonStructureCell, category: Category, roundNumber: RoundNumber): StructureCell {
        const cell = new StructureCell(category, roundNumber);
        const nextRoundNumber = roundNumber.getNext();
        if (nextRoundNumber !== undefined && jsonCell.next) {
            this.toObject(jsonCell.next, category, nextRoundNumber);
        }
        return cell;
    }

    toJson(cell: StructureCell | undefined): JsonStructureCell {
        if (cell === undefined) {
            return undefined;
        }
        return {
            next: this.toJson(cell.getNext())
        };
    }
}
