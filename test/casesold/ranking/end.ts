import { expect } from 'chai';
import { describe, it } from 'mocha';

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

        const endRanking = new EndRanking(competition.getRuleSet());
        const items = endRanking.getItems(structure.getRootRound()[0]);
        expect(items[0].getName()).to.equal('jil');
        expect(items[1].getName()).to.equal('max');
        expect(items[2].getName()).to.equal('zed');
        expect(items[3].getName()).to.equal('jip');
        expect(items[4].getName()).to.equal('jan');
        expect(items[5].getName()).to.equal('jos');
        expect(items[6].getName()).to.equal('wim');
        expect(items[7].getName()).to.equal('cor');
        expect(items[8].getName()).to.equal('pim');
    });

    it('structure16rank', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure16rank, competition);

        const endRanking = new EndRanking(competition.getRuleSet());
        const items = endRanking.getItems(structure.getRootRound()[0]);
        expect(items[0].getName()).to.equal('tiem');
        expect(items[1].getName()).to.equal('kira');
        expect(items[2].getName()).to.equal('luuk');
        expect(items[3].getName()).to.equal('bart');
        expect(items[4].getName()).to.equal('mira');
        expect(items[5].getName()).to.equal('huub');
        expect(items[6].getName()).to.equal('nova');
        expect(items[7].getName()).to.equal('mats');
        expect(items[8].getName()).to.equal('bram');
        expect(items[9].getName()).to.equal('stan');
        expect(items[10].getName()).to.equal('maan');
        expect(items[11].getName()).to.equal('mila');
        expect(items[12].getName()).to.equal('noud');
        expect(items[13].getName()).to.equal('mart');
        expect(items[14].getName()).to.equal('fred');
        expect(items[15].getName()).to.equal('toon');
    });

    it('structure4rankteamup', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure4rankteamup, competition);

        const endRanking = new EndRanking(competition.getRuleSet());
        const items = endRanking.getItems(structure.getRootRound()[0]);
        expect(items[0].getName()).to.equal('rank1');
        expect(items[1].getName()).to.equal('rank2');
        expect(items[2].getName()).to.equal('rank3');
        expect(items[3].getName()).to.equal('rank4');
    });
});
