import { useState } from "react";
import './CertAccordion.css';

export default function CertAccordion({ items = [], height = 360, colors }) {
  const [active, setActive] = useState(0);
  const C = colors || {};
  const isDark = C.isDark !== false;
  const panelBg = C.surface || (isDark ? "#0a1028" : "#ffffff");
  const panelBorder = C.border || (isDark ? "rgba(148,163,184,0.16)" : "rgba(30,41,59,0.08)");
  const imgBg = isDark ? "#f1f5f9" : "#f8fafc";
  const overlayBg = isDark ? "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)" : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0) 75%)";
  const titleColor = isDark ? "#fff" : "#0f172a";
  const issuerColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(15,23,42,0.75)";
  const dateColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.55)";
  return (
    <div className="cert-accordion" style={{ height }}>
      {items.map((item, i) => {
        const isActive = active === i;
        return (
          <div
            key={i}
            className={`cert-accordion__panel${isActive ? ' is-active' : ''}`}
            onClick={() => setActive((prev) => (prev === i ? -1 : i))}
            role="button"
            tabIndex={0}
            aria-expanded={isActive}
            style={{ background: panelBg, border: `1px solid ${panelBorder}` }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}
          >
            <img className="cert-accordion__img" src={item.image} alt={item.name} draggable={false} style={{ background: imgBg }} />
            <div className="cert-accordion__overlay" style={{ background: overlayBg }}>
              <div className="cert-accordion__title" style={{ color: titleColor }}>{item.name}</div>
              {isActive && (
                <div className="cert-accordion__details">
                  <div className="cert-accordion__issuer" style={{ color: issuerColor }}>{item.issuer}</div>
                  <div className="cert-accordion__date" style={{ color: dateColor }}>{item.date}</div>
                  <a className="cert-accordion__verify" href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    verify →
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
