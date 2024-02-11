import { StoryNode } from "../../../lib/type";
import { waitMs } from "../../../lib/utils";
import StoryPlayer from "../../../lib/StoryPlayer.vue";

type GetStoryNodeFunction = (initStoryNodes: StoryNode[]) => StoryNode[];
export interface UnitTest {
  getStoryNodes: GetStoryNodeFunction;
  runTest: (
    player: InstanceType<typeof StoryPlayer>,
    arg: {
      select?: string;
      input?: string;
    }
  ) => Promise<void>;
  select?: string[];
  input?: string;
}
export type UnitTestsFilteByCategory = {
  [key: string]: UnitTest | UnitTestsFilteByCategory;
};

const ACTIONS = [
  "a",
  "ar",
  "al",
  "closeup",
  "d",
  "dl",
  "dr",
  "falldownR",
  "falldownL",
  "greeting",
  "hide",
  "hophop",
  "jump",
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "shake",
  "stiff",
];
const EMOTIONS = [
  "Heart",
  "Respond",
  "Music",
  "Twinkle",
  "Upset",
  "Sweat",
  "Dot",
  "Exclaim",
  "Surprise",
  "Question",
  "Shy",
  "Angry",
  "Chat",
  "Sad",
  "Steam",
  "Sigh",
  "Bulb",
  "Tear",
  "Zzz",
];
const showCharacterGetStoryNodes: GetStoryNodeFunction = function (
  initStoryNodes
) {
  initStoryNodes[1] = {
    ...initStoryNodes[1],
    characters: [
      {
        initPosition: 3,
        CharacterSpine: {
          common:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
          superSampling2x:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
        },
        face: "02",
        state: "highlight",
        effects: [
          {
            type: "fx",
            effect: "shot",
            async: false,
          },
        ],
      },
      {
        initPosition: 1,
        CharacterSpine: {
          common:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
          superSampling2x:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
        },
        face: "02",
        state: "highlight",
        effects: [
          {
            type: "fx",
            effect: "shot",
            async: false,
          },
        ],
      },
    ],
  };
  return initStoryNodes;
};
const multiCharactersGetStoryNodes: GetStoryNodeFunction = function (
  initStoryNodes
) {
  initStoryNodes[1] = {
    ...initStoryNodes[1],
    characters: [
      {
        initPosition: 3,
        CharacterSpine: {
          common:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
          superSampling2x:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
        },
        face: "02",
        state: "highlight",
        effects: [
          {
            type: "fx",
            effect: "shot",
            async: false,
          },
        ],
      },
      {
        initPosition: 1,
        CharacterSpine: {
          common:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
          superSampling2x:
            "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
        },
        face: "02",
        state: "highlight",
        effects: [
          {
            type: "fx",
            effect: "shot",
            async: false,
          },
        ],
      },
    ],
  };
  return initStoryNodes;
};

