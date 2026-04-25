// V2+ · Control Room (interactive)
// Same visual system as V2; adds:
//  · keyboard-first command palette ( press : or / )
//  · ? HUD for shortcuts
//  · scrubbable sparklines (hover to read t, value)
//  · clickable sensors on the schematic with detail readouts
//  · expandable research rows (abstract + BibTeX)
//  · live uptime + scroll progress + last-keystroke tracking

function V2Plus() {
  const bg = 'oklch(0.16 0.010 250)';
  const panel = 'oklch(0.20 0.012 250)';
  const panelHi = 'oklch(0.23 0.012 250)';
  const line = 'oklch(0.30 0.015 250)';
  const text = 'oklch(0.92 0.008 250)';
  const mute = 'oklch(0.58 0.015 250)';
  const ok = 'oklch(0.78 0.15 150)';
  const warn = 'oklch(0.78 0.16 65)';
  const blue = 'oklch(0.75 0.13 230)';
  const { useState, useEffect, useRef, useMemo, useCallback } = React;

  // ───────── live state
  const [vals, setVals] = useState({ v: 0, yaw: 0, err: 0, t: 0 });
  const [series, setSeries] = useState(() => Array.from({ length: 80 }, () => 0.5));
  const tRef = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 0.08;
      const t = tRef.current;
      setVals({
        v: 1.8 + Math.sin(t * 0.8) * 0.4 + (Math.random() - 0.5) * 0.05,
        yaw: Math.sin(t * 0.5) * 12,
        err: 0.04 + (Math.random() - 0.5) * 0.02,
        t,
      });
      setSeries(s => [...s.slice(1), 0.5 + Math.sin(t * 0.5) * 0.25 + (Math.random() - 0.5) * 0.15]);
    }, 100);
    return () => clearInterval(id);
  }, []);

  // uptime since mount
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const fmtUptime = s => `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // scroll progress (within artboard)
  const [scrollPct, setScrollPct] = useState(0);
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      setScrollPct(Math.min(1, Math.max(0, p)));
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // ───────── command palette
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQ, setPaletteQ] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeSensor, setActiveSensor] = useState('LIDAR'); // LIDAR | IMU | CAM | null
  const [expanded, setExpanded] = useState(null); // paper id
  const [theme, setTheme] = useState('dark'); // dark | crt
  const [lastKey, setLastKey] = useState('—');

  const papers = useMemo(() => ([
    { id:'PAP-006', tag:'PREPRINT', year:'2026', venue:'ICIEA', title:'Hierarchical PID-MPPI Control for an Autonomous Electric Tow Truck',
      keys:['robotics','MPPI','PID'], color: warn,
      abstract:'Hierarchical control combining inner-loop PID with outer-loop MPPI for real-world autonomous navigation; deployed on a retrofitted electric tow truck running on a live factory floor.',
      bibtex:'@article{qureshi2026mppi,\n  title={A Hierarchical PID-MPPI...},\n  author={Qureshi, M.S.},\n  booktitle={ICIEA},\n  year={2026}\n}' },
    { id:'PAP-005', tag:'PUBLISHED', year:'2026', venue:'CVC', title:'Deployment-Oriented Memory-Based Visual Inspection of Injection-Molded Parts',
      keys:['CV','anomaly','mfg'], color: ok,
      abstract:'Anomaly-detection pipeline achieving 100% recall on industrial defect data using only defect-free training samples via a one-class memory bank.',
      bibtex:'@inproceedings{qureshi2026vis,\n  title={Deployment-Oriented...},\n  booktitle={CVC},\n  year={2026}\n}' },
    { id:'PAP-004', tag:'PUBLISHED', year:'2025', venue:'—', title:'Sys-ID Methods for Retrofitted Electric Drivetrains', keys:['sys-id','controls'], color: ok,
      abstract:'Practical system-identification workflow for reclaimed commercial EVs; frequency-domain and time-domain methods compared on a 2-DOF bicycle plant.',
      bibtex:'@techreport{qureshi2025sysid,\n  title={Sys-ID Methods...},\n  year={2025}\n}' },
    { id:'PAP-003', tag:'PUBLISHED', year:'2025', venue:'—', title:'Real-Time Perception Pipeline for Industrial AGVs', keys:['CV','AGV'], color: ok,
      abstract:'Low-latency stack integrating LIDAR, IMU and monocular vision for free-space and lane estimation in cluttered warehouse environments.',
      bibtex:'@article{qureshi2025perc,\n  title={Real-Time Perception...},\n  year={2025}\n}' },
  ]), [warn, ok]);

  const commands = useMemo(() => ([
    { k:'go research',   d:'jump to research log',          run: () => scrollTo('#research') },
    { k:'go flagship',   d:'jump to flagship project',      run: () => scrollTo('#flagship') },
    { k:'go top',        d:'jump to top',                   run: () => scrollTo('#top') },
    { k:'open contact',  d:'simulate ./contact --open',     run: () => alert('mailto:suleiman@example.edu') },
    { k:'cat resume',    d:'open resume.pdf',               run: () => window.open('about:blank') },
    { k:'sensor lidar',  d:'inspect LIDAR_0',               run: () => setActiveSensor('LIDAR') },
    { k:'sensor imu',    d:'inspect IMU',                   run: () => setActiveSensor('IMU') },
    { k:'sensor cam',    d:'inspect CAM',                   run: () => setActiveSensor('CAM') },
    { k:'theme dark',    d:'default theme',                 run: () => setTheme('dark') },
    { k:'theme crt',     d:'phosphor / scanline mode',      run: () => setTheme('crt') },
    { k:'help',          d:'show keyboard shortcuts',       run: () => setHelpOpen(true) },
    { k:'whoami',        d:'about me',                      run: () => alert('muhammad suleiman qureshi · robotics & automation engineer · karachi, pk') },
  ]), []);

  function scrollTo(sel) {
    const el = rootRef.current?.querySelector(sel);
    if (el && rootRef.current) {
      rootRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
    }
  }

  // global keyboard handler
  useEffect(() => {
    const h = (e) => {
      // record last key for fun (skip modifier-only)
      if (e.key.length === 1 || ['Enter','Escape','/','?',':'].includes(e.key)) setLastKey(e.key);
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === '/' || e.key === ':') { e.preventDefault(); setPaletteOpen(true); }
      else if (e.key === '?') { e.preventDefault(); setHelpOpen(o => !o); }
      else if (e.key === 'Escape') { setPaletteOpen(false); setHelpOpen(false); }
      else if (e.key === 'g') {
        const next = (e2) => {
          if (e2.key === 'r') scrollTo('#research');
          else if (e2.key === 'f') scrollTo('#flagship');
          else if (e2.key === 't') scrollTo('#top');
          window.removeEventListener('keydown', next);
        };
        window.addEventListener('keydown', next, { once: true });
      } else if (e.key === '1') setActiveSensor('LIDAR');
      else if (e.key === '2') setActiveSensor('IMU');
      else if (e.key === '3') setActiveSensor('CAM');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const filteredCmds = commands.filter(c =>
    !paletteQ || c.k.toLowerCase().includes(paletteQ.toLowerCase()) || c.d.toLowerCase().includes(paletteQ.toLowerCase())
  );

  // ───────── scrubbable sparkline
  const Spark = ({ data, color, h = 36, w = 180, fmt = (v) => v.toFixed(2) }) => {
    const [hover, setHover] = useState(null);
    const ref = useRef(null);
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const span = (max - min) || 1;
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const onMove = (e) => {
      const r = ref.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const i = Math.max(0, Math.min(data.length - 1, Math.round((x / r.width) * (data.length - 1))));
      setHover({ i, x: (i/(data.length-1))*w, y: h - ((data[i]-min)/span)*h, v: data[i] });
    };
    return (
      <svg ref={ref} width={w} height={h} style={{ display:'block', cursor:'crosshair' }}
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.25" />
        {hover && (
          <g>
            <line x1={hover.x} y1={0} x2={hover.x} y2={h} stroke={color} strokeOpacity={0.5} strokeDasharray="2 2"/>
            <circle cx={hover.x} cy={hover.y} r="2.5" fill={color}/>
            <rect x={Math.min(hover.x + 4, w - 50)} y={2} width="48" height="14" fill={bg} stroke={line}/>
            <text x={Math.min(hover.x + 8, w - 46)} y={12} fill={color} fontSize="9" fontFamily="JetBrains Mono">
              {fmt(hover.v)}
            </text>
          </g>
        )}
      </svg>
    );
  };

  const Panel = ({ title, tag, children, id, style, action }) => (
    <div id={id} style={{ border:`1px solid ${line}`, background: panel, ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', borderBottom:`1px solid ${line}` }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase', color: mute }}>{title}</span>
        <span className="mono" style={{ fontSize: 10, color: mute, display:'flex', gap: 8, alignItems:'center' }}>
          {action}
          {tag && <span>{tag}</span>}
        </span>
      </div>
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );

  // sensor details
  const sensorDb = {
    LIDAR: { color: warn, model:'Velodyne VLP-16', rate:'10 Hz', fov:'360°×30°', range:'100 m', notes:'mounted at cab apex; primary obstacle detector' },
    IMU:   { color: blue, model:'Xsens MTi-630', rate:'400 Hz', fov:'—', range:'±2000°/s gyro', notes:'fused with wheel odometry in EKF' },
    CAM:   { color: ok,   model:'FLIR Blackfly S 1.6 MP', rate:'60 fps', fov:'85° HFOV', range:'—', notes:'rolling-shutter; lane + free-space classification' },
  };

  return (
    <div ref={rootRef} className="ab" style={{ background: bg, color: text, overflowY:'auto', position:'relative',
      filter: theme === 'crt' ? 'contrast(1.1) saturate(1.05)' : 'none' }}>
      {/* CRT scanlines overlay */}
      {theme === 'crt' && (
        <div style={{ position:'sticky', top:0, height:0, zIndex: 20, pointerEvents:'none' }}>
          <div style={{ position:'fixed', inset:0, background:'repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)', mixBlendMode:'overlay' }}/>
        </div>
      )}

      {/* scroll-progress hairline */}
      <div style={{ position:'sticky', top:0, height: 2, zIndex: 10, background:'transparent' }}>
        <div style={{ height:'100%', width: `${scrollPct * 100}%`, background: warn, transition:'width .12s linear' }}/>
      </div>

      {/* TOP BAR */}
      <div id="top" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 28px', borderBottom:`1px solid ${line}` }} className="mono">
        <div style={{ display:'flex', alignItems:'center', gap: 16, fontSize: 11 }}>
          <span style={{ color: text, fontWeight: 600 }}>SQ / <span style={{ color: mute }}>control</span></span>
          <span style={{ color: mute }}>│</span>
          <span style={{ color: ok }}>● ONLINE</span>
          <span style={{ color: mute }}>uptime {fmtUptime(uptime)}</span>
          <span style={{ color: mute }}>│</span>
          <span style={{ color: mute }}>scroll {Math.round(scrollPct * 100)}%</span>
          <span style={{ color: mute }}>│</span>
          <span style={{ color: mute }}>last key</span><span style={{ color: text, background: panelHi, padding:'1px 6px', border:`1px solid ${line}` }}>{lastKey === ' ' ? '␣' : lastKey}</span>
        </div>
        <nav style={{ display:'flex', gap: 18, fontSize: 11, letterSpacing: 1.2, textTransform:'uppercase', alignItems:'center' }}>
          <span style={{ color: text, paddingBottom: 2, borderBottom:`1px solid ${text}` }}>Overview</span>
          <span style={{ color: mute, cursor:'pointer' }} onClick={()=>scrollTo('#research')}>Research</span>
          <span style={{ color: mute, cursor:'pointer' }} onClick={()=>scrollTo('#flagship')}>Projects</span>
          <span style={{ color: mute }}>About</span>
          <span style={{ color: mute }}>Contact</span>
          <button onClick={()=>setPaletteOpen(true)} className="mono"
            style={{ background: 'transparent', color: mute, border:`1px solid ${line}`, padding:'4px 8px', fontSize: 10, letterSpacing: 1.2, textTransform:'uppercase', cursor:'pointer', display:'flex', alignItems:'center', gap: 6 }}>
            press <kbd style={{ color: text, background: panelHi, padding:'0 4px', border:`1px solid ${line}` }}>/</kbd> for cmd
          </button>
        </nav>
      </div>

      {/* HEADER */}
      <div style={{ padding: '32px 28px', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 20 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: mute, letterSpacing: 1.5, textTransform:'uppercase', marginBottom: 14 }}>
            # OPERATOR_PROFILE :: role=R&amp;D_LEAD :: domain=ROBOTICS_AUTOMATION
          </div>
          <h1 className="sans" style={{ margin: 0, fontSize: 84, lineHeight: 1.0, fontWeight: 700, letterSpacing: -2.5 }}>
            Muhammad Suleiman<br/>Qureshi<span style={{ color: warn }}>.</span>
          </h1>
          <div className="mono" style={{ marginTop: 22, fontSize: 13, color: mute, lineHeight: 1.6, maxWidth: 640 }}>
            <span style={{ color: text }}>&gt;</span> building autonomous systems end-to-end · PCB → sys-ID → MPC → real-time CV.
            <br/><span style={{ color: text }}>&gt;</span> currently leading R&amp;D at <span style={{ color: blue }}>HU-Takhleeq</span> — Habib University's industry-academia hub.
            <br/><span style={{ color: text }}>&gt;</span> i like systems with tangible impact<span className="cursor-blink" style={{ color: warn }}/>
          </div>
          <div style={{ display:'flex', gap: 8, marginTop: 28, alignItems:'center' }}>
            <button className="mono" onClick={()=>setPaletteOpen(true)} style={{ background: text, color: bg, border:'none', padding:'10px 16px', fontSize: 11, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>
              ./contact --open
            </button>
            <button className="mono" style={{ background: 'transparent', color: text, border:`1px solid ${line}`, padding:'10px 16px', fontSize: 11, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>
              cat resume.pdf
            </button>
            <button className="mono" onClick={()=>setHelpOpen(true)} style={{ background: 'transparent', color: mute, border:`1px solid ${line}`, padding:'10px 12px', fontSize: 11, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>
              ? shortcuts
            </button>
          </div>
        </div>

        {/* telemetry cluster (scrubbable) */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <Panel title="VELOCITY" tag="m/s">
            <div className="mono" style={{ fontSize: 32, color: text }}>{vals.v.toFixed(2)}</div>
            <Spark data={series} color={ok} fmt={(v)=>(v*3).toFixed(2)}/>
          </Panel>
          <Panel title="YAW RATE" tag="deg/s">
            <div className="mono" style={{ fontSize: 32, color: text }}>{vals.yaw.toFixed(1).padStart(5,' ')}</div>
            <Spark data={series.map(v => 1-v)} color={blue} fmt={(v)=>((v-0.5)*24).toFixed(1)}/>
          </Panel>
          <Panel title="TRACKING ERR" tag="m">
            <div className="mono" style={{ fontSize: 32, color: warn }}>{vals.err.toFixed(3)}</div>
            <Spark data={series.map(v => v*0.5)} color={warn} fmt={(v)=>v.toFixed(3)}/>
          </Panel>
          <Panel title="SYSTEM" tag="all">
            <div className="mono" style={{ fontSize: 11, lineHeight: 1.9, color: mute }}>
              <div><span style={{ color: ok }}>●</span> mppi_node     OK</div>
              <div><span style={{ color: ok }}>●</span> ekf_localizer OK</div>
              <div><span style={{ color: ok }}>●</span> can_bridge    OK</div>
              <div><span style={{ color: warn }}>●</span> lidar_0       OK*</div>
            </div>
          </Panel>
        </div>
      </div>

      {/* STATS */}
      <div style={{ margin: '0 28px', border:`1px solid ${line}`, display:'grid', gridTemplateColumns:'repeat(4, 1fr)' }}>
        {[
          ['PAPERS', '06', '/ peer-reviewed + preprint'],
          ['PROJECTS', '09', '/ deployed or live'],
          ['CGPA', '3.88', '/ 4.00'],
          ['DEAN\'S LIST', '×4', '/ consecutive'],
        ].map(([k, v, sub], i) => (
          <div key={k} style={{ padding: 18, borderLeft: i===0?'none':`1px solid ${line}` }}>
            <div className="mono" style={{ fontSize: 10, color: mute, letterSpacing: 1.5 }}>{k}</div>
            <div className="mono" style={{ fontSize: 36, color: text, marginTop: 6, fontWeight: 500 }}>{v}</div>
            <div className="mono" style={{ fontSize: 10, color: mute, marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* RESEARCH (expandable) */}
      <div id="research" style={{ padding:'36px 28px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <h2 className="mono" style={{ margin:0, fontSize: 13, letterSpacing: 2, textTransform:'uppercase', color: text }}>
            <span style={{ color: mute }}>// </span>research_log <span style={{ color: mute }}>[{papers.length}]</span>
          </h2>
          <span className="mono" style={{ fontSize: 11, color: mute }}>click row to expand · sort: --date.desc</span>
        </div>
        <div style={{ border:`1px solid ${line}`, background: panel }}>
          {papers.map((p, i) => (
            <div key={p.id}>
              <div onClick={() => setExpanded(e => e === p.id ? null : p.id)}
                onMouseEnter={(e)=> e.currentTarget.style.background = panelHi}
                onMouseLeave={(e)=> e.currentTarget.style.background = 'transparent'}
                style={{ display:'grid', gridTemplateColumns:'90px 100px 60px 1fr 220px 24px', gap: 14, alignItems:'center',
                  padding:'14px 18px', borderTop: i===0?'none':`1px solid ${line}`, fontSize: 12, cursor:'pointer', transition:'background .12s' }}
                className="mono">
                <span style={{ color: mute }}>{p.id}</span>
                <span style={{ color: p.color }}>● {p.tag}</span>
                <span style={{ color: mute }}>{p.year}</span>
                <span style={{ color: text }}>{p.title}</span>
                <span style={{ color: mute, textAlign:'right' }}>{p.keys.map(k => `#${k}`).join(' ')}</span>
                <span style={{ color: mute, textAlign:'center', transform: expanded === p.id ? 'rotate(90deg)' : 'none', transition:'transform .15s' }}>›</span>
              </div>
              {expanded === p.id && (
                <div style={{ padding:'16px 18px 22px', background: 'oklch(0.18 0.01 250)', borderTop:`1px dashed ${line}`, display:'grid', gridTemplateColumns:'1.6fr 1fr', gap: 24 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: mute, letterSpacing: 1.5, textTransform:'uppercase', marginBottom: 8 }}>Abstract — {p.venue} {p.year}</div>
                    <p className="sans" style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: text }}>{p.abstract}</p>
                    <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
                      <button className="mono" style={{ background:text, color:bg, border:'none', padding:'6px 12px', fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>open paper ↗</button>
                      <button className="mono" style={{ background:'transparent', color:text, border:`1px solid ${line}`, padding:'6px 12px', fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>copy bib</button>
                    </div>
                  </div>
                  <pre className="mono" style={{ margin: 0, padding: 12, background: bg, border:`1px solid ${line}`, fontSize: 10, color: mute, lineHeight: 1.55, overflow:'auto' }}>
{p.bibtex}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FLAGSHIP — interactive schematic */}
      <div id="flagship" style={{ padding:'36px 28px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <h2 className="mono" style={{ margin:0, fontSize: 13, letterSpacing: 2, textTransform:'uppercase' }}>
            <span style={{ color: mute }}>// </span>flagship :: <span style={{ color: warn }}>ev-tow-01</span>
          </h2>
          <span className="mono" style={{ fontSize: 11, color: ok }}>● deployed · click sensors to inspect</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap: 10 }}>
          <Panel title="VEHICLE · EV-TOW-01" tag="retrofit"
            action={<span style={{ color: mute }}>[1][2][3] = sensors</span>}>
            <div className="stripes-dark" style={{ height: 260, border:`1px dashed ${line}`, position:'relative', background: 'oklch(0.18 0.01 250)' }}>
              <svg viewBox="0 0 600 260" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                <rect x="180" y="80" width="240" height="100" fill="none" stroke={mute} strokeWidth="1"/>
                <rect x="210" y="55" width="180" height="25" fill="none" stroke={mute} strokeWidth="1"/>
                <circle cx="205" cy="85" r="12" fill="none" stroke={text}/>
                <circle cx="205" cy="175" r="12" fill="none" stroke={text}/>
                <circle cx="395" cy="85" r="12" fill="none" stroke={text}/>
                <circle cx="395" cy="175" r="12" fill="none" stroke={text}/>

                {/* clickable LIDAR */}
                <g style={{ cursor:'pointer' }} onClick={()=>setActiveSensor('LIDAR')}>
                  {activeSensor === 'LIDAR' && <circle cx="300" cy="67" r="16" fill="none" stroke={warn} strokeOpacity="0.5"/>}
                  <circle cx="300" cy="67" r="8" fill={warn}/>
                  <line x1="300" y1="67" x2="300" y2="20" stroke={warn} strokeDasharray="2 3"/>
                  <text x="305" y="20" fill={warn} fontSize="10" fontFamily="JetBrains Mono">LIDAR_0</text>
                </g>
                {/* clickable IMU */}
                <g style={{ cursor:'pointer' }} onClick={()=>setActiveSensor('IMU')}>
                  {activeSensor === 'IMU' && <rect x="284" y="114" width="32" height="32" fill="none" stroke={blue} strokeOpacity="0.5"/>}
                  <rect x="290" y="120" width="20" height="20" fill={blue}/>
                  <line x1="310" y1="130" x2="370" y2="130" stroke={blue} strokeDasharray="2 3"/>
                  <text x="372" y="133" fill={blue} fontSize="10" fontFamily="JetBrains Mono">IMU</text>
                </g>
                {/* clickable CAM */}
                <g style={{ cursor:'pointer' }} onClick={()=>setActiveSensor('CAM')}>
                  {activeSensor === 'CAM' && <rect x="404" y="111" width="26" height="38" fill="none" stroke={ok} strokeOpacity="0.5"/>}
                  <rect x="410" y="117" width="14" height="26" fill={ok}/>
                  <line x1="424" y1="130" x2="480" y2="130" stroke={ok} strokeDasharray="2 3"/>
                  <text x="482" y="133" fill={ok} fontSize="10" fontFamily="JetBrains Mono">CAM</text>
                </g>

                <text x="30" y="30" fill={mute} fontSize="10" fontFamily="JetBrains Mono">fig. 01 — sensor layout (top)</text>
                <text x="30" y="240" fill={mute} fontSize="10" fontFamily="JetBrains Mono">scale 1:24</text>
              </svg>
            </div>
            {/* sensor inspector */}
            {activeSensor && (
              <div style={{ marginTop: 10, padding: 12, border:`1px solid ${line}`, background: 'oklch(0.18 0.01 250)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase', color: sensorDb[activeSensor].color, marginBottom: 8 }}>
                  ● {activeSensor} · inspector
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10, fontSize: 11 }} className="mono">
                  <div><div style={{ color: mute, fontSize: 9, letterSpacing: 1.2, textTransform:'uppercase' }}>Model</div><div style={{ color: text, marginTop: 2 }}>{sensorDb[activeSensor].model}</div></div>
                  <div><div style={{ color: mute, fontSize: 9, letterSpacing: 1.2, textTransform:'uppercase' }}>Rate</div><div style={{ color: text, marginTop: 2 }}>{sensorDb[activeSensor].rate}</div></div>
                  <div><div style={{ color: mute, fontSize: 9, letterSpacing: 1.2, textTransform:'uppercase' }}>FOV</div><div style={{ color: text, marginTop: 2 }}>{sensorDb[activeSensor].fov}</div></div>
                  <div><div style={{ color: mute, fontSize: 9, letterSpacing: 1.2, textTransform:'uppercase' }}>Range</div><div style={{ color: text, marginTop: 2 }}>{sensorDb[activeSensor].range}</div></div>
                </div>
                <div className="mono" style={{ fontSize: 11, color: mute, marginTop: 10, lineHeight: 1.6 }}>
                  <span style={{ color: text }}>note &gt;</span> {sensorDb[activeSensor].notes}
                </div>
              </div>
            )}
          </Panel>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <Panel title="CONTROL STACK">
              <div className="mono" style={{ fontSize: 11, lineHeight: 1.9, color: text }}>
                <div><span style={{ color: mute }}>│</span> OUTER  MPPI (N=1024, H=30)</div>
                <div><span style={{ color: mute }}>├──</span> COST   tracking + obstacle + smoothness</div>
                <div><span style={{ color: mute }}>│</span></div>
                <div><span style={{ color: mute }}>│</span> INNER  PID (v, δ)</div>
                <div><span style={{ color: mute }}>├──</span> RATE   100 Hz</div>
                <div><span style={{ color: mute }}>│</span></div>
                <div><span style={{ color: mute }}>│</span> PLANT  system-ID'd 2DOF bicycle</div>
              </div>
            </Panel>
            <Panel title="IMPACT">
              <div className="sans" style={{ fontSize: 13, color: text, lineHeight: 1.5 }}>
                Deployed and operational. Full-stack: custom PCB, sys-ID, hierarchical control, and a real-time perception pipeline. First autonomous retrofit to run on this class of vehicle in PK industry.
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '36px 28px 28px', borderTop:`1px solid ${line}`, marginTop: 32, display:'flex', justifyContent:'space-between' }} className="mono">
        <span style={{ fontSize: 11, color: mute }}>SQ@ 2026 · karachi, pk</span>
        <span style={{ fontSize: 11, color: mute }}>$ uptime &amp; thanks — shell closed</span>
      </div>

      {/* COMMAND PALETTE OVERLAY */}
      {paletteOpen && (
        <div onClick={()=>setPaletteOpen(false)}
          style={{ position:'absolute', inset:0, background:'rgba(10,12,16,0.6)', backdropFilter:'blur(2px)', zIndex: 50, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop: 120 }}>
          <div onClick={(e)=>e.stopPropagation()} style={{ width: 560, background: panel, border:`1px solid ${line}`, boxShadow:'0 16px 50px rgba(0,0,0,0.5)' }}>
            <div className="mono" style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 14px', borderBottom:`1px solid ${line}`, fontSize: 12 }}>
              <span style={{ color: warn }}>$</span>
              <input autoFocus value={paletteQ} onChange={e=>setPaletteQ(e.target.value)}
                onKeyDown={(e)=>{ if (e.key==='Enter' && filteredCmds[0]){ filteredCmds[0].run(); setPaletteOpen(false); setPaletteQ(''); } }}
                placeholder="type a command — e.g. 'go research', 'sensor lidar', 'help'"
                className="mono"
                style={{ flex: 1, background:'transparent', border:'none', outline:'none', color: text, fontSize: 13 }}/>
              <kbd style={{ color: mute, fontSize: 10, border:`1px solid ${line}`, padding:'2px 6px' }}>esc</kbd>
            </div>
            <div style={{ maxHeight: 320, overflowY:'auto' }}>
              {filteredCmds.length === 0 && (
                <div className="mono" style={{ padding: 20, color: mute, fontSize: 12 }}>no matches. <span style={{ color: warn }}>?</span> for help.</div>
              )}
              {filteredCmds.map((c, i) => (
                <div key={c.k} onClick={()=>{ c.run(); setPaletteOpen(false); setPaletteQ(''); }}
                  onMouseEnter={(e)=>e.currentTarget.style.background = panelHi}
                  onMouseLeave={(e)=>e.currentTarget.style.background = 'transparent'}
                  className="mono"
                  style={{ display:'flex', justifyContent:'space-between', padding:'10px 14px', cursor:'pointer', fontSize: 12, borderTop: i===0?'none':`1px solid ${line}`, transition:'background .12s' }}>
                  <span style={{ color: text }}>{c.k}</span>
                  <span style={{ color: mute }}>{c.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HELP HUD */}
      {helpOpen && (
        <div onClick={()=>setHelpOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(10,12,16,0.6)', zIndex: 50, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div onClick={(e)=>e.stopPropagation()} style={{ width: 520, background: panel, border:`1px solid ${line}`, padding: 24 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: 2, textTransform:'uppercase', color: mute, marginBottom: 14 }}>
              <span style={{ color: warn }}>?</span> &nbsp;keyboard shortcuts
            </div>
            <table className="mono" style={{ width:'100%', borderCollapse:'collapse', fontSize: 12 }}>
              <tbody>
                {[
                  ['/  or  :', 'open command palette'],
                  ['?', 'toggle this help'],
                  ['esc', 'close overlays'],
                  ['g r', 'go to research log'],
                  ['g f', 'go to flagship project'],
                  ['g t', 'go to top'],
                  ['1 / 2 / 3', 'inspect LIDAR / IMU / CAM'],
                ].map(([k, d], i) => (
                  <tr key={k} style={{ borderTop: i===0 ? 'none' : `1px solid ${line}` }}>
                    <td style={{ padding:'10px 0', color: text, width: 140 }}>
                      {k.split(' ').map((part, j) => (
                        <kbd key={j} style={{ color: text, background: bg, border:`1px solid ${line}`, padding:'2px 8px', marginRight: 4, fontSize: 11 }}>{part}</kbd>
                      ))}
                    </td>
                    <td style={{ padding:'10px 0', color: mute }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mono" style={{ fontSize: 10, color: mute, marginTop: 18 }}>$ esc to close</div>
          </div>
        </div>
      )}
    </div>
  );
}

window.V2Plus = V2Plus;
