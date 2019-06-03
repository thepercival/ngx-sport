import { PoulePlace } from '../../pouleplace';
import { QualifyGroup } from '../../qualify/group';
import { QualifyRule } from '../../qualify/rule';
import { QualifyRuleMultiple } from '../../qualify/rule/multiple';
import { QualifyRuleSingle } from '../../qualify/rule/single';
import { Round } from '../../round';
import { QualifyReservationService } from '../reservationservice';
import { QualifyRuleQueue } from './queue';

export class QualifyRuleService {

    constructor(private round: Round) {
    }

    recreateTo() {
        this.removeTo(this.round);
        this.createTo(this.round);
    }

    recreateFrom() {
        const parentRound = this.round.getParent();
        if (parentRound === undefined) {
            return;
        }
        this.removeTo(parentRound);
        this.createTo(parentRound);
    }

    protected removeTo(round: Round) {
        round.getPlaces().forEach(place => {
            const toQualifyRules = place.getToQualifyRules();
            toQualifyRules.forEach(toQualifyRule => {
                let toPlaces: PoulePlace[] = [];
                if (toQualifyRule.isMultiple()) {
                    toPlaces = toPlaces.concat((<QualifyRuleMultiple>toQualifyRule).getToPlaces());
                } else {
                    toPlaces.push((<QualifyRuleSingle>toQualifyRule).getToPlace());
                }
                toPlaces.forEach(toPlace => toPlace.setFromQualifyRule(undefined));
            });
            toQualifyRules.splice(0, toQualifyRules.length);
        });
        [QualifyGroup.WINNERS, QualifyGroup.LOSERS].forEach(winnersOrLosers => {
            round.getHorizontalPoules(winnersOrLosers).forEach(horizontalPoule => {
                horizontalPoule.setQualifyRuleMultiple(undefined);
            });
        });
    }

    protected createTo(round: Round) {
        round.getQualifyGroups().forEach(qualifyGroup => {
            const queue = new QualifyRuleQueue();
            const childRound = qualifyGroup.getChildRound();
            const qualifyReservationService = new QualifyReservationService(childRound);

            // add rules and set from places
            {
                qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
                    if (horizontalPoule.isBorderPoule() && qualifyGroup.getNrOfToPlacesTooMuch() > 0) {
                        const nrOfToPlacesBorderPoule = qualifyGroup.getChildRound().getNrOfPlaces() % round.getPoules().length;
                        queue.add(QualifyRuleQueue.START, new QualifyRuleMultiple(horizontalPoule, nrOfToPlacesBorderPoule));
                    } else {
                        horizontalPoule.getPlaces().forEach(place => {
                            queue.add(QualifyRuleQueue.START, new QualifyRuleSingle(place, qualifyGroup));
                        });
                    }
                });
            }
            queue.shuffleIfUnevenAndNoMultiple(childRound.getPoules().length);

            // update rules with to places
            const toHorPoules = childRound.getHorizontalPoules(qualifyGroup.getWinnersOrLosers()).slice();
            let startEnd = QualifyRuleQueue.START;
            while (toHorPoules.length > 0) {
                const toHorPoule = startEnd === QualifyRuleQueue.START ? toHorPoules.shift() : toHorPoules.pop();
                toHorPoule.getPlaces().forEach(place => {
                    this.connectPlaceWithRule(place, queue, startEnd, qualifyReservationService);
                });
                startEnd = queue.toggle(startEnd);
            }
        });
    }

    private connectPlaceWithRule(childPlace: PoulePlace, queue: QualifyRuleQueue, startEnd: number, reservationService: QualifyReservationService) {

        const setToPlacesAndReserve = (qualifyRule: QualifyRule) => {
            if (qualifyRule.isSingle()) {
                reservationService.reserve(childPlace.getPoule().getNumber(), (<QualifyRuleSingle>qualifyRule).getFromPoule());
                (<QualifyRuleSingle>qualifyRule).setToPlace(childPlace);
            } else {
                (<QualifyRuleMultiple>qualifyRule).addToPlace(childPlace);
                if (!(<QualifyRuleMultiple>qualifyRule).toPlacesComplete()) {
                    queue.add(QualifyRuleQueue.START, qualifyRule);
                }
            }
        };

        const unfreeQualifyRules: QualifyRule[] = [];
        let oneQualifyRuleConnected = false;
        while (!oneQualifyRuleConnected && !queue.isEmpty()) {
            const qualifyRule = queue.remove(startEnd);
            if (!qualifyRule.isMultiple() && !reservationService.isFree(childPlace.getPoule().getNumber(), (<QualifyRuleSingle>qualifyRule).getFromPoule())) {
                unfreeQualifyRules.push(qualifyRule);
                continue;
            }
            setToPlacesAndReserve(qualifyRule);
            oneQualifyRuleConnected = true;
        }
        if (startEnd === QualifyRuleQueue.END) {
            unfreeQualifyRules.reverse();
        }
        if (!oneQualifyRuleConnected && unfreeQualifyRules.length > 0) {
            setToPlacesAndReserve(unfreeQualifyRules.shift());
        }

        while (unfreeQualifyRules.length > 0) {
            queue.add(startEnd, unfreeQualifyRules.shift());
        }
    }
}