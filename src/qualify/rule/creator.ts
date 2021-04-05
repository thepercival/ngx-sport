import { QualifyGroup, Round } from '../group';
import { QualifyTarget } from '../target';
import { DefaultQualifyRuleCreator } from './defaultCreator';

export class QualifyRuleCreator {

    constructor() {
    }

    remove(...parentRounds: (Round | undefined)[]) {
        parentRounds.forEach((parentRound: Round | undefined) => {
            if (parentRound === undefined) {
                return;
            }
            parentRound.getQualifyGroups().forEach((qualifyGroup: QualifyGroup) => {
                qualifyGroup.detachRules();
            });
        });
    }

    create(...parentRounds: (Round | undefined)[]) {
        [QualifyTarget.Winners, QualifyTarget.Losers].forEach((target: QualifyTarget) => {
            parentRounds.forEach((parentRound: Round | undefined) => {
                if (parentRound === undefined) {
                    return;
                }
                parentRound.getQualifyGroups(target).forEach((qualifyGroup: QualifyGroup) => {
                    // const queue = new QualifyRuleQueue();
                    const childRound = qualifyGroup.getChildRound();
                    // const qualifyReservationService = new QualifyReservationService(childRound);

                    // 1 pak eerste horpoule, qualifygroup
                    // als het aantal plaatsen in de nieuwe ronde nog volstaat haal dan horpoule.places.length plaatsen uit de ronde

                    const c = new DefaultQualifyRuleCreator()
                    const fromHorPoules = parentRound.getHorizontalPoules(qualifyGroup.getTarget()).slice();
                    c.createRules(fromHorPoules, qualifyGroup);


                    // daarna gewoon indelen!

                    // add rules and set from places
                    /*{
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
                    const toHorPoules = childRound.getHorizontalPoules(qualifyGroup.getTarget()).slice();
                    let startEnd = QualifyRuleQueue.START;
                    while (toHorPoules.length > 0) {
                        const toHorPoule = startEnd === QualifyRuleQueue.START ? toHorPoules.shift() : toHorPoules.pop();
                        if (!toHorPoule) {
                            continue;
                        }
                        toHorPoule.getPlaces().forEach(place => {
                            this.connectPlaceWithRule(place, queue, startEnd, qualifyReservationService);
                        });
                        startEnd = queue.getOpposite(startEnd);
                    }*/
                });
            })
        });
    }

    /*private connectPlaceWithRule(childPlace: Place, queue: QualifyRuleQueue, startEnd: number, reservationService: QualifyReservationService) {

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
            if (!qualifyRule) {
                break;
            }
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
        if (!oneQualifyRuleConnected) {
            const unfreeQualifyRule = unfreeQualifyRules.shift();
            if (unfreeQualifyRule) {
                setToPlacesAndReserve(unfreeQualifyRule);
            }
        }

        while (unfreeQualifyRules.length > 0) {
            const unfreeQualifyRule = unfreeQualifyRules.shift();
            if (unfreeQualifyRule) {
                queue.add(startEnd, unfreeQualifyRule);
            }
        }
    }*/
}