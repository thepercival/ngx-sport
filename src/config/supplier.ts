import { CountConfig } from './count';
import { PlanningConfig } from './planning';
import { Sport } from '../sport';

export interface CountConfigSupplier {
    setCountConfig(config: CountConfig);
    getCountConfig(sport?: Sport): CountConfig;
}

export interface PlanningConfigSupplier {
    setPlanningConfig(config: PlanningConfig);
    getPlanningConfig();
}
