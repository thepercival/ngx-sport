import { expect } from 'chai';

import { Structure } from '../../../public_api';
import { QualifyGroup } from '../../../tmp/public_api';

export const check332astructure = (structure: Structure) => {
    // roundnumbers
    expect(structure.getFirstRoundNumber()).to.not.equal(undefined);
    const firstRoundNumber = structure.getFirstRoundNumber();
    expect(firstRoundNumber.getRounds().length).to.equal(1);

    expect(firstRoundNumber.hasNext()).to.equal(true);
    const secondRoundNumber = firstRoundNumber.getNext();
    expect(secondRoundNumber.getRounds().length).to.equal(2);

    expect(secondRoundNumber.hasNext()).to.equal(true);
    const thirdRoundNumber = secondRoundNumber.getNext();
    expect(thirdRoundNumber.getRounds().length).to.equal(4);

    expect(thirdRoundNumber.hasNext()).to.equal(false);

    // round 1
    expect(structure.getRootRound()).to.not.equal(undefined);
    const rootRound = structure.getRootRound();

    expect(rootRound.getQualifyGroups(QualifyGroup.WINNERS).length).to.equal(1);

    expect(rootRound.getHorizontalPoules(QualifyGroup.WINNERS).length).to.equal(3);
    expect(rootRound.getHorizontalPoules(QualifyGroup.LOSERS).length).to.equal(3);

    // second rounds
    [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
        expect(rootRound.getBorderQualifyGroup(winnersOrLosers)).to.not.equal(undefined);
        const qualifyGroup = rootRound.getBorderQualifyGroup(winnersOrLosers);

        expect(qualifyGroup.getBorderPoule()).to.not.equal(undefined);
        const borderPoule = qualifyGroup.getBorderPoule();
        expect(borderPoule.getQualifyGroup()).to.equal(qualifyGroup);

        expect(qualifyGroup.getChildRound()).to.not.equal(undefined);
        const secondRound = qualifyGroup.getChildRound();

        expect(secondRound.getPoules().length).to.equal(2);
        expect(secondRound.getHorizontalPoules(QualifyGroup.WINNERS).length).to.equal(2);
        expect(secondRound.getHorizontalPoules(QualifyGroup.LOSERS).length).to.equal(2);
        expect(secondRound.getNrOfPlaces()).to.equal(4);

        // third rounds
        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            expect(secondRound.getBorderQualifyGroup(winnersOrLosers)).to.not.equal(undefined);
            const qualifyGroup = secondRound.getBorderQualifyGroup(winnersOrLosers);

            expect(qualifyGroup.getBorderPoule()).to.not.equal(undefined);
            const borderPoule = qualifyGroup.getBorderPoule();
            expect(borderPoule.getQualifyGroup()).to.equal(qualifyGroup);

            expect(qualifyGroup.getChildRound()).to.not.equal(undefined);
            const thirdRound = qualifyGroup.getChildRound();

            expect(thirdRound.getPoules().length).to.equal(1);
            expect(thirdRound.getHorizontalPoules(QualifyGroup.WINNERS).length).to.equal(2);
            expect(thirdRound.getHorizontalPoules(QualifyGroup.LOSERS).length).to.equal(2);
            expect(thirdRound.getNrOfPlaces()).to.equal(2);
        });
    });
}