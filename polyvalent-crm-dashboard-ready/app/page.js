"use client";

import { useEffect, useMemo, useState } from "react";

const usa = {
  totalLeads: 500,
  uniqueCompanies: 309,
  outreachStarted: 17,
  outreachDates: [
    { label: "17 Sep", value: 6 },
    { label: "21 Sep", value: 6 },
    { label: "22 Sep", value: 5 }
  ],
  adsRunning: 250,
  noAds: 250,
  singleContact: 209,
  multiContact: 100
};

function pct(v) {
  return Number.isFinite(Number(v)) ? `${Number(v).toFixed(1)}%` : "—";
}

function Stat({ label, value, sub, trend, accent }) {
  return (
    <div className="stat">
      <div className="statLabel">{label}</div>
      <div className="statRow">
        <div className={`statValue ${accent ? "accent" : ""}`}>{value}</div>
        {trend && (
          <span className={`trend ${trend.direction || "flat"}`}>
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{" "}
            {trend.changePercent == null ? "—" : `${Math.abs(trend.changePercent)}%`}
          </span>
        )}
      </div>
      {sub && <div className="statSub">{sub}</div>}
    </div>
  );
}

function Bars({ data, labelKey="date", valueKey="leads", maxValue }) {
  const max = maxValue || Math.max(1, ...data.map(x => Number(x[valueKey]) || 0));
  return (
    <div className="bars">
      {data.map((d, i) => {
        const v = Number(d[valueKey]) || 0;
        return (
          <div className="barItem" key={i}>
            <div className="barNumber">{v || ""}</div>
            <div className="barTrack">
              <div className="barFill" style={{height:`${Math.max(v ? 7 : 1, (v/max)*100)}%`}} />
            </div>
            <div className="barLabel">{String(d[labelKey]).replace("2026-","").replaceAll("-","/")}</div>
          </div>
        );
      })}
    </div>
  );
}

function Donut({ a, b, center, aLabel, bLabel }) {
  const total = a+b || 1;
  const split = (a/total)*100;
  return (
    <div className="donutBlock">
      <div className="donut" style={{background:`conic-gradient(#4da3ff 0 ${split}%, #43c7d9 ${split}% 100%)`}}>
        <div className="donutInner"><strong>{center}</strong><span>total</span></div>
      </div>
      <div className="legend">
        <div><i className="swatch blue"/><span>{aLabel}</span><b>{a}</b></div>
        <div><i className="swatch cyan"/><span>{bLabel}</span><b>{b}</b></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState("linkedin");
  const [collapsed, setCollapsed] = useState(false);
  const [api, setApi] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      const r = await fetch("/api/dashboard", {cache:"no-store"});
      const j = await r.json();
      if (!r.ok || j.status !== "ok") throw new Error(j.message || "Could not load dashboard");
      setApi(j);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const li = api?.linkedinPostLeads;
  const countries = useMemo(() => (li?.countries || []).filter(x => x.leads > 0), [li]);

  return (
    <div className={`shell ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <button className="collapse" onClick={() => setCollapsed(v => !v)}>{collapsed ? "›" : "‹"}</button>
        <div className="brand"><span className="full">Polyvalent <em>X</em> Branviz CRM</span><span className="mini">PXB</span></div>
        <div className="workspace">Workspace</div>
        <button className={`nav ${active==="linkedin"?"active":""}`} onClick={() => setActive("linkedin")}>
          <span className="dot"/><span className="navText">Linkedin Post Leads</span>
        </button>
        <button className={`nav ${active==="usa"?"active":""}`} onClick={() => setActive("usa")}>
          <span className="dot"/><span className="navText">USA Hospitality <small>[Polyvalent]</small></span>
        </button>
      </aside>

      <main>
        {active === "linkedin" && <>
          <header>
            <div><div className="eyebrow">LinkedIn Post Leads</div><h1>Lead performance</h1><p>Live data from Google Sheets</p></div>
            <div className="updated">{api?.updatedAt ? `Updated ${api.updatedAt}` : "Connecting…"}</div>
          </header>

          {error && <div className="error">{error}</div>}

          <section className="stats six">
            <Stat label="Total leads" value={li?.totalLeads ?? "—"} accent/>
            <Stat label="Avg leads / day" value={li?.avgLeadsPerDay ?? "—"}/>
            <Stat label="Last 7 days leads" value={li?.last7Days?.leads ?? "—"} trend={li?.last7Days} accent/>
            <Stat label="Reply rate" value={li ? pct(li.replyRate) : "—"}/>
            <Stat label="Meetings" value={li?.meetings ?? "—"}/>
            <Stat label="Lead → meeting" value={li ? pct(li.meetingConversion) : "—"}/>
          </section>

          <section className="panel">
            <div className="panelHead"><h2>LinkedIn Post Lead Trend</h2><span>Auto refresh · 60 sec</span></div>
            <div className="chartPad">{li?.daily?.length ? <Bars data={li.daily}/> : <div className="empty">Waiting for data…</div>}</div>
          </section>

          <section className="panel">
            <div className="panelHead"><h2>Country mix</h2></div>
            <div className="countryGrid">
              <div className="countrySummary"><strong>{li?.totalLeads ?? "—"}</strong><span>total leads</span></div>
              <div className="countryList">
                {countries.map(c => <div className="countryRow" key={c.country}><span>{c.country}</span><b>{c.leads}</b></div>)}
              </div>
            </div>
          </section>
        </>}

        {active === "usa" && <>
          <header>
            <div><div className="eyebrow">USA Hospitality · Polyvalent</div><h1>Outbound coverage</h1><p>US hospitality prospecting dashboard</p></div>
            <div className="updated">500 lead snapshot</div>
          </header>

          <section className="stats three">
            <Stat label="Total leads" value={usa.totalLeads} accent/>
            <Stat label="Unique companies" value={usa.uniqueCompanies}/>
            <Stat label="Outreach started" value={usa.outreachStarted} sub="3.4% of total leads"/>
          </section>

          <section className="panel">
            <div className="panelHead"><h2>Outreach activity</h2><span>17 leads contacted</span></div>
            <div className="chartPad"><Bars data={usa.outreachDates} labelKey="label" valueKey="value" maxValue={6}/></div>
          </section>

          <div className="twoCol">
            <section className="panel"><div className="panelHead"><h2>Google Ads presence</h2></div>
              <Donut a={usa.adsRunning} b={usa.noAds} center={usa.totalLeads} aLabel="Ads running" bLabel="No ads"/>
            </section>
            <section className="panel"><div className="panelHead"><h2>Account coverage</h2></div>
              <Donut a={usa.singleContact} b={usa.multiContact} center={usa.uniqueCompanies} aLabel="Single-contact companies" bLabel="Multi-contact companies"/>
            </section>
          </div>
        </>}
      </main>
    </div>
  );
}
