import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '../group';
import { QualifyRule } from '../rule';
import { QualifyTarget } from '../target';

export abstract class HorizontalQualifyRule extends QualifyRule{
    constructor(fromHorizontalPoule: HorizontalPoule) {
        super(fromHorizontalPoule);
    }
}

