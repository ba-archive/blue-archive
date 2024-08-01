import mitt from 'mitt';

export type Events = {
  startCompare: void;
  endCompare: void;
  startNew: void;
};

export default mitt<Events>();