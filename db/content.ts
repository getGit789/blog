// Bilingual seed content, shared by db/seed.ts and scripts/backfill-content.ts.
// Serbian (rs) and English (en). No em dashes or en dashes anywhere: prose uses
// commas and periods so it reads like a person wrote it.

export const SELF_HOSTED_LAB_DETAIL_EN = `It started, as these things always do, with a cloud bill. I was paying for a VPS here, a managed database there, a password manager subscription, a file sync plan, and one evening I added it all up and realized I was renting a worse version of something I could own for the price of a used mini PC.

So I bought one. A small, quiet, second hand box with a low power CPU and more RAM than it deserved, and I gave myself one rule: everything I depend on daily either runs on this machine or has a documented reason why it doesn't.

## Proxmox and what runs on it

Proxmox went on first. I'd lived in the VMware and bare metal worlds as a sysadmin, and Proxmox hits the sweet spot. Real virtualization when I want isolation, LXC when I want density, and a web UI that doesn't fight me at 1 a.m. On top of that, Docker inside a dedicated VM runs the actual workload: Vaultwarden for passwords, Nextcloud for files, Gitea for private repos, Uptime Kuma watching all of it, and a small reverse proxy terminating TLS in front of everything.

## What version two fixed

Version two, the rebuild this post is named after, was about fixing what v1 taught me the hard way. Backups went from "I'll get to it" to automated, offsite, and restore tested. The network got segmented: IoT junk on its own VLAN, services behind the proxy, nothing exposed that doesn't need to be. And I finally wrote the whole thing down, because the bus factor of a home lab is exactly one.

## Is it cheaper than the cloud

Is it cheaper than the cloud? Roughly, yes. The box paid for itself in under a year. But that's not the real answer. The real answer is that I understand my own infrastructure now in a way no managed service ever let me, and every 3 a.m. incident report has made me a better engineer than any course I ever took. My data, my machines, my rules.`;

export const SELF_HOSTED_LAB_DETAIL_RS = `Počelo je, kao i uvek, od računa za cloud. Plaćao sam VPS ovde, managed bazu tamo, pretplatu za password manager, plan za sync fajlova. Jedne večeri sam to sabrao i shvatio da iznajmljujem lošiju verziju nečega što mogu da imam za pare polovnog mini PC.

Pa sam ga i kupio. Mala, tiha, polovna kutija, procesor male potrošnje i više RAM nego što zaslužuje. Dao sam sebi jedno pravilo: sve što mi treba svaki dan ili se vrti na ovoj mašini ili negde piše zašto ne.

## Proxmox i šta se vrti na njemu

Prvo je išao Proxmox. Kao sistemac sam se navrteo VMware i fizičkih servera, a Proxmox pogađa taman meru. Prava virtuelizacija kad mi treba izolacija, LXC kad mi treba gustina, i web UI koji se ne svađa sa mnom u jedan ujutru. Iznad toga Docker u posebnoj VM nosi pravi posao: Vaultwarden za lozinke, Nextcloud za fajlove, Gitea za privatne repoe, Uptime Kuma koja sve to gleda, i mali reverse proxy koji ispred svega završava TLS.

## Šta je druga verzija popravila

Druga verzija, ona po kojoj se ovaj tekst i zove, bila je o tome da popravim sve što me je prva naučila na teži način. Bekapi su sa "stići ću do toga" prešli na automatske, izmeštene i testirane vraćanjem. Mreža je isečena na segmente: IoT đubre na svoj VLAN, servisi iza proksija, ništa izloženo što ne mora. I konačno sam sve zapisao, jer je bus faktor jednog home laba tačno jedan.

## Da li je jeftinije od clouda

Je l' jeftinije od clouda? Otprilike jeste, kutija se isplatila za manje od godinu dana. Ali to nije pravi odgovor. Pravi odgovor je da sad razumem svoju infrastrukturu onako kako mi nijedan managed servis to nije dao, i da me je svaki incident u tri ujutru napravio boljim inženjerom nego bilo koji kurs koji sam prošao. Moji podaci, moje mašine, moja pravila.`;

export const WPAS_AI_ASSISTANT_DETAIL_EN = `Every demo video makes this look easy. Type a prompt, get a perfect draft, cut to credits. Nobody shows the eighteen months of trust boundary decisions, the redaction logic, or the meeting where someone asks "what happens when it's wrong" and you actually have to have an answer.

## Intent first, then specialist agents

That's WPAS. An AI assistant meant to draft support responses for a team that talks to real customers about real accounts, all day, every day. The brief sounds simple: read the ticket, understand the intent, write something a human can send. The actual system is a pipeline with opinions. A request comes in and gets classified for intent first, then routed against a knowledge base using tag matching rather than a single model trying to know everything at once. From there it hits specialist sub agents. One handles pricing questions, one handles debugging, one handles de escalation, one handles closing a ticket out cleanly. Each one is narrow on purpose, because a model that's good at calming down an angry customer is not automatically good at explaining a billing cycle, and pretending otherwise is how you get confidently wrong answers.

## Everything around the model

The part that took the longest wasn't the language model work. It was everything around it. PII gets redacted twice, once early and once right before the draft is assembled, because catching it once is optimism and catching it twice is engineering. The outputs from every sub agent get merged in a fixed order so the final draft reads like one voice instead of four opinions stitched together. And nothing, ever, gets sent without a human reading it first. This isn't a chatbot replacing a person. It's a very fast first draft that a person is still responsible for.

## The trust boundary

The trust boundary was non negotiable from day one. Everything runs locally, talking only to an internal gateway, no data leaving through a third party API. When you're building something that touches customer accounts, "it works great" isn't the bar. "I can explain exactly where this data goes and prove it" is the bar, and that shaped more architecture decisions than the actual AI part did.

## Style rules as strict as code

There's a style layer sitting on top of all of it too, rules as strict as the code. No em dashes in drafts, never say "I understand," ask permission before touching an account with the exact same phrase every time. It sounds small until you realize consistency is the whole product. A support team doesn't want a clever assistant, they want a reliable one, and reliable means boring in all the right places.

Is it done? No. It's shipping in pieces, getting reviewed, getting argued with in meetings, getting better because of that friction and not despite it. That's the actual work. Not the demo. The plumbing.`;

