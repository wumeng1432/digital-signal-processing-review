/* ============================================================
   数字信号处理复习站 — 教材精讲 第 8~10 章
   ============================================================ */
window.DSP_CHAPTERS = window.DSP_CHAPTERS || [];

/* ========================= 第 8 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch8',
  num: 8,
  title: '多采样率数字信号处理',
  subtitle: '抽取 · 内插 · 采样率转换',
  weight: 3,
  tags: ['概念题', '频谱变化'],
  intro: '本章考查"抽取/内插后频谱如何变化""为什么需要抗混叠/抗镜像滤波器"。多以选择、填空、简答形式出现。',
  outline: [
    '8.2 信号的整数倍抽取',
    '8.3 信号的整数倍内插',
    '8.4 按有理数因子 I/D 的采样率转换',
    '8.5~8.6 应用与高效实现（多相滤波器）'
  ],
  sections: [
    {
      h: '★ 8.2 整数倍抽取（下采样，D 倍）',
      body: `<p>定义：$x_D(m)=x(mD)$，即每隔 $D-1$ 个点取一个点。</p>
      <p><b>频谱关系（核心）：</b></p>
      <div class="formula">$$X_D(e^{j\\omega})=\\frac{1}{D}\\sum_{k=0}^{D-1}X\\Big(e^{j\\frac{\\omega-2\\pi k}{D}}\\Big)$$</div>
      <p>即原频谱在频率轴上<b>展宽 $D$ 倍</b>（$\\omega$ 压缩为 $\\omega/D$）并叠加。若原信号带宽超过 $\\pi/D$，就会发生<b>混叠</b>。</p>
      <p><b>抗混叠措施：</b>抽取前先用截止频率为 $\\pi/D$ 的低通滤波器（抗混叠滤波器）滤掉多余高频分量。</p>
      <div class="tip"><b>直观理解：</b>采样率降低 → 频率分辨率降低 → 原频谱被"拉宽"，超出 $[-\\pi,\\pi]$ 的部分折叠回来造成混叠。</div>`
    },
    {
      h: '★ 8.3 整数倍内插（上采样，I 倍）',
      body: `<p>定义：在相邻样点间插入 $I-1$ 个零：$x_I(m)=\\begin{cases}x(m/I),& m=0,\\pm I,\\pm2I,\\dots\\\\0,& \\text{其它}\\end{cases}$</p>
      <p><b>频谱关系：</b></p>
      <div class="formula">$$X_I(e^{j\\omega})=X(e^{j\\omega I})$$</div>
      <p>即原频谱在频率轴上<b>压缩 $I$ 倍</b>，并出现 $I-1$ 个<b>镜像分量</b>（周期延拓的重复谱）。</p>
      <p><b>抗镜像措施：</b>内插后接一个截止频率为 $\\pi/I$ 的低通滤波器，滤除镜像，同时把幅度放大 $I$ 倍。</p>`
    },
    {
      h: '8.4 按有理数因子 I/D 的采样率转换',
      body: `<p>实现分数倍采样率转换（如从 $48\\,\\mathrm{kHz}$ 到 $44.1\\,\\mathrm{kHz}$）：</p>
      <p><b>顺序：先内插 I 倍 → 低通滤波 → 再抽取 D 倍。</b></p>
      <div class="formula">$$f_s'=\\frac{I}{D}f_s$$</div>
      <p>低通滤波器截止频率取 $\\omega_c=\\min\\left(\\dfrac{\\pi}{I},\\dfrac{\\pi}{D}\\right)$，增益为 $I$。</p>
      <div class="tip"><b>易错：</b>顺序不能颠倒！必须先内插后抽取，否则会丢失信息。</div>`
    },
    {
      h: '8.6 高效实现：多相滤波器结构',
      body: `<p>直接实现抽取/内插的运算量大（大量乘 0 运算）。多相分解把滤波器 $h(n)$ 按相位分成 $I$（或 $D$）个子滤波器，把滤波移到低速端，可把运算量降低为原来的 $1/I$（或 $1/D$）。</p>`
    }
  ],
  examples: [
    {
      q: '序列 $x(n)$ 的采样率为 $f_s=8\\,\\mathrm{kHz}$，做 4 倍抽取，抽取后采样率是多少？抗混叠滤波器截止频率应取多少？',
      a: '抽取后 $f_s^{\\prime}=f_s/D=8000/4=2000\\,\\mathrm{Hz}$。<br>抗混叠滤波器截止频率 $\\omega_c=\\pi/D=\\pi/4$，对应模拟频率 $f_c=f_s/(2D)=8000/8=1000\\,\\mathrm{Hz}$。'
    },
    {
      q: '简述抽取和内插对信号频谱的影响有何不同。',
      a: '① <b>抽取（D 倍）</b>：频谱在频率轴上<b>展宽 D 倍</b>并叠加，可能产生混叠，需前置抗混叠低通滤波器。<br>② <b>内插（I 倍）</b>：频谱在频率轴上<b>压缩 I 倍</b>，出现 I-1 个镜像分量，需后置抗镜像低通滤波器。'
    }
  ],
  pitfalls: [
    '把抽取和内插的频谱变化记反（抽取→展宽；内插→压缩）。',
    'I/D 转换的顺序搞反。',
    '忘记抗混叠/抗镜像滤波器的作用。'
  ]
});

/* ========================= 第 9 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch9',
  num: 9,
  title: '数字信号处理的实现',
  subtitle: '量化效应 · 系数量化 · 运算误差',
  weight: 2,
  tags: ['概念题', '低频考点'],
  intro: '本章主要考量化误差的基本概念与量化信噪比公式，通常为选择/填空题。',
  outline: [
    '9.1 数字信号处理中的量化效应',
    '9.2 软件实现',
    '9.3 硬件实现'
  ],
  sections: [
    {
      h: '9.1 三种量化效应',
      body: `<table class="tbl">
        <tr><th>类型</th><th>产生位置</th><th>影响</th></tr>
        <tr><td><b>A/D 量化效应</b></td><td>模拟信号 → 数字信号（幅度量化）</td><td>引入量化噪声，量化信噪比</td></tr>
        <tr><td><b>系数量化效应</b></td><td>滤波器系数 $h(n)$、$a_k$ 存储时</td><td>极点偏移，可能导致系统不稳定（IIR 尤其敏感）</td></tr>
        <tr><td><b>运算量化效应</b></td><td>乘法、加法运算结果舍入</td><td>输出噪声、极限环振荡（IIR）</td></tr>
      </table>
      <p><b>量化信噪比（正弦信号、$b$ 位字长）：</b></p>
      <div class="formula">$$\\mathrm{SNR}\\approx 6.02b+1.76\\ (\\mathrm{dB})$$</div>
      <p>字长每增加 1 位，信噪比提高约 6 dB。</p>
      <p><b>量化误差：</b>设字长 $b$，量化步长 $q=2^{-b}$（归一化），舍入误差在 $\\left[-\\dfrac{q}{2},\\dfrac{q}{2}\\right]$ 均匀分布，方差 $\\sigma_e^2=\\dfrac{q^2}{12}$。</p>`
    },
    {
      h: '9.2/9.3 实现方式',
      body: `<p><b>软件实现：</b>通用计算机/DSP 芯片上用程序实现（MATLAB、C 语言）。</p>
      <p><b>硬件实现：</b>专用 DSP 芯片（如 TI TMS320 系列）、FPGA、ASIC。核心部件：乘法器、加法器、累加器、存储器。</p>`
    }
  ],
  examples: [
    {
      q: 'A/D 转换器字长为 12 位，输入满量程正弦信号，估算其量化信噪比。',
      a: '$\\mathrm{SNR}\\approx 6.02\\times12+1.76=72.24+1.76=74\\,\\mathrm{dB}$。'
    }
  ],
  pitfalls: [
    '混淆三种量化效应。',
    '量化信噪比公式记错系数（6.02 与 1.76）。'
  ]
});

/* ========================= 第 10 章 ========================= */
window.DSP_CHAPTERS.push({
  id: 'ch10',
  num: 10,
  title: '上机实验与 MATLAB 实现',
  subtitle: 'MATLAB 信号处理工具箱常用函数',
  weight: 2,
  tags: ['实验', 'MATLAB'],
  intro: '教材第四版在前 8 章都补充了 MATLAB 工具箱函数。若期末含上机或实验报告考核，以下函数必须会查会用。',
  outline: [
    '10.1 系统响应及系统稳定性',
    '10.2 时域采样与频域采样',
    '10.3 用 FFT 对信号作频谱分析',
    '10.4 IIR 数字滤波器设计及软件实现',
    '10.5 FIR 数字滤波器设计与软件实现',
    '10.6 数字信号处理在双音多频（DTMF）拨号系统中的应用'
  ],
  sections: [
    {
      h: 'MATLAB 常用函数速查',
      body: `<table class="tbl">
        <tr><th>函数</th><th>功能</th></tr>
        <tr><td><code>fft(x, N)</code> / <code>ifft(X, N)</code></td><td>$N$ 点 DFT / IDFT（内部用 FFT 算法）</td></tr>
        <tr><td><code>conv(x, h)</code></td><td>线性卷积</td></tr>
        <tr><td><code>filter(b, a, x)</code></td><td>按差分方程实现滤波</td></tr>
        <tr><td><code>freqz(b, a, N)</code></td><td>求数字滤波器频率响应</td></tr>
        <tr><td><code>impz(b, a, N)</code></td><td>求单位脉冲响应</td></tr>
        <tr><td><code>butter(N, wc)</code> / <code>cheby1</code> / <code>cheby2</code></td><td>巴特沃斯 / 切比雪夫 I、II 型滤波器设计</td></tr>
        <tr><td><code>bilinear(b, a, fs)</code></td><td>双线性变换（模拟→数字）</td></tr>
        <tr><td><code>impinvar(b, a, fs)</code></td><td>脉冲响应不变法</td></tr>
        <tr><td><code>fir1(N, wc, window)</code></td><td>窗函数法设计 FIR</td></tr>
        <tr><td><code>fir2</code> / <code>firls</code> / <code>remez</code></td><td>频率采样法 / 最小二乘 / 等波纹最佳逼近</td></tr>
        <tr><td><code>boxcar, hann, hamming, blackman, kaiser</code></td><td>各类窗函数</td></tr>
        <tr><td><code>decimate</code> / <code>interp</code> / <code>resample</code></td><td>抽取 / 内插 / 分数倍采样率转换</td></tr>
      </table>
      <div class="tip"><b>实验报告要点：</b>① 说明实验目的与原理；② 给出程序清单；③ 绘制波形图并分析；④ 对比理论结果，讨论误差来源。</div>`
    }
  ],
  examples: [
    {
      q: '用 MATLAB 求序列 $x(n)=\\{1,2,3,4\\}$ 与 $h(n)=\\{1,1,1\\}$ 的线性卷积与 4 点循环卷积。',
      a: '线性卷积：<code>y = conv([1 2 3 4], [1 1 1])</code> → <code>y = [1 3 6 9 8 4]</code><br>4 点循环卷积：<br><code>y4 = ifft(fft([1 2 3 4],4).*fft([1 1 1],4))</code> → <code>y4 = [9 7 6 9]</code>'
    }
  ],
  pitfalls: [
    '混淆 fft 与 conv 的适用场景。',
    'freqz 返回的横轴是归一化频率（$\\times\\pi$），不是 Hz。'
  ]
});
