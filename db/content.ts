// Bilingual seed content, shared by db/seed.ts and scripts/backfill-content.ts.
// Serbian (rs) and English (en). No em dashes or en dashes anywhere: prose uses
// commas and periods so it reads like a person wrote it.

export const SELF_HOSTED_LAB_DETAIL_EN = `It started, as these things always do, with a cloud bill. I was paying for a VPS here, a managed database there, a password manager subscription, a file sync plan, and one evening I added it all up and realized I was renting a worse version of something I could own for the price of a used mini PC.

So I bought one. A small, quiet, second hand box with a low power CPU and more RAM than it deserved, and I gave myself one rule: everything I depend on daily either runs on this machine or has a documented reason why it doesn't.

Proxmox went on first. I'd lived in the VMware and bare metal worlds as a sysadmin, and Proxmox hits the sweet spot. Real virtualization when I want isolation, LXC when I want density, and a web UI that doesn't fight me at 1 a.m. On top of that, Docker inside a dedicated VM runs the actual workload: Vaultwarden for passwords, Nextcloud for files, Gitea for private repos, Uptime Kuma watching all of it, and a small reverse proxy terminating TLS in front of everything.

Version two, the rebuild this post is named after, was about fixing what v1 taught me the hard way. Backups went from "I'll get to it" to automated, offsite, and restore tested. The network got segmented: IoT junk on its own VLAN, services behind the proxy, nothing exposed that doesn't need to be. And I finally wrote the whole thing down, because the bus factor of a home lab is exactly one.

Is it cheaper than the cloud? Roughly, yes. The box paid for itself in under a year. But that's not the real answer. The real answer is that I understand my own infrastructure now in a way no managed service ever let me, and every 3 a.m. incident report has made me a better engineer than any course I ever took. My data, my machines, my rules.`;

export const SELF_HOSTED_LAB_DETAIL_RS = `Počelo je, kao i uvek, od računa za cloud. Plaćao sam VPS ovde, managed bazu tamo, pretplatu za password manager, plan za sync fajlova. Jedne večeri sam to sabrao i shvatio da iznajmljujem lošiju verziju nečega što mogu da imam za pare polovnog mini PC.

Pa sam ga i kupio. Mala, tiha, polovna kutija, procesor male potrošnje i više RAM nego što zaslužuje. Dao sam sebi jedno pravilo: sve što mi treba svaki dan ili se vrti na ovoj mašini ili negde piše zašto ne.

Prvo je išao Proxmox. Kao sistemac sam se navrteo VMware i fizičkih servera, a Proxmox pogađa taman meru. Prava virtuelizacija kad mi treba izolacija, LXC kad mi treba gustina, i web UI koji se ne svađa sa mnom u jedan ujutru. Iznad toga Docker u posebnoj VM nosi pravi posao: Vaultwarden za lozinke, Nextcloud za fajlove, Gitea za privatne repoe, Uptime Kuma koja sve to gleda, i mali reverse proxy koji ispred svega završava TLS.

Druga verzija, ona po kojoj se ovaj tekst i zove, bila je o tome da popravim sve što me je prva naučila na teži način. Bekapi su sa "stići ću do toga" prešli na automatske, izmeštene i testirane vraćanjem. Mreža je isečena na segmente: IoT đubre na svoj VLAN, servisi iza proksija, ništa izloženo što ne mora. I konačno sam sve zapisao, jer je bus faktor jednog home laba tačno jedan.

Je l' jeftinije od clouda? Otprilike jeste, kutija se isplatila za manje od godinu dana. Ali to nije pravi odgovor. Pravi odgovor je da sad razumem svoju infrastrukturu onako kako mi nijedan managed servis to nije dao, i da me je svaki incident u tri ujutru napravio boljim inženjerom nego bilo koji kurs koji sam prošao. Moji podaci, moje mašine, moja pravila.`;

export const DRAFT_EN = "Draft in progress. I'm still writing this one, check back soon.";
export const DRAFT_RS = "Još pišem ovaj. Navrati uskoro.";

