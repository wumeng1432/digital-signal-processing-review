/* ============================================================
   数字信号处理复习站 · 主程序
   ============================================================ */
(function () {
  'use strict';

  var CH = window.DSP_CHAPTERS || [];
  var TN = window.DSP_TEACHER || { notes: [], hotlist: [] };
  var FM = window.DSP_FORMULAS || [];
  var TP = window.DSP_TOPICS || [];
  var PP = window.DSP_PAPERS || [];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------------- 数学公式渲染 ---------------- */
  function renderMath(root) {
    if (!window.katex) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      if (!text || text.indexOf('$') === -1) return;
      var pe = node.parentElement;
      if (pe && (pe.classList.contains('katex') || pe.tagName === 'CODE' || pe.tagName === 'PRE')) return;
      var re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
      var m, last = 0, matched = false, frag = document.createDocumentFragment();
      while ((m = re.exec(text)) !== null) {
        matched = true;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var display = m[1] !== undefined;
        var tex = (display ? m[1] : m[2]).trim();
        var span = document.createElement('span');
        try { katex.render(tex, span, { displayMode: display, throwOnError: false }); }
        catch (e) { span.textContent = tex; }
        frag.appendChild(span);
        last = re.lastIndex;
      }
      if (!matched) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---------------- 进度 ---------------- */
  var KEY_CH = 'dsp_reviewed_chapters';
  var KEY_QZ = 'dsp_quiz_stats';
  var reviewed = LS.get(KEY_CH, {});
  var quizStats = LS.get(KEY_QZ, { right: 0, wrong: 0, seen: {} });

  function markReviewed(id, v) {
    reviewed[id] = v;
    LS.set(KEY_CH, reviewed);
  }

  /* ---------------- 导航定义 ---------------- */
  var NAV = [
    { label: '开始', items: [
      { id: 'home', icon: '⌂', text: '首页总览', route: '#/home' }
    ]},
    { label: '教材精讲', items: [
      { id: 'chapters', icon: '▤', text: '十章知识体系', route: '#/chapters' }
    ]},
    { label: '考前冲刺', items: [
      { id: 'formulas', icon: '∑', text: '公式速查表', route: '#/formulas' },
      { id: 'topics', icon: '✎', text: '题型专项', route: '#/topics' },
      { id: 'papers', icon: '❐', text: '模拟试卷', route: '#/papers' },
      { id: 'quiz', icon: '⟳', text: '刷题自测', route: '#/quiz' },
      { id: 'progress', icon: '▰', text: '复习进度', route: '#/progress' }
    ]}
  ];

  function renderNav(activeId) {
    var html = '';
    NAV.forEach(function (g) {
      html += '<div class="nav-group"><div class="nav-label">' + g.label + '</div>';
      g.items.forEach(function (it) {
        var cnt = '';
        if (it.id === 'chapters') {
          var n = Object.keys(reviewed).filter(function (k) { return reviewed[k]; }).length;
          cnt = '<span class="cnt">' + n + '/' + CH.length + '</span>';
        }
        html += '<button class="nav-item' + (activeId === it.id ? ' active' : '') + '" data-route="' + it.route + '">' +
          '<span class="ico">' + it.icon + '</span><span>' + it.text + '</span>' +
          (it.badge ? '<span class="badge">' + it.badge + '</span>' : cnt) + '</button>';
      });
      html += '</div>';
    });
    $('#nav').innerHTML = html;
    $$('#nav .nav-item').forEach(function (b) {
      b.onclick = function () { location.hash = b.dataset.route; closeSidebar(); };
    });
  }

  /* ---------------- 路由 ---------------- */
  var ROUTES = {};

  function parseHash() {
    var h = (location.hash || '#/home').replace(/^#\/?/, '');
    var parts = h.split('/');
    return { name: parts[0] || 'home', arg: parts[1] || '' };
  }

  function router() {
    var r = parseHash();
    var fn = ROUTES[r.name] || ROUTES.home;
    var activeId = r.name === 'ch' ? 'chapters'
      : r.name === 'topic' ? 'topics'
      : r.name === 'paper' ? 'papers' : r.name;
    renderNav(activeId);
    var out = fn(r.arg);
    $('#content').innerHTML = out.html;
    $('#crumb').innerHTML = out.crumb || '首页总览';
    document.title = (out.title ? out.title + ' | ' : '') + '数字信号处理 · 期末复习站';
    renderMath($('#content'));
    if (out.after) out.after();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function go(route) { location.hash = route; }

  /* ---------------- 首页 ---------------- */
  ROUTES.home = function () {
    var nCh = Object.keys(reviewed).filter(function (k) { return reviewed[k]; }).length;
    var totalQ = TP.reduce(function (s, t) { return s + t.questions.length; }, 0);
    var h = '';
    h += '<div class="hero">' +
      '<h2>数字信号处理 · 期末复习站</h2>' +
      '<p>依据 <b>高西全、丁玉美《数字信号处理》第四版（西安电子科技大学出版社）</b> 教材结构，结合中南民族大学电子信息工程学院期末考试的常见题型，以及<b>任课老师课堂板书划出的重点</b>整理而成。</p>' +
      '<div class="meta"><span>📘 教材十章全覆盖</span><span>★ 老师板书 ' + TN.notes.length + ' 张 · 已入对应章</span><span>∑ 公式速查表</span><span>✎ ' + totalQ + ' 道典型题</span><span>❐ 3 套模拟卷</span></div>' +
      '</div>';

    h += '<div class="grid g4" style="margin-bottom:20px">' +
      stat(CH.length, '教材章节', '') +
      stat(TN.notes.length, '老师板书重点', 'amber') +
      stat(totalQ, '典型例题', 'green') +
      stat(PP.length + ' 套', '模拟试卷', 'purple') +
      '</div>';

    h += '<h2 class="sec">⭐ 老师划的重点（先看这里）</h2>';
    h += '<div class="card"><p style="margin-top:0">' + TN.summary + '</p>';
    h += '<div class="grid g2" style="margin-top:14px">';
    TN.hotlist.forEach(function (x) {
      var stars = '';
      for (var i = 0; i < 3; i++) stars += '<span class="' + (i < x.level ? '' : 'off') + '">★</span>';
      h += '<div class="tile" data-go="#/ch/' + x.ch + '"><div class="tt">' + esc(x.t) + '</div>' +
        '<div class="td">' + esc(x.d) + '</div>' +
        '<div class="weight" style="margin-top:2px">' + stars + '</div></div>';
    });
    h += '</div></div>';

    h += '<h2 class="sec">考试题型分布（依据历年期末试卷整理）</h2>';
    h += '<div class="card"><table class="tbl">' +
      '<tr><th>题型</th><th>常见分值</th><th>主要考查内容</th></tr>' +
      '<tr><td><b>填空题</b></td><td>15~20 分</td><td>序列周期性、变换对、收敛域、运算量公式、参数计算</td></tr>' +
      '<tr><td><b>选择题</b></td><td>15~20 分</td><td>概念辨析：系统性质、DFT/FFT 性质、滤波器特性对比</td></tr>' +
      '<tr><td><b>判断题</b></td><td>8~10 分</td><td>易混淆结论（"一定""必然"类表述）</td></tr>' +
      '<tr><td><b>简答题</b></td><td>10~15 分</td><td>栅栏效应、频谱泄漏、IIR/FIR 比较、两种数字化方法比较</td></tr>' +
      '<tr><td><b>证明题</b></td><td>10~20 分</td><td><b>DTFT / DFT 性质证明（老师板书重点）</b></td></tr>' +
      '<tr><td><b>计算题</b></td><td>30~40 分</td><td>卷积、Z 逆变换、DFT、滤波器设计、谱分析参数</td></tr>' +
      '<tr><td><b>画图题</b></td><td>8~15 分</td><td>FFT 蝶形图、系统流图、序列波形、零极点图</td></tr>' +
      '</table></div>';

    h += '<h2 class="sec">快速入口</h2><div class="grid g3">';
    [
      ['#/chapters', '▤', '教材十章精讲', '知识框架 + 公式 + 例题（含老师板书）'],
      ['#/formulas', '∑', '公式速查表', '考前 30 分钟过一遍'],
      ['#/topics', '✎', '题型专项', '按题型分类的典型题'],
      ['#/papers', '❐', '模拟试卷', '3 套完整卷 + 答案'],
      ['#/quiz', '⟳', '刷题自测', '随机抽题，检验掌握度']
    ].forEach(function (t) {
      h += '<div class="tile" data-go="' + t[0] + '"><div class="ti">' + t[1] + '</div>' +
        '<div class="tt">' + t[2] + '</div><div class="td">' + t[3] + '</div></div>';
    });
    h += '</div>';

    h += '<h2 class="sec">复习路线建议</h2><div class="card"><ol style="margin:0">' +
      '<li><b>第 1 步（1 天）</b>：进入第 2、3 章，重点看章节底部的「★ 老师板书重点」卡片，把 DTFT 四条性质证明、共轭对称性、DFT 两条共轭性质证明<b>手写默写一遍</b>。</li>' +
      '<li><b>第 2 步（2 天）</b>：按「教材十章精讲」顺序过知识点，重点第 2、3、6、7 章，边看边做章末例题。</li>' +
      '<li><b>第 3 步（1 天）</b>：用「公式速查表」查漏补缺，把记不住的公式抄到一张 A4 纸上。</li>' +
      '<li><b>第 4 步（2 天）</b>：做「题型专项」，每个题型至少 5 题；再限时完成「模拟试卷」A、B、C 三套。</li>' +
      '<li><b>第 5 步（考前）</b>：用「刷题自测」随机抽题快速过一遍，错题回看对应章节。</li>' +
      '</ol></div>';

    h += foot();
    return { html: h, crumb: '首页总览', title: '首页', after: bindTiles };
  };

  function stat(num, lb, cls) {
    return '<div class="stat ' + (cls || '') + '"><div class="num">' + num + '</div><div class="lb">' + lb + '</div></div>';
  }

  function foot() {
    return '<div class="foot">' +
      '📘 教材：高西全、丁玉美《数字信号处理》（第四版），西安电子科技大学出版社<br>' +
      '🎓 适用：中南民族大学 电子信息工程学院<br>' +
      '⭐ 老师板书重点共 ' + TN.notes.length + ' 张，已按章节归入「教材十章精讲」对应章节底部，点击卡片可放大查看原始板书照片。' +
      '</div>';
  }

  function bindTiles() {
    $$('[data-go]').forEach(function (el) {
      el.onclick = function () { go(el.dataset.go); };
    });
  }

  /* ---------------- 老师重点 ---------------- */
  ROUTES.teacher = function () {
    var h = '';
    h += '<h1 class="page-title">★ 老师划的重点 · 课堂板书精解</h1>';
    h += '<p class="page-sub">以下 ' + TN.notes.length + ' 张图片是任课教师课堂板书的原始照片，每张都附有对应的考点提炼与解题思路。</p>';

    h += '<div class="card"><h3 class="sub" style="margin-top:0">📌 重点分布总览</h3><p style="margin-top:0">' + TN.summary + '</p>';
    h += '<table class="tbl"><tr><th>考点</th><th>说明</th><th>重要度</th></tr>';
    TN.hotlist.forEach(function (x) {
      var s = '';
      for (var i = 0; i < 3; i++) s += '<span class="' + (i < x.level ? '' : 'off') + '">★</span>';
      h += '<tr><td><b>' + esc(x.t) + '</b></td><td>' + esc(x.d) + '</td><td class="weight">' + s + '</td></tr>';
    });
    h += '</table>';
    h += '<div class="tip"><b>使用建议：</b>点击任意卡片可放大查看原始板书照片。建议对着照片把推导过程亲手写一遍，尤其是 DTFT 四条性质和 DFT 两条共轭性质的证明。</div>';
    h += '</div>';

    h += '<h2 class="sec">板书逐张精解（点击放大）</h2><div class="notes-grid">';
    TN.notes.forEach(function (n, i) {
      h += '<div class="note-card" data-idx="' + i + '">' +
        '<div class="thumb"><img src="assets/teacher-notes/' + n.file + '" alt="' + esc(n.title) + '" loading="lazy"></div>' +
        '<div class="body">' +
        '<div class="nch">' + esc(n.chapter) + '</div>' +
        '<div class="nt">' + esc(n.title) + '</div>' +
        '<div class="np"><span class="chip amber">' + esc(n.tag) + '</span></div>' +
        '<div class="np" style="color:var(--ink-2)">' + esc(n.point) + '</div>' +
        '</div></div>';
    });
    h += '</div>';

    h += foot();
    return {
      html: h, crumb: '老师重点 · <b>板书精解</b>', title: '老师板书重点',
      after: function () {
        $$('.note-card').forEach(function (c) {
          c.onclick = function () { openLightbox(TN.notes[+c.dataset.idx]); };
        });
      }
    };
  };

  function openLightbox(n) {
    $('#lbImg').src = 'assets/teacher-notes/' + n.file;
    $('#lbCap').innerHTML = '<b>' + esc(n.title) + '</b>　·　' + esc(n.chapter) + '<br>' + esc(n.detail);
    $('#lightbox').classList.add('show');
  }
  $('#lbClose').onclick = function () { $('#lightbox').classList.remove('show'); };
  $('#lightbox').onclick = function (e) { if (e.target.id === 'lightbox') this.classList.remove('show'); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $('#lightbox').classList.remove('show'); });

  /* ---------------- 章节列表 ---------------- */
  ROUTES.chapters = function () {
    var h = '<h1 class="page-title">教材精讲 · 十章知识体系</h1>';
    h += '<p class="page-sub">按教材章节顺序梳理知识框架、核心概念、重要公式与典型例题。带 ★ 的章节为老师重点提示的高频考点。</p>';
    h += '<div class="grid g2">';
    CH.forEach(function (c) {
      var done = reviewed[c.id];
      h += '<div class="tile" data-go="#/ch/' + c.id + '">' +
        '<div style="display:flex;align-items:center;gap:9px">' +
        '<span style="width:28px;height:28px;border-radius:8px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center;font-weight:700;font-size:13px">' + c.num + '</span>' +
        '<span class="tt">' + esc(c.title) + '</span>' +
        (done ? '<span class="chip green" style="margin-left:auto">已复习</span>' : '') +
        '</div>' +
        '<div class="td" style="margin-top:4px">' + esc(c.subtitle) + '</div>' +
        '<div class="weight">' + stars(c.weight) + '</div>' +
        '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:4px">' +
        c.tags.map(function (t) { return '<span class="chip' + (/老师重点|必考/.test(t) ? ' amber' : ' gray') + '">' + esc(t) + '</span>'; }).join('') +
        '</div></div>';
    });
    h += '</div>' + foot();
    return { html: h, crumb: '教材精讲 · <b>十章知识体系</b>', title: '教材精讲', after: bindTiles };
  };

  function stars(n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<span class="' + (i < n ? '' : 'off') + '">★</span>';
    return s;
  }

  /* ---------------- 章节详情 ---------------- */
  ROUTES.ch = function (id) {
    var c = CH.filter(function (x) { return x.id === id; })[0];
    if (!c) return ROUTES.chapters();
    var idx = CH.indexOf(c);
    var h = '';

    h += '<div class="chapter-head"><div class="chapter-no">' + c.num + '</div><div>' +
      '<h2>' + esc(c.title) + '</h2>' +
      '<div class="cs">' + esc(c.subtitle) + '</div></div></div>';
    h += '<div class="chapter-tags">' +
      c.tags.map(function (t) { return '<span class="chip' + (/老师重点|必考/.test(t) ? ' amber' : '') + '">' + esc(t) + '</span>'; }).join('') +
      '<span class="chip gray">重要度 <span class="weight">' + stars(c.weight) + '</span></span>' +
      '</div>';
    h += '<div class="card" style="margin-top:16px"><p style="margin:0">' + c.intro + '</p></div>';

    h += '<div class="outline"><b>本章知识框架</b><ol>' +
      c.outline.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ol></div>';

    h += '<h2 class="sec">知识点精讲</h2>';
    c.sections.forEach(function (s, i) {
      h += '<div class="acc' + (i === 0 ? ' open' : '') + '">' +
        '<div class="acc-head"><span class="dot"></span>' + esc(s.h) + '<span class="arw">▶</span></div>' +
        '<div class="acc-body">' + s.body + '</div></div>';
    });

    h += '<h2 class="sec">典型例题</h2>';
    c.examples.forEach(function (e, i) {
      h += '<div class="exam-q"><div class="q"><span class="qn">例' + (i + 1) + '</span>' + e.q + '</div>' +
        '<button class="reveal">显示解答 ▾</button>' +
        '<div class="ans">' + e.a + '</div></div>';
    });

    h += '<h2 class="sec">⚠ 易错点提醒</h2><div class="card"><div class="warn" style="margin:0">' +
      '<ul style="margin:0">' + c.pitfalls.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div></div>';

    // 本章老师板书重点（已按章节归入，不单独成页）
    var tn = [];
    TN.notes.forEach(function (n, gi) { if (n.ch === c.id) tn.push({ n: n, gi: gi }); });
    if (tn.length) {
      h += '<h2 class="sec">★ 老师板书重点（本章 ' + tn.length + ' 张）</h2>' +
        '<div class="card"><div class="tip" style="margin:0 0 12px">下列板书来自任课教师课堂，对应本章高频考点。点击卡片可放大查看原始照片，建议对着照片把推导亲手写一遍。</div>' +
        '<div class="notes-grid">';
      tn.forEach(function (o) {
        var n = o.n;
        h += '<div class="note-card" data-gidx="' + o.gi + '">' +
          '<div class="thumb"><img src="assets/teacher-notes/' + n.file + '" alt="' + esc(n.title) + '" loading="lazy"></div>' +
          '<div class="body">' +
          '<div class="nch">' + esc(n.chapter) + '</div>' +
          '<div class="nt">' + esc(n.title) + '</div>' +
          '<div class="np"><span class="chip amber">' + esc(n.tag) + '</span></div>' +
          '<div class="np" style="color:var(--ink-2)">' + esc(n.point) + '</div>' +
          '</div></div>';
      });
      h += '</div></div>';
    }

    // 上下章导航
    h += '<div style="display:flex;gap:10px;margin-top:26px;flex-wrap:wrap">';
    if (idx > 0) h += '<button class="btn" data-go="#/ch/' + CH[idx - 1].id + '">← 上一章：' + esc(CH[idx - 1].title) + '</button>';
    if (idx < CH.length - 1) h += '<button class="btn" data-go="#/ch/' + CH[idx + 1].id + '" style="margin-left:auto">下一章：' + esc(CH[idx + 1].title) + ' →</button>';
    h += '</div>';

    h += '<div class="card" style="margin-top:20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:200px"><b>复习标记</b><div style="font-size:13px;color:var(--ink-3)">标记后可在首页与章节列表看到进度</div></div>' +
      '<button class="btn ' + (reviewed[c.id] ? 'primary' : '') + '" id="markBtn">' + (reviewed[c.id] ? '✓ 已复习' : '标记为已复习') + '</button>' +
      '</div>';

    h += foot();
    return {
      html: h, crumb: '教材精讲 · <b>第 ' + c.num + ' 章</b>', title: '第' + c.num + '章 ' + c.title,
      after: function () {
        bindTiles();
        bindAcc();
        bindReveal();
        $$('.note-card').forEach(function (card) {
          card.onclick = function () { openLightbox(TN.notes[+card.dataset.gidx]); };
        });
        var mb = $('#markBtn');
        if (mb) mb.onclick = function () {
          var v = !reviewed[c.id];
          markReviewed(c.id, v);
          router();
        };
      }
    };
  };

  function bindAcc() {
    $$('.acc-head').forEach(function (hd) {
      hd.onclick = function () {
        var p = hd.parentElement;
        p.classList.toggle('open');
        renderMath(p.querySelector('.acc-body'));
      };
    });
  }

  function bindReveal() {
    $$('.reveal').forEach(function (b) {
      b.onclick = function () {
        var a = b.nextElementSibling;
        var show = a.classList.toggle('show');
        b.textContent = show ? '收起答案 ▴' : '显示解答 ▾';
        if (show) renderMath(a);
      };
    });
  }

  /* ---------------- 公式速查 ---------------- */
  ROUTES.formulas = function () {
    var h = '<h1 class="page-title">∑ 公式速查表</h1>';
    h += '<p class="page-sub">考前 30 分钟把这一页过一遍。所有公式按主题分组，红色/橙色小字为易错提醒。</p>';
    h += '<div class="card tight" style="display:flex;gap:8px;flex-wrap:wrap">' +
      FM.map(function (g) { return '<button class="btn" data-jump="' + g.id + '">' + esc(g.title.replace(/^[一二三四五六]、/, '')) + '</button>'; }).join('') +
      '</div>';
    FM.forEach(function (g) {
      h += '<h2 class="sec" id="' + g.id + '">' + g.icon + ' ' + esc(g.title) + '</h2>';
      h += '<div class="card">';
      g.items.forEach(function (it) {
        h += '<div class="fml-item"><div class="fn">' + it.n + '</div><div>' +
          '<div class="fv">' + it.f + '</div>' +
          (it.note ? '<div class="fnote">💡 ' + it.note + '</div>' : '') +
          '</div></div>';
      });
      h += '</div>';
    });
    h += foot();
    return {
      html: h, crumb: '考前冲刺 · <b>公式速查表</b>', title: '公式速查表',
      after: function () {
        $$('[data-jump]').forEach(function (b) {
          b.onclick = function () {
            var el = document.getElementById(b.dataset.jump);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          };
        });
      }
    };
  };

  /* ---------------- 题型专项 ---------------- */
  ROUTES.topics = function () {
    var h = '<h1 class="page-title">✎ 题型专项训练</h1>';
    h += '<p class="page-sub">按期末考试题型分类的典型题。建议先自己动手做，再点"显示解答"核对思路。</p>';
    h += '<div class="grid g2">';
    TP.forEach(function (t) {
      h += '<div class="tile" data-go="#/topic/' + t.id + '">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="width:30px;height:30px;border-radius:9px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center;font-weight:700">' + t.icon + '</span>' +
        '<span class="tt">' + esc(t.title) + '</span>' +
        '<span class="cnt chip gray" style="margin-left:auto">' + t.questions.length + ' 题</span></div>' +
        '<div class="td" style="margin-top:4px">' + esc(t.desc) + '</div></div>';
    });
    h += '</div>' + foot();
    return { html: h, crumb: '考前冲刺 · <b>题型专项</b>', title: '题型专项', after: bindTiles };
  };

  ROUTES.topic = function (id) {
    var t = TP.filter(function (x) { return x.id === id; })[0];
    if (!t) return ROUTES.topics();
    var h = '<h1 class="page-title">' + t.icon + ' ' + esc(t.title) + '</h1>';
    h += '<p class="page-sub">' + esc(t.desc) + '　共 ' + t.questions.length + ' 题。</p>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' +
      '<button class="btn" id="showAll">展开全部答案</button>' +
      '<button class="btn" id="hideAll">收起全部答案</button>' +
      '<button class="btn" data-go="#/topics" style="margin-left:auto">← 返回题型列表</button></div>';
    t.questions.forEach(function (q, i) {
      h += '<div class="exam-q"><div class="q"><span class="qn">' + (i + 1) + '</span>' + q.q;
      if (q.options) {
        h += '<ul class="opts">' + q.options.map(function (o, oi) {
          var isOk = q.a && String(q.a).trim().charAt(0).toUpperCase() === String.fromCharCode(65 + oi);
          return '<li class="' + (isOk ? 'ok' : '') + '">' + o + '</li>';
        }).join('') + '</ul>';
        h += '<div style="font-size:12.5px;color:var(--ink-3);margin-top:6px">正确答案：<b style="color:var(--green)">' + esc(q.a) + '</b></div>';
      }
      h += '</div><button class="reveal">显示解答 ▾</button><div class="ans">' + (q.analysis ? '<p style="margin:0 0 6px">' + q.analysis + '</p>' : '') + (q.a && q.options ? '' : q.a) + '</div></div>';
    });
    h += foot();
    return {
      html: h, crumb: '题型专项 · <b>' + esc(t.title) + '</b>', title: t.title,
      after: function () {
        bindTiles(); bindReveal();
        $('#showAll').onclick = function () { $$('.ans').forEach(function (a) { a.classList.add('show'); renderMath(a); }); $$('.reveal').forEach(function (b) { b.textContent = '收起答案 ▴'; }); };
        $('#hideAll').onclick = function () { $$('.ans').forEach(function (a) { a.classList.remove('show'); }); $$('.reveal').forEach(function (b) { b.textContent = '显示解答 ▾'; }); };
      }
    };
  };

  /* ---------------- 模拟试卷 ---------------- */
  ROUTES.papers = function () {
    var h = '<h1 class="page-title">❐ 模拟试卷</h1>';
    h += '<p class="page-sub">3 套模拟卷，题型与分值参照中南民族大学电子信息工程学院期末考试格式。建议限时 120 分钟闭卷完成。</p>';
    PP.forEach(function (p) {
      var n = p.sections.reduce(function (s, x) { return s + x.questions.length; }, 0);
      h += '<div class="card"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">' +
        '<div style="flex:1;min-width:220px"><h3 class="sub" style="margin:0">' + esc(p.title) + '</h3>' +
        '<div style="font-size:13px;color:var(--ink-3);margin-top:3px">' + esc(p.meta) + '</div></div>' +
        '<span class="chip gray">' + n + ' 题</span>' +
        '<button class="btn primary" data-go="#/paper/' + p.id + '">开始做题 →</button></div></div>';
    });
    h += foot();
    return { html: h, crumb: '考前冲刺 · <b>模拟试卷</b>', title: '模拟试卷', after: bindTiles };
  };

  ROUTES.paper = function (id) {
    var p = PP.filter(function (x) { return x.id === id; })[0];
    if (!p) return ROUTES.papers();
    var h = '<h1 class="page-title">' + esc(p.title) + '</h1>';
    h += '<p class="page-sub">' + esc(p.meta) + '</p>';
    h += '<div class="card tight" style="display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn" id="showAll">展开全部答案</button>' +
      '<button class="btn" id="hideAll">收起全部答案</button>' +
      '<button class="btn" data-go="#/papers" style="margin-left:auto">← 返回试卷列表</button></div>';
    var n = 0;
    p.sections.forEach(function (s) {
      h += '<h2 class="sec">' + esc(s.name) + '　<span style="font-size:12px;font-weight:400;color:var(--ink-3)">' + esc(s.score) + '</span></h2>';
      s.questions.forEach(function (q) {
        n++;
        h += '<div class="exam-q"><div class="q"><span class="qn">' + n + '</span>' + q.q + '</div>' +
          '<button class="reveal">显示答案 ▾</button><div class="ans">' + q.a + '</div></div>';
      });
    });
    h += foot();
    return {
      html: h, crumb: '模拟试卷 · <b>' + esc(p.title) + '</b>', title: p.title,
      after: function () {
        bindTiles(); bindReveal();
        $('#showAll').onclick = function () { $$('.ans').forEach(function (a) { a.classList.add('show'); renderMath(a); }); $$('.reveal').forEach(function (b) { b.textContent = '收起答案 ▴'; }); };
        $('#hideAll').onclick = function () { $$('.ans').forEach(function (a) { a.classList.remove('show'); }); $$('.reveal').forEach(function (b) { b.textContent = '显示解答 ▾'; }); };
      }
    };
  };

  /* ---------------- 刷题自测 ---------------- */
  var quizPool = null, quizIdx = 0, quizAnswered = false;

  function buildPool() {
    var pool = [];
    TP.forEach(function (t) {
      t.questions.forEach(function (q, i) {
        pool.push({ topic: t.title, topicId: t.id, i: i, q: q, key: t.id + '#' + i });
      });
    });
    return pool;
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  ROUTES.quiz = function () {
    if (!quizPool) { quizPool = shuffle(buildPool()); quizIdx = 0; }
    var total = quizPool.length;
    var cur = quizPool[quizIdx % total];
    var seen = Object.keys(quizStats.seen || {}).length;

    var h = '<h1 class="page-title">⟳ 刷题自测</h1>';
    h += '<p class="page-sub">从 ' + total + ' 道典型题中随机抽题，检验掌握程度。答完自己判分，记录"会/不会"。</p>';

    h += '<div class="quiz-bar">' +
      '<span class="sc">进度：<b>' + ((quizIdx % total) + 1) + '</b> / ' + total + '</span>' +
      '<span class="sc">已练：<b>' + seen + '</b> 题</span>' +
      '<span class="sc">自评：<b style="color:var(--green)">' + quizStats.right + '</b> 会 / <b style="color:var(--red)">' + quizStats.wrong + '</b> 不会</span>' +
      '<button class="btn" id="resetQuiz" style="margin-left:auto">重置统计</button>' +
      '</div>';

    h += '<div class="card">' +
      '<div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">' +
      '<span class="chip">' + esc(cur.topic) + '</span>' +
      '<span class="chip gray">第 ' + (cur.i + 1) + ' 题</span></div>';
    h += '<div class="q" style="font-size:15px">' + cur.q.q;
    if (cur.q.options) {
      h += '<ul class="opts">' + cur.q.options.map(function (o, oi) {
        var isOk = cur.q.a && String(cur.q.a).trim().charAt(0).toUpperCase() === String.fromCharCode(65 + oi);
        return '<li class="' + (isOk ? 'ok' : '') + '">' + o + '</li>';
      }).join('') + '</ul>';
    }
    h += '</div>';
    h += '<button class="reveal" id="qReveal" style="margin-top:12px">显示答案 ▾</button>';
    h += '<div class="ans" id="qAns">' +
      (cur.q.analysis ? '<p style="margin:0 0 6px">' + cur.q.analysis + '</p>' : '') +
      (cur.q.a && cur.q.options ? '<p style="margin:0">正确答案：<b>' + esc(cur.q.a) + '</b></p>' : cur.q.a) +
      '</div>';
    h += '<div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">' +
      '<button class="btn primary" id="qNext">下一题 →</button>' +
      '<button class="btn" id="qGot" style="color:var(--green);border-color:#bfe6d3">✓ 这题我会</button>' +
      '<button class="btn" id="qMiss" style="color:var(--red);border-color:#f2cccc">✗ 这题不会</button>' +
      '</div>';
    h += '</div>';

    h += '<div class="card"><b>使用说明</b><ul style="margin:8px 0 0">' +
      '<li>先自己想，再点"显示答案"对照。</li>' +
      '<li>用"这题我会 / 不会"记录，统计数据保存在本地浏览器，换设备不同步。</li>' +
      '<li>错题请回到「题型专项」或对应章节重新学习。</li>' +
      '</ul></div>';
    h += foot();

    return {
      html: h, crumb: '考前冲刺 · <b>刷题自测</b>', title: '刷题自测',
      after: function () {
        bindReveal();
        $('#qNext').onclick = function () { quizIdx++; router(); };
        $('#qGot').onclick = function () { quizStats.right++; quizStats.seen[cur.key] = 1; LS.set(KEY_QZ, quizStats); quizIdx++; router(); };
        $('#qMiss').onclick = function () { quizStats.wrong++; quizStats.seen[cur.key] = 0; LS.set(KEY_QZ, quizStats); quizIdx++; router(); };
        $('#resetQuiz').onclick = function () {
          quizStats = { right: 0, wrong: 0, seen: {} };
          LS.set(KEY_QZ, quizStats); quizPool = shuffle(buildPool()); quizIdx = 0; router();
        };
      }
    };
  };

  /* ---------------- 复习进度 ---------------- */
  ROUTES.progress = function () {
    var doneN = 0;
    var h = '<h1 class="page-title">▰ 复习进度</h1>';
    h += '<p class="page-sub">进度保存在本地浏览器（localStorage），不上传任何数据。</p>';

    var totalSec = CH.reduce(function (s, c) { return s + c.sections.length; }, 0);
    CH.forEach(function (c) { if (reviewed[c.id]) doneN++; });
    var pct = Math.round(doneN / CH.length * 100);

    h += '<div class="grid g4" style="margin-bottom:18px">' +
      stat(pct + '%', '章节完成度', '') +
      stat(doneN + '/' + CH.length, '已复习章节', 'green') +
      stat(totalSec, '知识点总数', 'purple') +
      stat(Object.keys(quizStats.seen || {}).length, '刷题已练', 'amber') +
      '</div>';

    h += '<h2 class="sec">各章复习状态</h2><div class="card">';
    CH.forEach(function (c) {
      var v = reviewed[c.id] ? 100 : 0;
      h += '<div class="prog-row"><div class="pl">第 ' + c.num + ' 章 ' + esc(c.title) + '</div>' +
        '<div class="pb"><i style="width:' + v + '%"></i></div>' +
        '<div class="pv">' + (v ? '已完成' : '未开始') + '</div></div>';
    });
    h += '</div>';

    h += '<h2 class="sec">刷题统计</h2><div class="card">';
    var tot = quizStats.right + quizStats.wrong;
    var rate = tot ? Math.round(quizStats.right / tot * 100) : 0;
    h += '<div class="prog-row"><div class="pl">自评掌握率</div><div class="pb"><i style="width:' + rate + '%"></i></div><div class="pv">' + rate + '%</div></div>';
    h += '<div class="prog-row"><div class="pl">自评"会"</div><div class="pb"><i style="width:' + (tot ? quizStats.right / tot * 100 : 0) + '%;background:linear-gradient(90deg,#3fc48d,#12905f)"></i></div><div class="pv">' + quizStats.right + ' 题</div></div>';
    h += '<div class="prog-row"><div class="pl">自评"不会"</div><div class="pb"><i style="width:' + (tot ? quizStats.wrong / tot * 100 : 0) + '%;background:linear-gradient(90deg,#f08a8a,#d64545)"></i></div><div class="pv">' + quizStats.wrong + ' 题</div></div>';
    h += '<p style="margin-bottom:0;color:var(--ink-3);font-size:13px">' + (tot ? '继续加油，把"不会"的题目对应章节再刷一遍。' : '还没有刷题记录，去「刷题自测」开始吧。') + '</p>';
    h += '</div>';

    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">' +
      '<button class="btn primary" data-go="#/quiz">去刷题 →</button>' +
      '<button class="btn" data-go="#/chapters">去复习章节 →</button>' +
      '<button class="btn" id="resetAll" style="margin-left:auto;color:var(--red)">清空全部进度</button>' +
      '</div>';
    h += foot();

    return {
      html: h, crumb: '考前冲刺 · <b>复习进度</b>', title: '复习进度',
      after: function () {
        bindTiles();
        $('#resetAll').onclick = function () {
          if (!confirm('确定清空全部复习进度和刷题统计吗？此操作不可恢复。')) return;
          reviewed = {}; quizStats = { right: 0, wrong: 0, seen: {} };
          LS.set(KEY_CH, reviewed); LS.set(KEY_QZ, quizStats);
          quizPool = null; router();
        };
      }
    };
  };

  /* ---------------- 搜索 ---------------- */
  var searchIndex = null;

  function buildIndex() {
    var idx = [];
    CH.forEach(function (c) {
      idx.push({ t: '第' + c.num + '章 ' + c.title, d: c.intro.replace(/<[^>]+>/g, '').slice(0, 90), r: '#/ch/' + c.id, tag: '章节' });
      c.sections.forEach(function (s) {
        idx.push({ t: s.h, d: s.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 90), r: '#/ch/' + c.id, tag: '第' + c.num + '章' });
      });
      c.examples.forEach(function (e) {
        idx.push({ t: '例题：' + e.q.replace(/\$[^$]*\$/g, '').replace(/<[^>]+>/g, '').slice(0, 40), d: e.a.replace(/<[^>]+>/g, ' ').slice(0, 90), r: '#/ch/' + c.id, tag: '例题' });
      });
    });
    TN.notes.forEach(function (n) {
      idx.push({ t: n.title, d: n.point + ' ' + n.detail, r: '#/ch/' + n.ch, tag: '老师板书', img: n.file });
    });
    FM.forEach(function (g) {
      g.items.forEach(function (it) {
        idx.push({ t: it.n, d: (it.f + ' ' + (it.note || '')).replace(/\$+/g, '').slice(0, 90), r: '#/formulas', tag: '公式' });
      });
    });
    TP.forEach(function (t) {
      t.questions.forEach(function (q, i) {
        idx.push({ t: t.title + ' 第' + (i + 1) + '题', d: q.q.replace(/\$[^$]*\$/g, '').replace(/<[^>]+>/g, ' ').slice(0, 90), r: '#/topic/' + t.id, tag: '题目' });
      });
    });
    PP.forEach(function (p) {
      idx.push({ t: p.title, d: p.meta, r: '#/paper/' + p.id, tag: '试卷' });
    });
    return idx;
  }

  function doSearch(kw) {
    if (!searchIndex) searchIndex = buildIndex();
    kw = kw.trim().toLowerCase();
    var panel = $('#searchPanel');
    if (!kw) { panel.classList.remove('show'); return; }
    var hits = searchIndex.filter(function (x) {
      return (x.t + ' ' + x.d).toLowerCase().indexOf(kw) > -1;
    }).slice(0, 24);
    if (!hits.length) {
      panel.innerHTML = '<div class="sr-empty">没有找到「' + esc(kw) + '」相关内容<br><span style="font-size:12px">试试：卷积、双线性、共轭对称、FFT、窗函数</span></div>';
      panel.classList.add('show');
      return;
    }
    panel.innerHTML = hits.map(function (x) {
      var t = x.t.replace(new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      return '<div class="sr-item" data-r="' + x.r + '"><div class="st">' + t + ' <span class="chip gray" style="font-size:10px;padding:0 6px">' + x.tag + '</span></div><div class="sd">' + esc(x.d) + '</div></div>';
    }).join('');
    panel.classList.add('show');
    $$('.sr-item', panel).forEach(function (el) {
      el.onclick = function () {
        go(el.dataset.r);
        panel.classList.remove('show');
        $('#searchInput').value = '';
      };
    });
  }

  $('#searchInput').addEventListener('input', function () { doSearch(this.value); });
  $('#searchInput').addEventListener('focus', function () { if (this.value) doSearch(this.value); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search')) $('#searchPanel').classList.remove('show');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#searchInput').focus(); }
  });

  /* ---------------- 移动端菜单 ---------------- */
  function closeSidebar() { $('#sidebar').classList.remove('open'); }
  $('#menuBtn').onclick = function (e) { e.stopPropagation(); $('#sidebar').classList.toggle('open'); };

  /* ---------------- 启动 ---------------- */
  window.addEventListener('hashchange', router);
  router();
})();
