+++
title = '从ts文件提取arib字幕'
date = 2025-02-16T18:25:07+08:00
tags = ["ffmpeg"]
categories = ["笔记"]
+++

## 编译ffmpeg添加libaribcaption

#### libaribcaption

```bash
cd libaribcaption
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
cmake --build . -j8
cmake --install . 
```

#### ffmpeg

```bash
git clone https://git.ffmpeg.org/ffmpeg.git
cd ffmpeg
./configure --enable-libaribcaption --enable-gpl --enable-nonfree
sudo make -j$(nproc)
```

## 提取字幕

输出ass字幕：

```bash
./ffmpeg -analyzeduration 10MB -probesize 10MB -fix_sub_duration -ignore_background 1 -itsoffset 5 -i EPXXX.ts -c:s ass EPXXX.ass
```

输出srt字幕：

```bash
./ffmpeg -analyzeduration 10MB -probesize 10MB -fix_sub_duration -ignore_background 1 -itsoffset 5 -i EPXXX.ts -c:s text EPXXX.srt
```

## 调整字幕缩放(ass)

ts文件分辨率1440*1080，比例4:3，提取出来的字幕16:9，某些播放器直接放的话，字幕有点扁平。

#### 方法一

```bash
sed -i 's/100,100/75,100/' subtitle.ass
```

#### 方法二

用aegisub的Resample Resolution工具调整分辨率为1440*1080

```
[Script Info]
ScriptType: v4.00+
ScaledBorderAndShadow: yes
PlayResX: 1440
PlayResY: 1080
LayoutResX: 960
LayoutResY: 540
YCbCr Matrix: TV.709
WrapStyle: 0
```

