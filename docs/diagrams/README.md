# Keymux 技术设计图集

打开 [图集入口](index.html)，或从下表进入独立交互图。设计依据：[technical-design.md](../technical-design.md)；项目约束：[AGENTS.md](../../AGENTS.md)。

## 图目

| 编号 | 图 | 类型 | 可编辑源与交付凭据 |
| --- | --- | --- | --- |
| 01 | [系统总体架构](01-system-architecture.html) | 架构图 | [JSON](01-system-architecture.json) / [回执](01-system-architecture.receipt.json) |
| 02 | [macOS 授权与份额数据流](02-macos-secret-dataflow.html) | 数据流图 | [JSON](02-macos-secret-dataflow.json) / [回执](02-macos-secret-dataflow.receipt.json) |
| 03 | [签名请求与授权流程](03-signing-workflow.html) | 流程图 | [JSON](03-signing-workflow.json) / [回执](03-signing-workflow.receipt.json) |
| 04 | [人机协同签名时序](04-signing-sequence.html) | 时序图 | [JSON](04-signing-sequence.json) / [回执](04-signing-sequence.receipt.json) |
| 05 | [密钥组创建与激活时序](05-dkg-sequence.html) | 时序图 | [JSON](05-dkg-sequence.json) / [回执](05-dkg-sequence.receipt.json) |
| 06 | [固定成员份额刷新](06-share-refresh.html) | 流程图 | [JSON](06-share-refresh.json) / [回执](06-share-refresh.receipt.json) |
| 07 | [签名请求与结果生命周期](07-request-lifecycle.html) | 状态图 | [JSON](07-request-lifecycle.json) / [回执](07-request-lifecycle.receipt.json) |
| 08 | [Hyperliquid 下单与确认](08-hyperliquid-submission.html) | 流程图 | [JSON](08-hyperliquid-submission.json) / [回执](08-hyperliquid-submission.receipt.json) |
| 09 | [Solana 交易签名与确认](09-solana-submission.html) | 流程图 | [JSON](09-solana-submission.json) / [回执](09-solana-submission.receipt.json) |
| 10 | [密钥组建立、刷新与恢复](10-key-lifecycle.html) | 状态图 | [JSON](10-key-lifecycle.json) / [回执](10-key-lifecycle.receipt.json) |
| 11 | [多端技术栈与复用边界](11-cross-platform-architecture.html) | 架构图 | [JSON](11-cross-platform-architecture.json) / [回执](11-cross-platform-architecture.receipt.json) |

## 阅读边界

- 这是设计草案的可视化，不是已实现能力、生产部署图或安全审计结论。已确认需求与推荐方案的区别，以技术设计文档为准。
- 纯人工组使用 t-of-n；人机组要求指定 Agent AND k-of-m 人工。Hyperliquid 每次签名都需要人工。
- 系统图按角色展开：结果接收者运行在选定参与端；授权提交 worker 属于协调服务。协调服务不持有份额，不是 MPC 参与方。
- macOS 图表达原生授权与内存交接；Flutter、Swift、Rust 仍在同一进程。严格指纹策略、设备行为和其他平台构建仍需确认或 PoC。
- 状态图是重点状态的阅读视图，部分恢复条件放在说明卡片中；完整守卫条件、有效性与并发规则见技术设计 §7–§12。

## 检查结果

11 张图均通过 Archify Showcase 全部 9 项检查，组成错误与警告均为 0。全部通过 1440×900、1600×1000、1920×1080、2048×1320 的页面边界检查，并查看最小与最大尺寸的明暗截图。

人工视觉复核：10 张通过；图 09 在 2048×1320 下底部留白约 21%，内容完整，但大屏视觉平衡未通过。它保留可用 HTML，未标为完整视觉验收通过。

每张图的 `.receipt.json` 记录规格及 HTML 的 SHA-256、字节数和 9/9 结果；`.visual-check.json` 记录实际浏览器测量；`.visual-check.html` 是四张 PNG 的联系表。自动视觉回执的 `visualReview: pending` 是 Archify 固定行为，人工检查结论单独保存在 [delivery-summary.json](delivery-summary.json)。该记录同时绑定技术设计文档的 SHA-256。

未逐项操作查看器的搜索、焦点和导出控件；未验证真实 MPC、Touch ID 或链上交易执行。

## 更新方式

使用 Archify 2.16 及同目录 JSON 源文件重新生成。不要直接修改已交付 HTML；改动源后重新验证、交付、截图并更新交付记录。

```sh
node /path/to/archify/bin/archify.mjs validate architecture 01-system-architecture.json --quality showcase --json
node /path/to/archify/bin/archify.mjs deliver architecture 01-system-architecture.json 01-system-architecture.html --quality showcase --json
node /path/to/archify/bin/archify.mjs visual-check 01-system-architecture.html --json
```

命令中的 `/path/to/archify` 是已安装 skill 的目录，图类型应与 JSON 的 `diagram_type` 一致。生成后重新核对回执与落盘文件摘要，并查看真实截图。
