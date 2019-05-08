import { JsonRound, RoundMapper } from '../../round/mapper';
import { Round } from '../../round';
import { QualifyPoule } from '../poule';

export class QualifyPouleMapper {
    constructor(private roundMapper: RoundMapper) { }

    toObject(json: JsonQualifyPoule, round: Round ): QualifyPoule {
        const qualifyPoule = new QualifyPoule(round);
        qualifyPoule.setId(json.id);
        qualifyPoule.setWinnersOrLosers(json.winnersOrLosers);
        qualifyPoule.setNumber(json.number);
        qualifyPoule.setNrOfHorizontalPoules(json.nrOfHorizontalPoules);
        qualifyPoule.setChildRound( 
            this.roundMapper.toObject(
                json.childRound, 
                round.getNumber().getNext(),
                qualifyPoule/*,
                zoek hier de bestaande ronde obv json                */
            ) 
        );
        return qualifyPoule;
    }

    toJson(qualifyPoule: QualifyPoule): JsonQualifyPoule {
        return {
            id: qualifyPoule.getId(),
            winnersOrLosers: qualifyPoule.getWinnersOrLosers(),
            number: qualifyPoule.getNumber(),
            nrOfHorizontalPoules: qualifyPoule.getNrOfHorizontalPoules(),
            childRound: this.roundMapper.toJson(qualifyPoule.getChildRound())
        };
    }
}

export interface JsonQualifyPoule {
    id?: number;
    winnersOrLosers: number;
    number: number;
    nrOfHorizontalPoules: number;
    childRound: JsonRound;
}