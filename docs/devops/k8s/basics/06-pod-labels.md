# Kubernetes-06-Pod标签的概念及操作

## 概念

`标签（Labels）` 是附加到 Kubernetes 对象（比如 Pod）上的键值对。 标签旨在用于指定对用户有意义且相关的对象的标识属性。标签可以在创建时附加到对象，随后可以随时添加和修改。每个对象都可以定义一组键(key)/值(value)标签，但是每个键(key)对于给定对象必须是唯一的。

标签作用: 就是用来给 k8s 中对象起别名, 有了别名可以过滤和筛选


## 语法

`标签由键值对组成`，其有效标签值：

-   必须为 63 个字符或更少（可以为空）
-   除非标签值为空，必须以字母数字字符（`[a-z0-9A-Z]`）开头和结尾
-   包含破折号（`-`）、下划线（`_`）、点（`.`）和字母或数字

## 示例

```yml myapp-label.yml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-label
  labels:
    role: myapp-label
spec:
  containers:
    - name: myapp-label
      image: nginx
      imagePullPolicy: IfNotPresent
      ports:
        - containerPort: 80
          protocol: TCP
  restartPolicy: Always
```

## 标签基本操作

```sh
# 查看标签
$ kubectl get pods --show-labels
NAME          READY   STATUS         RESTARTS      AGE   LABELS
myapp-label   1/1     Running        0             38s   role=myapp-label
myapp-pod     2/2     Running   2 (18m ago)   15h   role=myapp-pod

# 动态添加标签
# kubectl label pod pod名称 标签键值对
$ kubectl label pod myapp-label env=prod
pod/myapp-label labeled
$ kubectl get pods --show-labels
NAME          READY   STATUS             RESTARTS      AGE    LABELS
myapp-label   1/1     Running            0             2m7s   env=prod,role=myapp-label
myapp-pod     2/2     Running   2 (19m ago)   15h    role=myapp-pod

# 覆盖标签
# kubectl label --overwrite pod pod名称 标签键值对
$ kubectl label --overwrite pod myapp-label env=test
pod/myapp-label labeled
$ kubectl get pods --show-labels
NAME          READY   STATUS             RESTARTS      AGE     LABELS
myapp-label   1/1     Running            0             3m32s   env=test,role=myapp-label
myapp-pod     2/2     Running   2 (20m ago)   15h     role=myapp-pod

# 删除标签 -号代表删除标签
$ kubectl label pod myapp-label env-
pod/myapp-label unlabeled
$ kubectl get pods --show-labels
NAME          READY   STATUS             RESTARTS      AGE     LABELS
myapp-label   1/1     Running            0             4m37s   role=myapp-label
myapp-pod     2/2     Running   2 (22m ago)   15h     role=myapp-pod

# 根据标签筛选 支持 不等于(!) 包含(in) 不包含(notin) 大于(>) 等于(=) 小于(<)
$ kubectl label --overwrite pod myapp-label env=test
pod/myapp-label labeled
$ kubectl get pods --show-labels
NAME          READY   STATUS              RESTARTS      AGE     LABELS
myapp-label   1/1     Running             0             3m59s   env=test,role=myapp-label
myapp-pod     2/2     Running             2 (35m ago)   15h     role=myapp-pod
$ kubectl get pod -l env=test
NAME          READY   STATUS              RESTARTS   AGE
myapp-label   1/1     Running             0          4m9s
$ kubectl get pod -l role
NAME          READY   STATUS              RESTARTS      AGE
myapp-label   1/1     Running             0             4m58s
myapp-pod     2/2     Running             2 (36m ago)   15h

# 不包含的 pod
$ kubectl get pod -l '!env'
NAME        READY   STATUS    RESTARTS      AGE
myapp-pod   2/2     Running   2 (37m ago)   15h

# 选择含有指定值的 pod
$ kubectl get pod -l 'role in (myapp-label)'
NAME          READY   STATUS              RESTARTS   AGE
myapp-label   1/1     Running             0          5m52s
$ kubectl get pod -l 'role in (myapp-label,myapp-pod)'
NAME          READY   STATUS              RESTARTS      AGE
myapp-label   1/1     Running             0             5m58s
myapp-pod     2/2     Running             2 (37m ago)   15h
# 选择不含有指定值的 pod
$ kubectl get pod -l 'role notin (myapp-pod)'
NAME          READY   STATUS              RESTARTS   AGE
myapp-label   1/1     Running             0          6m8s
```

