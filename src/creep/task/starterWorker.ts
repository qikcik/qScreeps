import {StateReturnBuilder, TaskDataMem, TaskImpl} from "../task";
import {TaskType} from "../taskConst";
import * as AiUtility from "../ai/aiUtility";

declare module "creep/taskConst" {
  enum TaskType {
    starterWorker = "starterWorker",
  }
}

enum State {
  default= "👋",
  extractFromSource= "🪓",
  withdrawToTarget = "🚮",
}
interface DataMem extends TaskDataMem{
  source: Id<Source>,
  target: Id<any>
}

const moveTask = new TaskImpl<State,DataMem>(TaskType.starterWorker,State.default);
const stateReturn = new StateReturnBuilder<State>();

moveTask.registerState(State.default,(creep,data)=>{
  const forceExtractPolicy = 0.3;
  if(creep.store.getUsedCapacity() > creep.store.getCapacity() * forceExtractPolicy)
    return stateReturn.requestInstantNewState(State.extractFromSource);
  else
    return stateReturn.requestInstantNewState(State.withdrawToTarget);
});

moveTask.registerState(State.extractFromSource,(creep,data)=>{
  let source = Game.getObjectById(data.source) as Source

  if (creep.store.getFreeCapacity() == 0 || source.energy == 0) {
    return stateReturn.requestInstantNewState(State.withdrawToTarget);
  }

  let extractStatus = creep.harvest(source);
  if(extractStatus == ERR_NOT_IN_RANGE) {
    if( AiUtility.creepMoveTo(creep,source) == AiUtility.AiCreepMoveToStatus.success )
      return  stateReturn.ok();
    return stateReturn.abortStateMachine("target unreachable");
  }

  if(extractStatus != OK) return stateReturn.abortStateMachine(`${extractStatus}`);

  return stateReturn.ok();
});

moveTask.registerState(State.withdrawToTarget,(creep,data)=>{
  let target = Game.getObjectById(data.target) as AnyStructure
  let transferStatus = creep.transfer(target,RESOURCE_ENERGY);
  if(transferStatus == ERR_NOT_IN_RANGE) {
    if( AiUtility.creepMoveTo(creep,target) == AiUtility.AiCreepMoveToStatus.success )
      return  stateReturn.ok();
    return stateReturn.abortStateMachine("target unreachable");
  }

  if(transferStatus != OK) return stateReturn.abortStateMachine(`${transferStatus}`);

  if (creep.store.getUsedCapacity() == 0 )
    return stateReturn.finishStateMachine();

  return stateReturn.ok();
});


