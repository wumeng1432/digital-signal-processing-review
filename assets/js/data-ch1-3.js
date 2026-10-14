/* ============================================================
   数字信号处理复习站 — 教材精讲 第 1~3 章
   教材：高西全、丁玉美《数字信号处理》第四版，西安电子科技大学出版社
   ============================================================ */
window.DSP_CHAPTERS = window.DSP_CHAPTERS || [];

/* ========================= 第 1 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch1',
  num: 1,
  title: '时域离散信号和时域离散系统',
  subtitle: '序列 · 卷积 · 差分方程 · 采样定理',
  weight: 4,
  tags: ['基础必考', '采样定理', '线性卷积'],
  intro: '本章是全课程的地基。期末几乎必考"判断序列周期性""判断系统线性/时不变/因果/稳定""用卷积和求系统响应""由差分方程求 h(n)"以及"采样定理与频谱混叠"。',
  outline: [
    '1.2 时域离散信号：典型序列、序列的运算',
    '1.3 时域离散系统：线性、时不变、LTI 输入输出关系、因果性、稳定性',
    '1.4 线性常系数差分方程及其求解',
    '1.5 模拟信号数字处理：采样定理、A/D 与 D/A 变换'
  ],
  sections: [
    {
      h: '1.2 常用典型序列（必背）',
      body: `<table class="tbl">
        <tr><th>名称</th><th>表达式</th><th>要点</th></tr>
        <tr><td>单位脉冲序列</td><td>$\\delta(n)=\\begin{cases}1,& n=0\\\\0,& n\\ne 0\\end{cases}$</td><td>任意序列可表示为 $x(n)=\\sum_{m=-\\infty}^{\\infty}x(m)\\delta(n-m)$（筛分性）</td></tr>
        <tr><td>单位阶跃序列</td><td>$u(n)=\\begin{cases}1,& n\\ge 0\\\\0,& n<0\\end{cases}$</td><td>$\\delta(n)=u(n)-u(n-1)$；$u(n)=\\sum_{k=0}^{\\infty}\\delta(n-k)$</td></tr>
        <tr><td>矩形序列</td><td>$R_N(n)=\\begin{cases}1,& 0\\le n\\le N-1\\\\0,& \\text{其它}\\end{cases}$</td><td>$R_N(n)=u(n)-u(n-N)$</td></tr>
        <tr><td>实指数序列</td><td>$x(n)=a^n u(n)$</td><td>$|a|<1$ 收敛，$|a|>1$ 发散，$a<0$ 正负交替</td></tr>
        <tr><td>正弦序列</td><td>$x(n)=\\sin(\\omega_0 n)$</td><td>只有 $2\\pi/\\omega_0$ 为有理数时才周期</td></tr>
        <tr><td>复指数序列</td><td>$x(n)=e^{(\\sigma+j\\omega_0)n}$</td><td>$\\sigma=0$ 时为 $e^{j\\omega_0 n}$，以 $2\\pi$ 为周期</td></tr>
      </table>`
    },
    {
      h: '★ 序列周期性的判定（高频选择/填空）',
      body: `<p>正弦序列 $x(n)=\\sin(\\omega_0 n)$ 或复指数序列 $e^{j\\omega_0 n}$ 为周期序列的<b>充要条件</b>是：</p>
      <div class="formula">$$\\frac{2\\pi}{\\omega_0}=\\frac{N}{k}\\quad (N,k\\ \\text{为互质的正整数})$$</div>
      <p>此时最小周期为 $N$。</p>
      <ul>
        <li>$\\dfrac{2\\pi}{\\omega_0}$ 为<b>有理数</b> → 周期序列，$N=k\\cdot\\dfrac{2\\pi}{\\omega_0}$ 的最小整数；</li>
        <li>$\\dfrac{2\\pi}{\\omega_0}$ 为<b>无理数</b> → 非周期序列。</li>
      </ul>
      <div class="tip"><b>速判技巧：</b>把 $\\omega_0$ 写成 $\\dfrac{p}{q}\\pi$ 的形式，则周期 $N=\\dfrac{2q}{p}$（需化为最小整数）。例如 $\\omega_0=\\dfrac{3\\pi}{5}$ → $N=\\dfrac{10}{3}$ 非整数 → <b>非周期</b>；$\\omega_0=\\dfrac{4\\pi}{5}$ → $N=\\dfrac{5}{2}$… 注意：$\\dfrac{2\\pi}{\\omega_0}=\\dfrac{5}{2}=\\dfrac{N}{k}$，取 $N=5,k=2$，<b>是周期序列，周期 5</b>。</div>`
    },
    {
      h: '1.3 系统的四大性质判定',
      body: `<table class="tbl">
        <tr><th>性质</th><th>定义式</th><th>判定方法</th></tr>
        <tr><td><b>线性</b></td><td>$T[ax_1(n)+bx_2(n)]=aT[x_1(n)]+bT[x_2(n)]$</td><td>同时满足<b>齐次性</b>与<b>可加性</b></td></tr>
        <tr><td><b>时不变</b></td><td>$T[x(n-n_0)]=y(n-n_0)$</td><td>输入延迟 $n_0$，输出同量延迟</td></tr>
        <tr><td><b>因果</b></td><td>$n<0$ 时 $h(n)=0$</td><td>输出不取决于未来输入</td></tr>
        <tr><td><b>稳定</b></td><td>$\\sum_{n=-\\infty}^{\\infty}|h(n)|<\\infty$</td><td>输入有界则输出有界（BIBO）</td></tr>
      </table>
      <div class="tip"><b>典型反例：</b>$y(n)=x(n)\\cdot x(n-1)$ 非线性但时不变；$y(n)=x(2n)$ 线性但<b>不是</b>时不变（尺度变换）；$y(n)=x(-n)$ 是时变系统。</div>`
    },
    {
      h: '1.3.3 LTI 系统的输入输出关系 —— 线性卷积',
      body: `<div class="formula">$$y(n)=x(n)*h(n)=\\sum_{m=-\\infty}^{\\infty}x(m)h(n-m)$$</div>
      <p><b>卷积的四个运算步骤（图解法）：</b>① 翻转 → ② 移位 → ③ 相乘 → ④ 求和。</p>
      <p><b>卷积性质：</b></p>
      <ul>
        <li>交换律 $x*h=h*x$；结合律 $(x*h_1)*h_2=x*(h_1*h_2)$；分配律 $x*(h_1+h_2)=x*h_1+x*h_2$</li>
        <li>长度关系：$x(n)$ 长 $N_1$，$h(n)$ 长 $N_2$，则 $y(n)$ 长 $L=N_1+N_2-1$</li>
        <li>$x(n)*\\delta(n-n_0)=x(n-n_0)$</li>
      </ul>
      <div class="tip"><b>考试提醒：</b>中南民大期末卷积题几乎年年出现。务必把"两个短序列的卷积和"算到滚瓜烂熟，这是后面循环卷积、DFT 计算线性卷积的基础。</div>`
    },
    {
      h: '1.4 线性常系数差分方程',
      body: `<div class="formula">$$\\sum_{k=0}^{N}a_k\\,y(n-k)=\\sum_{m=0}^{M}b_m\\,x(n-m)$$</div>
      <p><b>三种解法：</b></p>
      <ol>
        <li><b>递推法（迭代法）</b>——求 $h(n)$ 时最常用：设 $x(n)=\\delta(n)$，逐点递推，注意初始条件 $y(-1),y(-2),\\dots$</li>
        <li><b>经典法</b>——齐次解 + 特解，代入初始条件定系数</li>
        <li><b>Z 变换法</b>——最省事，$Y(z)=H(z)X(z)$，再逆变换</li>
      </ol>
      <div class="tip"><b>关键：</b>差分方程本身<b>不能</b>唯一确定系统，必须给出<b>初始条件</b>（是因果系统还是非因果系统）。</div>`
    },
    {
      h: '★ 1.5 采样定理与频谱混叠（必考）',
      body: `<p>对最高频率为 $f_c$（对应模拟角频率 $\\Omega_c$）的带限信号 $x_a(t)$ 采样，采样频率为 $f_s=\\dfrac{1}{T}$：</p>
      <div class="formula">$$f_s\\ \\ge\\ 2f_c \\qquad\\Longleftrightarrow\\qquad \\Omega_s\\ \\ge\\ 2\\Omega_c,\\quad \\Omega_s=\\frac{2\\pi}{T}$$</div>
      <p>否则频谱发生<b>混叠</b>（原信号频谱发生重叠），无法由采样序列无失真恢复原信号。</p>
      <p><b>采样后频谱（时域相乘 ⇔ 频域周期延拓）：</b></p>
      <div class="formula">$$\\hat{X}_a(j\\Omega)=\\frac{1}{T}\\sum_{k=-\\infty}^{\\infty}X_a\\big(j(\\Omega-k\\Omega_s)\\big)$$</div>
      <p>采样序列的 DTFT 与模拟频谱关系：</p>
      <div class="formula">$$X(e^{j\\omega})=X\\big(e^{j\\Omega T}\\big)=\\frac{1}{T}\\sum_{k=-\\infty}^{\\infty}X_a\\Big(j\\frac{\\omega-2\\pi k}{T}\\Big)$$</div>
      <p><b>恢复（D/A）：</b>理想低通滤波器 $H(j\\Omega)=\\begin{cases}T,&|\\Omega|<\\Omega_s/2\\\\0,&|\\Omega|\\ge\\Omega_s/2\\end{cases}$，时域为 $h(t)=\\dfrac{\\sin(\\pi t/T)}{\\pi t/T}$（内插函数）。</p>
      <div class="tip"><b>三个易错点：</b>① 采样频率是信号最高频率的<b>2 倍以上</b>，不是等于；② 频谱延拓的周期是 $\\Omega_s$，不是 $\\Omega_c$；③ DTFT 中 $\\omega=\\Omega T$ 是无量纲的，周期为 $2\\pi$。</div>`
    }
  ],
  examples: [
    {
      q: '判断序列 $x(n)=\\cos\\left(\\dfrac{2\\pi}{5}n\\right)$ 的周期性，若周期存在写出其最小周期。',
      a: '$\\dfrac{2\\pi}{\\omega_0}=\\dfrac{2\\pi}{2\\pi/5}=5=\\dfrac{N}{k}$，取互质正整数 $N=5,k=1$。<br><b>结论：是周期序列，最小周期 $N=5$。</b>'
    },
    {
      q: '已知 LTI 系统的差分方程为 $y(n)-0.5y(n-1)=x(n)+2x(n-1)$，$y(-1)=0$，求单位脉冲响应 $h(n)$。',
      a: '设 $x(n)=\\delta(n)$，则 $y(n)=h(n)$。<br>$n=0$：$h(0)=0.5h(-1)+\\delta(0)+2\\delta(-1)=0+1+0=1$<br>$n=1$：$h(1)=0.5h(0)+\\delta(1)+2\\delta(0)=0.5+0+2=2.5$<br>$n\\ge 2$：$h(n)=0.5h(n-1)$，即 $h(n)=2.5\\times0.5^{\\,n-1}$<br>综合：$h(n)=\\delta(n)+2.5\\cdot(0.5)^{n-1}u(n-1)$，也可写成 $h(n)=(0.5)^n u(n)+2(0.5)^{n-1}u(n-1)$。'
    },
    {
      q: '序列 $x(n)=\\cos(200\\pi t)$ 采样，采样频率 $f_s=300\\,\\mathrm{Hz}$，是否满足采样定理？会发生什么现象？',
      a: '信号最高频率 $f_c=100\\,\\mathrm{Hz}$，奈奎斯特频率 $2f_c=200\\,\\mathrm{Hz}$。<br>因为 $f_s=300>200$，<b>满足采样定理，不会混叠</b>。<br>数字频率 $\\omega_0=\\Omega_c T=200\\pi/300=\\dfrac{2\\pi}{3}$。'
    }
  ],
  pitfalls: [
    '把"采样频率 ≥ 2 倍最高频率"误记成"等于 2 倍"。',
    '判断周期性时忘记把 $\\frac{2\\pi}{\\omega_0}$ 化成最简分数 $N/k$。',
    '差分方程递推求 $h(n)$ 时漏掉初始条件 $y(-1)$ 的影响。',
    '线性卷积长度写成 $N_1+N_2$ 而非 $N_1+N_2-1$。'
  ]
});

/* ========================= 第 2 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch2',
  num: 2,
  title: '时域离散信号和系统的频域分析',
  subtitle: 'DTFT · Z 变换 · 共轭对称 · 系统函数',
  weight: 5,
  tags: ['★老师重点', '证明题高发区', '必考'],
  intro: '★ 这是本次老师划重点最集中的一章！课堂板书大量篇幅在讲 DTFT 性质的证明（时移、频移、卷积、乘积）、共轭对称性的完整推导、常用序列的 DTFT、Z 变换的收敛域规律。期末的证明题基本出自这里。',
  outline: [
    '2.2 DTFT 的定义与性质（时移、频移、卷积、乘积、共轭对称、Parseval）',
    '2.3 周期序列的 DFS 与 FT 表示式',
    '2.4 DTFT 与模拟信号 FT 的关系',
    '2.5 序列的 Z 变换：定义、收敛域、逆 Z 变换、性质',
    '2.6 利用 Z 变换分析系统频响特性：极零点分布'
  ],
  sections: [
    {
      h: '★ 2.2 DTFT 的定义与存在条件',
      body: `<div class="formula">$$X(e^{j\\omega})=\\mathrm{FT}[x(n)]=\\sum_{n=-\\infty}^{\\infty}x(n)e^{-j\\omega n}$$</div>
      <p><b>反变换（IDTFT）：</b></p>
      <div class="formula">$$x(n)=\\mathrm{IFT}[X(e^{j\\omega})]=\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}X(e^{j\\omega})e^{j\\omega n}\\,\\mathrm{d}\\omega$$</div>
      <p><b>存在条件（绝对可和）：</b>$\\sum\\limits_{n=-\\infty}^{\\infty}|x(n)|<\\infty$</p>
      <p>DTFT 是 $\\omega$ 的<b>连续</b>函数，且以 $2\\pi$ 为<b>周期</b>：$X(e^{j(\\omega+2\\pi)})=X(e^{j\\omega})$。</p>
      <p><b>与 Z 变换的关系（板书重点示意图）：</b></p>
      <div class="formula">$$X(z)\\Big|_{z=e^{j\\omega}}=X(e^{j\\omega})$$</div>
      <p>即 DTFT 就是 Z 变换在<b>单位圆</b>上的取值（前提：收敛域包含单位圆）。</p>
      <p><b>IDTFT 的推导核心——复指数正交性（板书）：</b></p>
      <div class="formula">$$\\int_{-\\pi}^{\\pi}e^{j\\omega(m-n)}\\,\\mathrm{d}\\omega=2\\pi\\,\\delta(m-n)$$</div>
      <p>推导：$m\\ne n$ 时 $=\\dfrac{e^{j\\omega(m-n)}}{j(m-n)}\\Big|_{-\\pi}^{\\pi}=\\dfrac{2\\sin[(m-n)\\pi]}{m-n}=0$；$m=n$ 时 $=\\int_{-\\pi}^{\\pi}\\mathrm{d}\\omega=2\\pi$。</p>`
    },
    {
      h: '★ 常用序列的 DTFT（板书，必背）',
      body: `<table class="tbl">
        <tr><th>序列 $x(n)$</th><th>DTFT $X(e^{j\\omega})$</th></tr>
        <tr><td>$\\delta(n)$</td><td>$1$</td></tr>
        <tr><td>$\\delta(n-n_0)$</td><td>$e^{-j\\omega n_0}$</td></tr>
        <tr><td>$1\\ \\ (-\\infty<n<\\infty)$</td><td>$2\\pi\\sum\\limits_{k=-\\infty}^{\\infty}\\delta(\\omega-2\\pi k)$</td></tr>
        <tr><td>$e^{j\\omega_0 n}$</td><td>$2\\pi\\sum\\limits_{k=-\\infty}^{\\infty}\\delta(\\omega-\\omega_0-2\\pi k)$</td></tr>
        <tr><td>$R_N(n)$</td><td>$e^{-j\\frac{N-1}{2}\\omega}\\cdot\\dfrac{\\sin(\\omega N/2)}{\\sin(\\omega/2)}$</td></tr>
        <tr><td>$a^n u(n)\\ (|a|<1)$</td><td>$\\dfrac{1}{1-ae^{-j\\omega}}$</td></tr>
        <tr><td>$u(n)$</td><td>$\\dfrac{1}{1-e^{-j\\omega}}+\\pi\\sum\\limits_{k=-\\infty}^{\\infty}\\delta(\\omega-2\\pi k)$</td></tr>
      </table>
      <p><b>$R_N(n)$ 的推导（板书重点）：</b>等比数列求和</p>
      <div class="formula">$$\\sum_{n=0}^{N-1}e^{-j\\omega n}=\\frac{1-e^{-j\\omega N}}{1-e^{-j\\omega}}
      =e^{-j\\frac{N-1}{2}\\omega}\\cdot\\frac{\\sin(\\omega N/2)}{\\sin(\\omega/2)}$$</div>
      <p><b>$u(n)$ 的推导（板书）：</b>由 $x(n)-x(n-1)=\\delta(n)$，两边取 DTFT：$X(e^{j\\omega})-e^{-j\\omega}X(e^{j\\omega})=1$，故</p>
      <div class="formula">$$X(e^{j\\omega})=\\frac{1}{1-e^{-j\\omega}}$$</div>
      <p>（这是 $u(n)$ 的"交流分量"，严格意义上还需加上直流分量 $\\pi\\sum\\delta(\\omega-2\\pi k)$）</p>`
    },
    {
      h: '★★ DTFT 的性质 —— 证明题主战场（板书逐条证明）',
      body: `<table class="tbl">
        <tr><th>性质</th><th>时域</th><th>频域</th></tr>
        <tr><td>线性</td><td>$ax_1(n)+bx_2(n)$</td><td>$aX_1(e^{j\\omega})+bX_2(e^{j\\omega})$</td></tr>
        <tr><td><b>时移</b></td><td>$x(n-n_0)$</td><td>$e^{-j\\omega n_0}X(e^{j\\omega})$</td></tr>
        <tr><td><b>频移</b></td><td>$e^{j\\omega_0 n}x(n)$</td><td>$X\\big(e^{j(\\omega-\\omega_0)}\\big)$</td></tr>
        <tr><td>时域卷积</td><td>$x(n)*h(n)$</td><td>$X(e^{j\\omega})H(e^{j\\omega})$</td></tr>
        <tr><td>频域卷积</td><td>$x(n)\\cdot h(n)$</td><td>$\\dfrac{1}{2\\pi}X(e^{j\\omega})\\circledast H(e^{j\\omega})$</td></tr>
        <tr><td>共轭对称</td><td>$x^*(n)$</td><td>$X^*(e^{-j\\omega})$</td></tr>
        <tr><td>序列反转</td><td>$x(-n)$</td><td>$X(e^{-j\\omega})$</td></tr>
        <tr><td>Parseval</td><td>$\\sum|x(n)|^2$</td><td>$\\dfrac{1}{2\\pi}\\int_{-\\pi}^{\\pi}|X(e^{j\\omega})|^2\\mathrm{d}\\omega$</td></tr>
      </table>

      <h4>① 时移性质证明</h4>
      <div class="formula">$$\\mathrm{FT}[x(n-n_0)]=\\sum_{n=-\\infty}^{\\infty}x(n-n_0)e^{-j\\omega n}\\ \\xrightarrow{\\,n'=n-n_0\\,}\\ \\sum_{n'=-\\infty}^{\\infty}x(n')e^{-j\\omega(n'+n_0)}=X(e^{j\\omega})e^{-j\\omega n_0}$$</div>

      <h4>② 频移性质证明</h4>
      <div class="formula">$$\\mathrm{FT}[e^{j\\omega_0 n}x(n)]=\\sum_{n=-\\infty}^{\\infty}e^{j\\omega_0 n}x(n)e^{-j\\omega n}=\\sum_{n=-\\infty}^{\\infty}x(n)e^{-j(\\omega-\\omega_0)n}=X\\big(e^{j(\\omega-\\omega_0)}\\big)$$</div>

      <h4>③ 时域卷积定理证明</h4>
      <div class="formula">$$\\mathrm{FT}[x(n)*h(n)]=\\sum_{n=-\\infty}^{\\infty}\\Big[\\sum_{m=-\\infty}^{\\infty}x(m)h(n-m)\\Big]e^{-j\\omega n}
      =\\sum_{m=-\\infty}^{\\infty}x(m)\\Big[\\sum_{n=-\\infty}^{\\infty}h(n-m)e^{-j\\omega n}\\Big]$$
      $$=\\Big[\\sum_{m=-\\infty}^{\\infty}x(m)e^{-j\\omega m}\\Big]H(e^{j\\omega})=X(e^{j\\omega})H(e^{j\\omega})$$</div>

      <h4>④ 频域卷积定理（加窗/乘积）证明</h4>
      <div class="formula">$$\\mathrm{FT}[x(n)\\cdot h(n)]=\\sum_{n=-\\infty}^{\\infty}x(n)\\Big[\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}H(e^{j\\theta})e^{j\\theta n}\\mathrm{d}\\theta\\Big]e^{-j\\omega n}
      =\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}H(e^{j\\theta})\\Big[\\sum_{n=-\\infty}^{\\infty}x(n)e^{-j(\\omega-\\theta)n}\\Big]\\mathrm{d}\\theta$$</div>
      <div class="formula">$$=\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}H(e^{j\\theta})X\\big(e^{j(\\omega-\\theta)}\\big)\\mathrm{d}\\theta=\\frac{1}{2\\pi}H(e^{j\\omega})\\circledast X(e^{j\\omega})$$</div>
      <div class="tip"><b>这四条证明是老师板书的核心内容，务必能手写复现。</b>证明套路统一：<b>写出定义 → 换元/交换求和次序 → 凑出对方变换的定义式</b>。</div>`
    },
    {
      h: '★★ 2.2.2 共轭对称性（板书最详细，必考）',
      body: `<p><b>序列的分解：</b>任意序列可分解为共轭对称分量与共轭反对称分量之和</p>
      <div class="formula">$$x(n)=x_e(n)+x_o(n)$$
      $$x_e(n)=\\frac{1}{2}\\big[x(n)+x^*(-n)\\big],\\qquad x_o(n)=\\frac{1}{2}\\big[x(n)-x^*(-n)\\big]$$</div>
      <p>反之：$x^*(-n)=x_e(n)-x_o(n)$。</p>
      <p><b>再分解（实部/虚部的对称性）：</b>设 $x_e(n)=x_{er}(n)+j\\,x_{ei}(n)$，则</p>
      <div class="formula">$$x_{er}(n)=x_{er}(-n)\\ \\ (\\text{偶}),\\qquad x_{ei}(n)=-x_{ei}(-n)\\ \\ (\\text{奇})$$</div>
      <p>同理 $x_o(n)=x_{or}(n)+j\\,x_{oi}(n)$ 中 $x_{or}$ 奇对称、$x_{oi}$ 偶对称。</p>
      <p><b>频域对应关系（板书）：</b></p>
      <div class="formula">$$X_e(e^{j\\omega})=\\mathrm{FT}[x_e(n)]=\\frac{1}{2}\\big[X(e^{j\\omega})+X^*(e^{-j\\omega})\\big]$$
      $$X_o(e^{j\\omega})=\\mathrm{FT}[x_o(n)]=\\frac{1}{2}\\big[X(e^{j\\omega})-X^*(e^{-j\\omega})\\big]$$</div>
      <p><b>实序列 $x(n)$（$x(n)$ 为实数）的重要结论：</b></p>
      <ul>
        <li>实部 $\\mathrm{Re}[X(e^{j\\omega})]$ 是 $\\omega$ 的<b>偶函数</b>，虚部 $\\mathrm{Im}[X(e^{j\\omega})]$ 是<b>奇函数</b>；</li>
        <li>幅度 $|X(e^{j\\omega})|$ 为<b>偶</b>，相位 $\\arg X(e^{j\\omega})$ 为<b>奇</b>；</li>
        <li>$X(e^{j\\omega})=X^*(e^{-j\\omega})$（共轭对称）。</li>
      </ul>
      <p><b>序列实部与虚部的变换（板书）：</b></p>
      <div class="formula">$$\\mathrm{FT}\\big[\\mathrm{Re}[x(n)]\\big]=X_e(e^{j\\omega}),\\qquad \\mathrm{FT}\\big[j\\,\\mathrm{Im}[x(n)]\\big]=X_o(e^{j\\omega})$$</div>
      <p>由 $x_e(n)=\\frac{1}{2}[x(n)+x^*(-n)]$ 取 FT：</p>
      <div class="formula">$$\\mathrm{FT}[x_e(n)]=\\frac{1}{2}\\Big[X(e^{j\\omega})+\\sum_{n=-\\infty}^{\\infty}x^*(n')e^{j\\omega n'}\\Big]=\\frac{1}{2}\\big[X(e^{j\\omega})+X^*(e^{j\\omega})\\big]=\\mathrm{Re}\\big[X(e^{j\\omega})\\big]$$</div>
      <div class="tip"><b>记忆口诀：</b>时域共轭对称 → 频域取实部；时域共轭反对称 → 频域取虚部（乘 $j$）。</div>`
    },
    {
      h: '2.3 周期序列的离散傅里叶级数（DFS）',
      body: `<p>周期为 $N$ 的序列 $\\tilde{x}(n)$：</p>
      <div class="formula">$$\\tilde{X}(k)=\\mathrm{DFS}[\\tilde{x}(n)]=\\sum_{n=0}^{N-1}\\tilde{x}(n)e^{-j\\frac{2\\pi}{N}nk},\\qquad
      \\tilde{x}(n)=\\frac{1}{N}\\sum_{k=0}^{N-1}\\tilde{X}(k)e^{j\\frac{2\\pi}{N}nk}$$</div>
      <p>记 $W_N=e^{-j\\frac{2\\pi}{N}}$（旋转因子），则 $\\tilde{X}(k)=\\sum\\limits_{n=0}^{N-1}\\tilde{x}(n)W_N^{nk}$。</p>
      <p>周期序列的 FT 表示式：$\\mathrm{FT}[e^{j\\omega_0 n}]=2\\pi\\sum\\limits_{k=-\\infty}^{\\infty}\\delta(\\omega-\\omega_0-2\\pi k)$。</p>`
    },
    {
      h: '★ 2.5 序列的 Z 变换与收敛域',
      body: `<div class="formula">$$X(z)=\\mathrm{ZT}[x(n)]=\\sum_{n=-\\infty}^{\\infty}x(n)z^{-n},\\qquad z\\ \\text{为复变量}$$</div>
      <p><b>常用 Z 变换对（板书必背）：</b></p>
      <table class="tbl">
        <tr><th>序列</th><th>$X(z)$</th><th>收敛域 ROC</th></tr>
        <tr><td>$\\delta(n)$</td><td>$1$</td><td>全 $z$ 平面</td></tr>
        <tr><td>$u(n)$</td><td>$\\dfrac{z}{z-1}$</td><td>$|z|>1$</td></tr>
        <tr><td>$-u(-n-1)$</td><td>$\\dfrac{z}{z-1}$</td><td>$|z|<1$</td></tr>
        <tr><td>$a^n u(n)$</td><td>$\\dfrac{z}{z-a}$</td><td>$|z|>|a|$</td></tr>
        <tr><td>$-a^n u(-n-1)$</td><td>$\\dfrac{z}{z-a}$</td><td>$|z|<|a|$</td></tr>
        <tr><td>$n u(n)$</td><td>$\\dfrac{z}{(z-1)^2}$</td><td>$|z|>1$</td></tr>
      </table>
      <p><b>ROC 的规律（必背）：</b></p>
      <ul>
        <li><b>有限长序列</b>：$0<|z|<\\infty$（若 $n\\ge0$ 含 $z=\\infty$ 需另论）</li>
        <li><b>右边序列</b>（$n\\ge n_1$）：$|z|>R_{x-}$，即以最外层极点为半径的圆<b>外部</b>；因果序列（$n_1\\ge0$）ROC 包含 $z=\\infty$</li>
        <li><b>左边序列</b>（$n\\le n_2$）：$|z|<R_{x+}$，圆<b>内部</b>；反因果序列 ROC 包含 $z=0$</li>
        <li><b>双边序列</b>：$R_{x-}<|z|<R_{x+}$，<b>环状</b>区域</li>
      </ul>
      <p><b>★ 双边序列示例（板书）：</b>$x(n)=a^{|n|}$，$|a|<1$</p>
      <div class="formula">$$x(n)=\\begin{cases}a^{n}u(n),& n\\ge0\\\\ a^{-n}u(-n-1),& n<0\\end{cases}$$</div>
      <p>前半部分：$a^nu(n)\\leftrightarrow \\dfrac{z}{z-a},\\ |z|>|a|$；<br>
      后半部分：$a^{-n}u(-n-1)=(a^{-1})^nu(-n-1)\\leftrightarrow -\\dfrac{z}{z-a^{-1}}=\\dfrac{z}{a^{-1}-z}=\\dfrac{az}{1-az},\\ |z|<|a|^{-1}$</p>
      <div class="formula">$$X(z)=\\frac{z}{z-a}+\\frac{az}{1-az}=\\frac{z(1-a^2)}{(z-a)(1-az)},\\qquad |a|<|z|<\\frac{1}{|a|}$$</div>
      <div class="tip"><b>考试提示：</b>同一个 $X(z)$ 表达式，ROC 不同则对应的序列不同！答题时<b>必须写收敛域</b>。</div>`
    },
    {
      h: '2.5.3 逆 Z 变换的三种方法',
      body: `<ol>
        <li><b>留数法（围线积分）</b>：$x(n)=\\dfrac{1}{2\\pi j}\\oint_C X(z)z^{n-1}\\mathrm{d}z=\\sum\\mathrm{Res}[X(z)z^{n-1}]_{z=z_k}$</li>
        <li><b>部分分式展开法</b>：把 $\\dfrac{X(z)}{z}$ 展成简单分式，再查表。这是考试最常用的方法。</li>
        <li><b>幂级数展开法（长除法）</b>：右边序列按 $z^{-1}$ 降幂，左边序列按 $z$ 升幂。</li>
      </ol>`
    },
    {
      h: '★ 2.6 用 Z 变换分析系统的频响特性',
      body: `<p>系统函数：$H(z)=\\dfrac{Y(z)}{X(z)}=\\dfrac{\\sum b_m z^{-m}}{\\sum a_k z^{-k}}$，频响 $H(e^{j\\omega})=H(z)\\big|_{z=e^{j\\omega}}$。</p>
      <p><b>因果性与稳定性判据（极零点分布）：</b></p>
      <table class="tbl">
        <tr><th>条件</th><th>结论</th></tr>
        <tr><td>因果</td><td>$h(n)=0\\ (n<0)$，ROC 为最外层极点圆<b>外部</b>且含 $\\infty$</td></tr>
        <tr><td>稳定</td><td>$\\sum|h(n)|<\\infty$，ROC <b>包含单位圆</b></td></tr>
        <tr><td><b>因果且稳定</b></td><td><b>全部极点都在单位圆内</b> $|z_k|<1$（此时 ROC 为 $|z|>\\max|z_k|$ 且含单位圆）</td></tr>
      </table>
      <p><b>几何法求频响（零极点矢量法）：</b>设 $H(z)=A\\dfrac{\\prod(z-z_r)}{\\prod(z-p_k)}$，则</p>
      <div class="formula">$$\\big|H(e^{j\\omega})\\big|=|A|\\frac{\\prod|e^{j\\omega}-z_r|}{\\prod|e^{j\\omega}-p_k|}$$</div>
      <p>单位圆上某点 $e^{j\\omega}$ 到各零点的距离乘积 ÷ 到各极点的距离乘积。</p>
      <p><b>几种特殊系统：</b></p>
      <ul>
        <li>全通系统：$|H(e^{j\\omega})|=1$ 常数，幅频平坦、只改相位；</li>
        <li>最小相位系统：全部零点在单位圆内，相位变化最小；</li>
        <li>梳状滤波器、一阶/二阶系统等。</li>
      </ul>
      <div class="tip"><b>考试常考：</b>给定 $H(z)$ 的零极点图，判断系统是低通/高通/带通/带阻；或给定极零点求 $h(n)$、判断稳定性。</div>`
    }
  ],
  examples: [
    {
      q: '<b>证明</b>：$\\mathrm{FT}[x(n-n_0)]=e^{-j\\omega n_0}X(e^{j\\omega})$。',
      a: '由定义 $\\mathrm{FT}[x(n-n_0)]=\\sum\\limits_{n=-\\infty}^{\\infty}x(n-n_0)e^{-j\\omega n}$。<br>令 $m=n-n_0$，则 $n=m+n_0$，求和范围不变：<br>$=\\sum\\limits_{m=-\\infty}^{\\infty}x(m)e^{-j\\omega(m+n_0)}=e^{-j\\omega n_0}\\sum\\limits_{m=-\\infty}^{\\infty}x(m)e^{-j\\omega m}=e^{-j\\omega n_0}X(e^{j\\omega})$。<br>证毕。'
    },
    {
      q: '已知 $x(n)=a^nu(n)$，$|a|<1$，求其 DTFT。',
      a: '$X(e^{j\\omega})=\\sum\\limits_{n=0}^{\\infty}a^ne^{-j\\omega n}=\\dfrac{1}{1-ae^{-j\\omega}}$，$|a|<1$ 时收敛。<br>也可由 $X(z)=\\dfrac{z}{z-a},\\ |z|>|a|$，令 $z=e^{j\\omega}$ 得到同一结果。'
    },
    {
      q: '已知 $H(z)=\\dfrac{z}{z-0.5}$，判断系统的因果性与稳定性，并求单位脉冲响应 $h(n)$。',
      a: '极点 $z=0.5$，在单位圆内。<br>若 ROC 取 $|z|>0.5$（最外层极点圆外，含 $\\infty$），则系统<b>因果且稳定</b>，$h(n)=0.5^nu(n)$。<br>若 ROC 取 $|z|<0.5$，则系统反因果（不稳定）。<br>题目通常默认取因果稳定解。'
    },
    {
      q: '设 $x(n)$ 为实序列，证明 $|X(e^{j\\omega})|$ 是偶函数。',
      a: '由实序列共轭对称性：$X(e^{j\\omega})=X^*(e^{-j\\omega})$。<br>两边取模：$|X(e^{j\\omega})|=|X^*(e^{-j\\omega})|=|X(e^{-j\\omega})|$。<br>即 $|X(e^{j\\omega})|$ 关于 $\\omega$ 为偶函数，证毕。'
    }
  ],
  pitfalls: [
    'DTFT 存在的前提是绝对可和，$u(n)$ 不满足绝对可和，其 DTFT 含冲激项。',
    'Z 变换不写收敛域（ROC）——这是必扣分项。',
    '共轭对称性中把 $x^*(-n)$ 写成 $x(-n)$，忘记取共轭。',
    '因果稳定判据记混：稳定是 ROC 含单位圆，因果是 ROC 在最外层极点圆外。'
  ]
});

/* ========================= 第 3 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch3',
  num: 3,
  title: '离散傅里叶变换（DFT）',
  subtitle: 'DFT 定义 · 循环卷积 · 共轭对称 · 谱分析',
  weight: 5,
  tags: ['★老师重点', '证明题高发区', '必考'],
  intro: '★ 老师板书中专门用一整块黑板证明 DFT 的共轭性质与频域卷积定理。本章是"时域离散、频域也离散"的关键一步，DFT 的四大性质（循环移位、循环卷积、共轭对称、Parseval）和"用 DFT 计算线性卷积"是必考计算题。',
  outline: [
    '3.1 DFT 的定义及物理意义、与 DTFT/ZT 的关系、隐含周期性',
    '3.2 DFT 的基本性质：线性、循环移位、循环卷积、共轭对称',
    '3.3 频域采样定理',
    '3.4 DFT 的应用：计算线性卷积、谱分析（栅栏效应、泄漏、分辨率）'
  ],
  sections: [
    {
      h: '3.1 DFT 的定义与物理意义',
      body: `<p>设 $x(n)$ 是长度为 $N$ 的有限长序列（$0\\le n\\le N-1$）：</p>
      <div class="formula">$$X(k)=\\mathrm{DFT}[x(n)]=\\sum_{n=0}^{N-1}x(n)W_N^{nk},\\qquad k=0,1,\\dots,N-1$$
      $$x(n)=\\mathrm{IDFT}[X(k)]=\\frac{1}{N}\\sum_{k=0}^{N-1}X(k)W_N^{-nk},\\qquad n=0,1,\\dots,N-1$$</div>
      <p>其中旋转因子 $W_N=e^{-j\\frac{2\\pi}{N}}$。</p>
      <p><b>物理意义——DFT 是 DTFT 在单位圆上的等间隔采样：</b></p>
      <div class="formula">$$X(k)=X(e^{j\\omega})\\Big|_{\\omega=\\frac{2\\pi}{N}k}=X(z)\\Big|_{z=e^{j\\frac{2\\pi}{N}k}}$$</div>
      <p>频率分辨率（谱线间隔）：$\\Delta\\omega=\\dfrac{2\\pi}{N}$，对应模拟频率 $\\Delta f=\\dfrac{f_s}{N}$。</p>
      <p><b>隐含周期性：</b>DFT 对应的是 $x(n)$ 的<b>周期延拓</b>序列 $\\tilde{x}(n)$ 的 DFS 主值序列。$X(k)$ 也以 $N$ 为周期：$X(k+N)=X(k)$。</p>
      <div class="tip"><b>三种变换关系图解（板书）：</b><br>
      $x(n)\\xrightarrow{\\ \\mathrm{DTFT}\\ }X(e^{j\\omega})$（$\\omega$ 连续、以 $2\\pi$ 为周期）<br>
      $x(n)\\xrightarrow{\\ \\mathrm{ZT}\\ }X(z)$（$z$ 平面），且 $X(z)|_{z=e^{j\\omega}}=X(e^{j\\omega})$<br>
      $x(n)\\xrightarrow{\\ \\mathrm{DFT}\\ }X(k)$：在单位圆上以 $2\\pi/N$ 等间隔取 $N$ 点</div>`
    },
    {
      h: '★ 3.2 DFT 的基本性质（板书逐条证明）',
      body: `<p>设 $X_1(k)=\\mathrm{DFT}[x_1(n)]$，$X_2(k)=\\mathrm{DFT}[x_2(n)]$，长度均为 $N$。</p>
      <table class="tbl">
        <tr><th>性质</th><th>时域</th><th>频域</th></tr>
        <tr><td>线性</td><td>$ax_1(n)+bx_2(n)$</td><td>$aX_1(k)+bX_2(k)$</td></tr>
        <tr><td><b>循环移位</b></td><td>$x((n-m))_N R_N(n)$</td><td>$W_N^{mk}X(k)=e^{-j\\frac{2\\pi}{N}mk}X(k)$</td></tr>
        <tr><td>循环卷积</td><td>$x_1(n)\\circledast x_2(n)$</td><td>$X_1(k)X_2(k)$</td></tr>
        <tr><td><b>频域卷积</b></td><td>$x_1(n)x_2(n)$</td><td>$\\dfrac{1}{N}X_1(k)\\circledast X_2(k)$</td></tr>
        <tr><td>共轭</td><td>$x^*(n)$</td><td>$X^*(N-k)$</td></tr>
        <tr><td>共轭反转</td><td>$x^*(N-n)$</td><td>$X^*(k)$</td></tr>
        <tr><td>Parseval</td><td>$\\sum\\limits_{n=0}^{N-1}|x(n)|^2$</td><td>$\\dfrac{1}{N}\\sum\\limits_{k=0}^{N-1}|X(k)|^2$</td></tr>
      </table>

      <h4>★ 性质① 证明：$\\mathrm{DFT}[x^*(n)]=X^*(N-k)$</h4>
      <div class="formula">$$\\mathrm{DFT}[x^*(n)]=\\sum_{n=0}^{N-1}x^*(n)W_N^{nk}=\\Big[\\sum_{n=0}^{N-1}x(n)W_N^{-nk}\\Big]^*=\\Big[\\sum_{n=0}^{N-1}x(n)W_N^{(N-k)n}\\Big]^*=X^*(N-k)$$</div>
      <p>（用到了 $W_N^{-nk}=W_N^{(N-k)n}$，因为 $W_N^{Nn}=1$；特别地 $X(N)=X(0)$）</p>

      <h4>★ 性质② 证明：$\\mathrm{DFT}[x^*(N-n)]=X^*(k)$</h4>
      <div class="formula">$$\\mathrm{DFT}[x^*(N-n)]=\\sum_{n=0}^{N-1}x^*(N-n)W_N^{nk}\\ \\xrightarrow{\\,n'=N-n\\,}\\ \\sum_{n'=1}^{N}x^*(n')W_N^{(N-n')k}=\\sum_{n'=1}^{N}x^*(n')W_N^{-n'k}$$
      $$=\\sum_{n'=0}^{N-1}x^*(n')W_N^{-n'k}=\\Big[\\sum_{n'=0}^{N-1}x(n')W_N^{n'k}\\Big]^*=X^*(k)$$</div>

      <h4>★ 性质③ 证明：$\\mathrm{IDFT}\\big[\\tfrac{1}{N}X_1(k)\\circledast X_2(k)\\big]=x_1(n)\\cdot x_2(n)$（频域卷积定理）</h4>
      <p>其中 $X_1(k)\\circledast X_2(k)=\\sum\\limits_{l=0}^{N-1}X_1(l)X_2\\big((k-l)\\big)_N$。</p>
      <div class="formula">$$\\mathrm{IDFT}\\Big[\\frac{1}{N}X_1(k)\\circledast X_2(k)\\Big]=\\frac{1}{N}\\sum_{k=0}^{N-1}\\Big[\\frac{1}{N}\\sum_{l=0}^{N-1}X_1(l)X_2\\big((k-l)\\big)_NR_N(k)\\Big]W_N^{-nk}$$</div>
      <div class="formula">$$=\\frac{1}{N}\\sum_{l=0}^{N-1}X_1(l)\\underbrace{\\frac{1}{N}\\sum_{k=0}^{N-1}X_2\\big((k-l)\\big)_NR_N(k)W_N^{-nk}}_{\\mathrm{IDFT}\\ \\Rightarrow\\ x_2(n)\\cdot W_N^{-nl}}$$</div>
      <div class="formula">$$=\\frac{1}{N}\\sum_{l=0}^{N-1}\\underbrace{X_1(l)W_N^{-nl}}_{\\mathrm{IDFT}}\\cdot x_2(n)=x_1(n)\\cdot x_2(n)$$</div>
      <div class="tip"><b>结论（口诀）：</b>时域循环卷积 ⇔ 频域相乘；时域相乘 ⇔ 频域循环卷积再除以 $N$。这两条对偶关系是证明题与计算题的绝对重点。</div>`
    },
    {
      h: '★ 循环卷积与线性卷积的关系（必考）',
      body: `<p>设 $x_1(n)$ 长 $N_1$，$x_2(n)$ 长 $N_2$，取 $L$ 点循环卷积：</p>
      <div class="formula">$$y_c(n)=x_1(n)\\circledast_L x_2(n)=\\Big[\\sum_{m=0}^{L-1}x_1(m)x_2\\big((n-m)\\big)_L\\Big]R_L(n)$$</div>
      <p><b>核心结论：</b>循环卷积是线性卷积以 $L$ 为周期的<b>周期延拓</b>的主值序列：</p>
      <div class="formula">$$y_c(n)=\\Big[\\sum_{r=-\\infty}^{\\infty}y_l(n-rL)\\Big]R_L(n)$$</div>
      <p><b>两者相等的充要条件：</b></p>
      <div class="formula">$$L\\ \\ge\\ N_1+N_2-1$$</div>
      <div class="tip"><b>例题：</b>$x_1(n)$ 长 5，$x_2(n)$ 长 4，则需 $L\\ge 5+4-1=8$ 点循环卷积才等于线性卷积。若取 $L=7$，则线性卷积第 8 个值 $y_l(7)$ 会折叠叠加到 $y_l(0)$ 上，造成<b>混叠失真</b>。</div>
      <p><b>用 DFT 计算线性卷积的步骤（快速卷积）：</b></p>
      <ol>
        <li>取 $L\\ge N_1+N_2-1$，通常取 $L=2^m$ 以便用 FFT；</li>
        <li>对 $x_1(n)$、$x_2(n)$ 补零到 $L$ 点，分别做 $L$ 点 DFT 得 $X_1(k)$、$X_2(k)$；</li>
        <li>$Y(k)=X_1(k)X_2(k)$；</li>
        <li>对 $Y(k)$ 做 $L$ 点 IDFT 得 $y(n)$，即线性卷积结果。</li>
      </ol>`
    },
    {
      h: '3.2.5 DFT 的共轭对称性',
      body: `<p>与 DTFT 类似，DFT 也有共轭对称性，但要注意<b>循环反转</b>（$x(N-n)$ 而不是 $x(-n)$）。</p>
      <table class="tbl">
        <tr><th>时域</th><th>频域</th></tr>
        <tr><td>$x_e(n)=\\frac{1}{2}[x(n)+x^*(N-n)]$（循环共轭对称）</td><td>$\\mathrm{Re}[X(k)]$</td></tr>
        <tr><td>$x_o(n)=\\frac{1}{2}[x(n)-x^*(N-n)]$（循环共轭反对称）</td><td>$j\\,\\mathrm{Im}[X(k)]$</td></tr>
        <tr><td>$\\mathrm{Re}[x(n)]$</td><td>$X_{ep}(k)=\\frac{1}{2}[X(k)+X^*(N-k)]$</td></tr>
        <tr><td>$j\\,\\mathrm{Im}[x(n)]$</td><td>$X_{op}(k)=\\frac{1}{2}[X(k)-X^*(N-k)]$</td></tr>
      </table>
      <p><b>实序列 DFT 的对称性（考点）：</b>若 $x(n)$ 为实序列，则</p>
      <div class="formula">$$X(k)=X^*(N-k),\\qquad |X(k)|=|X(N-k)|$$</div>
      <p>即幅度关于 $N/2$ 对称，只需计算前 $N/2+1$ 个点。</p>`
    },
    {
      h: '★ 3.4.2 用 DFT 做谱分析（高频概念题）',
      body: `<p>用 DFT 对连续信号做谱分析时，三个核心概念：</p>
      <table class="tbl">
        <tr><th>现象</th><th>成因</th><th>抑制方法</th></tr>
        <tr><td><b>栅栏效应</b></td><td>DFT 只在 $\\omega_k=\\frac{2\\pi}{N}k$ 处取值，谱线之间的信息被"栅栏"挡住</td><td>① <b>补零</b>增加 $N$；② 内插</td></tr>
        <tr><td><b>频谱泄漏</b></td><td>时域截断（加矩形窗）使谱线能量扩散到旁瓣</td><td>加旁瓣小的窗（汉宁、海明、布莱克曼）</td></tr>
        <tr><td><b>谱间干扰</b></td><td>旁瓣泄漏导致弱信号被强信号旁瓣淹没</td><td>选旁瓣衰减大的窗函数</td></tr>
      </table>
      <p><b>三个基本参数的换算（必考计算）：</b></p>
      <div class="formula">$$\\text{频率分辨率}\\ F=\\frac{f_s}{N}=\\frac{1}{NT}=\\frac{1}{T_p},\\qquad \\text{最小记录时间}\\ T_p=\\frac{1}{F}$$</div>
      <p>其中 $T_p=NT$ 为记录时间，$N$ 为采样点数。</p>
      <div class="tip"><b>典型考题：</b>要求谱分辨率 $F=20\\,\\mathrm{Hz}$，信号最高频率 $f_c=2\\,\\mathrm{kHz}$。<br>
      ① 最小记录时间 $T_p=1/F=0.05\\,\\mathrm{s}$；<br>
      ② 由采样定理 $f_s\\ge 2f_c=4\\,\\mathrm{kHz}$，最少点数 $N=f_s/F=4000/20=200$；<br>
      ③ 最大采样间隔 $T=1/f_s=1/4000=0.25\\,\\mathrm{ms}$。</div>`
    }
  ],
  examples: [
    {
      q: '<b>证明</b> $\\mathrm{DFT}[x^*(n)]=X^*(N-k)$。',
      a: '$\\mathrm{DFT}[x^*(n)]=\\sum\\limits_{n=0}^{N-1}x^*(n)W_N^{nk}=\\Big[\\sum\\limits_{n=0}^{N-1}x(n)W_N^{-nk}\\Big]^*$。<br>由 $W_N^{-nk}=W_N^{Nnk}\\cdot W_N^{-nk}=W_N^{(N-k)n}$，得<br>$=\\Big[\\sum\\limits_{n=0}^{N-1}x(n)W_N^{(N-k)n}\\Big]^*=X^*(N-k)$。证毕。'
    },
    {
      q: '已知 $x_1(n)=\\{1,2,3,4\\}$，$x_2(n)=\\{1,1,1\\}$（$n=0$ 起始），求 $L=4$ 的循环卷积。',
      a: '循环卷积：$y_c(n)=\\sum\\limits_{m=0}^{3}x_1(m)x_2((n-m))_4$<br>线性卷积 $y_l=\\{1,3,6,9,8,4\\}$（长 6）。<br>$L=4$ 循环卷积 = 线性卷积以 4 为周期延拓后取主值：<br>$y_c(0)=y_l(0)+y_l(4)=1+8=9$<br>$y_c(1)=y_l(1)+y_l(5)=3+4=7$<br>$y_c(2)=y_l(2)=6$<br>$y_c(3)=y_l(3)=9$<br><b>$y_c(n)=\\{9,7,6,9\\}$</b>。因为 $L=4<6$，发生了混叠，与线性卷积不同。'
    },
    {
      q: '用 DFT 计算 $x_1(n)$（长 8）与 $x_2(n)$（长 5）的线性卷积，最少需要多少点 DFT？',
      a: '$L\\ge N_1+N_2-1=8+5-1=12$。<br>实际取 $L=16=2^4$（2 的整数次幂，便于用 FFT），最少点数理论值为 <b>12</b>。'
    }
  ],
  pitfalls: [
    '循环移位写成线性移位——循环移位是 $x((n-m))_N R_N(n)$，出界要"绕回"。',
    '共轭反转用 $x(-n)$ 而不是 $x(N-n)$。',
    '循环卷积与线性卷积的相等条件记错（是 $L\\ge N_1+N_2-1$）。',
    '频域卷积定理漏掉系数 $\\frac{1}{N}$。'
  ]
});