export const WPAS_AI_ASSISTANT_DETAIL_RS = `Svaki demo video ovo prikaže kao lako. Ukucaš prompt, dobiješ savršen draft, prelaz na odjavnu špicu. Niko ne pokazuje osamnaest meseci odluka o granicama poverenja, logiku za redakciju, ili sastanak na kom neko pita "šta se dešava kad pogreši" i stvarno moraš da imaš odgovor.

## Prvo namera, pa specijalizovani agenti

To je WPAS. AI asistent koji treba da piše nacrte odgovora za podršku, za tim koji ceo dan, svaki dan, priča sa pravim korisnicima o pravim nalozima. Zadatak zvuči prosto: pročitaj tiket, razumi nameru, napiši nešto što čovek može da pošalje. Pravi sistem je pipeline sa stavovima. Zahtev stigne i prvo se klasifikuje po nameri, pa se rutira prema bazi znanja preko poklapanja tagova umesto da jedan model pokušava da zna sve odjednom. Odatle ide na specijalizovane sub agente. Jedan pokriva pitanja o ceni, jedan debagovanje, jedan deeskalaciju, jedan čisto zatvaranje tiketa. Svaki je namerno uzak, jer model koji dobro smiruje besnog korisnika nije automatski dobar u objašnjavanju ciklusa naplate, i pretvaranje da jeste je tačno kako dobiješ samouverene pogrešne odgovore.

## Sve oko modela

Deo koji je najduže trajao nije bio rad na jezičkom modelu. Bilo je to sve oko njega. PII se redaktuje dvaput, jednom rano i jednom tačno pre nego što se draft sastavi, jer hvatanje jednom je optimizam, a hvatanje dvaput je inženjering. Izlazi iz svakog sub agenta se spajaju fiksnim redosledom da bi finalni draft zvučao kao jedan glas umesto kao četiri mišljenja zašivena zajedno. I ništa, nikad, ne ode bez da ga prvo pročita čovek. Ovo nije chatbot koji zamenjuje osobu. Ovo je jako brz prvi nacrt za koji je osoba i dalje odgovorna.

## Granica poverenja

Granica poverenja je bila nedodirljiva od prvog dana. Sve radi lokalno, priča samo sa internim gatewayem, nijedan podatak ne izlazi kroz API treće strane. Kad gradiš nešto što dodiruje korisničke naloge, "odlično radi" nije mera. Mera je "mogu tačno da objasnim gde ti podaci idu i to da dokažem", i to je oblikovalo više arhitekturnih odluka nego sam AI deo.

## Pravila stila stroga kao kod

Iznad svega toga sedi i sloj stila, pravila strogo kao i kod. Bez crtica u draftovima, nikad "razumem", pitaj za dozvolu pre nego što diraš nalog istom frazom svaki put. Zvuči sitno dok ne shvatiš da je konzistentnost ceo proizvod. Tim podrške ne želi pametnog asistenta, žele pouzdanog, a pouzdano znači dosadno na svim pravim mestima.

Da li je gotovo? Ne. Šalje se u delovima, prolazi kroz review, raspravlja se o njemu na sastancima, postaje bolji zbog tog trvenja, a ne uprkos njemu. To je pravi posao. Ne demo. Vodoinstalacija.`;

export const SUDOWEAR_DETAIL_EN = `It started as a joke in a group chat. Someone said developers need shirts that admit what we actually do all day, and somewhere between that comment and the next commit, SudoWear stopped being a joke and became a real store with real inventory and real customers waiting on real shipping updates.

## Six designs at launch

The idea was simple from the start. Developer humor, printed on things people actually want to wear, sold without the bloat most print on demand stores drown in. Six designs went live first: Born to be Root, Distro Hopper, Dunno Let's Ask, IDK Ask GPT, I Make Developers Cry, and It's Not a Bug. Every one of them is a joke you only get if you've spent too many nights staring at a terminal, which is exactly the audience I wanted.

## The store is the easy part

What nobody tells you about running a store solo is that the store itself is the easy part. Product photos, listings, checkout, all of that is a weekend of focused work. The real job starts after launch. It's answering a support email at 11 p.m. because someone's order got stuck in customs. It's checking fulfillment status like it's a second inbox. It's realizing that marketing isn't a thing you do once and move on from, it's a permanent second job stacked on top of the first one, and admitting out loud that I came into this knowing almost nothing about it.

## The relaunch plan

SudoWear has been quiet for a few months, not dead, just paused while the rest of life demanded attention. That pause is ending. The plan now is to treat marketing the way I treat code, with actual process instead of vibes. Real product shots turned into lifestyle images, content built for the platforms where the audience already hangs out, and a relaunch that doesn't rely on hoping the algorithm notices.

Running a store alone means every mistake is visible and every win is yours too. No committee, no meetings about meetings, just decisions and the results of those decisions showing up in the order count the next morning. That's the appeal and the exhausting part at the same time.

If you want to see what a bunch of terminal jokes look like stitched onto actual clothing, the store is live at sudowear.shop. New drops are coming. Consider this the quiet part before the relaunch.`;