const unitTestsFilteByCategory: UnitTestsFilteByCategory = {
  audio: {
    changeBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 110.7,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        initStoryNodes[1].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_11.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 110.7,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };

        return initStoryNodes;
      },
      async runTest(player) {
        player.storyManager.switch(1);
      },
    },
    loopBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        return initStoryNodes;
      },
      async runTest(player) {
        const bgm = player.nodePlayer.serversInstance.audio.instances.bgm;
        if (bgm) {
          bgm.seek(0.5);
        }
      },
    },
    continueBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        initStoryNodes[1].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        return initStoryNodes;
      },
      async runTest(player) {
        await player.storyManager.next();
      },
    },
    stopBgm: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[0].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        return initStoryNodes;
      },
      async runTest(player) {
        player.storyManager.switch(3);
      },
    },
    playVoice: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[5].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        initStoryNodes[5].audio.voice =
          "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/VoiceJp/Main_11000_001.ogg";
        return initStoryNodes;
      },
      async runTest(player) {
        player.storyManager.switch(5);
      },
    },
    playSound: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[5].audio.bgm = {
          url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/BGM/Theme_10.ogg",
          bgmArgs: {
            Id: 1,
            Path: "Audio/BGM/Theme_96",
            LoopStartTime: 0.3,
            LoopEndTime: 10,
            LoopTranstionTime: 0,
            LoopOffsetTime: 0,
          },
        };
        initStoryNodes[5].audio.sound =
          "https://yuuka.cdn.diyigemt.com/image/ba-all-data/Audio/Sound/SE_Book_02.wav";
        return initStoryNodes;
      },
      async runTest(player) {
        player.storyManager.switch(5);
      },
    },
  },
  character: {
    emotion: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[1] = {
          ...initStoryNodes[1],
          characters: [
            {
              initPosition: 3,
              CharacterSpine: {
                common:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                superSampling2x:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
              },
              face: "02",
              state: "highlight",
              effects: [
                {
                  type: "emotion",
                  effect: "Heart",
                  async: false,
                },
              ],
            },
          ],
        };
        return initStoryNodes;
      },
      async runTest(player, arg) {
        if (arg.select) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[1],
            characters: [
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: arg.select,
                    async: false,
                  },
                ],
              },
            ],
          };

          player.storyManager.switch(1);
        }
      },
      select: EMOTIONS,
    },
    action: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[1] = {
          ...initStoryNodes[1],
          characters: [
            {
              initPosition: 3,
              CharacterSpine: {
                common:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                superSampling2x:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
              },
              face: "02",
              state: "highlight",
              effects: [
                {
                  type: "action",
                  effect: "a",
                  async: false,
                },
              ],
            },
          ],
        };
        return initStoryNodes;
      },
      async runTest(player, arg) {
        if (arg.select) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[1],
            characters: [
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  // {
                  //   type: "action",
                  //   effect: 'm3',
                  //   async: false,
                  // },
                  {
                    type: "action",
                    effect: arg.select,
                    async: false,
                  },
                ],
              },
            ],
          };

          player.storyManager.switch(1);
        }
      },
      select: ACTIONS,
    },
    fx: {
      getStoryNodes(initStoryNodes) {
        initStoryNodes[1] = {
          ...initStoryNodes[1],
          characters: [
            {
              initPosition: 3,
              CharacterSpine: {
                common:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                superSampling2x:
                  "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
              },
              face: "02",
              state: "highlight",
              effects: [
                {
                  type: "fx",
                  effect: "shot",
                  async: false,
                },
              ],
            },
          ],
        };
        return initStoryNodes;
      },
      async runTest(player, arg) {
        if (arg.select) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[1],
            characters: [
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  // {
                  //   type: "action",
                  //   effect: 'm3',
                  //   async: false,
                  // },
                  {
                    type: "fx",
                    effect: arg.select,
                    async: false,
                  },
                ],
              },
            ],
          };

          player.storyManager.switch(1);
        }
      },
      select: ["shot"],
    },
    showCharacter: {
      显示所有: {
        getStoryNodes: showCharacterGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
              {
                initPosition: 2,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
              {
                initPosition: 4,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
            ],
          };

          player.storyManager.switch(1);
        },
      },
      替换: {
        getStoryNodes: showCharacterGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
            ],
          };
          storyNodes[2] = {
            ...storyNodes[0],
            nextNodeIndex: -1,
            characters: [
              {
                initPosition: 3,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
            ],
          };

          await player.storyManager.switch(1);
          await waitMs(1000);
          player.storyManager.next();
        },
      },
      切换位置与删除: {
        getStoryNodes: showCharacterGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
            ],
          };
          storyNodes[2] = {
            ...storyNodes[0],
            nextNodeIndex: 3,
            characters: [
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [],
              },
            ],
          };
          storyNodes[3] = {
            ...storyNodes[0],
            nextNodeIndex: -1,
          };

          await player.storyManager.switch(1);
          player.storyManager.auto.value = true;
        },
      },
    },
    multiCharacters: {
      多个相同emotion: {
        getStoryNodes: multiCharactersGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: EMOTIONS[0],
                    async: false,
                  },
                ],
              },
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: EMOTIONS[0],
                    async: false,
                  },
                ],
              },
            ],
          };
          player.storyManager.switch(1);
        },
      },
      多个不同emotion: {
        getStoryNodes: multiCharactersGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: EMOTIONS[0],
                    async: false,
                  },
                ],
              },
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: EMOTIONS[1],
                    async: false,
                  },
                ],
              },
            ],
          };
          player.storyManager.switch(1);
        },
      },
      多个action: {
        getStoryNodes: multiCharactersGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "action",
                    effect: ACTIONS[0],
                    async: false,
                  },
                ],
              },
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "action",
                    effect: ACTIONS[1],
                    async: false,
                  },
                ],
              },
            ],
          };
          player.storyManager.switch(1);
        },
      },
      emotion与action混合: {
        getStoryNodes: multiCharactersGetStoryNodes,
        async runTest(player) {
          const storyNodes = player.storyManager.storyNodes();
          storyNodes[1] = {
            ...storyNodes[0],
            nextNodeIndex: 2,
            characters: [
              {
                initPosition: 1,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0183_spr/CH0183_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "emotion",
                    effect: EMOTIONS[0],
                    async: false,
                  },
                ],
              },
              {
                initPosition: 5,
                CharacterSpine: {
                  common:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                  superSampling2x:
                    "https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/CH0184_spr/CH0184_spr.skel",
                },
                face: "02",
                state: "highlight",
                effects: [
                  {
                    type: "action",
                    effect: ACTIONS[0],
                    async: false,
                  },
                ],
              },
            ],
          };
          player.storyManager.switch(1);
        },
      },
    },
  },
  effect: {
    otherEffect: {
      wait: {
        getStoryNodes(initStoryNodes) {
          return initStoryNodes;
        },
        async runTest(player, arg) {
          const storyManager = player.storyManager;
          const storyNodes = storyManager.storyNodes();
          storyNodes[3].effect.action = {
            type: "wait",
            args: Number(arg.input),
          };
          storyNodes[5].nextNodeIndex = -1;
          storyManager.switch(3);
          storyManager.auto.value = true;
        },
        input: "暂停时间",
      },
      zmc: {
        instant: {
          getStoryNodes(init) {
            init[1] = {
              ...init[1],
              bg: {
                url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg",
              },
              effect: {
                action: {
                  type: "zmc",
                  args: {
                    type: "instant",
                    position: [0, -222],
                    size: 2528,
                  },
                },
              },
            };
            init[2] = {
              ...init[1],
              nextNodeIndex: 3,
            };
            init[3] = {
              ...init[1],
              effect: {},
              nextNodeIndex: -1,
            };

            return init;
          },
          async runTest(player) {
            await player.storyManager.switch(1);
          },
        },
        move: {
          getStoryNodes(init) {
            init[1] = {
              ...init[1],
              bg: {
                url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg",
              },
              effect: {
                action: {
                  type: "zmc",
                  args: {
                    type: "move",
                    from: {
                      position: [0, -222],
                      size: 2528,
                    },
                    to: {
                      position: [0, 222],
                      size: 2528,
                    },
                    duration: 2000,
                  },
                },
              },
            };

            init[2] = {
              ...init[1],
              effect: {},
              nextNodeIndex: -1,
            };

            return init;
          },
          async runTest(player) {
            await player.storyManager.switch(1);
          },
        },
      },
      bgshake: {
        getStoryNodes(init) {
          init[1] = {
            ...init[1],
            bg: {
              url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg",
            },
            effect: {
              action: {
                type: "bgshake",
              },
            },
          };

          init[2] = {
            ...init[1],
            effect: {},
            nextNodeIndex: -1,
          };

          return init;
        },
        async runTest(player) {
          await player.storyManager.switch(1);
        },
      },
      transition: {
        getStoryNodes(init) {
          init[1] = {
            ...init[1],
            bg: {
              url: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/01_Background/BG_CS_PR_16.jpg",
            },
            effect: {
              action: {
                type: "transition",
                args: {
                  Name: 3957412172,
                  TransitionOut: "2",
                  TransitionOutDuration: 1000,
                  TransitionOutResource:
                    "Effect/UI/BGFX/UI_FX_HorSwipe_RtoL_In",
                  TransitionIn: "2",
                  TransitionInDuration: 1000,
                  TransitionInResource:
                    "Effect/UI/BGFX/UI_FX_HorSwipe_RtoL_Out",
                },
              },
            },
          };

          init[2] = {
            ...init[1],
            effect: {},
            nextNodeIndex: -1,
          };

          return init;
        },
        async runTest(player) {
          await player.storyManager.switch(1);
        },
      },
    },
  },
};

export default unitTestsFilteByCategory;
