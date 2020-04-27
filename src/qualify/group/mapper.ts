import { Round } from '../../round';
import { RoundMapper } from '../../round/mapper';
import { QualifyGroup } from '../group';
import { JsonQualifyGroup } from './json';

export class QualifyGroupMapper {
    constructor(private roundMapper: RoundMapper) { }

    toObject(json: JsonQualifyGroup, round: Round): QualifyGroup {
        const qualifyGroup = new QualifyGroup(round, json.winnersOrLosers);
        qualifyGroup.setId(json.id);
        qualifyGroup.setNumber(json.number);
        this.roundMapper.toObject(json.childRound, round.getNumber().getNext(), qualifyGroup);
        return qualifyGroup;
    }

    toJson(qualifyGroup: QualifyGroup): JsonQualifyGroup {
        return {
            id: qualifyGroup.getId(),
            winnersOrLosers: qualifyGroup.getWinnersOrLosers(),
            number: qualifyGroup.getNumber(),
            childRound: this.roundMapper.toJson(qualifyGroup.getChildRound())
        };
    }
}
