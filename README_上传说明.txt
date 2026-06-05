MCCS 网站修复包 - 上传说明

这个压缩包只包含需要覆盖/恢复的文件：
1. index.html
2. products/index.html

上传方法：
1. 解压 mccs_website_fix_upload.zip
2. 打开解压后的 mccs_upload_fix 文件夹
3. 将里面的 index.html 覆盖 GitHub 仓库根目录的 index.html
4. 将 products 文件夹上传到仓库根目录
5. 如果 GitHub 提示 products/index.html 已存在，选择覆盖
6. 等 Vercel 自动部署完成后，检查：
   - https://www.mccsgrowingmedia.com/
   - https://www.mccsgrowingmedia.com/products/
   - https://www.mccsgrowingmedia.com/contact/

注意：
- 不需要删除 assets、data、styles.css、contact、about 等原有文件。
- 产品页会读取原有 /data/products.json，所以原来的产品图片和产品数据继续使用。
- 这版已经去掉内部备注/占位语气，首页和产品页都按海外 B2B 询盘方向写。
