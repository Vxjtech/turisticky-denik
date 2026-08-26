'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bookmark, Check, ChevronDown, Compass, MapPin, Plus, Search, ShieldCheck, Star, TentTree, UserRound } from 'lucide-react'

type Monument = { id: string; name: string; region: string; type: string; area: string; description: string; color: string; image: string }
type Profile = { id: string; name: string; initials: string }
type Entry = { profileId: string; monumentId: string; visited: boolean; rating: number; comment: string }

const monumentNames = [
  ['Pražský hrad', 'Hlavní město Praha', 'Praha'], ['Zoologická zahrada hl. m. Prahy', 'Hlavní město Praha', 'Praha'], ['AquaPalace Praha', 'Hlavní město Praha', 'Čestlice'], ['Dolní Vítkovice', 'Moravskoslezský kraj', 'Ostrava'], ['Aqualand Moravia', 'Jihomoravský kraj', 'Pasohlávky'], ['Zoo Zlín', 'Zlínský kraj', 'Zlín'], ['Jihočeská zoologická zahrada Hluboká nad Vltavou', 'Jihočeský kraj', 'Hluboká nad Vltavou'], ['Adršpašské skály', 'Královéhradecký kraj', 'Adršpach'], ['Zoologická a botanická zahrada města Plzně', 'Plzeňský kraj', 'Plzeň'], ['iQPARK a iQLANDIA', 'Liberecký kraj', 'Liberec'], ['Zoologická zahrada Ostrava', 'Moravskoslezský kraj', 'Ostrava'], ['Zoologická zahrada Olomouc', 'Olomoucký kraj', 'Olomouc'], ['Zoologická zahrada Jihlava', 'Kraj Vysočina', 'Jihlava'], ['Safari Park Dvůr Králové', 'Královéhradecký kraj', 'Dvůr Králové'], ['Areál Pražského hradu', 'Hlavní město Praha', 'Praha'], ['Židovské muzeum v Praze', 'Hlavní město Praha', 'Praha'], ['Petřínská rozhledna', 'Hlavní město Praha', 'Praha'], ['Strahovský klášter', 'Hlavní město Praha', 'Praha'], ['zámek Lednice', 'Jihomoravský kraj', 'Lednice'], ['zámek Český Krumlov', 'Jihočeský kraj', 'Český Krumlov'], ['zámek Hluboká nad Vltavou', 'Jihočeský kraj', 'Hluboká nad Vltavou'], ['hrad Karlštejn', 'Středočeský kraj', 'Karlštejn'], ['hrad Bouzov', 'Olomoucký kraj', 'Bouzov'], ['hrad Loket', 'Karlovarský kraj', 'Loket'], ['Valašské muzeum v přírodě', 'Zlínský kraj', 'Rožnov pod Radhoštěm'], ['Park Mirakulum', 'Středočeský kraj', 'Milovice'], ['Svatá Hora', 'Středočeský kraj', 'Příbram'], ['Areál Sedlec', 'Středočeský kraj', 'Kutná Hora'], ['Škoda Muzeum', 'Středočeský kraj', 'Mladá Boleslav'], ['zámek Loučeň', 'Středočeský kraj', 'Loučeň'], ['Průhonický park a zámek', 'Středočeský kraj', 'Průhonice'], ['chrám sv. Barbory', 'Středočeský kraj', 'Kutná Hora'], ['Památník Lidice', 'Středočeský kraj', 'Lidice'], ['Národní památník na Vítkově', 'Hlavní město Praha', 'Praha'], ['Armádní muzeum Žižkov', 'Hlavní město Praha', 'Praha'], ['Národní památník heydrichiády', 'Hlavní město Praha', 'Praha'], ['Husitské muzeum v Táboře', 'Jihočeský kraj', 'Tábor'], ['Vila Grossmann', 'Moravskoslezský kraj', 'Ostrava'], ['Hrad Trosky', 'Liberecký kraj', 'Troskovice'], ['zámek Konopiště', 'Středočeský kraj', 'Benešov'], ['hrad Křivoklát', 'Středočeský kraj', 'Křivoklát'], ['zámek Vranov nad Dyjí', 'Jihomoravský kraj', 'Vranov nad Dyjí'], ['hrad Veveří', 'Jihomoravský kraj', 'Brno'], ['zámek Buchlovice', 'Zlínský kraj', 'Buchlovice'], ['Květná zahrada v Kroměříži', 'Zlínský kraj', 'Kroměříž'], ['hrad Buchlov', 'Zlínský kraj', 'Buchlov'], ['zámek Hradec nad Moravicí', 'Moravskoslezský kraj', 'Hradec nad Moravicí'], ['zámek Raduň', 'Moravskoslezský kraj', 'Raduň'], ['zámek Telč', 'Kraj Vysočina', 'Telč'], ['zámek Zákupy', 'Liberecký kraj', 'Zákupy'],
] as const
const monuments: Monument[] = monumentNames.map(([name, region, area], index) => ({ id: `monument-${index + 1}`, name, region, type: 'Památka', area, description: `Objevte ${name} a vytvořte si vlastní vzpomínku z cesty.`, color: '#496756', image: `https://images.unsplash.com/photo-${['1541849546-216549ae216d','1601918774946-25832a4be0d6','1500534623283-312aade485b7','1585320806297-9794b3e4eeae'][index % 4]}?auto=format&fit=crop&w=900&q=80` }))