export const SUDOWEAR_DETAIL_RS = `Počelo je kao fora u grupnom čatu. Neko je rekao da developerima trebaju majice koje priznaju šta stvarno radimo ceo dan, i negde između tog komentara i sledećeg commita, SudoWear je prestao da bude fora i postao pravi shop sa pravim zalihama i pravim kupcima koji čekaju prave informacije o statusu pošiljke.

## Šest dizajna na startu

Ideja je od početka bila prosta. Developerski humor, odštampan na stvarima koje ljudi zaista žele da nose, prodavan bez balasta u kom se davi većina print on demand prodavnica. Šest dizajna je izašlo prvo: Born to be Root, Distro Hopper, Dunno Let's Ask, IDK Ask GPT, I Make Developers Cry i It's Not a Bug. Svaki od njih je fora koju skontaš samo ako si previše noći proveo zureći u terminal, što je tačno publika koju sam hteo.

## Prodavnica je lakši deo

Ono što ti niko ne kaže o vođenju prodavnice sam je da je sama prodavnica lakši deo. Fotografije proizvoda, oglasi, checkout, sve to je vikend fokusiranog rada. Pravi posao počinje posle lansiranja. To je odgovaranje na mejl podrške u 11 uveče jer je nečija porudžbina zaglavljena na carini. To je proveravanje statusa slanja kao da je to drugi inbox. To je shvatanje da marketing nije nešto što uradiš jednom pa nastaviš dalje, nego stalni drugi posao naslagan preko prvog, i priznanje naglas da sam u ovo ušao skoro ništa ne znajući o tome.

## Plan za ponovno lansiranje

SudoWear je bio tih par meseci, nije mrtav, samo pauziran dok je ostatak života tražio pažnju. Ta pauza se završava. Plan sada je da tretiram marketing onako kako tretiram kod, sa pravim procesom umesto osećaja. Prave fotografije proizvoda pretvorene u lifestyle slike, sadržaj napravljen za platforme gde publika već visi, i relaunch koji se ne oslanja na nadu da će ga algoritam primetiti.

Vođenje prodavnice sam znači da je svaka greška vidljiva, a svaka pobeda takođe tvoja. Nema komiteta, nema sastanaka o sastancima, samo odluke i rezultati tih odluka koji se pojave u broju porudžbina sledećeg jutra. To je i draž i iscrpljujući deo, istovremeno.

Ako želiš da vidiš kako gomila terminal fora izgleda odštampana na pravoj odeći, prodavnica radi na sudowear.shop. Nove kolekcije dolaze. Smatraj ovo tihim delom pre ponovnog lansiranja.`;

export const FIVE_YEARS_SUPPORT_DETAIL_EN = `Nobody puts "answered tickets for five years" on a highlight reel. It doesn't sound like a career, it sounds like a waiting room. But those years are where I actually learned how systems fail, and nothing since has taught me faster.

## The same complaint from forty different people

It started at AT&T, on a support desk in Brno, taking calls from people who didn't care how the system worked, only that it didn't. That's the part junior engineers skip past too fast. You don't understand a system by reading the architecture diagram. You understand it by hearing the same complaint from forty different people and realizing the diagram left something out. Every recurring ticket is a bug report on the design, whether anyone labeled it that way or not.

## Mozzartbet, where downtime cost real money

Mozzartbet came next, and the stakes changed shape. This wasn't "my file sync is slow," this was a live betting platform where a few minutes of downtime meant real money and real angry customers, in real time, during a match that wasn't going to pause for anyone. Sysadmin work there was less about theory and more about instinct built from repetition. Which logs to check first. Which service usually fails before the others. What a bad deploy looks like in the first ninety seconds versus what a normal traffic spike looks like. You don't get that instinct from a course. You get it from being the person who has to fix it while people are watching the scoreboard.

## The unglamorous part is the honest part

The unglamorous part is also the honest part. Support work strips away the fantasy that engineering is mostly clever solutions. Mostly it's someone's password reset, someone's misconfigured router, someone's account stuck in a state nobody documented. You either find that tedious and leave, or you start noticing the pattern underneath the tedium, and that pattern is the actual job. Every system I've built since, from pipelines to backend services, carries fingerprints from those two jobs. I default to asking what breaks first, not what looks impressive in a demo.

Five years answering tickets didn't feel like career progress at the time. It felt like standing still while other people wrote code. Looking back, it was the best training I never planned for, and I'd tell anyone starting out in engineering to spend real time on a support desk before they touch anything with a deploy button. You'll ship worse demos and build better systems.`;

export const FIVE_YEARS_SUPPORT_DETAIL_RS = `Niko na CV ne stavi "pet godina odgovarao na tikete". Ne zvuči kao karijera, zvuči kao čekaonica. Ali baš te godine su me naučile kako sistemi stvarno padaju, i ništa posle toga me nije naučilo brže.

## Ista žalba od četrdeset različitih ljudi

Počelo je u AT&T, na podršci u Brnu, gde sam primao pozive ljudi kojima nije bilo bitno kako sistem radi, samo da ne radi. To je deo koji mlađi inženjeri prebrzo preskoče. Sistem ne razumeš čitajući arhitekturni dijagram. Razumeš ga kad čuješ istu žalbu od četrdeset različitih ljudi i shvatiš šta je dijagram propustio. Svaki tiket koji se ponavlja je zapravo bug report na dizajn, bez obzira da li ga je iko tako nazvao.

## Mozzartbet, gde pad znači pravi novac

Posle je došao Mozzartbet, i ulozi su se promenili. Ovo više nije bilo "sporo mi se sinhronizuju fajlovi", ovo je bila platforma za kladenje uživo gde je nekoliko minuta pada značilo pravi novac i pravi bes korisnika, u realnom vremenu, usred meča koji nikog neće sačekati. Sistemski posao tamo je manje bio o teoriji, a više o instinktu izgrađenom kroz ponavljanje. Koje logove prvo proveriš. Koji servis obično pukne pre ostalih. Kako izgleda loš deploy u prvih devedeset sekundi, a kako izgleda običan skok u saobraćaju. Taj instinkt ne dobiješ na kursu. Dobiješ ga kad si osoba koja to mora da popravi dok ljudi gledaju rezultat na semaforu.

## Neglamurozni deo je onaj pošteni

Neglamurozni deo je istovremeno i onaj pošteni deo. Podrška ti oduzme iluziju da je inženjering uglavnom pametna rešenja. Uglavnom je to nečiji reset lozinke, nečiji loše podešen ruter, nečiji nalog zaglavljen u stanju koje niko nije zapisao. Ili ti to dosadi pa odeš, ili počneš da primećuješ obrazac ispod te dosade, a taj obrazac je zapravo posao. Svaki sistem koji sam posle napravio, od pipelinea do backend servisa, nosi otiske tih dva posla. Prvo pitanje mi je uvek šta prvo pukne, a ne šta izgleda efektno na demu.

Pet godina odgovaranja na tikete tada mi nije ličilo na napredak u karijeri. Ličilo je na stajanje u mestu dok drugi pišu kod. Gledano unazad, to je bio najbolji trening koji nisam planirao, i rekao bih svakom ko kreće u inženjering da provede pravo vreme na podršci pre nego što dirne bilo šta sa dugmetom za deploy. Ispisaćeš gore demoe, ali ćeš graditi bolje sisteme.`;

