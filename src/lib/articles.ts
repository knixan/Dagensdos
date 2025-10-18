// Ta bort import om ej använd

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  date?: string;
}

export const articles: Article[] = [
  {
    id: '1',
    slug: 'global-byrakroti-lost-problems',
    title: 'Global byråkrati har löst alla problem, alla utom ditt',
    excerpt:
      'Här är en sammanfattning av den senaste nyheten. Den ska vara lockande, men också ge en hint om det sarkastiska innehållet.',
  content: `Det verkar som att mänsklighetens sista, stora innovation inte var rymdresor, artificiell intelligens eller den efterlängtade kaffesorten som aldrig blir kall — nej, det var byråkratin. Globala kommittéer, arbetsgrupper och oändliga excel-ark har nu, med samma beslutsamhet som en semikolon‑fixerad jurist, lyckats lösa världens problem. Alla problem. Förutom dina, naturligtvis.

Låt oss vandra genom triumfparaden: klimatförändringarna? Åtgärdade — lagom mycket kommittéarbete, ett par vackra policydokument och några fina illustrationer med isbjörnar som high‑five:ar. Hunger? Check — vi har formulerat en roadmap i tre steg, där steg två är att samla intressenter och steg tre troligen kommer att äga rum inom nästa mandatperiod (vilket i byråkratins tidsskala betyder ungefär om fem till tio år). Konflikter mellan länder? Fredsavtal i draft — med bilagor, två bilagor till bilagorna och en powerpoint som förklarar varför bilaga A och bilaga B måste läsas i rätt ordning.

Och ändå, i detta glitter av administrativa prestationer, finns ditt personliga problem kvar. Är det kanske för att du älskar det? För att en värld utan små, vardagliga katastrofer vore... tråkig? Kanske. Eller så är det för att byråkratin, trots all sin majestätiska effektivitet, har en väldigt specifik rytm: den löser system‑ och strukturproblem bäst. Individens kaos — det där lilla, pinsamma, väldigt mänskliga problemet du vaknar med på en tisdag — det är inte en prioritet i den globala handlingsplanen.

Tänk på det: byråkratin utarbetar policyer för att säkra framtida generationers välmående. De skriver fina dokument som börjar med 'I ljuset av senaste evidens...' och avslutas med '...inrättas en arbetsgrupp för fortsatt utredning.' Det låter imponerande i talarstolar. Det är svårt att argumentera emot en arbetsgrupp. Men om ditt problem är att din granne alltid spelar saxofon klockan fem på morgonen, eller att du fått fel färg på din nya soffa — vem tar hand om det? Inte arbetsgruppen. De har viktigare saker: indicatorer, KPI:er och powerpoint‑slides.

Föreställ dig nu en värld där byråkratin skulle göra även det lilla perfekt. En avdelning för 'personliga irritationsförebyggande åtgärder', komplett med flödesscheman för hur man hanterar en ofrivillig pratstund i hissen. En utskottsskrivelse: 'Åtgärdsplan för oönskat saxofonspel inom bostadsområden, version 1.0.' Skulle det göra livet bättre? Kanske. Men också lite mindre underhållande. Vem skulle vi skvallra med vid kaffeautomaten om inte livet gav oss små absurda hinder att övervinna?

Det finns också en annan anledning att din plåga dröjer kvar: byråkratin gillar konsensus. Den älskar att alla ska hålla med. Det här är vackert i teorin, katastrofalt i praktiken. Att få tusen personer att nicka artigt till samma förslag tar tid — och ju fler nicks, desto fler fotnoter, och ju fler fotnoter, desto längre blir dokumentets titel. Under tiden fortsätter saxofonisten att öva och din soffa förblir mintgrön.

Men ge inte upp hoppet. Det finns sätt att utnyttja systemet: skriv ett formellt klagomål, markera 'akut' i ämnesraden, och om du har tur hamnar ditt ärende i en inkrementell förbättringsprocess. Alternativt — och här är det subversiva tipset — använd samma byråkratiska språk för att övertala. Skicka ett mail som börjar med 'Med hänvisning till gällande ordningsföreskrifter...' och avsluta med 'Jag föreslår att en arbetsgrupp inrättas för pilotstudie av ljuddämpande åtgärder.' Du kommer bli överraskad över hur fort saker rör på sig när de ser att du pratar deras språk.

Slutligen: låt oss fira byråkratin för vad den är bäst på — att göra världen förutsägbar, mätbar och kontrollerbar. Den har fixat saker som får storpolitiska analytiker att nicka i takt. Men när det gäller ditt liv, de där småsakerna som skaver — de är oftast bäst lösta i mötet mellan humor, praktisk list och kanske en kopp kaffe och en ärlig konversation med den som spelar saxofon. Eller så köper du öronproppar. Det är billigare än en ny policy.

Och om någon dag världen faktiskt blir perfekt tack vare alla dessa arbetsgrupper — då kan vi ägna oss åt att skriva dokument om hur vi ska fira perfektionen. Det är också en slags seger. Tills dess: håll humorn vid liv, skratta åt absurditeten, och kom ihåg att även den mäktigaste byråkratin inte alltid har tid för din soffas färg.`,
    category: 'Världen',
  image: '/global-byrakroti-lost-problems.jpg',
    date: '2025-10-08',
  },
  {
    id: '2',
    slug: 'analys-varfor-din-ekonomi',
    title: 'Analys: Varför din ekonomiska situation är ditt eget fel (och lite statens).',
    excerpt:
      'En djupdykning i de senaste marknadstrenderna som du ändå inte kan påverka.',
    content: `Låt oss börja med den goda nyheten: du är inte ensam. Den dåliga nyheten? Du är ändå skyldig. Ekonomin är inte en mystisk kraft som plötsligt bestämmer sig för att vara elak mot dig — det är ett konstnärligt samspel mellan dina val, din bank och någon form av statlig byråkrati som älskar att dubbelstämpla allt.

Först, ett litet självtest. Har du någonsin köpt något för att må bättre och sedan undrat varför måendet varade kortare än kvittot? Grattis — du har bidragit till BNP. Konsumption fungerar så: du köper illusionen av lycka, kreditkortet skickar en förlåtelsekort i slutet av månaden och banken räknar räntan som en hobby. Samtidigt applåderar staten för att skatterna i alla fall gör att vägarna är funktionsdugliga nog för att du ska kunna åka för att köpa mer tröst.

Sen har vi investeringarna. Folk säger "spara för framtiden", men i praktiken betyder det oftast att skjuta upp lågprioriterade nöjen för att betala för rådgivares luncher. Om du investerar i något som inte exploderar i värde över en natt (spoiler: de flesta inte gör det), kallas det "långsiktig planering". Om det exploderar plötsligt — gratulationer till någon som hade tur; ekonomisk rättvisa handlar inte om tur, bara om att kunna uttala "diversifiering" med självsäker röst.

Arbetsmarknaden är ett annat kapitel. Du jobbar heltid, men annonserna tror att "flexibilitet" betyder att du ska gifta dig med din inbox. Lönen står still, priserna stiger — perfekt storm för skuldfällan. Och när du frågar varför lönen inte följer prisökningen får du svaret: produktiviteten ökar inte i din avdelning. Översättning: chefen tycker inte att du är tillräckligt spännande för en löneökning.

Låt oss inte glömma systemet som ständigt påminner oss att "det finns stöd" — men bara om du ansöker i tre olika formulär, laddar upp din födelseattest i originalformat och väntar i kö i ungefär lika lång tid som det tar att se en säsong av en serie. Ja, staten hjälper till. Men det kräver en byråkratisk gymnasieuppsats i retur.

Men vem ska vi egentligen skylla på? Det är frestande att peka finger: banker, regeringen, teknologijättarna, din barista. Sanningen är ful men fri: det är en cocktail. Ditt eget val att klicka "köp nu" spelar roll. Viktigt att förstå: skuld är inte samma sak som misslyckande — det är ofta ett resultat av ett system som belönar synlighet, inte uthållighet.

Ok, vad gör man då? Här är några överlevnadsstrategier som inte involverar att vinna på börsen:

- Budgetera utan skam. Skriv ner vad du gör av med — även småutgifterna bygger monument.
- Automatisera sparande. Sätt undan något innan du hinner spendera det.
- Lär dig skillnaden mellan "investera" och "hoppa på trends". Det senare är roligt på sociala medier, dyrt i verkligheten.
- Förhandla. Folk tror att löner är givna. De är inte det. De är förhandlade.
- Köp öronproppar till din oro; ljuddämpning fungerar bättre än panik.

Avslutningsvis: om din ekonomi känns som en tragedi i tre akter, tänk på att dramaturgin är åtminstone underhållande. Du kan inte alltid kontrollera marknaderna, men du kan kontrollera dina vanor. Och om allt annat misslyckas — skratta åt det. Sarkasm är gratis, och det hjälper faktiskt mot ångest. Om inte annat, är det billigare än en fin klocka du aldrig hade råd med från början.`,
    category: 'Ekonomi',
      image: '/placeholder.svg',
    date: '2025-10-07',
  },
  {
    id: '3',
    slug: 'exklusiv-intervju-idrottsstar',
    title: 'Exklusiv intervju: Idrottsstjärnan som inte har någon åsikt alls om någonting.',
    excerpt: 'Han har vunnit allt, men vad tycker han om global uppvärmning? Svar: Han vet inte, han tränar.',
    content: `Det var en solig dag (för en idrottstjärna räcker det med att solen inte blockerar träningsschemat) när vi fick chansen att prata med personen som bevisar att talang ibland kan existera utan mening. Han har fler medaljer än bekymmer — åtminstone om du frågar sportbyrån — och när vi ställde den högtravande frågan om klimatet log han, ryckte på axlarna och sa ungefär vad du redan misstänkt: han vet inte, han tränar.

Vi började sakligt. "Vad tycker du om global uppvärmning?" Han tittade på oss som om vi föreslog att byta ut hans favorittränare mot en app. "Jag vet inte," sa han. "Jag tränar." Det fanns en ärlighet i det svaret som nästan kändes konstnärlig — eller åtminstone praktisk. Varför diskutera koldioxidutsläpp när intervalldagens tredje set väntar?

Under intervjun visade han prov på en imponerande förmåga att undvika åsikter. Han svarade på frågor om politik med en väl avvägd tystnad som påminde om en diplomat som slutat oroa sig. När vi frågade om hans åsikt om sociala medier svarade han: "Jag kör mina reps." När vi frågade om skattesystemet svarade han: "Är det schemalagt?" — och fortsatte sedan att prata om skor som om de var självständiga filosofiska verk.

Det mest överraskande var kanske inte hans brist på åsikter, utan konsekvensen: folk älskar honom ändå. I ett samhälle där influencers måste ha starka (och ofta köpta) åsikter för att sälja proteinbars, erbjuder han något nästan subversivt — tystnad som varumärke. Fans applåderar för att han presterar; de applåderar inte för vad han tycker om världens tillstånd. Det är förvånande hur befriande det känns.

Men låt oss vara rättvisa. Hans neutralitet är inte nödvändigtvis ignorans. Ibland är det fokus. Ibland är det strategi. Och ibland är det helt enkelt att han inte vill bli indragen i en debatt han inte hinner förlora. När frågan om hans ansvar som offentlig person ställdes, svarade han med: "Jag visar vägen på planen. Andra får diskutera vägen utanför den." Det är inte ett argument, men det funkar som ett.

Samtidigt finns en humoristisk tragik i det här: vi lever i en tid där alla måste tycka om allt, men här finns en person som faktiskt bara vill göra sitt jobb — bli bättre, snabbare, starkare — utan att bli pressad till att kommentera varje katastrof eller trend. Det känns nästan rebelliskt. Kanske nästa gång någon ber honom säga något stort om världen, svarar han med en träningsplan. Det skulle åtminstone vara användbart.

Slutligen, om du undrar vad du ska ta med dig från den här intervjun: följ hans exempel när livet blir för mycket — fokusera på det du kan påverka. Och om någon kräver din ståndpunkt i frågan om havsnivåhöjningar medan du sitter med träningsvärken från gårdagens pass — säg som han: "Jag vet inte. Jag tränar." Det är ett ärligt svar, och i dagens opinionstyrda värld kan det till och med kännas lite revolutionärt.`,
    category: 'Sport',
      image: '/placeholder.svg',
    date: '2025-10-06',
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug) || null;
}
