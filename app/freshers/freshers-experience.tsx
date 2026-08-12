"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Award, BookOpen, CalendarDays, Check, ChevronRight,
  CircleHelp, Compass, ExternalLink, Flag, HeartHandshake, MapPin, Menu, Play,
  Rocket, Send, ShieldCheck, Sparkles, Star, Trophy, Users, X, Zap
} from "lucide-react";

export type FreshersPage = "home" | "start" | "orientation" | "day" | "passport" | "quest" | "toolkit" | "campus" | "find-your-thing" | "clubs" | "community" | "technova" | "feedback" | "credential" | "help" | "admin" | "verify";

type Props = { page: FreshersPage; day?: number; credential?: string };
type Profile = { name: string; school: string; programme: string; interests: string[] };

const days = [
  { no: 1, date: "24 August 2025 · Monday", title: "Welcome", verb: "Settle in. Find your bearings.", color: "#ff7043", sessions: [["9:30 am – 10:00 am", "Introductory talk of the School Dean — programme overview and relevance of OBE", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:00 am – 10:45 am", "Expert guest lecture by Mr. Neeraj Narang (Oracle, Noida)", "APJ Abdul Kalam Audi 005, B4", "Confirmed"], ["10:45 am – 11:00 am", "Associate Dean address", "APJ Abdul Kalam Audi 005, B5", "Confirmed"], ["11:00 am – 11:45 am", "Expert guest lecture", "APJ Abdul Kalam Audi 005, B6", "Confirmed"], ["11:45 am – 12:30 pm", "About the University — reading of the handbook by Dr. Ali", "APJ Abdul Kalam Audi 005, B7", "Confirmed"], ["12:30 pm – 1:30 pm", "Break", "—", "Break"], ["1:30 pm – 2:15 pm", "Expert guest lecture", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["2:20 pm – 4:00 pm", "Departmental activities / management games (Joy of Learning) / talent-hunt nominations", "APJ Abdul Kalam Audi 005, B3", "Confirmed"]] },
  { no: 2, date: "25 August 2025 · Tuesday", title: "Explore", verb: "Make the campus feel like yours.", color: "#47b7ff", sessions: [["9:30 am – 10:00 am", "HoD’s address (CSE + CSA)", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:00 am – 10:45 am", "Expert guest lecture by Mr. Kunal Barhu (Microsoft)", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:45 am – 11:00 am", "Academic and programme description by Deputy HoD — CSE", "APJ Abdul Kalam Audi 005, B4", "Confirmed"], ["11:00 am – 11:45 am", "Expert guest lecture", "APJ Abdul Kalam Audi 005, B5", "Confirmed"], ["11:45 am – 12:00 pm", "Academic and programme description by Deputy HoD — CSA", "APJ Abdul Kalam Audi 005, B6", "Confirmed"], ["12:00 pm – 12:30 pm", "Librarian session by Dr. Sushanata Kumar Sahoo", "APJ Abdul Kalam Audi 005, B7", "Confirmed"], ["12:30 pm – 1:30 pm", "Break", "—", "Break"], ["1:30 pm – 2:15 pm", "Expert guest lecture by Colonel from Ghaziabad", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["2:15 pm – 4:00 pm", "Cultural activities", "APJ Abdul Kalam Audi 005, B3", "Confirmed"]] },
  { no: 3, date: "27 August 2025 · Thursday", title: "Connect", verb: "Start finding your people.", color: "#de7dff", sessions: [["9:30 am – 10:00 am", "Introduction to online courses (NPTEL/Swayam), remedial courses, research-based learning, project-based learning and student research schemes", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:00 am – 10:45 am", "Expert guest lecture", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:45 am – 11:15 am", "Sharda Academic Portal training — mentoring system and Paramarsh Portal, Dr. Shushant", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["11:15 am – 12:00 pm", "Alumni session", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["12:00 pm – 12:30 pm", "Department lab visit", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["12:30 pm – 1:30 pm", "Break", "—", "Break"], ["1:30 pm – 2:15 pm", "Alumni session", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["2:15 pm – 4:00 pm", "Talent hunt / sport activity", "APJ Abdul Kalam Audi 005, B4", "Confirmed"]] },
  { no: 4, date: "29 August 2025 · Saturday", title: "Discover", verb: "Find things worth showing up for.", color: "#efbf45", sessions: [["9:30 am – 10:15 am", "Session by Placement Incharge", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["10:15 am – 11:00 am", "Expert guest lecture by Director, KPMG", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["11:00 am – 11:45 am", "Centre of Excellence and Startup Incubation Centre — Dr. Shivam Tiwari", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["11:45 am – 12:30 pm", "Mentoring system and meeting with mentors", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["12:30 pm – 1:30 pm", "Break", "—", "Break"], ["1:30 pm – 3:00 pm", "Talent hunt / sport activity", "APJ Abdul Kalam Audi 005, B3", "Confirmed"], ["3:00 pm – 4:00 pm", "Valedictory function — quiz, feedback and certificate distribution", "Outdoor activity", "Confirmed"]] },
  { no: 5, date: "Schedule to be confirmed", title: "University", verb: "Learn how the bigger picture works.", color: "#6dd98c", sessions: [["TBC", "Official Day 5 schedule will appear here once confirmed.", "To be announced", "Pending"]] },
  { no: 6, date: "Schedule to be confirmed", title: "Launch", verb: "Turn six days into momentum.", color: "#fd99bb", sessions: [["TBC", "Official Day 6 schedule will appear here once confirmed.", "To be announced", "Pending"]] },
];

const interests = ["AI", "Machine Learning", "Coding", "Cloud", "Cybersecurity", "Data", "Robotics", "Gaming", "Photography", "Design", "Entrepreneurship", "Open Source", "Content", "Research", "Startups"];
const missions = [
  ["Find your School building", "Use campus mode to locate your home block.", "Campus explorer"],
  ["Find the library", "Visit the Central Library and save it to your guide.", "Campus explorer"],
  ["Meet someone new", "Start one conversation with a person in your cohort.", "First connection"],
  ["Discover a student community", "Explore one community that feels interesting.", "Community discoverer"],
  ["Complete today’s feedback", "Tell the orientation team how today felt.", "Your voice matters"],
  ["Make your professional home", "Set up the first version of your LinkedIn profile.", "Future-facing"],
];

const clubs = [
  { name: "AI & Robotics", score: 96, tags: ["AI", "Machine Learning", "Robotics"], text: "Build intelligent systems. Experiment with what’s next.", tone: "#d2ff63" },
  { name: "Datapool", score: 88, tags: ["Data", "Coding", "Research"], text: "Turn curiosity into patterns, models and real insight.", tone: "#66bbff" },
  { name: "GitHub Club", score: 81, tags: ["Coding", "Open Source", "Development"], text: "Make things together, in the open.", tone: "#ff9366" },
  { name: "PiXelance", score: 76, tags: ["Design", "Photography", "Content"], text: "Make visual work people stop to look at.", tone: "#ff8fc7" },
];

function source(kind: "official" | "guide" | "community") {
  const labels = { official: "Official", guide: "Student guide", community: "Community" };
  return <span className={`f-source f-source--${kind}`}>{labels[kind]}</span>;
}

function Button({ href, children, secondary = false, onClick }: { href?: string; children: React.ReactNode; secondary?: boolean; onClick?: () => void }) {
  const cls = `f-button ${secondary ? "f-button--secondary" : ""}`;
  if (href) return <Link className={cls} href={href}>{children}<ArrowRight size={17} /></Link>;
  return <button className={cls} onClick={onClick}>{children}<ArrowRight size={17} /></button>;
}

function Shell({ children, minimal = false, profile, onHelp }: { children: React.ReactNode; minimal?: boolean; profile?: Profile; onHelp: () => void }) {
  const [menu, setMenu] = useState(false);
  return <>
    <header className="f-nav">
      <Link href="/freshers" className="f-brand" aria-label="Fresher 26 home"><span>FRESHER</span><b>// 26</b></Link>
      {!minimal && <nav className={menu ? "f-navlinks f-navlinks--open" : "f-navlinks"}>
        <Link href="/freshers/orientation">Orientation</Link><Link href="/freshers/quest">Quest</Link><Link href="/freshers/passport">Passport</Link>
        <Link href="/freshers/toolkit">Toolkit</Link>
      </nav>}
      {!minimal && <div className="f-navend"><button className="f-profile" onClick={() => location.assign("/freshers/passport")}>{profile?.name?.slice(0, 1) || "F"}</button><button className="f-menu" onClick={() => setMenu(!menu)} aria-label="Open navigation">{menu ? <X/> : <Menu/>}</button></div>}
    </header>
    {children}
    {!minimal && <button className="f-lost" onClick={onHelp}><CircleHelp size={18}/><span>I’m lost</span></button>}
  </>;
}

function Home({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  return <Shell minimal onHelp={onHelp} profile={profile}>
    <main className="f-home">
      <div className="f-grid" /><div className="f-orb f-orb--one"/><div className="f-orb f-orb--two"/>
      <section className="f-homecopy f-reveal">
        <p className="f-kicker">Sharda University · 2026 intake</p>
        <h1>Welcome<br/>to your <em>next</em> era.</h1>
        <p className="f-lede">Your first six days at Sharda, figured out.</p>
        <div className="f-actions"><Button href={profile ? "/freshers/orientation" : "/freshers/start"}>{profile ? "Continue my journey" : "Start my journey"}</Button><Link className="f-textlink" href="/login">I already have an account <ArrowUpRight size={16}/></Link></div>
      </section>
      <aside className="f-homecard f-reveal f-delay">
        <div className="f-homecard-top"><span>YOUR FIRST WEEK</span><b>01—06</b></div>
        <div className="f-path"><i/><span>Welcome</span><i/><span>Explore</span><i/><span>Connect</span><i/><span>Discover</span><i/><span>Launch</span></div>
        <p>School-led.<br/>Student-built.</p>
      </aside>
      <p className="f-powered">Built by students <i/> Powered by Technova</p>
    </main>
  </Shell>;
}

function Start({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const [step, setStep] = useState(0); const [name, setName] = useState(profile?.name || ""); const [school, setSchool] = useState(profile?.school || "School of Computing Sciences & Engineering (SSCSE)"); const [programme, setProgramme] = useState(profile?.programme || "B.Tech — Computer Science"); const [chosen, setChosen] = useState<string[]>(profile?.interests || ["AI", "Coding"]);
  const toggle = (item: string) => setChosen(v => v.includes(item) ? v.filter(x => x !== item) : [...v, item]);
  const next = () => { if (step < 2) setStep(step + 1); else { localStorage.setItem("freshers-profile", JSON.stringify({ name: name || "Fresher", school, programme, interests: chosen })); location.assign("/freshers/orientation"); } };
  return <Shell minimal onHelp={onHelp} profile={profile}><main className="f-onboarding">
    <div className="f-stepper"><span className={step >= 0 ? "active" : ""}/><span className={step >= 1 ? "active" : ""}/><span className={step >= 2 ? "active" : ""}/><b>0{step + 1} / 03</b></div>
    {step === 0 && <section className="f-setup f-reveal"><p className="f-kicker">Make it yours</p><h1>First things<br/>first.</h1><p className="f-lede">A few details, then we’ll shape your first week around you.</p><div className="f-fields"><label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="What should we call you?" autoFocus /></label><label>School<select value={school} onChange={e => setSchool(e.target.value)}><option>School of Computing Sciences & Engineering (SSCSE)</option><option>School of Business Studies</option><option>School of Design</option><option>School of Law</option></select></label><label>Programme<input value={programme} onChange={e => setProgramme(e.target.value)} /></label></div><Button onClick={next}>Keep going</Button></section>}
    {step === 1 && <section className="f-setup f-reveal"><p className="f-kicker">No pressure</p><h1>What are<br/>you into?</h1><p className="f-lede">You don’t need to know what you want to become yet.</p><div className="f-chips">{interests.map(item => <button key={item} className={chosen.includes(item) ? "selected" : ""} onClick={() => toggle(item)}>{chosen.includes(item) && <Check size={14}/>} {item}</button>)}</div><Button onClick={next}>Make my journey</Button></section>}
    {step === 2 && <section className="f-ready f-reveal"><div className="f-portrait">{(name || "F").slice(0, 1)}</div><p className="f-kicker">Profile created</p><h1>Your journey<br/>is ready.</h1><div className="f-ready-grid"><span><CalendarDays/>6 days to explore</span><span><Trophy/>6 missions waiting</span><span><Sparkles/>Your passport is live</span></div><Button onClick={next}>Enter orientation</Button></section>}
  </main></Shell>;
}

function Orientation({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const today = days[0];
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page f-orientation">
    <div className="f-sectionhead"><div>{source("official")}<p className="f-kicker">SSCSE orientation · confirmed schedule</p><h1>Day 01 <span>/ 06</span></h1></div><div className="f-progress"><span>THE JOURNEY</span><div><i style={{width:"17%"}}/></div><b>4 days confirmed</b></div></div>
    <section className="f-today"><div className="f-today-intro"><p className="f-kicker">{today.date}</p><h2>Welcome.</h2><p>Your only job today: arrive, look around, and ask the questions you have.</p><Button href="/freshers/day/1">Open day one</Button></div><div className="f-sessions">{today.sessions.map((s) => <Link href="/freshers/day/1" className="f-session" key={s[0]}><time>{s[0]}</time><div><span className="f-status">{s[3]}</span><h3>{s[1]}</h3><p><MapPin size={13}/>{s[2]}</p></div><ChevronRight size={19}/></Link>)}</div></section>
    <section className="f-next"><div><p className="f-kicker">One useful thing</p><h2>Not sure where to start?</h2><p>Take a look at your reporting location before you leave home.</p></div><Button href="/freshers/campus" secondary>Open campus guide</Button></section>
  </main></Shell>;
}

function Day({ onHelp, profile, no = 1 }: { onHelp: () => void; profile?: Profile; no?: number }) {
  const d = days[Math.max(0, Math.min(5, no - 1))];
  const [open, setOpen] = useState<number | null>(0);
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page f-day" style={{"--day-color": d.color} as React.CSSProperties}>
    <div className="f-dayhero"><Link href="/freshers/orientation" className="f-back">← All six days</Link><p>DAY 0{d.no} / 06 · {d.date}</p><h1>{d.title}<i>.</i></h1><span>{d.verb}</span></div>
    <div className="f-daybody"><section><p className="f-kicker">Where you need to be</p><div className="f-sessions f-sessions--detail">{d.sessions.map((s, i) => <article key={s[0]} className={open === i ? "f-session-detail f-session-detail--open" : "f-session-detail"}><button onClick={() => setOpen(open === i ? null : i)}><time>{s[0]}</time><div><span className="f-status">{s[3]}</span><h3>{s[1]}</h3><p><MapPin size={13}/>{s[2]}</p></div><ChevronRight size={19}/></button>{open === i && <div className="f-session-extra"><p>{s[3] === "Pending" ? "We’ll update this card when the School confirms the session details." : "This is part of the confirmed SSCSE orientation schedule."}</p><div><button><CalendarDays size={15}/> Add to calendar</button><Link href="/freshers/campus"><Compass size={15}/> Get directions</Link></div><small>{s[3] === "Pending" ? "Awaiting official confirmation" : "Official schedule · SSCSE"}</small></div>}</article>)}</div></section>
      <aside className="f-mission-call"><Flag/><p className="f-kicker">Today’s quest</p><h3>{missions[no === 1 ? 0 : Math.min(no, missions.length - 1)][0]}</h3><p>{missions[no === 1 ? 0 : Math.min(no, missions.length - 1)][1]}</p><Button href="/freshers/quest" secondary>See mission</Button></aside>
    </div><section className="f-endday"><p>Before you leave</p><div><Link href="/freshers/feedback">Be brutally honest <ArrowRight/></Link><Link href={`/freshers/day/${Math.min(no + 1, 6)}`}>Check tomorrow <ArrowRight/></Link></div></section>
  </main></Shell>;
}

function Passport({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const identity = profile?.name || "Your name";
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-sectionhead"><div><p className="f-kicker">Your persistent identity</p><h1>Fresher<br/>passport.</h1></div><p className="f-asidecopy">A quiet record of the places you’ve been and the things you’ve chosen to try.</p></div>
    <section className="f-passport"><div className="f-passport-brand">FRESHER <b>// 26</b><span>Sharda University</span></div><div className="f-passport-id"><div className="f-portrait">{identity.slice(0,1)}</div><div><p>FRESHER ID</p><h2>{identity}</h2><span>{profile?.programme || "Your programme"}</span></div></div><div className="f-passport-stats"><span><b>01</b> days completed</span><span><b>03</b> missions done</span><span><b>02</b> communities seen</span></div><div className="f-passport-code">FR26-SU-01824</div></section>
    <section className="f-achievements"><div><p className="f-kicker">Growing proof</p><h2>Achievements</h2></div><div className="f-badges"><article className="unlocked"><Compass/><b>Campus explorer</b><span>Found your way around</span></article><article className="unlocked"><HeartHandshake/><b>First connection</b><span>Made room for people</span></article><article><Sparkles/><b>Tech explorer</b><span>Still waiting for you</span></article><article><Rocket/><b>Orientation complete</b><span>Six days, one chapter</span></article></div></section>
  </main></Shell>;
}

function Quest({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const [done, setDone] = useState<number[]>([0, 2]);
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-sectionhead"><div><p className="f-kicker">Make the campus real</p><h1>Your next<br/>small move.</h1></div><div className="f-collective"><b>{4821 + done.length}</b><span>missions completed<br/>by freshers together</span></div></div><div className="f-quest-progress"><span>{done.length} / {missions.length} complete</span><div><i style={{width: `${done.length / missions.length * 100}%`}}/></div></div><section className="f-missions">{missions.map((m, i) => <article className={done.includes(i) ? "done" : ""} key={m[0]}><button onClick={() => setDone(v => v.includes(i) ? v.filter(x => x !== i) : [...v, i])} aria-label={`Mark ${m[0]} complete`}>{done.includes(i) ? <Check/> : <span/>}</button><div><small>MISSION 0{i + 1}</small><h2>{m[0]}</h2><p>{m[1]}</p><em>{m[2]}</em></div>{!done.includes(i) && <Link href={i < 2 ? "/freshers/campus" : i === 3 ? "/freshers/clubs" : "/freshers/feedback"}><ArrowUpRight/></Link>}</article>)}</section></main></Shell>;
}

function Toolkit({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const groups = [["College 101", "How university actually works", ["CGPA, explained", "Credits without the confusion", "How to talk to faculty"]], ["Tech 101", "The tools worth learning", ["Git in two minutes", "Your first GitHub repository", "A terminal, demystified"]], ["Career 101", "Your future-facing basics", ["Make a LinkedIn profile", "What makes a good first project", "Resume: start before you need it"]], ["Life 101", "The parts nobody puts in the brochure", ["Making friends without forcing it", "Managing your first semester", "When you need help"]]];
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-sectionhead"><div><p className="f-kicker">Bite-sized, actually useful</p><h1>Your<br/>toolkit.</h1></div><p className="f-asidecopy">The things you’ll want to know, each in under three minutes.</p></div><section className="f-toolkit">{groups.map((g, i) => <article key={g[0]}><div><span>0{i + 1}</span><h2>{g[0]}</h2><p>{g[1]}</p></div><ul>{(g[2] as string[]).map(x => <li key={x}><BookOpen size={16}/><button onClick={() => alert(`${x} is queued for your toolkit.`)}>{x}</button><small>2 min</small></li>)}</ul></article>)}</section></main></Shell>;
}

function Campus({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const locations = [["B2", "Your School block", "Where your orientation desk and faculty interactions are based."], ["LB", "Central Library", "A quiet place to learn, read, work, and breathe."], ["AU", "Main Auditorium", "For large sessions, showcases and campus-wide moments."], ["SS", "Student Services", "For the admin questions that shouldn’t stay questions."]]; const [chosen, setChosen] = useState(0);
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-sectionhead"><div>{source("guide")}<p className="f-kicker">Campus mode</p><h1>Find your<br/>way around.</h1></div><Button href="/freshers/quest" secondary>Open campus quest</Button></div><section className="f-map"><div className="f-map-visual"><span className="pin pin-a">B2</span><span className="pin pin-b">LB</span><span className="pin pin-c">AU</span><span className="pin pin-d">SS</span><i/><i/><i/></div><div className="f-locations">{locations.map((l,i) => <button key={l[0]} className={chosen === i ? "active" : ""} onClick={() => setChosen(i)}><b>{l[0]}</b><div><small>{i === 0 ? "Your location" : "Campus location"}</small><h2>{l[1]}</h2></div><ChevronRight/></button>)}<article><p className="f-kicker">What it is</p><h2>{locations[chosen][1]}</h2><p>{locations[chosen][2]}</p><button onClick={() => alert("Directions will open in your maps app when campus coordinates are connected.")}><MapPin/>Get directions</button></article></div></section></main></Shell>;
}

function FindYourThing({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const [selected, setSelected] = useState(profile?.interests || ["AI", "Coding"]); const matches = useMemo(() => clubs.map((club, i) => ({...club, score: Math.max(67, Math.min(98, 72 + club.tags.filter(t => selected.includes(t)).length * 12 - i * 2))})).sort((a,b)=>b.score-a.score), [selected]);
  const toggle=(x:string)=>setSelected(v=>v.includes(x)?v.filter(a=>a!==x):[...v,x]);
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-match-head"><p className="f-kicker">This is not a career decision</p><h1>What sounds<br/>like you?</h1><p>Pick the things that make you curious. We’ll point you to the people already making them happen.</p><div className="f-chips">{["AI","Cloud","Cybersecurity","Data","Gaming","Open Source","Photography","Startups","Robotics","Coding","Design"].map(x=><button key={x} className={selected.includes(x)?"selected":""} onClick={()=>toggle(x)}>{x}</button>)}</div></div><section className="f-matches"><p className="f-kicker">Your top matches</p>{matches.slice(0,3).map((club,i)=><Link href="/freshers/clubs" className="f-match" key={club.name}><b>0{i+1}</b><div><h2>{club.name}</h2><p>{club.text}</p></div><strong>{club.score}%<small> match</small></strong><ArrowUpRight/></Link>)}</section></main></Shell>;
}

function Clubs({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><div className="f-sectionhead"><div>{source("community")}<p className="f-kicker">Beyond class</p><h1>Find your<br/>people.</h1></div><Button href="/freshers/find-your-thing" secondary>Find my match</Button></div><section className="f-clubs">{clubs.map(c=><article key={c.name} style={{"--club":c.tone} as React.CSSProperties}><span>{c.score}% match</span><h2>{c.name}</h2><p>{c.text}</p><div><b>You might enjoy this if</b>{c.tags.map(t=><i key={t}>{t}</i>)}</div><footer><Link href="/clubs"><ExternalLink size={15}/> Explore club</Link><Link href="/freshers/community">Join community <ArrowRight size={15}/></Link></footer></article>)}</section><section className="f-next f-next--dark"><div><p className="f-kicker">The bigger picture</p><h2>What will you build here?</h2><p>Communities are only one place to start.</p></div><Button href="/freshers/technova">Meet Technova</Button></section></main></Shell>;
}

function Community({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><section className="f-community-hero"><p className="f-kicker">Your people are already here</p><h1>Don’t figure it<br/>out alone.</h1><p>Find study partners, teammates, and people who are curious about the same things you are.</p><Button href="/buddy-finder">Find my people</Button></section><section className="f-conversations"><p className="f-kicker">Start with something easy</p><h2>Conversation prompts</h2>{["What brought you to this programme?", "What are you hoping to try this year?", "Have you found a good place to study yet?"].map((x,i)=><article key={x}><span>0{i+1}</span>{x}<button onClick={() => navigator.clipboard?.writeText(x)}>Copy</button></article>)}</section></main></Shell>;
}

function Technova({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const pillars = [["⚡","Events","Hackathons, workshops and tech talks."],["◉","Learn","Bootcamps, peer learning and technical sessions."],["↗","Build","Projects and real-world experimentation."],["∞","Connect","Students, seniors, alumni and industry."],["◫","DevSpace","Resources, showcase and collaboration."],["↑","Lead","Contribution, volunteering and leadership."]];
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page f-technova">{source("community")}<section className="f-technova-hero"><p className="f-kicker">A natural next step</p><h1>Welcome to<br/><em>Technova.</em></h1><p>A student-led technical ecosystem where you can learn, build, compete, collaborate and lead.</p></section><section className="f-pillars">{pillars.map(p=><Link href="/" key={p[1]}><span>{p[0]}</span><div><h2>{p[1]}</h2><p>{p[2]}</p></div><ArrowUpRight/></Link>)}</section><section className="f-build"><p>YOUR UNIVERSITY JUST STARTED.</p><h2>What will you<br/>build here?</h2><Button href="/">Explore Technova</Button></section></main></Shell>;
}

function Feedback({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const [rating,setRating]=useState(0); const [sent,setSent]=useState(false); const [pace,setPace]=useState(2); const [selected,setSelected]=useState<string[]>([]); const options=["Campus walk", "Faculty interaction", "Student activities", "Meeting people"];
  return <Shell onHelp={onHelp} profile={profile}><main className="f-feedback"><div className="f-feedback-card">{sent ? <section className="f-thanks"><div><Check/></div><p className="f-kicker">Heard</p><h1>Thank you for<br/>being honest.</h1><p>The orientation team sees the patterns, not your identity. Your feedback helps make tomorrow better.</p><Button href="/freshers/orientation">Back to orientation</Button></section> : <><p className="f-kicker">Day 01 complete · Anonymous by default</p><h1>Before you leave,<br/>how did today feel?</h1><div className="f-rating"><p>Overall rating</p><div>{[1,2,3,4,5].map(x=><button key={x} onClick={()=>setRating(x)} className={rating>=x?"on":""} aria-label={`${x} stars`}><Star fill="currentColor"/></button>)}</div></div><div className="f-pace"><p>Today’s pace</p><div><span>Too slow</span><input type="range" min="0" max="4" value={pace} onChange={e=>setPace(+e.target.value)}/><span>Too fast</span></div></div><div className="f-feedback-options"><p>What did you enjoy?</p>{options.map(x=><button key={x} className={selected.includes(x)?"on":""} onClick={()=>setSelected(v=>v.includes(x)?v.filter(y=>y!==x):[...v,x])}>{selected.includes(x)&&<Check size={15}/>} {x}</button>)}</div><label className="f-textarea">What should we change tomorrow?<textarea placeholder="Optional, but genuinely useful."/></label><Button onClick={()=>setSent(true)}>Send feedback</Button></>}</div></main></Shell>;
}

function Credential({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const name = profile?.name || "Your Name"; const [share,setShare]=useState(false);
  return <Shell onHelp={onHelp} profile={profile}><main className="f-page"><section className="f-credential-head"><p className="f-kicker">Your first university milestone</p><h1>Something<br/>to keep.</h1><p>Six days of showing up, asking questions, and finding a place to start.</p></section><section className="f-certificate"><div className="f-certificate-mark">F // 26</div><p>Certificate of completion</p><h2>Freshers<br/>Onboarding 2026</h2><span>Awarded to</span><h3>{name}</h3><small>{profile?.school || "Sharda University"}<br/>{profile?.programme || "Incoming student"} · Batch of 2026</small><footer><span>FR26-SU-01824</span><span>Issued August 2026</span><Link href="/freshers/verify/FR26-SU-01824"><ShieldCheck/> Verify</Link></footer></section><div className="f-certificate-actions"><Button onClick={()=>setShare(true)}>Share my journey</Button><Button secondary onClick={()=>window.print()}>Save credential</Button></div>{share&&<div className="f-modal"><div><button className="f-close" onClick={()=>setShare(false)}><X/></button><p className="f-kicker">Ready to share</p><h2>This will include your name, programme and selected interests.</h2><div className="f-story"><span>FRESHER // 26</span><h3>I’m officially<br/>a fresher.</h3><p>{name} · Day 06 complete</p></div><Button onClick={()=>setShare(false)}>I understand</Button></div></div>}</main></Shell>;
}

function Help({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  return <Shell onHelp={onHelp} profile={profile}><main className="f-help"><p className="f-kicker">Fast paths, no judgement</p><h1>What do you<br/>need right now?</h1><div>{[["📍","I don’t know where to go.","/freshers/campus"],["📚","I need academic help.","/freshers/toolkit"],["🏢","I need administrative help.","/freshers/campus"],["🚌","I need transport information.","/freshers/toolkit"],["🏠","I need hostel information.","/freshers/toolkit"],["🤝","I need student/community help.","/freshers/community"],["💻","I need technical-community help.","/freshers/technova"],["🙋","I don’t know who to ask.","/freshers/community"]].map(x=><Link href={x[2]} key={x[1]}><span>{x[0]}</span>{x[1]}<ArrowRight/></Link>)}</div></main></Shell>;
}

function Admin({ onHelp, profile }: { onHelp: () => void; profile?: Profile }) {
  const bars=[64,75,88,82,91,87];
  return <Shell onHelp={onHelp} profile={profile}><main className="f-admin"><header><div><p className="f-kicker">Faculty view · Day 02</p><h1>Orientation<br/>control room.</h1></div><button onClick={()=>alert("A shareable daily report link is ready.")}><Send size={16}/> Share report</button></header><section className="f-admin-stats"><article><span>842</span><p>responses</p></article><article><span>4.42 <i>/ 5</i></span><p>overall satisfaction</p></article><article><span>91%</span><p>felt welcomed</p></article><article><span>87%</span><p>understood tomorrow</p></article></section><section className="f-admin-grid"><article className="f-chart"><p className="f-kicker">Overall satisfaction</p><h2>Experience is improving</h2><div className="f-bars">{bars.map((x,i)=><span key={i} style={{height:`${x}%`}}><i>Day {i+1}</i></span>)}</div></article><article className="f-issues"><p className="f-kicker">Top issues</p><h2>What needs attention</h2><ol><li><b>01</b><span>Navigation confusion<small>High · 138 mentions</small></span></li><li><b>02</b><span>Session transition delays<small>Medium · 82 mentions</small></span></li><li><b>03</b><span>More time for Q&A<small>Medium · 67 mentions</small></span></li></ol></article></section><section className="f-report"><p className="f-kicker">Recommended action</p><h2>Add a 10-minute student Q&A tomorrow.</h2><p>Students are responding well to the experience and want more opportunities to ask seniors practical questions.</p><button onClick={()=>alert("Action item marked as assigned.")}>Assign to orientation team <ArrowRight/></button></section></main></Shell>;
}

function Verify({ onHelp, profile, credential }: { onHelp: () => void; profile?: Profile; credential?: string }) {
  return <Shell minimal onHelp={onHelp} profile={profile}><main className="f-verify"><div className="f-verify-check"><ShieldCheck/></div><p className="f-kicker">Verified credential</p><h1>It’s real.</h1><p>This credential was issued for successful completion of the six-day university onboarding experience.</p><dl><div><dt>Name</dt><dd>{profile?.name || "Fresher 2026"}</dd></div><div><dt>Credential</dt><dd>Freshers Onboarding 2026</dd></div><div><dt>Programme</dt><dd>{profile?.programme || "Sharda University"}</dd></div><div><dt>Issue date</dt><dd>August 2026</dd></div><div><dt>Credential ID</dt><dd>{credential || "FR26-SU-01824"}</dd></div></dl><span className="f-verified"><Check/> Verified</span></main></Shell>;
}

export function FreshersExperience({ page, day, credential }: Props) {
  const [profile, setProfile] = useState<Profile | undefined>(); const [help, setHelp] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("freshers-profile"); if (saved) setProfile(JSON.parse(saved)); } catch {} }, []);
  const props = { onHelp: () => setHelp(true), profile };
  const views: Record<FreshersPage, React.ReactNode> = { home:<Home {...props}/>, start:<Start {...props}/>, orientation:<Orientation {...props}/>, day:<Day {...props} no={day}/>, passport:<Passport {...props}/>, quest:<Quest {...props}/>, toolkit:<Toolkit {...props}/>, campus:<Campus {...props}/>, "find-your-thing":<FindYourThing {...props}/>, clubs:<Clubs {...props}/>, community:<Community {...props}/>, technova:<Technova {...props}/>, feedback:<Feedback {...props}/>, credential:<Credential {...props}/>, help:<Help {...props}/>, admin:<Admin {...props}/>, verify:<Verify {...props} credential={credential}/> };
  return <>{views[page]}{help && <div className="f-help-drawer"><button onClick={()=>setHelp(false)}><X/></button><Help {...props}/></div>}</>;
}
