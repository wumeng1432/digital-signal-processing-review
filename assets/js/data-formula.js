/* ============================================================
   数字信号处理复习站 — 公式速查表
   ============================================================ */
window.DSP_FORMULAS = [
  {
    id: 'f-transform',
    title: '一、三大变换定义',
    icon: '∫',
    items: [
      { n: 'DTFT（序列傅里叶变换）', f: '$$X(e^{j\\omega})=\\sum_{n=-\\infty}^{\\infty}x(n)e^{-j\\omega n}$$', note: '存在条件：$\\sum|x(n)|<\\infty$；以 $2\\pi$ 为周期' },
      { n: 'IDTFT（反变换）', f: '$$x(n)=\\frac{1}{2\\pi}\\int_{-\\pi}^{\\pi}X(e^{j\\omega})e^{j\\omega n}\\mathrm{d}\\omega$$', note: '系数 $1/2\\pi$ 不要漏' },
      { n: 'Z 变换', f: '$$X(z)=\\sum_{n=-\\infty}^{\\infty}x(n)z^{-n}$$', note: '必须注明收敛域 ROC' },
      { n: 'N 点 DFT', f: '$$X(k)=\\sum_{n=0}^{N-1}x(n)W_N^{nk},\\quad W_N=e^{-j\\frac{2\\pi}{N}}$$', note: '$k=0,1,\\dots,N-1$' },
      { n: 'N 点 IDFT', f: '$$x(n)=\\frac{1}{N}\\sum_{k=0}^{N-1}X(k)W_N^{-nk}$$', note: '系数 $1/N$ 不要漏' },
      { n: '三者关系', f: '$$X(k)=X(e^{j\\omega})\\big|_{\\omega=\\frac{2\\pi}{N}k}=X(z)\\big|_{z=e^{j\\frac{2\\pi}{N}k}}$$', note: 'DFT = DTFT 在单位圆上 N 点等间隔采样' }
    ]
  },
  {
    id: 'f-seq',
    title: '二、常用序列变换对',
    icon: 'Σ',
    items: [
      { n: '$\\delta(n)$', f: '$X(z)=1$，ROC：全平面', note: 'DTFT 为 1' },
      { n: '$\\delta(n-n_0)$', f: '$\\mathrm{DTFT}=e^{-j\\omega n_0}$', note: '' },
      { n: '$u(n)$', f: '$\\dfrac{z}{z-1}$，ROC $|z|>1$', note: 'DTFT 含冲激项' },
      { n: '$-u(-n-1)$', f: '$\\dfrac{z}{z-1}$，ROC $|z|<1$', note: '表达式相同、ROC 不同' },
      { n: '$a^nu(n)$', f: '$\\dfrac{z}{z-a}$，ROC $|z|>|a|$', note: 'DTFT $=\\dfrac{1}{1-ae^{-j\\omega}}$' },
      { n: '$-a^nu(-n-1)$', f: '$\\dfrac{z}{z-a}$，ROC $|z|<|a|$', note: '' },
      { n: '$a^{|n|}$（$|a|<1$）', f: '$\\dfrac{z(1-a^2)}{(z-a)(1-az)}$，ROC $|a|<|z|<\\frac{1}{|a|}$', note: '双边序列 → 环状 ROC' },
      { n: '$R_N(n)$', f: '$\\mathrm{DTFT}=e^{-j\\frac{N-1}{2}\\omega}\\dfrac{\\sin(\\omega N/2)}{\\sin(\\omega/2)}$', note: '矩形窗频谱原型' },
      { n: '$nu(n)$', f: '$\\dfrac{z}{(z-1)^2}$，ROC $|z|>1$', note: '' }
    ]
  },
  {
    id: 'f-prop',
    title: '三、DTFT / DFT 性质对照',
    icon: '⇄',
    items: [
      { n: '线性', f: '$ax_1(n)+bx_2(n)\\ \\leftrightarrow\\ aX_1+bX_2$', note: '' },
      { n: '时移 / 循环移位', f: 'DTFT：$x(n-n_0)\\leftrightarrow e^{-j\\omega n_0}X(e^{j\\omega})$<br>DFT：$x((n-m))_NR_N(n)\\leftrightarrow W_N^{mk}X(k)$', note: 'DFT 用循环移位' },
      { n: '频移', f: 'DTFT：$e^{j\\omega_0n}x(n)\\leftrightarrow X(e^{j(\\omega-\\omega_0)})$', note: '' },
      { n: '时域卷积', f: '$x(n)*h(n)\\leftrightarrow X(e^{j\\omega})H(e^{j\\omega})$<br>DFT：$x_1(n)\\circledast x_2(n)\\leftrightarrow X_1(k)X_2(k)$', note: 'DFT 中是循环卷积' },
      { n: '频域卷积', f: 'DTFT：$x(n)h(n)\\leftrightarrow\\frac{1}{2\\pi}X\\circledast H$<br>DFT：$x_1(n)x_2(n)\\leftrightarrow\\frac{1}{N}X_1(k)\\circledast X_2(k)$', note: '<b>系数 $1/N$ 别漏</b>' },
      { n: '共轭', f: 'DTFT：$x^*(n)\\leftrightarrow X^*(e^{-j\\omega})$<br>DFT：$x^*(n)\\leftrightarrow X^*(N-k)$', note: '' },
      { n: '反转', f: 'DTFT：$x(-n)\\leftrightarrow X(e^{-j\\omega})$<br>DFT：$x(N-n)\\leftrightarrow X(N-k)$', note: '' },
      { n: 'Parseval', f: 'DFT：$\\sum_{n=0}^{N-1}|x(n)|^2=\\frac{1}{N}\\sum_{k=0}^{N-1}|X(k)|^2$', note: '能量守恒' }
    ]
  },
  {
    id: 'f-conj',
    title: '四、共轭对称性（★老师重点）',
    icon: '★',
    items: [
      { n: '序列分解', f: '$$x(n)=x_e(n)+x_o(n)$$', note: '' },
      { n: '共轭对称分量', f: '$$x_e(n)=\\frac{1}{2}\\big[x(n)+x^*(-n)\\big]$$', note: '' },
      { n: '共轭反对称分量', f: '$$x_o(n)=\\frac{1}{2}\\big[x(n)-x^*(-n)\\big]$$', note: '' },
      { n: '反推', f: '$$x^*(-n)=x_e(n)-x_o(n)$$', note: '' },
      { n: '频域对应', f: '$$X_e(e^{j\\omega})=\\frac{1}{2}\\big[X(e^{j\\omega})+X^*(e^{-j\\omega})\\big]$$$$X_o(e^{j\\omega})=\\frac{1}{2}\\big[X(e^{j\\omega})-X^*(e^{-j\\omega})\\big]$$', note: '' },
      { n: '时域↔频域', f: '$$\\mathrm{FT}[x_e(n)]=\\mathrm{Re}[X(e^{j\\omega})],\\quad \\mathrm{FT}[x_o(n)]=j\\,\\mathrm{Im}[X(e^{j\\omega})]$$', note: '口诀：对称→实部，反对称→虚部' },
      { n: '实部虚部对称', f: '$x_e(n)=x_{er}(n)+jx_{ei}(n)$，$x_{er}$ 偶、$x_{ei}$ 奇', note: '' },
      { n: '实序列结论', f: '$X(k)=X^*(N-k)$；$|X(k)|=|X(N-k)|$；幅度偶、相位奇', note: '' }
    ]
  },
  {
    id: 'f-filter',
    title: '五、滤波器设计与采样',
    icon: '⚙',
    items: [
      { n: '采样定理', f: '$$f_s\\ge 2f_c,\\qquad \\Omega_s=\\frac{2\\pi}{T}$$', note: '否则频谱混叠' },
      { n: '频谱延拓', f: '$$\\hat X_a(j\\Omega)=\\frac{1}{T}\\sum_{k}X_a\\big(j(\\Omega-k\\Omega_s)\\big)$$', note: '时域相乘 ⇔ 频域周期延拓' },
      { n: '双线性变换', f: '$$s=\\frac{2}{T}\\frac{1-z^{-1}}{1+z^{-1}},\\qquad \\Omega=\\frac{2}{T}\\tan\\frac{\\omega}{2}$$', note: '<b>必须先预畸变</b>' },
      { n: '脉冲响应不变法', f: '$$z_k=e^{s_kT},\\qquad H(z)=\\sum_k\\frac{A_k}{1-e^{s_kT}z^{-1}}$$', note: '有混叠，仅适合低通/带通' },
      { n: '巴特沃斯幅度平方', f: '$$|H_a(j\\Omega)|^2=\\frac{1}{1+(\\Omega/\\Omega_c)^{2N}}$$', note: '$\\Omega_c$ 处衰减 3 dB' },
      { n: '巴特沃斯阶数', f: '$$N\\ge\\frac{\\lg(10^{\\alpha_s/10}-1)-\\lg(10^{\\alpha_p/10}-1)}{2\\lg(\\Omega_s/\\Omega_p)}$$', note: '向上取整' },
      { n: 'FIR 线性相位条件', f: '$$h(n)=\\pm h(N-1-n)$$', note: '相位 $\\varphi(\\omega)=-\\frac{N-1}{2}\\omega$' },
      { n: '理想低通 $h_d(n)$', f: '$$h_d(n)=\\frac{\\sin[\\omega_c(n-\\alpha)]}{\\pi(n-\\alpha)},\\ \\alpha=\\frac{N-1}{2}$$', note: '窗函数法核心' },
      { n: '谱分析三参数', f: '$$F=\\frac{f_s}{N}=\\frac{1}{T_p},\\quad T_p=\\frac{1}{F},\\quad N=\\frac{f_s}{F}$$', note: '栅栏效应/泄漏/分辨率' }
    ]
  },
  {
    id: 'f-fft',
    title: '六、FFT 与实现',
    icon: '⚡',
    items: [
      { n: '直接 DFT 运算量', f: '复乘 $N^2$ 次，复加 $N(N-1)$ 次', note: '' },
      { n: '基 2 FFT 运算量', f: '复乘 $\\dfrac{N}{2}\\log_2N$ 次，复加 $N\\log_2N$ 次', note: '$N=2^M$' },
      { n: '加速比', f: '$\\dfrac{2N}{\\log_2N}$', note: '$N=16$ 时约 8 倍' },
      { n: 'IDFT 用 FFT', f: '$$x(n)=\\frac{1}{N}\\big\\{\\mathrm{FFT}[X^*(k)]\\big\\}^*$$', note: '共轭→FFT→共轭→除 N' },
      { n: '循环卷积=线性卷积', f: '$$L\\ge N_1+N_2-1$$', note: '否则发生混叠' },
      { n: '量化信噪比', f: '$$\\mathrm{SNR}\\approx 6.02b+1.76\\ \\mathrm{dB}$$', note: '$b$ 为字长' },
      { n: '抽取/内插', f: '抽取：频谱展宽 $D$ 倍；内插：频谱压缩 $I$ 倍', note: '抽取需抗混叠，内插需抗镜像' }
    ]
  }
];
