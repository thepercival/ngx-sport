import { expect } from 'chai';
import { describe, it } from 'mocha';

import { StructureService } from '../../../public_api';
import { PlanningService } from '../../../src/planning/service';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';

describe('Planning/Service', () => {

    it('game creation', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureService = new StructureService();
        const structure = structureService.create(competition, 9, 3);
        const rootRound = structure.getRootRound();

        const planningService = new PlanningService(competition);
        planningService.create(rootRound.getNumber());

        expect(rootRound.getGames().length).to.equal(9);
    });
});
