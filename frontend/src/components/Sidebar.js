import { FaThLarge, FaExclamationTriangle, FaFileAlt, FaUsers, FaCog, FaLeaf, FaHeadset, FaTasks } from 'react-icons/fa';

const ALL_NAV = [
  { label: 'Dashboard',   icon: FaThLarge },
  { label: 'Incidents',   icon: FaExclamationTriangle },
  { label: 'Reports',     icon: FaFileAlt },
  { label: 'Assignments', icon: FaTasks },
  { label: 'Users',       icon: FaUsers },
  { label: 'Settings',    icon: FaCog },
];

export default function Sidebar({ active, onNav, onLogout, navItems }) {
  const items = navItems ? ALL_NAV.filter(n => navItems.includes(n.label)) : ALL_NAV;

  return (
    <>
      <style>{`
        .sb { width:220px; min-width:220px; background:var(--bg-dark); display:flex; flex-direction:column; height:100vh; box-sizing:border-box; border-right:1px solid var(--border); position:relative; z-index:1; }
        .sb-logo { color:var(--text); font-weight:700; font-size:13px; padding:28px 24px 24px; letter-spacing:0.2em; text-transform:uppercase; display:flex; align-items:center; gap:10px; border-bottom:1px solid var(--border); }
        .sb-logo-icon { width:26px; height:26px; background:var(--gold); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
        .sb-nav { display:flex; flex-direction:column; flex:1; padding:12px 0; gap:4px; }
        .sb-item { 
          display:flex; 
          align-items:center; 
          gap:12px; 
          width:100%; 
          padding:12px 24px; 
          margin:0 8px;
          width:calc(100% - 16px);
          border:none; 
          cursor:pointer; 
          font-size:12px; 
          font-weight:400; 
          text-align:left; 
          background:transparent; 
          color:var(--muted); 
          transition:all 0.2s ease; 
          box-sizing:border-box; 
          letter-spacing:0.08em; 
          text-transform:uppercase; 
          border-left:2px solid transparent;
          border-radius:6px;
          position:relative;
        }
        .sb-item:hover:not(.sb-active) { 
          color:var(--text); 
          background:rgba(255,255,255,0.04); 
          transform:translateX(2px);
        }
        .sb-item:active:not(.sb-active) {
          transform:scale(0.98) translateX(2px);
        }
        .sb-active { 
          color:var(--gold); 
          font-weight:600; 
          border-left:3px solid var(--gold); 
          background:rgba(200,135,58,0.08);
          transform:translateX(0);
        }
        .sb-active svg { color:var(--gold); }
        .sb-divider { height:1px; background:var(--border); margin:8px 0; }
        .sb-support { padding:20px 24px; border-top:1px solid var(--border); }
        .sb-support-label { font-size:9px; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
        .sb-support-val { font-size:12px; color:var(--text); display:flex; align-items:center; gap:8px; }
      `}</style>

      <div className="sb">
        <div className="sb-logo">
          <div className="sb-logo-icon"><FaLeaf size={13} /></div>
          AlertNest
        </div>

        <div className="sb-nav">
          {items.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} onClick={() => onNav(item.label)}
                className={`sb-item${active === item.label ? ' sb-active' : ''}`}>
                <Icon size={13} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="sb-support">
          <div className="sb-support-label">Support</div>
          <div className="sb-support-val"><FaHeadset size={13} style={{ color: 'var(--gold)' }} /> 24/7 Available</div>
        </div>
      </div>
    </>
  );
}
