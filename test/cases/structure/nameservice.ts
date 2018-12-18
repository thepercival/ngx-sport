import { expect } from 'chai';

import { PoulePlace } from '../../../src/pouleplace';
import { Round } from '../../../src/round';
import { StructureNameService } from '../../../src/structure/nameservice';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructure9 } from '../../data/structure9';


describe('Structure/NameService', () => {
    it('structure9', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure9, competition);

        const nameService = new StructureNameService();
        const rootRound = structure.getRootRound();

        checkNames(rootRound);
    });

    function checkNames(round: Round) {
        round.getPoulePlaces().forEach(poulePlace => {
            const nameService = new StructureNameService();
            /*    */ if (locationEquals(poulePlace, round, [1, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('wim');
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('max');
            } else if (locationEquals(poulePlace, round, [1, 3])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jan');
            } else if (locationEquals(poulePlace, round, [2, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jip');
            } else if (locationEquals(poulePlace, round, [2, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jil');
            } else if (locationEquals(poulePlace, round, [2, 3])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jos');
            } else if (locationEquals(poulePlace, round, [3, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('zed');
            } else if (locationEquals(poulePlace, round, [3, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('cor');
            } else if (locationEquals(poulePlace, round, [3, 3])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('pim');
            } else if (locationEquals(poulePlace, round, [1, 1])) { /* roundnumber 2 */
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max');
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed');
            } else if (locationEquals(poulePlace, round, [2, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip');
            } else if (locationEquals(poulePlace, round, [2, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil');
            } else if (locationEquals(poulePlace, round, [1, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor');
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos');
            } else if (locationEquals(poulePlace, round, [2, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim');
            } else if (locationEquals(poulePlace, round, [2, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim');
            } else if (locationEquals(poulePlace, round, [1, 1])) { /* roundnumber 3 */ /* w, w */
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil'); /* nr 1 */
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max'); /* nr 2 */
            } else if (locationEquals(poulePlace, round, [1, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1'); /* w, l */
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed'); /* nr 3 */
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip'); /* nr 4 */
            } else if (locationEquals(poulePlace, round, [1, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1'); /* l, w */
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos'); /* nr 6 */
            } else if (locationEquals(poulePlace, round, [1, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim'); /* nr 7 */
            } else if (locationEquals(poulePlace, round, [1, 1])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1'); /* l, l */
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor'); /* nr 8 */
            } else if (locationEquals(poulePlace, round, [2, 2])) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim'); /* nr 9 */
            }
        });
        round.getChildRounds().forEach(childRound => checkNames(childRound));
    }

    function locationEquals(poulePlace: PoulePlace, round: Round, localtion: number[]): boolean {
        return (
            poulePlace.getPoule().getRound().getPath() === round.getPath() &&
            poulePlace.getPoule().getNumber() === localtion[0] &&
            poulePlace.getNumber() === localtion[1]);
    }
});
