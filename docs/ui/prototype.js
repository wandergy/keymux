"use strict";

// shortcut: all state is in-memory sample data; replace the prototype with verified native models before implementation.
const icons = {
  inbox: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 13h5l2 3h4l2-3h5M8 8h8"/>',
  key: '<circle cx="8" cy="9" r="4"/><path d="m11 12 8 8m-3-3 3-3m-6 0 3-3"/>',
  history: '<path d="M4 6v5h5M4.5 10a8 8 0 1 1 .5 6M12 7v5l3 2"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M20 4v5h-5M4 20v-5h5M5 9a7 7 0 0 1 12-4l3 4M4 15l3 4a7 7 0 0 0 12-4"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-11v1"/>',
  sliders: '<path d="M4 7h5m4 0h7M4 17h9m4 0h3"/><circle cx="11" cy="7" r="2"/><circle cx="15" cy="17" r="2"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.info}</svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const requests = [
  { id:"KM-1042", type:"hyperliquid", source:"Hyperliquid", title:"买入 ETH 永续合约", subtitle:"ETH / USDC · 限价单", time:"10:42", icon:"H", group:"交易执行组", groupId:"group-hl-demo", rule:"Agent + 1 位人工", policy:"指定 Agent + 1-of-2 人工", mode:"Agent AND 1-of-2 人工", amount:"0.25", unit:"ETH", side:"买入", heroCaption:"订单名义金额 500.00 USDC", heroSide:"限价 2,000.00", heroSideSmall:"USDC / ETH", network:"Hyperliquid Testnet", method:"hyperliquid.order.v1", algorithm:"ECDSA / secp256k1", upstream:"交易策略 Agent · app-trading-demo", account:"示例-交易账户-HL-01（不可用地址）", roster:"交易 Agent + Quincy（我）", deadline:"2026-11-12 10:58:00 +08:00", fields:[["委托价格","2,000.00 USDC / ETH"],["委托数量","0.25 ETH"],["订单类型","限价 · GTC（撤销前有效）"],["仅减仓","否 · 可增加仓位"],["成交费用","按成交时费率结算；示例未计算"],["委托名义金额","500.00 USDC；不含费用，不代表最大损失"],["交易账户","示例-交易账户-HL-01（不可用地址）",true],["签名账户","示例-MPC-签名账户-HL-01（不可用地址）",true],["收款方 / 合约授权","无外部收款方；不授予合约权限",true]], note:"提交截止不等于挂单失效：限价单提交后可能继续挂单，撤单需要独立请求。", input:"EIP-712 摘要；从已固定的原始订单重建，不额外哈希。", digest:"73d1a98e2f6c40b58a91e327c0d58b6f4a0e62aab9946783b70419ac2e5f01d8" },
  { id:"KM-1041", type:"business", source:"管理平台", title:"发布风控配置", subtitle:"risk-policy · 修订版本 42", time:"10:36", icon:"B", group:"业务审批组", groupId:"group-business-demo", rule:"2-of-3 人工", policy:"2-of-3 人工", mode:"2-of-3 人工", amount:"42", unit:"修订版本", side:"配置发布", heroCaption:"risk-policy · 测试工作空间", heroSide:"仅签业务数据", heroSideSmall:"不执行资金转账", network:"业务测试环境 · 非链上交易", method:"business.ed25519.v1", algorithm:"Ed25519", upstream:"管理平台 · app-approval-demo", account:"业务域 risk-policy / approval-executor", roster:"Quincy（我）+ 陈雨", deadline:"2026-11-12 11:10:00 +08:00", fields:[["业务操作","发布风控配置 publish_configuration"],["资源标识","risk-policy"],["修订版本","41 → 42"],["实际变更","enabled: false → true"],["业务操作标识","operation-demo-0042",true],["签名接收方","approval-executor · 管理平台",true],["金额 / 收款方","不涉及金额或资金收款方",true],["执行条件","平台验签后按 applicationId + operationId 原子核销",true]], note:"业务同意不等于 MPC 签名。签名交付后，实际发布与防重复执行由管理平台负责。", input:"带业务域前缀的版本化 JCS 信封原文；Ed25519，不额外预哈希。", digest:"85e9f34a1db2570c6496e35f2803c47a58bc12367e02458a9f0de6b12c7493d1" },
  { id:"KM-1040", type:"solana", source:"Solana", title:"发送 0.10 SOL", subtitle:"资金调拨 · Devnet", time:"10:28", icon:"S", group:"Solana 测试组", groupId:"group-solana-demo", rule:"2-of-3 人工", policy:"2-of-3 人工", mode:"2-of-3 人工", amount:"0.10", unit:"SOL", side:"SOL 转账", heroCaption:"原生 SOL · System Program 转账", heroSide:"预计 0.000005", heroSideSmall:"SOL 网络费 · 示例估值", network:"Solana Devnet", method:"solana.transaction.v1", algorithm:"Ed25519", upstream:"资金管理台 · app-treasury-demo", account:"示例-Solana-付款账户-01（不可用地址）", roster:"Quincy（我）+ 陈雨", deadline:"2026-11-12 10:50:00 +08:00", fields:[["转账金额","0.10 SOL（100,000,000 lamports）"],["交易版本","legacy · 1 条转账指令"],["付款账户 / fee payer","示例-Solana-付款账户-01（不可用地址）",true],["收款账户","示例-Solana-收款账户-02（不可用地址）",true],["调用程序","System Program · transfer；不授予额外权限",true],["预计网络费","0.000005 SOL · 示例估值"],["模拟执行","示例未运行链上模拟，不保证执行结果"],["有效高度","lastValidBlockHeight 280,000,150（示例）",true]], note:"本组占一个链上签名槽；2 位 MPC 参与人不等于 2 个链上签名者。blockhash 改变必须重新审核。", input:"准确的 legacy transaction message 字节；不是完整交易，也不是 message 的 SHA-256 摘要。", digest:"c3604e0ad82bf19e74a0605bf31792a467d54e12a7b8502c9311de67c9a25f08" },
];
const groups = [
  {id:"group-hl-demo",name:"交易执行组",type:"hyperliquid",purpose:"Hyperliquid Testnet · order",algorithm:"ECDSA / secp256k1",rule:"Agent AND 1-of-2 人工",online:"2 / 3 在线",ready:false,fingerprint:"示例公钥指纹 HL:7C4A:8D12:920E",epoch:"3",backup:"各方独立加密备份 · 演练待验证"},
  {id:"group-business-demo",name:"业务审批组",type:"business",purpose:"业务审批 · 测试",algorithm:"Ed25519",rule:"2-of-3 人工",online:"3 / 3 在线",ready:true,fingerprint:"示例公钥指纹 BA:4E18:9F2A:730B",epoch:"2",backup:"3 方备份登记齐全 · 演练待验证"},
  {id:"group-solana-demo",name:"Solana 测试组",type:"solana",purpose:"Solana Devnet · transaction",algorithm:"Ed25519",rule:"2-of-3 人工",online:"3 / 3 在线",ready:true,fingerprint:"示例公钥指纹 SO:5B29:3C7D:140F",epoch:"1",backup:"3 方备份登记齐全 · 演练待验证"},
];
const scenarioOptions = [
  ["normal","正常审核"],["waiting","等待参与方"],["running","共同签名中"],["unknown","签名结果未知"],["submission_unknown","提交结果未知"],["sign_only","仅签名，不请求提交"],["partial","Solana 等待外部签名"],["cancelled_signed","取消后发现签名"],["touch_unavailable","指纹不可用"],["keychain_invalid","Keychain 已失效"],["unparsed","无法解析"],["expired","已过期"],
];
const states = {
  normal:{label:"待我审核",tone:"blue",title:"",description:"",action:"批准并签名（模拟）"},
  waiting:{label:"等待参与方",tone:"amber",title:"本次固定参与集合尚未就绪",description:"本次选定的一位参与方离线。等待其在线后再授权，不提前解锁份额；更换为另一合法组合必须创建新尝试并重新授权。",action:"等待参与方就绪"},
  unknown:{label:"签名结果未知",tone:"amber",title:"不能排除签名已产生",description:"原签名尝试中断。先查询原 attempt 的持久化结果和提交状态；不能自动重签或更换输入。",action:"查询原结果（模拟）"},
  cancelled_signed:{label:"已请求取消，签名已生成",tone:"red",title:"已请求取消，但签名已生成；禁止自动交付与提交",description:"本地取消不能撤销已产生的签名。需人工核对是否曾对外发送；此演示不开放交付或重签。",action:"核对原结果（模拟）"},
  touch_unavailable:{label:"授权不可用",tone:"amber",title:"本机 Touch ID 暂不可用",description:"示例采用严格 Touch ID 基线，不回退密码。本次尚未启动 MPC；恢复设备授权能力后重新确认。",action:"Touch ID 不可用"},
  keychain_invalid:{label:"份额访问受阻",tone:"red",title:"指纹变更导致 Keychain 保护项失效",description:"禁止绕过系统访问控制。需通过已验证备份与当前组授权恢复；管理员不能直接解锁份额。",action:"Keychain 已失效"},
  unparsed:{label:"无法解析 · 禁止签名",tone:"red",title:"无法完整解释待签输入",description:"解析器发现未支持的字段或指令。无法核对实际签名内容，已禁止盲签；由上游修正后新建请求。",action:"无法解析，禁止签名"},
  expired:{label:"已过期",tone:"amber",title:"请求有效期已结束",description:"此示例确认尚未进入协议、没有输出。需要由上游创建新的请求与签名输入，不能就地延长期限。",action:"请求已过期"},
  stale:{label:"版本已变化",tone:"amber",title:"旧请求已失效，需要重新准备",description:"密钥组份额版本已变化；本请求保留原固定输入和版本，不能沿用旧授权。请由上游重新准备请求。",action:"旧请求已失效"},
  submission_unknown:{label:"提交结果未知",tone:"amber",title:"签名结果确定，提交执行结果未知",description:"原签名已验证并保存，目标服务是否接受或执行仍待核实。只能查询原订单或交易，不重新签名、不自动替换 nonce 或 blockhash。",action:"查询原提交（模拟）"},
  sign_only:{label:"签名完成 · 未请求提交",tone:"green",title:"仅请求签名，未授权提交",description:"原请求只要求签名结果；可交付上游，但本流程不广播交易。真实原型未产生任何可用签名。",action:"查看签名结果示意"},
  partial:{label:"本组已签名 · 等待其他签名",tone:"amber",title:"本组签名完成，外部签名尚未齐全",description:"示例变体含第二个外部签名槽。本组只填自己的槽位；保持同一 message，等待外部签名齐全后才能提交。",action:"等待外部签名，禁止提交"},
  running:{label:"共同签名中（模拟）",tone:"blue",title:"本次授权已完成，MPC 尚未完成",description:"参与方正在模拟协议交互。授权通过不代表签名已生成；此时请求停止也不能保证尚无输出。",action:"模拟收到有效签名"},
  signed:{label:"签名已验证（模拟）",tone:"green",title:"模拟签名完成，等待交付",description:"示例显示预期公钥与准确输入验签通过；本原型没有执行密码运算。签名与交付分别记录。",action:""},
  delivered:{label:"已交付（模拟）",tone:"green",title:"签名已模拟交付管理平台",description:"仅表示签名结果已交付；业务是否发布由管理平台核对执行状态，此处未声称业务已生效。",action:"查看交付记录"},
  submitted:{label:"已提交 · 待确认（模拟）",tone:"amber",title:"已模拟提交，执行结果待确认",description:"接收请求不代表交易执行成功。保留原签名包并查询订单或交易状态，不自动重签。",action:"查询提交状态（模拟）"},
  rejected:{label:"已拒绝（模拟）",tone:"red",title:"当前请求已拒绝",description:"按演示建议策略，一位受邀审核人明确拒绝会结束当前请求。上游修改后应创建新请求。",action:"查看拒绝原因"},
  cancelled:{label:"已取消（模拟）",tone:"amber",title:"已取消，确认未进入协议",description:"本示例在启动协议前取消，没有签名输出。不会自动重启；重新开始需重新确认与授权。",action:"重新审核（模拟）"},
};
requests.forEach(request=>{request.shareEpoch=groups.find(group=>group.id===request.groupId).epoch;});
const requestState = Object.fromEntries(requests.map(r=>[r.id,{scenario:"normal",reason:"",attempt:1,cancelRequested:false}]));
let page="requests", selectedId="KM-1042", filter="all", query="", auditFilter="all", toastTimer, modalTrigger;
let groupSequence=1;
let deviceLocked=false;
let auditEvents=[
  {time:"10:42:08",request:"KM-1042",event:"请求通过格式检查（示例）",actor:"本机 / 交易 Agent",detail:"固定 group-hl-demo · policy v1 · epoch 3；等待本次授权。",kind:"request",result:"待审核"},
  {time:"10:40:15",request:"group-business-demo",event:"成员清单核对完成（示例）",actor:"Quincy / 陈雨 / 林舟",detail:"三方确认同一示例清单摘要，份额版本保持 epoch 2。",kind:"group",result:"已记录"},
  {time:"10:36:20",request:"KM-1041",event:"业务内容已阅读（示例）",actor:"陈雨",detail:"仅记录阅读；尚未产生 MPC 签名，也未解锁本地份额。",kind:"request",result:"待共同签名"},
  {time:"10:28:31",request:"KM-1040",event:"交易输入已准备（示例）",actor:"本机",detail:"独立用途组 group-solana-demo；固定原 message 与有效高度。",kind:"request",result:"待审核"},
  {time:"09:58:02",request:"device-quincy-demo",event:"本机安全检查（示例）",actor:"Quincy",detail:"演示配置：不跨请求复用授权、无密码回退、Keychain 不同步。未访问真实系统 API。",kind:"device",result:"模拟正常"},
];
const main=document.getElementById("main");
const modal=document.getElementById("modal");
const currentRequest=()=>requests.find(r=>r.id===selectedId);
const maintenanceBlocked=id=>requests.some(r=>r.groupId===id&&["running","unknown"].includes(requestState[r.id].scenario));
const currentScenario=()=>requestState[selectedId].scenario;
const attemptId=r=>`${r.id}-attempt-demo-${String(requestState[r.id].attempt).padStart(2,"0")}`;
const badge=(text,tone="")=>`<span class="badge ${tone}">${escapeHTML(text)}</span>`;
const datum=(label,value,full=false)=>`<dl class="datum${full?" full":""}"><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></dl>`;
const button=(label,action,classes="",extra="")=>`<button class="button ${classes}" data-action="${action}" ${extra}>${label}</button>`;