export const seedPosts = [
  {
    year: "2026",
    image: "/images/covers/self-hosted-lab.jpg",
    sortOrder: 1,
    enTitle: "Self Hosted Lab v2",
    enSubtitle: "Rebuilding My Home Lab from Scratch",
    enCollection: "Projects",
    enContent:
      "A used mini PC, Proxmox, and one rule: everything I depend on daily either runs on this box or has a documented reason why it doesn't. The rebuild that fixed every mistake v1 taught me the hard way.",
    enDetailContent: SELF_HOSTED_LAB_DETAIL_EN,
    rsTitle: "Home lab v2",
    rsSubtitle: "Home lab gradim ispočetka, drugi put",
    rsCollection: "Projekti",
    rsContent:
      "Polovni mini PC, Proxmox i jedno pravilo: sve što mi treba svaki dan ili se vrti na ovoj kutiji ili negde piše zašto ne. Ovo je druga runda, ona u kojoj sam popravio sve što me je prva naučila na teži način.",
    rsDetailContent: SELF_HOSTED_LAB_DETAIL_RS,
  },
  {
    year: "2026",
    image: "/images/covers/wpas-ai-assistant.jpg",
    sortOrder: 2,
    enTitle: "WPAS AI Assistant",
    enSubtitle: "Building an AI Assistant That Actually Ships",
    enCollection: "Projects",
    enContent:
      "The notes so far on WPAS, an AI assistant I'm building end to end: multi agent LLM pipelines, a FastAPI backend, and all the production plumbing nobody puts in the demo videos.",
    enDetailContent: DRAFT_EN,
    rsTitle: "WPAS AI asistent",
    rsSubtitle: "AI asistent koji stvarno ode u produkciju",
    rsCollection: "Projekti",
    rsContent:
      "Beleške o WPAS, AI asistentu koga pravim sam s kraja na kraj: multi agent LLM pipeline, FastAPI backend i sva ona produkcijska vodoinstalacija koju niko ne pokazuje u demo snimcima.",
    rsDetailContent: DRAFT_RS,
  },
  {
    year: "2026",
    image: "/images/covers/sudowear.jpg",
    sortOrder: 3,
    enTitle: "Building SudoWear",
    enSubtitle: "Running an Online Store as a One Man Ops Team",
    enCollection: "Indie Dev",
    enContent:
      "SudoWear started as a joke between terminal addicts and turned into a real store. What it takes to build, launch and operate ecommerce solo, from the storefront to the fulfillment headaches.",
    enDetailContent: DRAFT_EN,
    rsTitle: "Kako je nastao SudoWear",
    rsSubtitle: "Sam vodim shop, od koda do pakovanja",
    rsCollection: "Indi razvoj",
    rsContent:
      "SudoWear je krenuo kao fora među ljudima koji žive u terminalu, pa je postao pravi shop. Šta sve ide u to kad sam napraviš, pustiš i vodiš prodaju, od storefronta do muke oko slanja paketa.",
    rsDetailContent: DRAFT_RS,
  },
  {
    year: "2025",
    image: "/images/covers/five-years-support.jpg",
    sortOrder: 4,
    enTitle: "Five Years in Support",
    enSubtitle: "What AT&T and Mozzartbet Taught Me About Systems",
    enCollection: "Notes",
    enContent:
      "From IT support desks in Brno to sysadmin work at Mozzartbet, the unglamorous years that taught me how systems actually fail, and why every engineer should answer tickets for a while.",
    enDetailContent: DRAFT_EN,
    rsTitle: "Pet godina u podršci",
    rsSubtitle: "Šta su me AT&T i Mozzartbet naučili o sistemima",
    rsCollection: "Beleške",
    rsContent:
      "Od IT podrške u Brnu do sistemca u Mozzartbetu. Neglamurozne godine koje su me naučile kako sistemi stvarno padaju, i zašto bi svaki inženjer trebalo da neko vreme odgovara na tikete.",
    rsDetailContent: DRAFT_RS,
  },
  {
    year: "2025",
    image: "/images/covers/linux-everything.jpg",
    sortOrder: 5,
    enTitle: "Running Linux on Everything",
    enSubtitle: "One OS, Every Machine, Zero Regrets",
    enCollection: "Tooling",
    enContent:
      "Laptop, desktop, home lab, an old ThinkPad that refuses to die. Linux runs all of it. My setup, my dotfiles philosophy, and why the terminal is still the best interface ever made.",
    enDetailContent: DRAFT_EN,
    rsTitle: "Linux na svemu",
    rsSubtitle: "Jedan OS, sve mašine, nula kajanja",
    rsCollection: "Alati",
    rsContent:
      "Laptop, desktop, home lab, stari ThinkPad koji odbija da crkne. Na svemu Linux. Moj setup, kako gledam na dotfiles, i zašto je terminal i dalje najbolji interfejs koji je iko smislio.",
    rsDetailContent: DRAFT_RS,
  },
  {
    year: "2024",
    image: "/images/covers/poker-mental-game.jpg",
    sortOrder: 6,
    enTitle: "Poker and the Mental Game",
    enSubtitle: "Expected Value, Tilt, and Thinking in Bets",
    enCollection: "Notes",
    enContent:
      "Poker is the only hobby that ever made me a better engineer. Variance, bankroll management, and making good decisions with incomplete information, on the felt and in production.",
    enDetailContent: DRAFT_EN,
    rsTitle: "Poker i mentalna igra",
    rsSubtitle: "EV, tilt i razmišljanje u opkladama",
    rsCollection: "Beleške",
    rsContent:
      "Poker je jedini hobi koji me je napravio boljim inženjerom. Varijansa, bankroll i donošenje dobrih odluka kad nemaš sve informacije, za stolom i u produkciji.",
    rsDetailContent: DRAFT_RS,
  },
];

