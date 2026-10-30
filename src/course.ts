export type Word = { id: string; arabic: string; english: string; transliteration: string; group: string };
export type Topic = { id: number; title: string; arabic: string; lessons: string; page: number; worksheet?: number; answer?: number; description: string; words: Word[] };
const make = (topic: number, group: string, lines: string): Word[] => lines.trim().split('\n').map((line, i) => {const [arabic, english, transliteration] = line.split('|');return {id:`${topic}-${group}-${i}`,arabic,english,transliteration,group};});
export const topics: Topic[] = [
{id:1,title:'Body parts',arabic:'جِسْمُ الْإِنْسَانِ',lessons:'01',page:7,worksheet:10,answer:11,description:'Start with the words closest to you. Learn the body, one word at a time.',words:[...make(1,'Head',`رَأْسٌ|Head|raʾsun
شَعْرٌ|Hair|shaʿrun
وَجْهٌ|Face|wajhun
جَبِينٌ|Forehead|jabīnun
حَاجِبٌ|Eyebrow|ḥājibun
أَنْفٌ|Nose|anfun
فَمٌ|Mouth|famun
لِسَانٌ|Tongue|lisānun
ذَقْنٌ|Chin|dhaqnun
عَيْنٌ|Eye|ʿaynun
أُذُنٌ|Ear|udhunun
أَسْنَانٌ|Teeth|asnānun`),...make(1,'Upper body',`كَتِفٌ|Shoulder|katifun
ذِرَاعٌ|Arm / forearm|dhirāʿun
صَدْرٌ|Chest|ṣadrun
يَدٌ|Hand|yadun`),...make(1,'Core & lower body',`قَلْبٌ|Heart|qalbun
بَطْنٌ|Stomach|baṭnun
فَخِذٌ|Thigh|fakhidhun
رِجْلٌ|Leg|rijlun
رُكْبَةٌ|Knee|rukbatun
سَاقٌ|Shin|sāqun
قَدَمٌ|Foot|qadamun`)]},
{id:2,title:'Numbers',arabic:'الْأَرْقَامُ',lessons:'02',page:12,worksheet:18,answer:25,description:'Build your confidence with numbers, from zero to thousands.',words:make(2,'Fundamentals',`صِفْرٌ|Zero|ṣifrun
وَاحِدٌ|One|wāḥidun
اِثْنَانِ|Two|ithnāni
ثَلَاثَةٌ|Three|thalāthatun
أَرْبَعَةٌ|Four|arbaʿatun
خَمْسَةٌ|Five|khamsatun
سِتَّةٌ|Six|sittatun
سَبْعَةٌ|Seven|sabʿatun
ثَمَانِيَةٌ|Eight|thamāniyatun
تِسْعَةٌ|Nine|tisʿatun
عَشَرَةٌ|Ten|ʿasharatun
عِشْرُونَ|Twenty|ʿishrūna
ثَلَاثُونَ|Thirty|thalāthūna
أَرْبَعُونَ|Forty|arbaʿūna
خَمْسُونَ|Fifty|khamsūna
سِتُّونَ|Sixty|sittūna
سَبْعُونَ|Seventy|sabʿūna
ثَمَانُونَ|Eighty|thamānūna
تِسْعُونَ|Ninety|tisʿūna
مِائَةٌ|One hundred|miʾatun
أَلْفٌ|One thousand|alfun`)},
{id:3,title:'Telling the time',arabic:'السَّاعَةُ',lessons:'03',page:28,worksheet:30,answer:39,description:'Read the clock and talk about the time in Arabic.',words:make(3,'Time',`سَاعَةٌ|Hour / clock|sāʿatun
دَقِيقَةٌ|Minute|daqīqatun
ثَانِيَةٌ|Second|thāniyatun
نِصْفٌ|Half|niṣfun
رُبْعٌ|Quarter|rubʿun
إِلَّا|Except / to|illā
وَ|And / past|wa`)},
{id:4,title:'Days of the week',arabic:'أَيَّامُ الْأُسْبُوعِ',lessons:'04',page:43,worksheet:44,answer:45,description:'Learn the rhythm of the week.',words:make(4,'Days',`الْأَحَدُ|Sunday|al-aḥadu
الْإِثْنَيْنِ|Monday|al-ithnayni
الثُّلَاثَاءُ|Tuesday|ath-thulāthāʾu
الْأَرْبِعَاءُ|Wednesday|al-arbiʿāʾu
الْخَمِيسُ|Thursday|al-khamīsu
الْجُمُعَةُ|Friday|al-jumuʿatu
السَّبْتُ|Saturday|as-sabtu`)},
{id:5,title:'Months of the year',arabic:'أَشْهُرُ السَّنَةِ',lessons:'05',page:46,worksheet:48,answer:51,description:'Explore the Hijri and Gregorian calendars in your notes.',words:make(5,'Hijri months',`مُحَرَّمٌ|Muharram|muḥarramun
صَفَرٌ|Safar|ṣafarun
رَبِيعُ الْأَوَّلِ|Rabi al-Awwal|rabīʿu al-awwali
رَبِيعُ الْآخِرِ|Rabi al-Akhir|rabīʿu al-ākhiri
جُمَادَى الْأُولَى|Jumada al-Ula|jumādā al-ūlā
جُمَادَى الْآخِرَةِ|Jumada al-Akhirah|jumādā al-ākhirah
رَجَبٌ|Rajab|rajabun
شَعْبَانُ|Shaban|shaʿbānu
رَمَضَانُ|Ramadan|ramaḍānu
شَوَّالٌ|Shawwal|shawwālun
ذُو الْقَعْدَةِ|Dhu al-Qadah|dhū al-qaʿdah
ذُو الْحِجَّةِ|Dhu al-Hijjah|dhū al-ḥijjah`)},
{id:6,title:'People & entities',arabic:'الْكَائِنَاتُ',lessons:'06',page:54,worksheet:56,answer:61,description:'Name the people and things around you.',words:make(6,'People',`رَجُلٌ|Man|rajulun
اِمْرَأَةٌ|Woman|imraʾatun
وَلَدٌ|Boy|waladun
بِنْتٌ|Girl|bintun
طِفْلٌ|Child|ṭiflun
أَبٌ|Father|abun
أُمٌّ|Mother|ummun
أَخٌ|Brother|akhun
أُخْتٌ|Sister|ukhtun`)},
{id:7,title:'Getting to know each other',arabic:'التَّعَارُفُ',lessons:'07–08',page:66,worksheet:72,answer:84,description:'Begin a conversation, ask questions, and introduce yourself.',words:make(7,'Conversation',`السَّلَامُ عَلَيْكُمْ|Peace be upon you|as-salāmu ʿalaykum
وَعَلَيْكُمُ السَّلَامُ|And upon you be peace|wa ʿalaykumu s-salāmu
مَا|What|mā
مَنْ|Who|man
مِنْ|From|min
أَيْنَ|Where|ayna
كَيْفَ|How|kayfa
مَتَى|When|matā
كَمْ|How many / how much|kam
لِمَاذَا|Why|limādhā
اِسْمِي|My name|ismī
شُكْرًا|Thank you|shukran`)},
{id:9,title:'Nouns in the classroom',arabic:'أَسْمَاءُ حُجْرَةِ الدِّرَاسَةِ',lessons:'09–11',page:96,description:'Learn classroom nouns and explore singular and plural forms.',words:make(9,'Classroom',`كِتَابٌ|Book|kitābun
قَلَمٌ|Pen|qalamun
دَفْتَرٌ|Notebook|daftarun
بَابٌ|Door|bābun
نَافِذَةٌ|Window|nāfidhatun
كُرْسِيٌّ|Chair|kursiyyun
سَبُّورَةٌ|Board|sabbūratun
مُدَرِّسٌ|Teacher|mudarrisun
طَالِبٌ|Student|ṭālibun
فِي|In|fī
عَلَى|On|ʿalā
تَحْتَ|Under|taḥta`)},
{id:10,title:'Verbs in the classroom',arabic:'أَفْعَالُ حُجْرَةِ الدِّرَاسَةِ',lessons:'12–15, 25',page:99,description:'Put words into action with classroom verbs.',words:make(10,'Actions',`كَتَبَ|He wrote|kataba
قَرَأَ|He read|qaraʾa
جَلَسَ|He sat|jalasa
قَامَ|He stood|qāma
فَتَحَ|He opened|fataḥa
أَغْلَقَ|He closed|aghlaqa
سَمِعَ|He heard|samiʿa
فَهِمَ|He understood|fahima
سَأَلَ|He asked|saʾala
أَجَابَ|He answered|ajāba`)},
{id:11,title:'The marketplace & colours',arabic:'السُّوقُ وَالْأَلْوَانُ',lessons:'16–17, 20–24',page:104,description:'Explore everyday shopping vocabulary and the colours around you.',words:make(11,'Marketplace',`سُوقٌ|Marketplace|sūqun
خُبْزٌ|Bread|khubzun
مَاءٌ|Water|māʾun
حَلِيبٌ|Milk|ḥalībun
لَحْمٌ|Meat|laḥmun
تُفَّاحٌ|Apples|tuffāḥun
أَحْمَرُ|Red|aḥmaru
أَزْرَقُ|Blue|azraqu
أَخْضَرُ|Green|akhḍaru
أَصْفَرُ|Yellow|aṣfaru
أَبْيَضُ|White|abyaḍu
أَسْوَدُ|Black|aswadu`)},
{id:12,title:'Commands in the Qur’an',arabic:'أَفْعَالُ الْأَمْرِ',lessons:'26',page:112,description:'Recognise common command verbs. See the notes for context and examples.',words:make(12,'Commands',`اِقْرَأْ|Read|iqraʾ
اُكْتُبْ|Write|uktub
قُلْ|Say|qul
اِسْمَعْ|Listen|ismaʿ
اُذْكُرْ|Remember|udhkur
اُعْبُدْ|Worship|uʿbud
اُسْجُدْ|Prostrate|usjud`)},
];
export const allWords = topics.flatMap(t=>t.words);
