import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Association } from '../../public-api';

describe('Assocation', () => {
    it('Inheritance', () => {
        const fifa = new Association('FIFA');
        const uefa = new Association('UEFA', fifa);
        const knvb = new Association('KNVB', uefa);
        expect(knvb.getAncestors().length).to.equal(2);
        expect(uefa.getAncestors().length).to.equal(1);
        expect(fifa.getAncestors().length).to.equal(0);
    });

    it('get/set name', () => {
        const association = new Association('FIFA');
        association.setName('MyAssociation');
        expect(association.getName()).to.equal('MyAssociation');
    });

    it('get/set description', () => {
        const association = new Association('FIFA');
        association.setDescription('MyAssociation');
        expect(association.getDescription()).to.equal('MyAssociation');
    });

    it('set itself as parent', () => {
        const child = new Association('child');
        child.setParent(child);
        expect(child.getParent()).to.equal(undefined);
    });

    it('update children when switchting parent', () => {
        const oldParent = new Association('oldParent');
        const child = new Association('child', oldParent);
        const newParent = new Association('newParent');
        child.setParent(newParent);
        expect(oldParent.getChildren().length).to.equal(0);
    });
});