export const LINUX_EVERYTHING_DETAIL_EN = `People ask why I bother. Windows works, macOS works, everything works if you squint hard enough and don't ask too many questions. But "works" was never the bar I was aiming for. I wanted a machine that does exactly what I tell it, every time, without negotiating.

## Fedora and KDE on a ThinkPad T14

The current daily driver is a ThinkPad T14 Gen2, running Fedora with KDE Plasma. Dual boot, technically, because Windows 11 Pro still sits on a partition for the handful of things Linux won't touch cleanly, a couple of poker clients and streaming apps that just refuse to cooperate otherwise. Everything else, every real hour of work, happens on the Fedora side. Development, focus time, the home lab, all of it.

## The terminal setup and a fight with Wayland

The setup isn't stock and it was never meant to be. Bash with a custom prompt, because the default one tells you nothing useful at a glance. bat instead of cat, eza instead of ls, small swaps that sound cosmetic until you realize you're staring at a terminal for six hours a day and every bit of friction removed there is friction removed from your actual thinking. Albert replaced the launcher, installed the long way around through an OpenSUSE build service repo because Fedora 43 didn't have a COPR build ready. The Super plus Space shortcut that should have been trivial turned into a fight with Wayland's global hotkey limitations, solved eventually through a KDE custom shortcut instead of the obvious binding. Small war, still counts as a win.

## A terminal hides nothing

None of this is about being difficult for the sake of it. It's about the fact that a terminal doesn't hide anything from you. No mystery settings menu, no background process you can't name, no update that changes behavior without telling you why. If something breaks, and things do break, the terminal tells you exactly where and exactly why, and you fix it instead of restarting and hoping. That's not romantic, it's just faster, and after enough years of debugging other people's systems for a living, faster and honest beats pretty every time.

## The old ThinkPad in the corner

The old ThinkPad still running in the corner of the home lab is proof of the whole philosophy. It's underpowered by any modern standard and it keeps working because Linux doesn't demand new hardware to stay useful, it just asks that you understand what you're running. That's the whole setup, really. One OS, every machine, and the only real rule is that I have to understand it, not just click through it.`;

export const LINUX_EVERYTHING_DETAIL_RS = `Ljudi me pitaju čemu to služi. Windows radi, macOS radi, sve radi ako zažmuriš na pola oka i ne postavljaš previše pitanja. Ali "radi" mi nikad nije bila mera. Hteo sam mašinu koja radi tačno ono što joj kažem, svaki put, bez pregovaranja.

## Fedora i KDE na ThinkPadu T14

Trenutni dnevni laptop je ThinkPad T14 Gen2, na Fedori sa KDE Plasma. Dual boot, tehnički, jer Windows 11 Pro i dalje sedi na jednoj particiji zbog šačice stvari koje Linux ne dira čisto, par poker klijenata i streaming aplikacija koje prosto neće da sarađuju drugačije. Sve ostalo, svaki pravi radni sat, ide preko Fedore. Development, fokus vreme, home lab, sve.

## Terminal setup i borba sa Waylandom

Setup nije fabrički i nikad nije trebalo da bude. Bash sa custom promptom, jer default ne kaže ništa korisno na prvi pogled. bat umesto cat, eza umesto ls, sitne zamene koje zvuče kozmetički dok ne shvatiš da gledaš u terminal šest sati dnevno i da je svaki komad trvenja koji skloniš odatle komad trvenja manje u samom razmišljanju. Albert je zamenio launcher, instaliran na teži način preko OpenSUSE build service repoa jer Fedora 43 nije imala spreman COPR build. Prečica Super plus Space koja je trebalo da bude trivijalna pretvorila se u borbu sa ograničenjima Waylanda oko globalnih prečica, rešena na kraju preko KDE custom shortcuta umesto očiglednog bindinga. Mali rat, ali se i dalje računa kao pobeda.

## Terminal ništa ne krije

Ništa od ovoga nije prkos radi prkosa. Radi se o tome da terminal ništa ne krije od tebe. Nema tajanstvenog menija sa podešavanjima, nema pozadinskog procesa koji ne možeš da imenuješ, nema ažuriranja koje promeni ponašanje a da ti ne kaže zašto. Ako nešto pukne, a pukne, terminal ti kaže tačno gde i tačno zašto, i ti to popraviš umesto da restartuješ i nadaš se najboljem. Nije to romantično, samo je brže, i posle dovoljno godina debagovanja tuđih sistema za život, brže i pošteno pobeđuje lepo svaki put.

## Stari ThinkPad u ćošku

Stari ThinkPad koji i dalje radi u ćošku home laba je dokaz cele filozofije. Slab je po svakom modernom standardu i i dalje radi jer Linux ne traži nov hardver da bi ostao koristan, samo traži da razumeš šta pokrećeš. To je ceo setup, u stvari. Jedan OS, sve mašine, i jedino pravo pravilo je da ja to moram da razumem, a ne samo da klikćem kroz to.`;

