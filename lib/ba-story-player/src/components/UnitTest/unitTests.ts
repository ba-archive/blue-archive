import { StoryNode } from "../../../lib/type";
import StoryPlayer from "../../../lib/StoryPlayer.vue";
export interface UnitTest {
  getStoryNodes: (initStoryNodes: StoryNode[]) => StoryNode[];
  runTest: (player: InstanceType<typeof StoryPlayer>) => Promise<void>;
}
const unitTestsFilteByCategory: Record<string, Record<string, UnitTest>> = {
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
};

export default unitTestsFilteByCategory;