function toast(message){
  const element=document.getElementById("toast");
  element.textContent=message;element.classList.add("visible");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove("visible"),5000);
}
function logEvent(event,detail,kind="request",result="已记录",request=selectedId){
  auditEvents.unshift({time:"10:42:30",request,event:`${event}（模拟）`,actor:"Quincy · 本机",detail,kind,result});
}
function renderPage(){
  document.querySelectorAll("[data-page]").forEach(item=>{
    const active=item.dataset.page===page;item.classList.toggle("active",active);
    if(active)item.setAttribute("aria-current","page");else item.removeAttribute("aria-current");
  });
  document.getElementById("breadcrumb-title").textContent=({requests:"签名请求",groups:"密钥组",audit:"审计记录",security:"设备与安全"})[page];
  if(page==="requests")renderRequests();
  else if(page==="groups")renderGroups();
  else if(page==="audit")renderAudit();
  else renderSecurity();
}
function renderRequests(){
  main.innerHTML=`<div class="page-heading"><div><h1>签名请求</h1><p>每一次签名，都由你确认。</p></div><div class="heading-right">${button(`${icon("refresh")}刷新列表`,"refresh-requests","small")}</div></div>
  <div class="request-layout"><aside class="requests-column" aria-label="请求列表"><div class="list-toolbar"><label class="search">${icon("search")}<input id="search-requests" type="search" placeholder="搜索请求、应用或密钥组" aria-label="搜索请求、应用或密钥组" value="${escapeHTML(query)}"></label><div class="filters" role="group" aria-label="请求筛选"><button class="filter ${filter==="all"?"selected":""}" data-filter="all" aria-pressed="${filter==="all"}">全部</button><button class="filter ${filter==="pending"?"selected":""}" data-filter="pending" aria-pressed="${filter==="pending"}">待处理</button><button class="filter ${filter==="finished"?"selected":""}" data-filter="finished" aria-pressed="${filter==="finished"}">已处理</button></div></div><div id="request-list"></div><div class="list-footnote">只有本次合法参与组合在线就绪，<br>才会请求你的 Touch ID 授权。</div></aside><section id="review-column" aria-label="请求审核详情"></section></div>`;
  renderListAndDetail();
}
function visibleRequests(){
  return requests.filter(r=>{
    const finished=["signed","delivered","submitted","rejected","cancelled"].includes(requestState[r.id].scenario);
    const matchesFilter=filter==="all"||(filter==="finished"?finished:!finished);
    return matchesFilter&&`${r.title} ${r.source} ${r.group} ${r.id}`.toLowerCase().includes(query.trim().toLowerCase());
  });
}
function renderListAndDetail(){
  const visible=visibleRequests();
  if(visible.length&&!visible.some(r=>r.id===selectedId))selectedId=visible[0].id;
  document.getElementById("request-list").innerHTML=`<div class="list-label"><span>今天 · 11 月 12 日</span><span>${visible.length} 个请求</span></div>${visible.length?visible.map(r=>{
    const state=states[requestState[r.id].scenario];
    return `<button class="request-item ${r.id===selectedId?"selected":""}" data-request="${r.id}" aria-pressed="${r.id===selectedId}"><div class="request-item-top"><span class="app-icon ${r.type}">${r.icon}</span><span>${r.source}</span><time>${r.time}</time></div><h3>${r.title}</h3><p>${r.subtitle}</p><div class="item-bottom">${badge(state.label,state.tone)}<span class="item-rule">${r.rule}</span></div></button>`;
  }).join(""):'<div class="empty-state">没有符合条件的请求。<br>可修改搜索词或切换筛选。</div>'}`;
  if(!visible.length){document.getElementById("review-column").innerHTML='<div class="panel empty-state">没有可展示的请求详情。</div>';return;}
  renderDetail();
}
function renderDetail(){
  const r=currentRequest(), scenario=currentScenario(), s=states[scenario], actionable=scenario==="normal";
  const terminal=["signed","submitted","submission_unknown","sign_only","partial","delivered","cancelled_signed"].includes(scenario);
  const notice=s.title?`<div class="notice ${s.tone} request-status-note">${icon("info")}<div><strong>${s.title}</strong>${s.description}</div></div>`:"";
  const actionLabel=scenario==="normal"&&deviceLocked?"演示设备已锁定":scenario==="signed"?(r.type==="business"?"交付签名（模拟）":r.type==="hyperliquid"?"提交订单（模拟）":"提交交易（模拟）"):s.action;
  const allowed=["normal","running","unknown","submission_unknown","sign_only","cancelled_signed","signed","delivered","submitted","rejected","cancelled"].includes(scenario)&&!(scenario==="normal"&&deviceLocked);
  const safeFields=scenario==="unparsed"?`<div class="notice red">${icon("info")}<div><strong>内容预览已隐藏</strong>无法证明已解析字段完整对应签名输入，因此不展示部分内容作为可授权依据。</div></div>`:`<div class="transaction-hero"><div class="transaction-symbol">${r.type==="hyperliquid"?"Ξ":r.type==="business"?"↗":"◎"}</div><div><div class="transaction-amount">${r.amount} <span>${r.unit}</span></div><div class="transaction-caption">${r.heroCaption}</div></div><div class="transaction-side">${r.heroSide}<small>${r.heroSideSmall}</small></div></div><div class="section-title"><h3>${r.type==="business"?"审批内容":"交易内容"}</h3><span>由固定签名输入解析 · 演示</span></div><div class="data-grid">${r.fields.map(f=>datum(...f)).join("")}</div>`;
  document.getElementById("review-column").innerHTML=`<div class="selection-summary"><span>请求 ${r.id}</span><span>独立核对来源与签名内容 · 示例</span></div><article class="request-detail"><header class="detail-header"><div><div class="detail-eyebrow"><span class="app-icon ${r.type}">${r.icon}</span>${r.source}<span>／</span>${r.side}</div><h2>${r.title}</h2><p>${r.group} <span aria-hidden="true">·</span> ${r.network}</p></div>${badge(s.label,s.tone)}</header><div class="detail-grid"><div class="review-body">${notice}${safeFields}<div class="review-divider"></div><div class="section-title"><h3>请求与授权范围</h3>${badge("用途已绑定 · 示例","green")}</div><div class="data-grid">${datum("发起应用",r.upstream,true)}${datum("用途 / 签名方法",r.method,true)}${datum("签名算法",r.algorithm)}${datum("本组公开公钥指纹",groups.find(g=>g.id===r.groupId).fingerprint,true)}${datum("策略 / 份额版本",`v1 / epoch ${r.shareEpoch}`)}${datum(r.type==="hyperliquid"?"请求提交截止":"请求有效期",r.deadline,true)}</div><div class="review-divider"></div><div class="notice">${icon("info")}<div>${scenario==="partial"?"此演示变体的 transaction message 需要两个链上签名槽；本组只占槽位 0，槽位 1 待外部签名。MPC 内部人数不改变链上槽数。":r.note}</div></div><details class="verification"><summary>验证详情 <span>输入、来源、版本与摘要</span></summary><div class="verification-body">来源核验：上游应用身份与用途已固定（模拟）。所有地址均为不可用示例标识。<br>签名输入：${r.input}<br>密钥组 ${r.groupId} · key v1 · policy v1 · manifest v1 · epoch ${r.shareEpoch}<br>requestDigest 示例值（未实际计算）<code class="mono">${r.digest}</code>本次参与集合：${r.roster}<br>结果接收方：Quincy（本次集合成员）<br>attempt：${attemptId(r)}；不跨请求复用授权。${r.type==="hyperliquid"?'<br>EIP-712 Exchange / version 1 / chainId 1337 / source b；verifyingContract 为零地址；vault 未设置，cloid 为示例订单标识。':''}${r.type==="business"?'<br>域 keymux:business-approval:v1；audience approval-executor；原始信封与执行条件一并绑定。':''}${r.type==="solana"?`<br>blockhash 示例标识不可提交；集群 Devnet；本组签名槽 0。${scenario==="partial"?"本变体需 2 个链上签名槽，槽位 1 待外部签名，禁止提交。":"本示例仅需 1 个链上签名槽。"}不含 ALT。`:''}</div></details></div>${renderParticipants(r,scenario,terminal)}</div><footer class="detail-footer"><div class="footer-note">${icon("lock")}<span>${actionable?(deviceLocked?"演示设备已锁定。请先在设备与安全中解锁演示设备，再重新确认本次签名。":"确认后将进入本次授权示意。真实产品由 Keychain 访问触发 Touch ID；本页不访问秘密材料。"):s.description}</span></div><div class="footer-actions"><div class="footer-actions-group">${button("拒绝请求","reject","danger small",["normal","waiting","unparsed"].includes(scenario)?"":"disabled")}${button(scenario==="running"?"请求停止":"取消请求","cancel-request","text small",["normal","waiting","running"].includes(scenario)?"":"disabled")}</div>${button(`${actionLabel}${actionable?icon("arrow"):""}`,"primary","primary",allowed?"":"disabled")}</div></footer></article><div class="demo-bar"><label for="demo-state">${icon("sliders")}演示状态</label><select id="demo-state">${scenarioOptions.filter(([value])=>value!=="partial"||r.type==="solana").map(([value,label])=>`<option value="${value}" ${scenario===value?"selected":""}>${label}</option>`).join("")}${!scenarioOptions.some(([value])=>value===scenario)?`<option value="${scenario}" selected>${s.label}</option>`:""}</select>${button("重置本请求","reset-request","text small")}<span class="demo-note">仅用于设计评审 · 时间固定</span></div>`;
}
function renderParticipants(r,scenario,terminal){
  const agent=r.type==="hyperliquid",waiting=scenario==="waiting";
  const first=agent?"交易 Agent":"陈雨",firstSub=agent?"必选参与方 · 独立份额":"人工参与方 · MacBook Pro";
  return `<aside class="participants" aria-label="参与规则与进度"><h3>参与规则</h3><div class="policy">${r.policy}<small>${agent?"Agent 必须参与，人工不能替代":"至少 2 位独立人工参与方"}</small></div><div class="person ${waiting?"offline":""}"><span class="avatar ${agent?"agent":""}">${agent?"A":"陈"}</span><div><strong>${first}</strong><small>${firstSub}</small></div><span class="person-status">${waiting?"离线":"已就绪"}</span></div><div class="person"><span class="avatar">Q</span><div><strong>Quincy <span class="faint">· 我</span></strong><small>人工参与方 · MacBook Pro</small></div><span class="person-status">${terminal?"已参与":"在线"}</span></div><div class="person ${agent?"offline":""}"><span class="avatar">林</span><div><strong>林舟</strong><small>人工参与方 · MacBook Air</small></div><span class="person-status">${agent?"离线":"在线"}</span></div><div class="selected-roster">本次固定参与组合<strong>${r.roster}</strong><span>集合变化需要重新授权</span></div><div class="timeline"><h3>本次请求进度</h3><ol><li class="done">请求已核对<small>来源与用途匹配 · 示例</small></li><li class="${terminal||["unknown","running"].includes(scenario)?"done":"current"}">${terminal||["unknown","running"].includes(scenario)?"本次授权已完成":"等待本次授权"}<small>${waiting?"等待本次固定集合在线":terminal||["unknown","running"].includes(scenario)?"仅覆盖当前固定尝试":"已阅读 ≠ 已共同签名"}</small></li><li class="${terminal?"done":["unknown","running"].includes(scenario)?"current":""}">${terminal?"签名已验证 · 模拟":scenario==="unknown"?"签名结果待核对":scenario==="running"?"共同签名中 · 模拟":"共同签名与验签"}<small>${terminal?"示例结果，不含真实签名":scenario==="unknown"?"只查询原结果，不重签":"所选参与方需同时在线"}</small></li><li class="${["submitted","delivered"].includes(scenario)?"current":""}">${scenario==="delivered"?"已交付 · 模拟":scenario==="submitted"?"已提交，待确认 · 模拟":scenario==="cancelled_signed"?"禁止自动交付":"结果交付"}<small>${r.type==="business"?"业务执行由上游核对":"提交后单独核对执行状态"}</small></li></ol></div></aside>`;
}
function openDialog(content){
  if(!modal.open)modalTrigger=document.activeElement;
  document.getElementById("dialog-content").innerHTML=content;
  if(!modal.open)modal.showModal();
  const first=modal.querySelector("[autofocus], input, select, textarea, button");
  if(first)first.focus();
}
function dialogShell(kicker,title,subtitle,body,footer){
  return `<div class="dialog-header"><div class="dialog-kicker">${icon("shield")}${kicker}</div><h2 id="dialog-title">${title}</h2><p>${subtitle}</p><button class="icon-button dialog-close" data-action="close-modal" aria-label="关闭对话框">${icon("close")}</button></div><div class="dialog-body">${body}</div><div class="dialog-footer">${footer}</div>`;
}
function closeDialog(){modal.close();}
modal.addEventListener("close",()=>{if(modalTrigger?.isConnected)modalTrigger.focus();else main.focus();});
function showApproval(auth=false){
  if(currentScenario()!=="normal"||deviceLocked)return;
  const r=currentRequest();
  const body=`<div class="modal-demo-label">原生确认窗口设计示意 · 非系统认证窗口 · 不采集任何凭据</div><div class="dialog-summary"><strong>${r.type==="business"?"发布风控配置 · 修订 42":`${r.side} ${r.amount} ${r.unit}`}</strong><p>${r.type==="hyperliquid"?"限价 2,000.00 USDC · 名义金额 500.00 USDC · GTC":r.type==="business"?"risk-policy · enabled: false → true · 不涉及转账":"Devnet · 转账 0.10 SOL · 示例费用 0.000005 SOL"}</p><div class="confirmation-lock">${icon("lock")}本次确认字段已固定，不允许在此编辑</div></div><div class="data-grid">${datum("密钥组 / 规则",`${r.group} · ${r.mode}`,true)}${datum("本次参与组合",r.roster,true)}${datum("本组公开公钥指纹",groups.find(g=>g.id===r.groupId).fingerprint,true)}${datum("网络 / 环境",r.network,true)}${datum(r.type==="business"?"业务受众":"交易账户",r.account,true)}${r.type==="hyperliquid"?datum("签名账户","示例-MPC-签名账户-HL-01（不可用地址）",true):""}${r.type==="solana"?datum("收款方","示例-Solana-收款账户-02（不可用地址）",true):""}${datum("请求截止",r.deadline,true)}</div><details class="verification"><summary>完整固定内容与绑定摘要</summary><div class="verification-body">${r.fields.map(f=>`<p>${escapeHTML(f[0])}：${escapeHTML(f[1])}</p>`).join("")}来源：${r.upstream}<br>方法：${r.method}<br>requestDigest 示例值（未计算）<code>${r.digest}</code>本次 attempt：${attemptId(r)}</div></details>${auth?`<div class="auth-simulation">${icon("lock")}<strong>本次秘密访问授权 · 模拟</strong><p>真实产品此时读取受保护的 Keychain 项并触发系统 Touch ID。<br>本网页不调用 Keychain、不请求指纹或密码，也不持有份额。</p></div>`:`<div class="notice">${icon("info")}<div>合法组合已就绪。授权仅覆盖当前固定尝试；任何输入或参与组合变化都需要再次确认。</div></div>`}`;
  openDialog(dialogShell("安全确认 · 设计示意",auth?"授权本次共同签名":"确认本次签名",`${r.id} · 所有内容均为示例`,body,button(auth?"模拟取消认证":"返回审核",auth?"cancel-auth":"close-modal")+button(auth?"模拟 Touch ID 通过":"继续至授权示意",auth?"authorize":"show-auth","primary")));
}
function showReject(){
  if(!["normal","waiting","unparsed"].includes(currentScenario()))return;
  openDialog(dialogShell("审核决定 · 模拟","拒绝当前请求","拒绝原因会作为非秘密业务审计记录保存。",`<div class="notice amber">${icon("info")}<div>演示建议策略：任一受邀审核人明确拒绝后结束当前请求。上游修改后需创建新请求。</div></div><form id="reject-form"><div class="form-field section-gap"><label for="reject-reason">拒绝原因</label><textarea id="reject-reason" placeholder="例如：委托数量与本次交易计划不符" required maxlength="300" autofocus></textarea><small>请勿填写密钥、份额、密码或其他秘密材料。</small></div></form>`,button("返回审核","close-modal")+'<button class="button danger" type="submit" form="reject-form">确认拒绝（模拟）</button>'));
}
function showCancel(){
  if(currentScenario()==="running"){openDialog(dialogShell("停止协议 · 模拟","请求停止当前签名","协议已经开始，不能保证尚未产生可用签名。",`<div class="notice amber">${icon("info")}<div>将记录取消意图并停止本地继续参与。若无法排除输出，状态保持“签名结果未知”；只查询原结果，不自动交付、提交或重签。</div></div>`,button("继续等待","close-modal")+button("确认请求停止（模拟）","confirm-stop","danger")));return;}
  if(!["normal","waiting"].includes(currentScenario()))return;
  openDialog(dialogShell("取消请求 · 模拟","停止当前请求","本例尚未进入 MPC 协议，没有签名输出。",`<p>此次取消会结束当前请求，不会被记录为业务拒绝。</p><div class="notice amber section-gap">${icon("info")}<div>如果在协议运行中取消，必须保留“结果未知”或“取消后发现有效签名”的事实；本地取消无法撤销已产生的签名。</div></div>`,button("继续审核","close-modal")+button("确认取消（模拟）","confirm-cancel","danger")));
}
function primaryAction(){
  const scenario=currentScenario(),r=currentRequest();
  if(scenario==="normal"){showApproval();return;}
  if(scenario==="running"){requestState[r.id].scenario="signed";logEvent("本次签名验签通过","仅状态演示；未执行真实密码运算。结果尚未交付或提交。","request","签名已验证");renderListAndDetail();toast("已模拟收到并验证签名；结果尚未交付或提交。");return;}
  if(scenario==="signed"){
    requestState[r.id].scenario=r.type==="business"?"delivered":"submitted";
    logEvent(r.type==="business"?"签名结果已交付":"原签名包已提交",r.type==="business"?"未确认业务执行结果。":"保留原包；等待订单 / 交易状态核对。","request",r.type==="business"?"已交付":"待确认");
    renderListAndDetail();toast(r.type==="business"?"已模拟交付；业务执行结果仍由管理平台核对。":"已模拟提交；尚未确认交易执行成功。");return;
  }
  if(["unknown","submission_unknown","cancelled_signed","submitted"].includes(scenario)){
    logEvent("查询原结果",`原 attempt ${attemptId(r)}；未创建新尝试，也未重新签名。`,"request","仍待核实");
    toast(scenario==="cancelled_signed"?"已核对示例原签名：对外交付情况仍待核实，自动交付保持禁用。":"模拟查询未获得新的确定证据；保留当前状态，不重签、不替换输入。");return;
  }
  if(scenario==="sign_only"){openDialog(dialogShell("仅签名结果 · 模拟","签名完成，未请求提交",r.id,`<p>本次请求的交付模式为仅签名。结果可以交付上游，但没有授权本应用广播交易。</p><div class="notice section-gap">${icon("info")}<div>本页仅显示公开结果示意；没有真实签名、秘密材料或可提交的交易包。</div></div>`,button("关闭","close-modal")));return;}
  if(scenario==="delivered"){page="audit";renderPage();return;}
  if(scenario==="rejected"){openDialog(dialogShell("业务审计 · 示例","拒绝原因",r.id,`<p>${escapeHTML(requestState[r.id].reason)}</p>`,button("关闭","close-modal")));return;}
  if(scenario==="cancelled"){requestState[r.id].scenario="normal";requestState[r.id].attempt+=1;logEvent("创建新的签名尝试",`${attemptId(r)}；原取消记录保留。新尝试需要重新确认与本次授权。`,"request","待审核");renderListAndDetail();toast("已创建新的演示尝试；原取消记录保留，继续签名需重新确认与授权。");}
}
function renderGroups(){
  main.innerHTML=`<div class="page-heading"><div><h1>密钥组</h1><p>按用途隔离密钥，让参与规则保持明确。</p></div><div class="heading-right">${button(`${icon("plus")}新建密钥组`,"new-group","primary")}</div></div><div class="stat-strip"><div class="stat"><dl><dt>已激活密钥组 · 示例</dt><dd>3 <span>按用途分别管理</span></dd></dl></div><div class="stat"><dl><dt>参与模式</dt><dd>2 <span>纯人工 / Agent 与人工协同</span></dd></dl></div><div class="stat"><dl><dt>待确认提案</dt><dd>${groups.filter(g=>g.proposal).length} <span>未生成可用签名密钥</span></dd></dl></div></div><section class="panel"><div class="panel-heading"><div><h2>工作空间密钥组</h2><p>公钥与规则属于一个密钥组，份额分别留在各参与端。</p></div>${badge("全部为示例数据")}</div><div class="table-wrap"><table><thead><tr><th>密钥组 / 用途</th><th>参与规则</th><th>算法</th><th>状态</th><th><span class="faint">详情</span></th></tr></thead><tbody>${groups.map(g=>`<tr><td><div class="table-group-name"><span class="app-icon ${g.type}">${g.type==="hyperliquid"?"H":g.type==="business"?"B":"S"}</span><div><strong>${escapeHTML(g.name)}</strong><small>${escapeHTML(g.purpose)}</small></div></div></td><td>${escapeHTML(g.rule)}<small>${g.proposal?"等待各成员核对同一提案":g.online}</small></td><td>${g.algorithm}<small>独立用途密钥</small></td><td>${badge(g.proposal?"待全员确认":"已激活 · 模拟",g.proposal?"amber":"green")}</td><td class="table-row-action">${button("查看详情","group-detail","small",`data-group="${g.id}"`)}</td></tr>`).join("")}</tbody></table></div></section><p class="page-note">签名仅需合法子集在线；新建组的 DKG 与固定成员份额刷新要求全员在线、全员持久化确认后激活。成员或门限变更应新建 DKG 密钥组并授权迁移，不能把旧份额直接套用到新规则。</p>`;
}
function showGroup(id){
  const g=groups.find(group=>group.id===id);if(!g)return;
  const busy=maintenanceBlocked(id);
  if(g.proposal){
    openDialog(dialogShell("建组提案 · 模拟",escapeHTML(g.name),"待全员核对与确认，尚未生成公钥或份额。",`<div class="data-grid">${datum("用途",g.purpose,true)}${datum("规则",g.rule,true)}${datum("状态","待全员确认 · DKG 尚未运行",true)}</div><ol class="dialog-steps"><li>所有参与方核对同一提案与身份指纹。</li><li>全组在线后，分别运行 DKG 并持久化本地份额。</li><li>全员确认同一清单与公钥后，才可激活。</li></ol><p>本原型仅创建提案记录，不产生、保存或导出任何密钥材料。</p>`,button("关闭","close-modal")));return;
  }
  openDialog(dialogShell("密钥组详情 · 示例",g.name,`${g.purpose} · ${g.algorithm}`,`<div class="policy">${g.rule}<small>${g.type==="hyperliquid"?"指定交易 Agent 为必选参与方，不能由两名人工代替。":"独立人工参与方满足门限，份额副本不增加人数。"}</small></div><div class="version-grid"><div class="version-item">公钥指纹<strong>${g.fingerprint}</strong></div><div class="version-item">版本<strong>key v1 · policy v1 · share epoch ${g.epoch}</strong></div><div class="version-item">本机份额<strong>示例已保护 · 不展示秘密材料</strong></div><div class="version-item">备份状态<strong>${g.backup}</strong></div></div><div class="group-member-list"><h3>成员与绑定设备</h3><div class="person"><span class="avatar">Q</span><div><strong>Quincy · 我</strong><small>MacBook Pro · 指纹 DEMO:Q:001</small></div><span class="person-status">在线</span></div><div class="person"><span class="avatar ${g.type==="hyperliquid"?"agent":""}">${g.type==="hyperliquid"?"A":"陈"}</span><div><strong>${g.type==="hyperliquid"?"交易 Agent":"陈雨"}</strong><small>${g.type==="hyperliquid"?"独立 Linux signer · DEMO:A:002":"MacBook Pro · DEMO:C:002"}</small></div><span class="person-status">在线</span></div><div class="person ${g.ready?"":"offline"}"><span class="avatar">林</span><div><strong>林舟</strong><small>MacBook Air · 指纹 DEMO:L:003</small></div><span class="person-status">${g.ready?"在线":"离线"}</span></div></div><div class="notice ${g.ready&&!busy?"":"amber"} section-gap">${icon("info")}<div>${busy?"本组正在共同签名或签名结果未知，禁止同时刷新。先等待原尝试结束并核对结果，其他密钥组不受影响。":g.ready?"刷新需要冻结该组签名，并由全员执行与持久化确认。刷新不改变公钥、成员或规则。":"林舟离线，无法执行要求全员在线的份额刷新；签名仍可由合法子集完成。"}</div></div><p class="disclosure-copy">备份登记不是恢复能力证明。换机需当前合法集合授权，失去必选身份时不承诺可恢复。</p>`,button("恢复与换机说明","recovery","",`data-group="${g.id}"`)+button("份额刷新示意","refresh-group","primary",`data-group="${g.id}" ${g.ready&&!busy?"":"disabled"}`)));
}
function showNewGroup(){
  openDialog(dialogShell("新建组提案 · 模拟","先定义用途与参与规则","提交后进入待全员确认；不会立即得到可用密钥。",`<form id="group-form"><div class="form-field"><label for="group-name">密钥组名称</label><input id="group-name" placeholder="例如：Solana 协同测试组" maxlength="40" required autofocus></div><div class="form-field"><label for="group-purpose">签名用途</label><select id="group-purpose"><option value="solana">Solana 交易 · Devnet</option><option value="business">业务审批 · 测试</option><option value="hyperliquid">Hyperliquid 下单 · Testnet</option></select></div><div class="form-field"><label for="group-mode">参与模式</label><select id="group-mode"><option value="human">纯人工</option><option value="agent">指定 Agent 与人工协同</option></select><small id="group-mode-note">Solana 可按密钥组选择任一模式。</small></div><div class="form-row"><div class="form-field"><label for="member-count">人工参与人数</label><input id="member-count" type="number" min="2" max="20" value="3" required></div><div class="form-field"><label for="threshold" id="threshold-label">最少共同签名人数</label><input id="threshold" type="number" min="2" max="20" value="2" required></div></div><div class="notice"><div id="rule-preview">参与规则：2-of-3 人工</div></div><p class="disclosure-copy">此表只预览人数规则，不代表已选择真实成员。提案未核对成员清单、设备与身份指纹前不能确认或进入 DKG；最多 20 人仅为演示范围。</p><div id="group-form-error" class="form-error" role="alert"></div></form>`,button("取消","close-modal")+'<button class="button primary" type="submit" form="group-form">创建提案（模拟）</button>'));
}
function updateGroupForm(){
  const purpose=document.getElementById("group-purpose"),mode=document.getElementById("group-mode"),count=document.getElementById("member-count"),threshold=document.getElementById("threshold");
  if(!purpose)return;
  if(purpose.value==="hyperliquid")mode.value="agent";
  if(purpose.value==="business")mode.value="human";
  mode.disabled=purpose.value!=="solana";
  const agent=mode.value==="agent";
  document.getElementById("group-mode-note").textContent=purpose.value==="hyperliquid"?"此用途固定指定交易 Agent；每次下单必须与人工共同签名。":purpose.value==="business"?"业务审批首期使用纯人工组。":"Solana 可按密钥组选择任一模式。";
  count.min=agent?"1":"2";threshold.min=agent?"1":"2";
  document.getElementById("threshold-label").textContent=agent?"最少人工共同签名人数":"最少共同签名人数";
  const n=Number(count.value),t=Number(threshold.value);
  const valid=Number.isInteger(n)&&Number.isInteger(t)&&n>=Number(count.min)&&n<=20&&t>=Number(threshold.min)&&t<=n;
  document.getElementById("rule-preview").textContent=agent?`参与规则：指定交易 Agent AND ${t}-of-${n} 人工；共 ${n+1} 位参与方`:`参与规则：${t}-of-${n} 人工`;
  threshold.setCustomValidity(valid?"":"门限必须不大于人工人数；纯人工至少 2 人，人机协同至少 1 位人工。");
  document.getElementById("group-form-error").textContent=valid?"":"请检查人数：纯人工满足 2 ≤ t ≤ n；人机协同满足 1 ≤ k ≤ m。";
  return valid;
}
function submitGroup(){
  if(!updateGroupForm())return;
  const name=document.getElementById("group-name").value.trim();
  if(!name){document.getElementById("group-form-error").textContent="请输入密钥组名称。";return;}
  const type=document.getElementById("group-purpose").value,agent=document.getElementById("group-mode").value==="agent",n=Number(document.getElementById("member-count").value),t=Number(document.getElementById("threshold").value);
  const id=`group-proposal-demo-${groupSequence++}`;
  groups.push({id,name,type,purpose:type==="solana"?"Solana Devnet · transaction":type==="business"?"业务审批 · 测试":"Hyperliquid Testnet · order",algorithm:type==="hyperliquid"?"ECDSA / secp256k1":"Ed25519",rule:agent?`Agent AND ${t}-of-${n} 人工`:`${t}-of-${n} 人工`,proposal:true});
  logEvent("创建密钥组提案",`${name}：待全员确认；DKG 尚未运行，没有生成密钥。`,"group","待确认",id);
  closeDialog();renderGroups();toast("提案已创建（模拟）；待全员核对后才可进入 DKG，此组尚不可签名。");
}
function showRefreshGroup(id){
  const g=groups.find(group=>group.id===id);if(!g||!g.ready||g.proposal||maintenanceBlocked(id))return;
  openDialog(dialogShell("份额刷新流程 · 设计示意",`刷新「${g.name}」份额`,"固定成员、固定规则、公钥不变；不用于撤销成员或补回丢失份额。",`<ol class="dialog-steps"><li>冻结组内新签名，等待运行中的尝试结束。</li><li>全部原参与方在线执行刷新。</li><li>各端持久化新份额并确认同一后继版本。</li><li>全员确认后激活新 epoch；中途崩溃保持冻结核对，不自动回滚。</li></ol><div class="notice amber">${icon("info")}<div>此按钮仅演示全员就绪的成功路径，不执行密码学刷新，也不证明安全持久化已经实现。</div></div>`,button("返回详情","group-detail","",`data-group="${g.id}"`)+button("模拟全员确认完成","complete-refresh","primary",`data-group="${g.id}"`)));
}
function showRecovery(){
  openDialog(dialogShell("恢复与设备换绑 · 设计边界","恢复不等于管理员解锁","每个参与方仅恢复自己的加密备份，不集中恢复完整私钥。",`<ol class="dialog-steps"><li>核对有效备份、组、公钥、参与方与当前份额版本。</li><li>由当前合法参与集合授权新设备绑定。</li><li>恢复原逻辑成员，并在新设备重新建立系统安全保护。</li><li>各应确认端持久化新清单后再启用；怀疑泄漏时另行评估刷新或迁移。</li></ol><div class="notice red">${icon("info")}<div><strong>无法满足当前维护授权时保持冻结</strong>必选 Agent 身份丢失或 2-of-2 身份不足时，即使有份额备份也不能保证换绑。没有默认的管理员万能恢复权限。</div></div><p class="disclosure-copy">本原型不提供上传备份、输入恢复密钥或导出秘密材料的入口；真实恢复方案仍需设计、确认并演练。</p>`,button("关闭说明","close-modal","primary")));
}
function renderAudit(){
  const visible=auditEvents.filter(e=>auditFilter==="all"||e.kind===auditFilter);
  main.innerHTML=`<div class="page-heading"><div><h1>审计记录</h1><p>看清发生了什么，区分审批、签名与结果交付。</p></div><div class="heading-right">${badge("仅示例 · 当前浏览器会话")}</div></div><section class="panel"><div class="panel-heading"><div><h2>工作空间活动</h2><p>2026 年 11 月 12 日 · Asia/Shanghai · 演示固定时间</p></div><div class="audit-toolbar"><label for="audit-filter" class="faint">活动类型</label><select id="audit-filter"><option value="all" ${auditFilter==="all"?"selected":""}>全部活动</option><option value="request" ${auditFilter==="request"?"selected":""}>签名请求</option><option value="group" ${auditFilter==="group"?"selected":""}>密钥组</option><option value="device" ${auditFilter==="device"?"selected":""}>设备与安全</option></select></div></div><div class="table-wrap"><table class="audit-table"><thead><tr><th>时间</th><th>事件与对象</th><th>操作方</th><th>状态</th><th>详情</th></tr></thead><tbody>${visible.length?visible.map(e=>`<tr><td>${e.time}</td><td class="audit-event"><strong>${escapeHTML(e.event)}</strong><small>${escapeHTML(e.request)}</small></td><td>${escapeHTML(e.actor)}</td><td>${badge(e.result)}</td><td>${button("查看记录","audit-detail","small",`data-index="${auditEvents.indexOf(e)}"`)}</td></tr>`).join(""):'<tr><td colspan="5" class="empty-state">暂无此类示例活动。</td></tr>'}</tbody></table></div></section><p class="page-note">展示请求标识、策略与份额版本、审批决定和公开结果。原型不保存秘密材料；所有交互仅记录在内存，刷新网页即恢复初始示例。</p>`;
}
function renderSecurity(){
  main.innerHTML=`<div class="page-heading"><div><h1>设备与安全</h1><p>设备授权仅服务于当前签名尝试。</p></div><div class="heading-right">${badge("macOS 首期 · 设计基线")}</div></div><div class="security-layout"><section class="panel"><div class="panel-heading"><h2>当前签名设备</h2>${badge(deviceLocked?"已锁定 · 模拟":"可参与签名 · 模拟",deviceLocked?"amber":"green")}</div><div class="security-section"><div class="security-device"><div class="device-icon">${icon("monitor")}</div><div><h3>Quincy 的 MacBook Pro</h3><p>Apple Silicon · 示例设备</p></div></div><dl class="security-fields"><div><dt>逻辑参与方</dt><dd>Quincy · participant-quincy-demo</dd></div><div><dt>设备身份 / 公开指纹</dt><dd class="mono">device-quincy-demo / DEMO:Q:001:82AF</dd></div><div><dt>本机份额</dt><dd>3 个独立用途组 · 每组一个逻辑份额 · 示例</dd></div><div><dt>最近安全检查</dt><dd>2026-11-12 09:58 · 演示状态，未调用系统 API</dd></div></dl>${button(icon("shield")+"检查设备状态（模拟）","check-device","small")}${button(deviceLocked?"解锁演示设备":"锁定演示设备",deviceLocked?"unlock-device":"lock-device","text small")}</div></section><section class="panel"><div class="panel-heading"><h2>本地授权策略</h2>${badge("建议默认值 · 待确认")}</div><div class="security-section"><div class="setting-row"><div><h3>Touch ID</h3><p>真实产品约束 Keychain 秘密访问</p></div><div class="setting-value">每次尝试重新授权</div></div><div class="setting-row"><div><h3>密码回退</h3><p>首期严格生物识别建议</p></div><div class="setting-value">不允许 · 待产品确认</div></div><div class="setting-row"><div><h3>授权复用</h3><p>不跨请求或参与集合缓存</p></div><div class="setting-value">复用时长 0</div></div><div class="setting-row"><div><h3>Keychain 同步</h3><p>份额保护项绑定当前设备</p></div><div class="setting-value">关闭</div></div><div class="setting-row"><div><h3>指纹集合发生变化</h3><p>当前保护项可能失效</p></div><div class="setting-value">按恢复流程处理</div></div></div></section></div><section class="panel section-gap"><div class="panel-heading"><div><h2>备份与设备更换</h2><p>加密备份、独立保管与合法维护授权必须一起成立。</p></div>${button("查看恢复边界","recovery","small")}</div><div class="security-section"><div class="notice amber">${icon("info")}<div><strong>上线前需要完成恢复演练</strong>示例展示备份登记状态，不代表已验证恢复能力。设备副本不增加参与人数；换机不能通过复制份额绕过身份绑定。</div></div></div></section><p class="page-note">这是可点击的界面设计。没有读取本机设备信息、调用 Touch ID、Keychain 或 Secure Enclave，也没有创建真实身份、份额或密钥。</p>`;
}