export const POKER_MENTAL_GAME_DETAIL_EN = `I've been playing tournaments since 2008. Long enough to have watched the game change twice over, long enough to have lost more buy ins than I want to count, and long enough to know that the actual skill poker teaches has nothing to do with cards.

## The correct decision can still lose

The first thing poker beats out of you is the need to be right immediately. You can make the correct decision, the mathematically sound one, and still lose the hand. That used to feel unfair. Now it just feels like information. A good player isn't the one who wins the most pots, it's the one who makes the same correct call whether it worked last time or not, because the decision was never about that one hand. It was about the thousand hands like it. Engineering rewired the same way once I let it. You don't judge a deploy process by whether last Tuesday's release went smoothly. You judge it by whether the process holds up across a hundred releases, and one clean run doesn't prove anything either way.

## Tilt at the table and in production

Tilt is the part nobody warns you about until it's already cost them money. It's not just anger, it's the quiet decision to deviate from a plan you know is correct because the last ten minutes felt unfair. I've seen it wreck sessions and I've seen the exact same pattern wreck production incidents. Someone gets one alert that turns out to be a false positive, gets annoyed, starts skipping the checklist, and the second alert that actually matters gets the sloppy response instead of the practiced one. Tilt doesn't care if you're at a felt table or a terminal. It's the same failure, wearing a different shirt.

## Bankroll management is risk management

Bankroll management taught me more about risk than any postmortem ever has. The rule in poker is brutally simple: never put yourself in a position where one bad outcome ends your ability to keep playing. Move that rule into engineering and it stops sounding like poker advice and starts sounding like basic system design. Don't build the thing where one failure takes down everything downstream with it. Keep enough reserve, enough redundancy, enough margin, that a bad night doesn't become a bad month. Every over leveraged player I've watched go broke made the same mistake every fragile system makes. They sized for the average case and got hit by the one that wasn't.

## Deciding without full information

What poker really trains, more than math or patience, is deciding well with information you'll never fully have. You don't get to see the other player's cards. You don't get to see the exact load a service will take in production six months from now. You size your bet, or your architecture, based on probabilities and get comfortable being wrong sometimes in service of being right on average. These days poker is a couple of sessions a week around a day job that doesn't leave much more room than that, but the sessions I do play still feel less like a hobby and more like maintenance on a way of thinking I use every single day at work.`;

export const POKER_MENTAL_GAME_DETAIL_RS = `Igram turnire od 2008. Dovoljno dugo da sam gledao kako se igra menja u krug i po drugi put, dovoljno dugo da sam izgubio više novca na ulaske u turnire nego što želim da brojim, i dovoljno dugo da znam da prava veština koju poker uči nema nikakve veze sa kartama.

## Ispravna odluka i dalje ume da izgubi

Prva stvar koju ti poker izbije iz glave je potreba da odmah budeš u pravu. Možeš doneti ispravnu odluku, matematički zdravu, i i dalje izgubiš ruku. To mi je nekad delovalo nepravedno. Sad mi samo deluje kao informacija. Dobar igrač nije onaj koji osvoji najviše pota, nego onaj koji donese istu ispravnu odluku bez obzira da li je prošli put upalila ili ne, jer odluka nikad nije bila o toj jednoj ruci. Bila je o hiljadu ruku sličnih njoj. Inženjering mi se preklopio na isti način čim sam to pustio. Ne sudiš proces deploya po tome da li je prošli utorak release prošao glatko. Sudiš ga po tome da li proces izdrži kroz sto releasea, a ni jedan čist prolaz ništa ne dokazuje ni u jednu ni u drugu stranu.

## Tilt za stolom i u produkciji

Tilt je deo o kome ti niko ne kaže dok te već ne košta novca. Nije to samo bes, to je tiha odluka da skreneš sa plana za koji znaš da je ispravan zato što su ti poslednjih deset minuta delovala nepravedno. Video sam kako to uništi sesije i video sam isti taj obrazac kako uništi produkcijske incidente. Neko dobije jedan alarm koji se ispostavi kao lažna uzbuna, naljuti se, počne da preskače checklist, i drugi alarm koji stvarno nešto znači dobije nemaran odgovor umesto uvežbanog. Tilt ne mari da li si za stolom sa kartama ili za terminalom. Isti kvar, samo druga košulja.

## Upravljanje bankrollom je upravljanje rizikom

Upravljanje bankrollom me je naučilo više o riziku nego ijedan postmortem. Pravilo u pokeru je brutalno prosto: nikad se ne dovodi u poziciju u kojoj jedan loš ishod okonča tvoju mogućnost da nastaviš da igraš. Prebaci to pravilo u inženjering i prestane da zvuči kao savet za poker, a počne da zvuči kao osnovni sistemski dizajn. Ne gradi ono gde jedan pad povuče sve nizvodno sa sobom. Drži dovoljno rezerve, dovoljno redundanse, dovoljno margine, da loša noć ne postane loš mesec. Svaki prezaduženi igrač kog sam gledao kako ode u bankrot napravio je istu grešku koju pravi svaki krhak sistem. Dimenzionisali su za prosečan slučaj, a pogodio ih je onaj koji to nije bio.

## Odlučivanje bez potpunih informacija

Ono što poker stvarno trenira, više od matematike ili strpljenja, je da dobro odlučuješ sa informacijama koje nikad nećeš imati u potpunosti. Ne vidiš tuđe karte. Ne vidiš tačno koliko će opterećenje servis primiti u produkciji za šest meseci. Dimenzionišeš ulog, ili arhitekturu, na osnovu verovatnoća i naviknuo si se da ponekad grešiš da bi u proseku bio u pravu. Ovih dana poker mi je par sesija nedeljno pored posla koji ne ostavlja mnogo više prostora od toga, ali sesije koje odigram i dalje mi ne deluju kao hobi, nego kao održavanje jednog načina razmišljanja koji koristim svaki dan na poslu.`;

