import { describe, it } from 'mocha';

import { StructureService } from '../../../public_api';
import { QualifyGroup } from '../../../tmp/public_api';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { check332astructure } from './332a';

describe('Structure/Service', () => {
    it('332a', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 8, 3);
        const rootRound = structure.getRootRound();

        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.WINNERS); }
        for (let i = 1; i < 4; i++) { structureService.addQualifier(rootRound, QualifyGroup.LOSERS); }

        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            const childRound = rootRound.getBorderQualifyGroup(winnersOrLosers).getChildRound();
            structureService.addQualifier(childRound, QualifyGroup.WINNERS);
            structureService.addQualifier(childRound, QualifyGroup.LOSERS);
        });

        check332astructure(structure);
    });
});
