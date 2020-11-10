import { Place } from '../../place';
import { QualifyGroup, Round } from '../../qualify/group';
import { HorizontalPoule } from '../horizontal';

export class HorizontalPouleService {
    private winnersAndLosers: number[];

    constructor(
        private round: Round,
        winnersOrLosers?: number
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
            let horizontalPoule: HorizontalPoule | undefined;
            while (horizontalPoule = horizontalPoules.pop()) {
                const places = horizontalPoule.getPlaces();
                let place: Place | undefined;
                while (place = places.pop()) {
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

        const placesOrderedByPlaceNumber = this.getPlacesHorizontal();
        if (winnersOrLosers === QualifyGroup.LOSERS) {
            placesOrderedByPlaceNumber.reverse();
        }

        placesOrderedByPlaceNumber.forEach(placeIt => {
            let horizontalPoule = horizontalPoules.find(horizontalPouleIt => {
                return horizontalPouleIt.getPlaces().some(poulePlaceIt => {
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
                horizontalPoule = new HorizontalPoule(this.round, horizontalPoules.length + 1);
                horizontalPoules.push(horizontalPoule);
            }
            placeIt.setHorizontalPoule(winnersOrLosers, horizontalPoule);
        });
        return horizontalPoules;
    }

    protected getPlacesHorizontal(): Place[] {
        let places: Place[] = [];
        this.round.getPoules().forEach((poule) => {
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

    updateQualifyGroups(roundHorizontalPoules: HorizontalPoule[], horizontolPoulesCreators: HorizontolPoulesCreator[]) {
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
    }
}

export interface HorizontolPoulesCreator {
    qualifyGroup: QualifyGroup;
    nrOfQualifiers: number;
}
