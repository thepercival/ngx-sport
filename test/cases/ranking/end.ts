import { jsonStructure9 } from '../../data/structure9';
import { jsonStructure16 } from '../../data/structure16';
import { jsonCompetition } from '../../data/competition';
import { getMapper } from '../../createmapper';
import { EndRanking } from '../../../src/ranking/end';

import { expect, should } from 'chai';

describe('Ranking/End', () => {
    it('structure9', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure9, competition);

        const endRanking = new EndRanking();
        const items = endRanking.getItems( structure.getRootRound() );
        expect(items[0].getPoulePlace().getTeam().getName()).to.equal('jil');
        expect(items[1].getPoulePlace().getTeam().getName()).to.equal('max');
        expect(items[2].getPoulePlace().getTeam().getName()).to.equal('zed');
        expect(items[3].getPoulePlace().getTeam().getName()).to.equal('jip');
        expect(items[4].getPoulePlace().getTeam().getName()).to.equal('jan');
        expect(items[5].getPoulePlace().getTeam().getName()).to.equal('jos');
        expect(items[6].getPoulePlace().getTeam().getName()).to.equal('wim');
        expect(items[7].getPoulePlace().getTeam().getName()).to.equal('cor');
        expect(items[8].getPoulePlace().getTeam().getName()).to.equal('pim');
    });

    /*it('structure16', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure16, competition);

        const endRanking = new EndRanking();
        const items = endRanking.getItems( structure.getRootRound() );
        expect(items[0].getPoulePlace().getTeam().getName()).to.equal('jil');
        expect(items[1].getPoulePlace().getTeam().getName()).to.equal('max');
        expect(items[2].getPoulePlace().getTeam().getName()).to.equal('zed');
        expect(items[3].getPoulePlace().getTeam().getName()).to.equal('jip');
        expect(items[4].getPoulePlace().getTeam().getName()).to.equal('jan');
        expect(items[5].getPoulePlace().getTeam().getName()).to.equal('jos');
        expect(items[6].getPoulePlace().getTeam().getName()).to.equal('wim');
        expect(items[7].getPoulePlace().getTeam().getName()).to.equal('cor');
        expect(items[8].getPoulePlace().getTeam().getName()).to.equal('pim');
        expect(items[9].getPoulePlace().getTeam().getName()).to.equal('zed');
        expect(items[10].getPoulePlace().getTeam().getName()).to.equal('jip');
        expect(items[11].getPoulePlace().getTeam().getName()).to.equal('jan');
        expect(items[12].getPoulePlace().getTeam().getName()).to.equal('jos');
        expect(items[13].getPoulePlace().getTeam().getName()).to.equal('wim');
        expect(items[14].getPoulePlace().getTeam().getName()).to.equal('cor');
        expect(items[15].getPoulePlace().getTeam().getName()).to.equal('pim');
    });*/
});
