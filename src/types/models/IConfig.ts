import type { stateEvent } from '../enum/enumStateEvent.js';

export interface IConfig {
	stateEvent : stateEvent;
	maxActionPerDay : number;
	maxActionPerHours : number;
	maxTryDemaskPerDay : number;
	easyActionPoint : number;
	hardActionPoint : number;
	tigTime : number;
};