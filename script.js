document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const inputSection = document.getElementById('input-section');
    const quizSection = document.getElementById('quiz-section');
    const eventInputsContainer = document.getElementById('event-inputs');
    const personalityInputsContainer = document.getElementById('personality-inputs');
    const addEntryButtons = document.querySelectorAll('.add-entry-btn');
    const startQuizButtons = document.querySelectorAll('.start-category-quiz-btn');
    const inputMessage = document.getElementById('input-message');

    const quizScoreDisplay = document.getElementById('quiz-score-display');
    const questionCountDisplay = document.getElementById('question-count-display');
    const totalQuestionsDisplay = document.getElementById('total-questions-display');
    const quizCategoryDisplay = document.getElementById('quiz-category-display');
    const quizQuestionDisplay = document.getElementById('quiz-question-display');
    const choiceButtonsContainer = document.getElementById('choice-buttons-container');
    const helpButton = document.getElementById('help-button');

    const quizFeedbackDisplay = document.getElementById('quiz-feedback-display');
    const correctAnswerDisplay = document.getElementById('correct-answer-display');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const backToInputBtn = document.getElementById('back-to-input-btn');

    // --- Game State Variables ---
    // These will store user-added flashcards if we enable user input saving/loading.
    // For now, they are just temporary holders for what's in the input fields.
    let eventsFlashcards = []; 
    let personalitiesFlashcards = []; 

    let currentQuizFlashcards = []; // The specific set of flashcards for the current quiz (based on sub-category)
    let currentQuizCategoryLabel = ''; // e.g., 'أحداث الحرب الباردة'
    let currentQuizSubCategoryKey = ''; // e.g., 'coldWarEvents'
    let currentMainCategoryKey = ''; // e.g., 'events' or 'personalities'

    let currentQuizIndex = 0;
    let quizScore = 0;
    let quizQuestions = [];
    let currentChoices = [];
    let helpUsedThisQuestion = false;

    // --- Default Data - Organized by Categories and Sub-categories ---
    const defaultData = {
        events: {
            coldWarEvents: [
                { term: 'اتفاقية بروتن وودز', definition: '22 جويلية 1944' },
                { term: 'مؤتمر يالطا', definition: 'من 4 الى 11 فيفري 1945' },
                { term: 'تفجير قنبلتين نوويتين على هايروشيما و نكازاكي', definition: '6  و  9 اوت   1945' },
                { term: 'تأسيس هيئة الامم المتحدة', definition: '24  اكتوبر 1945' },
                { term: 'مبدا ترومان', definition: '12 مارس 1947' },
                { term: 'مشروع مارشال', definition: '5 جوان 1947' },
                { term: 'مبدأ جدانوف', definition: '22 سبتمبر 1947' },
                { term: 'انشاء مكتب الكومنفورم', definition: '5/6اكنوبر  1947' },
                { term: 'تأسيس منظمة الكوميكون', definition: '25 جانفي 1949' },
                { term: 'تأسيس حلف الناتو(الاطلسي)', definition: '04 ─04 ─1949' },
                { term: 'تأسيس المانيا الغربية الاتحادية', definition: '8 ماي 1949' },
                { term: 'انتصار الثورة الشيوعية في الصين بقيادة ماوسي تونغ', definition: '1 اكتوبر 1949' },
                { term: 'تأسيس المانيا الشرقية الديمقراطية', definition: '7 اكتوبر 1949' },
                { term: 'وفاة جوزيف ستالين', definition: '5 مارس 1953' },
                { term: 'تأسيس حلف سياتو (جنوب شرق اسيا)', definition: '8 سبتمبر 1954' },
                { term: 'تأسيس حلف بغداد', definition: '24 فيفري 1955' },
                { term: 'مؤتمر باندونغ', definition: 'من 18 الى 24 افريل 1955' },
                { term: 'تأسيس حلف وارسو', definition: '14 ماي 1955' },
                { term: 'خروتشوف  يتبنى  التعايش  السلمي', definition: '14 فيفري 1956' },
                { term: 'حل مكتب الكومنفورم', definition: '17 افريل 1956' },
                { term: 'الاعلان عن مشروع ايزنهاور', definition: '5 جانفي 1957' },
                { term: 'زيارة خروتشوف لواشنطن', definition: 'من 15 الى 18  سبتمبر 1959' },
                { term: 'اول رحلة لإنسان  الى الفضاء (يوري غرغارين)', definition: '12 افريل 1961' },
                { term: 'بناء جدار برلين', definition: '13  اوت 1961' },
                { term: 'المؤتمر التأسيسي لحركة عدم الانحياز ببلغراد', definition: '1 / 6 سبتمبر 1961' },
                { term: 'انشاء الخط الهاتفي الاحمر بين موسكو و واشنطن', definition: '20 جوان 1963' },
                { term: 'اتفاقية الحد من الاسلحة الاستراتيجية  1 (سالت 01)', definition: 'من 22 الى 26 ماي 1972' },
                { term: 'المؤتمر الرابع لحركة عدم الانحياز بالجزائر', definition: 'من 5 الى 9  سبتمبر 1973' },
                { term: 'اتفاقية الحد من الاسلحة الاستراتيجية  2 (سالت 02)', definition: '18 جوان 1979' },
                { term: 'التدخل السوفياتي في افغانستان', definition: '27 ديسمبر 1979' },
                { term: 'وصول غورباتشوف لسدة الحكم في الا س', definition: '11 مارس 1985' },
                { term: 'تحطيم جدار برلين', definition: '9 نوفمبر 1989' },
                { term: 'مؤتر مالطا', definition: '03 و04 ديسمبر 1989' },
                { term: 'توحيد الالمانيتين', definition: '3 اكتوبر 1990' },
                { term: 'مؤتمر باريس', definition: 'من 19 الى 21 ديسمبر 1990' },
                { term: 'حل منظمة الكوميكون', definition: '28 جوان 1991' },
                { term: 'حل حلف وارسو', definition: '1 جويلية 1991' },
                { term: 'مؤتمر الما اتا  و ظهور مجموعة الدول المستقلة', definition: '21 ديسمبر 1991' },
                { term: 'استقالة غورباتشوف من رئاسة الاتحاد السوفياتي', definition: '25 ديسمبر 1991' }
            ],
            algerianRevolutionEvents: [
                { term: 'تأسيس اللجنة الثورية للوحدة والعمل', definition: '23 مارس  1954' },
                { term: 'اجتماع مجموعة 22', definition: '23 جوان 1954' },
                { term: 'اجتماع لجنة 6', definition: '23 اكتوبر 1954' },
                { term: 'مشروع جاك سوستال', definition: '15 فيفري 1955' },
                { term: 'اعلان حالة الطوارئ', definition: '1 افريل 1955' },
                { term: 'هجومات الشمال القسنطيني', definition: '20 اوت 1955' },
                { term: 'تاسيس الاتحاد العام للعمال الجزائريين', definition: '24 فيفري 1956' },
                { term: 'اضراب الطلبة الجزائريين', definition: '19 ماي 1956' },
                { term: 'اختطاف طائرة الزعماء الخمس', definition: '22 اكتوبر 1956' },
                { term: 'اضراب الثمانية ايام', definition: '28 جانفي – 4فيفري 1957' },
                { term: 'قصف ساقية سيدي يوسف', definition: '8 فيفري 1958' },
                { term: 'تأسيس الحكومة المؤقتة  الجزائرية', definition: '19 سبتمبر 1958' },
                { term: 'الاعلان عن مشروع قسنطينة', definition: '3 اكتوبر 1958' },
                { term: 'مشروع سلم الشجعان', definition: '23 اكتوبر 1958' },
                { term: 'قيام الجمهورية الفرنسية الخامسة', definition: '8 جانفي 1959' },
                { term: 'مشروع حق تقرير المصير', definition: '16 سبتمبر 1959' },
                { term: 'مفاوضات مولان', definition: '25 -30 جوان 1960' },
                { term: 'مظاهرات في بلكور الجزائر', definition: '11 ديسمبر 1960' },
                { term: 'مفاوضات لوزان', definition: '20 فيفري 1961' },
                { term: 'مظاهرات الجالية بباريس', definition: '17 اكتوبر 1961' },
                { term: 'مفاوضات ايفيان', definition: '7 -18 مارس 1962' },
                { term: 'التوقيع على اتفاقيات ايفيان', definition: '18 مارس 1962' },
                { term: 'وقف اطلاق النار', definition: '19 مارس 1962' },
                { term: 'انشاء الهيئة الؤقتة', definition: '29 مارس 1962' },
                { term: 'مؤتمر طرابلس', definition: '27 ماي -4 جوان 1962' },
                { term: 'استفتاء تقرير المصير', definition: '1 جويلية 1962' },
                { term: 'الاعلان عن نتائج الاستفتاء', definition: '2 جويلية 1962' },
                { term: 'الاعلان  عن الاستقلال', definition: '5 جويلية 1962' },
                { term: 'قيام ج ج د ش', definition: '25 سبتمبر 1962' },
                { term: 'انضمام الجزائر لهيئة الامم المتحدة', definition: '8 اكتوبر 1962' },
                { term: 'انقلاب بومدين على بن بلة –التصحيح الثوري', definition: '19 جوان 1965' },
                { term: 'مظاهرات شعبية', definition: '5 اكتوبر 1988' },
                { term: 'دستور التعددية الحزبية', definition: '23 فيفري 1989' }
            ],
            palestineEvents: [
                { term: 'الثورة الفلسطينية المسلحة', definition: '01/01/1965' },
                { term: 'إعلان قيام دولة فلسطين من الجزائر', definition: '15/11/1988' }
            ]
        },
        personalities: {
            coldWarPersonalities: [
                { term: 'فراكلين روزفلت', definition: 'هو رئيس امريكي قاد الو م ا للنصر في ح ع 2 وحضر مؤتمر يالطا 1945.' },
                { term: 'هاري ترومان', definition: 'هو رئيس امريكي امر بقصف هيروشيما وناكازاكي وحضر مؤتمر بوتسدام في صيف 1945.' },
                { term: 'دوايت ايزنهاور', definition: 'هو رئيس امريكي انتهج سياسة ملا الفراغ و صاحب مشروع ايزنهاور جانفي 1957.' },
                { term: 'جون كينيدي', definition: 'هو رئيس امريكي وقعت في عهدته ازمة كوبا 1962 اشتهر بوقوفه ضد التمييز العنصري.' },
                { term: 'ريتشارد نيكسون', definition: 'هو رئيس امريكي وقع على اتفاقية سالت (1) 1972 استقال بعد فضيحة وتر غايت.' },
                { term: 'جيمي كارتر', definition: 'هو رئيس امريكي وقع على اتفاقية سالت (2) 1979 واشرف على اتفاقية كام دايفد المشؤومة.' },
                { term: 'رونالد ريغن', definition: 'هو رئيس امريكي صاحب فكرة حرب النجوم و عرفت سياسته الخارجية بالتشدد.' },
                { term: 'جورج بوش الاب', definition: 'هو رئيس امريكي وقع على نهاية الحرب الباردة بمالطا 89 و تدخل عسكريا في العراق.' },
                { term: 'بيل كلينتون', definition: 'هو رئيس امريكي ساهم في اتفاقية السلام الفلسطينية الاسرائيلية بغزة واريحا سنة 1993.' },
                { term: 'جورج مارشال', definition: 'كاتب الدولة للخارجية الامريكية جنرال في الح ع 2 و صاحب مشروع مارشال 05/06/1947.' },
                { term: 'جوزيف ستالين', definition: 'رئيس سوفياتي قاد الا س في ح ع 2( 39-45) واشتهر بالتشدد وكرهه الشديد للغرب.' },
                { term: 'نيكتا خروتشوف', definition: 'رئيس سوفياتي صاحب مبادرة التعايش السلمي اول زعيم سوفيتي يزور و م ا 1959.' },
                { term: 'ليونيد بريجنيف', definition: 'رئيس سوفياتي وقع على سالت 1 (72)و2(79) وربيع براغ( 68)و غزو افغانستان(79).' },
                { term: 'ميخائيل غوربتشوف', definition: 'اخر رئيس سوفياتي مهندس البروسترويكا والغلاسنوست وقع نهاية الحرب الباردة 1989.' },
                { term: 'اندري جدانوف', definition: 'سياسي سوفيتي صاحب اطروحة الكتلتين (شرقية وغربية)و مبدا جدانوف 22/09/47.' },
                { term: 'مولوتوف', definition: 'وزير الخارجية السوفيتي ايام حكم ستالين ومؤسس منظمة الكوميكون 25/01/1949.' },
                { term: 'ونستن تشرشل', definition: 'رئيس الوزراء في بريطانيا لعهدتين صاحب مصطلح الستار الحديدي1946.' },
                { term: 'احمد سوكارنو', definition: 'رئيس اندونيسيا من ابرز زعماء العالم الثالث خلال النصف الثاني للقرن العشرين ساهم في تحرير بلده من الاستعمار الهولندي,شارك في مؤتمر باندونغ 1955 و يعد من مؤسسي حركة عدم الانحياز 1961ببلغراد.' },
                { term: 'جواهر لال نهرو', definition: 'رئيس الحكومة الهندية من ابرز زعماء العالم الثالث خلال النصف الثاني للقرن العشرين ساهم في تحرير بلده من الاستعمار البريطاني ,شارك في مؤتمر باندونغ 1955 و يعد من مؤسسي حركة عدم الانحياز 1961ببلغراد.' },
                { term: 'جوزيف بروز تيتو', definition: 'رئيس يوغسلافيا +## من ابرز زعماء العالم الثالث خلال النصف الثاني للقرن العشرين ساهم في تحرير بلده من الاستعمار النازي في الح ع 2, يعد من مؤسسي حركة عدم الانحياز 1961ببلغراد' },
                { term: 'جمال عبد الناصر', definition: 'زعيم مصري احد جماعة الضباط الاحرار المصرية 1952 امم قناة السويس 1956م من ابرز زعماء العالم الثالث خلال النصف الثاني للقرن العشرين,شارك في مؤتمر باندونغ 1955 و يعد من مؤسسي حركة عدم الانحياز 1961ببلغراد.' },
                { term: 'شي غيفارا', definition: 'طبيب أرجنتيني ،احد ابرز مناهضي الامبريالية و اشهر مناضلي الحركات التحررية الثورية في أمريكا اللاتينية قاد الثورة الكوبية إلى جانب كاسترو سنة 1959.' },
                { term: 'فدال كاسترو', definition: 'زعيم ورئيس كوبا الشيوعية بعد نجاح الثورة سنة 1959.عرفت فترة حكمه أزمة كوبا1963.احد ابرز رجالات الحركة التحررية بأمريكا اللاتينية و برز مناهضي الامبريالية في العالم.' },
                { term: 'هوشي منه', definition: 'سياسي فتنامي شيوعي، قائد الحركة التحررية في الهند الصينية.ضد اليابان ثم فرنسا ثم الو م ا من مؤسس الحزب الشيوعي الفيتنامي 1931. راس جمهورية الفيتنام الشمالية بعد استقلالها.' },
                { term: 'الجنرال جياب', definition: 'عسكري فيتنامي،قائد القوات الفيتنامية الشمالية في معركة ديان بيان فو ضد فرنسا 1954.' },
                { term: 'المهاتما غاندي', definition: 'أحد أكبر القادة السياسيين في القرن 20 ساهم في تحرير الهند من الاحتلال البريطاني سنة 1947 مهندس فلسفة اللاعنف.' },
                { term: 'تيودور هرتزل', definition: 'كبار الحركة الصهيونية ،ترأس مؤتمر بال 1897.صاحب فكرة إنشاء وطن قومي لليهود.' },
                { term: 'ياسر عرفات', definition: 'رئيس منظمة التحرير الفلسطينية وحركة فتح منذ1969، رئيس السلطة الفلسطينية في مناطق الحكم الذاتي سنة 1994.' }
            ],
            algerianRevolutionPersonalities: [
                { term: 'مصطفى بن بولعيد', definition: 'مناضل جزائري قائد المنطقة الاولى (الاوراس 1954) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'ديدوش مراد', definition: 'مناضل جزائري قائد المنطقة الثانية (الشمال القسنطيني 1954) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'كريم بلقاسم', definition: 'قائد المنطقة الثالثة( القبائل1954) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'رابح بيطاط', definition: 'قائد المنطقة الرابعة ( العاصمة 1954) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'العربي بن مهيدي', definition: 'قائد المنطقة الخامسة (وهران 1954) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'محمد بلوزداد', definition: 'مناضل جزائري توفي قبل اندلاع الثورة( 14/01/1952) انخرط في حزب الشعب (1937) . تراس المنظمة الخاصة (1947).' },
                { term: 'زيغود يوسف', definition: 'مناضل جزائري قائد هجومات الشمال القسنطيني( 20/08/1955) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'احمد بن بلة', definition: 'اول رئيس للجمهورية الجزائرية (63/65) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'محمد بوضياف', definition: 'من جماعة الستة تولى رئاسة الجمهورية الجزائرية (جانفي /جوان 1992) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'عبان ومضان', definition: 'مهندس مؤتمر الصومام (20/08/1956) انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'حسين ايت احمد', definition: 'رئيس الوفد الجزائري بمؤتمر باندونغ (18-24/04/1955) توفي 2015م انخرط في حزب الشعب (1937) . انضم للمنظمة الخاصة (1947) من مفجري الثورة (1954).' },
                { term: 'مصالي الحاج', definition: 'من زعماء الحركة الوطنية في الجزائر اسس جزب الشعب 1937 و حركة انتصار الحريات الديمقراطية 1946م وحزب الحركة الوطنية الجزائرية 1954.' },
                { term: 'فرحات عباس', definition: 'من رجالات الحركة الوطنية احد دعاة الادماج قبل الثورة انضم للثورة سنة 1956 و تراس اول حكومة جزائرية مؤقتة 19/09/1958م.' },
                { term: 'بن يوسف بن خدة', definition: 'عضو حزب الشعب و حركة انتصار الحريات الديمقراطية من المركزيين خلف فرحات عباس على رئاسة الحكومة المؤقتة الجزائرية 28/08/1961م.' },
                { term: 'هواري بومدين', definition: 'قائد اركان جيش التحرير الوطني سنة1960 ووزير الدفاع في حكومة الاستقلال 1962 ثم رئيس الجمهورية بعد جوان 1965 يعد من ابرز رجالات حركة عدم الانحياز خاصة بعد مؤتمر الجزائر 1973.' },
                { term: 'فرانسوا ميتران', definition: 'سياسي فرنسي تولى حقيبة وزارة الداخلية مع اندلاع الثورة في 01 نوفمبر 1954. ليصبح رئيس للجمهوريةالفرنسية سنة 1981م حاول القضاء على الثورة لكنه فشل.' },
                { term: 'بيار منداس فرانس', definition: 'رئيس الحكومة الفرنسية ابان اندلاع الثورة التحريرية حاول القضاء عليها لكنه فشل وسقطت حكومته في فيفري 1955.' },
                { term: 'غي مولي', definition: 'رئيس حكومة فرنسا من( 1956/1957.) حاول القضاء على الثورة التحريرية لكنه فشل.' },
                { term: 'جاك سوستال', definition: 'الحاكم العام الفرنسي في الجزائر 01/02/1955م عرف بمشروع سوستال 1955 ينص بتقديم مساعدات اغرائية لعزل الشعب عن الثورة لكنه فشل.' },
                { term: 'شارل ديغول', definition: 'محرر باريس من المانيا في الح ع 2 عاد منقذا للجمهورية سنة 1958 لينتخب كأول رئيس للجمهورية الفرنسية الخامسة 1959 /1969،.حاول القضاء على الثورة لكنه فشل.' }
            ]
        }
    };

    // Mapping for displaying sub-category names in the quiz info panel
    const subCategoryLabels = {
        coldWarEvents: 'أحداث الحرب الباردة',
        algerianRevolutionEvents: 'أحداث الثورة الجزائرية',
        palestineEvents: 'أحداث فلسطين',
        coldWarPersonalities: 'شخصيات الحرب الباردة',
        algerianRevolutionPersonalities: 'شخصيات الثورة الجزائرية'
    };

    // --- Utility Functions ---
    function showSection(sectionId) {
        inputSection.classList.add('hidden');
        quizSection.classList.add('hidden');
        document.getElementById(sectionId).classList.remove('hidden');
    }

    function updateInputMessage(message, type = '') {
        inputMessage.textContent = message;
        inputMessage.className = 'message';
        if (type) inputMessage.classList.add(type);
    }

    function updateQuizFeedback(message, type = '') {
        quizFeedbackDisplay.textContent = message;
        quizFeedbackDisplay.className = 'message';
        if (type) quizFeedbackDisplay.classList.add(type);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function normalizeText(text) {
        return text.toLowerCase().trim()
                   .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                   .replace(/\s+/g, ' ');
    }

    function isCloseEnough(userAnswer, correctAnswer) {
        const normalizedUser = normalizeText(userAnswer);
        const normalizedCorrect = normalizeText(correctAnswer);

        if (normalizedUser === normalizedCorrect) {
            return true;
        }
        if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > normalizedCorrect.length * 0.5) {
             return true;
        }
        if (normalizedUser.includes(normalizedCorrect) && normalizedCorrect.length > normalizedUser.length * 0.5) {
            return true;
        }
        return false;
    }

    // --- Input Section Logic ---
    function createFlashcardEntry(container, term = '', definition = '', category) {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('flashcard-entry');
        entryDiv.innerHTML = `
            <input type="text" class="term-input" placeholder="${category === 'events' ? 'اسم الحدث' : 'اسم الشخصية'}" value="${term}">
            <textarea class="definition-input" placeholder="${category === 'events' ? 'التاريخ/الوصف' : 'التعريف'}">${definition}</textarea>
            <button class="remove-entry-btn">X</button>
        `;
        container.appendChild(entryDiv);

        entryDiv.querySelector('.remove-entry-btn').addEventListener('click', () => {
            entryDiv.remove();
            checkCanStartQuizButtons();
        });

        entryDiv.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', checkCanStartQuizButtons);
        });

        checkCanStartQuizButtons();
    }

    function collectFlashcardsFromInputs(container) {
        const currentFlashcards = [];
        const entries = container.querySelectorAll('.flashcard-entry');
        let hasEmptyField = false;

        entries.forEach(entry => {
            const term = entry.querySelector('.term-input').value.trim();
            const definition = entry.querySelector('.definition-input').value.trim();

            if (term && definition) {
                currentFlashcards.push({ term, definition });
            } else if (term || definition) {
                hasEmptyField = true;
            }
        });
        return { data: currentFlashcards, hasEmptyField: hasEmptyField };
    }

    function checkCanStartQuizButtons() {
        // Here, we check if default data exists for each sub-category button
        startQuizButtons.forEach(button => {
            const category = button.dataset.category;
            const subCategory = button.dataset.subCategory;
            
            let dataForSubCategory = [];
            if (category === 'events') {
                dataForSubCategory = defaultData.events[subCategory] || [];
            } else if (category === 'personalities') {
                dataForSubCategory = defaultData.personalities[subCategory] || [];
            }
            button.disabled = dataForSubCategory.length === 0;
        });

        // This part would be for user-entered data quiz if implemented later
        const userEventsInput = collectFlashcardsFromInputs(eventInputsContainer).data;
        const userPersonalitiesInput = collectFlashcardsFromInputs(personalityInputsContainer).data;

        // Message for input section: Check if any default data exists, or if user has entered data.
        // If all default sub-categories are empty and user input is empty, show a message.
        let totalDefaultEvents = 0;
        for (const key in defaultData.events) {
            totalDefaultEvents += defaultData.events[key].length;
        }
        let totalDefaultPersonalities = 0;
        for (const key in defaultData.personalities) {
            totalDefaultPersonalities += defaultData.personalities[key].length;
        }

        if (userEventsInput.length === 0 && userPersonalitiesInput.length === 0 && 
            totalDefaultEvents === 0 && totalDefaultPersonalities === 0) {
             updateInputMessage('الرجاء إضافة بيانات كاملة في أحد الأقسام على الأقل.', 'error');
        } else {
            updateInputMessage('');
        }
    }


    // --- Quiz Section Logic ---
    function startQuiz(mainCategory, subCategory) {
        currentMainCategoryKey = mainCategory;
        currentQuizSubCategoryKey = subCategory;
        currentQuizCategoryLabel = subCategoryLabels[subCategory] || 'نوع غير معروف';

        // Get the specific flashcards for the selected sub-category from default data
        currentQuizFlashcards = defaultData[mainCategory][subCategory] || [];
        
        if (currentQuizFlashcards.length === 0) {
            updateInputMessage(`لا توجد بيانات متاحة لـ "${currentQuizCategoryLabel}". الرجاء إضافة بيانات أو اختيار فئة أخرى.`, 'error');
            showSection('input-section'); // Return to input section if no data
            return;
        }

        showSection('quiz-section');
        quizScore = 0;
        currentQuizIndex = 0;
        quizFeedbackDisplay.textContent = '';
        correctAnswerDisplay.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
        restartQuizBtn.classList.add('hidden');
        backToInputBtn.classList.add('hidden');
        helpButton.disabled = false; // Enable help button for new quiz

        quizCategoryDisplay.textContent = currentQuizCategoryLabel;

        quizQuestions = [];
        currentQuizFlashcards.forEach(card => {
            quizQuestions.push({ 
                type: 'termToDefinition', 
                question: card.term, 
                answer: card.definition, 
                questionPrompt: mainCategory === 'events' ? 'ما هو التاريخ/الوصف؟' : 'ما هو التعريف؟' 
            });
            quizQuestions.push({ 
                type: 'definitionToTerm', 
                question: card.definition, 
                answer: card.term, 
                questionPrompt: mainCategory === 'events' ? 'ما هو اسم الحدث؟' : 'ما هو اسم الشخصية؟' 
            });
        });
        quizQuestions = shuffleArray(quizQuestions);

        totalQuestionsDisplay.textContent = quizQuestions.length;
        askQuestion();
    }

    function askQuestion() {
        if (currentQuizIndex >= quizQuestions.length) {
            endQuiz();
            return;
        }

        const currentQ = quizQuestions[currentQuizIndex];
        questionCountDisplay.textContent = currentQuizIndex + 1;
        document.querySelector('.question-type').textContent = currentQ.questionPrompt;
        quizQuestionDisplay.textContent = currentQ.question;

        quizFeedbackDisplay.textContent = '';
        quizFeedbackDisplay.classList.remove('success', 'error');
        correctAnswerDisplay.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
        
        helpUsedThisQuestion = false;
        helpButton.disabled = false;
        generateChoices(currentQ.answer, currentQ.type); // Pass question type for intelligent distractors
    }

    function generateChoices(correctAnswer, questionType) {
        choiceButtonsContainer.innerHTML = '';
        currentChoices = [];

        let distractorsPool = [];
        if (questionType === 'termToDefinition') { // Question is Term, Answer is Definition (e.g., Personality Name -> Personality Definition)
            // Collect all definitions from the current main category
            distractorsPool = Object.values(defaultData[currentMainCategoryKey])
                                .flat()
                                .map(card => card.definition);
        } else { // Question is Definition, Answer is Term (e.g., Personality Definition -> Personality Name)
            // Collect all terms from the current main category
            distractorsPool = Object.values(defaultData[currentMainCategoryKey])
                                .flat()
                                .map(card => card.term);
        }
        
        const uniqueDistractors = [...new Set(distractorsPool)];

        let options = [correctAnswer];

        // Add 2 distractor answers
        while (options.length < 3) {
            const randomIndex = Math.floor(Math.random() * uniqueDistractors.length);
            const potentialDistractor = uniqueDistractors[randomIndex];

            // Ensure the distractor is not the correct answer and not already in options
            if (!isCloseEnough(potentialDistractor, correctAnswer) && !options.some(opt => isCloseEnough(opt, potentialDistractor))) {
                options.push(potentialDistractor);
            }
        }

        options = shuffleArray(options);

        options.forEach(choiceText => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choiceText;
            button.dataset.answer = choiceText;
            button.addEventListener('click', () => handleChoiceClick(button, choiceText, correctAnswer));
            choiceButtonsContainer.appendChild(button);
            currentChoices.push(button);
        });
    }

    function handleChoiceClick(clickedButton, selectedAnswer, correctAnswer) {
        currentChoices.forEach(btn => btn.disabled = true);
        helpButton.disabled = true;

        const isCorrect = isCloseEnough(selectedAnswer, correctAnswer);

        if (isCorrect) {
            quizScore++;
            updateQuizFeedback('صحيح!', 'success');
            clickedButton.classList.add('correct');
        } else {
            updateQuizFeedback('غير صحيح.', 'error');
            clickedButton.classList.add('incorrect');
            correctAnswerDisplay.textContent = `الإجابة الصحيحة: "${correctAnswer}"`;
            correctAnswerDisplay.classList.remove('hidden');
            currentChoices.forEach(btn => {
                if (isCloseEnough(btn.dataset.answer, correctAnswer)) {
                    btn.classList.add('correct');
                }
            });
        }

        quizScoreDisplay.textContent = quizScore;
        nextQuestionBtn.classList.remove('hidden');
        if (currentQuizIndex < quizQuestions.length - 1) {
            nextQuestionBtn.textContent = 'السؤال التالي';
        } else {
            nextQuestionBtn.textContent = 'إنهاء الاختبار';
        }
    }

    function useHelp() {
        if (helpUsedThisQuestion || currentChoices.length <= 1) {
            helpButton.disabled = true;
            return;
        }

        helpUsedThisQuestion = true;
        helpButton.disabled = true;

        const incorrectChoices = currentChoices.filter(btn =>
            !isCloseEnough(btn.dataset.answer, quizQuestions[currentQuizIndex].answer) && !btn.classList.contains('hidden')
        );

        if (incorrectChoices.length > 1) {
            const randomIndex = Math.floor(Math.random() * incorrectChoices.length);
            incorrectChoices[randomIndex].classList.add('hidden');
        } else if (incorrectChoices.length === 1) {
            incorrectChoices[0].classList.add('hidden');
        }
    }

    function nextQuestion() {
        currentQuizIndex++;
        askQuestion();
    }

    function endQuiz() {
        updateQuizFeedback(`اكتمل الاختبار! لقد حصلت على ${quizScore} من أصل ${quizQuestions.length}.`, 'success');
        correctAnswerDisplay.classList.add('hidden');
        helpButton.classList.add('hidden');
        choiceButtonsContainer.classList.add('hidden');

        nextQuestionBtn.classList.add('hidden');

        restartQuizBtn.classList.remove('hidden');
        backToInputBtn.classList.remove('hidden');
    }

    // --- Event Listeners ---
    addEntryButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const category = event.target.dataset.category;
            const container = category === 'events' ? eventInputsContainer : personalityInputsContainer;
            createFlashcardEntry(container, '', '', category);
        });
    });

    startQuizButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const category = event.target.dataset.category;
            const subCategory = event.target.dataset.subCategory; // Get the specific sub-category
            startQuiz(category, subCategory); // Pass both main and sub-category
        });
    });

    nextQuestionBtn.addEventListener('click', nextQuestion);
    // Restart uses the last selected sub-category
    restartQuizBtn.addEventListener('click', () => startQuiz(currentMainCategoryKey, currentQuizSubCategoryKey));
    backToInputBtn.addEventListener('click', () => {
        showSection('input-section');
        updateInputMessage('');
        checkCanStartQuizButtons();
        quizScoreDisplay.textContent = '0';
        questionCountDisplay.textContent = '0';
        totalQuestionsDisplay.textContent = '0';
        quizCategoryDisplay.textContent = '';
    });

    helpButton.addEventListener('click', useHelp);

    // Initial setup
    function loadDefaultFlashcardsToInputs() {
        eventInputsContainer.innerHTML = '';
        personalityInputsContainer.innerHTML = '';

        // Load all default events into the main events input container
        for (const key in defaultData.events) {
            defaultData.events[key].forEach(card => {
                createFlashcardEntry(eventInputsContainer, card.term, card.definition, 'events');
            });
        }
        // Load all default personalities into the main personalities input container
        for (const key in defaultData.personalities) {
            defaultData.personalities[key].forEach(card => {
                createFlashcardEntry(personalityInputsContainer, card.term, card.definition, 'personalities');
            });
        }
    }

    loadDefaultFlashcardsToInputs(); // Load default data on page load
    checkCanStartQuizButtons(); // Check initial state of quiz buttons
    showSection('input-section'); // Show input section on load
});