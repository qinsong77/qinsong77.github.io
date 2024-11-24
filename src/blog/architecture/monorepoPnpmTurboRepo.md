

# MonoRepo by pnpm workspace + TurboRepo

[[toc]]

## pnpm

`pnpm` 是新一代的包管理工具。按照官网说法，可以实现**节约磁盘空间并提升安装速度和创建非扁平化的 `node_modules` 文件夹**两大目标，具体原理可以参考[pnpm 官网](https://pnpm.io/zh/motivation)。

::: details 原理图

* 节约磁盘空间并提升安装速度

![](./images/pnpm1.jpeg)

* 创建非扁平化的 node_modules 文件夹

![](./images/pnpm2.jpeg)
:::

> v7版本的pnpm安装使用需要node版本至少大于v14，所以在安装之前首先需要检查下node版本。

### 初始化项目

```shell
# 全局安装pnpm
npm i pnpm -g
mkdir "sysuke"
cd sysuke
pnpm init
```

![](./images/step1.png)

这里`package.json`新增个脚本和2个配置，非必须。

- 只允许`pnpm`

当在项目中使用 `pnpm` 时，如果不希望用户使用 `yarn `或者 `npm` 安装依赖，可以将下面的这个 `preinstall` 脚本添加到工程根目录下的 `package.json`中：

```shell
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

`preinstall` 脚本会在 `install` 之前执行，现在，只要有人运行 `npm install` 或 `yarn install`，就会调用 `only-allow `去限制只允许使用 `pnpm` 安装依赖。

- [engines](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines): 可以指定项目运行的 `node` 版本
- [packageManager](https://nodejs.org/api/packages.html#packagemanager): 项目期望用什么包管理工具

```json
{
  "engines": {
    "node": ">=18.17.0",
    "pnpm": ">=8",
    "npm": "please use pnpm",
    "yarn": "please use pnpm"
  },
  "packageManager": "pnpm@8.9.0"
}
```

::: details package.json 不常用字段

- [type](https://nodejs.org/api/packages.html#type): `type` 字段定义了 `Node.js` 用于所有以 `package.json` 文件作为其最近父级的 .js 文件的模块格式。 当最近的父 `package.json` 文件包含值为`module`的顶级字段`type`时，以 `.js` 结尾的文件将作为 `ES 模块`加载。
- `files`: 指定发布到 `npm`中的文件，默认是所有文件`["*"]`，也可以通过`.npmignore`防止某些文件被包含在内，它不会覆盖`files`字段，但会覆盖其子目录。 如果不存在`.npmignore`将使用`.gitignore`替代。一般来说npm上我们只需要发布打包好的文件，对于git则恰好相反，我们只需要提交源代码。
- `peerdependencies`：设置包的依赖项, `peerdependencies`设置的依赖包表达您的包与主机工具或库的兼容性， 如你开发了一个 `vue` 组件库，需要指定在vue 3.x版本中使用，可以这样设置

```json
{
  "peerdependencies": {
    "vue": "^3.0"
  }
}
```

如果用户安装了该组件库，并且安装`peerdependencies`设置的依赖包与用户安装的依赖包指定的版本不一致时，npm 会提示 vue 版本不兼容的信息

- module: 指定模块入口文件，不同于`main`字段，将指向一个具有 ES2015 模块语法的模块入口文件，你可以与`main`字段同时命名，当你用es6语法导入时，打包工具（rollup,webpack）会优先使用该字段对应的入口文件，

```json
{
  "name": "my-package",
  "version": "0.1.0",
  "main": "dist/my-package.umd.js",
  "module": "dist/my-package.esm.js"
}
```

- exports：字段允许定义包的入口点，当通过 `node_modules` 查找或对其自身名称的自引用加载的名称导入时。 Node.js 12+ 支持它作为“main”的替代方案，

```json
{
  "name": "a-package",
  "exports": {
    ".": "./main.mjs",
    "./foo": "./foo.js"
  }
}
```

并且exports还支持按条件导出

```json
{
  "type": "module",
  "main": "./index.cjs",
  "exports": {
    "import": "./wrapper.mjs",
    "require": "./index.cjs"
  }
}
```

:::

新建配置文件 `.npmrc`

```shell
registry=https://registry.npmjs.org/
# 可设置为淘宝源，但后面发布会有问题
registry=https://registry.npmmirror.com
auto-install-peers=false
```

`auto-install-peers`为`true`时将自动安装任何缺少的非可选同级依赖关系。

### monorepo的实现： [workspace](https://pnpm.io/zh/workspaces)

根目录创建`pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/**"
  - '!**/__test__/**'
```

这里如果是 `'packages/*'`, 只会识别直接子目录下所有的包，而`'packages/**`, 2个`*`会识别到嵌套的子目录。 而`'!**/__test__/**'`会排除掉所有的`__test__`目录。

创建文件夹目录结构

```md
├── apps
│   ├── web
│   │   ├── package.json
│   ├── docs
│   │   ├── package.json
├── packages
│   ├── config
│   │   ├── eslint-config-custom
│   │   │   ├── package.json
│   │   ├── tsconfig
│   │   │   ├── package.json
│   ├── ui
│   |   ├── package.json
│   ├── util
│   │   ├── package.json
│   ├── webpack-react-base
│   │   ├── package.json
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

这里是因为我后面要在一个仓库中放我所有的package、应用等，比如组件库，脚手架等。所以有的层级较深。

::: details workspace协议

#### [workspace协议](https://pnpm.io/zh/workspaces)

默认情况下，如果可用的 `packages` 与已声明的可用范围相匹配，`pnpm` 将从工作空间链接这些 `packages`。

例如，如果`bar`中有`"foo"："^1.0.0"`的这个依赖项，则`foo@1.0.0`链接到`bar`。 但是，如果`bar`的依赖项中有`"foo": "2.0.0"`，而`foo@2.0.0`在工作空间中并不存在，则将从 `npm registry` 安装`foo@2.0.0`，这种行为带来了一些不确定性。

`pnpm` 支持 workspace 协议（写法：`workspace:<版本号>`）。 当使用此协议时，`pnpm` 将拒绝解析除本地 `workspace` 包含的 `package` 之外的任何内容。 因此，如果设置为`"foo": "workspace:2.0.0"`时，安装将会失败，因为`"foo@2.0.0"`不存在于此 `workspace` 中。

#### 别名引用

假如工作区有一个名为`foo`的包，可以通过这样引用 `"foo": "workspace:"`，如果是其它别名，可以这么引用：`"bar": "workspace:foo@*"`。

#### 相对引用

假如`packages`下有同层级的foo、bar，其中`bar`依赖于`foo`，则可以写作`"bar": "workspace:../foo"`。

此外还有关于如何`发布 workspace 包`, 发布工作流等，可参考[官网](https://pnpm.io/zh/workspaces) 。

:::

其实monorepo下的结构跟普通项目的结构大同小异，但是monorepo下面有一些需要特别注意的点。

a和b分别为monorepo下的一个项目，项目a依赖了`lodash`和`@types/lodash`，项目b依赖了项目a以及`react`。结构的如下：

```md

├── node_modules

│   ├──@types

│   │ └── lodash -> ../.pnpm/@types+lodash@4.14.177/node_modules/@types/lodash

|   |———.pnpm

├── package.json

├── packages

│   ├── a

│   │   ├── node_modules

│   │   │   ├── @types

│               └── lodash

│   │   │   └── lodash -> ../../../node_modules/.pnpm/lodash@4.17.21/node_modules/lodash

│   │   └── package.json

│   └── b

│       ├── node_modules

│       │   ├── a -> ../../a

│       │   └── react -> ../../../node_modules/.pnpm/react@17.0.2/node_modules/react

│       └── package.json

├── pnpm-lock.yaml

└── pnpm-workspace.yaml
```

可以看到：

- 所有依赖都平铺在最外层的`node_modules/.pnpm`这个目录。
- 项目b依赖的`react`，和项目a依赖的`lodash`和`@types/lodash`都指向了上面这个目录对应的文件夹。
- 通过`worksapce协议`，项目b依赖指定其依赖a为本地项目的a，直接把`node_modules/a`软链到了项目a的路径。

### 依赖管理

常见的命令：[官网查看更多命令](https://pnpm.io/zh/cli/add)

这里主要列举monorepo管理package的命令

```shell
#  一键递归安装 https://pnpm.io/zh/cli/recursive
pnpm i -r
# 移除所有包中的 lodash-es
pnpm remove lodash-es -r
# 1. 全局的公共依赖包
pnpm install typescript -w
# 2. 给某个package单独安装指定依赖
pnpm add axios --filter @apps/web
# 3. 模块之间的相互依赖
pnpm install @sysuke/eslint-config-react @sysuke/tsconfig --filter @sysuke/webpack-react-base -D
# 安装到多个项目
pnpm add mf-communication --filter="@mf.react-ts/*"
# 会执行所有 package 下的 build 命令
pnpm build --filter "./packages/**"
# 并行的跑apps所有的 dev 命令
pnpm -r --filter ./apps --parallel run dev
```

note:

- `-F`等价于`--filter`
- `--filter `参数跟着的是package下的 `package.json` 的 `name` 字段，**并不是目录名**。
- `package` 的version`*`代表默认同步最新版本, 还没找到怎么把包安装成`"@sysuke/eslint-config-base": "workspace:*",`格式，有说是在最后`@*`，但试了几次都报错。

::: details more detail

使用`pnpm`安装依赖包一般分以下几种情况：

- 全局的公共依赖包，比如打包涉及到的`rollup`、`typescript`等，代码样式美化的`prettier`等。

`pnpm` 提供了 [-w, --workspace-root](https://pnpm.io/zh/pnpm-cli#-w---workspace-root) 参数，可以将依赖包安装到工程的根目录下，作为所有 package 的公共依赖。

比如：

```shell
pnpm install typescript -w
```

如果是一个开发依赖的话，可以加上 -D 参数，表示这是一个开发依赖，会装到 pacakage.json 中的 devDependencies 中

- 给某个package单独安装指定依赖

  pnpm 提供了 [--filter](https://pnpm.io/zh/filtering) 参数，可以用来对特定的package进行某些操作。
  如果想给 pkg1 安装一个依赖包，比如 axios，可以进行如下操作：

```shell
pnpm add axios --filter @apps/web
```

`--filter `参数跟着的是package下的 package.json 的 `name` 字段，**并不是目录名**。

还可以根据`--filter `执行对应包下的所有操作，只是比单个项目多加的参数，比如`pnpm build --filter @apps/web`。也支持批量执行`$ pnpm build --filter "./packages/**"`

- 模块之间的相互依赖

  比如 pkg1 中将 pkg2 作为依赖进行安装。基于 pnpm 提供的 `workspace:协议`，可以方便的在 packages 内部进行互相引用。比如在 pkg1 中引用 pkg2：

```shell
pnpm install @sysuke/pkg1 --filter @sysuke/pkg2
```

在设置依赖版本的时候推荐用 `workspace:*`，这样就可以保持依赖的版本是工作空间里最新版本，不需要每次手动更新依赖版本。

当 `pnpm publish` 的时候，会自动将 package.json 中的 workspace 修正为对应的版本号。
:::

### what else?

这样其实一个只是涉及依赖相互引用和包管理的基础`monorepo`工程就搞定了，比如一些历史工程的迁移，直接`copy`到`apps`，复用全局的配置，如`husky,commitlint`等，删除多余的配置和依赖，重新安装即可。但要想做好一个完整的`monorepo`工程，远不止如此。包括：

- 如何合理的抽取eslint、tsconfig配置
- 测试环境的全局配置
- 需要发布到npm上的包的发布工作流
- 全局的命令如何写才合适
- 依赖的包如何管理，构建发布
- 缓存如何复用等

#### eslint

Either start with `eslint-config-` or `@SCOPE/eslint-config.`

比如我的eslint package name为`@sysuke/eslint-config`, 就可以extend`sysuke`或者`eslint-config-sysuke`

#### husky + commitlint + lint-staged

这几个比较简单，安装后，再把配置提到root。

```shell
pnpm add husky lint-staged @commitlint/cli @commitlint/config-conventional  -w -D
```

## Release工作流 - changesets

::: details npm版本规范

版本格式：主版本号.次版本号.修订号

版本号递增规则如下：

- 主版本号：当你做了不兼容的 API 修改，
- 次版本号：当你做了向下兼容的功能性新增，
- 修订号：当你做了向下兼容的问题修正。

> 先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。 比如，我们经常在开源项目中见到的：alpha、beta 、rc

here is the detail doc: [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)

npm 的版本匹配策略

- `^1.0.1`：只要主版本一致都匹配（1.x），如：1、1.x
- `~1.0.1`：只要主版本和次版本一致都匹配（1.1.x），如：1.1、1.1.x
- `*`/`latest` ：全匹配，不受版本号影响，可以命中一切新发布的版本号
:::
一般发一个包，只需要在待发布项目目录，`npm login` + `npm publish`，更新也是一样。
但每次包（Package）的发布，需要修改 `package.json` 的 `version` 字段，以及同步更新一下本次发布修改的 `CHANGELOG.md`。

而在 `workspace` 中对包版本管理是一个非常复杂的工作（会存在依赖链的问题），遗憾的是 `pnpm` 没有提供内置的解决方案，一部分开源项目在自己的项目中自己实现了一套包版本的管理机制，比如 [Vue3](https://github.com/vuejs/vue-next) 、[Vite](https://github.com/vitejs/vite/blob/main/scripts/release.ts) 等。
`pnpm` 推荐了两个开源的版本控制工具：

- [changesets](https://github.com/changesets/changesets)
- [rush](https://rushjs.io/)

这里采用了 `changesets` 来做依赖包的管理。选用 `changesets` 的主要原因还是文档更加清晰一些，个人感觉上手比较容易。而`rushjs` 不止于管理release（rush是为大型团队准备的，它可以给你提供一个仓库下维护多个项目的构建和发布方案。），

按照 [`changesets`](https://github.com/changesets/changesets) 文档介绍的，`changesets`主要是做了两件事：

> Changesets hold two key bits of information: a version type (following semver), and change information to be added to a changelog.

简而言之就是用于管理版本及变更日志`changelog`的工具，专注多包管理。
生成的 `changelog` 遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/)，具体的做法是先根据你的代码更改生成 `changeset` 文件，然后发版的时候合并这些 `changeset` 文件、更改版本号、生成 `changelog`。

![](./images/changeset-flow.png)

### process

1. `changeset init`
- 新项目执行该命令，完成对项目的初始化
- 会在根目录下生成 `.changeset` 目录，`config.json`配置文件

2. `changeset`

- 执行该命令，进行版本管理，会交互式选择不同项目，以及确定发布的版本（如：major, minor, patch）
- 会生成一些 `.md` 文件在目录下，会在 `version` 的时候消耗

3. `changeset version`

- 消耗上一步生成的相关的一些版本信息及记录内容的 `.md` 文件，并生成或更新 `CHANGELOG.md` 文件，之后 `.md` 文件会被自动删除
- 相应的 `package.json` 中的 `version` 信息也会同步更新

4. `changeset publish`

- 发布包到远程 npm 源
- 前置条件是你已经进行了 npm 账户登录，如果包名称为` @ah-ailpha/components`该类型，还需要在 npm 账户中设置组织
- 在使用 `changeset publish` 之前，通常还需要运行 `npm run build` 或类似的构建命令，以确保所有更改都已经构建完成。

### 安装

```shell
# 安装
pnpm add -Dw @changesets/cli @changesets/changelog-github
# 初始化
pnpm changeset init
```

`@changesets/changelog-github` 是一个生成 `changelog` 的插件，如果不修改这个配置也可以工作，但是生成的 `changelog` 不太完美！

![](./images/changeset-init.png)

执行完初始化命令后，会在工程的根目录下生成 `.changeset` 目录，其中的 `config.json` 作为默认的 `changeset` 的配置文件。

配置文件如下：

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

[说明](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md) 如下：

- changelog: 设置 `CHANGELOG.md` 生成方式，可以设置 `false` 不生成，也可以设置为定义生成行为的文件地址或依赖名称。

添加  `@changesets/changelog-github`后修改

```json5
{
  "changelog": [
    "@changesets/changelog-github",
    {
      "repo": "qinsong77/sysuke" // 改为你的 github 仓储
    }
  ],
}
```

- commit: 设置是否把执行 `changeset add `或 `changeset version` 操作时对修改用 `git` 自动提交对应文件。(A GitHub token with repo, write:packages permissions)
- [fixed](https://github.com/changesets/changesets/blob/main/docs/fixed-packages.md): 设置那些包的版本保持一致的更新
- linked: 设置共享版本的包，而不是独立版本的包，例如一个组件库中主题和单独的组件的关系，也就是修改 Version 的时候，共享的包需要同步一起更新版本
- access: 公私有安全设定，内网建议 `restricted` ，开源使用 `public`
- baseBranch: 设置默认的 Git 分支，例如现在 GitHub 的默认分支应该是 `main`
- updateInternalDependencies: 设置互相依赖的包版本更新机制，它是一个枚举（`major|minor|patch`），例如设置为 minor 时，只有当依赖的包新了`minor` 版本或者才会对应地更新 `package.json` 的 `dependencies` 或 `devDependencies` 中对应依赖的版本
- ignore: 设置不需要发布的包，这些会被 `changesets` 忽略

在初始化 `.changeset` 文件夹后，就可以正常使用 `changeset` 相关的命令，主要是这 3 个命令：

- `chageset/npx changeset` 开始交互式填写变更集，这个命令会将你的包全部列出来，然后选择你要更改发布的包, 用于生成本次修改的要添加到 `CHANGELOG.md` 中的描述
- `changeset version` 用于生成本次修改后的包的版本
- `changeset publish` 用于发布包

`changeset version`改命令就是来修改发布包的版本的。里面对应了这样几个版本约束（版本号按0.0.0这样的三段式,严格遵循 [semver](https://semver.org/) 规范。）：

- patch 更新小版本号，代表fix补丁
- minor 更新中版本号，代表小功能改动
- major 更新大版本号，代表功能大跨步升级

此外，如果是在业务场景下，我们通常需要把包发到公司私有的 `NPM Registry`，而这有很多种配置方式。但是，需要注意的是 changesets 只支持在每个包中声明 publicConfig.registry 或者配置 process.env.npm_config_registry，对应的代码会是这样：

```ts
// https://github.com/changesets/changesets/blob/main/packages/cli/src/commands/publish/npm-utils.ts
function getCorrectRegistry(packageJson?: PackageJSON): string {
  const registry =
    packageJson?.publishConfig?.registry ?? process.env.npm_config_registry;

  return !registry || registry === "https://registry.yarnpkg.com"
    ? "https://registry.npmjs.org"
    : registry;
}
```

可以看到，如果在前面说的这2种情况下获取不到 `registry` 的话，Changesets 都是按公共的 Registry 去查找或者发布包的。

这里还有个细节，如果我不想直接发 release 版本，而是想先发一个带 tag 的 prerelease版本呢(比如beta或者rc版本)？

这里提供了两种方式：

- 手工调整

这种方法最简单粗暴，但是比较容易犯错。 首先需要修改包的版本号：

```json
{
  "name": "@sysuke/pkg1",
  "version": "1.0.2-beta.1"
}
```

然后运行： `pnpm changeset publish --tag beta`，注意发包的时候不要忘记加上`--tag` 参数。

- 通过 `changeset` 提供的 [`Prereleases` 模式](https://github.com/changesets/changesets/blob/main/docs/prereleases.md) ,可以通过 `pre enter <tag> `命令进入先进入 `pre `模式。

常见的tag如下所示：


| 名称  | 功能                                                                                     |
| ----- | ---------------------------------------------------------------------------------------- |
| alpha | 是内部测试版，一般不向外部发布，会有很多Bug，一般只有测试人员使用                        |
| beta  | 也是测试版，这个阶段的版本会一直加入新的功能。在Alpha版之后推出                          |
| rc    | Release　Candidate) 系统平台上就是发行候选版本。RC版不会再加入新的功能了，主要着重于除错 |

```shell
pnpm changeset pre enter beta
```

之后在此模式下的 `changeset publish`  均将默认走 `beta` 环境，下面在此模式下任意地进行你的开发。
完成版本发布之后，退出 `Prereleases` 模式：

```shell
pnpm changeset pre exit
```

构建产物后发版本

```shell
{
  "release": "pnpm build && pnpm release:only",
  "release:only": "changeset publish --registry=https://registry.npmjs.com/"
}
```

如果用户想查看当前的 `changesets` 文件消耗状态，那么可以使用 `changeset status` 命令。

#### what else?

业务项目发布流是怎么样的？

- 不同开发者先开发，在提交 PR 时使用 `pnpm changeset` 写入一份变更集
- 定期项目 owner 发包，使用 `changeset version` 消耗所有变更集，由 `changesets` 自动提升子包版本、生成 changelog
- 执行 `pnpm release`(build package + `changeset publish`) 构建全部项目并发包

开源项目发布流是怎样的？

- 由 github bot 帮助，每位开发者 PR 前提交一份变更集
- 由 github bot 帮助，项目 owner 定期点击合入 bot 提出的 发版 PR ，一键合入提升版本，生成 changelog
- 由 github actions 帮助，当 发版 PR 被合入时，自动发包到 npm

`changeset version` 和`changeset pubulish` 可以交给`git-action`完成，可参考[repo](https://github.com/vercel/turborepo/tree/main/examples/design-system)

可以看到，发版时项目 owner 做了什么？点击几下鼠标 😅 ，但是 changelog 、版本提升、发包 却一点没少，是真的很 nice。

`npm unpublish  @sysuke/eslint-config-react --force` 撤销发布的包。（不加force有限制：只能删除72小时以内发布的包，删除的包，在24小时内不允许重复发布）,如果被其他发布上去的包依赖的话，就删除不了。

## [TurboRepo](https://turborepo.org/)

![](./images/turborepo.png)

Turbrepo 则是 [Vercel](https://vercel.com/) 旗下的一个开源项目。 Turborepo 是一个用于 JavaScript 和 TypeScript 代码库的高性能构建系统。通过增量构建、智能远程缓存和优化的任务调度，Turborepo 可以将构建速度提高 85% 或更多，使各种规模的团队都能够维护一个快速有效的构建系统，该系统可以随着代码库和团队的成长而扩展。

### 什么是monorepo

Monorepo是一种项目管理方式，在Monorepo之前，代码仓库管理方式是 MultiRepo，即每个项目都对应着一个单独的代码仓库每个项目进行分散管理。这就会导致许多弊端，例如可能每个项目的基建以及工具库都是差不多的，基础代码的重复复用问题等等...

Monorepo就是把多个项目放在一个仓库里面, 关于monorepo的文章已经很多了，并且目前可以搭建Monorepo的工具也很多，例如：


| 工具                                | 简述                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| [Bit](https://bit.dev/)             | 用于组件驱动开发的工具链                               |
| [TurboRepo](https://turborepo.org/) | 用于 JavaScript 和 TypeScript 代码库的高性能构建系统。 |
| [Rush](https://rushjs.io/)          | 一个可扩展的 web 单仓库管理器。                        |
| [Nx](https://nx.dev/)               | 具有一流的 monorepo 支持和强大集成的下一代构建系统。   |
| [Lerna](https://lerna.js.org/)      | 用于管理包含多个软件包的项目                           |

以上几个，个人都有些尝试，项目中也用过lerna和nx，我理解`Lerna`其实挺适合用来管理发包的，比较纯粹，`nx`集成来太多的功能和配置，类似与react中的`umi.js`，适合与快速搭建跑起项目，但当出了问题或者有自定义功能的适合，就不好操作了，
文档不全，有时还要深入源码，这时性价比反而不高。至于`bit`理解可用于微前端的场景，而Rush有点复杂，不太推荐。还好最近前端的翘楚Vercel推出了`TurboRepo`，也快一年了，版本来到了1.5， 基本没啥bug可以用了，为啥偏爱这个，我就是觉得它配置比较简单，功能纯粹，对
本身monorepo下的代码入侵小，即Turborepo抽象出所有烦人的配置、脚本和工具，减少项目配置的复杂性，可以让我们专注于业务的开发，比较干净的能实现包或者应用构建时的任务编排，增量构建，缓存等，而且基于go，还快。

一个monorepo工具除了最基本的代码共享能力外，还应当至少具备三种能力，即：

1. 依赖管理能力。随着依赖数量的增加，依旧能够保持依赖结构的正确性、稳定性以及安装效率。
2. 任务编排能力。能够以最大的效率以及正确的顺序执行 Monorepo 内项目的任务（可以狭义理解为 `npm scripts`，如 build、test 以及 lint 等），且复杂度不会随着 Monorepo 内项目增多而增加。
3. 版本发布能力。能够基于改动的项目，结合项目依赖关系，正确地进行版本号变更、CHANGELOG 生成以及项目发布。

基于此，一些流行工具的支持能力如下表所示：



| -              | 依赖管理     | 任务编排 | 版本管理 |
| -------------- | ------------ | -------- | -------- |
| Pnpm Workspace | yes          | yes      | no       |
| Rush           | yes(by Pnpm) | yes      | yes      |
| Lage           | no           | yes      | no       |
| Turborepo      | no           | yes      | no       |
| Lerna          | no           | yes      | yes      |



依赖管理过于底层，版本控制较为简单且已成熟，将这两项能力再做突破是比较困难的，实践中基本都是结合 Pnpm 以及  Changesets 补全整体能力，甚至就干脆专精于一点，即任务编排，也就是 Lage 以及 Turborepo 的发力点。



#### 如何选择合适自己的 Monorepo 工具链？

1. Pnpm Workspace + Changesets：成本低，满足大多数场景
2. Pnpm Workspace + Changesets + Turborepo/Lage：在 1 的基础上增强任务编排能力
3. Rush：考虑全面，扩展性强

任务编排可以划分为三个步骤，各工具支持如下：


| <br/>          | 范围界定 | 并行执行 | 云端缓存 |
| -------------- | -------- | -------- | -------- |
| Pnpm           | ✅       | ✅       | ❌       |
| Rush           | ✅       | ✅       | ✅       |
| Turborepo/Lage | ✅       | ✅       | ✅       |


### TurboRepo的优势

#### 多任务并行处理

Turbo支持多个任务的并行运行，我们在对多个子包编译打包的过程中，turbo会同时进行多个任务的处理。在传统的 monorepo 任务运行器中，就像`lerna`或者`yarn`自己的内置`workspaces run` 命令一样，每个项目的script生命周期脚本都以拓扑方式运行（这是“依赖优先”顺序的数学术语）或单独并行运行。根据 monorepo 的依赖关系图，CPU 内核可能处于空闲状态——这样就会浪费宝贵的时间和资源。

> 什么是拓扑 ？
拓扑 [Topological Order](https://turborepo.org/docs/glossary#topological-order) 是一种排序 拓扑排序是依赖优先的术语， 如果 A 依赖于 B，B 依赖于 C，则拓扑顺序为 C、B、A。
> 
> 比如一个较大的工程往往被划分成许多子工程，我们把这些子工程称作活动(activity)。在整个工程中，有些子工程(活动)必须在其它有关子工程完成之后才能开始，也就是说，一个子工程的开始是以它的所有前序子工程的结束为先决条件的

为了可以了解turbo多么强大，下图比较了turbo vs lerna任务执行时间线：

![](./images/turbo1.png)

Turbo它能够有效地安排任务类似于瀑布可以同时异步执行多个任务，而lerna一次只能执行一项任务 所以Turbo的 性能不言而喻。


#### 更快的增量构建

如果我们的项目过大，构建多个子包会造成时间和性能的浪费，turborepo中的缓存机制 可以帮助我们记住构建内容 并且跳过已经计算过的内容，优化打包效率。应该是借鉴了nx。

#### 云缓存

Turbo通过其远程缓存功能可以帮助多人远程构建云缓存实现了更快的构建。

#### 任务管道

用配置文件定义任务之间的关系，然后让Turborepo优化构建内容和时间。在 Turborepo 中有个 Pipelines 的概念，它是由 `turbo.json` 文件中的 `pipeline` 字段的配置描述，它会在执行 `turbo run` 命令的时候，根据对应的配置进行有序的执行和缓存输出的文件。

#### 基于约定的配置

通过约定降低复杂性，只需几行JSON 即可配置整个项目依赖，执行脚本的顺序结构。

#### 浏览器中的配置文件

生成构建配置文件并将其导入Chrome或Edge以了解哪些任务花费的时间最长。这点还比不上nx，nx可以直接生成拓扑图

### Turbo 核心概念

包括`pipeline`，`DependsOn`，拓扑依赖，`Output`，`Caching`, `Remote Caching`等，可以看官网有详细的文档描述。


### Demo实战

我们可以通过现有的monorepo改造，也可以直接创建turbo项目，直接创建参考官网，直接选择模版体验就行，这里就不展示了。

turbo的另一大特色就是改造现有的monorepo也很简单，只需要安装 turbo 依赖，根目录添加 `turbo.json` 一切就尽在掌握了。

1. 安装
```shell
pnpm add turbo -Dw
```
2. 创建`turbo.json`

trubo 可以智能的安排任务调度。在根项目 `turbo.json` 中定义任务的依赖关系。例如：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "deploy": {
      "dependsOn": ["build", "test", "lint"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "dependsOn": ["build", "test", "lint"],
      "cache": false
    }
  }
}
```

上面描述的大致意思是：

- `dependsOn` 表示当前命令所依赖的命令，`^`表示 `dependencies` 和 `devDependencies` 的所有依赖都执行完 `build`，才执行 `build`
- `outputs `表示命令执行输出的文件缓存目录，例如我们常见的 `dist`、`coverage` 等
- `cache` 表示是否缓存，通常我们执行 dev 命令的时候会结合 watch 模式，所以这种情况下关闭掉缓存比较切合实际需求
- `build` 命令执行依赖于其依赖项的 `build` 命令执行完成
- `test` 命令执行依赖于自身的 `build` 命令执行完成
- `lint` 命令可以任何时候执行
- `deploy` 命令执行依赖于自身的 `build test lint` 命令执行完成

使用一条命令执行所有任务`turbo run lint build test deploy`

在`package.json`中配置`script`:

```json
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "lint": "turbo run lint"
  }
}
```
只要你的每个包或者app的`package.json`中配置的`script`都符合配置，那么turbo就算基本配置完成了，是真的🐮。

maybe need to add more detail...

## Reference
- [Monorepos in JavaScript & TypeScript](https://www.robinwieruch.de/javascript-monorepos/)
- [monorepo工作流基础之changesets打开与进阶](https://blog.csdn.net/qq_21567385/article/details/122361591)
- [Changesets: 流行的 Monorepo 场景发包工具](https://mp.weixin.qq.com/s/QKqaO3U1gzwWb2sDiF4cLQ)
- [Ditching manual releases with Changesets](https://dnlytras.com/blog/using-changesets/)
- [从 Turborepo 看 Monorepo 工具的任务编排能力](https://mp.weixin.qq.com/s/OrekHmMrn8UlisTrvt3MNA)
- [semantic-release](https://github.com/semantic-release/semantic-release)
- [monorepo参考仓库](https://github.com/ycjcl868/monorepo/issues/9#issuecomment-1139647579)
- [Monorepo 下的模块包设计实践](https://juejin.cn/post/7052271542000074782)
---
