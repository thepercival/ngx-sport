import { expect } from 'chai';

import { PoulePlace } from '../../../src/pouleplace';
import { Round } from '../../../src/round';
import { NameService } from '../../../src/nameservice';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructure9 } from '../../data/structure9';
import { jsonStructure16rank } from '../../data/structure16rank';

describe('Structure/NameService', () => {
    it('structure9', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure9, competition);

        structure.getRoundByPath( [] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('wim');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('max');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jan');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jip');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jil');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jos');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('zed');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('cor');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('pim');
            }
        } );
        structure.getRoundByPath( [Round.WINNERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil');
            }
        });
        structure.getRoundByPath( [Round.LOSERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim');
            }
        });
        structure.getRoundByPath( [Round.WINNERS, Round.WINNERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil'); /* nr 1 */
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max'); /* nr 2 */
            }
        });
        structure.getRoundByPath( [Round.WINNERS, Round.LOSERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed'); /* nr 3 */
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip'); /* nr 4 */
            }
        });
        structure.getRoundByPath( [Round.LOSERS, Round.WINNERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos'); /* nr 6 */
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim'); /* nr 7 */
            }
        });
        structure.getRoundByPath( [Round.LOSERS, Round.LOSERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor'); /* nr 8 */
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim'); /* nr 9 */
            }
        });
    });

    it('structure16rank', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure16rank, competition);

        structure.getRoundByPath( [] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('maan');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('tiem');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('noud');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 4 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('nova');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('fred');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('bart');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('stan');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 4 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('huub');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('luuk');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mart');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mats');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 4 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mila');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mira');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('kira');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 3 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('toon');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 4 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('bram');
            }
        });

        structure.getRoundByPath( [Round.WINNERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('tiem');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bart');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('luuk');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('kira');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('nova');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('huub');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mats');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mira');
            }
        });

        structure.getRoundByPath( [Round.LOSERS] ).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('maan');
            } else if ( poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('stan');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mila');
            } else if ( poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bram');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('noud');
            } else if ( poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('fred');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('L1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mart');
            } else if ( poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2 ) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('L2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('toon');
            }
        });
    
        hier verder!!
        else if (locationEquals(poulePlace, round, [1, 1])) { /* roundnumber 3 */ /* w, w */
            expect(nameService.getPoulePlaceName(poulePlace)).to.equal('M1');
            expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
            expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil'); /* nr 1 */
        } else if (locationEquals(poulePlace, round, [1, 2])) {
            expect(nameService.getPoulePlaceName(poulePlace)).to.equal('M2');
            expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
            expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max'); /* nr 2 */
        } else if (locationEquals(poulePlace, round, [1, 1])) { /* w, l */
            expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
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
});
