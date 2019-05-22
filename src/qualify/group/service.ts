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
        const horizontalPoules = qualifyGroup.getHorizontalPoules();
        const idx = horizontalPoules.indexOf(horizontalPoule);
        if (idx < 0) {
            throw new Error('de horizontale poule kan niet gevonden worden');
        }
        const splittedPoules: HorizontalPoule[] = horizontalPoules.splice(idx);

        // vanaf hier is de oude goed, alleen de nieuwe op een bepaalde plaats ingevoegen
        // en de volgende qualifyGroups ophogen
        const round = qualifyGroup.getRound();
        const newQualifyGroup = new QualifyGroup(round, qualifyGroup.getWinnersOrLosers(), qualifyGroup.getNumber() + 1);
        this.renumber(newQualifyGroup.getRound(), qualifyGroup.getWinnersOrLosers());
        const nextRoundNumber = round.getNumber().hasNext() ? round.getNumber().getNext() : this.structureService.createRoundNumber(round);
        const newChildRound = new Round(nextRoundNumber, newQualifyGroup);
        newQualifyGroup.setChildRound(newChildRound);
        // structureService.updateRound(newChildRound, nrOfPlaces: number, nrOfPoules: number)
        // newChildRound

        splittedPoules.forEach(splittedPoule => {
            splittedPoule.setQualifyGroup(newQualifyGroup);
        });
    }

    protected renumber(round: Round, winnersOrLosers: number) {
        let number = 1;
        round.getQualifyGroups(winnersOrLosers).forEach(qualifyGroup => {
            qualifyGroup.setNumber(number++);
        });
    }
}