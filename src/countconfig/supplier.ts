import { CountConfig } from '../countconfig';
import { Sport } from '../sport';

export interface CountConfigSupplier {
    setCountConfig(config: CountConfig);
    getCountConfig(sport?: Sport): CountConfig;
}


