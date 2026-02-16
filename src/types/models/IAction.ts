import type { difficulty } from '../enum/enumDifficulty.js';

export interface IAction {
	_id : string;
	type: difficulty;
	name : string;
	description: string;
}