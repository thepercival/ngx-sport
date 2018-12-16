import { jsonGuust3x3crossfinals } from '../../data/guust-3x3-crossfinals';
import { getMapper } from '../../createmapper';

import { expect, should } from 'chai';


// maak een static functie die een mapper maakt!!!
// voor fctoernooi gebruik gewoon injectable

describe('Ranking/End 3x3 crossfinals', () => {
    const competitionMapper = getMapper('competition');
    const jsonCompetition = {};
    const competition = competitionMapper.toObject(jsonCompetition);

    const structureMapper = getMapper('structure');
    const structure = structureMapper.toObject(jsonGuust3x3crossfinals, competition);

    it('check inheritance', () => {
        // const fifa = new Association('FIFA');
        // const uefa = new Association('UEFA', fifa);
        // const knvb = new Association('KNVB', uefa);
        // expect(sportRepos).to.equal({});
        // expect(uefa.getAncestors().length).to.equal(1);
        // expect(fifa.getAncestors().length).to.equal(0);
      });
});
