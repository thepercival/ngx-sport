import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '../../round';
import { StructureService } from '../../structure/service';
import { QualifyGroup } from '../group';

export class QualifyGroupService {

    constructor(private structureService: StructureService
    ) {

    }

    splitFrom(horizontalPoule: HorizontalPoule) {
        const qualifyGroup = horizontalPoule.getQualifyGroup();
        const nrOfPlacesChildRound = qualifyGroup.getChildRound().getNrOfPlaces();
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
        this.structureService.updateRound(qualifyGroup.getChildRound(), newNrOfQualifiers, newNrOfPoules);

        const newQualifyGroup = new QualifyGroup(round, qualifyGroup.getWinnersOrLosers(), qualifyGroup.getNumber() /*+ 1* is index*/);
        this.renumber(round, qualifyGroup.getWinnersOrLosers());
        const nextRoundNumber = round.getNumber().hasNext() ? round.getNumber().getNext() : this.structureService.createRoundNumber(round);
        const newChildRound = new Round(nextRoundNumber, newQualifyGroup);
        const splittedNrOfQualifiers = nrOfPlacesChildRound - newNrOfQualifiers;
        let splittedNrOfPoules = this.structureService.calculateNewNrOfPoules(qualifyGroup, newNrOfQualifiers);
        while ((splittedNrOfQualifiers / splittedNrOfPoules) < 2) {
            splittedNrOfPoules--;
        }
        this.structureService.updateRound(newChildRound, splittedNrOfQualifiers, splittedNrOfPoules);

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
