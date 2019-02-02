import { expect } from 'chai';

import { EndRanking } from '../../../src/ranking/end';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructure16rank } from '../../data/structure16rank';
import { jsonStructure4rankteamup } from '../../data/structure4rankteamup';
import { jsonStructure9 } from '../../data/structure9';

describe('Ranking/End', () => {
    it('structure9', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure9, competition);

        const endRanking = new EndRanking();
        const items = endRanking.getItems(structure.getRootRound());
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

    it('structure16rank', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure16rank, competition);

        const endRanking = new EndRanking();
        const items = endRanking.getItems(structure.getRootRound());
        expect(items[0].getPoulePlace().getTeam().getName()).to.equal('tiem');
        expect(items[1].getPoulePlace().getTeam().getName()).to.equal('kira');
        expect(items[2].getPoulePlace().getTeam().getName()).to.equal('luuk');
        expect(items[3].getPoulePlace().getTeam().getName()).to.equal('bart');
        expect(items[4].getPoulePlace().getTeam().getName()).to.equal('mira');
        expect(items[5].getPoulePlace().getTeam().getName()).to.equal('huub');
        expect(items[6].getPoulePlace().getTeam().getName()).to.equal('nova');
        expect(items[7].getPoulePlace().getTeam().getName()).to.equal('mats');
        expect(items[8].getPoulePlace().getTeam().getName()).to.equal('bram');
        expect(items[9].getPoulePlace().getTeam().getName()).to.equal('stan');
        expect(items[10].getPoulePlace().getTeam().getName()).to.equal('maan');
        expect(items[11].getPoulePlace().getTeam().getName()).to.equal('mila');
        expect(items[12].getPoulePlace().getTeam().getName()).to.equal('noud');
        expect(items[13].getPoulePlace().getTeam().getName()).to.equal('mart');
        expect(items[14].getPoulePlace().getTeam().getName()).to.equal('fred');
        expect(items[15].getPoulePlace().getTeam().getName()).to.equal('toon');
    });

    it('structure4rankteamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure4rankteamup, competition);

        const endRanking = new EndRanking();
        const items = endRanking.getItems(structure.getRootRound());
        expect(items[0].getPoulePlace().getTeam().getName()).to.equal('rank1');
        expect(items[1].getPoulePlace().getTeam().getName()).to.equal('rank2');
        expect(items[2].getPoulePlace().getTeam().getName()).to.equal('rank3');
        expect(items[3].getPoulePlace().getTeam().getName()).to.equal('rank4');
    });
});
