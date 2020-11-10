import { RoundNumber } from '../../round/number';
import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '..//group';
import { StructureService } from '../../structure/service';
import { QualifyGroup } from '../group';

export class QualifyGroupService {

    constructor(private structureService: StructureService
    ) {

    }

    splitFrom(horizontalPoule: HorizontalPoule) {
        const qualifyGroup = horizontalPoule.getQualifyGroup();
        if (qualifyGroup === undefined) {
            throw new Error('de kwalificatiegroep kan niet gevonden worden');
        }
        const childRound = qualifyGroup.getChildRound();
        if (childRound === undefined) {
            return;
        }
        const nrOfPlacesChildRound = childRound.getNrOfPlaces();
        const horizontalPoules = qualifyGroup.getHorizontalPoules();
        const idx = horizontalPoules.indexOf(horizontalPoule);
        if (idx < 0) {
            throw new Error('de horizontale poule kan niet gevonden worden');
        }
        const splittedPoules: HorizontalPoule[] = horizontalPoules.splice(idx);
        const round = qualifyGroup.getRound();
        const newNrOfQualifiers = horizontalPoules.length * round.getPoules().length;
        let newNrOfPoules = this.structureService.calculateNewNrOfPoules(qualifyGroup, newNrOfQualifiers);
        while ((newNrOfQualifiers / newNrOfPoules) < 2) {
            newNrOfPoules--;
        }
        this.structureService.updateRound(childRound, newNrOfQualifiers, newNrOfPoules);

        let nextRoundNumber: RoundNumber | undefined = round.getNumber().getNext();
        if (!nextRoundNumber) {
            nextRoundNumber = this.structureService.createRoundNumber(round);
        }
        const newQualifyGroup = new QualifyGroup(round, qualifyGroup.getWinnersOrLosers(), nextRoundNumber /*+ 1* is index*/);
        this.renumber(round, qualifyGroup.getWinnersOrLosers());
        const splittedNrOfQualifiers = nrOfPlacesChildRound - newNrOfQualifiers;
        let splittedNrOfPoules = this.structureService.calculateNewNrOfPoules(qualifyGroup, newNrOfQualifiers);
        while ((splittedNrOfQualifiers / splittedNrOfPoules) < 2) {
            splittedNrOfPoules--;
        }
        this.structureService.updateRound(newQualifyGroup.getChildRound(), splittedNrOfQualifiers, splittedNrOfPoules);

        splittedPoules.forEach(splittedPoule => {
            splittedPoule.setQualifyGroup(newQualifyGroup);
        });
    }

    merge(firstQualifyGroup: QualifyGroup, secondQualifyGroup: QualifyGroup) {
        const round = firstQualifyGroup.getRound();
        const qualifyGroups = round.getQualifyGroups(firstQualifyGroup.getWinnersOrLosers());
        const idx = qualifyGroups.indexOf(secondQualifyGroup);
        qualifyGroups.splice(idx, 1);
        this.renumber(round, firstQualifyGroup.getWinnersOrLosers());

        secondQualifyGroup.getHorizontalPoules().splice(idx, 1);

        const removedPoules = secondQualifyGroup.getHorizontalPoules();
        removedPoules.forEach(removedPoule => {
            removedPoule.setQualifyGroup(firstQualifyGroup);
        });
    }

    protected renumber(round: Round, winnersOrLosers: number) {
        let number = 1;
        round.getQualifyGroups(winnersOrLosers).forEach(qualifyGroup => {
            qualifyGroup.setNumber(number++);
        });
    }
}