export const BEEKIO_DETAIL_EN = `Fifty to sixty two percent. That's how many colonies American beekeepers lost in the 2024 to 2025 season, depending on whether they run it as a hobby or a business. The worst numbers anyone has on record, and most of it traces back to something that was visible weeks earlier in a mite count nobody plotted.

That's the whole reason Beekio exists.

## A deliberately small loop

The loop is deliberately small. You add your hives, you log an inspection, and you get back a prioritized list of what to do in the next 24 to 48 hours for each one. Varroa count, brood pattern, weight, a few notes. The logging has to be fast enough to do one handed while wearing gloves, standing over an open hive, and that turned out to be the constraint that shaped most of the interface. On the Pro and Scaling plans the plan generates itself at 5 a.m. local time, so it's already waiting when you head out. There's a chat too, Ask Beekio, that knows your own hive history instead of answering from general knowledge. Every inspection gets stamped with the weather where the hive actually sits.

Most beekeeping apps are logbooks. They help you write down what happened. Beekio is trying to tell you what to do next, and that difference is the entire bet.

## An expensive bet

It's an expensive bet. Pro is 36 dollars a month in a market where HiveTracks charges 6.99 and HiveBook gives you unlimited hives for nothing. I've read enough forum threads to know exactly how that lands. The honest answer isn't that the competition is bad, it's that one hive you don't lose pays for a year of Pro several times over, and I have to prove that rather than assert it. Nobody in beekeeping owes me the benefit of the doubt.

## A normal indie SaaS stack

Under the hood it's a normal indie SaaS stack, and I mean that as a compliment. A FastAPI backend on Railway, Neon for Postgres, Clerk for auth, Stripe for billing, Resend for transactional mail, and Anthropic's models doing the actual reasoning. Nothing exotic. Every hour I don't spend building my own auth is an hour I spend on the part nobody else can build for me.

## What broke before launch

The breakages are the part worth writing down.

The Clerk webhook spent longer than I want to admit pointing at the wrong URL. That meant people signed up fine and then didn't exist in my database, a failure that looks like nothing at all until you go looking for a row that should be there.

Invitation emails went to spam for days. Not a code bug in the slightest. DNS records, sender reputation, the whole boring unglamorous layer, fixed eventually by moving mail for beekio.com over to Proton and grinding through every record until it verified.

Then there was a script called send_test_nurture.py, written to test the waitlist sequence. It wasn't in git, it was sitting on a detached HEAD on exactly one machine, and on first run it fired a real production email through Resend with no confirmation prompt. It worked precisely as designed, which was the problem. That one goes in the same drawer as everything else I've built that was one keystroke away from being embarrassing.

## A waitlist, not a checkout

Right now Beekio is pre launch. The site is a waitlist, not a checkout. Every plan tier ends in Join the Waitlist rather than Buy, and I'd rather say that plainly here than have you click through expecting something you can pay for today. The custom sign in pages are still on the dev branch because main is protected and I haven't merged them. A beta trial tier is waiting on a SQL migration I want to read twice before I run it.

The contact page says Beekio is a small team, and that every message is read by someone who works on the product, usually the same person who built it. That's a nice sentence. It's also just true, and it's why the roadmap is sequenced instead of parallel. One person can only break one thing at a time.

If you keep bees, or you know someone who does, it's at beekio.com. The waitlist is open.`;

export const BEEKIO_DETAIL_RS = `Pedeset do šezdeset dva odsto. Toliko je društava uginulo američkim pčelarima u sezoni 2024 na 2025, zavisno od toga da li im je to hobi ili posao. Najgori brojevi koje iko ima zabeležene, a najveći deo toga se vodi na nešto što se videlo nedeljama ranije, u broju varoe koji niko nije ucrtao u grafik.

Zbog toga Beekio i postoji.

## Namerno mala petlja

Petlja je namerno mala. Uneseš svoje košnice, upišeš pregled, i nazad dobiješ spisak po prioritetu šta da uradiš u naredna 24 do 48 sati, za svaku posebno. Broj varoe, leglo, težina, par beleški. Upisivanje mora da bude dovoljno brzo da se odradi jednom rukom, u rukavicama, dok stojiš nad otvorenom košnicom, i ispalo je da je baš to ograničenje oblikovalo najveći deo interfejsa. Na Pro i Scaling planovima se plan sam generiše u pet ujutru po lokalnom vremenu, pa te već čeka kad kreneš napolje. Tu je i chat, Ask Beekio, koji zna istoriju tvojih košnica umesto da odgovara iz opšteg znanja. Svaki pregled dobije i vreme sa mesta gde košnica stvarno stoji.

Većina aplikacija za pčelare su dnevnici. Pomognu ti da zapišeš šta se desilo. Beekio pokušava da ti kaže šta sledeće da uradiš, i cela opklada je u toj razlici.

## Skupa opklada

Skupa je to opklada. Pro je 36 dolara mesečno, na tržištu gde HiveTracks naplaćuje 6.99, a HiveBook ti da neograničeno košnica badava. Pročitao sam dovoljno tema po forumima da znam tačno kako to zvuči. Pošten odgovor nije da je konkurencija loša, nego da jedno društvo koje ne izgubiš plati godinu dana Pro plana nekoliko puta, i to ja moram da dokažem, a ne da tvrdim. Niko u pčelarstvu mi ne duguje da mi veruje na reč.

## Običan indi SaaS stack

Ispod haube je običan indi SaaS stack, i to mislim kao kompliment. FastAPI backend na Railwayu, Neon za Postgres, Clerk za auth, Stripe za naplatu, Resend za transakcione mejlove, i Anthropic modeli koji rade samo razmišljanje. Ništa egzotično. Svaki sat koji ne potrošim praveći svoj auth je sat koji potrošim na ono što niko drugi ne može da napravi umesto mene.

## Šta je puklo pre lansiranja

Kvarovi su deo koji vredi zapisati.

Clerk webhook je duže nego što želim da priznam pokazivao na pogrešan URL. To znači da su se ljudi lepo registrovali, pa onda nisu postojali u mojoj bazi. Kvar koji izgleda kao ništa dok ne odeš da tražiš red koji bi morao da bude tu.

Pozivnice su danima odlazile u spam. Nije uopšte bio bag u kodu. DNS zapisi, reputacija pošiljaoca, ceo onaj dosadni neglamurozni sloj. Rešeno tako što sam mejl za beekio.com prebacio na Proton i ispeglao svaki zapis dok se nije verifikovao.

Onda je tu bila skripta send_test_nurture.py, napisana da testira sekvencu za listu čekanja. Nije bila u gitu, sedela je na detached HEAD na tačno jednoj mašini, i na prvo pokretanje je poslala pravi produkcijski mejl kroz Resend, bez ijednog pitanja da li si siguran. Radila je tačno kako je napravljena, i to je bio problem. To ide u istu fioku sa svim ostalim što sam napravio a što je bilo jedan taster daleko od blama.

## Lista čekanja, ne prodavnica

Beekio je trenutno pred lansiranje. Sajt je lista čekanja, nije prodavnica. Svaki plan se završava sa Join the Waitlist, a ne sa Buy, i radije ću to ovde reći otvoreno nego da klikneš očekujući nešto što možeš danas da platiš. Custom stranice za prijavu i dalje stoje na dev grani jer je main zaključan i nisam ih spojio. Beta trial nivo čeka na SQL migraciju koju hoću da pročitam dvaput pre nego što je pustim.

Na kontakt stranici piše da je Beekio mali tim i da svaku poruku pročita neko ko radi na proizvodu, obično isti onaj koji ga je i napravio. Lepa rečenica. Uz to je i tačna, i zbog nje je plan poređan jedno za drugim umesto sve odjednom. Jedan čovek može da pokvari samo jednu stvar u isto vreme.

Ako držiš pčele, ili znaš nekog ko drži, tu je na beekio.com. Lista čekanja je otvorena.`;

