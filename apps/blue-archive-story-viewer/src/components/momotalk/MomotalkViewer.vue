<script setup lang="ts">
import { PropType, Ref, onActivated, ref } from 'vue';
import {
  CurrentMessageItem,
  Momotalk,
  SelectionOption,
} from '../../types/Chats';
import MomoTalkComponent from './MomoTalkComponent.vue';

const props = defineProps({
  messageGroup: Number,
  translator: {
    type: String,
    default: '',
    required: false,
  },
  content: Object as PropType<Momotalk[]>,
});

/**
 * 需要运行的next序列的id
 */
let nextId = ref(0);
const messageList: Ref<CurrentMessageItem[]> = ref([]);

/**
 * 执行一个next序列
 * @param NextGroupId next序列的下一目的地的GroupId
 * @param id next序列的id
 */
// TODO: 在硬到结块之前重写这坨屎山
async function next(NextGroupId: number, id: number) {
  /**
   * 通过id判断当前的next序列是否是需要运行的next序列, 不是则停止运行, 下面push前的判断同理
   */
  if (id !== nextId.value) {
    return;
  }
  const messageGroupElements = findItemsByGroupId(NextGroupId);
  const firstMessageGroupElement = messageGroupElements[0];

  if (!firstMessageGroupElement) {
    // NextGroupId 没有返回结果，聊天结束
    return;
  }
  if (firstMessageGroupElement.MessageCondition === 'Answer') {
    // 遇到玩家选项，需要合并后发送给子组件
    const options: SelectionOption[] = [];
    const answerElements = findItemsByGroupId(NextGroupId);
    const favorScheduleId =
      answerElements.find(element => element.FavorScheduleId !== 0)
        ?.FavorScheduleId || 0;
    for (const answerElement of answerElements) {
      options.push({
        MessageCN: answerElement.MessageCN,
        MessageJP: answerElement.MessageJP,
        MessageEN: answerElement.MessageEN,
        MessageKR: answerElement.MessageKR,
        MessageTH: answerElement.MessageTH,
        MessageTW: answerElement.MessageTW,
        NextGroupId: answerElement.NextGroupId,
      });
    }
    if (id !== nextId.value) {
      return;
    }
    messageList.value.push({
      avatar: false,
      MessageGroupId: firstMessageGroupElement.MessageGroupId,
      Id: firstMessageGroupElement.Id,
      CharacterId: firstMessageGroupElement.CharacterId,
      ConditionValue: 0,
      PreConditionGroupId: 0,
      FavorScheduleId: favorScheduleId,
      NextGroupId: answerElements[0].NextGroupId,
      FeedbackTimeMillisec: 0,
      MessageCondition: 'Answer',
      options: { current: -1, content: options },
      MessageType: 'Text',
      ImagePath: '',
    });
    await wait(-1000);
    return;
  } else {
    if (id !== nextId.value) {
      return;
    }
    // 不需要玩家选择（即学生发给玩家的信息）
    messageList.value.push({
      avatar: true,
      MessageGroupId: firstMessageGroupElement.MessageGroupId,
      Id: firstMessageGroupElement.Id,
      CharacterId: firstMessageGroupElement.CharacterId,
      ConditionValue: firstMessageGroupElement.ConditionValue,
      PreConditionGroupId: firstMessageGroupElement.PreConditionGroupId,
      FavorScheduleId: firstMessageGroupElement.FavorScheduleId,
      NextGroupId: firstMessageGroupElement.NextGroupId,
      FeedbackTimeMillisec: firstMessageGroupElement.FeedbackTimeMillisec,
      MessageCondition: firstMessageGroupElement.MessageCondition,
      MessageType: firstMessageGroupElement.MessageType,
      ImagePath: firstMessageGroupElement.ImagePath,
      MessageJP: firstMessageGroupElement.MessageJP,
      MessageCN: firstMessageGroupElement.MessageCN,
      MessageEN: firstMessageGroupElement.MessageEN,
      MessageKR: firstMessageGroupElement.MessageKR,
      MessageTH: firstMessageGroupElement.MessageTH,
      MessageTW: firstMessageGroupElement.MessageTW,
    });
    await wait(firstMessageGroupElement.FeedbackTimeMillisec || 1500);
    if (firstMessageGroupElement.FavorScheduleId !== 0) {
      return;
    }
    for (let currentMessageItem of messageGroupElements.slice(1)) {
      if (id !== nextId.value) {
        return;
      }
      messageList.value.push({
        avatar: false,
        MessageGroupId: currentMessageItem.MessageGroupId,
        Id: currentMessageItem.Id,
        CharacterId: currentMessageItem.CharacterId,
        ConditionValue: currentMessageItem.ConditionValue,
        PreConditionGroupId: currentMessageItem.PreConditionGroupId,
        FavorScheduleId: currentMessageItem.FavorScheduleId,
        NextGroupId: currentMessageItem.NextGroupId,
        FeedbackTimeMillisec: currentMessageItem.FeedbackTimeMillisec,
        MessageCondition: currentMessageItem.MessageCondition,
        MessageType: currentMessageItem.MessageType,
        ImagePath: currentMessageItem.ImagePath,
        MessageJP: currentMessageItem.MessageJP,
        MessageCN: currentMessageItem.MessageCN,
        MessageEN: currentMessageItem.MessageEN,
        MessageKR: currentMessageItem.MessageKR,
        MessageTH: currentMessageItem.MessageTH,
        MessageTW: currentMessageItem.MessageTW,
      });
      await wait(currentMessageItem.FeedbackTimeMillisec || 1500);
      if (currentMessageItem.FavorScheduleId !== 0) {
        return;
      }
    }
  }
  await next(firstMessageGroupElement.NextGroupId, id);
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms + 1000));
}

