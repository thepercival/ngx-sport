import { Place } from '../../place';
import { QualifyGroup, Round } from '../../qualify/group';
import { QualifyTarget } from '../../qualify/target';
import { HorizontalPoule } from '../horizontal';

export class HorizontalPouleService {
    ;

    protected getQualifyTargets(qualifyTarget?: QualifyTarget): QualifyTarget[] {
        if (qualifyTarget === undefined) {
            return [QualifyTarget.Winners, QualifyTarget.Losers];
        }
        return [qualifyTarget];
    }

    recreate(round: Round, qualifyTarget?: QualifyTarget) {
        this.remove(round, qualifyTarget);
        this.create(round, qualifyTarget);
    }

    remove(round: Round, qualifyTarget?: QualifyTarget) {
        const targets = this.getQualifyTargets(qualifyTarget);

        targets.forEach((target: QualifyTarget) => {
            const horizontalPoules = round.getHorizontalPoules(target);
            let horizontalPoule: HorizontalPoule | undefined;
            while (horizontalPoule = horizontalPoules.pop()) {
                const places = horizontalPoule.getPlaces();
                let place: Place | undefined;
                while (place = places.pop()) {
                    place.setHorizontalPoule(target, undefined);
                }
            }
        });
    }

    create(round: Round, qualifyTarget?: QualifyTarget) {
        const targets = this.getQualifyTargets(qualifyTarget);
        targets.forEach((target: QualifyTarget) => {

            this.createRoundHorizontalPoules(round, target);

            // s.round.getQualifyGroups(qualifyTarget).forEach(qualifyGroup => {
            //     qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
            //         horizontalPoule.setQualifyGroup(qualifyGroup);
            //     });

            // const qualifyGroupService = new QualifyGroupService(this.round, qualifyTarget);
            // qualifyGroupService.recreate();
            // });
        });
    }

    protected createRoundHorizontalPoules(round: Round, qualifyTarget: QualifyTarget): HorizontalPoule[] {
        const horizontalPoules = round.getHorizontalPoules(qualifyTarget);

        const placesHorizontalOrdered = this.getPlacesHorizontal(round);
        if (qualifyTarget === QualifyTarget.Losers) {
            placesHorizontalOrdered.reverse();
        }

        const nrOfPoules = round.getPoules().length;
        let horPlaces = placesHorizontalOrdered.splice(0, nrOfPoules);
        let previous: HorizontalPoule | undefined;
        while (horPlaces.length > 0) {
            previous = new HorizontalPoule(round, qualifyTarget, previous, horPlaces);
            horPlaces = placesHorizontalOrdered.splice(0, nrOfPoules);
        }


        // placesOrderedByPlaceNumber.forEach(placeIt => {
        //     let horizontalPoule = horizontalPoules.find(horizontalPouleIt => {
        //         return horizontalPouleIt.getPlaces().some(poulePlaceIt => {
        //             let poulePlaceNrIt = poulePlaceIt.getNumber();
        //             if (qualifyTarget === QualifyTarget.Losers) {
        //                 poulePlaceNrIt = (poulePlaceIt.getPoule().getPlaces().length + 1) - poulePlaceNrIt;
        //             }
        //             let placeNrIt = placeIt.getNumber();
        //             if (qualifyTarget === QualifyTarget.Losers) {
        //                 placeNrIt = (placeIt.getPoule().getPlaces().length + 1) - placeNrIt;
        //             }
        //             return poulePlaceNrIt === placeNrIt;
        //         });
        //     });

        //     if (horizontalPoule === undefined) {
        //         horizontalPoule = new HorizontalPoule(this.round, horizontalPoules.length + 1);
        //         horizontalPoules.push(horizontalPoule);
        //     }
        //     placeIt.setHorizontalPoule(qualifyTarget, horizontalPoule);
        // });
        return horizontalPoules;
    }

    protected getPlacesHorizontal(round: Round): Place[] {
        let places: Place[] = [];
        round.getPoules().forEach((poule) => {
            places = places.concat(poule.getPlaces());
        });
        places.sort((placeA, placeB) => {
            if (placeA.getNumber() > placeB.getNumber()) {
                return 1;
            }
            if (placeA.getNumber() < placeB.getNumber()) {
                return -1;
            }
            if (placeA.getPoule().getNumber() > placeB.getPoule().getNumber()) {
                return 1;
            }
            if (placeA.getPoule().getNumber() < placeB.getPoule().getNumber()) {
                return -1;
            }
            return 0;
        });
        return places;
    }

    // hier vanavond verder mee!!!
    /*updateQualifyGroups(roundHorizontalPoules: HorizontalPoule[], horizontolPoulesCreators: HorizontolPoulesCreator[]) {
        horizontolPoulesCreators.forEach(creator => {
            creator.qualifyGroup.getHorizontalPoules().splice(0);
            let qualifiersAdded = 0;
            while (qualifiersAdded < creator.nrOfQualifiers) {
                const roundHorizontalPoule = roundHorizontalPoules.shift();
                if (!roundHorizontalPoule) {
                    break;
                }
                roundHorizontalPoule.setQualifyGroup(creator.qualifyGroup);
                qualifiersAdded += roundHorizontalPoule.getPlaces().length;
            }
        });
        roundHorizontalPoules.forEach(roundHorizontalPoule => roundHorizontalPoule.setQualifyGroup(undefined));
    }*/
}

export interface HorizontolPoulesCreator {
    qualifyGroup: QualifyGroup;
    nrOfQualifiers: number;
}
