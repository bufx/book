# YOLO26摄像头与实时检测

有两种方式可以调用摄像头，一种是 直接用Ultralytics predict（最简单），一种是 OpenCV 读帧

## 方式一:直接YOLO模型推理

predict方法把source设置成0，就可以把数据源设置成摄像头，source也可以设置为 RTSP 地址或本地视频路径

示例：

```python
# -*- coding: utf-8 -*-
"""
摄像头实时检测
source=0 为默认摄像头；也可换成 RTSP 地址或本地视频。
"""

from pathlib import Path
import sys

from ultralytics import YOLO

sys.path.append(str(Path(__file__).resolve().parents[1]))


def run_predict_api(source: int | str = 0) -> None:
    """
    方式一：直接用 Ultralytics predict（最简单）。画面中按 q 退出。
    show=True 会弹出可视化窗口。
    :param source: 摄像头或视频地址
    :return:
    """
    model = YOLO("yolo26n.pt")
    results = model.predict(
        source = source, # 视频源
        conf=0.45, # 置信度
        imgsz=640, # 图像大小
        show=True, # 显示窗口
        stream= True # 流式，适合实时
    ) # 预测结果
    for _ in results: # 必须消费生成器，摄像头才会真正打开
        pass


def main() -> None:
    """选择一种实时方式运行。"""
    # 本地摄像头
    source: int | str = 0

    run_predict_api(source)


if __name__ == "__main__":
    main()

#======输出======
1/1: 0... Success ✅ (inf frames of shape 1280x720 at 29.00 FPS)

0: 384x640 1 person, 1 cell phone, 298.2ms
0: 384x640 1 person, 236.8ms
0: 384x640 1 person, 170.1ms
0: 384x640 1 person, 192.2ms
0: 384x640 1 person, 694.0ms
0: 384x640 1 person, 1 cell phone, 221.4ms
```

![](camera-and-real-time-detection-img/image-20261017152303788.png){width=400}

## 方式二:OpenCV+YOLO模型推理

### 引入

**RTSP（实时流传输协议）**：这是视频流的“快递单号协议”，专门用来传输实时音视频数据（比如监控画面）。

当你把YOLO（目标检测算法）用于安防监控或工厂质检时，不能把摄像头插在电脑上（因为距离太远），而是让摄像头连接网络。YOLO代码拿着这个RTSP地址去“取流”。

### 相关概念

#### OpenCV

**OpenCV（Open Source Computer Vision Library，开源计算机视觉库）**。它是一个跨平台的免费开源算法库，非常优秀，功能强大，专为**实时图像处理**和**计算机视觉**而设计。

#### ROI

**ROI（Region of Interest，感兴趣区域）**:不需要让YOLO分析整个摄像头画面，只盯着画面里的**那一小块特定区域**看。

优点：

- **省算力**：画面很大，但有效信息只占一小块（比如只检测门口区域），设定ROI后，传给YOLO的像素变少，推理速度会明显提升。
- **降误报**：画面边缘可能有无关的路人或者花坛，设定ROI后，YOLO只检测这个框里的目标，能过滤掉大量无效报警。

#### Count

**计数（Count），具体在计什么？**

在工业视觉和安防领域，**“计数”绝不是数画面里此刻有几个人**，而是指**累计统计穿越某个“虚拟线”或停留在“特定区域”内的目标数量**。分三种常见业务：

- **A. 区域驻留计数（此刻数）**：统计当前ROI区域内有多少人/车。比如**候车厅排队人数**、**工位占用数**。每帧检测，取当前帧的检测框中心点是否落在ROI内，实时更新数字。
- **B. 越线计数（累计数）**：统计**单向或双向**穿越了一条黄色虚拟警戒线的人数。比如**商场客流量统计（进出人数）**、**传送带上的工件产量**。
- **C. 行为计数（违规数）**：统计**闯入**禁区或**长时间停留**的次数。比如某员工进入了吊车作业的红色危险ROI区域，触发一次告警计数。

### 核心难点

**为什么“计数”不能只看单帧？**

如果只是单帧数人，画面里人稍微重叠一下，YOLO漏检一个，数字就会乱跳。所以**真正的计数逻辑必须结合“目标跟踪（Tracking）”**：

1. 给每个检测到的人分配一个唯一的 **ID**（如1号人、2号人）。
2. 记录每个ID的**运动轨迹**（过去5帧的坐标点）。
3. **判断逻辑**：当ID的轨迹线与预设的虚拟线（Line）发生交叉，且方向符合设定时，计数+1。

### 组合实战逻辑

**ROI + 计数 联动**

假设你是**工厂产线质检**，传送带从左往右走：

1. **设定ROI**：只截取传送带中间窄窄的一条竖条区域。
2. **YOLO推理**：只检测ROI内的“瑕疵品”或“工件”。
3. **越线计数**：在ROI中间画一条虚拟竖线。每当一个工件的检测框中心点从左往右越过这条线，累计产量 +1；如果检测到瑕疵标签，不良品计数 +1。

### 代码示例

```python
# -*- coding: utf-8 -*-
"""
摄像头实时检测
source=0 为默认摄像头；也可换成 RTSP 地址或本地视频。
"""

from pathlib import Path
import sys

import cv2
from ultralytics import YOLO

sys.path.append(str(Path(__file__).resolve().parents[1]))
from utils.common import FpsCounter  # noqa: E402

def run_opencv_loop(source: int | str = 0) -> None:
    """
    方式二：OpenCV 读帧 + 模型推理，方便叠加业务逻辑（ROI、计数等）。画面中按 q 退出。
    :param source: 摄像头或视频地址
    :return:
    """
    model = YOLO("yolo26n.pt") # 加载模型
    cap = cv2.VideoCapture(source) # 打开视频源
    if not cap.isOpened(): # 如果视频源无法打开，则抛出异常
        raise RuntimeError(f"无法打开视频源：{source}")

    fps = FpsCounter() # 创建FPS计数器
    print("按键 q 退出窗口")

    while True: # 循环读取视频帧
        ok, frame = cap.read() # 读取视频帧
        if not ok: # 如果视频帧无法读取，则退出循环
            break # 退出循环

        # 预测结果
        results = model.predict(
            frame,
            conf=0.45, 
            imgsz=640, 
            verbose=False
        ) 
        plotted = results[0].plot() # 画框后的 BGR 图
        
        cur_fps = fps.tick() # 计算 FPS 并更新 FPS 计数器
        # 在图像上添加文本
        cv2.putText(
            plotted, # 图像
            f"FPS: {cur_fps:.1f}", # 文本
            (12, 32), # 位置
            cv2.FONT_HERSHEY_SIMPLEX, # 字体
            1.0, # 字体大小
            (0, 255, 0), # 颜色
            2 # 字体厚度
        )

        cv2.imshow("YOLO26 Webcam", plotted) # 显示图像并设置窗口名称
        if cv2.waitKey(1) & 0xFF == ord("q"): # 如果按下 q 键， 则退出循环
            break # 退出循环


    cap.release() # 释放视频源
    cv2.destroyAllWindows() # 关闭所有窗口

def main() -> None:
    """选择一种实时方式运行。"""
    # 本地摄像头
    source: int | str = 0
    # RTSP 示例：
    # source = "rtsp://user:pass@192.168.1.10:554/stream"
    # 本地视频：
    # source = "demo.mp4"

    run_opencv_loop(source)

if __name__ == "__main__":
    main()
```

![](camera-and-real-time-detection-img/image-20261017160008126.png){width=400}
