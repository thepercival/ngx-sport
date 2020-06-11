import { StructureOptions } from '../../src/structure/service';

export function getDefaultStructureOptions(): StructureOptions {
    return {
        pouleRange: { min: 1, max: 64 },
        placeRange: { min: 2, max: 128 },
        placesPerPouleRange: { min: 1, max: 40 }
    };
}