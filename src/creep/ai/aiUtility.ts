export enum AiCreepMoveToStatus
{
  success,
  aborted
}
export function creepMoveTo(creep:Creep,target:RoomObject) : AiCreepMoveToStatus
{
  let moveStatus = creep.moveTo(target,{visualizePathStyle: { stroke: "#FF0000"}});
  if( moveStatus == ERR_INVALID_TARGET ) {
    console.log(`[ERR][AI] move to "invalid target" | creep="${creep.name}"`);
    return AiCreepMoveToStatus.aborted;
  }
  if( moveStatus == ERR_NO_BODYPART ) {
    console.log(`[ERR][AI] move to "no body part" | creep="${creep.name}"`);
    return AiCreepMoveToStatus.aborted;
  }
  if( moveStatus == ERR_NO_PATH ) {
    //console.log(`[WRN][AI] move to "no path" | creep="${creep.name}"`);
    return AiCreepMoveToStatus.success;
  }
  return AiCreepMoveToStatus.success;
}

export enum AiExtractFromSourceStatus
{
  success,
  aborted
}
