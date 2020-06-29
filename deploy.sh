#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 拷贝文件
cp -R vuepress/.vuepress/dist/* $(pwd)

# 如果是发布到自定义域名
echo 'sysuke.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io  USERNAME=你的用户名
git push -f git@github.com:qinsong77/qinsong77.github.io.git master

cd -
