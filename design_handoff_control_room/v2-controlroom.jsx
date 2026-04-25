// V2 · Control Room
// Dark instrumentation dashboard. Live-feeling telemetry. Mono-forward.
// Feels like a ground-station for the tow truck itself.

function V2ControlRoom() {
  const bg = 'oklch(0.16 0.010 250)';
  const panel = 'oklch(0.20 0.012 250)';
  const line = 'oklch(0.30 0.015 250)';
  const text = 'oklch(0.92 0.008 250)';
  const mute = 'oklch(0.58 0.015 250)';
  const ok = 'oklch(0.78 0.15 150)';
  const warn = 'oklch(0.78 0.16 65)';
  const blue = 'oklch(0.75 0.13 230)';

  // live-feeling telemetry
  const [vals, setVals] = React.useState({ v: 0, yaw: 0, err: 0, t: 0 });
  React.useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.08;
      setVals({
        v: 1.8 + Math.sin(t * 0.8) * 0.4 + (Math.random() - 0.5) * 0.05,
        yaw: Math.sin(t * 0.5) * 12,
        err: 0.04 + (Math.random() - 0.5) * 0.02,
        t,
      });
    }, 80);
    return () => clearInterval(id);
  }, []);

  // sparkline data
  const [series, setSeries] = React.useState(() => Array.from({length: 80}, () => Math.random()));
  React.useEffect(() => {
    const id = setInterval(() => {
      setSeries(s => {
        const next = [...s.slice(1), 0.5 + Math.sin(Date.now() / 400) * 0.25 + (Math.random() - 0.5) * 0.2];
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const Spark = ({ data, color, h=36, w=220 }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const pts = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return (
      <svg width={w} height={h} style={{ display:'block' }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.25" />
      </svg>
    );
  };

  const Panel = ({ title, tag, children, style }) => (
    <div style={{ border:`1px solid ${line}`, background: panel, ...style }}>
      <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', borderBottom:`1px solid ${line}` }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: 1.5, textTransform:'uppercase', color: mute }}>{title}</span>
        {tag && <span className="mono" style={{ fontSize: 10, color: mute }}>{tag}</span>}
      </div>
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );

  return (
    <div className="ab" style={{ background: bg, color: text }}>
      {/* TOP BAR */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 28px', borderBottom:`1px solid ${line}` }} className="mono">
        <div style={{ display:'flex', alignItems:'center', gap: 16, fontSize: 11 }}>
          <span style={{ color: text, fontWeight: 600 }}>SQ / <span style={{ color: mute }}>control</span></span>
          <span style={{ color: mute }}>│</span>
          <span style={{ color: ok }}>● ONLINE</span>
          <span style={{ color: mute }}>uptime 04:21:08</span>
        </div>
        <nav style={{ display:'flex', gap: 24, fontSize: 11, letterSpacing: 1.2, textTransform:'uppercase' }}>
          <span style={{ color: text, paddingBottom: 2, borderBottom:`1px solid ${text}` }}>Overview</span>
          <span style={{ color: mute }}>Research</span>
          <span style={{ color: mute }}>Projects</span>
          <span style={{ color: mute }}>About</span>
          <span style={{ color: mute }}>Contact</span>
        </nav>
      </div>

      {/* HEADER / HERO */}
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

          <div style={{ display:'flex', gap: 8, marginTop: 28 }}>
            <button className="mono" style={{ background: text, color: bg, border:'none', padding:'10px 16px', fontSize: 11, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>
              ./contact --open
            </button>
            <button className="mono" style={{ background: 'transparent', color: text, border:`1px solid ${line}`, padding:'10px 16px', fontSize: 11, letterSpacing: 1.5, textTransform:'uppercase', cursor:'pointer' }}>
              cat resume.pdf
            </button>
          </div>
        </div>

        {/* Live telemetry cluster */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          <Panel title="VELOCITY" tag="m/s">
            <div className="mono" style={{ fontSize: 32, color: text }}>{vals.v.toFixed(2)}</div>
            <Spark data={series} color={ok} w={180}/>
          </Panel>
          <Panel title="YAW RATE" tag="deg/s">
            <div className="mono" style={{ fontSize: 32, color: text }}>{vals.yaw.toFixed(1).padStart(5,' ')}</div>
            <Spark data={series.map(v => 1-v)} color={blue} w={180}/>
          </Panel>
          <Panel title="TRACKING ERR" tag="m">
            <div className="mono" style={{ fontSize: 32, color: warn }}>{vals.err.toFixed(3)}</div>
            <Spark data={series.map(v => v*0.5)} color={warn} w={180}/>
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

      {/* STATS RIBBON */}
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

      {/* RESEARCH LOG */}
      <div style={{ padding:'36px 28px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <h2 className="mono" style={{ margin:0, fontSize: 13, letterSpacing: 2, textTransform:'uppercase', color: text }}>
            <span style={{ color: mute }}>// </span>research_log <span style={{ color: mute }}>[6]</span>
          </h2>
          <span className="mono" style={{ fontSize: 11, color: mute }}>sort: --date.desc</span>
        </div>
        <div style={{ border:`1px solid ${line}`, background: panel }}>
          {[
            { id:'PAP-006', tag:'PREPRINT', year:'2026', venue:'ICIEA', title:'Hierarchical PID-MPPI Control for an Autonomous Electric Tow Truck', keys:['robotics','MPPI','PID'], color: warn },
            { id:'PAP-005', tag:'PUBLISHED', year:'2026', venue:'CVC', title:'Deployment-Oriented Memory-Based Visual Inspection of Injection-Molded Parts', keys:['CV','anomaly','mfg'], color: ok },
            { id:'PAP-004', tag:'PUBLISHED', year:'2025', venue:'—', title:'Sys-ID Methods for Retrofitted Electric Drivetrains', keys:['sys-id','controls'], color: ok },
            { id:'PAP-003', tag:'PUBLISHED', year:'2025', venue:'—', title:'Real-Time Perception Pipeline for Industrial AGVs', keys:['CV','AGV'], color: ok },
          ].map((p, i) => (
            <div key={p.id} style={{ display:'grid', gridTemplateColumns:'90px 100px 60px 1fr 220px', gap: 14, alignItems:'center', padding:'14px 18px', borderTop: i===0?'none':`1px solid ${line}`, fontSize: 12 }} className="mono">
              <span style={{ color: mute }}>{p.id}</span>
              <span style={{ color: p.color }}>● {p.tag}</span>
              <span style={{ color: mute }}>{p.year}</span>
              <span style={{ color: text }}>{p.title}</span>
              <span style={{ color: mute, textAlign:'right' }}>{p.keys.map(k => `#${k}`).join(' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FLAGSHIP — dashboard-style */}
      <div style={{ padding:'36px 28px 0' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 14 }}>
          <h2 className="mono" style={{ margin:0, fontSize: 13, letterSpacing: 2, textTransform:'uppercase' }}>
            <span style={{ color: mute }}>// </span>flagship :: <span style={{ color: warn }}>ev-tow-01</span>
          </h2>
          <span className="mono" style={{ fontSize: 11, color: ok }}>● deployed</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap: 10 }}>
          <Panel title="VEHICLE · EV-TOW-01" tag="retrofit">
            <div className="stripes-dark" style={{ height: 260, border:`1px dashed ${line}`, position:'relative', background: 'oklch(0.18 0.01 250)' }}>
              {/* schematic-ish: a simple top-down vehicle diagram */}
              <svg viewBox="0 0 600 260" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
                <rect x="180" y="80" width="240" height="100" fill="none" stroke={mute} strokeWidth="1"/>
                <rect x="210" y="55" width="180" height="25" fill="none" stroke={mute} strokeWidth="1"/>
                <circle cx="205" cy="85" r="12" fill="none" stroke={text}/>
                <circle cx="205" cy="175" r="12" fill="none" stroke={text}/>
                <circle cx="395" cy="85" r="12" fill="none" stroke={text}/>
                <circle cx="395" cy="175" r="12" fill="none" stroke={text}/>
                {/* lidar */}
                <circle cx="300" cy="67" r="8" fill={warn}/>
                <line x1="300" y1="67" x2="300" y2="20" stroke={warn} strokeDasharray="2 3"/>
                <text x="305" y="20" fill={warn} fontSize="10" fontFamily="JetBrains Mono">LIDAR_0</text>
                {/* imu */}
                <rect x="290" y="120" width="20" height="20" fill={blue}/>
                <line x1="310" y1="130" x2="370" y2="130" stroke={blue} strokeDasharray="2 3"/>
                <text x="372" y="133" fill={blue} fontSize="10" fontFamily="JetBrains Mono">IMU</text>
                {/* camera */}
                <rect x="410" y="117" width="14" height="26" fill={ok}/>
                <line x1="424" y1="130" x2="480" y2="130" stroke={ok} strokeDasharray="2 3"/>
                <text x="482" y="133" fill={ok} fontSize="10" fontFamily="JetBrains Mono">CAM</text>

                <text x="30" y="30" fill={mute} fontSize="10" fontFamily="JetBrains Mono">fig. 01 — sensor layout (top)</text>
                <text x="30" y="240" fill={mute} fontSize="10" fontFamily="JetBrains Mono">scale 1:24</text>
              </svg>
            </div>
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
    </div>
  );
}

window.V2ControlRoom = V2ControlRoom;
