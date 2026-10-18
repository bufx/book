# YOLO26模型导出

将训练好的 YOLO26 模型导出，是为了将其部署到真实应用场景中的关键一步。Ultralytics 提供了非常便捷的导出工具，支持多种格式。

## 为什么需要导出模型？

导出模型主要有以下几个目的：

- **提升性能**：导出的模型针对特定硬件进行了优化。例如，导出为 TensorRT 格式在 GPU 上可提速高达 **5 倍**，而 ONNX 或 OpenVINO 格式在 CPU 上可提速高达 **3 倍**。
- **跨平台部署**：ONNX、CoreML、TensorRT 等格式支持在各种平台和设备上运行，从云端服务器到移动端或边缘设备。
- **便于集成**：导出后的模型文件（如 `.onnx`）是独立的，可以方便地集成到其他软件或硬件系统中。

## 支持导出的格式

YOLO26 支持导出到多种主流格式：

| 格式         | `format` 参数   | 描述                                                |
| :----------- | :-------------- | :-------------------------------------------------- |
| **PyTorch**  | `'torchscript'` | PyTorch 的原生格式，便于在 Python 环境中继续使用。  |
| **ONNX**     | `'onnx'`        | 开放神经网络交换格式，具有很好的通用性。            |
| **TensorRT** | `'engine'`      | NVIDIA GPU 的专属格式，推理速度极快。               |
| **OpenVINO** | `'openvino'`    | Intel CPU/GPU 的专属格式，在 Intel 硬件上性能出色。 |
| **CoreML**   | `'coreml'`      | Apple 设备的专属格式，用于 iOS/macOS 应用。         |
| **TFLite**   | `'tflite'`      | 用于移动和嵌入式设备的轻量级格式。                  |
| **其他**     | ...             | 还支持如 `'paddle'`、`'ncnn'` 等多种格式。          |

## 如何使用：两种方法

### 方法一：Python 代码

这是最灵活的方法，可以方便地集成到你的 Python 工作流中。

执行代码的时候，会自动先安装依赖，也可以手动提前安装：

```bash
pip install "onnx>=1.12.0,<2.0.0" onnxruntime "onnxslim>=0.1.82" -i https://pypi.tuna.tsinghua.edu.cn/simple
```



>旧电脑安装不了最新版onnx，分开装
>
>```bash
>pip install "onnx==1.16.2" --only-binary=:all: -i https://pypi.tuna.tsinghua.edu.cn/simple
>pip install onnxruntime "onnxslim>=0.1.82" -i https://pypi.tuna.tsinghua.edu.cn/simple
>pip install "numpy<2" -i https://pypi.tuna.tsinghua.edu.cn/simple
>```

```python
from ultralytics import YOLO

# 1. 加载模型
# 可以加载官方预训练模型
# model = YOLO("yolo26n.pt")
# 也可以加载你自己训练好的模型
model = YOLO("best.pt")

# 2. 导出模型
# 导出为 ONNX 格式，这是最通用的选择
model.export(format="onnx")

#======输出======
Ultralytics 8.4.178 🚀 Python-3.11.15 torch-2.2.2 CPU (Intel Core i7-6820HQ 2.70GHz)
YOLO26n summary (fused): 121 layers, 2,389,735 parameters, 0 gradients, 5.4 GFLOPs

PyTorch: starting from 'best.pt' with input shape (1, 3, 640, 640) BCHW and output shape(s) (1, 5, 8400) (5.2 MB)

ONNX: starting export with onnx 1.16.2 opset 17...
ONNX: slimming with onnxslim 0.1.98...
ONNX: export success ✅ 6.3s, saved as 'best.onnx' (9.4 MB)

Export complete (7.1s)
Results saved to /01-YOLO26-PRO/08-模型导出/best.onnx
Predict:         yolo predict task=detect model=best.onnx imgsz=640 
Validate:        yolo val task=detect model=best.onnx imgsz=640 data=helmet.yaml 
Visualize:       https://netron.app
```

执行后，会在当前目录生成 `best.onnx` 文件。

### 方法二：命令行 (CLI)

适合快速测试或在脚本中调用。

```bash
yolo export model=yolo26n.pt format=onnx
```

## 常用参数说明

`model.export()` 方法支持许多参数，用于精细控制导出过程。以下是一些常用参数：

| 参数       | 类型            | 默认值          | 描述                                               |
| :--------- | :-------------- | :-------------- | :------------------------------------------------- |
| `format`   | `str`           | `'torchscript'` | **（必填）** 目标格式，如 `'onnx'`、`'engine'`。   |
| `imgsz`    | `int` / `tuple` | `640`           | 模型输入图像的尺寸。                               |
| `batch`    | `int`           | `1`             | 指定导出模型支持的批量大小。                       |
| `device`   | `str`           | `'cpu'`         | 导出时使用的设备，如 `'cpu'` 或 `'cuda:0'`。       |
| `half`     | `bool`          | `False`         | 是否导出为 FP16 半精度模型，可减小体积、加速推理。 |
| `dynamic`  | `bool`          | `False`         | 是否导出为动态尺寸模型，允许输入不同大小的图片。   |
| `opset`    | `int`           | `None`          | 指定 ONNX 的 opset 版本。                          |
| `simplify` | `bool`          | `False`         | 是否对 ONNX 模型进行简化。                         |

## 实例代码

### 导出为 ONNX

#### **通用部署**

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")
model.export(format="onnx", imgsz=640) # 使用默认尺寸 640[reference:41]
```

#### 动态尺寸

**持动态尺寸的 ONNX 模型**

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")
# 允许模型在推理时接受不同尺寸的输入
model.export(format="onnx", dynamic=True) 
```

### 导出为 TensorRT

**NVIDIA GPU 极致加速**

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")
# 导出为 FP16 精度的 TensorRT 引擎，以获得最佳性能
model.export(format="engine", device="cuda:0", half=True) 
```

### 导出为 TFLite

**移动端/边缘设备**

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")
model.export(format="tflite", imgsz=640) # 常用于手机等设备[reference:42]
```

### 导出为 OpenVINO

**Intel CPU 加速**

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")
model.export(format="openvino", half=True) # 可同时开启半精度加速[reference:43]
```

