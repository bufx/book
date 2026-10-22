# 计算属性 computed

计算属性用来根据已有的响应式数据**派生**出新值。依赖变了它会自动更新；依赖没变则使用缓存，不会重复计算。

适合：总价、全名、过滤列表、格式化展示等「由别的数据算出来」的场景。

## 为什么需要计算属性？

模板里可以直接写表达式，但复杂逻辑写在模板里会很难维护：

```vue
<!-- 不推荐：逻辑塞在模板里 -->
<p>{{ firstName + ' ' + lastName }}</p>
<p>{{ price * count * (vip ? 0.8 : 1) }}</p>
```

用 `computed` 把计算逻辑抽出来，模板更干净，也方便复用和测试。

## 基本用法

从 `vue` 引入 `computed`，传入一个**返回派生值**的函数。

```vue
<script setup>
/**
 * 计算属性基础 Demo
 * 根据名、姓自动拼出全名
 */
import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// 依赖 firstName、lastName，自动拼出全名
const fullName = computed(() => {
  return firstName.value + lastName.value
})
</script>

<template>
  <p>姓：{{ firstName }}</p>
  <p>名：{{ lastName }}</p>
  <p>全名：{{ fullName }}</p>
  <button @click="lastName = '四'">改名为「四」</button>
</template>
```

要点：

- 脚本里读计算属性要用 `.value`：`fullName.value`
- 模板里直接写 <span v-pre>`{{ fullName }}`</span>，不用 `.value`
- 默认是**只读**的，不要往 `fullName` 里赋值

运行截图：

![](computed-properties-img/image-20261021111914073.png)

## 和普通方法有什么区别？

|          | `computed`                                 | 普通方法 `methods`                              |
| -------- | ------------------------------------------ | ----------------------------------------------- |
| 调用方式 | 当属性用：<span v-pre>`{{ total }}`</span> | 当函数调：<span v-pre>`{{ getTotal() }}`</span> |
| 缓存     | 有：依赖不变不重算                         | 无：每次渲染都执行                              |
| 适用     | 纯派生、频繁读取                           | 事件处理、需要传参、有副作用                    |

简单记：**只根据已有数据算出一个值 → 用计算属性**；**点击、请求、改状态 → 用方法**。

## 入门 Demo：购物总价

把单价、数量、VIP 折扣串起来，看计算属性如何自动更新。

```vue
<script setup>
/**
 * 购物总价 Demo
 * 演示 computed 根据多个依赖自动重算
 */
import { ref, computed } from 'vue'

const price = ref(29.9) // 单价
const qty = ref(1) // 数量
const vip = ref(false) // 是否 VIP

// 应付金额：VIP 打 8 折，保留两位小数
const total = computed(() => {
  const sum = price.value * qty.value
  const pay = vip.value ? sum * 0.8 : sum
  return pay.toFixed(2)
})

/** 数量 +1 */
function add() {
  qty.value++
}

/** 切换 VIP */
function toggleVip() {
  vip.value = !vip.value
}
</script>

<template>
  <div style="font-family: sans-serif; max-width: 360px; margin: 40px auto;">
    <h2>Vue3 计算属性 Demo</h2>

    <p>单价：¥{{ price }}</p>
    <p>数量：{{ qty }}</p>
    <p>身份：{{ vip ? 'VIP（8折）' : '普通用户' }}</p>
    <p>应付：¥{{ total }}</p>

    <button @click="add">数量 +1</button>
    <button @click="toggleVip" style="margin-left: 8px;">
      {{ vip ? '取消 VIP' : '开通 VIP' }}
    </button>
  </div>
</template>
```

操作后你会看到：

- 点「数量 +1」→ `qty` 变 → `total` 自动重算
- 点「开通 VIP」→ `vip` 变 → `total` 按折扣更新
- `price` / `qty` / `vip` 都没变时，`total` 不会重复计算（有缓存）

运行截图：

![](computed-properties-img/image-20261021112434376.png)