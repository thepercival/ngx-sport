import { Round } from '../group';
import { RoundMapper } from '../../round/mapper';
import { QualifyGroup } from '../group';
import { JsonQualifyGroup } from './json';
import { StructureCell } from '../../structure/cell';

export class QualifyGroupMapper {
    constructor(private roundMapper: RoundMapper) { }

    toObject(json: JsonQualifyGroup, round: Round, nextStructureCell: StructureCell): QualifyGroup {
        const qualifyGroup = new QualifyGroup(round, json.target, nextStructureCell, json.number);
        qualifyGroup.setId(json.id);
        qualifyGroup.setDistribution(json.distribution);
        this.roundMapper.toObject(json.childRound, qualifyGroup.getChildRound());
        return qualifyGroup;
    }

    toJson(qualifyGroup: QualifyGroup): JsonQualifyGroup {
        return {
            id: qualifyGroup.getId(),
            target: qualifyGroup.getTarget(),
            distribution: qualifyGroup.getDistribution(),
            number: qualifyGroup.getNumber(),
            childRound: this.roundMapper.toJson(qualifyGroup.getChildRound())
        };
    }
}