export const BIO_EN =
  "I'm Damir Kranjčević, a full stack engineer and founder of Beekio LLC, building and running software end to end as a one man operation. Before going independent I kept systems alive as a System Administrator at Mozzartbet and an IT Support Engineer at AT&T Brno. These days I split my time between client work, my own products, and a home lab that's never quite finished. This blog is where I write all of it down: what I'm building, what broke, and what I learned.";

export const BIO_RS =
  "Zovem se Damir. Full stack sam inženjer i vodim Beekio LLC. Softver pravim sam, s kraja na kraj, od baze do deploya. Pre toga sam držao sisteme u životu u Mozzartbetu, a pre toga odgovarao na tikete u AT&T u Brnu. Sad mi vreme ode na klijente, na moje proizvode i na home lab koji nikad nije skroz gotov. Ovde zapisujem sve to: šta pravim, šta se raspalo i šta sam iz toga naučio.";

export const seedCv = [
  // Experience
  { category: "Experience", enTitle: "Beekio LLC", enSubtitle: "Founder / Full Stack Engineer", rsTitle: "Beekio LLC", rsSubtitle: "Osnivač i full stack inženjer", year: "2024 to Present", sortOrder: 1 },
  { category: "Experience", enTitle: "Mozzartbet", enSubtitle: "System Administrator", rsTitle: "Mozzartbet", rsSubtitle: "Sistem administrator", year: "2022 to 2024", sortOrder: 2 },
  { category: "Experience", enTitle: "AT&T Brno", enSubtitle: "IT Support Engineer", rsTitle: "AT&T Brno", rsSubtitle: "Inženjer IT podrške", year: "2020 to 2022", sortOrder: 3 },
  // Current Focus
  { category: "Current Focus", enTitle: "Beekio", enSubtitle: "Building and running my own SaaS products", rsTitle: "Beekio", rsSubtitle: "Pravim i vodim svoje SaaS proizvode", year: "Ongoing", sortOrder: 4 },
  { category: "Current Focus", enTitle: "WPAS AI Assistant", enSubtitle: "Multi agent LLM pipelines in production", rsTitle: "WPAS AI asistent", rsSubtitle: "Multi agent LLM pipeline u produkciji", year: "2026", sortOrder: 5 },
  { category: "Current Focus", enTitle: "Self Hosted Lab v2", enSubtitle: "Proxmox and Docker home infrastructure", rsTitle: "Home lab v2", rsSubtitle: "Home lab na Proxmox i Docker", year: "2026", sortOrder: 6 },
  // Stack
  { category: "Stack", enTitle: "Languages", enSubtitle: "TypeScript / Python / Rust", rsTitle: "Jezici", rsSubtitle: "TypeScript / Python / Rust", year: "", sortOrder: 7 },
  { category: "Stack", enTitle: "Infrastructure", enSubtitle: "Docker / Proxmox / Linux", rsTitle: "Infrastruktura", rsSubtitle: "Docker / Proxmox / Linux", year: "", sortOrder: 8 },
  // Projects
  { category: "Projects", enTitle: "WPAS AI Assistant", enSubtitle: "AI assistant, built solo end to end", rsTitle: "WPAS AI asistent", rsSubtitle: "AI asistent, sam od početka do kraja", year: "2026", sortOrder: 9 },
  { category: "Projects", enTitle: "SudoWear", enSubtitle: "Online store, built and operated solo", rsTitle: "SudoWear", rsSubtitle: "Shop koji sam sam napravio i vodim", year: "Live since 2025", sortOrder: 10 },
  { category: "Projects", enTitle: "This Blog", enSubtitle: "Full stack / React + tRPC + Drizzle", rsTitle: "Ovaj blog", rsSubtitle: "Full stack / React + tRPC + Drizzle", year: "2026", sortOrder: 11 },
];