function findItemsByGroupId(GroupId: number) {
  return props.content?.filter(
    value => value.MessageGroupId === GroupId
  ) as Momotalk[];
}

// 处理用户选择和重新选择事件
function handleUserSelect(Id: number, nextGroupId: number) {
  const selectionIndex = messageList.value.findIndex(value => value.Id === Id);
  messageList.value = messageList.value.slice(0, selectionIndex + 1);
  //执行一个新的next序列, 并将需要执行的next序列的id设为自己的id
  nextId.value++;
  next(nextGroupId, nextId.value);
}

const nextMessageGroupId = ref(0);
function handleNextMessage(NextGroupId: number, immediate: boolean) {
  if (!immediate) {
    nextMessageGroupId.value = NextGroupId;
    return;
  }
  const favorIndex = messageList.value.findIndex(
    value => value.FavorScheduleId !== 0
  );
  messageList.value = messageList.value.slice(0, favorIndex + 1);
  const newNextId = nextId.value + 1;
  nextId.value = newNextId;
  next(NextGroupId, newNextId);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
next(props.content[0].MessageGroupId, 0);

function shouldComponentUpdate(id: number) {
  return (
    messageList.value.length > 0 &&
    id === messageList.value[messageList.value.length - 1].Id
  );
}

onActivated(() => {
  if (nextMessageGroupId.value) {
    handleNextMessage(nextMessageGroupId.value, true);
  }
});
</script>

<template>
  <div class="momotalk-main-interface flex-vertical">
    <div class="momotalk-banner flex-horizontal center">
      <!-- eslint-disable max-len -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_2_00000033347787382183846980000016369978894466167968_"
        x="0"
        y="0"
        viewBox="0 0 512 477.9"
      >
        <path
          d="M101.8 396.4c-53.3 0-98.4 53.8-101.8 79.5 81.4 7.9 196.1-6.8 252.1-65-74.7 13.5-135.9-5.2-150.3-14.5zM281.4 412.5c55.1 73.3 137.7 58.5 230.5 63.3 3.5-42.1-73.2-80.9-103.9-82.2-39.9 28.5-123.3 19.5-126.6 18.9z"
        />
        <path
          d="M256.4 0C136.8 45 31.5 151.4 31.5 259.4c0 85 68.4 153.9 195.3 137.3 3.9-.5 7.6-1.1 11.2-1.7-1.1-.4-2.1-.9-2.9-1.3-19.4-9.8-53.4-56.7-39-112.6 1.4 59.3 39.7 102.6 57.1 111 2.7 1.3 11.9 4.6 25.5 6.7 51.9 8 164.9 4.7 187.9-116.7C498.9 111.4 256.4 0 256.4 0z"
        />
      </svg>
      <!-- eslint-enable max-len -->
      <div class="momotalk-title-text">
        <span class="title">MomoTalk</span>
        <div class="credit">
          <span>由 </span>
          <span v-if="translator">{{ translator }}@</span>
          <a href="https://space.bilibili.com/37507923" target="_blank"
            >碧蓝档案资讯站</a
          >
          <span> 翻译</span>
        </div>
      </div>
    </div>
    <div class="messages">
      <momo-talk-component
        v-for="(message, index) in messageList"
        :key="index"
        :message="message"
        @userSelect="handleUserSelect"
        @next-message="handleNextMessage"
        :should-component-update="shouldComponentUpdate(message.Id)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.momotalk-main-interface {
  margin-top: 1rem;
  padding-bottom: 2rem;
  width: 100%;
}

.messages {
  width: 100%;
}

.momotalk-banner {
  transition: all 0.375s ease-in-out;
  background-color: var(--color-momotalk-background);
  padding: 0.5rem;
  width: 100%;
  color: var(--color-momotalk-banner-text);
  user-select: none;

  svg {
    fill: var(--color-momotalk-banner-text);
    transition: fill 0.375s ease-in-out;
    width: 2rem;
    height: 2rem;
  }

  .momotalk-title-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 0.5rem;
    font-size: 1.25rem;
    font-family: 'Asap Condensed Bold Italic', 'Microsoft YaHei', 'PingFang SC',
      -apple-system, system-ui, 'Segoe UI', Roboto, Ubuntu, Cantarell,
      'Noto Sans', BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB',
      Arial, sans-serif;

    .title {
      letter-spacing: 0.05rem;
    }

    .credit {
      transform: skewX(-6deg);
      font-size: 0.5rem;
      font-family: 'Asap Condensed Medium', 'Microsoft YaHei', 'PingFang SC',
        -apple-system, system-ui, 'Segoe UI', Roboto, Ubuntu, Cantarell,
        'Noto Sans', BlinkMacSystemFont, 'Helvetica Neue', 'Hiragino Sans GB',
        Arial, sans-serif;

      a {
        display: inline-flex;
        transition: color 0.375s ease-in-out;
        color: var(--color-momotalk-banner-text);
      }
    }
  }

  .messages {
    width: 100%;
  }
}
</style>
