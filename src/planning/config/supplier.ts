import { PlanningConfig } from '../config';

export interface PlanningConfigSupplier {
    setPlanningConfig(config: PlanningConfig);
    getPlanningConfig();
}