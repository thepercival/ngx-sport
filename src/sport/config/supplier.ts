import { SportConfig } from '../config';
import { Sport } from '../../sport';

export interface SportConfigSupplier {
    setSportConfig(config: SportConfig);
    getSportConfig(sport?: Sport): SportConfig;
}


