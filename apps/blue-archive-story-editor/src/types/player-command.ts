export enum PlayerCommandType {
  // high level api
  Title = 'Title',
  Place = 'Place',
  Voice = 'Voice',
  Episode = 'Episode', /** continued, nextEpisode */
  BGM = 'BGM',
  Dialog = 'Dialog',
  Select = 'Select',
  Character = 'Character',
  ST = 'ST',
  Background = 'Background',
  Config = 'Config',
  Video = 'Video',
  Effect = 'Effect', /** apply prefab effect to object */
  // legacy api
  ClearST = 'ClearST', /** Clear */
  FontSize = 'FontSize', /** Dialog */
  HideMenu = 'HideMenu', /** Set */
  ShowMenu = 'ShowMenu', /** Set */
  ZMC = 'ZMC', /** Set */
  BGShake = 'BGShake', /** Effect */
  // low level api
  Load = 'Load', /** load object */
  Call = 'Call', /** call object method */
  Get = 'Get', /** get object */
  Set = 'Set', /** operate object */
  Clear = 'Clear', /** clear st, delete object */
}
