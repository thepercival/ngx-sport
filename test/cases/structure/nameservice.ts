import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyGroup } from '../../../public_api';
import { NameService } from '../../../src/nameservice';
import { getMapper } from '../../createmapper';
import { jsonCompetition } from '../../data/competition';
import { jsonStructure15 } from '../../data/structure15';
import { jsonStructure163poules } from '../../data/structure163poules';
import { jsonStructure16rank } from '../../data/structure16rank';
import { jsonStructure9 } from '../../data/structure9';

describe('Structure/NameService', () => {
    it('structure9', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure9, competition);

        structure.getRound([]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('wim');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('max');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jan');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jip');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jil');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('jos');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('zed');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('cor');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('pim');
            }
        });
        structure.getRound([QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil');
            }
        });
        structure.getRound([QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim');
            }
        });
        structure.getRound([QualifyGroup.WINNERS, QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('max');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jil');
            }
        });
        structure.getRound([QualifyGroup.WINNERS, QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('zed');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jip');
            }
        });
        structure.getRound([QualifyGroup.LOSERS, QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('jos');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('wim');
            }
        });
        structure.getRound([QualifyGroup.LOSERS, QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('cor');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('pim');
            }
        });
    });

    it('structure16rank', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure16rank, competition);

        structure.getRound([]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('maan');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('tiem');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('noud');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('nova');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('fred');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('bart');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('stan');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('huub');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('luuk');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mart');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mats');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mila');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('mira');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('kira');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D3');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('toon');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D4');
                expect(nameService.getPoulePlaceName(poulePlace, true)).to.equal('bram');
            }
        });

        structure.getRound([QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('tiem');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bart');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('luuk');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('kira');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('nova');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('huub');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mats');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mira');
            }
        });

        structure.getRound([QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('maan');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('stan');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mila');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D3');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bram');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('noud');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('fred');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('L1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mart');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('L2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D4');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('toon');
            }
        });

        structure.getRound([QualifyGroup.WINNERS, QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('M1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('tiem');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('M2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('kira');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('N1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bart');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('N2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('luuk');
            }
        });

        structure.getRound([QualifyGroup.WINNERS, QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('O1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('huub');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('O2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mira');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('P1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('nova');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('P2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mats');
            }
        });

        structure.getRound([QualifyGroup.LOSERS, QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('Q1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('stan');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('Q2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('bram');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('R1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('maan');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('R2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mila');
            }
        });

        structure.getRound([QualifyGroup.LOSERS, QualifyGroup.LOSERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('S1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('K1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('noud'); /* nr 13*/
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('S2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('L1');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('mart'); /* nr 14 */
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('T1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('K2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('fred'); /* nr 15 */
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('T2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('L2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('toon'); /* nr 16 */
            }
        });
    });

    it('structure163poules', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure163poules, competition);

        structure.getRound([]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A4');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 5) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A5');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 6) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A6');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B4');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 5) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B5');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 4) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C4');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 5) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C5');
            }
        });

        structure.getRound([QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A2');
            } else if (poulePlace.getPoule().getNumber() === 5 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B2');
            } else if (poulePlace.getPoule().getNumber() === 6 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C2');
            } else if (poulePlace.getPoule().getNumber() === 7 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A3');
            } else if (poulePlace.getPoule().getNumber() === 8 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B3');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C3');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A4');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B4');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C4');
            } else if (poulePlace.getPoule().getNumber() === 5 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A5');
            } else if (poulePlace.getPoule().getNumber() === 6 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B5');
            } else if (poulePlace.getPoule().getNumber() === 7 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('J2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C5');
            } else if (poulePlace.getPoule().getNumber() === 8 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('K2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A6');
            }
        });
    });

    it('structure15', () => {
        const competitionMapper = getMapper('competition');
        const competition = competitionMapper.toObject(jsonCompetition);

        const structureMapper = getMapper('structure');
        const structure = structureMapper.toObject(jsonStructure15, competition);

        structure.getRound([]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A1');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A2');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('A3');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B1');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B2');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('B3');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C1');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C2');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('C3');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D1');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D2');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('D3');
            } else if (poulePlace.getPoule().getNumber() === 5 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E1');
            } else if (poulePlace.getPoule().getNumber() === 5 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E2');
            } else if (poulePlace.getPoule().getNumber() === 5 && poulePlace.getNumber() === 3) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('E3');
            }
        });

        structure.getRound([QualifyGroup.WINNERS]).getPoulePlaces().forEach(poulePlace => {
            const nameService = new NameService();
            /*  */ if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('A1');
            } else if (poulePlace.getPoule().getNumber() === 1 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('F2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('E1');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('B1');
            } else if (poulePlace.getPoule().getNumber() === 2 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('G2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('c2');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('C1');
            } else if (poulePlace.getPoule().getNumber() === 3 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('H2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('d2');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 1) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I1');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('D1');
            } else if (poulePlace.getPoule().getNumber() === 4 && poulePlace.getNumber() === 2) {
                expect(nameService.getPoulePlaceName(poulePlace)).to.equal('I2');
                expect(nameService.getPoulePlaceFromName(poulePlace)).to.equal('?2');
                expect(nameService.getPoulePlaceFromName(poulePlace, true)).to.equal('b2');
            }
        });
    });
});
