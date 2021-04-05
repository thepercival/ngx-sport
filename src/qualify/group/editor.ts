import { RoundNumber } from '../../round/number';
import { HorizontalPoule } from '../../poule/horizontal';
import { Round } from '../group';
import { StructureEditor } from '../../structure/editor';
import { QualifyGroup } from '../group';
import { QualifyTarget } from '../target';
import { Poule } from '../../poule';
import { QualifyRuleSingle } from '../rule/single';
import { BalancedPouleStructure } from '../../poule/structure/balanced';

export class QualifyGroupEditor {

    constructor(private structureEditor: StructureEditor) {

    }

    // horizontalPoule is split-points, from which qualifyGroup
    splitQualifyGroupFrom(qualifyGroup: QualifyGroup, singleRule: QualifyRuleSingle) {
        throw new Error('implement splitQualifyGroupFrom');
        // const childRound = qualifyGroup.getChildRound();


        // // split rules at singleRule
        // const parentRound = qualifyGroup.getParentRound();
        // const nrOfPlacesChildRound = childRound.getNrOfPlaces();

        // // TODOSTRUCTURE CDK
        // // ipv newNrOfToPlaces kun je ook een goedepoulestructuur ophalen, deze kun je dan meteen meegeven aan updateRound(r36)
        // const newNrOfToPlaces = singleRule.getNrOfToPlaces() + singleRule.getNrOfToPlacesTargetSide(QualifyTarget.Losers);
        // singleRule.detach();

        // // updateRound childround
        // {
        //     let newNrOfPoules = this.structureEditor.calculateNewNrOfPoules(qualifyGroup, newNrOfToPlaces);
        //     while ((newNrOfToPlaces / newNrOfPoules) < 2) {
        //         newNrOfPoules--;
        //     }
        //     this.structureEditor.updateRound(childRound, newNrOfToPlaces, newNrOfPoules);
        // }

        // // get next (new) RoundNumber
        // let nextRoundNumber: RoundNumber | undefined = parentRound.getNumber().getNext();
        // if (!nextRoundNumber) {
        //     nextRoundNumber = parentRound.getNumber().createNext();
        // }
        // // create new QualifyGroup
        // const newQualifyGroup = new QualifyGroup(parentRound, qualifyGroup.getTarget(), nextRoundNumber /*+ 1* is index*/);
        // // renumber qualifyGroups
        // this.renumber(parentRound, qualifyGroup.getTarget());
        // // fill childRound
        // const newChildPouleStructure = childRound.createPouleStructure().addPlace();


        // const splittedNrOfQualifiers = nrOfPlacesChildRound - newNrOfToPlaces;
        // let splittedNrOfPoules = this.structureEditor.calculateNewNrOfPoules(qualifyGroup, newNrOfToPlaces);
        // while ((splittedNrOfQualifiers / splittedNrOfPoules) < 2) {
        //     splittedNrOfPoules--;
        // }
        // this.structureEditor.updateRound(childRound, splittedNrOfQualifiers, splittedNrOfPoules);

        // // rest hor poules to qualifyGroup
        // // splittedHorPoules.forEach((splittedHorPoule: HorizontalPoule) => {
        // //     splittedHorPoule.setQualifyGroup(newQualifyGroup);
        // // });
    }

    mergeQualifyGroups(firstQualifyGroup: QualifyGroup, secondQualifyGroup: QualifyGroup) {
        throw new Error('mergeQualifyGroups');
        // const parentRound = firstQualifyGroup.getParentRound();
        // // qualifyGroups should be list with nextprevious

        // // secondQualifyGroup

        // secondQualifyGroup.detach();
        // this.renumber(parentRound, firstQualifyGroup.getTarget());

        // // secondQualifyGroup.getHorizontalPoules().splice(idx, 1);

        // // const removedHorPoules = secondQualifyGroup.getHorizontalPoules();
        // // removedHorPoules.forEach((removedHorPoule: HorizontalPoule) => {
        // //     removedHorPoule.setQualifyGroup(firstQualifyGroup);
        // // });
    }

    protected renumber(round: Round, qualifyTarget: QualifyTarget) {
        let number = 1;
        round.getQualifyGroups(qualifyTarget).forEach(qualifyGroup => {
            qualifyGroup.setNumber(number++);
        });
    }
}
