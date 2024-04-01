---
title: docker
---
- [Docker 入门终极指南](https://mp.weixin.qq.com/s/G4e0SQnaFkXqcJbyXFz3Nw)
- [一篇文章搞定 Docker 入门](https://mp.weixin.qq.com/s/nHL5ANuzr83NsvW4yVRKEw)

 Docker的整个生命周期由三部分组成：镜像（image）+容器（container）+ 仓库（repository）
 
每台宿主机（电脑），它下载好了Docker后，可以生成多个镜像，每个镜像，可以创建多个容器。发布到仓库时，以镜像为单位。可以理解成：一个容器就是一个独立的虚拟操作系统，互不影响，而镜像就是这个操作系统的安装包。想要生成一个容器，就用安装包（镜像）生成一次

镜像就是根据dockerFile文件配置打包出来的一个包，然后是根据镜像生成一个独立的容器

仓库就是制作好的镜像，就把它放到镜像仓库，方便其他人直接用镜像部署。

## dock compose

```docker
services:
  next-app:
    container_name: next-app
    build:
      context: $PWD
      dockerfile: Dockerfile
      args:
        ENV_VARIABLE: ${ENV_VARIABLE}
        NEXT_PUBLIC_ENV_VARIABLE: ${NEXT_PUBLIC_ENV_VARIABLE}
    restart: always
    ports:
      - 3000:3000
    environment:
      ENV_VARIABLE: ${ENV_VARIABLE}
      NEXT_PUBLIC_ENV_VARIABLE: ${NEXT_PUBLIC_ENV_VARIABLE}
    env_file:
        - ../.env
```
- build args用于在**构建Docker**镜像时传递参数。
- environment用于在容器**运行时**设置环境变量。这些变量对容器内部运行的应用程序是可见的，但不需要在构建镜像时使用。
- env_file用于从文件中读取环境变量的配置，并在容器**运行时加载**这些变量。


