import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyTarget, NameService } from '../../public-api';

describe('NameService', () => {

    it('winnerslosers description', () => {
        const nameService = new NameService();

        expect(nameService.getQualifyTargetDescription(QualifyTarget.Winners)).to.equal('winnaar');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Losers)).to.equal('verliezer');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Winners, true)).to.equal('winnaars');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Losers, true)).to.equal('verliezers');
        expect(nameService.getQualifyTargetDescription(QualifyTarget.Dropouts)).to.equal('');
    });
});
