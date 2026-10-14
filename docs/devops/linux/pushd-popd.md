# Linux中的pushd和popd用法

## 介绍

pushd和popd在linux中可以用来方便地在多个目录之间切换。

## 使用cd进行目录切换

一般，Shell中都可以通过`cd -`命令回到之前的目录，下面是一个例子：

```sh
$ pwd
/opt/boms_auto_deploy
$ cd /
$ pwd
/
$ cd -
/opt/boms_auto_deploy
$ pwd
/opt/boms_auto_deploy
```

实际上，`cd -`中，`-`就相当于变量`$OLDPWD`。`cd -`就相当于`cd $OLDPWD`。下面是一个例子：

```sh
$ pwd
/opt/boms_auto_deploy
$ cd /
$ echo $OLDPWD
/opt/boms_auto_deploy
$ cd $OLDPWD
$ pwd
/opt/boms_auto_deploy
```

## pushd、popd和dirs

pushd和popd是对一个目录栈进行操作，而dirs是显示目录栈的内容。而目录栈就是一个保存目录的栈结构，该栈结构的顶端永远都存放着当前目录（这里点从下面可以进一步看到）

### dirs

dirs常用的参数：

|   选项 | 含义                                          |
| -----: | :-------------------------------------------- |
| 无参数 | 显示所有目录栈，从左往右                      |
|     -p | 每行显示一条记录                              |
|     -v | 每行显示一条记录，同时展示该记录在栈中的index |
|     -c | 清空目录栈                                    |

下面没有显示地对目录栈进行任何操作，我们来看下当前目录栈的内容是什么：

```sh
$ pwd
/opt/boms_auto_deploy
$ dirs -p
/opt/boms_auto_deploy
$ dirs -v
 0  /opt/boms_auto_deploy
$ dirs
/opt/boms_auto_deploy
$ cd /
$ dirs -v
 0  /
$ dirs -c
$ dirs -v
 0  /
```

可以看出，目录栈中只有一个目录(当然是在栈顶)，就是当前所在的目录。当切换目录之后，栈中的目录也随之改变。通过`-c`选项可以将目录栈中除当前目录之外的其它目录清除，由于上面的例子中目录栈只包含当前目录，所以没有变化

### pushd

每次pushd命令执行完成之后，默认都会执行一个dirs命令来显示目录栈的内容。pushd的用法主要有如下几种：

1. pushd 目录

pushd后面如果直接跟目录使用，会切换到该目录并且将该目录置于目录栈的栈顶。(时时刻刻都要记住，目录栈的栈顶永远存放的是当前目录。如果当前目录发生变化，那么目录栈的栈顶元素肯定也变了；反过来，如果栈顶元素发生变化，那么当前目录肯定也变了。)下面是一个例子：

```sh
$ pwd
/opt/boms_auto_deploy
$ pushd /
/ /opt/boms_auto_deploy
$ dirs -v
 0  /
 1  /opt/boms_auto_deploy
$ pushd /usr
/usr / /opt/boms_auto_deploy
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
```

这样，不难看出，用pushd在切换目录的同时，也将历史目录以栈结构的形式保存了下来。

2. pushd不带任何参数

pushd不带任何参数执行的效果就是，将目录栈最顶层的两个目录进行交换。前面说过，栈顶目录和当前目录一个发生变化，另一个也变。这样，实际上，就实现了`cd -`的功能。下面是一个例子(这个例子接上文的执行现场)：

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ pushd
/ /usr /opt/boms_auto_deploy
$ dirs -v
 0  /
 1  /usr
 2  /opt/boms_auto_deploy
$ pushd
/usr / /opt/boms_auto_deploy
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
```

3. pushd +n

到这里，可能会想如果想切换到目录栈中的任意一个目录，该如何？`pushd +n`正是这个作用：`pushd +n`切换到目录栈中的第n个目录(这里的n就是`dirs -v`命令展示的index)，并将该目录以栈循环的方式推到栈顶。下面是一个例子(接上文的执行现场)，注意栈循环的方式带来的栈中内容的变化规律：

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ pushd +2
/opt/boms_auto_deploy /usr /
$ dirs -v
 0  /opt/boms_auto_deploy
 1  /usr
 2  /
$ pushd +1
/usr / /opt/boms_auto_deploy
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
```

4. pushd -n

与 `pushd +n`相反

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ dirs 
/usr / /opt/boms_auto_deploy
$ pushd -2
/usr / /opt/boms_auto_deploy
$ dirs
/usr / /opt/boms_auto_deploy
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ pushd -1
/ /opt/boms_auto_deploy /usr
$ dirs -v
 0  /
 1  /opt/boms_auto_deploy
 2  /usr
```

实际上，从默认的`dirs`命令的输出来解释：+n是指从左往右数，-n是指从右往左数，都是从0开始

### popd

每次popd命令执行完成之后，默认都会执行一个dirs命令来显示目录栈的内容。popd的用法主要有如下几种：

1. popd不带参数

popd不带任何参数执行的效果，就是将目录栈中的栈顶元素出栈。这时，栈顶元素发生变化，自然当前目录也会发生相应的切换(接上文的执行现场)，下面是一个例子：

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ popd
/ /opt/boms_auto_deploy
$ dirs -v
 0  /
 1  /opt/boms_auto_deploy
$ popd
/opt/boms_auto_deploy
$ dirs -v
 0  /opt/boms_auto_deploy
```

2. popd +n

将目录栈中的第n个元素删除(这里的n就是命令`dirs -v`显示的目录index)。下面是一个例子：

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ popd +2
/usr /
$ dirs -v
 0  /usr
 1  /
```

这里可以发现，如果对于目录栈的操作没有引发栈顶元素的变化，将不会导致当前目录的切换。

3. popd -n

与 `popd +n`相反

```sh
$ dirs -v
 0  /usr
 1  /
 2  /opt/boms_auto_deploy
$ popd -2
/ /opt/boms_auto_deploy
$ dirs -v
 0  /
 1  /opt/boms_auto_deploy
```

实际上，从默认的`dirs`命令的输出来解释：+n是指从左往右数，-n是指从右往左数，都是从0开始

