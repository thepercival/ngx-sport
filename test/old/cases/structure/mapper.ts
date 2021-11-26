import { describe, it } from 'mocha';

import { StructureMapper } from '../../../../public-api';
import { getMapper } from '../../../helpers/singletonCreator';
import { jsonCompetition } from '../../../data/competition';
import { jsonStructure332a } from '../../data/structure/mapper/structure-332-a';
import { check332astructure } from './332a';


describe('Structure/Mapper', () => {
    it('332a', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper: StructureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure332a, competition);

        check332astructure(structure);
    });
});
