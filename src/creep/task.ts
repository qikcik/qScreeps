import {TaskType} from "./taskConst";

export type TaskState = string;
export interface TaskDataMem {

}
export interface TaskMem {
  type: TaskType,
  state: TaskState,
  data: TaskDataMem
}

export function CreateTaskMem<
  State extends TaskState,
  Data extends TaskDataMem
>
(
  type: TaskType,
  state:State,
  data:Data,
  )
  : TaskMem
{
  return {type:type,state:state,data:data};
}

export type StateReturn_ok = {
  type: "ok",
};

export type StateReturn_finishStateMachine = {
  type: "finish",
};

export type StateReturn_requestInstantNewState<State extends TaskState> = {
  type: "requestInstantNewState",
  newState: State,
};

export type StateReturn_requestNewStateInNextTick<State extends TaskState> = {
  type: "requestNewStateInNextTick",
  newState: State,
};

export type StateReturn_AbortStateMachine = {
  type: "abort",
  trace: Error,
  reasonDescription: string,
};

export type StateReturn<State extends TaskState> =
  StateReturn_ok |
  StateReturn_finishStateMachine |
  StateReturn_AbortStateMachine |
  StateReturn_requestInstantNewState<State> |
  StateReturn_requestNewStateInNextTick<State>;

export class StateReturnBuilder<State extends TaskState>
{
  public ok ():StateReturn_ok  {return { type: "ok"}}
  public finishStateMachine ():StateReturn_finishStateMachine  {return { type: "finish"}}
  public abortStateMachine (reasonDescription:string):StateReturn_AbortStateMachine {return {type: "abort",reasonDescription: reasonDescription,trace: new Error()}}
  public requestInstantNewState (newState:State):StateReturn_requestInstantNewState<State> {return {type: "requestInstantNewState",newState: newState}}
  public requestNewStateInNextTick (newState:State):StateReturn_requestNewStateInNextTick<State>  {return {type: "requestNewStateInNextTick",newState: newState}}
}

export class TaskImpl<State extends TaskState,DataMem extends TaskDataMem> {
  public readonly type: TaskType;
  public readonly defaultState: State;
  public readonly states : Map<State,(creep: Creep,dataMem:DataMem) => StateReturn<State>>;
  constructor(type:TaskType,defaultState:State) {
    this.type = type;
    this.defaultState = defaultState;
    this.states = new Map<State,(creep: Creep,dataMem:DataMem) => StateReturn<State>>;
  }

  public registerState(state : State, callback:(creep: Creep,dataMem:DataMem) => StateReturn<State> )
  {
    this.states.set(state,callback);
  }

  public getState(state : State)
  {
    return this.states.get(state);
  }
}
