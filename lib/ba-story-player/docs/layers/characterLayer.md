本层提供一个可视化工具方便实现.

本层功能分支请采用`feat/characterLayer/**`的格式命名.

本层的特效主要分为三个部分`emotion`, `action`, `fx`.

贡献流程:

1. 请先在[剧情播放器特效](https://docs.qq.com/sheet/DQ3doZ0NoUFZ6V0VJ?tab=BB08J2)文档中寻找未实现的特效, 并在实现者加上自己的 github id.
2. 确保自己实现的特效已经在`lib/types/characterLayer.ts`的`EffectsWord`中存在定义, 若不存在请在相应的`Word`部分添加(如`EmotionWord`)
3. 在同个文件下寻找到自己实现的特效部分的参数定义(如`ActionOptions`), 填入参数定义.其中请注意`emotion`的参数定义为`BasicEmotionOptions`
4. 请在`lib/layer/characterLayer/options/`文件夹下寻找自己实习部分的参数文件(如 actionOptions.ts), 填入参数和参数的解释.
5. 在同个文件夹下找到想要功能的实现文件(如`emotionPlayer.ts`), 然后在该文件夹 export 的对象中添加仿照其他功能实现函数添加属性并添加代码.
6. 实现可视化工具调整参数到满意, 提交功能分支并开启 pull request 等待审查合并.
