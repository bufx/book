# Mac Launchpad 图标顺序大小个数设置

### 重置 Launchpad 设置

1. **重置 Dock 图标数据库**
   在 Finder 中进入 `~/Library/Application Support/Dock/` 目录，删除该目录下的 `desktoppicture.db` 文件。或者在 Terminal 中键入 `rm ~/Library/Application\ Support/Dock/*.db && killall Dock` 后回车。

2. **重置 Launchpad 图标数据库**
   在 Terminal 中键入 `defaults write com.apple.dock ResetLaunchPad -bool true && killall Dock` 后回车。

完成以上操作后，Launchpad 图标布局已经恢复默认设置，苹果官方提供的 App 都被重新排列到 Launchpad 第一屏幕中，然后根据自己的需要来进行重新排列 App 即可
### 调整 Launchpad 图标大小

**运行 `终端` 程序，执行以下命令：**

**调整每一列显示图标数量，7 表示每一列显示 7 个**

```shell
defaults write com.apple.dock springboard-rows -int 7
```

**调整每一行显示图标数量，这里我用的是 8**

```shell
defaults write com.apple.dock springboard-columns -int 8
```

**由于修改了每一页显示图标数量，可能需要重置 Launchpad**

```shell
defaults write com.apple.dock ResetLaunchPad -bool TRUE;killall Dock
```
