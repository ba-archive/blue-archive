import mitt from 'mitt';

export type Events = {
  resetLive2d: void;
  refreshPlayer: void;
};

export default mitt<Events>();
