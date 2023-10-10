/* eslint-disable max-len */
export const localeString = {
  cn: {
    actions: { goto: "前往", close: "关闭", cancel: "取消" },

    settings: {
      disableMomotalkAnimation: "跳过 MomoTalk 动画",
      disableMomotalkAnimationDescription:
        "跳过 MomoTalk 的信息输入动画，立即展示所有信息",
      language: "语言",
      useMp3Title: "兼容 Apple 设备",
      useMp3Description: "如果 Apple 设备不能正确播放音频，可以尝试开启此选项",
      useSuperSamplingTitle: "开启超分辨率",
      useSuperSamplingDescription:
        "加载使用 ESRGAN 进行超分辨率处理的素材（手机最高支持2x）",

      clearCacheTitle: "清除缓存",
      clearCacheDescription: "清除所有缓存内容。当遇到显示错误时可尝试此操作",
      clearCacheActionText: "清除",

      allowCheckForUpdatesTitle: "允许检查更新",
      allowCheckForUpdatesDescription:
        "允许网页检查是否有新版本。关闭此选项后，网页将不会自动检查更新",

      unregisterSWTitle: "重置应用状态",
      unregisterSWDescription:
        "重置应用的全部状态。当您认为已经有更新但无法检测到的时候可以使用此功能。\n该行为会卸载已安装的Service Worker并清空全部缓存。",
      unregisterSWActionText: "重置",
    },

    storyType: {
      favor: "好感剧情",
      main: "主线剧情",
      event: "活动剧情",
      other: "任务剧情",
      group: "社团剧情",
      mini: "迷你剧情",
    },

    momotalk: {
      replyTitle: "回复",
      favorScheduleTitle: "羁绊事件",
      goToFavorSchedule: "前往{name}的羁绊剧情",
      continueReading: "继续阅读",
    },

    playerControl: { replay: "重播" },

    routes: {
      home: "首页",
      previous: "上一个",
      next: "下一个",
      backToIndex: "返回目录",
    },

    updates: {
      updated: "{title}已更新",
      favorScheduleUpdated: "{name}的好感剧情已更新",
      minigameUpdated: "{name}已发布（至{date}前有效）",
      minigameUpdatedNoDate: "{name}已发布",
    },
  },
  jp: {
    actions: { goto: "移動", close: "閉じる", cancel: "キャンセル" },

    settings: {
      disableMomotalkAnimation: "モモトークのアニメーションを無効にする",
      disableMomotalkAnimationDescription:
        "モモトークの待機アニメーションを無効にし、すべてのメッセージを一気に表示する",
      language: "言語",
      useMp3Title: "Apple デバイスとの互換性",
      useMp3Description:
        "Apple デバイスで音声が正しく再生されない場合は、このオプションを有効にしてみてください",
      useSuperSamplingTitle: "スーパーサンプリングを有効にする",
      useSuperSamplingDescription:
        "ESRGAN でスーパーサンプリングされた素材を読み込みます（スマートフォンでは最大 2x まで）",
      clearCacheTitle: "キャッシュをクリア",
      clearCacheDescription:
        "すべてのキャッシュをクリアします。表示エラーが発生した場合、この操作をお試してみてください",
      clearCacheActionText: "クリア",

      allowCheckForUpdatesTitle: "自動更新チェックを有効にする",
      allowCheckForUpdatesDescription:
        "このオプションを無効にすると、自動的に新しいバージョンがあるかどうかを確認しません",

      unregisterSWTitle: "アプリの状態をリセット",
      unregisterSWDescription:
        "アプリの状態をリセットします。アップデートがあると思われるが検出されない場合に使用してください。\nこの操作は、インストールされている Service Worker をアンインストールし、すべてのキャッシュをクリアします。",
      unregisterSWActionText: "リセット",
    },

    storyType: {
      favor: "絆ストーリー",
      main: "メインストーリー",
      event: "イベントストーリー",
      other: "お仕事ストーリー",
      group: "グループストーリー",
      mini: "ミニストーリー",
    },

    momotalk: {
      replyTitle: "返信",
      favorScheduleTitle: "絆ストーリ",
      goToFavorSchedule: "{name}の絆ストーリへ",
      continueReading: "続きを読む",
    },

    playerControl: { replay: "リプレイ" },

    routes: {
      home: "ホーム",
      previous: "前へ",
      next: "次へ",
      backToIndex: "目次へ戻る",
    },

    updates: {
      updated: "{title}がアップデートされました",
      favorScheduleUpdated: "{name}の絆ストーリがアップデートされました",
      minigameUpdated:
        "{name}のテーマゲームがアップデートされました（{date}まで有効）",
      minigameUpdatedNoDate: "{name}のテーマゲームがアップデートされました",
    },
  },
  tw: {
    actions: { goto: "前往", close: "關閉", cancel: "取消" },

    settings: {
      disableMomotalkAnimation: "取消 MomoTalk 動畫",
      disableMomotalkAnimationDescription:
        "取消 MomoTalk 的等待動畫，立即展示所有訊息",
      language: "語言",
      useMp3Title: "兼容 Apple 裝置",
      useMp3Description: "如果 Apple 裝置不能正確播放音頻，可以嘗試開啟此選項",
      useSuperSamplingTitle: "開啟超分辨率",
      useSuperSamplingDescription:
        "載入使用 ESRGAN 進行超分辨率處理的素材（手機最高支援2x）",

      clearCacheTitle: "清除快取",
      clearCacheDescription: "清除所有快取內容。當遇到顯示錯誤時可嘗試此操作",
      clearCacheActionText: "清除",

      allowCheckForUpdatesTitle: "允許檢查更新",
      allowCheckForUpdatesDescription:
        "允許網頁檢查是否有新版本。關閉此選項後，網頁將不會自動檢查更新",

      unregisterSWTitle: "重置應用狀態",
      unregisterSWDescription:
        "重置應用的全部狀態。當您認為已經有更新但無法檢測到的時候可以使用此功能。\n該行為會卸載已安裝的Service Worker並清空全部快取。",
      unregisterSWActionText: "重置",
    },

    storyType: {
      favor: "好感劇情",
      main: "主線劇情",
      event: "活動劇情",
      other: "任務劇情",
      group: "社團劇情",
      mini: "迷你劇情",
    },

    momotalk: {
      replyTitle: "回覆",
      favorScheduleTitle: "羈絆事件",
      goToFavorSchedule: "前往{name}的羈絆劇情",
      continueReading: "繼續閱讀",
    },

    playerControl: { replay: "重播" },

    routes: {
      home: "首頁",
      previous: "上一個",
      next: "下一個",
      backToIndex: "返回目錄",
    },

    updates: {
      updated: "{title}已更新",
      favorScheduleUpdated: "{name}的羈絆劇情已更新",
      minigameUpdated: "{name}主题小遊戲已更新（至{date}前有效）",
      minigameUpdatedNoDate: "{name}主题小遊戲已更新",
    },
  },
  en: {
    actions: { goto: "Go to", close: "Close", cancel: "Cancel" },

    settings: {
      disableMomotalkAnimation: "Disable MomoTalk animation",
      disableMomotalkAnimationDescription:
        "Disable MomoTalk's typing animation and display all messages at once",
      language: "Language",
      useMp3Title: "Apple device compatibility",
      useMp3Description:
        "Enable this option if Apple devices cannot play sound correctly",
      useSuperSamplingTitle: "Enable super sampling",
      useSuperSamplingDescription:
        "Load assets that have been super sampled by ESRGAN (up to 2x on smartphones)",
      clearCacheTitle: "Clear cache",
      clearCacheDescription:
        "Clear all cache. Try this when you encounter display errors",
      clearCacheActionText: "Clear",

      allowCheckForUpdatesTitle: "Enable check for updates",
      allowCheckForUpdatesDescription:
        "Allow the web page to check for new versions. When this option is turned off, the web page will not check for updates automatically",

      unregisterSWTitle: "Reset app state",
      unregisterSWDescription:
        "Reset the state of the app. Use this when you think there is an update but it is not detected.\nThis action will uninstall the installed Service Worker and clear all caches.",
      unregisterSWActionText: "Reset",
    },

    storyType: {
      favor: "Favor story",
      main: "Main story",
      event: "Event story",
      other: "Other story",
      group: "Group story",
      mini: "Mini story",
    },

    momotalk: {
      replyTitle: "Reply",
      favorScheduleTitle: "Relationship event",
      goToFavorSchedule: "Go to {name}'s relationship story",
      continueReading: "Continue reading",
    },

    playerControl: { replay: "Replay" },

    routes: {
      home: "Home",
      previous: "Previous",
      next: "Next",
      backToIndex: "Back to index",
    },

    updates: {
      updated: "{title} has been updated",
      favorScheduleUpdated: "{name}'s relationship story has been updated",
      minigameUpdated:
        "{name} themed minigame has been updated (valid until {date})",
      minigameUpdatedNoDate: "{name}'s minigame has been updated",
    },
  },
  kr: {
    actions: { goto: "이동", close: "닫기", cancel: "취소" },

    settings: {
      disableMomotalkAnimation: "MomoTalk 애니메이션 비활성화",
      disableMomotalkAnimationDescription:
        "MomoTalk의 타이핑 애니메이션을 비활성화하고 모든 메시지를 한 번에 표시합니다.",
      language: "언어",
      useMp3Title: "Apple 장치 호환성",
      useMp3Description:
        "Apple 장치에서 소리가 제대로 재생되지 않는 경우 이 옵션을 사용하십시오",
      useSuperSamplingTitle: "슈퍼 샘플링 사용",
      useSuperSamplingDescription:
        "ESRGAN으로 슈퍼 샘플링 된 자산을로드 (스마트폰에서 최대 2x까지)",
      clearCacheTitle: "캐시 지우기",
      clearCacheDescription:
        "모든 캐시를 지웁니다. 표시 오류가 발생한 경우 이 작업을 시도하십시오",
      clearCacheActionText: "지우기",

      allowCheckForUpdatesTitle: "업데이트 확인 허용",
      allowCheckForUpdatesDescription:
        "웹 페이지에서 새 버전을 확인할 수 있도록 허용합니다. 이 옵션을 끄면 웹 페이지가 자동으로 업데이트를 확인하지 않습니다.",

      unregisterSWTitle: "앱 상태 재설정",
      unregisterSWDescription:
        "앱의 상태를 재설정합니다. 업데이트가 있지만 감지되지 않는 경우 이 기능을 사용하십시오.\n이 작업은 설치된 서비스 워커를 제거하고 모든 캐시를 지웁니다.",
      unregisterSWActionText: "재설정",
    },

    storyType: {
      favor: "관계 이벤트",
      main: "메인 스토리",
      event: "이벤트 스토리",
      other: "임무 스토리",
      group: "동아리 스토리",
      mini: "미니 스토리",
    },

    momotalk: {
      replyTitle: "답장",
      favorScheduleTitle: "관계 이벤트",
      goToFavorSchedule: "{name}의 관계 이벤트로 이동",
      continueReading: "계속 읽기",
    },

    playerControl: { replay: "다시 듣기" },

    routes: {
      home: "홈",
      previous: "이전",
      next: "다음",
      backToIndex: "목차로 돌아가기",
    },

    updates: {
      updated: "{title}이 업데이트되었습니다",
      favorScheduleUpdated: "{name}의 관계 이벤트가 업데이트되었습니다",
      minigameUpdated:
        "{name}의 테마 미니게임이 업데이트되었습니다 ({date}까지 유효)",
      minigameUpdatedNoDate: "{name}의 테마 미니게임이 업데이트되었습니다",
    },
  },
  th: {
    actions: { goto: "ไปยัง", close: "ปิด", cancel: "ยกเลิก" },

    settings: {
      disableMomotalkAnimation: "ปิดใช้งานการเล่นแอนิเมชันของ MomoTalk",
      disableMomotalkAnimationDescription:
        "ปิดใช้งานการเล่นแอนิเมชันของ MomoTalk และแสดงข้อความทั้งหมดในครั้งเดียว",
      language: "ภาษา",
      useMp3Title: "ความเข้ากันได้กับอุปกรณ์ Apple",
      useMp3Description:
        "หากอุปกรณ์ Apple ไม่สามารถเล่นเสียงได้อย่างถูกต้อง คุณสามารถเปิดใช้งานตัวเลือกนี้ได้",
      useSuperSamplingTitle: "เปิดใช้งานการสแมปตัวอย่างที่มีคุณภาพสูง",
      useSuperSamplingDescription:
        "โหลดสื่อที่มีการสแมปตัวอย่างที่มีคุณภาพสูงโดย ESRGAN (สูงสุด 2x บนอุปกรณ์มือถือ)",
      clearCacheTitle: "ล้างแคช",
      clearCacheDescription:
        "ล้างแคชทั้งหมด ลองทำการนี้เมื่อคุณพบข้อผิดพลาดในการแสดงผล",
      clearCacheActionText: "ล้าง",

      allowCheckForUpdatesTitle: "เปิดใช้งานการตรวจสอบการอัปเดต",
      allowCheckForUpdatesDescription:
        "อนุญาตให้เว็บไซต์ตรวจสอบเวอร์ชันใหม่ หากปิดตัวเลือกนี้เว็บไซต์จะไม่ตรวจสอบการอัปเดตโดยอัตโนมัติ",

      unregisterSWTitle: "รีเซ็ตสถานะแอป",
      unregisterSWDescription:
        "รีเซ็ตสถานะแอป ใช้คำสั่งนี้เมื่อคุณคิดว่ามีการอัปเดตแต่ไม่ได้รับการตรวจสอบ\nการดำเนินการนี้จะถอนการติดตั้ง Service Worker และล้างแคชทั้งหมด",
      unregisterSWActionText: "รีเซ็ต",
    },

    momotalk: {
      replyTitle: "ตอบกลับ",
      favorScheduleTitle: "เหตุการณ์ความสัมพันธ์",
      goToFavorSchedule: "ไปที่เหตุการณ์ความสัมพันธ์ของ {name}",
      continueReading: "อ่านต่อ",
    },

    playerControl: { replay: "เล่นซ้ำ" },

    routes: {
      home: "หน้าหลัก",
      previous: "ก่อนหน้า",
      next: "ถัดไป",
      backToIndex: "กลับไปที่ดัชนี",
    },

    updates: {
      updated: "{title} ได้รับการอัปเดต",
      favorScheduleUpdated: "เหตุการณ์ความสัมพันธ์ของ {name} ได้รับการอัปเดต",
      minigameUpdated: "เกมของ {name} ได้รับการอัปเดต ({date} ถึงวันที่)",
      minigameUpdatedNoDate: "เกมของ {name} ได้รับการอัปเดต",
    },
  },
};