export const seedPosts = [
  {
    year: "2026",
    image: "/images/covers/beekio.jpg",
    detailImage: "/images/covers/beekio-detail.jpg",
    sortOrder: 1,
    enTitle: "Beekio, One Person",
    enSubtitle: "Running a beekeeping SaaS end to end, alone",
    enCollection: "Projects",
    enContent:
      "An AI beekeeping consultant I'm building solo. Log an inspection, get a prioritized action plan for the next 48 hours. What it does, the stack under it, and everything that broke on the way to a waitlist.",
    enDetailContent: BEEKIO_DETAIL_EN,
    rsTitle: "Beekio, jedan čovek",
    rsSubtitle: "Sam vodim SaaS za pčelare, s kraja na kraj",
    rsCollection: "Projekti",
    rsContent:
      "AI konsultant za pčelare koga pravim sam. Upišeš pregled košnice, dobiješ spisak šta da uradiš u naredna 48 sati. Šta radi, na čemu stoji i šta se sve raspalo do liste čekanja.",
    rsDetailContent: BEEKIO_DETAIL_RS,
  },
  {
    year: "2026",
    image: "/images/covers/self-hosted-lab.jpg",
    detailImage: "/images/covers/self-hosted-lab-detail.jpg",
    sortOrder: 2,
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
    detailImage: "/images/covers/wpas-ai-assistant-detail.jpg",
    sortOrder: 3,
    enTitle: "WPAS AI Assistant",
    enSubtitle: "Building an AI Assistant That Actually Ships",
    enCollection: "Projects",
    enContent:
      "The notes so far on WPAS, an AI assistant I'm building end to end: multi agent LLM pipelines, a FastAPI backend, and all the production plumbing nobody puts in the demo videos.",
    enDetailContent: WPAS_AI_ASSISTANT_DETAIL_EN,
    rsTitle: "WPAS AI asistent",
    rsSubtitle: "AI asistent koji stvarno ode u produkciju",
    rsCollection: "Projekti",
    rsContent:
      "Beleške o WPAS, AI asistentu koga pravim sam s kraja na kraj: multi agent LLM pipeline, FastAPI backend i sva ona produkcijska vodoinstalacija koju niko ne pokazuje u demo snimcima.",
    rsDetailContent: WPAS_AI_ASSISTANT_DETAIL_RS,
  },
  {
    year: "2026",
    image: "/images/covers/sudowear.jpg",
    detailImage: "/images/covers/sudowear-detail.jpg",
    sortOrder: 4,
    enTitle: "Building SudoWear",
    enSubtitle: "Running an Online Store as a One Man Ops Team",
    enCollection: "Indie Dev",
    enContent:
      "SudoWear started as a joke between terminal addicts and turned into a real store. What it takes to build, launch and operate ecommerce solo, from the storefront to the fulfillment headaches.",
    enDetailContent: SUDOWEAR_DETAIL_EN,
    rsTitle: "Kako je nastao SudoWear",
    rsSubtitle: "Sam vodim shop, od koda do pakovanja",
    rsCollection: "Indi razvoj",
    rsContent:
      "SudoWear je krenuo kao fora među ljudima koji žive u terminalu, pa je postao pravi shop. Šta sve ide u to kad sam napraviš, pustiš i vodiš prodaju, od storefronta do muke oko slanja paketa.",
    rsDetailContent: SUDOWEAR_DETAIL_RS,
  },
  {
    year: "2025",
    image: "/images/covers/five-years-support.jpg",
    detailImage: "/images/covers/five-years-support-detail.jpg",
    sortOrder: 5,
    enTitle: "Five Years in Support",
    enSubtitle: "What AT&T and Mozzartbet Taught Me About Systems",
    enCollection: "Notes",
    enContent:
      "From IT support desks in Brno to sysadmin work at Mozzartbet, the unglamorous years that taught me how systems actually fail, and why every engineer should answer tickets for a while.",
    enDetailContent: FIVE_YEARS_SUPPORT_DETAIL_EN,
    rsTitle: "Pet godina u podršci",
    rsSubtitle: "Šta su me AT&T i Mozzartbet naučili o sistemima",
    rsCollection: "Beleške",
    rsContent:
      "Od IT podrške u Brnu do sistemca u Mozzartbetu. Neglamurozne godine koje su me naučile kako sistemi stvarno padaju, i zašto bi svaki inženjer trebalo da neko vreme odgovara na tikete.",
    rsDetailContent: FIVE_YEARS_SUPPORT_DETAIL_RS,
  },
  {
    year: "2025",
    image: "/images/covers/linux-everything.jpg",
    detailImage: "/images/covers/linux-everything-detail.jpg",
    sortOrder: 6,
    enTitle: "Running Linux on Everything",
    enSubtitle: "One OS, Every Machine, Zero Regrets",
    enCollection: "Tooling",
    enContent:
      "Laptop, desktop, home lab, an old ThinkPad that refuses to die. Linux runs all of it. My setup, my dotfiles philosophy, and why the terminal is still the best interface ever made.",
    enDetailContent: LINUX_EVERYTHING_DETAIL_EN,
    rsTitle: "Linux na svemu",
    rsSubtitle: "Jedan OS, sve mašine, nula kajanja",
    rsCollection: "Alati",
    rsContent:
      "Laptop, desktop, home lab, stari ThinkPad koji odbija da crkne. Na svemu Linux. Moj setup, kako gledam na dotfiles, i zašto je terminal i dalje najbolji interfejs koji je iko smislio.",
    rsDetailContent: LINUX_EVERYTHING_DETAIL_RS,
  },
  {
    year: "2024",
    image: "/images/covers/poker-mental-game.jpg",
    detailImage: "/images/covers/poker-mental-game-detail.jpg",
    sortOrder: 7,
    enTitle: "Poker and the Mental Game",
    enSubtitle: "Expected Value, Tilt, and Thinking in Bets",
    enCollection: "Notes",
    enContent:
      "Poker is the only hobby that ever made me a better engineer. Variance, bankroll management, and making good decisions with incomplete information, on the felt and in production.",
    enDetailContent: POKER_MENTAL_GAME_DETAIL_EN,
    rsTitle: "Poker i mentalna igra",
    rsSubtitle: "EV, tilt i razmišljanje u opkladama",
    rsCollection: "Beleške",
    rsContent:
      "Poker je jedini hobi koji me je napravio boljim inženjerom. Varijansa, bankroll i donošenje dobrih odluka kad nemaš sve informacije, za stolom i u produkciji.",
    rsDetailContent: POKER_MENTAL_GAME_DETAIL_RS,
  },
];

