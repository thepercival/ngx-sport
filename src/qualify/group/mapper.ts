import { Round } from '../../round';
import { JsonRound, RoundMapper } from '../../round/mapper';
import { QualifyGroup } from '../group';

export class QualifyGroupMapper {
    constructor(private roundMapper: RoundMapper) { }

    toObject(json: JsonQualifyGroup, round: Round): QualifyGroup {
        const qualifyGroup = new QualifyGroup(round);
        qualifyGroup.setId(json.id);
        qualifyGroup.setWinnersOrLosers(json.winnersOrLosers);
        qualifyGroup.setNumber(json.number);
        qualifyGroup.setNrOfHorizontalPoules(json.nrOfHorizontalPoules);
        qualifyGroup.setChildRound(
            this.roundMapper.toObject(
                json.childRound,
                round.getNumber().getNext(),
                qualifyGroup/*,
                zoek hier de bestaande ronde obv json                */
            )
        );
        return qualifyGroup;
    }

    toJson(qualifyGroup: QualifyGroup): JsonQualifyGroup {
        return {
            id: qualifyGroup.getId(),
            winnersOrLosers: qualifyGroup.getWinnersOrLosers(),
            number: qualifyGroup.getNumber(),
            nrOfHorizontalPoules: qualifyGroup.getNrOfHorizontalPoules(),
            childRound: this.roundMapper.toJson(qualifyGroup.getChildRound())
        };
    }
}

export interface JsonQualifyGroup {
    id?: number;
    winnersOrLosers: number;
    number: number;
    nrOfHorizontalPoules: number;
    childRound: JsonRound;
}