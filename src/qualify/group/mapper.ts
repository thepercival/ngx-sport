import { RoundNumber } from '../../round/number';
import { Round } from '../group';
import { RoundMapper } from '../../round/mapper';
import { QualifyGroup } from '../group';
import { JsonQualifyGroup } from './json';

export class QualifyGroupMapper {
    constructor(private roundMapper: RoundMapper) { }

    toObject(json: JsonQualifyGroup, round: Round, nextRoundNumber: RoundNumber): QualifyGroup {
        const qualifyGroup = new QualifyGroup(round, json.winnersOrLosers, nextRoundNumber, json.number);
        qualifyGroup.setId(json.id);
        this.roundMapper.toObject(json.childRound, qualifyGroup.getChildRound());
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
