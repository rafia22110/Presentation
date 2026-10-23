export interface CreationPantryItem {
  day: number;
  title: string;
  sefariaVerse: string;
  sefariaUrl: string;
  link929Url: string;
  youtubeVideos: Array<{ title: string; channel: string }>;
  clilEnglish: Array<{ word: string; translation: string; pronunciation: string }>;
  stemFormula: {
    symmetryRule: string;
    scientificConcept: string;
  };
}

export const pantryData: CreationPantryItem[] = [
  {
    day: 0,
    title: "תוהו ובוהו ופתיח",
    sefariaVerse: "בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.1-2",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "חנה הס - בראשית", channel: "חנה הס" },
      { title: "פרויקט 929 - בריאת העולם", channel: "פרויקט 929" }
    ],
    clilEnglish: [
      { word: "Beginning", translation: "בראשית", pronunciation: "bi-gih-ning" },
      { word: "Chaos", translation: "תוהו ובוהו", pronunciation: "kay-os" },
      { word: "Earth", translation: "ארץ", pronunciation: "urth" }
    ],
    stemFormula: {
      symmetryRule: "Start / Baseline",
      scientificConcept: "Initial Cosmic Singularity and Entropy"
    }
  },
  {
    day: 1,
    title: "יום ראשון - אור וחושך",
    sefariaVerse: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר׃ וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.3-5",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "אורית בסיפורי בראשית - יום ראשון", channel: "אורית בסיפורי בראשית" },
      { title: "Kurzgesagt - What is Light?", channel: "Kurzgesagt" }
    ],
    clilEnglish: [
      { word: "Light", translation: "אור", pronunciation: "lyte" },
      { word: "Darkness", translation: "חושך", pronunciation: "dark-nis" },
      { word: "Day", translation: "יום", pronunciation: "day" }
    ],
    stemFormula: {
      symmetryRule: "Day 1 (Realm) ↔ Day 4 (Luminaries/Inhabitants)",
      scientificConcept: "Electromagnetic Spectrum & Photons"
    }
  },
  {
    day: 2,
    title: "יום שני - הרקיע והבדלת המים",
    sefariaVerse: "וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.6-8",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "הידברות - בריאת הרקיע", channel: "הידברות" },
      { title: "Up and Atom - Water and Atmosphere", channel: "Up and Atom" }
    ],
    clilEnglish: [
      { word: "Sky / Firmament", translation: "רקיע", pronunciation: "sky" },
      { word: "Water", translation: "מים", pronunciation: "wah-ter" },
      { word: "Atmosphere", translation: "אטמוספירה", pronunciation: "at-mus-feer" }
    ],
    stemFormula: {
      symmetryRule: "Day 2 (Realm) ↔ Day 5 (Birds & Sea Creatures)",
      scientificConcept: "Atmospheric Layers & Hydrological Cycle"
    }
  },
  {
    day: 3,
    title: "יום שלישי - יבשה, ימים וצמחייה",
    sefariaVerse: "וַיֹּאמֶר אֱלֹהִים יִקָּווּ הַמַּיִם מִתַּחַת הַשָּׁמַיִם אֶל מָקוֹם אֶחָד וְתֵרָאֶה הַיַּבָּשָׁה",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.9-13",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "פילפילון - יום שלישי צמחייה", channel: "פילפילון" },
      { title: "Kurzgesagt - How Plants Work", channel: "Kurzgesagt" }
    ],
    clilEnglish: [
      { word: "Land", translation: "יבשה", pronunciation: "land" },
      { word: "Sea", translation: "ים", pronunciation: "see" },
      { word: "Trees", translation: "עצים / צמחייה", pronunciation: "treez" }
    ],
    stemFormula: {
      symmetryRule: "Day 3 (Realm) ↔ Day 6 (Land Animals & Humans)",
      scientificConcept: "Photosynthesis & Ecosystem Food Webs"
    }
  },
  {
    day: 4,
    title: "יום רביעי - המאורות הגדולים",
    sefariaVerse: "וַיַּעַשׂ אֱלֹהִים אֶת שְׁנֵי הַמְּאֹרֹת הַגְּדֹלִים אֶת הַמָּאוֹר הַגָּדֹל לְמֶמְשֶׁלֶת הַיּוֹם וְאֶת הַמָּאוֹר הַקָּטֹן לְמֶמְשֶׁלֶת הַלַּיְלָה וְאֵת הַכּוֹכָבִים",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.14-19",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "חנה הס - המאורות", channel: "חנה הס" },
      { title: "Up and Atom - Solar System Gravity", channel: "Up and Atom" }
    ],
    clilEnglish: [
      { word: "Sun", translation: "שמש", pronunciation: "sun" },
      { word: "Moon", translation: "ירח", pronunciation: "moon" },
      { word: "Stars", translation: "כוכבים", pronunciation: "starz" }
    ],
    stemFormula: {
      symmetryRule: "Day 4 (Inhabitants) ↔ Day 1 (Light Realm)",
      scientificConcept: "Orbital Mechanics & Celestial Timekeeping"
    }
  },
  {
    day: 5,
    title: "יום חמישי - עוף השמים ושרץ המים",
    sefariaVerse: "וַיֹּאמֶר אֱלֹהִים יִשְׁרְצוּ הַמַּיִם שֶׁרֶץ נֶפֶשׁ חַיָּה וְעוֹף יְעוֹפֵף עַל הָאָרֶץ עַל פְּנֵי רְקִיעַ הַשָּׁמָיִם",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.20-23",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "אורית בסיפורי בראשית - דגים ועופות", channel: "אורית בסיפורי בראשית" },
      { title: "ADDitude Magazine - Focus & Sensory Learning", channel: "ADDitude Magazine" }
    ],
    clilEnglish: [
      { word: "Fish", translation: "דגים", pronunciation: "fish" },
      { word: "Birds", translation: "עופות", pronunciation: "burdz" },
      { word: "Ocean", translation: "אוקיינוס", pronunciation: "oh-shun" }
    ],
    stemFormula: {
      symmetryRule: "Day 5 (Inhabitants) ↔ Day 2 (Sky & Water Realm)",
      scientificConcept: "Hydrodynamics & Aerodynamics in Animals"
    }
  },
  {
    day: 6,
    title: "יום שישי - חיית הארץ והאדם",
    sefariaVerse: "וַיִּבְרָא אֱלֹהִים אֶת הָאָדָם בְּצַלְמוֹ בְּצֶלֶם אֱלֹהִים בָּרָא אֹתוֹ זָכָר וּנְקֵבָה בָּרָא אֹתָם",
    sefariaUrl: "https://www.sefaria.org/Genesis.1.24-31",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "929 - בריאת האדם", channel: "פרויקט 929" },
      { title: "Kurzgesagt - Human Evolution & Biology", channel: "Kurzgesagt" }
    ],
    clilEnglish: [
      { word: "Animals", translation: "חיות", pronunciation: "an-uh-mulz" },
      { word: "Human", translation: "אדם", pronunciation: "hyoo-mun" },
      { word: "Responsibility", translation: "אחריות", pronunciation: "ri-spon-suh-bil-uh-tee" }
    ],
    stemFormula: {
      symmetryRule: "Day 6 (Inhabitants) ↔ Day 3 (Dry Land Realm)",
      scientificConcept: "Anatomy, Genetics & Ecosystem Stewardship"
    }
  },
  {
    day: 7,
    title: "יום שביעי - שבת מנוחה",
    sefariaVerse: "וַיְכַל אֱלֹהִים בַּיּוֹם הַשְּׁבִיעִי מְלַאכְתּוֹ אֲשֶׁר עָשָׂה וַיִּשְׁבֹּת בַּיּוֹם הַשְּׁבִיעִי מִכָּל מְלַאכְתּוֹ אֲשֶׁר עָשָׂה",
    sefariaUrl: "https://www.sefaria.org/Genesis.2.1-3",
    link929Url: "https://edu.929.org.il/class/%D7%94%D7%99%D7%95%D7%9D-%D7%94%D7%A8%D7%90%D7%A9%D7%95%D7%9F/",
    youtubeVideos: [
      { title: "פילפילון - יום שבת", channel: "פילפילון" }
    ],
    clilEnglish: [
      { word: "Rest / Sabbath", translation: "שבת / מנוחה", pronunciation: "rest" },
      { word: "Holy", translation: "קדוש", pronunciation: "hoh-lee" },
      { word: "Completion", translation: "השלמה", pronunciation: "kum-plee-shun" }
    ],
    stemFormula: {
      symmetryRule: "Day 7 - Equilibrium & Completion",
      scientificConcept: "Dynamic Equilibrium & Rest Cycles"
    }
  }
];
