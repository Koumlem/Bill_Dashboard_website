# Bill Dashboard

A React + Vite web app for importing WeChat and Alipay bills and visualizing spending.

## Available Scripts

- `npm run dev` – start a development server with hot module replacement
- `npm run build` – build the production bundle
- `npm run lint` – run ESLint on the source files
- `npm test` – run unit tests with Node's test runner

MEMU

Bill_Dashboard_website/
├── src/                      # 应用源代码
│   ├── main.jsx              # 入口文件，渲染 App 组件​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=11 path=src/main.jsx git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/main.jsx#L1-L11"}​
│   ├── App.jsx               # 路由与页面框架​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=16 path=src/App.jsx git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/App.jsx#L1-L16"}​
│   ├── components/           # 可复用 UI 组件
│   │   ├── Layout.jsx        # 左侧导航 + 主内容区布局
│   │   ├── UploadBox.jsx     # 负责文件上传与解析​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=27 path=src/components/UploadBox.jsx git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/components/UploadBox.jsx#L1-L27"}​
│   │   └── TablePreview.jsx  # 解析后账单预览表格
│   ├── pages/                # 页面组件
│   │   ├── Import.jsx        # 账单导入页：上传、预览、保存到 localStorage​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=24 path=src/pages/Import.jsx git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/pages/Import.jsx#L1-L24"}​
│   │   └── Analysis.jsx      # 消费分析页：统计支出收入与商户排行​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=33 path=src/pages/Analysis.jsx git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/pages/Analysis.jsx#L1-L33"}​
│   ├── adapters/             # 微信或支付宝账单解析器​:codex-file-citation[codex-file-citation]{line_range_start=3 line_range_end=40 path=src/adapters/wechat.js git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/adapters/wechat.js#L3-L40"}​​:codex-file-citation[codex-file-citation]{line_range_start=3 line_range_end=36 path=src/adapters/alipay.js git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/adapters/alipay.js#L3-L36"}​
│   ├── utils/                # 工具函数（含单元测试）
│   │   ├── processData.js    # 数据清洗与分类​:codex-file-citation[codex-file-citation]{line_range_start=3 line_range_end=44 path=src/utils/processData.js git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/utils/processData.js#L3-L44"}​
│   │   └── processData.test.js # 使用 Node 测试框架的简单单测​:codex-file-citation[codex-file-citation]{line_range_start=1 line_range_end=17 path=src/utils/processData.test.js git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/src/utils/processData.test.js#L1-L17"}​
│   └── assets/               # 静态资源
├── public/                   # 静态文件
├── package.json              # 依赖与脚本声明​:codex-file-citation[codex-file-citation]{line_range_start=13 line_range_end=33 path=package.json git_url="https://github.com/Koumlem/Bill_Dashboard_website/blob/main/package.json#L13-L33"}​
├── vite.config.js / tailwind.config.js / postcss.config.js / eslint.config.js 等配置文件
└── README.md                 # 项目说明
