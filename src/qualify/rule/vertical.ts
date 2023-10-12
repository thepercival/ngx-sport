import { HorizontalPoule } from '../../poule/horizontal';
import { QualifyRule } from '../rule';

export abstract class VerticalQualifyRule extends QualifyRule{
    
    constructor(fromHorizontalPoule: HorizontalPoule) {
        super(fromHorizontalPoule);
    }   
}

