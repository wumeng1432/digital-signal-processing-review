/* ============================================================
   数字信号处理复习站 — 教材精讲 第 4~7 章
   ============================================================ */
window.DSP_CHAPTERS = window.DSP_CHAPTERS || [];

/* ========================= 第 4 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch4',
  num: 4,
  title: '快速傅里叶变换（FFT）',
  subtitle: '基 2 DIT/DIF · 蝶形运算 · 运算量',
  weight: 4,
  tags: ['画图题常考', '运算量计算'],
  intro: 'FFT 不是新的变换，而是 DFT 的快速算法。期末常考：① 直接 DFT 与 FFT 运算量对比；② 画 N=8 的基 2 蝶形图；③ 倒序（位反转）排列；④ 旋转因子的确定。',
  outline: [
    '4.2 基 2 FFT 算法：DIT-FFT、DIF-FFT、运算量比较',
    '4.2.4 DIT-FFT 的运算规律与编程思想',
    '4.2.6 IDFT 的高效算法',
    '4.3 进一步减少运算量的措施'
  ],
  sections: [
    {
      h: '4.1 直接计算 DFT 的运算量',
      body: `<p>直接计算 $N$ 点 DFT：$X(k)=\\sum\\limits_{n=0}^{N-1}x(n)W_N^{nk}$</p>
      <ul>
        <li><b>复数乘法</b>：$N^2$ 次</li>
        <li><b>复数加法</b>：$N(N-1)$ 次</li>
      </ul>
      <p>当 $N$ 很大时运算量巨大（如 $N=1024$ 需约 100 万次复乘），因此必须寻找快速算法。</p>`
    },
    {
      h: '★ 4.2.2 时域抽取法基 2 FFT（DIT-FFT）原理',
      body: `<p>设 $N=2^M$。把 $x(n)$ 按 $n$ 的<b>奇偶</b>分成两组：</p>
      <div class="formula">$$x_1(r)=x(2r),\\qquad x_2(r)=x(2r+1),\\qquad r=0,1,\\dots,\\frac{N}{2}-1$$</div>
      <p>则</p>
      <div class="formula">$$X(k)=\\sum_{r=0}^{N/2-1}x(2r)W_N^{2rk}+\\sum_{r=0}^{N/2-1}x(2r+1)W_N^{(2r+1)k}=X_1(k)+W_N^{k}X_2(k)$$</div>
      <p>其中 $W_N^2=W_{N/2}$，$X_1(k)$、$X_2(k)$ 分别是 $x_1(r)$、$x_2(r)$ 的 $N/2$ 点 DFT。</p>
      <p>利用周期性 $X_1(k+N/2)=X_1(k)$、$X_2(k+N/2)=X_2(k)$ 及 $W_N^{k+N/2}=-W_N^k$，得<b>蝶形运算</b>：</p>
      <div class="formula">$$\\begin{cases}X(k)=X_1(k)+W_N^kX_2(k)\\\\[4pt] X\\big(k+\\tfrac{N}{2}\\big)=X_1(k)-W_N^kX_2(k)\\end{cases},\\qquad k=0,1,\\dots,\\frac{N}{2}-1$$</div>
      <p><b>蝶形运算单元</b>：两个输入 → 一次复乘 + 两次复加，输出两个值。</p>`
    },
    {
      h: '★ 4.2.3 运算量比较（必考计算）',
      body: `<p>$N=2^M$ 点 DIT-FFT 共分 $M=\\log_2 N$ 级，每级有 $N/2$ 个蝶形，每个蝶形一次复乘两次复加。</p>
      <table class="tbl">
        <tr><th>算法</th><th>复数乘法</th><th>复数加法</th></tr>
        <tr><td>直接 DFT</td><td>$N^2$</td><td>$N(N-1)$</td></tr>
        <tr><td>基 2 FFT</td><td>$\\dfrac{N}{2}\\log_2 N$</td><td>$N\\log_2 N$</td></tr>
      </table>
      <p><b>加速比：</b></p>
      <div class="formula">$$\\frac{N^2}{\\frac{N}{2}\\log_2 N}=\\frac{2N}{\\log_2 N}$$</div>
      <div class="tip"><b>例题：</b>$N=16$ 时，直接 DFT 需 $16^2=256$ 次复乘；FFT 需 $\\dfrac{16}{2}\\times4=32$ 次复乘。加速比 $=256/32=8$ 倍。<br>$N=1024$ 时：DFT 需 $1024^2\\approx1.05\\times10^6$ 次，FFT 需 $512\\times10=5120$ 次，加速比约 205 倍。</div>`
    },
    {
      h: '★ 4.2.4 DIT-FFT 的运算规律与编程思想',
      body: `<p>三条核心规律（画图题必须掌握）：</p>
      <ol>
        <li><b>输入倒序（位反转）</b>：输入序列按二进制位反转顺序排列。<br>
        例 $N=8$：下标 $0\\sim7$ 的二进制 $000,001,010,011,100,101,110,111$，位反转后 $000,100,010,110,001,101,011,111$，即十进制顺序为 <b>$0,4,2,6,1,5,3,7$</b>。</li>
        <li><b>输出顺序</b>：DIT 法输出为自然顺序 $X(0),X(1),\\dots,X(N-1)$。</li>
        <li><b>旋转因子规律</b>：第 $L$ 级（$L=1,2,\\dots,M$）蝶形的两节点"间距"为 $2^{L-1}$，旋转因子为 $W_N^{\\,k\\cdot2^{M-L}}$，其中 $k$ 为组内序号。</li>
      </ol>
      <p><b>$N=8$ 基 2 DIT-FFT 蝶形图结构：</b></p>
      <ul>
        <li>共 $M=\\log_2 8=3$ 级，每级 $N/2=4$ 个蝶形，共 12 个蝶形；</li>
        <li>第 1 级：间距 1，旋转因子全为 $W_8^0=1$；</li>
        <li>第 2 级：间距 2，旋转因子 $W_8^0,\\ W_8^2=-j$（交替）；</li>
        <li>第 3 级：间距 4，旋转因子 $W_8^0,W_8^1,W_8^2,W_8^3$。</li>
      </ul>
      <p><b>旋转因子 $W_8^k$ 常用值：</b></p>
      <div class="formula">$$W_8^0=1,\\quad W_8^1=\\frac{\\sqrt2}{2}(1-j),\\quad W_8^2=-j,\\quad W_8^3=-\\frac{\\sqrt2}{2}(1+j)$$</div>
      <p>对称性：$W_N^{k+N/2}=-W_N^k$（可省一半存储与计算）。</p>`
    },
    {
      h: '4.2.5 频域抽取法基 2 FFT（DIF-FFT）',
      body: `<p>把 $x(n)$ 分成前后两半，在频域按奇偶抽取。与 DIT 的<b>对偶</b>关系：</p>
      <table class="tbl">
        <tr><th></th><th>DIT-FFT</th><th>DIF-FFT</th></tr>
        <tr><td>输入</td><td>倒序</td><td>自然序</td></tr>
        <tr><td>输出</td><td>自然序</td><td>倒序</td></tr>
        <tr><td>抽取对象</td><td>时域按奇偶</td><td>频域按奇偶</td></tr>
      </table>
      <p>蝶形结构（DIF）：先做加减，再乘旋转因子。</p>
      <div class="formula">$$\\begin{cases}x_1(n)=x(n)+x\\big(n+\\tfrac{N}{2}\\big)\\\\[4pt] x_2(n)=\\big[x(n)-x\\big(n+\\tfrac{N}{2}\\big)\\big]W_N^n\\end{cases}$$</div>`
    },
    {
      h: '4.2.6 IDFT 的高效算法',
      body: `<p>利用共轭性质，IDFT 可以直接调用 FFT 程序：</p>
      <div class="formula">$$x(n)=\\mathrm{IDFT}[X(k)]=\\frac{1}{N}\\Big[\\mathrm{DFT}\\big[X^*(k)\\big]\\Big]^*=\\frac{1}{N}\\big\\{\\mathrm{FFT}[X^*(k)]\\big\\}^*$$</div>
      <p>步骤：① 对 $X(k)$ 取共轭；② 做 FFT；③ 再取共轭并除以 $N$。</p>`
    }
  ],
  examples: [
    {
      q: '计算 $N=16$ 时直接 DFT 与基 2 FFT 的复数乘法次数，并求加速比。',
      a: '直接 DFT：$N^2=16^2=256$ 次复乘。<br>基 2 FFT：$\\dfrac{N}{2}\\log_2N=\\dfrac{16}{2}\\times4=32$ 次复乘。<br>加速比 $=256/32=8$ 倍。'
    },
    {
      q: '写出 $N=8$ 时 DIT-FFT 的输入倒序排列。',
      a: '原顺序 $0,1,2,3,4,5,6,7$，二进制 $000,001,010,011,100,101,110,111$；<br>位反转得 $000,100,010,110,001,101,011,111$；<br>对应十进制 <b>$0,4,2,6,1,5,3,7$</b>。'
    }
  ],
  pitfalls: [
    'FFT 只是 DFT 的快速算法，结果与 DFT 完全相同，不是近似。',
    '倒序排列搞错（是二进制位反转，不是倒着数）。',
    'DIT 与 DIF 的输入/输出顺序记反。'
  ]
});

/* ========================= 第 5 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch5',
  num: 5,
  title: '时域离散系统的网络结构',
  subtitle: 'IIR 三种结构 · FIR 四种结构 · 流图',
  weight: 3,
  tags: ['画图题常考'],
  intro: '本章主要考"由系统函数画结构流图"和"由流图写系统函数/差分方程"。重点掌握直接 I 型、直接 II 型（典范型）、级联型、并联型，以及 FIR 的线性相位结构。',
  outline: [
    '5.2 用信号流图表示网络结构',
    '5.3 IIR 系统基本网络结构：直接 I 型、直接 II 型、级联型、并联型',
    '5.4 FIR 系统基本网络结构',
    '5.5 FIR 线性相位结构',
    '5.6 FIR 频率采样结构'
  ],
  sections: [
    {
      h: '5.3 IIR 系统的四种网络结构',
      body: `<p>IIR 系统函数：$H(z)=\\dfrac{\\sum\\limits_{m=0}^{M}b_mz^{-m}}{1+\\sum\\limits_{k=1}^{N}a_kz^{-k}}$</p>
      <table class="tbl">
        <tr><th>结构</th><th>特点</th><th>延迟单元数</th></tr>
        <tr><td><b>直接 I 型</b></td><td>先实现零点部分（$\\sum b_mz^{-m}$），再实现极点部分；级联两个网络</td><td>$M+N$</td></tr>
        <tr><td><b>直接 II 型（典范型）</b></td><td>把两个延迟链合并共用；<b>延迟单元最少</b></td><td>$\\max(M,N)$</td></tr>
        <tr><td><b>级联型</b></td><td>分解为多个一阶/二阶子系统的乘积；<b>便于调整零极点</b></td><td>视分解而定</td></tr>
        <tr><td><b>并联型</b></td><td>分解为部分分式之和；<b>误差累积小、运算速度快</b></td><td>视分解而定</td></tr>
      </table>
      <p><b>直接 I 型差分方程：</b></p>
      <div class="formula">$$y(n)=\\sum_{m=0}^{M}b_mx(n-m)-\\sum_{k=1}^{N}a_ky(n-k)$$</div>
      <div class="tip"><b>常考：</b>给出 $H(z)=\\dfrac{1+2z^{-1}}{1-0.5z^{-1}+0.25z^{-2}}$，要求画出直接 II 型流图。注意直接 II 型中，反馈部分（极点）在前、前馈部分（零点）在后，共用延迟链。</div>`
    },
    {
      h: '5.4 FIR 系统的基本网络结构',
      body: `<p>FIR 系统：$H(z)=\\sum\\limits_{n=0}^{N-1}h(n)z^{-n}$（无反馈，总是稳定）</p>
      <ul>
        <li><b>直接型（横截型/卷积型）</b>：$N-1$ 个延迟单元，$N$ 个乘法器；</li>
        <li><b>级联型</b>：分解为一阶/二阶因式的乘积，便于控制零点；</li>
        <li><b>频率采样型</b>：由 $H(k)$ 实现，便于频率采样法设计的滤波器；</li>
        <li><b>线性相位结构</b>：利用 $h(n)=\\pm h(N-1-n)$ 的对称性，<b>乘法次数减半</b>。</li>
      </ul>`
    },
    {
      h: '★ 5.5 FIR 线性相位结构',
      body: `<p>当 $h(n)$ 满足偶对称 $h(n)=h(N-1-n)$ 或奇对称 $h(n)=-h(N-1-n)$ 时，可把对称的系数合并：</p>
      <div class="formula">$$y(n)=\\sum_{k=0}^{\\frac{N}{2}-1}h(k)\\big[x(n-k)\\pm x(n-N+1+k)\\big]\\quad(N\\text{ 为偶数})$$</div>
      <p>乘法次数由 $N$ 次减少到约 $N/2$ 次。</p>`
    }
  ],
  examples: [
    {
      q: '已知 $H(z)=\\dfrac{1+2z^{-1}}{1-0.5z^{-1}+0.25z^{-2}}$，写出差分方程。',
      a: '交叉相乘：$Y(z)(1-0.5z^{-1}+0.25z^{-2})=X(z)(1+2z^{-1})$<br>即 $Y(z)=0.5z^{-1}Y(z)-0.25z^{-2}Y(z)+X(z)+2z^{-1}X(z)$<br><b>$y(n)=0.5y(n-1)-0.25y(n-2)+x(n)+2x(n-1)$</b>'
    },
    {
      q: 'FIR 滤波器 $h(n)=\\{1,2,3,2,1\\}$，画出直接型结构并说明是否为线性相位。',
      a: '$h(0)=1=h(4)$，$h(1)=2=h(3)$，$h(2)=3$，满足 $h(n)=h(N-1-n)$（$N=5$），<b>是线性相位 FIR（第一类，偶对称、N 为奇数）</b>。<br>直接型：4 个延迟单元 $z^{-1}$，5 个乘法器。<br>线性相位结构：乘法次数减为 3 次。'
    }
  ],
  pitfalls: [
    '直接 II 型的延迟单元数写成 $M+N$（应为 $\\max(M,N)$）。',
    '画流图时把反馈支路的符号搞错。',
    'FIR 线性相位结构的对称合并漏掉符号（奇对称时要相减）。'
  ]
});

/* ========================= 第 6 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch6',
  num: 6,
  title: '无限脉冲响应数字滤波器的设计',
  subtitle: '巴特沃斯 · 脉冲响应不变法 · 双线性变换法',
  weight: 5,
  tags: ['计算题必考', '设计题'],
  intro: 'IIR 设计是期末计算题的重灾区。核心路线：① 由数字指标 → 模拟指标（含频率预畸变）；② 设计模拟滤波器 $H_a(s)$（巴特沃斯最常考）；③ 用脉冲响应不变法或双线性变换法映射到 $H(z)$。',
  outline: [
    '6.1 数字滤波器的基本概念与技术指标',
    '6.2 模拟滤波器设计：巴特沃斯、切比雪夫',
    '6.3 脉冲响应不变法',
    '6.4 双线性变换法',
    '6.5 数字高通、带通、带阻滤波器的设计'
  ],
  sections: [
    {
      h: '6.1 数字滤波器技术指标',
      body: `<p>低通滤波器指标：通带截止频率 $\\omega_p$、通带最大衰减 $\\alpha_p$、阻带截止频率 $\\omega_s$、阻带最小衰减 $\\alpha_s$。</p>
      <div class="formula">$$\\alpha_p=-20\\lg\\big|H(e^{j\\omega_p})\\big|\\ (\\mathrm{dB}),\\qquad \\alpha_s=-20\\lg\\big|H(e^{j\\omega_s})\\big|\\ (\\mathrm{dB})$$</div>
      <p>过渡带宽度 $\\Delta\\omega=\\omega_s-\\omega_p$。</p>`
    },
    {
      h: '★ 6.2 巴特沃斯低通滤波器（最常考）',
      body: `<p><b>幅度平方函数：</b></p>
      <div class="formula">$$\\big|H_a(j\\Omega)\\big|^2=\\frac{1}{1+\\left(\\dfrac{\\Omega}{\\Omega_c}\\right)^{2N}}$$</div>
      <p>特点：$\\Omega=0$ 处最平坦（最大平坦），$\\Omega=\\Omega_c$ 处幅度下降 3 dB（$|H|^2=1/2$），随 $N$ 增大过渡带变陡。</p>
      <p><b>设计步骤：</b></p>
      <ol>
        <li>由指标求阶数 $N$ 和 3 dB 截止频率 $\\Omega_c$：
        <div class="formula">$$N\\ge\\frac{\\lg\\big(10^{\\alpha_s/10}-1\\big)-\\lg\\big(10^{\\alpha_p/10}-1\\big)}{2\\lg(\\Omega_s/\\Omega_p)}$$</div>
        取 $N$ 为大于等于该值的<b>最小整数</b>，再回代求 $\\Omega_c$。</li>
        <li>求极点：$s_k=\\Omega_c\\,e^{j\\pi\\left(\\frac{2k+1}{2N}+\\frac{1}{2}\\right)}$，$k=0,1,\\dots,N-1$（左半平面 $N$ 个极点）。</li>
        <li>由左半平面极点构成 $H_a(s)=\\dfrac{\\Omega_c^N}{\\prod\\limits_{k=0}^{N-1}(s-s_k)}$。</li>
      </ol>
      <div class="tip"><b>常见 N=1,2,3 的归一化巴特沃斯分母多项式：</b><br>
      $N=1$：$s+1$<br>
      $N=2$：$s^2+\\sqrt2 s+1$<br>
      $N=3$：$s^3+2s^2+2s+1=(s+1)(s^2+s+1)$<br>
      $N=4$：$(s^2+0.7654s+1)(s^2+1.8478s+1)$</div>`
    },
    {
      h: '★ 6.3 脉冲响应不变法',
      body: `<p><b>映射关系：</b>对 $H_a(s)$ 做部分分式展开，$H_a(s)=\\sum\\limits_{k}\\dfrac{A_k}{s-s_k}$，则</p>
      <div class="formula">$$H(z)=\\sum_{k}\\frac{A_k}{1-e^{s_kT}z^{-1}},\\qquad \\text{极点映射 } z_k=e^{s_kT}$$</div>
      <p><b>优点：</b>时域逼近好（$h(n)=h_a(nT)$），频率映射 $\\omega=\\Omega T$ 是线性的。</p>
      <p><b>缺点：</b>存在<b>频谱混叠</b>，只适合设计低通和带通滤波器；高通、带阻不能用。</p>
      <p><b>稳定性：</b>$\\mathrm{Re}[s_k]<0\\ \\Rightarrow\\ |z_k|=|e^{s_kT}|=e^{\\mathrm{Re}[s_k]T}<1$，左半平面极点映射到单位圆内，<b>保持稳定</b>。</p>`
    },
    {
      h: '★★ 6.4 双线性变换法（考试最常考）',
      body: `<p><b>映射关系：</b></p>
      <div class="formula">$$s=\\frac{2}{T}\\cdot\\frac{1-z^{-1}}{1+z^{-1}}\\qquad\\Longleftrightarrow\\qquad z=\\frac{2/T+s}{2/T-s}$$</div>
      <p>将整个 $s$ 左半平面映射到 $z$ 平面单位圆内，$j\\Omega$ 轴映射到单位圆上，<b>不存在混叠</b>。</p>
      <p><b>频率预畸变（关键步骤）：</b>映射是非线性的</p>
      <div class="formula">$$\\Omega=\\frac{2}{T}\\tan\\left(\\frac{\\omega}{2}\\right)$$</div>
      <p>因此必须先把数字指标 $\\omega$ 用上式变换为模拟指标 $\\Omega$，再设计 $H_a(s)$。</p>
      <p><b>设计步骤（务必背熟）：</b></p>
      <ol>
        <li>数字指标 $\\omega_p,\\omega_s$ → 模拟指标：$\\Omega_p=\\dfrac{2}{T}\\tan\\dfrac{\\omega_p}{2}$，$\\Omega_s=\\dfrac{2}{T}\\tan\\dfrac{\\omega_s}{2}$；</li>
        <li>设计模拟低通 $H_a(s)$（巴特沃斯/切比雪夫）；</li>
        <li>代入 $s=\\dfrac{2}{T}\\cdot\\dfrac{1-z^{-1}}{1+z^{-1}}$，化简得 $H(z)$。</li>
      </ol>
      <div class="tip"><b>两种方法的对比（必考简答）：</b>
      <table class="tbl">
        <tr><th></th><th>脉冲响应不变法</th><th>双线性变换法</th></tr>
        <tr><td>频率映射</td><td>线性 $\\omega=\\Omega T$</td><td>非线性（预畸变）</td></tr>
        <tr><td>混叠</td><td>有混叠</td><td>无混叠</td></tr>
        <tr><td>适用范围</td><td>低通、带通</td><td>低通、高通、带通、带阻</td></tr>
        <tr><td>时域逼近</td><td>好</td><td>较差</td></tr>
      </table></div>`
    },
    {
      h: '6.5 数字高通/带通/带阻的设计思路',
      body: `<p>方法一：先设计模拟低通 → 频率变换成模拟高通/带通/带阻 → 再数字化（双线性变换）。</p>
      <p>方法二：直接用双线性变换把数字高通指标预畸变后，做模拟高通设计。</p>
      <p><b>模拟域频率变换公式：</b></p>
      <ul>
        <li>低通 → 高通：$s=\\dfrac{\\Omega_p\\Omega_p'}{s'}$</li>
        <li>低通 → 带通：$s=\\dfrac{s'^2+\\Omega_0^2}{Bs'}$，$\\Omega_0=\\sqrt{\\Omega_1\\Omega_3}$，$B=\\Omega_3-\\Omega_1$</li>
        <li>低通 → 带阻：$s=\\dfrac{Bs'}{s'^2+\\Omega_0^2}$</li>
      </ul>`
    }
  ],
  examples: [
    {
      q: '已知模拟滤波器 $H_a(s)=\\dfrac{1}{s^2+3s+2}$，用双线性变换法（$T=2$）求 $H(z)$。',
      a: '$T=2$ 时 $s=2\\cdot\\dfrac{1-z^{-1}}{1+z^{-1}}=\\dfrac{1-z^{-1}}{1+z^{-1}}$。<br>代入 $s^2+3s+2$：<br>$s^2=\\dfrac{(1-z^{-1})^2}{(1+z^{-1})^2}$，$3s=\\dfrac{3(1-z^{-1})}{1+z^{-1}}$<br>通分后分子 $=(1-z^{-1})^2+3(1-z^{-1})(1+z^{-1})+2(1+z^{-1})^2$<br>$=1-2z^{-1}+z^{-2}+3-3z^{-2}+2+4z^{-1}+2z^{-2}=6+2z^{-1}+0\\cdot z^{-2}$<br>分母 $=(1+z^{-1})^2$<br>故 $H(z)=\\dfrac{(1+z^{-1})^2}{6+2z^{-1}}=\\dfrac{1+2z^{-1}+z^{-2}}{6+2z^{-1}}$<br>整理：$H(z)=\\dfrac{1+2z^{-1}+z^{-2}}{6+2z^{-1}}$'
    },
    {
      q: '用双线性变换法设计一个数字低通滤波器，$\\omega_p=0.2\\pi$，$T=1$，求对应的模拟角频率 $\\Omega_p$。',
      a: '$\\Omega_p=\\dfrac{2}{T}\\tan\\dfrac{\\omega_p}{2}=2\\tan(0.1\\pi)=2\\times0.3249=0.6498\\,\\mathrm{rad/s}$。<br>注意：<b>必须先做预畸变</b>，不能直接用 $\\Omega_p=\\omega_p/T$。'
    }
  ],
  pitfalls: [
    '双线性变换忘记频率预畸变，直接用 $\\Omega=\\omega/T$。',
    '脉冲响应不变法用于高通/带阻设计（会产生严重混叠）。',
    '巴特沃斯阶数取整时忘记"向上取整"。',
    '部分分式展开时 $H(z)$ 的分母写成 $1-e^{s_kT}z$（应为 $z^{-1}$）。'
  ]
});

/* ========================= 第 7 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch7',
  num: 7,
  title: '有限脉冲响应数字滤波器的设计',
  subtitle: '线性相位条件 · 窗函数法 · 频率采样法',
  weight: 5,
  tags: ['计算题必考', '设计题'],
  intro: 'FIR 设计的核心优势是<b>可实现严格线性相位</b>。期末重点：① 线性相位的充要条件与四种类型；② 窗函数法的设计步骤与窗长计算；③ 常用窗函数的过渡带宽度与阻带衰减对照表。',
  outline: [
    '7.1 线性相位 FIR 数字滤波器的条件和特点',
    '7.2 窗函数法设计 FIR 滤波器',
    '7.3 频率采样法',
    '7.4 等波纹最佳逼近法',
    '7.5 IIR 与 FIR 数字滤波器的比较'
  ],
  sections: [
    {
      h: '★ 7.1 线性相位的条件与四种类型',
      body: `<p>FIR 具有严格线性相位的<b>充要条件</b>：单位脉冲响应满足对称性</p>
      <div class="formula">$$h(n)=h(N-1-n)\\quad(\\text{偶对称})\\qquad\\text{或}\\qquad h(n)=-h(N-1-n)\\quad(\\text{奇对称})$$</div>
      <p>此时相位为 $\\varphi(\\omega)=-\\dfrac{N-1}{2}\\omega$（严格线性）。</p>
      <p><b>四种类型（$h(n)$ 对称性 × $N$ 奇偶）：</b></p>
      <table class="tbl">
        <tr><th>类型</th><th>对称性</th><th>$N$</th><th>可设计的滤波器</th></tr>
        <tr><td>第 I 类</td><td>偶对称</td><td>奇数</td><td>低通、高通、带通、带阻（全都能）</td></tr>
        <tr><td>第 II 类</td><td>偶对称</td><td>偶数</td><td>低通、带通（$\\omega=\\pi$ 处必为零，<b>不能做高通、带阻</b>）</td></tr>
        <tr><td>第 III 类</td><td>奇对称</td><td>奇数</td><td>带通、微分器、希尔伯特变换器（$\\omega=0,\\pi$ 处为零）</td></tr>
        <tr><td>第 IV 类</td><td>奇对称</td><td>偶数</td><td>高通、带通、微分器（$\\omega=0$ 处为零，不能做低通）</td></tr>
      </table>
      <div class="tip"><b>考试常考：</b>给出 $h(n)$，判断是否为线性相位、属于哪一类、能设计什么滤波器。<br>例：$h(n)=\\{1.5,2,3,3,2,1.5\\}$，$N=6$ 偶对称 → 第 II 类，<b>不能设计高通</b>。</div>`
    },
    {
      h: '★★ 7.2 窗函数法设计 FIR 滤波器',
      body: `<p><b>设计原理：</b>用理想滤波器 $h_d(n)$ 乘以窗函数 $w(n)$ 截断：</p>
      <div class="formula">$$h(n)=h_d(n)\\cdot w(n),\\qquad n=0,1,\\dots,N-1$$</div>
      <p>理想线性相位低通：</p>
      <div class="formula">$$h_d(n)=\\frac{\\sin\\big[\\omega_c(n-\\alpha)\\big]}{\\pi(n-\\alpha)},\\qquad \\alpha=\\frac{N-1}{2},\\quad \\omega_c=\\frac{\\omega_p+\\omega_s}{2}$$</div>
      <p><b>加窗的影响：</b>理想 $H_d(e^{j\\omega})$ 与窗谱 $W(e^{j\\omega})$ 做卷积 → 产生<b>过渡带</b>与<b>吉布斯现象（通带波纹、阻带旁瓣）</b>。</p>
      <p><b>常用窗函数对照表（必背）：</b></p>
      <table class="tbl">
        <tr><th>窗函数</th><th>表达式</th><th>过渡带宽度</th><th>最小阻带衰减</th></tr>
        <tr><td>矩形窗</td><td>$R_N(n)$</td><td>$\\dfrac{4\\pi}{N}$</td><td>$-13\\,\\mathrm{dB}$</td></tr>
        <tr><td>三角窗（Bartlett）</td><td>$1-\\dfrac{|2n-N+1|}{N}$</td><td>$\\dfrac{8\\pi}{N}$</td><td>$-25\\,\\mathrm{dB}$</td></tr>
        <tr><td>汉宁窗（Hanning）</td><td>$0.5-0.5\\cos\\dfrac{2\\pi n}{N-1}$</td><td>$\\dfrac{8\\pi}{N}$</td><td>$-31\\,\\mathrm{dB}$</td></tr>
        <tr><td>海明窗（Hamming）</td><td>$0.54-0.46\\cos\\dfrac{2\\pi n}{N-1}$</td><td>$\\dfrac{8\\pi}{N}$</td><td>$-41\\,\\mathrm{dB}$</td></tr>
        <tr><td>布莱克曼窗</td><td>$0.42-0.5\\cos\\dfrac{2\\pi n}{N-1}+0.08\\cos\\dfrac{4\\pi n}{N-1}$</td><td>$\\dfrac{12\\pi}{N}$</td><td>$-57\\,\\mathrm{dB}$</td></tr>
        <tr><td>凯泽窗（Kaiser）</td><td>$\\dfrac{I_0\\big[\\beta\\sqrt{1-(1-2n/(N-1))^2}\\big]}{I_0(\\beta)}$</td><td>可调</td><td>可调</td></tr>
      </table>
      <p><b>规律：</b>阻带衰减越大 → 过渡带越宽（主瓣越宽）→ 所需 $N$ 越大。这是"主瓣宽度"与"旁瓣衰减"的矛盾。</p>
      <p><b>窗函数法设计步骤（背下来）：</b></p>
      <ol>
        <li>由阻带衰减 $\\alpha_s$ 选择窗函数类型（查表）；</li>
        <li>由过渡带宽度 $\\Delta\\omega=\\omega_s-\\omega_p$ 确定窗长 $N$：$N\\approx\\dfrac{C\\pi}{\\Delta\\omega}$（$C=4,8,12$ 对应矩形、汉宁/海明、布莱克曼）；</li>
        <li>确定 $\\omega_c=\\dfrac{\\omega_p+\\omega_s}{2}$、$\\alpha=\\dfrac{N-1}{2}$，求 $h_d(n)$；</li>
        <li>加窗得 $h(n)=h_d(n)w(n)$；</li>
        <li>验证 $H(e^{j\\omega})$ 是否满足指标。</li>
      </ol>
      <div class="tip"><b>典型例题：</b>$\\omega_p=0.2\\pi$，$\\omega_s=0.3\\pi$，$\\alpha_s=40\\,\\mathrm{dB}$。<br>
      ① 选窗：$40\\,\\mathrm{dB}$ → 海明窗（$-41\\,\\mathrm{dB}$）；<br>
      ② $\\Delta\\omega=0.1\\pi$，海明窗 $N\\approx\\dfrac{8\\pi}{0.1\\pi}=80$，取 $N=81$（奇数保证第一类线性相位）；<br>
      ③ $\\omega_c=0.25\\pi$，$\\alpha=40$；<br>
      ④ $h_d(n)=\\dfrac{\\sin[0.25\\pi(n-40)]}{\\pi(n-40)}$，$h(n)=h_d(n)\\cdot w(n)$。</div>`
    },
    {
      h: '7.3 频率采样法',
      body: `<p>对理想频响 $H_d(e^{j\\omega})$ 在 $\\omega_k=\\dfrac{2\\pi}{N}k$ 处采样得 $H(k)$，再内插：</p>
      <div class="formula">$$H(z)=\\frac{1-z^{-N}}{N}\\sum_{k=0}^{N-1}\\frac{H(k)}{1-W_N^{-k}z^{-1}}$$</div>
      <p>过渡带可通过在过渡带内设置过渡采样点来改善；线性相位约束：$H(k)$ 需满足幅度对称、相位 $\\theta(k)=-\\dfrac{N-1}{2}\\cdot\\dfrac{2\\pi}{N}k$。</p>`
    },
    {
      h: '★ 7.5 IIR 与 FIR 数字滤波器的比较（必考简答）',
      body: `<table class="tbl">
        <tr><th>比较项</th><th>IIR</th><th>FIR</th></tr>
        <tr><td>相位</td><td>难以实现线性相位</td><td><b>可实现严格线性相位</b></td></tr>
        <tr><td>阶数/运算量</td><td>相同指标下阶数低、运算量小、经济</td><td>阶数高、运算量大</td></tr>
        <tr><td>稳定性</td><td>需检查极点是否在单位圆内</td><td><b>总是稳定</b>（无反馈）</td></tr>
        <tr><td>设计方法</td><td>利用模拟滤波器成熟成果，有闭式公式</td><td>多为主观设计，无闭式公式</td></tr>
        <tr><td>结构</td><td>含反馈，误差累积</td><td>非递归，可用 FFT 实现</td></tr>
      </table>`
    }
  ],
  examples: [
    {
      q: '已知 $h(n)=\\{1.5,2,3,3,2,1.5\\}$，$0\\le n\\le5$，判断其是否具有线性相位，属于哪一类，能否用于设计高通滤波器？',
      a: '$N=6$，$h(0)=1.5=h(5)$，$h(1)=2=h(4)$，$h(2)=3=h(3)$，满足 $h(n)=h(N-1-n)$，<b>具有线性相位</b>。<br>偶对称、$N$ 为偶数 → <b>第 II 类线性相位 FIR</b>。<br>第 II 类在 $\\omega=\\pi$ 处幅度必为零，<b>不能用于设计高通滤波器</b>。'
    },
    {
      q: '用矩形窗设计线性相位 FIR 低通，$\\omega_c=0.3\\pi$，$N=21$，求 $h_d(n)$ 并写出 $h(n)$。',
      a: '$\\alpha=\\dfrac{N-1}{2}=10$。<br>$h_d(n)=\\dfrac{\\sin[0.3\\pi(n-10)]}{\\pi(n-10)}$，$0\\le n\\le20$。<br>矩形窗 $w(n)=R_{21}(n)$，故 $h(n)=h_d(n)$，$0\\le n\\le20$。<br>由于 $h_d(n)$ 关于 $n=10$ 对称且 $h_d(10)=\\omega_c/\\pi=0.3$（洛必达法则）。'
    },
    {
      q: '简述窗函数法设计 FIR 滤波器时，窗函数类型和长度 $N$ 分别由什么决定？',
      a: '① <b>窗函数类型</b>由<b>阻带最小衰减 $\\alpha_s$</b>决定：阻带衰减要求越大，选旁瓣衰减越大的窗（矩形→汉宁→海明→布莱克曼）。<br>② <b>窗长 $N$</b> 由<b>过渡带宽度 $\\Delta\\omega$</b>决定：$\\Delta\\omega$ 越小（过渡带越窄），$N$ 越大，二者成反比。'
    }
  ],
  pitfalls: [
    '忘记判断第 II 类不能设计高通。',
    '窗长 $N$ 计算后忘记取整数，或取了偶数导致不能实现第一类线性相位。',
    '把过渡带宽度与窗长的关系搞反（$N$ 越大过渡带越窄）。',
    '$h_d(\\alpha)$ 处用洛必达法则求值，不要写成分母为零。'
  ]
});
