import type { IAction } from './IAction.js';
import type { IUser } from './IUser.js';
import type { stateAction } from '../enum/enumStateAction.js';

export interface IAssignedAction {
	_id : string;
	action : IAction;
	angel : IUser;
	target : IUser;
	status : stateAction;
	isUnmasked : boolean;
}