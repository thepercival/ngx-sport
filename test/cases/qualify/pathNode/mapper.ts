import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QualifyPathNodeMapper, QualifyTarget } from '../../../../public-api';

describe('qualifyNodeMapper', () => {

    it('testOnlyRoot', () => {
        const pathNodeMapper = new QualifyPathNodeMapper();
        const rootPathNode = pathNodeMapper.toObject('1');
        
        //   self:: assertInstanceOf(Structure\PathNode:: class, $rootPathNode);
        expect(rootPathNode).not.to.be.undefined;
        expect(rootPathNode.getQualifyTarget()).to.be.undefined;
        
        //     self:: assertSame(1, $rootPathNode -> getQualifyGroupNumber());
        expect(rootPathNode.getQualifyGroupNumber()).to.equal(1);

        //     self:: assertFalse($rootPathNode -> hasPrevious());
        expect(rootPathNode.hasPrevious()).to.be.false;
       
    });

    it('testEmpty', () => {
        const pathNodeMapper = new QualifyPathNodeMapper();
        const rootPathNode = pathNodeMapper.toObject('');
        expect(rootPathNode).to.be.undefined;
    });

    it('testEmptyInvalid', () => {
        const pathNodeMapper = new QualifyPathNodeMapper();
        expect(function () {
            pathNodeMapper.toObject('ASD')
        }).to.throw();        
    });

    it('test3Rounds', () => {
        const pathNodeMapper = new QualifyPathNodeMapper();
        const leafPathNode = pathNodeMapper.toObject('1W2L3');
        expect(leafPathNode).not.to.be.undefined;
        expect(leafPathNode.getQualifyTarget()).to.equal(QualifyTarget.Losers);

        const middlePathNode = leafPathNode.getPrevious();
        expect(middlePathNode).not.to.be.undefined;
        expect(middlePathNode.getQualifyTarget()).to.equal(QualifyTarget.Winners);

        const rootPathNode = middlePathNode.getPrevious();
        expect(rootPathNode).not.to.be.undefined;
        expect(rootPathNode.getQualifyTarget()).to.equal(undefined);
        expect(rootPathNode.getPrevious()).to.equal(undefined);
    });

    it('testMoreThan9QualifyGroups', () => {
        const pathNodeMapper = new QualifyPathNodeMapper();
        const leafPathNode = pathNodeMapper.toObject('11W12L13');
        expect(leafPathNode).not.to.be.undefined;
        expect(leafPathNode.getQualifyTarget()).to.equal(QualifyTarget.Losers);
        expect(leafPathNode.getQualifyGroupNumber()).to.equal(13);

        const middlePathNode = leafPathNode.getPrevious();
        expect(middlePathNode).not.to.be.undefined;
        expect(middlePathNode.getQualifyTarget()).to.equal(QualifyTarget.Winners);
        expect(middlePathNode.getQualifyGroupNumber()).to.equal(12);

        const rootPathNode = middlePathNode.getPrevious();
        expect(rootPathNode).not.to.be.undefined;
        expect(rootPathNode.getQualifyTarget()).to.equal(undefined);
        expect(rootPathNode.getQualifyGroupNumber()).to.equal(11);

        expect(rootPathNode.getPrevious()).to.equal(undefined);
        
    });
});