export const BIO_EN =
  "I'm Damir Kranjčević, a full stack engineer and founder of Beekio LLC, building and running software end to end as a one man operation. Before going independent I kept systems alive as a System Administrator at Mozzartbet and an IT Support Engineer at AT&T Brno. These days I split my time between client work, my own products, and a home lab that's never quite finished. This blog is where I write all of it down: what I'm building, what broke, and what I learned.";

export const BIO_RS =
  "Zovem se Damir. Full stack sam inženjer i vodim Beekio LLC. Softver pravim sam, s kraja na kraj, od baze do deploya. Pre toga sam držao sisteme u životu u Mozzartbetu, a pre toga odgovarao na tikete u AT&T u Brnu. Sad mi vreme ode na klijente, na moje proizvode i na home lab koji nikad nije skroz gotov. Ovde zapisujem sve to: šta pravim, šta se raspalo i šta sam iz toga naučio.";

export const seedCv = [
  // Experience
  { category: "Experience", enTitle: "Beekio LLC", enSubtitle: "Founder / Full Stack Engineer", rsTitle: "Beekio LLC", rsSubtitle: "Osnivač i full stack inženjer", year: "2026 to Present", sortOrder: 1 },
  { category: "Experience", enTitle: "Mozzartbet", enSubtitle: "System Administrator", rsTitle: "Mozzartbet", rsSubtitle: "Sistem administrator", year: "2022 to 2024", sortOrder: 2 },
  { category: "Experience", enTitle: "AT&T Brno", enSubtitle: "IT Support Engineer", rsTitle: "AT&T Brno", rsSubtitle: "Inženjer IT podrške", year: "2020 to 2022", sortOrder: 3 },
  // Current Focus
  { category: "Current Focus", enTitle: "Beekio", enSubtitle: "AI beekeeping consultant, pre launch", rsTitle: "Beekio", rsSubtitle: "AI konsultant za pčelare, pred lansiranje", year: "2026", sortOrder: 4 },
  { category: "Current Focus", enTitle: "WPAS AI Assistant", enSubtitle: "Multi agent LLM pipelines in production", rsTitle: "WPAS AI asistent", rsSubtitle: "Multi agent LLM pipeline u produkciji", year: "2026", sortOrder: 5 },
  { category: "Current Focus", enTitle: "Self Hosted Lab v2", enSubtitle: "Proxmox and Docker home infrastructure", rsTitle: "Home lab v2", rsSubtitle: "Home lab na Proxmox i Docker", year: "2026", sortOrder: 6 },
  // Stack
  { category: "Stack", enTitle: "Languages", enSubtitle: "TypeScript / Python / Rust", rsTitle: "Jezici", rsSubtitle: "TypeScript / Python / Rust", year: "", sortOrder: 7 },
  { category: "Stack", enTitle: "Infrastructure", enSubtitle: "Docker / Proxmox / Linux", rsTitle: "Infrastruktura", rsSubtitle: "Docker / Proxmox / Linux", year: "", sortOrder: 8 },
  // Projects
  { category: "Projects", enTitle: "Beekio", enSubtitle: "AI beekeeping SaaS, waitlist open", rsTitle: "Beekio", rsSubtitle: "AI SaaS za pčelare, lista čekanja otvorena", year: "2026", sortOrder: 9 },
  { category: "Projects", enTitle: "WPAS AI Assistant", enSubtitle: "AI assistant, built solo end to end", rsTitle: "WPAS AI asistent", rsSubtitle: "AI asistent, sam od početka do kraja", year: "2026", sortOrder: 10 },
  { category: "Projects", enTitle: "SudoWear", enSubtitle: "Online store, built and operated solo", rsTitle: "SudoWear", rsSubtitle: "Shop koji sam sam napravio i vodim", year: "Live since 2025", sortOrder: 11 },
  { category: "Projects", enTitle: "This Blog", enSubtitle: "Full stack / React + tRPC + Drizzle", rsTitle: "Ovaj blog", rsSubtitle: "Full stack / React + tRPC + Drizzle", year: "2026", sortOrder: 12 },
];