const initialProfiles: Profile[] = [{ id: 'vojtech-vlcek', name: 'Vojtech Vlcek', initials: 'VV' }]
const initialEntries: Entry[] = [
  { profileId: 'vojtech-vlcek', monumentId: 'praha', visited: true, rating: 5, comment: 'Ranní procházka kolem Zlaté uličky. Nejhezčí je výhled na střechy Malé Strany.' },
  { profileId: 'vojtech-vlcek', monumentId: 'telc', visited: true, rating: 4, comment: 'Krásné náměstí, ideální na pomalé odpoledne s fotoaparátem.' },
]

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [activeProfile, setActiveProfile] = useState('vojtech-vlcek')
  const [entries, setEntries] = useState<Entry[]>(initialEntries)
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('Všechny kraje')
  const [selected, setSelected] = useState<Monument | null>(monuments[0])
  const [newComment, setNewComment] = useState('')
  const [newProfile, setNewProfile] = useState(false)
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    const savedProfiles = localStorage.getItem('turisticky-denik-profiles')
    const savedEntries = localStorage.getItem('turisticky-denik-entries')
    if (savedProfiles) setProfiles(JSON.parse(savedProfiles))
    if (savedEntries) setEntries(JSON.parse(savedEntries))
  }, [])
  useEffect(() => { localStorage.setItem('turisticky-denik-profiles', JSON.stringify(profiles)) }, [profiles])
  useEffect(() => { localStorage.setItem('turisticky-denik-entries', JSON.stringify(entries)) }, [entries])

  const myEntries = entries.filter((entry) => entry.profileId === activeProfile)
  const visited = myEntries.filter((entry) => entry.visited)
  const filtered = useMemo(() => monuments.filter((m) => `${m.name} ${m.area} ${m.type}`.toLowerCase().includes(query.toLowerCase()) && (region === 'Všechny kraje' || m.region === region)), [query, region])
  const currentEntry = selected ? myEntries.find((entry) => entry.monumentId === selected.id) : undefined
  const currentProfile = profiles.find((profile) => profile.id === activeProfile) || profiles[0]

  function updateEntry(monumentId: string, patch: Partial<Entry>) {
    setEntries((old) => {
      const found = old.find((entry) => entry.profileId === activeProfile && entry.monumentId === monumentId)
      if (found) return old.map((entry) => entry === found ? { ...entry, ...patch } : entry)
      return [...old, { profileId: activeProfile, monumentId, visited: false, rating: 0, comment: '', ...patch }]
    })
  }
  function addProfile() {
    const clean = profileName.trim()
    if (!clean) return
    const profile = { id: `${clean.toLowerCase().replaceAll(' ', '-')}-${Date.now()}`, name: clean, initials: clean.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }
    setProfiles((old) => [...old, profile]); setActiveProfile(profile.id); setProfileName(''); setNewProfile(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="topbar"><div className="brand"><span className="brand-mark"><Compass size={22} /></span><span>Turistický deník</span></div><nav><a className="active" href="#objevuj">Objevuj</a><a href="#muj-denik">Můj deník</a></nav><div className="profile-switch"><div className="avatar">{currentProfile.initials}</div><select value={activeProfile} onChange={(e) => setActiveProfile(e.target.value)} aria-label="Aktivní profil">{profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select><ChevronDown size={15} /><button className="icon-button" onClick={() => setNewProfile(true)} aria-label="Přidat profil"><Plus size={18} /></button></div></header>
      {newProfile && <div className="modal-backdrop"><div className="modal"><button className="close" onClick={() => setNewProfile(false)}>×</button><p className="eyebrow">Nový cestovatel</p><h2>Vytvoř si profil</h2><p className="muted">Tvoje zápisky zůstanou oddělené od ostatních profilů.</p><input autoFocus value={profileName} onChange={(e) => setProfileName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addProfile()} placeholder="Jméno a příjmení" /><button className="primary-button" onClick={addProfile}>Vytvořit profil</button></div></div>}
      <section className="hero" id="objevuj"><div className="hero-copy"><p className="eyebrow">Atlas českých cest</p><h1>Objevuj místa,<br /><em>která stojí za cestu.</em></h1><p className="hero-text">Prozkoumej nejkrásnější památky Česka a vytvoř si vlastní stopu na mapě. Každá návštěva je jeden příběh.</p><div className="hero-stats"><span><strong>{monuments.length}</strong> míst v katalogu</span><span><strong>{visited.length}</strong> navštíveno</span><span><strong>{Math.round((visited.length / monuments.length) * 100)}%</strong> objeveno</span></div></div><div className="hero-card"><div className="stamp"><TentTree size={24} /><span>MOJE<br />CESTY</span></div><div className="route-line" /><p>„Nejlepší výhled je<br />ten, za kterým<br /><b>dojdeš sám.“</b></p><span className="coordinates">50° 05' 16.4&quot; N&nbsp;&nbsp; 14° 24' 45.6&quot; E</span></div></section>
      <section className="workspace"><div className="section-heading"><div><p className="eyebrow">Katalog památek</p><h2>Kam se vydáš příště?</h2></div><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Hledat místo, region..." /></div></div><div className="filters"><div className="filter-tabs"><button className={region === 'Všechny kraje' ? 'selected' : ''} onClick={() => setRegion('Všechny kraje')}>Všechna místa</button>{['Hlavní město Praha', 'Jihomoravský kraj', 'Kraj Vysočina', 'Královéhradecký kraj'].map((r) => <button className={region === r ? 'selected' : ''} key={r} onClick={() => setRegion(r)}>{r.replace(' kraj', '')}</button>)}</div><span className="result-count">{filtered.length} výsledků</span></div><div className="content-grid"><div className="cards">{filtered.map((monument) => { const entry = myEntries.find((item) => item.monumentId === monument.id); return <article className={`place-card ${selected?.id === monument.id ? 'chosen' : ''}`} key={monument.id} onClick={() => { setSelected(monument); setNewComment(entry?.comment || '') }}><div className="place-image" style={{ backgroundImage: `url(${monument.image})` }}>{entry?.visited && <span className="visited-badge"><Check size={13} /> Navštíveno</span>}</div><div className="place-info"><div><h3>{monument.name}</h3><p><MapPin size={14} /> {monument.area}</p></div><button className="bookmark" onClick={(e) => { e.stopPropagation(); updateEntry(monument.id, { visited: !entry?.visited }) }} aria-label="Označit navštíveno"><Bookmark size={18} fill={entry?.visited ? 'currentColor' : 'none'} /></button></div></article> })}</div><aside className="detail-panel">{selected && <><div className="detail-top"><span className="eyebrow">Detail místa</span><span className="privacy"><ShieldCheck size={14} /> Soukromý zápis</span></div><h2>{selected.name}</h2><p className="detail-location"><MapPin size={15} /> {selected.region}</p><p className="detail-description">{selected.description}</p><div className="visit-row"><button className={`visit-button ${currentEntry?.visited ? 'done' : ''}`} onClick={() => updateEntry(selected.id, { visited: !currentEntry?.visited })}>{currentEntry?.visited ? <><Check size={17} /> Navštíveno</> : <><Plus size={17} /> Přidat do deníku</>}</button></div><div className="rating"><span>Moje hodnocení</span><div>{[1, 2, 3, 4, 5].map((star) => <button key={star} onClick={() => updateEntry(selected.id, { rating: star })} aria-label={`Hodnotit ${star} hvězdami`}><Star size={21} fill={(currentEntry?.rating || 0) >= star ? 'currentColor' : 'none'} /></button>)}</div></div><div className="note"><label htmlFor="note">Osobní poznámka</label><textarea id="note" value={newComment} onChange={(e) => setNewComment(e.target.value)} onBlur={() => updateEntry(selected.id, { comment: newComment })} placeholder="Co sis z návštěvy odnesl?" /><p><ShieldCheck size={13} /> Tento zápis vidíš pouze ty</p></div></>}</aside></div></section><footer><span>Turistický deník</span><span>Data zůstávají uložená v tomto prohlížeči jako JSON.</span></footer>
    </main>
  )
}
