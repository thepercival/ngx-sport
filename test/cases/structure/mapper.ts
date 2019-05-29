import { describe, it } from 'mocha';

import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructure1 } from '../../data/structure/mapper/structure1';


describe('Structure/Mapper', () => {
    it('performance', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure1, competition);
    });
});
