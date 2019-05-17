import { PoulePlace } from '../../pouleplace';
import { QualifyGroup } from '../../qualify/group';
import { Round } from '../../round';
import { HorizontalPoule } from '../horizontal';

export class HorizontalPouleService {
    private winnersAndLosers: number[];

    constructor(
        private round: Round,
        private winnersOrLosers: number = undefined
    ) {
        if (winnersOrLosers === undefined) {
            this.winnersAndLosers = [QualifyGroup.WINNERS, QualifyGroup.LOSERS];
        } else {
            this.winnersAndLosers = [winnersOrLosers];
        }
    }

    recreate() {
        this.remove();
        this.create();
    }

    protected remove() {
        this.winnersAndLosers.forEach(winnersOrLosers => {
            const horizontalPoules = this.round.getHorizontalPoules(winnersOrLosers);
            while (horizontalPoules.length > 0) {
                const horizontalPoule = horizontalPoules.pop();

                const places = horizontalPoule.getPlaces();
                while (places.length > 0) {
                    const place = places.pop();
                    place.setHorizontalPoule(winnersOrLosers, undefined);
                }
            }
        });
    }

    protected create() {
        this.winnersAndLosers.forEach(winnersOrLosers => {
            this.createRoundHorizontalPoules(winnersOrLosers);

            // s.round.getQualifyGroups(winnersOrLosers).forEach(qualifyGroup => {
            //     qualifyGroup.getHorizontalPoules().forEach(horizontalPoule => {
            //         horizontalPoule.setQualifyGroup(qualifyGroup);
            //     });

            // const qualifyGroupService = new QualifyGroupService(this.round, winnersOrLosers);
            // qualifyGroupService.recreate();
            // });
        });
    }

    protected createRoundHorizontalPoules(winnersOrLosers: number): HorizontalPoule[] {
        const horizontalPoules = this.round.getHorizontalPoules(winnersOrLosers);

        const poulePlacesOrderedByPlace = this.getPlacesHorizontal();
        if (winnersOrLosers === QualifyGroup.LOSERS) {
            poulePlacesOrderedByPlace.reverse();
        }

        poulePlacesOrderedByPlace.forEach(placeIt => {
            let horizontalPoule = horizontalPoules.find(horizontalPoule => {
                return horizontalPoule.getPlaces().some(poulePlaceIt => {
                    let poulePlaceNrIt = poulePlaceIt.getNumber();
                    if (winnersOrLosers === QualifyGroup.LOSERS) {
                        poulePlaceNrIt = (poulePlaceIt.getPoule().getPlaces().length + 1) - poulePlaceNrIt;
                    }
                    let placeNrIt = placeIt.getNumber();
                    if (winnersOrLosers === QualifyGroup.LOSERS) {
                        placeNrIt = (placeIt.getPoule().getPlaces().length + 1) - placeNrIt;
                    }
                    return poulePlaceNrIt === placeNrIt;
                });
            });

            if (horizontalPoule === undefined) {
                horizontalPoule = new HorizontalPoule(this.round, placeIt.getNumber());
                horizontalPoules.push(horizontalPoule);
            }
            placeIt.setHorizontalPoule(winnersOrLosers, horizontalPoule);
        });
        return horizontalPoules;
    }

    protected getPlacesHorizontal(): PoulePlace[] {
        let places: PoulePlace[] = [];
        this.round.getPoules().forEach((poule) => {
            places = places.concat(poule.getPlaces());
        });
        places.sort((poulePlaceA, poulePlaceB) => {
            if (poulePlaceA.getNumber() > poulePlaceB.getNumber()) {
                return 1;
            }
            if (poulePlaceA.getNumber() < poulePlaceB.getNumber()) {
                return -1;
            }
            if (poulePlaceA.getPoule().getNumber() > poulePlaceB.getPoule().getNumber()) {
                return 1;
            }
            if (poulePlaceA.getPoule().getNumber() < poulePlaceB.getPoule().getNumber()) {
                return -1;
            }
            return 0;
        });
        return places;
    }
}