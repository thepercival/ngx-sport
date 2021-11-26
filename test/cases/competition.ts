import { expect } from 'chai';
import { describe, it } from 'mocha';
import { Association, Competition, League, Season, State } from '../../public-api';

describe('Competition', () => {
    it('StartDateTime/Season', () => {
        const startDateTime = new Date('2021-08-01');
        const endDateTime = new Date('2022-06-01');
        const season = new Season('2021/2022', startDateTime, endDateTime);
        const competition = new Competition(
            new League(new Association('FIFA'), 'Eredivisie'),
            season
        );
        expect(competition.getStartDateTime().getTime()).to.equal(startDateTime.getTime());
        expect(competition.getSeason()).to.equal(season);
    });

    it('initial state', () => {
        const startDateTime = new Date('2021-08-01');
        const endDateTime = new Date('2022-06-01');
        const season = new Season('2021/2022', startDateTime, endDateTime);
        const competition = new Competition(
            new League(new Association('FIFA'), 'Eredivisie'),
            season
        );
        expect(competition.getState()).to.equal(State.Created);
    });

    it('name', () => {
        const startDateTime = new Date('2021-08-01');
        const endDateTime = new Date('2022-06-01');
        const season = new Season('2021/2022', startDateTime, endDateTime);
        const competition = new Competition(
            new League(new Association('FIFA'), 'Eredivisie'),
            season
        );
        expect(competition.getName()).to.equal('Eredivisie 2021/2022');
    });
});
