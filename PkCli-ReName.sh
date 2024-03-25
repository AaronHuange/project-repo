# 合并前
#mv ./project.tt.json ./project.tt.json.ejs
#mv ./project.config.json ./project.config.json.ejs
#mv ./package.json ./package.json.ejs
#mv ./src/index.html ./src/index.html.ejs
#mv ./config/index.js ./config/index.js.ejs
#
#git add ./project.tt.json.ejs
#git add ./project.config.json.ejs
#git add ./package.json.ejs
#git add ./src/index.html.ejs
#git add ./config/index.js.ejs

# 合并后
mv ./project.tt.json.ejs ./project.tt.json
mv ./project.config.json.ejs ./project.config.json
mv ./package.json.ejs ./package.json
mv ./src/index.html.ejs ./src/index.html
mv ./config/index.js.ejs ./config/index.js

git add ./project.tt.json
git add ./project.config.json
git add ./package.json
git add ./src/index.html
git add ./config/index.js
