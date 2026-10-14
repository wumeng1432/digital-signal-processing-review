/* ============================================================
   数字信号处理复习站 — 老师重点（课堂板书）
   说明：板书不单独成页，按 ch 字段归入对应章节，在章节内展示。
   来源：任课教师课堂板书照片
   ============================================================ */
window.DSP_TEACHER = {
  summary: '任课老师在课堂上逐条推导的板书，已按章节归入下面的十章精讲中。可以看出期末重点高度集中在 <b>第 2 章（DTFT 性质证明、共轭对称性、Z 变换收敛域）</b> 与 <b>第 3 章（DFT 共轭性质、频域卷积定理）</b>，此外 <b>采样定理</b> 与 <b>常用序列的变换对</b> 也是反复强调的内容。',
  hotlist: [
    { t: 'DTFT 四条性质证明', d: '时移、频移、时域卷积、频域卷积 —— 板书完整推导，证明题必考', level: 3, ch: 'ch2' },
    { t: '共轭对称性全解', d: '序列分解、实部虚部对称、频域实部虚部对应关系 —— 用了 4 块黑板', level: 3, ch: 'ch2' },
    { t: '常用序列的 DTFT', d: 'δ(n)、δ(n−n₀)、R_N(n)、u(n) 的推导', level: 3, ch: 'ch2' },
    { t: 'Z 变换常用对与收敛域', d: 'u(n)、−u(−n−1)、aⁿu(n)、a^|n| 的 ROC 规律', level: 2, ch: 'ch2' },
    { t: 'DFT 共轭性质证明', d: 'DFT[x*(n)]=X*(N−k)、DFT[x*(N−n)]=X*(k)', level: 3, ch: 'ch3' },
    { t: 'DFT 频域卷积定理', d: 'IDFT[1/N · X₁(k)⊛X₂(k)] = x₁(n)·x₂(n)', level: 3, ch: 'ch3' },
    { t: '采样定理与频谱延拓', d: '时域采样 → 频域周期延拓，Ωs=2π/T', level: 2, ch: 'ch1' },
    { t: '复指数与欧拉公式', d: 'e^jθ 单位圆、cosθ 展开，为奇偶分解铺垫', level: 1, ch: 'ch1' }
  ],
  notes: [
    {
      file: '10-sampling.jpg',
      ch: 'ch1',
      title: '采样定理与频谱周期延拓',
      chapter: '第 1 章 · 1.5',
      tag: '采样定理',
      point: '时域采样（乘冲激串）⇔ 频域周期延拓；Ωs = 2π/T',
      detail: '板书用四组图对照：时域连续信号 → 乘冲激串 → 采样 → 离散序列；频域原谱 → 搬移叠加 → 周期延拓 → DTFT（以 2π 为周期）。强调延拓周期是 Ωs，混叠发生在 Ωs < 2Ωc 时。'
    },
    {
      file: '14-euler-sampling.jpg',
      ch: 'ch1',
      title: '复指数单位圆与采样频谱',
      chapter: '第 1~2 章',
      tag: '基础 · 采样',
      point: 'e^{j0}=1, e^{jπ}=−1, e^{jπ/2}=j, e^{−jπ/2}=−j',
      detail: '左侧复习复指数在单位圆上的取值（后续 DFT 旋转因子、共轭对称都要用）；右侧再次绘制采样后频谱周期延拓与混叠的示意图，并标注 T=1 等特例。'
    },
    {
      file: '12-time-shift.jpg',
      ch: 'ch2',
      title: '时移性质证明',
      chapter: '第 2 章 · 2.2.2',
      tag: 'DTFT 性质证明',
      point: 'FT[x(n−n₀)] = e^{−jωn₀}·X(e^{jω})',
      detail: '板书换元 n′=n−n₀，把 e^{−jωn} 拆成 e^{−jωn′}·e^{−jωn₀}，前一项求和即 X(e^{jω})。右侧给出 x(n)↔DTFT↔X(e^{jω})、↔ZT↔X(z)、以及 z=e^{jω} 的关系图。'
    },
    {
      file: '01-freq-shift.jpg',
      ch: 'ch2',
      title: '频移性质证明',
      chapter: '第 2 章 · 2.2.2',
      tag: 'DTFT 性质证明',
      point: 'FT[e^{jω₀n}x(n)] = X(e^{j(ω−ω₀)})',
      detail: '板书完整推导：把 e^{jω₀n} 并入指数，凑出 X(e^{jω}) 的定义式，指数合并为 e^{−j(ω−ω₀)n}，得到 X(e^{j(ω−ω₀)})。证明套路＝写出定义 → 合并指数 → 识别变换定义式。'
    },
    {
      file: '03-conv-theorem.jpg',
      ch: 'ch2',
      title: '时域卷积定理证明',
      chapter: '第 2 章 · 2.2.2',
      tag: 'DTFT 性质证明',
      point: 'FT[x(n)*h(n)] = X(e^{jω})·H(e^{jω})',
      detail: '板书把卷积和代入 DTFT 定义，交换求和次序，内层对 n 求和正好是 H(e^{jω})，外层是 X(e^{jω})。右上角还标注了时移性质 x(n−n₀)↔e^{−jωn₀}X(e^{jω}) 作为对照。'
    },
    {
      file: '11-product-theorem.jpg',
      ch: 'ch2',
      title: '频域卷积定理（加窗/乘积）证明',
      chapter: '第 2 章 · 2.2.2',
      tag: 'DTFT 性质证明',
      point: 'FT[x(n)·h(n)] = (1/2π)·H(e^{jω}) ⊛ X(e^{jω})',
      detail: '板书把 h(n) 写成 IDTFT 形式代入，交换求和与积分次序，内层求和凑出 X(e^{j(ω−θ)})，最终得到周期卷积。这是理解"加窗引起频谱泄漏"的理论基础。'
    },
    {
      file: '17-seq-conj-decomp.jpg',
      ch: 'ch2',
      title: '序列的共轭对称分解（完整推导）',
      chapter: '第 2 章 · 2.2.2',
      tag: '共轭对称性',
      point: 'x_e(n)=½[x(n)+x*(−n)]，x_o(n)=½[x(n)−x*(−n)]；x*(−n)=x_e(n)−x_o(n)',
      detail: '板书由 x(n)=x_e(n)+x_o(n) 与 x*(−n)=x_e(n)−x_o(n) 联立求解，得到两个分量的表达式。右侧同时给出连续域的对应式与频域 X_e、X_o 的表达式。'
    },
    {
      file: '04-conj-symm-ft.jpg',
      ch: 'ch2',
      title: '共轭对称序列的傅里叶变换',
      chapter: '第 2 章 · 2.2.2',
      tag: '共轭对称性',
      point: 'FT[x_e(n)] = ½[X(e^{jω}) + X*(e^{−jω})] = X_e(e^{jω})',
      detail: '板书用换元 n′=−n 处理 x*(−n)，再利用"求和的共轭＝共轭的求和"整理成 ½[X(e^{jω})+X*(e^{−jω})]。右侧同时列出偶分量/奇分量及其频域对应式。'
    },
    {
      file: '18-ft-xe-real.jpg',
      ch: 'ch2',
      title: 'FT[x_e(n)] = Re[X(e^{jω})]',
      chapter: '第 2 章 · 2.2.2',
      tag: '共轭对称性',
      point: 'FT[x_e(n)] = ½[X(e^{jω})+X*(e^{jω})] = Re[X(e^{jω})]',
      detail: '板书完整推导：对 ½[x(n)+x*(−n)] 取 DTFT，对第二项换元 n′=−n 得 Σx*(n′)e^{jωn′}，把它写成 [Σx(n′)e^{−jωn′}]* 即 X*(e^{jω})，于是结果为实部。'
    },
    {
      file: '20-xe-real-imag.jpg',
      ch: 'ch2',
      title: '共轭对称序列的实部/虚部对称性',
      chapter: '第 2 章 · 2.2.2',
      tag: '共轭对称性',
      point: 'x_e(n)=x_er(n)+j·x_ei(n)，其中 x_er(n)=x_er(−n)（偶），x_ei(n)=−x_ei(−n)（奇）',
      detail: '板书对 x_e(−n) 取共轭展开，与 x_e(n) 的实部/虚部逐一比对，得出"共轭对称序列的实部是偶函数、虚部是奇函数"。这是理解"实序列频谱幅度偶对称、相位奇对称"的关键一步。'
    },
    {
      file: '16-real-signal-decomp.jpg',
      ch: 'ch2',
      title: '实信号的偶分量与奇分量（图解）',
      chapter: '第 2 章 · 2.2.2',
      tag: '共轭对称性',
      point: 'x_e(t)=½[x(t)+x(−t)]，x_o(t)=½[x(t)−x(−t)]',
      detail: '板书用具体三角波形画出 x(t)、x(−t)，再叠加/相减得到偶分量与奇分量，直观说明"任何实信号都能分解为偶+奇"。离散序列完全同理：x(n)=x_e(n)+x_o(n)。'
    },
    {
      file: '15-ctft-even-odd.jpg',
      ch: 'ch2',
      title: 'CTFT 的奇偶分解（预备知识）',
      chapter: '第 2 章（预备）',
      tag: '共轭对称性',
      point: 'X(jΩ) = ∫x(t)cos(Ωt)dt − j∫x(t)sin(Ωt)dt',
      detail: '板书用欧拉公式 cosθ=(e^{jθ}+e^{−jθ})/2 展开 e^{−jΩt}，拆出实部（对应 cos 的积分，偶）与虚部（对应 sin 的积分，奇），为离散域的共轭对称性做铺垫。'
    },
    {
      file: '08-common-dtft.jpg',
      ch: 'ch2',
      title: '常用序列的 DTFT（含推导）',
      chapter: '第 2 章 · 2.2.1',
      tag: '常用变换对',
      point: 'δ(n)↔1；δ(n−n₀)↔e^{−jωn₀}；R_N(n)↔e^{−jω(N−1)/2}·sin(ωN/2)/sin(ω/2)',
      detail: 'R_N(n) 的推导用等比数列求和：Σ_{n=0}^{N−1} e^{−jωn} = (1−e^{−jωN})/(1−e^{−jω})，再提公因子 e^{−jω(N−1)/2} 得到正弦比形式。这是"矩形窗频谱"的原型。'
    },
    {
      file: '19-un-dtft.jpg',
      ch: 'ch2',
      title: 'u(n) 的 DTFT 与冲激串',
      chapter: '第 2 章 · 2.2.1',
      tag: '常用变换对',
      point: 'X(e^{jω}) = 1/(1−e^{−jω})（u(n) 的交流分量）',
      detail: '板书由 u(n)−u(n−1)=δ(n) 两边取 DTFT：X(e^{jω})−e^{−jω}X(e^{jω})=1，解得 1/(1−e^{−jω})。左侧同时画出 u(n)、δ(n) 与冲激串的波形对照。'
    },
    {
      file: '09-idtft-orth.jpg',
      ch: 'ch2',
      title: 'IDTFT 推导与复指数正交性',
      chapter: '第 2 章 · 2.2.1',
      tag: '证明方法',
      point: '∫_{−π}^{π} e^{jω(m−n)}dω = 2πδ(m−n)；x(n) = (1/2π)∫ X(e^{jω})e^{jωn}dω',
      detail: '板书分两种情况讨论：m≠n 时积分值为 0（利用 sin[(m−n)π]=0）；m=n 时积分值为 2π。由此得到反变换公式中的 1/2π 系数。'
    },
    {
      file: '06-ctft-dtft.jpg',
      ch: 'ch2',
      title: 'CTFT 与 DTFT 的定义对比',
      chapter: '第 2 章 · 2.4',
      tag: '基础定义',
      point: 'X(e^{jω}) = Σ x(n)e^{−jωn}，ω = ΩT；x(n) = x_a(t)|_{t=nT}',
      detail: '板书把连续时间傅里叶变换与离散时间傅里叶变换并排书写，突出"连续积分 → 离散求和""e^{−jΩt} → e^{−jωn}"的对应，并标注 DTFT 以 2π 为周期。'
    },
    {
      file: '02-zt-pairs.jpg',
      ch: 'ch2',
      title: 'Z 变换常用变换对与收敛域',
      chapter: '第 2 章 · 2.5',
      tag: 'Z 变换',
      point: 'u(n)↔z/(z−1), |z|>1；−u(−n−1)↔z/(z−1), |z|<1；aⁿu(n)↔z/(z−a), |z|>|a|；−aⁿu(−n−1)↔z/(z−a), |z|<|a|',
      detail: '同一表达式 z/(z−a) 因收敛域不同对应不同的序列。板书还给出有限长序列的分解写法与 ROC 0≤|z|<∞，以及"两个收敛域取交集"的规则。答题必须写 ROC。'
    },
    {
      file: '13-zt-two-sided.jpg',
      ch: 'ch2',
      title: '双边序列 x(n)=a^|n| 的 Z 变换',
      chapter: '第 2 章 · 2.5.2',
      tag: 'Z 变换 · 收敛域',
      point: 'X(z) = z/(z−a) + az/(1−az)，收敛域 |a| < |z| < 1/|a|',
      detail: '板书把双边序列拆成 n≥0 与 n<0 两部分：右边部分 ROC 为 |z|>|a|；左边部分利用 a^{−n}u(−n−1)=(a^{−1})ⁿu(−n−1)，ROC 为 |z|<1/|a|。两者取交集得到环状收敛域。'
    },
    {
      file: '07-dft-conj.jpg',
      ch: 'ch3',
      title: 'DFT 共轭性质两条证明',
      chapter: '第 3 章 · 3.2',
      tag: 'DFT 性质证明',
      point: '① DFT[x*(n)] = X*(N−k)；② DFT[x*(N−n)] = X*(k)',
      detail: '① 用 W_N^{−nk} = W_N^{(N−k)n}（因为 W_N^{Nn}=1）把负指数转成正指数，再整体取共轭。② 换元 n′=N−n，注意求和上下限的调整。板书特别标注 X(N)=X(0)。'
    },
    {
      file: '05-freq-conv-dft.jpg',
      ch: 'ch3',
      title: 'DFT 频域卷积定理证明',
      chapter: '第 3 章 · 3.2',
      tag: 'DFT 性质证明',
      point: 'IDFT[ (1/N)·X₁(k) ⊛ X₂(k) ] = x₁(n)·x₂(n)',
      detail: '板书核心技巧：内层对 k 求和的那一项恰好是 x₂(n) 的 IDFT 再乘 W_N^{−nl}，于是外层求和就是 x₁(n) 的 IDFT，最终得到 x₁(n)·x₂(n)。注意系数 1/N 的位置。'
    }
  ]
};