document.addEventListener("click",event=>{
  const target=event.target.closest("button");if(!target||target.disabled)return;
  if(target.dataset.page){page=target.dataset.page;renderPage();return;}
  if(target.dataset.request){selectedId=target.dataset.request;renderListAndDetail();return;}
  if(target.dataset.filter){filter=target.dataset.filter;renderRequests();return;}
  const action=target.dataset.action;
  if(action==="primary")primaryAction();
  else if(action==="refresh-requests")toast("示例列表已刷新：没有新请求；未连接真实服务。");
  else if(action==="close-modal")closeDialog();
  else if(action==="show-auth")showApproval(true);
  else if(action==="cancel-auth"){closeDialog();toast("模拟 Touch ID 已取消。仍为待审核，未记录拒绝，也未启动签名。");}
  else if(action==="authorize"){
    if(currentScenario()!=="normal"||deviceLocked)return;
    requestState[selectedId].scenario="running";logEvent("本次授权通过","仅模拟本次秘密访问授权；MPC 尚未完成，没有确定签名结果。","request","共同签名中");closeDialog();renderListAndDetail();toast("模拟授权已通过；正在共同签名，尚未产生确定结果。");
  }
  else if(action==="reject")showReject();
  else if(action==="cancel-request")showCancel();
  else if(action==="confirm-stop"){requestState[selectedId].scenario="unknown";requestState[selectedId].cancelRequested=true;logEvent("运行中请求停止","已记录取消意图，无法排除签名输出；保留原尝试，禁止自动重签与交付。","request","签名结果未知");closeDialog();renderListAndDetail();toast("已请求停止；无法证明没有签名输出，保留签名结果未知。");}
  else if(action==="confirm-cancel"){requestState[selectedId].scenario="cancelled";logEvent("请求已取消","示例确认未进入协议，没有签名输出。","request","已取消");closeDialog();renderListAndDetail();}
  else if(action==="reset-request"){requestState[selectedId]={scenario:"normal",reason:"",attempt:1,cancelRequested:false};renderListAndDetail();toast("本请求已恢复初始演示状态。已有示例审计记录保留到刷新网页。");}
  else if(action==="new-group")showNewGroup();
  else if(action==="group-detail")showGroup(target.dataset.group);
  else if(action==="refresh-group")showRefreshGroup(target.dataset.group);
  else if(action==="complete-refresh"){
    const g=groups.find(group=>group.id===target.dataset.group);if(!g?.ready||maintenanceBlocked(g.id))return;
    g.epoch=String(Number(g.epoch)+1);logEvent("全员份额刷新完成",`示例 epoch 更新为 ${g.epoch}，公钥、成员及规则保持不变。此操作未执行真实密码协议。`,"group","模拟完成",g.id);
    for(const r of requests.filter(r=>r.groupId===g.id)){if(["normal","waiting"].includes(requestState[r.id].scenario))requestState[r.id].scenario="stale";}
    closeDialog();renderGroups();toast("模拟刷新完成；该组尚未签名的旧请求已失效，须重新准备与授权。");
  }
  else if(action==="recovery")showRecovery();
  else if(action==="audit-detail"){
    const e=auditEvents[Number(target.dataset.index)];if(!e)return;
    openDialog(dialogShell("审计详情 · 示例",escapeHTML(e.event),`${e.time} · ${escapeHTML(e.request)}`,`<div class="data-grid">${datum("操作方",e.actor)}${datum("结果",e.result)}${datum("记录内容",e.detail,true)}</div><div class="notice">${icon("info")}<div>此记录不包含秘密份额、nonce、认证凭据或恢复材料。</div></div>`,button("关闭","close-modal")));
  }
  else if(action==="check-device"){logEvent("安全状态检查","模拟配置核对完成：真实设备与系统访问能力未经验证。","device","仅模拟","device-quincy-demo");toast("模拟检查完成：配置示例可用；未读取本机硬件或安全存储。");}
  else if(action==="lock-device"||action==="unlock-device"){
    deviceLocked=action==="lock-device";logEvent(deviceLocked?"演示设备已锁定":"演示设备已解锁","仅更新 UI 演示状态，没有锁定或解锁真实 macOS。","device",deviceLocked?"模拟锁定":"模拟解锁","device-quincy-demo");renderSecurity();toast(deviceLocked?"演示设备已锁定；请求页会阻止新的授权示意。":"演示设备已解锁；每次签名仍需重新确认。");
  }
});
document.addEventListener("input",event=>{
  if(event.target.id==="search-requests"){query=event.target.value;renderListAndDetail();}
  if(["member-count","threshold"].includes(event.target.id))updateGroupForm();
});
document.addEventListener("change",event=>{
  if(event.target.id==="demo-state"){
    requestState[selectedId].scenario=event.target.value;renderListAndDetail();
    toast(`已切换为「${states[currentScenario()].label}」演示，未执行真实操作。`);
  }
  if(["group-purpose","group-mode"].includes(event.target.id))updateGroupForm();
  if(event.target.id==="audit-filter"){auditFilter=event.target.value;renderAudit();}
});
document.addEventListener("submit",event=>{
  if(event.target.id==="reject-form"){
    event.preventDefault();const reason=document.getElementById("reject-reason").value.trim();
    if(!reason){document.getElementById("reject-reason").setCustomValidity("请输入明确的拒绝原因。");document.getElementById("reject-reason").reportValidity();return;}
    requestState[selectedId]={...requestState[selectedId],scenario:"rejected",reason};logEvent("审核人拒绝请求",reason,"request","已拒绝");closeDialog();renderListAndDetail();toast("当前请求已模拟拒绝，原因已写入示例审计记录。");
  }
  if(event.target.id==="group-form"){event.preventDefault();submitGroup();}
});
document.addEventListener("input",event=>{if(event.target.id==="reject-reason")event.target.setCustomValidity("");});
document.addEventListener("click",event=>{
  if(deviceLocked&&event.target.closest('[data-action="primary"], [data-action="show-auth"], [data-action="authorize"]')&&currentScenario()==="normal"){
    event.stopImmediatePropagation();event.preventDefault();toast("演示设备已锁定。请在设备与安全中解锁演示设备后重新确认。");
  }
},true);
document.querySelectorAll("[data-icon]").forEach(element=>element.innerHTML=icon(element.dataset.icon));
renderPage();
