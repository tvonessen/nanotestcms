// GENERATED from plan/NANOTEST_TIM_Survey_Spec.md (Appendix A + B) by scripts in /tmp — do not edit by hand.
// Re-run the generator if the spec changes.
export type SurveyLang = 'en' | 'zh' | 'ja';

export const surveyLangs: readonly SurveyLang[] = ['en', 'zh', 'ja'];

export const surveyLangLabels: Record<SurveyLang, string> = { en: 'EN', zh: '中文', ja: '日本語' };

export const surveyHtmlLang: Record<SurveyLang, string> = { en: 'en', zh: 'zh-Hans', ja: 'ja' };

export const texts: Record<string, Record<SurveyLang, string>> = {
  'Q01.t': {
    en: 'Which best describes your organisation?',
    zh: '您的机构属于以下哪种情况？',
    ja: '貴社に最も当てはまるものはどれですか？',
  },
  'Q01.o1': {
    en: 'We test TIMs in-house today',
    zh: '我们目前在内部测试 TIM',
    ja: '現在、社内でTIMを試験している',
  },
  'Q01.o2': {
    en: 'We don’t test TIMs in-house yet, but plan to',
    zh: '我们尚未在内部测试 TIM，但计划开展',
    ja: '社内ではまだTIMを試験していないが、予定している',
  },
  'Q01.o3': {
    en: 'We are a distributor or reseller of test equipment',
    zh: '我们是测试设备的经销商或代理商',
    ja: '試験装置の販売代理店・再販業者である',
  },
  'Q01.o4': {
    en: 'Other (please specify)',
    zh: '其他（请注明）',
    ja: 'その他（具体的にご記入ください）',
  },
  'Q02.t': {
    en: 'Which industry do you mainly work in?',
    zh: '您主要在哪个行业工作？',
    ja: '主にどの業界でお仕事をされていますか？',
  },
  'Q02.o1': {
    en: 'Automotive / e-mobility',
    zh: '汽车 / 电动出行',
    ja: '自動車／eモビリティ',
  },
  'Q02.o2': {
    en: 'Power electronics',
    zh: '电力电子',
    ja: 'パワーエレクトロニクス',
  },
  'Q02.o3': {
    en: 'Industrial electronics',
    zh: '工业电子',
    ja: '産業用エレクトロニクス',
  },
  'Q02.o4': {
    en: 'Consumer electronics',
    zh: '消费电子',
    ja: '民生用エレクトロニクス',
  },
  'Q02.o5': {
    en: 'Data centre / computing',
    zh: '数据中心 / 计算',
    ja: 'データセンター／コンピューティング',
  },
  'Q02.o6': {
    en: 'Telecommunications',
    zh: '电信',
    ja: '通信',
  },
  'Q02.o7': {
    en: 'LED / lighting',
    zh: 'LED / 照明',
    ja: 'LED／照明',
  },
  'Q02.o8': {
    en: 'Aerospace / defence',
    zh: '航空航天 / 国防',
    ja: '航空宇宙／防衛',
  },
  'Q02.o9': {
    en: 'TIM or chemical manufacturer',
    zh: 'TIM 或化工材料制造商',
    ja: 'TIMまたは化学材料メーカー',
  },
  'Q02.o10': {
    en: 'Test laboratory / test service',
    zh: '测试实验室 / 检测服务',
    ja: '試験所／受託試験サービス',
  },
  'Q03.t': {
    en: 'What is your main role?',
    zh: '您的主要职责是什么？',
    ja: 'あなたの主な役割は何ですか？',
  },
  'Q03.o1': {
    en: 'QC or lab technician / operator',
    zh: '质检或实验室技术员 / 操作员',
    ja: '品質管理または試験室の技術者／オペレーター',
  },
  'Q03.o2': {
    en: 'QC or quality engineer',
    zh: '质检或质量工程师',
    ja: '品質管理または品質エンジニア',
  },
  'Q03.o3': {
    en: 'QC or quality manager',
    zh: '质检或质量经理',
    ja: '品質管理または品質マネージャー',
  },
  'Q03.o4': {
    en: 'R&D engineer or scientist',
    zh: '研发工程师或科研人员',
    ja: '研究開発エンジニアまたは研究者',
  },
  'Q03.o5': {
    en: 'Production or process engineer',
    zh: '生产或工艺工程师',
    ja: '生産技術またはプロセスエンジニア',
  },
  'Q03.o6': {
    en: 'Purchasing',
    zh: '采购',
    ja: '購買',
  },
  'Q03.o7': {
    en: 'Management',
    zh: '管理层',
    ja: '経営・管理職',
  },
  'Q04.t': {
    en: 'What is your role when your organisation buys lab test equipment?',
    zh: '贵单位采购实验室测试设备时，您扮演什么角色？',
    ja: '貴社が試験装置を購入する際、あなたはどのような役割を担っていますか？',
  },
  'Q04.o1': {
    en: 'I make or approve the decision',
    zh: '我负责做出或批准决定',
    ja: '決定を下す、または承認する',
  },
  'Q04.o2': {
    en: 'I influence it (e.g. I write the specification)',
    zh: '我会影响决定（例如编写技术规格）',
    ja: '決定に影響を与える（例：仕様書を作成する）',
  },
  'Q04.o3': {
    en: 'I am not involved',
    zh: '我不参与',
    ja: '関与していない',
  },
  'Q05.t': {
    en: 'How do you check the thermal performance of TIMs today?',
    zh: '您目前如何检查 TIM 的热性能？',
    ja: '現在、TIMの熱性能をどのように確認していますか？',
  },
  'Q05.o1': {
    en: 'In-house ASTM D5470 tester',
    zh: '内部的 ASTM D5470 测试仪',
    ja: '社内のASTM D5470試験装置',
  },
  'Q05.o2': {
    en: 'Another in-house thermal method (e.g. laser flash, transient methods)',
    zh: '其他内部热测试方法（例如激光闪射法、瞬态法）',
    ja: '社内の別の熱測定法（例：レーザーフラッシュ法、過渡法）',
  },
  'Q05.o3': {
    en: 'External lab',
    zh: '外部实验室',
    ja: '外部の試験機関',
  },
  'Q05.o4': {
    en: 'Supplier datasheet or certificate',
    zh: '供应商的数据表或证书',
    ja: 'サプライヤーのデータシートまたは証明書',
  },
  'Q05.o5': {
    en: 'Thermal test of the finished product or assembly',
    zh: '对成品或组件进行热测试',
    ja: '完成品またはアセンブリでの熱試験',
  },
  'Q05.o6': {
    en: 'No thermal testing today',
    zh: '目前不进行热测试',
    ja: '現在、熱試験は行っていない',
  },
  'Q06.t': {
    en: 'What are the biggest problems with how you test TIMs today?',
    zh: '您目前测试 TIM 时最大的问题是什么？',
    ja: '現在のTIM試験における最大の課題は何ですか？',
  },
  'Q06.o1': {
    en: 'Testing takes too long',
    zh: '测试耗时太长',
    ja: '試験に時間がかかりすぎる',
  },
  'Q06.o2': {
    en: 'An engineer or specialist is needed to run tests',
    zh: '需要工程师或专业人员才能进行测试',
    ja: '試験の実施にエンジニアや専門家が必要',
  },
  'Q06.o3': {
    en: 'Results vary between operators or shifts',
    zh: '不同操作员或班次之间结果不一致',
    ja: 'オペレーターやシフトによって結果がばらつく',
  },
  'Q06.o4': {
    en: 'Calibration is complex or time-consuming',
    zh: '校准复杂或耗时',
    ja: '校正が複雑、または時間がかかる',
  },
  'Q06.o5': {
    en: 'External testing is too slow or expensive',
    zh: '外部测试太慢或太贵',
    ja: '外部試験は時間や費用がかかりすぎる',
  },
  'Q06.o6': {
    en: 'Test equipment is too expensive',
    zh: '测试设备太贵',
    ja: '試験装置が高価すぎる',
  },
  'Q06.o7': {
    en: 'Reports are created manually',
    zh: '报告需要手动编写',
    ja: 'レポートを手作業で作成している',
  },
  'Q06.o8': {
    en: 'Results are hard to transfer into our IT systems',
    zh: '结果难以导入我们的 IT 系统',
    ja: '結果を社内のITシステムに取り込みにくい',
  },
  'Q06.o9': {
    en: 'No major problems',
    zh: '没有大问题',
    ja: '大きな課題はない',
  },
  'Q07.t': {
    en: 'What would you mainly use a desktop TIM QC tester for?',
    zh: '您主要会将台式 TIM 质检测试仪用于哪些方面？',
    ja: '卓上型のTIM品質管理試験装置を主に何に使いますか？',
  },
  'Q07.o1': {
    en: 'Routine inspection of incoming TIM deliveries',
    zh: '来料 TIM 的常规检验',
    ja: '入荷したTIMの定期的な受入検査',
  },
  'Q07.o2': {
    en: 'Qualifying new suppliers or new materials',
    zh: '新供应商或新材料的认定',
    ja: '新規サプライヤーや新材料の認定',
  },
  'Q07.o3': {
    en: 'Batch release of TIMs we produce',
    zh: '自产 TIM 的批次放行',
    ja: '自社製TIMのロット出荷判定',
  },
  'Q07.o4': {
    en: 'Process monitoring in production',
    zh: '生产过程监控',
    ja: '生産工程のモニタリング',
  },
  'Q07.o5': {
    en: 'Material development / R&D',
    zh: '材料开发 / 研发',
    ja: '材料開発／研究開発',
  },
  'Q07.o6': {
    en: 'Failure analysis',
    zh: '失效分析',
    ja: '故障解析',
  },
  'Q08.t': {
    en: 'What is the highest contact pressure your QC tests need?',
    zh: '您的质检测试所需的最高接触压力是多少？',
    ja: '品質管理試験で必要な最大接触圧力はどれくらいですか？',
  },
  'Q08.o1': {
    en: 'Up to 100 kPa (15 psi)',
    zh: '最高 100 kPa（15 psi）',
    ja: '100 kPa（15 psi）まで',
  },
  'Q08.o2': {
    en: 'Up to 250 kPa (36 psi)',
    zh: '最高 250 kPa（36 psi）',
    ja: '250 kPa（36 psi）まで',
  },
  'Q08.o3': {
    en: 'Up to 500 kPa (73 psi)',
    zh: '最高 500 kPa（73 psi）',
    ja: '500 kPa（73 psi）まで',
  },
  'Q08.o4': {
    en: 'Up to 1 MPa (145 psi)',
    zh: '最高 1 MPa（145 psi）',
    ja: '1 MPa（145 psi）まで',
  },
  'Q08.o5': {
    en: 'More than 1 MPa (145 psi)',
    zh: '超过 1 MPa（145 psi）',
    ja: '1 MPa（145 psi）超',
  },
  'Q08.o98': {
    en: 'Varies strongly by product (please specify which products need what)',
    zh: '因产品而差异很大（请注明哪些产品需要什么）',
    ja: '製品によって大きく異なる（どの製品に何が必要かご記入ください）',
  },
  'Q08.o99': {
    en: 'Don’t know',
    zh: '不清楚',
    ja: 'わからない',
  },
  'Q09.t': {
    en: 'What average sample temperature do your QC tests need during the measurement?',
    zh: '您的质检测试在测量时需要的样品平均温度是多少？',
    ja: '品質管理試験では、測定中のサンプル平均温度は何度必要ですか？',
  },
  'Q09.o1': {
    en: 'Up to 40 °C',
    zh: '最高 40 °C',
    ja: '40 °Cまで',
  },
  'Q09.o2': {
    en: 'Up to 60 °C',
    zh: '最高 60 °C',
    ja: '60 °Cまで',
  },
  'Q09.o3': {
    en: 'Up to 80 °C',
    zh: '最高 80 °C',
    ja: '80 °Cまで',
  },
  'Q09.o4': {
    en: 'Up to 100 °C',
    zh: '最高 100 °C',
    ja: '100 °Cまで',
  },
  'Q09.o5': {
    en: 'More than 100 °C',
    zh: '超过 100 °C',
    ja: '100 °C超',
  },
  'Q10.t': {
    en: 'Which features matter most to you in a TIM quality control device? Put them in order.',
    zh: '对于 TIM 质检设备，哪些功能对您最重要？请排出顺序。',
    ja: 'TIM品質管理装置で、最も重要な機能はどれですか？優先順位を付けてください。',
  },
  'Q10.h': {
    en: 'Tap the features in order of priority: your first tap is priority 1. Choose at least 3 and at most 5. Tap again to remove a feature.',
    zh: '请按优先顺序点击功能：第一次点击即为优先级 1。至少选择 3 项，最多 5 项。再次点击可取消。',
    ja: '優先度の高い順に機能をタップしてください。最初にタップしたものが優先度1になります。3～5個選んでください。もう一度タップすると取り消せます。',
  },
  'Q10.oP01': {
    en: 'Audit trail: a log of who measured or changed what, and when',
    zh: '审计追踪：记录谁在何时进行了哪些测量或更改',
    ja: '監査証跡：誰がいつ何を測定・変更したかの記録',
  },
  'Q10.oP02': {
    en: 'Direct data transfer to LIMS / MES (lab or production IT systems)',
    zh: '直接传输数据至 LIMS / MES（实验室或生产 IT 系统）',
    ja: 'LIMS／MES（試験室・生産のITシステム）への直接データ転送',
  },
  'Q10.oP03': {
    en: 'Automatic export of results to a network folder (CSV)',
    zh: '自动将结果导出到网络文件夹（CSV）',
    ja: 'ネットワークフォルダへの測定結果の自動エクスポート（CSV）',
  },
  'Q10.oP04': {
    en: 'Barcode scanning of sample or batch IDs',
    zh: '扫描样品或批次条码',
    ja: 'サンプルまたはロットIDのバーコード読み取り',
  },
  'Q10.oP05': {
    en: 'Trend charts and statistics across batches',
    zh: '跨批次的趋势图和统计',
    ja: 'ロット間のトレンドグラフと統計',
  },
  'Q10.oP06': {
    en: 'Interchangeable test heads for other sample sizes',
    zh: '可更换测试头，适用于其他样品尺寸',
    ja: '他のサンプルサイズ用の交換式測定ヘッド',
  },
  'Q10.oP07': {
    en: 'Tool-free, quick sample change',
    zh: '免工具快速更换样品',
    ja: '工具不要のすばやいサンプル交換',
  },
  'Q10.oP08': {
    en: 'Fixtures for applying pastes at a defined thickness',
    zh: '按规定厚度涂敷导热膏的夹具',
    ja: 'ペーストを規定の厚さで塗布するための治具',
  },
  'Q10.oP09': {
    en: 'A feature that isn’t listed',
    zh: '未列出的功能',
    ja: 'リストにない機能',
  },
  'Q10.ph': {
    en: 'We really need…',
    zh: '我们非常需要……',
    ja: '本当に必要なのは…',
  },
  'concept.t': {
    en: 'Device concept',
    zh: '设备概念',
    ja: '装置コンセプト',
  },
  'concept.btn': {
    en: 'Continue',
    zh: '继续',
    ja: '続ける',
  },
  'concept.body': {
    en: '<p>Please read this short description. The next questions refer to it.</p><div class="concept"><p><strong>A desktop tester for routine TIM quality control to ASTM D5470.</strong></p><ul><li>25.4 mm (1") test heads, up to 150 N, sample temperature up to 60 °C</li><li>Automatic thickness and pressure measurement, pressure and bond line thickness sweeps, thermal resistance and conductivity</li><li>Automatic start-up checks; the operator cleans and loads the sample, the device measures</li><li>Technicians run saved presets and get a pass/fail result; engineers create the presets</li></ul><div class="notincl"><strong>Not included:</strong> temperature sweeps, curing, pump-out and ageing tests.</div></div>',
    zh: '<p>请阅读以下简短说明。接下来的问题将以此为基础。</p><div class="concept"><p><strong>一款按照 ASTM D5470 对 TIM（热界面材料）进行常规质量控制的台式测试仪。</strong></p><ul><li>25.4 mm（1"）测试头，最大 150 N，样品温度最高 60 °C</li><li>自动测量厚度和压力，支持压力扫描和粘接层厚度扫描，计算热阻和导热系数</li><li>开机自动检查；操作员清洁并装入样品，设备自动完成测量</li><li>技术员运行已保存的预设并获得合格/不合格结果；预设由工程师创建</li></ul><div class="notincl"><strong>不包括：</strong>温度扫描、固化、泵出（pump-out）和老化测试。</div></div>',
    ja: '<p>以下の短い説明をお読みください。次の質問はこの内容に関するものです。</p><div class="concept"><p><strong>TIM（熱界面材料）の定常品質管理をASTM D5470に準拠して行う卓上型試験装置。</strong></p><ul><li>25.4 mm（1"）測定ヘッド、最大150 N、サンプル温度は最高60 °C</li><li>厚さと圧力の自動測定、圧力スイープとボンドライン厚さ（BLT）スイープ、熱抵抗と熱伝導率の算出</li><li>起動時に自動チェック。オペレーターがサンプルを清掃・装着すると、装置が測定を行う</li><li>技術者は保存済みのプリセットで試験を実行し、合否判定を得る。プリセットはエンジニアが作成</li></ul><div class="notincl"><strong>含まれないもの：</strong>温度スイープ、硬化試験、ポンプアウト試験、経年劣化試験。</div></div>',
  },
  'Q11.t': {
    en: 'How interested would your organisation be in a device like this?',
    zh: '贵单位对这样的设备感兴趣程度如何？',
    ja: 'このような装置に、貴社はどの程度関心がありますか？',
  },
  'Q11.end.1': {
    en: 'Not at all interested',
    zh: '完全不感兴趣',
    ja: 'まったく関心がない',
  },
  'Q11.end.2': {
    en: 'Very interested',
    zh: '非常感兴趣',
    ja: '非常に関心がある',
  },
  'Q12.t': {
    en: 'What purchase price would you consider reasonable for this device?',
    zh: '您认为该设备合理的购买价格是多少？',
    ja: 'この装置の購入価格として、妥当だと思う金額はいくらですか？',
  },
  'Q12.h': {
    en: 'Excluding VAT and service contracts. Enter an amount in euros.',
    zh: '不含增值税和服务合同。请输入欧元金额。',
    ja: '付加価値税（VAT）とサービス契約は含みません。ユーロで金額をご入力ください。',
  },
  'Q13.t': {
    en: 'At what purchase price would it become too expensive to consider?',
    zh: '购买价格达到多少时，您会觉得太贵而不予考虑？',
    ja: '購入価格がいくらになると、高すぎて検討対象外になりますか？',
  },
  'gate.t': {
    en: 'Would you like to answer some more detailed questions?',
    zh: '您愿意回答一些更详细的问题吗？',
    ja: 'もう少し詳しい質問にご回答いただけますか？',
  },
  'gate.o1': {
    en: 'Yes, continue with the detailed questions',
    zh: '是，继续回答详细问题',
    ja: 'はい、詳しい質問に進む',
  },
  'gate.o2': {
    en: 'No, finish the survey now',
    zh: '否，现在结束问卷',
    ja: 'いいえ、ここでアンケートを終了する',
  },
  'p2intro.t': {
    en: 'Part 2: detailed questions',
    zh: '第 2 部分：详细问题',
    ja: 'パート2：詳しい質問',
  },
  'p2intro.btn': {
    en: 'Start Part 2',
    zh: '开始第 2 部分',
    ja: 'パート2を始める',
  },
  'p2intro.body': {
    en: '<p>In these questions, <strong>one measurement</strong> means testing one sample, including all of its pressure or thickness steps.</p>',
    zh: '<p>在以下问题中，<strong>一次测量</strong>是指测试一个样品，包括其所有压力或厚度步骤。</p>',
    ja: '<p>以下の質問では、<strong>1回の測定</strong>とは、1つのサンプルを、すべての圧力ステップまたは厚さステップを含めて試験することを指します。</p>',
  },
  'D01.t': {
    en: 'Roughly how many TIM measurements does your QC need per month, including tests sent outside?',
    zh: '您的质检每月大约需要多少次 TIM 测量（包括外送测试）？',
    ja: '外部委託分を含め、品質管理で月に何回程度のTIM測定が必要ですか？',
  },
  'D01.o1': {
    en: 'Fewer than 10',
    zh: '少于 10 次',
    ja: '10回未満',
  },
  'D01.o2': {
    en: '10–50',
    zh: '10–50',
    ja: '10–50',
  },
  'D01.o3': {
    en: '51–200',
    zh: '51–200',
    ja: '51–200',
  },
  'D01.o4': {
    en: '201–500',
    zh: '201–500',
    ja: '201–500',
  },
  'D01.o5': {
    en: 'More than 500',
    zh: '超过 500 次',
    ja: '500回超',
  },
  'D02.t': {
    en: 'Which TIM types do you need to test?',
    zh: '您需要测试哪些类型的 TIM？',
    ja: '試験が必要なTIMの種類はどれですか？',
  },
  'D02.o1': {
    en: 'Thermal greases / pastes',
    zh: '导热膏 / 导热硅脂',
    ja: '放熱グリス／ペースト',
  },
  'D02.o2': {
    en: 'Thermal pads / gap pads',
    zh: '导热垫片 / 间隙垫',
    ja: '放熱パッド／ギャップパッド',
  },
  'D02.o3': {
    en: 'Dispensable gap fillers',
    zh: '可点胶的导热填隙剂',
    ja: 'ディスペンス型ギャップフィラー',
  },
  'D02.o4': {
    en: 'Phase change materials (PCM)',
    zh: '相变材料（PCM）',
    ja: '相変化材料（PCM）',
  },
  'D02.o5': {
    en: 'Thermal adhesives',
    zh: '导热胶粘剂',
    ja: '放熱接着剤',
  },
  'D02.o6': {
    en: 'Graphite or metal foils',
    zh: '石墨片或金属箔',
    ja: 'グラファイトシートまたは金属箔',
  },
  'D02.o7': {
    en: 'Solders / liquid metals',
    zh: '焊料 / 液态金属',
    ja: 'はんだ／液体金属',
  },
  'D03.t': {
    en: 'What sample thickness or bond line thickness do you test?',
    zh: '您测试的样品厚度或粘接层厚度是多少？',
    ja: '試験するサンプルの厚さ、またはボンドライン厚さ（BLT）はどれくらいですか？',
  },
  'D03.o1': {
    en: 'Less than 50 µm',
    zh: '小于 50 µm',
    ja: '50 µm未満',
  },
  'D03.o2': {
    en: '50–200 µm',
    zh: '50–200 µm',
    ja: '50–200 µm',
  },
  'D03.o3': {
    en: '0.2–1 mm',
    zh: '0.2–1 mm',
    ja: '0.2–1 mm',
  },
  'D03.o4': {
    en: '1–3 mm',
    zh: '1–3 mm',
    ja: '1–3 mm',
  },
  'D03.o5': {
    en: 'More than 3 mm',
    zh: '大于 3 mm',
    ja: '3 mm超',
  },
  'D04.t': {
    en: 'Does a 25.4 mm (1") square or round test area suit your samples?',
    zh: '25.4 mm（1"）的方形或圆形测试面积是否适合您的样品？',
    ja: '25.4 mm（1"）の正方形または円形の測定面積は、貴社のサンプルに適していますか？',
  },
  'D04.o1': {
    en: 'Yes, it suits our samples',
    zh: '是，适合我们的样品',
    ja: 'はい、当社のサンプルに適している',
  },
  'D04.o2': {
    en: 'No, we need a smaller area',
    zh: '否，我们需要更小的面积',
    ja: 'いいえ、より小さい面積が必要',
  },
  'D04.o3': {
    en: 'No, we need a larger area',
    zh: '否，我们需要更大的面积',
    ja: 'いいえ、より大きい面積が必要',
  },
  'D04.o4': {
    en: 'No, we need another shape or format (e.g. rectangular strips; please specify)',
    zh: '否，我们需要其他形状或规格（例如矩形条；请注明）',
    ja: 'いいえ、別の形状・サイズが必要（例：長方形の短冊状。具体的にご記入ください）',
  },
  'D04.o99': {
    en: 'Not sure',
    zh: '不确定',
    ja: 'よくわからない',
  },
  'D05.t': {
    en: 'What is the longest acceptable time for one measurement, from loading the sample to the result?',
    zh: '一次测量从装入样品到得出结果，最长可接受多长时间？',
    ja: 'サンプルの装着から結果が出るまで、1回の測定に許容できる最長時間はどれくらいですか？',
  },
  'D05.h': {
    en: 'Excludes sample preparation. Choose one.',
    zh: '不包括样品准备时间。请选择一项。',
    ja: 'サンプルの準備時間は含みません。1つお選びください。',
  },
  'D05.o1': {
    en: 'Less than 5 minutes',
    zh: '少于 5 分钟',
    ja: '5分未満',
  },
  'D05.o2': {
    en: '5–15 minutes',
    zh: '5–15 分钟',
    ja: '5～15分',
  },
  'D05.o3': {
    en: '15–30 minutes',
    zh: '15–30 分钟',
    ja: '15～30分',
  },
  'D05.o4': {
    en: '30–60 minutes',
    zh: '30–60 分钟',
    ja: '30～60分',
  },
  'D05.o5': {
    en: 'More than 60 minutes',
    zh: '超过 60 分钟',
    ja: '60分超',
  },
  'D05.o98': {
    en: 'Depends on the test (please specify)',
    zh: '视测试而定（请注明）',
    ja: '試験内容による（具体的にご記入ください）',
  },
  'D06.t': {
    en: 'How much may the measured thermal resistance vary when the same sample is measured again?',
    zh: '同一样品重复测量时，测得的热阻允许有多大偏差？',
    ja: '同じサンプルを再測定したとき、測定された熱抵抗のばらつきはどの程度まで許容されますか？',
  },
  'D06.o1': {
    en: 'Less than ±1%',
    zh: '小于 ±1%',
    ja: '±1%未満',
  },
  'D06.o2': {
    en: '±1–2%',
    zh: '±1–2%',
    ja: '±1–2%',
  },
  'D06.o3': {
    en: '±2–5%',
    zh: '±2–5%',
    ja: '±2–5%',
  },
  'D06.o4': {
    en: '±5–10%',
    zh: '±5–10%',
    ja: '±5–10%',
  },
  'D06.o5': {
    en: 'More variation is acceptable',
    zh: '可以接受更大的偏差',
    ja: 'これより大きなばらつきも許容できる',
  },
  'D06.o6': {
    en: 'We use a defined criterion (please specify, e.g. as % or K·cm²/W)',
    zh: '我们有明确的判定标准（请注明，例如以 % 或 K·cm²/W 表示）',
    ja: '社内で定めた基準がある（具体的にご記入ください。例：%またはK·cm²/W）',
  },
  'D07.t': {
    en: 'Which sample-handling issues cause the most trouble in your TIM testing?',
    zh: '在 TIM 测试中，哪些样品处理问题最令人困扰？',
    ja: 'TIM試験で最も困っているサンプル取り扱い上の問題はどれですか？',
  },
  'D07.o1': {
    en: 'Applying the sample consistently',
    zh: '难以一致地涂敷或放置样品',
    ja: 'サンプルを均一に塗布・配置すること',
  },
  'D07.o2': {
    en: 'Controlling the bond line thickness',
    zh: '控制粘接层厚度',
    ja: 'ボンドライン厚さの制御',
  },
  'D07.o3': {
    en: 'Material squeezing out',
    zh: '材料被挤出',
    ja: '材料のはみ出し',
  },
  'D07.o4': {
    en: 'Trapped air or voids',
    zh: '夹杂空气或空洞',
    ja: '気泡やボイドの混入',
  },
  'D07.o5': {
    en: 'Cleaning the test surfaces between samples',
    zh: '在样品之间清洁测试面',
    ja: 'サンプルごとの測定面の清掃',
  },
  'D07.o6': {
    en: 'Very soft, sticky or liquid materials',
    zh: '非常软、粘或呈液态的材料',
    ja: '非常に柔らかい、粘着性のある、または液状の材料',
  },
  'D07.o7': {
    en: 'No major issues',
    zh: '没有大问题',
    ja: '大きな問題はない',
  },
  'D08.t': {
    en: 'The operator prepares and loads each sample by hand; the device then measures automatically. How well does this fit your workflow?',
    zh: '操作员手动准备并装入每个样品，然后设备自动测量。这与您的工作流程匹配程度如何？',
    ja: 'オペレーターが各サンプルを手作業で準備・装着し、その後装置が自動で測定します。これは貴社の作業フローにどの程度合っていますか？',
  },
  'D08.o1': {
    en: 'Fits well',
    zh: '非常匹配',
    ja: 'よく合っている',
  },
  'D08.o2': {
    en: 'Fits, if loading a sample is quick and simple',
    zh: '匹配，前提是装样快速简单',
    ja: 'サンプルの装着が素早く簡単なら合っている',
  },
  'D08.o3': {
    en: 'Acceptable, but we would prefer more automation',
    zh: '可以接受，但我们更希望自动化程度更高',
    ja: '許容できるが、もっと自動化してほしい',
  },
  'D08.o4': {
    en: 'Not suitable: we need automatic sample loading',
    zh: '不适合：我们需要自动装样',
    ja: '合わない：自動サンプル装着が必要',
  },
  'D08.o5': {
    en: 'Not suitable: other reason (please specify)',
    zh: '不适合：其他原因（请注明）',
    ja: '合わない：その他の理由（具体的にご記入ください）',
  },
  'D09.t': {
    en: 'Who would operate the device day to day?',
    zh: '日常由谁操作该设备？',
    ja: '日常的に装置を操作するのは誰ですか？',
  },
  'D09.o1': {
    en: 'Production operator without lab training',
    zh: '未经实验室培训的生产操作员',
    ja: '試験室の訓練を受けていない生産オペレーター',
  },
  'D09.o2': {
    en: 'Trained lab technician',
    zh: '受过培训的实验室技术员',
    ja: '訓練を受けた試験室の技術者',
  },
  'D09.o3': {
    en: 'QC engineer',
    zh: '质检工程师',
    ja: '品質管理エンジニア',
  },
  'D09.o5': {
    en: 'A mix of the above',
    zh: '以上人员混合',
    ja: '上記の組み合わせ',
  },
  'D09.o6': {
    en: 'Not decided yet',
    zh: '尚未决定',
    ja: 'まだ決まっていない',
  },
  'D10.t': {
    en: 'These could be offered in addition. How should each one be handled?',
    zh: '以下功能可作为额外选项提供。您希望如何处理每一项？',
    ja: '以下はオプションとして提供される可能性があります。それぞれどのように扱うべきですか？',
  },
  'D10.h': {
    en: 'Rate each one.',
    zh: '请逐项评价。',
    ja: 'それぞれ評価してください。',
  },
  'D10.row.1': {
    en: 'Automatic sample loading',
    zh: '自动装样',
    ja: 'サンプルの自動装着',
  },
  'D10.row.2': {
    en: 'Automatic cleaning of the test surfaces',
    zh: '自动清洁测试面',
    ja: '測定面の自動清掃',
  },
  'D10.row.3': {
    en: 'Automatic test-head alignment',
    zh: '测试头自动对准',
    ja: '測定ヘッドの自動アライメント',
  },
  'D10.row.4': {
    en: 'Automatic reports',
    zh: '自动生成报告',
    ja: 'レポートの自動作成',
  },
  'D10.row.5': {
    en: 'Measurement under vacuum',
    zh: '真空环境下测量',
    ja: '真空中での測定',
  },
  'D10.col.1': {
    en: 'Mandatory',
    zh: '必须标配',
    ja: '標準装備が必須',
  },
  'D10.col.2': {
    en: 'Paid add-on',
    zh: '付费选配',
    ja: '有償オプション可',
  },
  'D10.col.3': {
    en: 'Not needed',
    zh: '不需要',
    ja: '不要',
  },
  'D10.col.4': {
    en: 'Can’t assess',
    zh: '无法评估',
    ja: '判断できない',
  },
  'S1.t': {
    en: 'How often would servicing be acceptable, including test-head alignment and thermocouple calibration?',
    zh: '包括测试头对准和热电偶校准在内，多久进行一次维护可以接受？',
    ja: '測定ヘッドのアライメントと熱電対の校正を含め、メンテナンスはどのくらいの頻度なら許容できますか？',
  },
  'S1.o1': {
    en: 'Every 3 months',
    zh: '每 3 个月',
    ja: '3か月ごと',
  },
  'S1.o2': {
    en: 'Every 6 months',
    zh: '每 6 个月',
    ja: '6か月ごと',
  },
  'S1.o3': {
    en: 'Once a year',
    zh: '每年一次',
    ja: '年1回',
  },
  'S1.o4': {
    en: 'Every 2 years',
    zh: '每 2 年',
    ja: '2年ごと',
  },
  'S2.t': {
    en: 'How long may a service take the device out of use?',
    zh: '一次维护期间设备最长可以停用多久？',
    ja: '1回のメンテナンスで装置が使えなくなる期間は、最長どのくらいまで許容できますか？',
  },
  'S2.o1': {
    en: 'Up to 2 hours',
    zh: '最多 2 小时',
    ja: '2時間まで',
  },
  'S2.o2': {
    en: 'Up to 1 working day',
    zh: '最多 1 个工作日',
    ja: '1営業日まで',
  },
  'S2.o3': {
    en: '2–3 working days',
    zh: '2–3 个工作日',
    ja: '2～3営業日',
  },
  'S2.o4': {
    en: 'Up to 1 week',
    zh: '最多 1 周',
    ja: '1週間まで',
  },
  'S2.o5': {
    en: 'Longer, if a replacement device is provided',
    zh: '更长，前提是提供替代设备',
    ja: '代替機が提供されるなら、それ以上でもよい',
  },
  'S3.t': {
    en: 'Which servicing tasks would your team be comfortable doing themselves?',
    zh: '您的团队愿意自行完成哪些维护工作？',
    ja: '貴社のチームが自分たちで行ってもよいメンテナンス作業はどれですか？',
  },
  'S3.h': {
    en: 'Choose all that apply. Anything you don’t tick would be done by the manufacturer.',
    zh: '可多选。未勾选的工作将由制造商完成。',
    ja: '当てはまるものをすべてお選びください。チェックしなかった作業はメーカーが行います。',
  },
  'S3.o1': {
    en: 'Aligning the test heads',
    zh: '对准测试头',
    ja: '測定ヘッドのアライメント',
  },
  'S3.o2': {
    en: 'Calibrating the thermocouples',
    zh: '校准热电偶',
    ja: '熱電対の校正',
  },
  'S3.o3': {
    en: 'Replacing wear parts (e.g. test-head surfaces)',
    zh: '更换易损件（例如测试头表面）',
    ja: '消耗部品の交換（例：測定ヘッドの表面）',
  },
  'S3.o4': {
    en: 'Installing software updates',
    zh: '安装软件更新',
    ja: 'ソフトウェアアップデートのインストール',
  },
  'S3.o5': {
    en: 'Replacing sensors or electronic parts',
    zh: '更换传感器或电子部件',
    ja: 'センサーや電子部品の交換',
  },
  'S3.o6': {
    en: 'None: the manufacturer should do everything',
    zh: '都不做：全部由制造商完成',
    ja: 'なし：すべてメーカーに任せたい',
  },
  'S4.t': {
    en: 'How should servicing work for you?',
    zh: '您希望维护服务以什么方式进行？',
    ja: 'メンテナンスはどのような形で行うのが望ましいですか？',
  },
  'S4.o1': {
    en: 'A technician comes and does the service',
    zh: '技术人员上门进行维护',
    ja: '技術者が来訪してメンテナンスを行う',
  },
  'S4.o2': {
    en: 'A technician comes and trains our staff',
    zh: '技术人员上门培训我们的员工',
    ja: '技術者が来訪して当社スタッフを教育する',
  },
  'S4.o3': {
    en: 'We follow a detailed service manual',
    zh: '我们按照详细的维护手册操作',
    ja: '詳細なサービスマニュアルに従って当社で行う',
  },
  'S4.o4': {
    en: 'We use an online video course',
    zh: '我们使用在线视频课程',
    ja: 'オンライン動画講座を利用する',
  },
  'S4.o5': {
    en: 'A remote expert guides us through it',
    zh: '远程专家指导我们完成',
    ja: 'リモートの専門家の指示を受けながら行う',
  },
  'S5.t': {
    en: 'Do you need a calibration certificate for the device?',
    zh: '您是否需要该设备的校准证书？',
    ja: '装置の校正証明書は必要ですか？',
  },
  'S5.o1': {
    en: 'Yes, we need a certificate',
    zh: '是，我们需要证书',
    ja: 'はい、証明書が必要',
  },
  'S5.o2': {
    en: 'No certificate needed',
    zh: '不需要证书',
    ja: '証明書は不要',
  },
  'S5b.t': {
    en: 'Which requirement must the certificate meet?',
    zh: '证书必须满足哪些要求？',
    ja: '証明書はどの要件を満たす必要がありますか？',
  },
  'S5b.o1': {
    en: 'Calibration from an accredited lab under ISO/IEC 17025 (e.g. DAkkS, UKAS, A2LA, CNAS)',
    zh: '由符合 ISO/IEC 17025 的认可实验室进行校准（例如 DAkkS、UKAS、A2LA、CNAS）',
    ja: 'ISO/IEC 17025認定試験所による校正（例：DAkkS、UKAS、A2LA、CNAS）',
  },
  'S5b.o2': {
    en: 'Manufacturer’s certificate that meets our ISO 9001 requirements',
    zh: '符合我们 ISO 9001 要求的制造商证书',
    ja: '当社のISO 9001要件を満たすメーカー発行の証明書',
  },
  'S5b.o3': {
    en: 'Requirements from IATF 16949 (automotive)',
    zh: 'IATF 16949（汽车行业）的要求',
    ja: 'IATF 16949（自動車）の要件',
  },
  'S5b.o4': {
    en: 'A customer-specific requirement (please specify)',
    zh: '客户的特定要求（请注明）',
    ja: '顧客固有の要件（具体的にご記入ください）',
  },
  'D11.t': {
    en: 'When might your organisation buy TIM QC test equipment?',
    zh: '贵单位何时可能采购 TIM 质检测试设备？',
    ja: '貴社がTIM品質管理試験装置を購入する時期は、いつ頃になりそうですか？',
  },
  'D11.o1': {
    en: 'Within 12 months',
    zh: '12 个月内',
    ja: '12か月以内',
  },
  'D11.o2': {
    en: 'In 12–24 months',
    zh: '12–24 个月内',
    ja: '12～24か月以内',
  },
  'D11.o3': {
    en: 'Later than 24 months',
    zh: '24 个月以后',
    ja: '24か月より先',
  },
  'D11.o4': {
    en: 'No plans',
    zh: '暂无计划',
    ja: '予定なし',
  },
  'R01.t': {
    en: 'How many of your customers might need thermal QC testing of TIMs in-house?',
    zh: '您的客户中，可能有多少家需要在内部对 TIM 进行热性能质检？',
    ja: '貴社の顧客のうち、TIMの熱性能の品質管理試験を社内で行う必要がありそうなのは何社くらいですか？',
  },
  'R01.o1': {
    en: 'None',
    zh: '没有',
    ja: 'なし',
  },
  'R01.o2': {
    en: '1–2',
    zh: '1–2',
    ja: '1–2',
  },
  'R01.o3': {
    en: '3–5',
    zh: '3–5',
    ja: '3–5',
  },
  'R01.o4': {
    en: '6–10',
    zh: '6–10',
    ja: '6–10',
  },
  'R01.o5': {
    en: '11–20',
    zh: '11–20',
    ja: '11–20',
  },
  'R01.o6': {
    en: '21–50',
    zh: '21–50',
    ja: '21–50',
  },
  'R01.o7': {
    en: '51–100',
    zh: '51–100',
    ja: '51–100',
  },
  'R01.o8': {
    en: 'More than 100',
    zh: '超过 100',
    ja: '100超',
  },
  'R02.t': {
    en: 'Which industries ask most about TIM testing?',
    zh: '哪些行业最常咨询 TIM 测试？',
    ja: 'TIM試験について最も問い合わせが多い業界はどれですか？',
  },
  'conceptD.body': {
    en: '<p>Please read this short description. The next questions refer to it; answer them with your customers in mind.</p><div class="concept"><p><strong>A desktop tester for routine TIM quality control to ASTM D5470.</strong></p><ul><li>25.4 mm (1") test heads, up to 150 N, sample temperature up to 60 °C</li><li>Automatic thickness and pressure measurement, pressure and bond line thickness sweeps, thermal resistance and conductivity</li><li>Automatic start-up checks; the operator cleans and loads the sample, the device measures</li><li>Technicians run saved presets and get a pass/fail result; engineers create the presets</li></ul><div class="notincl"><strong>Not included:</strong> temperature sweeps, curing, pump-out and ageing tests.</div></div>',
    zh: '<p>请阅读以下简短说明。接下来的问题将以此为基础，请从您客户的角度作答。</p><div class="concept"><p><strong>一款按照 ASTM D5470 对 TIM（热界面材料）进行常规质量控制的台式测试仪。</strong></p><ul><li>25.4 mm（1"）测试头，最大 150 N，样品温度最高 60 °C</li><li>自动测量厚度和压力，支持压力扫描和粘接层厚度扫描，计算热阻和导热系数</li><li>开机自动检查；操作员清洁并装入样品，设备自动完成测量</li><li>技术员运行已保存的预设并获得合格/不合格结果；预设由工程师创建</li></ul><div class="notincl"><strong>不包括：</strong>温度扫描、固化、泵出（pump-out）和老化测试。</div></div>',
    ja: '<p>以下の短い説明をお読みください。次の質問はこの内容に関するものです。顧客の立場でお答えください。</p><div class="concept"><p><strong>TIM（熱界面材料）の定常品質管理をASTM D5470に準拠して行う卓上型試験装置。</strong></p><ul><li>25.4 mm（1"）測定ヘッド、最大150 N、サンプル温度は最高60 °C</li><li>厚さと圧力の自動測定、圧力スイープとボンドライン厚さ（BLT）スイープ、熱抵抗と熱伝導率の算出</li><li>起動時に自動チェック。オペレーターがサンプルを清掃・装着すると、装置が測定を行う</li><li>技術者は保存済みのプリセットで試験を実行し、合否判定を得る。プリセットはエンジニアが作成</li></ul><div class="notincl"><strong>含まれないもの：</strong>温度スイープ、硬化試験、ポンプアウト試験、経年劣化試験。</div></div>',
  },
  'R03.t': {
    en: 'Which features matter most to your customers in a TIM quality control device? Put them in order.',
    zh: '对于 TIM 质检设备，哪些功能对您的客户最重要？请排出顺序。',
    ja: 'TIM品質管理装置で、貴社の顧客にとって最も重要な機能はどれですか？優先順位を付けてください。',
  },
  'R04.t': {
    en: 'Why might your customers decide against buying this device?',
    zh: '您的客户可能出于什么原因决定不购买该设备？',
    ja: '貴社の顧客がこの装置を購入しない理由として、考えられるものは何ですか？',
  },
  'R04.o1': {
    en: 'Purchase price too high',
    zh: '购买价格太高',
    ja: '購入価格が高すぎる',
  },
  'R04.o2': {
    en: 'Running costs too high (service, calibration)',
    zh: '运行成本太高（维护、校准）',
    ja: 'ランニングコストが高すぎる（メンテナンス、校正）',
  },
  'R04.o3': {
    en: 'They already have a NANOTEST TIMA or another ASTM D5470 tester',
    zh: '他们已有 NANOTEST TIMA 或其他 ASTM D5470 测试仪',
    ja: 'すでにNANOTEST TIMAまたは他のASTM D5470試験装置を保有している',
  },
  'R04.o4': {
    en: 'They would rather buy the full TIMA because they also need R&D functions',
    zh: '他们更愿意购买完整版 TIMA，因为还需要研发功能',
    ja: '研究開発機能も必要なため、フル仕様のTIMAを選ぶ',
  },
  'R04.o5': {
    en: 'Too complex; needs a specialist to operate',
    zh: '太复杂，需要专业人员操作',
    ja: '操作が複雑で、専門家が必要',
  },
  'R04.o6': {
    en: 'Test volume too low',
    zh: '测试量太少',
    ja: '試験数が少なすぎる',
  },
  'R04.o7': {
    en: 'An external lab is good enough',
    zh: '外部实验室已足够',
    ja: '外部の試験機関で十分',
  },
  'R04.o8': {
    en: 'Measurements take too long',
    zh: '测量耗时太长',
    ja: '測定に時間がかかりすぎる',
  },
  'R04.o9': {
    en: 'No local service or support',
    zh: '缺乏本地服务或支持',
    ja: '現地のサービスやサポートがない',
  },
  'R04.o11': {
    en: 'No major obstacles',
    zh: '没有大的障碍',
    ja: '大きな障害はない',
  },
  'R05.t': {
    en: 'Which of these limits would stop your customers from buying a QC tester?',
    zh: '以下哪些限制会让您的客户放弃购买质检测试仪？',
    ja: '次のうち、顧客が品質管理試験装置の購入を見送る原因になりそうな制限はどれですか？',
  },
  'R05.o1': {
    en: 'No temperature sweeps',
    zh: '不支持温度扫描',
    ja: '温度スイープに非対応',
  },
  'R05.o2': {
    en: 'Maximum average sample temperature of 60 °C',
    zh: '样品平均温度最高 60 °C',
    ja: 'サンプル平均温度が最高60 °C',
  },
  'R05.o3': {
    en: 'Maximum contact pressure of about 250 kPa (36 psi)',
    zh: '最大接触压力约 250 kPa（36 psi）',
    ja: '最大接触圧力が約250 kPa（36 psi）',
  },
  'R05.o4': {
    en: '25.4 mm (1") test area only',
    zh: '仅限 25.4 mm（1"）测试面积',
    ja: '測定面積が25.4 mm（1"）のみ',
  },
  'R05.o5': {
    en: 'Manual sample loading',
    zh: '手动装样',
    ja: 'サンプルの手動装着',
  },
  'R05.o6': {
    en: 'No curing, pump-out or ageing tests',
    zh: '不支持固化、泵出或老化测试',
    ja: '硬化・ポンプアウト・経年劣化試験に非対応',
  },
  'R05.o8': {
    en: 'None of these',
    zh: '以上皆无',
    ja: 'いずれも該当しない',
  },
  'R06.t': {
    en: 'What purchase price would your customers consider reasonable for this device?',
    zh: '您的客户认为该设备合理的购买价格是多少？',
    ja: '貴社の顧客は、この装置の購入価格としていくらが妥当だと考えると思いますか？',
  },
  'R07.t': {
    en: 'At what purchase price would it become too expensive for your customers?',
    zh: '购买价格达到多少时，您的客户会觉得太贵？',
    ja: '購入価格がいくらになると、顧客にとって高すぎますか？',
  },
  'R08.t': {
    en: 'What would you need from NANOTEST to sell this device?',
    zh: '您需要 NANOTEST 提供什么支持来销售该设备？',
    ja: 'この装置を販売するために、NANOTESTからどのような支援が必要ですか？',
  },
  'R08.o1': {
    en: 'Demo unit',
    zh: '演示样机',
    ja: 'デモ機',
  },
  'R08.o2': {
    en: 'Sales and application training',
    zh: '销售和应用培训',
    ja: '販売・アプリケーション研修',
  },
  'R08.o3': {
    en: 'Service training for your technicians',
    zh: '为贵方技术人员提供维修培训',
    ja: '貴社技術者向けのサービス研修',
  },
  'R08.o4': {
    en: 'Marketing material in the local language',
    zh: '本地语言的营销资料',
    ja: '現地語の販促資料',
  },
  'R08.o5': {
    en: 'Device software in the local language',
    zh: '本地语言的设备软件',
    ja: '現地語の装置ソフトウェア',
  },
  'R08.o6': {
    en: 'Local spare parts stock',
    zh: '本地备件库存',
    ja: '現地での予備部品在庫',
  },
  'R08.o7': {
    en: 'Joint customer visits',
    zh: '联合拜访客户',
    ja: '顧客への同行訪問',
  },
  'R09.t': {
    en: 'How many units could you realistically sell per year?',
    zh: '您每年实际能销售多少台？',
    ja: '年間で現実的に何台販売できそうですか？',
  },
  'R09.o1': {
    en: '0',
    zh: '0',
    ja: '0',
  },
  'dgate.t': {
    en: 'Would you like to share more about your customers’ requirements?',
    zh: '您愿意进一步介绍客户的需求吗？',
    ja: '顧客の要件について、さらに詳しく教えていただけますか？',
  },
  'dgate.done': {
    en: 'Thank you – the distributor questions are done',
    zh: '谢谢——经销商问题已完成',
    ja: 'ありがとうございます。販売代理店向けの質問は以上です',
  },
  'dgate.o1': {
    en: 'Yes, continue',
    zh: '是，继续',
    ja: 'はい、続ける',
  },
  'RT1.t': {
    en: 'What is the highest contact pressure your customers typically need?',
    zh: '您的客户通常需要的最高接触压力是多少？',
    ja: '顧客が通常必要とする最大接触圧力はどれくらいですか？',
  },
  'RT2.t': {
    en: 'What average sample temperature do your customers typically need?',
    zh: '您的客户通常需要的样品平均温度是多少？',
    ja: '顧客が通常必要とするサンプル平均温度は何度ですか？',
  },
  'RT3.t': {
    en: 'Does a 25.4 mm (1") square or round test area suit most of your customers’ samples?',
    zh: '25.4 mm（1"）的方形或圆形测试面积是否适合您大多数客户的样品？',
    ja: '25.4 mm（1"）の正方形または円形の測定面積は、大半の顧客のサンプルに適していますか？',
  },
  'RT3.o1': {
    en: 'Yes, it suits most samples',
    zh: '是，适合大多数样品',
    ja: 'はい、大半のサンプルに適している',
  },
  'RT3.o2': {
    en: 'No, they need a smaller area',
    zh: '否，他们需要更小的面积',
    ja: 'いいえ、より小さい面積が必要',
  },
  'RT3.o3': {
    en: 'No, they need a larger area',
    zh: '否，他们需要更大的面积',
    ja: 'いいえ、より大きい面積が必要',
  },
  'RT3.o4': {
    en: 'No, they need another shape or format (please specify)',
    zh: '否，他们需要其他形状或规格（请注明）',
    ja: 'いいえ、別の形状・サイズが必要（具体的にご記入ください）',
  },
  'RT4.t': {
    en: 'How much may the measured thermal resistance vary for your customers when the same sample is measured again?',
    zh: '对您的客户而言，同一样品重复测量时，测得的热阻允许有多大偏差？',
    ja: '顧客にとって、同じサンプルを再測定したときの熱抵抗のばらつきはどの程度まで許容されますか？',
  },
  'RT11.t': {
    en: 'Which service tasks could your team take over for customers?',
    zh: '您的团队可以为客户承担哪些服务工作？',
    ja: '貴社のチームが顧客向けに引き受けられるサービス業務はどれですか？',
  },
  'RT11.o1': {
    en: 'Installation and commissioning',
    zh: '安装和调试',
    ja: '設置と立ち上げ',
  },
  'RT11.o2': {
    en: 'Operator training',
    zh: '操作员培训',
    ja: 'オペレーター研修',
  },
  'RT11.o3': {
    en: 'Routine servicing',
    zh: '日常维护',
    ja: '定期メンテナンス',
  },
  'RT11.o4': {
    en: 'Test-head alignment and thermocouple calibration',
    zh: '测试头对准和热电偶校准',
    ja: '測定ヘッドのアライメントと熱電対の校正',
  },
  'RT11.o5': {
    en: 'Replacing wear parts',
    zh: '更换易损件',
    ja: '消耗部品の交換',
  },
  'RT11.o6': {
    en: 'Repairs and sensor replacement',
    zh: '维修和更换传感器',
    ja: '修理とセンサー交換',
  },
  'RT12.t': {
    en: 'Any other technical requirement your customers often mention?',
    zh: '您的客户经常提到哪些其他技术要求？',
    ja: '顧客からよく挙がるその他の技術的要件はありますか？',
  },
  'RT12.h': {
    en: 'Optional.',
    zh: '选填。',
    ja: '任意。',
  },
  'G1.t': {
    en: 'Is anything missing that you would need in this device?',
    zh: '该设备是否缺少您需要的功能？',
    ja: 'この装置に、必要なのに欠けているものはありますか？',
  },
  'G2.t': {
    en: 'Would you like any of the following?',
    zh: '您是否希望获得以下内容？',
    ja: '以下のうち、ご希望のものはありますか？',
  },
  'G2.o1': {
    en: 'Send me a summary of the results',
    zh: '请将调研结果摘要发送给我',
    ja: '調査結果の概要を送ってほしい',
  },
  'G2.o2': {
    en: 'Contact me for a 15-minute follow-up interview',
    zh: '请联系我进行 15 分钟的后续访谈',
    ja: '15分程度のフォローアップインタビューの連絡がほしい',
  },
  'G2.o3': {
    en: 'I’d like to test an early prototype of the device',
    zh: '我希望试用设备的早期样机',
    ja: '装置の初期試作機を試してみたい',
  },
  'RT5.t': {
    en: 'Which TIM types do your customers mainly need to test?',
    zh: '您的客户主要需要测试哪些类型的 TIM？',
    ja: '顧客が主に試験する必要があるTIMの種類はどれですか？',
  },
  'RT6.t': {
    en: 'Your customers would prepare and load each sample by hand; the device then measures automatically. How well would this fit their workflow?',
    zh: '您的客户将手动准备并装入每个样品，然后设备自动测量。这与他们的工作流程匹配程度如何？',
    ja: '顧客は各サンプルを手作業で準備・装着し、その後装置が自動で測定します。これは顧客の作業フローにどの程度合っていますか？',
  },
  'RT7.t': {
    en: 'Who would typically operate the device at your customers?',
    zh: '在您的客户处，通常由谁日常操作该设备？',
    ja: '顧客先で日常的に装置を操作するのは、通常誰ですか？',
  },
  'RT8.t': {
    en: 'These could be offered in addition. How should each one be handled for your customers?',
    zh: '以下功能可作为额外选项提供。对您的客户而言，每一项应如何处理？',
    ja: '以下はオプションとして提供される可能性があります。顧客にとって、それぞれどのように扱うべきですか？',
  },
  'RT9.t': {
    en: 'How often would servicing be acceptable for your customers, including test-head alignment and thermocouple calibration?',
    zh: '包括测试头对准和热电偶校准在内，您的客户多久进行一次维护可以接受？',
    ja: '測定ヘッドのアライメントと熱電対の校正を含め、顧客にとってメンテナンスはどのくらいの頻度なら許容できますか？',
  },
  'RT10.t': {
    en: 'How should servicing work for your customers?',
    zh: '您的客户希望维护服务以什么方式进行？',
    ja: '顧客にとって、メンテナンスはどのような形で行うのが望ましいですか？',
  },
  'RT10.o2': {
    en: 'A technician comes and trains their staff',
    zh: '技术人员上门培训他们的员工',
    ja: '技術者が来訪して顧客のスタッフを教育する',
  },
  'RT10.o3': {
    en: 'They follow a detailed service manual',
    zh: '他们按照详细的维护手册操作',
    ja: '顧客が詳細なサービスマニュアルに従って行う',
  },
  'RT10.o4': {
    en: 'They use an online video course',
    zh: '他们使用在线视频课程',
    ja: '顧客がオンライン動画講座を利用する',
  },
  'RT10.o5': {
    en: 'A remote expert guides them through it',
    zh: '远程专家指导他们完成',
    ja: 'リモートの専門家の指示を受けながら顧客が行う',
  },
  'RT10.o7': {
    en: 'Our team (the distributor) services the device',
    zh: '由我们（经销商）团队维护设备',
    ja: '当社（販売代理店）のチームがメンテナンスを行う',
  },
  lang_label: {
    en: 'Language',
    zh: '语言',
    ja: '言語',
  },
  intro_title: {
    en: 'Help us shape a new TIM test device – 5 minutes',
    zh: '帮助我们打造一款新的 TIM 测试设备——5 分钟',
    ja: '新しいTIM試験装置の開発にご協力ください（所要時間5分）',
  },
  intro_p1: {
    en: 'NANOTEST is developing a desktop tester for quality control of thermal interface materials (TIMs) according to ASTM D5470. Your answers decide which features it gets.',
    zh: 'NANOTEST 正在开发一款按照 ASTM D5470 对热界面材料（TIM）进行质量控制的台式测试仪。您的回答将决定它具备哪些功能。',
    ja: 'NANOTESTは、熱界面材料（TIM）の品質管理をASTM D5470に準拠して行う卓上型試験装置を開発しています。皆さまのご回答が、搭載する機能を決める参考になります。',
  },
  intro_p2: {
    en: 'Part 1 takes about 5 minutes. Afterwards you can choose to answer a few more detailed questions.',
    zh: '第 1 部分大约需要 5 分钟。之后您可以选择回答一些更详细的问题。',
    ja: 'パート1の所要時間は約5分です。その後、より詳しい質問にご回答いただくかどうかを選べます。',
  },
  intro_p3: {
    en: 'Answers are analysed only in aggregate. They stay anonymous unless you choose to leave contact details at the end. If you like, we’ll send you a summary of the results.',
    zh: '所有回答仅做汇总分析。除非您在最后选择留下联系方式，否则回答将保持匿名。如您愿意，我们会将调研结果摘要发送给您。',
    ja: 'ご回答は集計して分析します。最後に連絡先をご記入いただかない限り、回答は匿名のままです。ご希望の方には調査結果の概要をお送りします。',
  },
  kbtip: {
    en: 'Tip: use number keys to choose and Enter to continue.',
    zh: '提示：可用数字键选择，按回车键继续。',
    ja: 'ヒント：数字キーで選択し、Enterキーで次へ進めます。',
  },
  start: {
    en: 'Start the survey',
    zh: '开始问卷',
    ja: 'アンケートを始める',
  },
  resume_text: {
    en: 'You have answers from earlier that weren’t submitted yet.',
    zh: '您有之前尚未提交的回答。',
    ja: '前回送信されていない回答があります。',
  },
  resume_continue: {
    en: 'Continue where you left off',
    zh: '从上次中断处继续',
    ja: '前回の続きから再開する',
  },
  resume_over: {
    en: 'Start over',
    zh: '重新开始',
    ja: '最初からやり直す',
  },
  choose_one: {
    en: 'Choose one.',
    zh: '请选择一项。',
    ja: '1つお選びください。',
  },
  choose_all: {
    en: 'Choose all that apply.',
    zh: '可多选。',
    ja: '当てはまるものをすべてお選びください。',
  },
  choose_upto: {
    en: 'Choose up to {n}.',
    zh: '最多选择 {n} 项。',
    ja: '最大{n}つまでお選びください。',
  },
  choose_exactly: {
    en: 'Choose exactly {n}.',
    zh: '请选择 {n} 项。',
    ja: '{n}つお選びください。',
  },
  scale_hint: {
    en: '1 = {a}, 5 = {b}.',
    zh: '1 = {a}，5 = {b}。',
    ja: '1＝{a}、5＝{b}。',
  },
  part_p1: {
    en: 'Part 1',
    zh: '第 1 部分',
    ja: 'パート1',
  },
  part_p2: {
    en: 'Part 2 (optional)',
    zh: '第 2 部分（选填）',
    ja: 'パート2（任意）',
  },
  part_dist: {
    en: 'Distributor questions',
    zh: '经销商问题',
    ja: '販売代理店向けの質問',
  },
  part_distT: {
    en: 'Customer requirements (optional)',
    zh: '客户需求（选填）',
    ja: '顧客の要件（任意）',
  },
  part_close: {
    en: 'Last step',
    zh: '最后一步',
    ja: '最後のステップ',
  },
  q_n_of: {
    en: 'Question {n} of {N}',
    zh: '第 {n} 题，共 {N} 题',
    ja: '質問 {n}／{N}',
  },
  short_p1: {
    en: 'Part 1',
    zh: '第 1 部分',
    ja: 'パート1',
  },
  short_p2: {
    en: 'Part 2',
    zh: '第 2 部分',
    ja: 'パート2',
  },
  short_dist: {
    en: 'Distributor',
    zh: '经销商',
    ja: '代理店',
  },
  short_distT: {
    en: 'Customers',
    zh: '客户',
    ja: '顧客',
  },
  short_close: {
    en: 'Last step',
    zh: '最后一步',
    ja: '最後のステップ',
  },
  q1: {
    en: 'Question 1',
    zh: '第 1 题',
    ja: '質問1',
  },
  back: {
    en: 'Back',
    zh: '返回',
    ja: '戻る',
  },
  next: {
    en: 'Next',
    zh: '下一步',
    ja: '次へ',
  },
  finish: {
    en: 'Finish now',
    zh: '立即结束',
    ja: 'ここで終了',
  },
  finish_title: {
    en: 'Skip the remaining questions and submit your answers',
    zh: '跳过其余问题并提交回答',
    ja: '残りの質問をスキップして回答を送信します',
  },
  hold_skip: {
    en: 'Hold to skip',
    zh: '长按跳过',
    ja: '長押しでスキップ',
  },
  keep_holding: {
    en: 'Keep holding…',
    zh: '请继续按住…',
    ja: '押し続けてください…',
  },
  skip_aria: {
    en: 'Skip this question (press and hold)',
    zh: '跳过此题（长按）',
    ja: 'この質問をスキップ（長押し）',
  },
  skip_hint: {
    en: 'Press and hold the button to skip this question',
    zh: '长按按钮即可跳过此题',
    ja: 'この質問をスキップするには、ボタンを長押ししてください',
  },
  auto_click: {
    en: 'Moving on… click Next to go now',
    zh: '即将进入下一题… 点击“下一步”可立即继续',
    ja: 'まもなく次へ進みます…「次へ」をクリックするとすぐに進めます',
  },
  auto_tap: {
    en: 'Moving on… tap Next to go now',
    zh: '即将进入下一题… 轻点“下一步”可立即继续',
    ja: 'まもなく次へ進みます…「次へ」をタップするとすぐに進めます',
  },
  counter_rank: {
    en: '{n} of {max} ranked (at least {min})',
    zh: '已排序 {n} / {max} 项（至少 {min} 项）',
    ja: '{n}／{max}件を順位付け（最低{min}件）',
  },
  counter_sel: {
    en: '{n} of {max} selected',
    zh: '已选 {n} / {max} 项',
    ja: '{n}／{max}件を選択',
  },
  slot_note: {
    en: 'Priority 1 to {max} · at least {min}',
    zh: '优先级 1 至 {max} · 至少 {min} 项',
    ja: '優先度 1～{max}・最低{min}件',
  },
  amount_ph: {
    en: 'Amount',
    zh: '金额',
    ja: '金額',
  },
  amount_aria: {
    en: 'Amount in euros',
    zh: '欧元金额',
    ja: 'ユーロでの金額',
  },
  price_low: {
    en: 'Please enter an amount at least as high as your previous answer ({amount}).',
    zh: '请输入不低于您上一题答案的金额（{amount}）。',
    ja: '前の質問でご回答いただいた金額（{amount}）以上の金額をご入力ください。',
  },
  price_none: {
    en: 'Enter an amount or tick “Don’t know”.',
    zh: '请输入金额或勾选“不清楚”。',
    ja: '金額を入力するか、「わからない」にチェックを入れてください。',
  },
  your_answer: {
    en: 'Your answer',
    zh: '您的回答',
    ja: 'ご回答',
  },
  specify: {
    en: 'Please specify',
    zh: '请注明',
    ja: '具体的にご記入ください',
  },
  describe: {
    en: 'Describe the feature',
    zh: '请描述该功能',
    ja: '機能の内容をご記入ください',
  },
  p1done: {
    en: 'Thank you – Part 1 is done',
    zh: '谢谢——第 1 部分已完成',
    ja: 'ありがとうございます。パート1は以上です',
  },
  final_title: {
    en: 'Almost done – submit your answers',
    zh: '即将完成——请提交您的回答',
    ja: 'あと少しです。回答を送信してください',
  },
  final_hint: {
    en: 'Your answers are only saved when you click Submit. Everything below is optional.',
    zh: '只有点击“提交”后，您的回答才会被保存。以下内容均为选填。',
    ja: '「送信」をクリックした時点で回答が保存されます。以下はすべて任意です。',
  },
  final_aria: {
    en: 'Optional follow-up',
    zh: '可选的后续联系',
    ja: '任意のフォローアップ',
  },
  email_label: {
    en: 'Email (required for the options you ticked)',
    zh: '电子邮箱（勾选上述选项时必填）',
    ja: 'メールアドレス（上記にチェックを入れた場合は必須）',
  },
  name_label: {
    en: 'Name (optional)',
    zh: '姓名（选填）',
    ja: 'お名前（任意）',
  },
  company_label: {
    en: 'Company (optional)',
    zh: '公司（选填）',
    ja: '会社名（任意）',
  },
  country_label: {
    en: 'Country (optional)',
    zh: '国家/地区（选填）',
    ja: '国・地域（任意）',
  },
  launch: {
    en: 'Also send me information when the device launches.',
    zh: '设备上市时也请通知我。',
    ja: '装置の発売時にも情報を送ってほしい。',
  },
  privacy_note: {
    en: 'We store your contact details separately from your survey answers and use them only for what you ticked. Details are in the NANOTEST privacy notice (link in the live survey).',
    zh: '我们会将您的联系方式与问卷回答分开保存，且仅用于您勾选的用途。详情请见 NANOTEST 隐私声明（正式问卷中提供链接）。',
    ja: '連絡先はアンケートの回答とは別に保存し、チェックを入れた目的にのみ使用します。詳しくはNANOTESTのプライバシーポリシーをご覧ください（本番のアンケートではリンクを表示します）。',
  },
  submit: {
    en: 'Submit',
    zh: '提交',
    ja: '送信',
  },
  sending: {
    en: 'Sending…',
    zh: '正在发送…',
    ja: '送信中…',
  },
  err_email: {
    en: 'Enter a valid email address, for example name@company.com, or untick the options above.',
    zh: '请输入有效的电子邮箱地址（例如 name@company.com），或取消勾选上述选项。',
    ja: '有効なメールアドレス（例：name@company.com）を入力するか、上記のチェックを外してください。',
  },
  err_send: {
    en: 'Your answers could not be sent. Please check your connection and click Submit again.',
    zh: '您的回答未能发送。请检查网络连接后再次点击“提交”。',
    ja: '回答を送信できませんでした。接続を確認して、もう一度「送信」をクリックしてください。',
  },
  thanks_badge: {
    en: 'Submitted',
    zh: '已提交',
    ja: '送信完了',
  },
  thanks_title: {
    en: 'Thank you',
    zh: '谢谢！',
    ja: 'ありがとうございました',
  },
  thanks_p1: {
    en: 'Your answers have been sent. They help us decide which features the new device gets.',
    zh: '您的回答已发送。它们将帮助我们决定新设备具备哪些功能。',
    ja: 'ご回答を送信しました。新しい装置にどの機能を搭載するかを決める参考にさせていただきます。',
  },
  thanks_contact: {
    en: 'We’ll contact you at <strong>{email}</strong> about what you ticked.',
    zh: '我们将通过 <strong>{email}</strong> 就您勾选的事项与您联系。',
    ja: '<strong>{email}</strong> 宛てに、チェックを入れた内容についてご連絡いたします。',
  },
  thanks_anon: {
    en: 'Your answers are anonymous.',
    zh: '您的回答是匿名的。',
    ja: 'ご回答は匿名です。',
  },
  thanks_close: {
    en: 'You can close this page now.',
    zh: '您现在可以关闭此页面。',
    ja: 'このページは閉じていただいて構いません。',
  },
};

export function tx(id: string, lang: SurveyLang): string {
  return texts[id]?.[lang] ?? texts[id]?.en ?? id;
}

export function fmt(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in params ? String(params[k]) : m));
}
