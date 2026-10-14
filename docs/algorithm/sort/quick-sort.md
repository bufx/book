# 定义

快速排序的基本思想：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

# 算法描述

快速排序使用分治法来把一个串（list）分为两个子串（sub-lists）。具体算法描述如下：

- 从数列中挑出一个元素，称为 “基准”（**pivot**）；
- 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
- 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

# 动图演示

![](quick-sort-img/quick-sort-animation.gif)

# 代码实现

```java
public static void main(String[] args) {
    int[] array = {3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48};
	// 只需要修改成对应的方法名就可以了
    quickSort(array);

    System.out.println(Arrays.toString(array));
}
```

```java
/**
 * Description: 快速排序
 *
 * @param array
 * @return void
 */
public static void quickSort(int[] array) {
	quickSort(array, 0, array.length - 1);
}


private static void quickSort(int[] array, int left, int right) {
	if (array == null || left >= right || array.length <= 1) {
		return;
	}
	int mid = partition(array, left, right);
	quickSort(array, left, mid);
	quickSort(array, mid + 1, right);
}


private static int partition(int[] array, int left, int right) {
	int temp = array[left];
	while (right > left) {
		// 先判断基准数和后面的数依次比较
		while (temp <= array[right] && left < right) {
			--right;
		}
		// 当基准数大于了 arr[left]，则填坑
		if (left < right) {
			array[left] = array[right];
			++left;
		}
		// 现在是 arr[right] 需要填坑了
		while (temp >= array[left] && left < right) {
			++left;
		}
		if (left < right) {
			array[right] = array[left];
			--right;
		}
	}
	array[left] = temp;
	return left;
}



# 算法分析

**最佳情况：**$T(n) = O(nlogn)$

**最差情况：**$T(n) = O(n^2)$

**平均情况：**$T(n) = O(nlogn)$

