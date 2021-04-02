import { expect } from 'chai';

import { QualifyGroup, QualifyTarget, Structure } from '../../../../public_api';

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

    expect(rootRound.getQualifyGroups(QualifyTarget.Winners).length).to.equal(1);

    expect(rootRound.getHorizontalPoules(QualifyTarget.Winners).length).to.equal(3);
    expect(rootRound.getHorizontalPoules(QualifyTarget.Losers).length).to.equal(3);

    // second rounds
    [QualifyTarget.Winners, QualifyTarget.Losers].forEach(qualifyTarget => {
        expect(rootRound.getBorderQualifyGroup(qualifyTarget)).to.not.equal(undefined);
        const qualifyGroup = rootRound.getBorderQualifyGroup(qualifyTarget);

        expect(qualifyGroup.getBorderPoule()).to.not.equal(undefined);
        const borderPoule = qualifyGroup.getBorderPoule();
        expect(borderPoule.getQualifyGroup()).to.equal(qualifyGroup);

        expect(qualifyGroup.getChildRound()).to.not.equal(undefined);
        const secondRound = qualifyGroup.getChildRound();

        expect(secondRound.getPoules().length).to.equal(2);
        expect(secondRound.getHorizontalPoules(QualifyTarget.Winners).length).to.equal(2);
        expect(secondRound.getHorizontalPoules(QualifyTarget.Losers).length).to.equal(2);
        expect(secondRound.getNrOfPlaces()).to.equal(4);

        // third rounds
        [QualifyTarget.Winners, QualifyTarget.Losers].forEach(qualifyTarget => {
            expect(secondRound.getBorderQualifyGroup(qualifyTarget)).to.not.equal(undefined);
            const qualifyGroup = secondRound.getBorderQualifyGroup(qualifyTarget);

            expect(qualifyGroup.getBorderPoule()).to.not.equal(undefined);
            const borderPoule = qualifyGroup.getBorderPoule();
            expect(borderPoule.getQualifyGroup()).to.equal(qualifyGroup);

            expect(qualifyGroup.getChildRound()).to.not.equal(undefined);
            const thirdRound = qualifyGroup.getChildRound();

            expect(thirdRound.getPoules().length).to.equal(1);
            expect(thirdRound.getHorizontalPoules(QualifyTarget.Winners).length).to.equal(2);
            expect(thirdRound.getHorizontalPoules(QualifyTarget.Losers).length).to.equal(2);
            expect(thirdRound.getNrOfPlaces()).to.equal(2);
        });
    });
}