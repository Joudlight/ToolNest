/* =====================================================
   tools/dua.js — Daily Du'a & Athkar (Enriched Component)
   ===================================================== */

const duaEnriched = (function() {

  // ---------- DATA (full texts, never truncated) ----------
  const itemsDB = [
    // --- QURAN / PROTECTION ---
    {
      id: "ayat-kursi",
      type: "quran",
      category: ["morning","evening","protection","sleep"],
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      transliteration: "Allahu la ilaha illa huwa al-hayyu al-qayyum, la ta'khudhuhu sinatun wa la nawm... (full)",
      translationEn: "Allah – there is no deity except Him, the Ever‑Living, the Self‑Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth... (Surah Al‑Baqarah 2:255)",
      explanationEn: "The greatest verse of the Qur’an. Reciting it morning and evening brings protection from jinn and evil until the next period.",
      source: "Quran 2:255 | Al-Nasai (Sahih)",
      grade: "Sahih",
      repeat: 1,
      tags: ["protection"]
    },
    {
      id: "ikhlas",
      type: "quran",
      category: ["morning","evening","protection","sleep"],
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿1﴾ اللَّهُ الصَّمَدُ ﴿2﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿3﴾ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      transliteration: "Qul huwa Allahu ahad, Allahu assamad, lam yalid wa lam yulad, wa lam yakun lahu kufuwan ahad.",
      translationEn: "Say, 'He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.' (Surah Al-Ikhlas 112:1-4)",
      explanationEn: "Equivalent to one third of the Qur’an. Recite 3 times for protection.",
      source: "Muslim 4/2092",
      grade: "Sahih",
      repeat: 3,
      tags: ["protection"]
    },
    {
      id: "falaq",
      type: "quran",
      category: ["morning","evening","protection","sleep"],
      arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿1﴾ مِنْ شَرِّ مَا خَلَقَ ﴿2﴾ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿3﴾ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿4﴾ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      transliteration: "Qul a'udhu bi-rabbi al-falaq, min sharri ma khalaq... (full)",
      translationEn: "Say, 'I seek refuge in the Lord of daybreak from the evil of that which He created...' (Surah Al-Falaq 113:1-5)",
      explanationEn: "One of the mu’awwidhat. Repels evil eye and magic.",
      source: "Muslim 4/2092",
      grade: "Sahih",
      repeat: 3,
      tags: ["protection"]
    },
    {
      id: "nas",
      type: "quran",
      category: ["morning","evening","protection","sleep"],
      arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿1﴾ مَلِكِ النَّاسِ ﴿2﴾ إِلَٰهِ النَّاسِ ﴿3﴾ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿4﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿5﴾ مِنَ الْجِنَّةِ وَالنَّاسِ",
      transliteration: "Qul a'udhu bi-rabbi an-nas... (full)",
      translationEn: "Say, 'I seek refuge in the Lord of mankind...' (Surah An-Nas 114:1-6)",
      explanationEn: "The other protective surah, completes the shield.",
      source: "Muslim 4/2092",
      grade: "Sahih",
      repeat: 3,
      tags: ["protection"]
    },
    {
      id: "bismillah-prot",
      type: "dua",
      category: ["morning","evening","protection"],
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      transliteration: "Bismillahil-ladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim.",
      translationEn: "In the name of Allah, with Whose name nothing can cause harm in the earth nor in the heavens, and He is the All‑Hearing, the All‑Knowing.",
      explanationEn: "Recite 3× in the morning and evening to be protected from sudden harm.",
      source: "Abu Dawud 4/323 | Tirmidhi",
      grade: "Sahih",
      repeat: 3,
      tags: ["protection"]
    },
    {
      id: "raditu",
      type: "dua",
      category: ["morning","evening"],
      arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
      transliteration: "Raditu billahi rabban, wa bil-islami dinan, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyyan.",
      translationEn: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (ﷺ) as my Prophet.",
      explanationEn: "Whoever says this morning and evening, Allah guarantees His pleasure.",
      source: "Abu Dawud 4/322 | Tirmidhi",
      grade: "Sahih",
      repeat: 3,
      tags: ["gratitude"]
    },
    {
      id: "sayyid-istighfar",
      type: "dua",
      category: ["morning","evening"],
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      transliteration: "Allahumma anta rabbi la ilaha illa ant... (full)",
      translationEn: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant... I admit to my sins, so forgive me, for none forgives sins but You.",
      explanationEn: "The best du’a for forgiveness. Said with certainty, it guarantees Paradise.",
      source: "Bukhari 7/150",
      grade: "Sahih",
      repeat: 1,
      tags: ["forgiveness"]
    },
    {
      id: "asbahna",
      type: "dua",
      category: ["morning"],
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaykan-nushur.",
      translationEn: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the Resurrection.",
      source: "Abu Dawud / Tirmidhi",
      grade: "Sahih",
      repeat: 1
    },
    {
      id: "amsayna",
      type: "dua",
      category: ["evening"],
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
      transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu wa ilaykal-masir.",
      translationEn: "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is our return.",
      source: "Abu Dawud / Tirmidhi",
      grade: "Sahih",
      repeat: 1
    },
    {
      id: "subhana-bihamdihi",
      type: "dua",
      category: ["morning","evening"],
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subhana Allahi wa bihamdihi",
      translationEn: "Glory and praise be to Allah.",
      source: "Muslim 4/2071",
      grade: "Sahih",
      repeat: 100,
      tags: ["tasbih"]
    },
    {
      id: "la-ilaha-illa",
      type: "dua",
      category: ["morning","evening"],
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay-in qadir.",
      translationEn: "There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things competent.",
      source: "Muslim 4/2071",
      grade: "Sahih",
      repeat: 100
    },
    // ===== FOOD DU'AS (authentic, full) =====
    {
      id: "food-before",
      type: "dua",
      category: ["food"],
      arabic: "بِسْمِ اللَّهِ",
      transliteration: "Bismillah.",
      translationEn: "In the name of Allah.",
      explanationEn: "Say before eating; if you forget, recite the complete du'a for forgetfulness.",
      source: "Bukhari 7/88",
      grade: "Sahih",
      repeat: 1,
      tags: ["food"]
    },
    {
      id: "food-forget",
      type: "dua",
      category: ["food"],
      arabic: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
      transliteration: "Bismillahi awwalahu wa akhirahu.",
      translationEn: "In the name of Allah, at its beginning and at its end.",
      explanationEn: "When you forget to say Bismillah before eating, say this as soon as you remember.",
      source: "Abu Dawud 3/347 | Tirmidhi 1858 (Sahih)",
      grade: "Sahih",
      repeat: 1,
      tags: ["food"]
    },
    {
      id: "food-after-dua1",
      type: "dua",
      category: ["food"],
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا الطَّعَامَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      transliteration: "Alhamdu lillahil-ladhi at'amani hadha at-ta'ama wa razaqanihi min ghayri hawlin minni wa la quwwah.",
      translationEn: "All praise is due to Allah who fed me this food and provided it for me without any strength or power on my part.",
      explanationEn: "Reciting this after a meal brings forgiveness of past sins.",
      source: "Abu Dawud 4/340 | Tirmidhi 3458 (Hasan)",
      grade: "Hasan",
      repeat: 1,
      tags: ["food"]
    },
    {
      id: "food-after-dua2",
      type: "dua",
      category: ["food"],
      arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا",
      transliteration: "Alhamdu lillahi hamdan kathiran tayyiban mubarakan fihi, ghayra makfiyyin wa la muwadda'in wa la mustaghnan 'anhu rabbana.",
      translationEn: "All praise is due to Allah, abundant, good, blessed praise, praise that is neither insufficient nor abandoned, nor can we do without it, our Lord.",
      explanationEn: "The Prophet (ﷺ) said: 'Allah is pleased when a servant eats and praises Him.'",
      source: "Bukhari 6/214 (Mu'allaq, supported by other chains)",
      grade: "Sahih",
      repeat: 1,
      tags: ["food"]
    },
    {
      id: "food-host-dua",
      type: "dua",
      category: ["food"],
      arabic: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي، وَاسْقِ مَنْ سَقَانِي",
      transliteration: "Allahumma at'im man at'amani, wa asqi man saqani.",
      translationEn: "O Allah, feed the one who fed me, and give drink to the one who gave me drink.",
      explanationEn: "The best du'a to say for your host.",
      source: "Muslim 3/1615",
      grade: "Sahih",
      repeat: 1,
      tags: ["food","gratitude"]
    },
    // ===== TRAVEL DU'AS (authentic, full) =====
    {
      id: "travel-leaving-home",
      type: "dua",
      category: ["travel"],
      arabic: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "Bismillah, tawakkaltu 'ala Allah, la hawla wa la quwwata illa billah.",
      translationEn: "In the name of Allah, I place my trust in Allah, there is no power nor might except with Allah.",
      explanationEn: "Recite when leaving home; it brings protection and guidance.",
      source: "Abu Dawud 4/325 | Tirmidhi 3426 (Sahih)",
      grade: "Sahih",
      repeat: 1,
      tags: ["travel"]
    },
    {
      id: "travel-mounting",
      type: "dua",
      category: ["travel"],
      arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى. اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ. اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ",
      transliteration: "Allahu Akbar (3x), subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun. Allahumma inna nas'aluka fi safarina hadha al-birra wat-taqwa, wa minal-'amali ma tarda. Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dahu. Allahumma anta as-sahibu fis-safar, wal-khalifatu fil-ahl. Allahumma inni a'udhu bika min wa'tha'is-safar, wa ka'abatil-manzar, wa su'il-munqalabi fil-mali wal-ahl.",
      translationEn: "Allah is the Greatest (x3). Glory be to the One who has subjected this to us, and we could not have done so, and to our Lord we will return. O Allah, we ask You for righteousness and piety in this journey, and deeds that please You. O Allah, make this journey easy for us and fold its distance. O Allah, You are the Companion in travel and the Successor over the family. O Allah, I seek refuge in You from the hardships of travel, gloomy sights, and an evil return in wealth and family.",
      explanationEn: "The complete supplication of travelling, as taught by the Prophet (ﷺ).",
      source: "Muslim 2/978 | Abu Dawud 3/37",
      grade: "Sahih",
      repeat: 1,
      tags: ["travel"]
    },
    {
      id: "travel-returning",
      type: "dua",
      category: ["travel"],
      arabic: "آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ",
      transliteration: "A'ibuna ta'ibuna 'abiduna li-rabbina hamidun.",
      translationEn: "We are returning, repenting, worshipping, and praising our Lord.",
      explanationEn: "Say this when returning from a journey; it is a sign of a blessed trip.",
      source: "Muslim 2/981",
      grade: "Sahih",
      repeat: 1,
      tags: ["travel"]
    },
    {
      id: "travel-entering-town",
      type: "dua",
      category: ["travel"],
      arabic: "اللَّهُمَّ رَبَّ السَّمَوَاتِ السَّبْعِ وَمَا أَظْلَلْنَ، وَرَبَّ الْأَرَضِينَ السَّبْعِ وَمَا أَقْلَلْنَ، وَرَبَّ الشَّيَاطِينِ وَمَا أَضْلَلْنَ، وَرَبَّ الرِّيَاحِ وَمَا ذَرَيْنَ، أَسْأَلُكَ خَيْرَ هَذِهِ الْقَرْيَةِ وَخَيْرَ أَهْلِهَا وَخَيْرَ مَا فِيهَا، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ أَهْلِهَا وَشَرِّ مَا فِيهَا",
      transliteration: "Allahumma rabba as-samawat as-sab'i wa ma azlalna, wa rabba al-aradina as-sab'i wa ma aqlalna, wa rabba ash-shayatini wa ma adlalna, wa rabba ar-riyahi wa ma dharayna, as'aluka khayra hadhihil-qaryati wa khayra ahliha wa khayra ma fiha, wa a'udhu bika min sharriha wa sharri ahliha wa sharri ma fiha.",
      translationEn: "O Allah, Lord of the seven heavens and whatever they shade, Lord of the seven earths and whatever they carry, Lord of the devils and whomever they mislead, Lord of the winds and whatever they scatter, I ask You for the good of this town, the good of its people, and the good of what is in it; and I seek refuge in You from its evil, the evil of its people, and the evil of what is in it.",
      explanationEn: "A powerful du'a to recite when entering a new town or city.",
      source: "An-Nasa'i 5/242 (Sahih) | Ibn Hibban (Sahih)",
      grade: "Sahih",
      repeat: 1,
      tags: ["travel","protection"]
    }
  ];

  // ---------- HADITH DATABASE (for daily rotation) ----------
  const hadithDB = [
    // Original hadith about SubhanAllah wa bihamdihi
    {
      id: "h1",
      narrator: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ",
      arabic: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      transliteration: "Kalimatān khafīfatān 'ala al-lisān, thaqīlatān fī al-mīzān, habībatān ilā ar-Rahmān: Subhāna Allāhi wa bihamdihī, Subhāna Allāhi al-'Azīm.",
      translationEn: "Two phrases light on the tongue, heavy on the Scale, beloved to the Most Merciful: 'Glory and praise be to Allah', and 'Glory be to Allah, the Magnificent.'",
      explanationEn: "Extremely easy to say but immensely rewarding.",
      source: "Bukhari 6682 | Muslim 2694",
      grade: "Sahih"
    },
    {
      id: "h2",
      narrator: "عَنْ أَبِي هُرَيْرَةَ",
      arabic: "لَأَنْ أَقُولَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ، أَحَبُّ إِلَيَّ مِمَّا طَلَعَتْ عَلَيْهِ الشَّمْسُ",
      transliteration: "La-an aqūla: Subhāna Allāhi wa bihamdihī, Subhāna Allāhi al-'Azīm, ahabbu ilayya mimmā tala'at 'alayhi ash-shams.",
      translationEn: "For me to say 'Glory and praise be to Allah, Glory be to Allah the Magnificent' is more beloved to me than everything the sun rises upon.",
      explanationEn: "These words surpass the entire world in value.",
      source: "Muslim 2695",
      grade: "Sahih"
    },
    {
      id: "h3",
      narrator: "عَنْ جَابِرٍ",
      arabic: "مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، غُرِسَتْ لَهُ نَخْلَةٌ فِي الْجَنَّةِ",
      transliteration: "Man qāla: Subhāna Allāhi wa bihamdihī, ghurisat lahu nakhlatun fī al-jannah.",
      translationEn: "Whoever says 'Subhan Allahi wa bihamdihi' will have a palm tree planted for him in Paradise.",
      explanationEn: "A simple dhikr that builds your eternal home.",
      source: "Tirmidhi (Hasan)",
      grade: "Hasan"
    },
    {
      id: "h4",
      narrator: "عَنْ أَبِي ذَرٍّ",
      arabic: "أَلَا أُخْبِرُكَ بِأَحَبِّ الْكَلَامِ إِلَى اللَّهِ؟ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Alā ukhbiruka bi-aḥabbi al-kalāmi ilā Allāh? Qāla: Subhāna Allāhi wa bihamdihī.",
      translationEn: "Shall I not tell you of the most beloved words to Allah? He said: 'Subhan Allahi wa bihamdihi.'",
      source: "Muslim 2731",
      grade: "Sahih"
    },
    // Additional hadith (enriching the daily pool)
    {
      id: "h5",
      narrator: "عَنْ أَنَسٍ",
      arabic: "يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
      transliteration: "Yaqūlu Allāhu ta'ālā: Anā 'inda ẓanni 'abdī bī.",
      translationEn: "Allah says: 'I am as My servant thinks of Me.'",
      explanationEn: "Have positive thoughts about Allah; He will treat you accordingly.",
      source: "Bukhari 7405 | Muslim 2675",
      grade: "Sahih"
    },
    {
      id: "h6",
      narrator: "عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو",
      arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ",
      transliteration: "Ar-rāḥimūna yarḥamuhum ar-Raḥmān.",
      translationEn: "The merciful will be shown mercy by the Most Merciful.",
      source: "Abu Dawud 4941 | Tirmidhi 1924 (Sahih)",
      grade: "Sahih"
    },
    {
      id: "h7",
      narrator: "عَنْ أَبِي مُوسَى",
      arabic: "مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لَا يَذْكُرُهُ مَثَلُ الْحَيِّ وَالْمَيِّتِ",
      transliteration: "Mathalu alladhī yadhkuru rabbahu wa alladhī lā yadhkuruhu mathalu al-ḥayyi wa al-mayyit.",
      translationEn: "The example of the one who remembers his Lord and the one who does not is like the living and the dead.",
      source: "Bukhari 6407",
      grade: "Sahih"
    },
    {
      id: "h8",
      narrator: "عَنْ أَبِي هُرَيْرَةَ",
      arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ، وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
      transliteration: "Inna Allāha lā yanẓuru ilā ṣuwarikum wa amwālikum, wa lākin yanẓuru ilā qulūbikum wa a'mālikum.",
      translationEn: "Indeed Allah does not look at your appearances or wealth, but He looks at your hearts and deeds.",
      source: "Muslim 2564",
      grade: "Sahih"
    },
    // Food & Travel related hadith
    {
      id: "h9",
      narrator: "عَنْ جَابِرٍ",
      arabic: "إِذَا أَكَلَ أَحَدُكُمْ طَعَامًا فَلْيَقُلْ: بِسْمِ اللَّهِ، فَإِنْ نَسِيَ فِي أَوَّلِهِ فَلْيَقُلْ: بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ",
      transliteration: "Idhā akala aḥadukum ṭa'āman falyaqul: Bismillāh, fa-in nasiya fī awwalihi falyaqul: Bismillāhi awwalahu wa ākhirah.",
      translationEn: "When one of you eats food, let him say: 'Bismillah.' If he forgets at the beginning, let him say: 'Bismillahi awwalahu wa akhirah.'",
      explanationEn: "Remedy for forgetting the basmalah before a meal.",
      source: "Abu Dawud 3767 | Tirmidhi 1858 (Sahih)",
      grade: "Sahih"
    },
    {
      id: "h10",
      narrator: "عَنْ أَبِي هُرَيْرَةَ",
      arabic: "الْمُسْلِمُ إِذَا سَافَرَ فَلْيُصَلِّ رَكْعَتَيْنِ فِي السَّفَرِ",
      transliteration: "Al-muslimu idhā sāfara fal-yuṣalli rak'atayni fī as-safar.",
      translationEn: "When a Muslim travels, he should pray two rak'ahs during the journey.",
      explanationEn: "Shortening the prayer is a sunnah and a mercy from Allah.",
      source: "Bukhari 1090 | Muslim 689",
      grade: "Sahih"
    },
    {
      id: "h11",
      narrator: "عَنْ أَبِي سَعِيدٍ",
      arabic: "إِذَا رَجَعَ أَحَدُكُمْ مِنْ سَفَرٍ فَلْيُهْدِ أَهْلَهُ شَيْئًا وَلَوْ سِوَاكًا",
      transliteration: "Idhā raja'a aḥadukum min safarin fal-yuhdi ahlahu shay'an wa law siwākan.",
      translationEn: "When one of you returns from a journey, let him bring a gift to his family, even if it is a tooth-stick.",
      explanationEn: "A small token of love after travel.",
      source: "Bukhari (al-Adab al-Mufrad) 1224 (Hasan)",
      grade: "Hasan"
    },
    {
      id: "h12",
      narrator: "عَنْ أَنَسٍ",
      arabic: "سَافِرُوا تَصِحُّوا وَتُرْزَقُوا",
      transliteration: "Sāfirū taṣiḥḥū wa turzaqū.",
      translationEn: "Travel, you will be healthy and you will be provided for.",
      explanationEn: "An encouragement to travel for beneficial purposes.",
      source: "Ahmad (with supporting chains, Hasan li-ghayrihi)",
      grade: "Hasan"
    }
  ];

  // ---------- STATE (scoped per component instance) ----------
  function createState() {
    const favorites = JSON.parse(localStorage.getItem('dua_favs') || '[]');
    const recentlyViewed = JSON.parse(localStorage.getItem('dua_recent') || '[]');
    const progress = JSON.parse(localStorage.getItem('dua_progress') || '{}');
    return {
      activeCat: 'morning',
      searchQuery: '',
      darkMode: localStorage.getItem('dua_dark') === 'true',
      fontSize: parseFloat(localStorage.getItem('dua_font_size')) || 1.2,
      favorites,
      recentlyViewed,
      progress
    };
  }

  // ---------- HELPERS ----------
  function getDailyHadith() {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_hadith_${today}`;
    let daily = JSON.parse(localStorage.getItem(key));
    if (!daily) {
      const shuffled = [...hadithDB].sort(() => Math.random() - 0.5);
      daily = shuffled.slice(0, 5).map(h => h.id);
      localStorage.setItem(key, JSON.stringify(daily));
    }
    return daily.map(id => hadithDB.find(h => h.id === id)).filter(Boolean);
  }

  // ---------- COMPONENT RETURN ----------
  function buildDua() {
    return {
      title: "🤲 Du'a & Athkar",
      html: `
        <div class="dua-app" id="dua-root">
          <div class="dua-header-bar">
            <div class="search-wrap">
              <input type="text" id="dua-search" placeholder="Search du'a, hadith..." aria-label="Search">
            </div>
            <button class="icon-btn" id="dua-dark-toggle" title="Dark mode">🌓</button>
            <button class="icon-btn" id="dua-font-up">A+</button>
            <button class="icon-btn" id="dua-font-down">A-</button>
            <span class="streak-badge" id="dua-streak">🔥 0 days</span>
          </div>
          <div class="dua-tabs" role="tablist">
            <button class="dua-tab active" data-cat="morning">🌅 Morning</button>
            <button class="dua-tab" data-cat="evening">🌙 Evening</button>
            <button class="dua-tab" data-cat="protection">🛡️ Protection</button>
            <button class="dua-tab" data-cat="sleep">😴 Sleep</button>
            <button class="dua-tab" data-cat="food">🍽️ Food</button>
            <button class="dua-tab" data-cat="travel">✈️ Travel</button>
            <button class="dua-tab" data-cat="hadith">✨ Hadith of the Day</button>
            <button class="dua-tab" data-cat="favorites">⭐ Favorites</button>
            <button class="dua-tab" data-cat="recent">🕒 Recent</button>
          </div>
          <div class="dua-cards-container" id="dua-cards"></div>
        </div>
      `,
      init: function() {
        const root = document.getElementById('dua-root');
        if (!root) return;

        const state = createState();
        const cardsContainer = root.querySelector('#dua-cards');
        const searchInput = root.querySelector('#dua-search');
        const darkToggle = root.querySelector('#dua-dark-toggle');
        const fontUp = root.querySelector('#dua-font-up');
        const fontDown = root.querySelector('#dua-font-down');
        const streakEl = root.querySelector('#dua-streak');
        const tabs = root.querySelectorAll('.dua-tab');

        // Apply initial settings
        function applyDark() {
          root.classList.toggle('dark-mode', state.darkMode);
          darkToggle.textContent = state.darkMode ? '☀️' : '🌓';
        }
        function applyFont() {
          root.style.setProperty('--arabic-size', `${state.fontSize}rem`);
        }
        applyDark();
        applyFont();

        // Streak update
        function updateStreak() {
          const last = localStorage.getItem('dua_last_visit');
          const today = new Date().toISOString().split('T')[0];
          let streak = parseInt(localStorage.getItem('dua_streak') || '0');
          if (last !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            streak = (last === yesterday) ? streak + 1 : 1;
            localStorage.setItem('dua_streak', streak);
            localStorage.setItem('dua_last_visit', today);
          }
          streakEl.textContent = `🔥 ${streak} day${streak > 1 ? 's' : ''}`;
        }
        updateStreak();

        // Render content
        function render() {
          const cat = state.activeCat;
          const search = state.searchQuery.trim().toLowerCase();
          let html = '';

          if (cat === 'hadith') {
            const daily = getDailyHadith();
            if (daily.length) {
              const [featured, ...others] = daily;
              html = `<div class="scroll-area"><div class="featured-card">${renderHadithCard(featured, true)}</div>`;
              if (others.length) {
                html += `<h3 style="margin:1rem 0 0.5rem; color:var(--text);">Today's Reminders</h3><div class="cards-grid">${others.map(h => renderHadithCard(h)).join('')}</div>`;
              }
              html += `</div>`;
            }
          } else if (cat === 'favorites') {
            const favItems = state.favorites.map(id => itemsDB.find(i => i.id === id) || hadithDB.find(h => h.id === id)).filter(Boolean);
            html = `<div class="scroll-area"><div class="cards-grid">${favItems.map(i => i.type === 'hadith' ? renderHadithCard(i) : renderItemCard(i, state)).join('')}</div></div>`;
          } else if (cat === 'recent') {
            const recItems = state.recentlyViewed.map(id => itemsDB.find(i => i.id === id) || hadithDB.find(h => h.id === id)).filter(Boolean);
            html = `<div class="scroll-area"><div class="cards-grid">${recItems.map(i => i.type === 'hadith' ? renderHadithCard(i) : renderItemCard(i, state)).join('')}</div></div>`;
          } else {
            let items = itemsDB.filter(i => i.category.includes(cat));
            if (search) {
              items = items.filter(i => i.arabic.includes(search) || i.transliteration.toLowerCase().includes(search) || i.translationEn.toLowerCase().includes(search));
            }
            html = `<div class="scroll-area"><div class="cards-grid">${items.map(i => renderItemCard(i, state)).join('')}</div></div>`;
          }
          cardsContainer.innerHTML = html;

          // Attach counter event listeners
          cardsContainer.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const id = btn.dataset.id;
              const action = btn.dataset.action;
              const max = parseInt(btn.dataset.max);
              let cur = state.progress[id] || max;
              if (action === 'dec' && cur > 0) { cur--; if (navigator.vibrate) navigator.vibrate(10); }
              else if (action === 'inc' && cur < max) { cur++; if (navigator.vibrate) navigator.vibrate(10); }
              else if (action === 'reset') { cur = max; }
              state.progress[id] = cur;
              if (cur <= 0) delete state.progress[id];
              localStorage.setItem('dua_progress', JSON.stringify(state.progress));
              const countEl = cardsContainer.querySelector(`#count-${id}`);
              if (countEl) countEl.textContent = cur;
            });
          });

          // Copy / speak / fav buttons
          cardsContainer.querySelectorAll('.copy-btn').forEach(b => {
            b.addEventListener('click', () => {
              navigator.clipboard.writeText(b.dataset.text).then(() => alert('Copied!'));
            });
          });
          cardsContainer.querySelectorAll('.speak-btn').forEach(b => {
            b.addEventListener('click', () => {
              if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(b.dataset.text);
                u.lang = 'ar';
                speechSynthesis.speak(u);
              }
            });
          });
          cardsContainer.querySelectorAll('.fav-btn').forEach(b => {
            b.addEventListener('click', () => {
              const id = b.dataset.id;
              const idx = state.favorites.indexOf(id);
              if (idx > -1) state.favorites.splice(idx, 1);
              else state.favorites.push(id);
              localStorage.setItem('dua_favs', JSON.stringify(state.favorites));
              b.textContent = state.favorites.includes(id) ? '⭐' : '☆';
            });
          });
        }

        // Helper render functions
        function renderItemCard(item, state) {
          const prog = state.progress[item.id] || item.repeat;
          const isFav = state.favorites.includes(item.id);
          return `
            <div class="dua-card" data-id="${item.id}">
              <div class="arabic-text" lang="ar">${item.arabic}</div>
              <div class="transliteration">🔤 ${item.transliteration}</div>
              <div class="translation">📖 ${item.translationEn}</div>
              ${item.explanationEn ? `<div class="explanation">💡 ${item.explanationEn}</div>` : ''}
              <div class="meta-row">
                <span>📚 ${item.source} | ${item.grade}</span>
                ${item.repeat > 1 ? `<span class="badge">× ${item.repeat}</span>` : ''}
              </div>
              ${item.repeat > 1 ? `
              <div class="counter-wrap">
                <button class="counter-btn" data-id="${item.id}" data-action="dec" data-max="${item.repeat}">−</button>
                <span id="count-${item.id}">${prog}</span>
                <button class="counter-btn" data-id="${item.id}" data-action="inc" data-max="${item.repeat}">+</button>
                <button class="counter-btn" data-id="${item.id}" data-action="reset" data-max="${item.repeat}">↺</button>
              </div>` : ''}
              <div class="card-actions">
                <button class="copy-btn" data-text="${escapeHtml(item.arabic)}">📋 Copy Arabic</button>
                <button class="speak-btn" data-text="${escapeHtml(item.arabic)}">🔊 Listen</button>
                <button class="fav-btn" data-id="${item.id}">${isFav ? '⭐' : '☆'}</button>
              </div>
            </div>`;
        }
        function renderHadithCard(h, featured=false) {
          const isFav = state.favorites.includes(h.id);
          return `
            <div class="hadith-card ${featured ? 'featured' : ''}">
              <div class="narrator" style="font-weight:700; margin-bottom:8px;">${h.narrator}</div>
              <div class="arabic-text" lang="ar">${h.arabic}</div>
              <div class="transliteration">🔤 ${h.transliteration}</div>
              <div class="translation">📖 ${h.translationEn}</div>
              ${h.explanationEn ? `<div class="explanation">💡 ${h.explanationEn}</div>` : ''}
              <div class="meta-row">📚 ${h.source} | ${h.grade}</div>
              <div class="card-actions">
                <button class="copy-btn" data-text="${escapeHtml(h.arabic)}">📋 Copy Arabic</button>
                <button class="speak-btn" data-text="${escapeHtml(h.arabic)}">🔊 Listen</button>
                <button class="fav-btn" data-id="${h.id}">${isFav ? '⭐' : '☆'}</button>
              </div>
            </div>`;
        }
        function escapeHtml(text) {
          return text.replace(/'/g, "\\'").replace(/`/g, "\\`");
        }

        // Event listeners
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.activeCat = tab.dataset.cat;
            state.searchQuery = '';
            searchInput.value = '';
            if (!['hadith','favorites','recent'].includes(state.activeCat)) {
              state.recentlyViewed = state.recentlyViewed.filter(c => c !== state.activeCat);
              state.recentlyViewed.unshift(state.activeCat);
              if (state.recentlyViewed.length > 15) state.recentlyViewed.pop();
              localStorage.setItem('dua_recent', JSON.stringify(state.recentlyViewed));
            }
            render();
          });
        });

        searchInput.addEventListener('input', () => {
          state.searchQuery = searchInput.value;
          render();
        });

        darkToggle.addEventListener('click', () => {
          state.darkMode = !state.darkMode;
          localStorage.setItem('dua_dark', state.darkMode);
          applyDark();
        });

        fontUp.addEventListener('click', () => {
          state.fontSize = Math.min(2.5, state.fontSize + 0.1);
          localStorage.setItem('dua_font_size', state.fontSize);
          applyFont();
        });
        fontDown.addEventListener('click', () => {
          state.fontSize = Math.max(0.9, state.fontSize - 0.1);
          localStorage.setItem('dua_font_size', state.fontSize);
          applyFont();
        });

        render();
      }
    };
  }

  return { buildDua };
})();

// Expose globally if needed
if (typeof window !== 'undefined') {
  window.buildDua = duaEnriched.buildDua;
}