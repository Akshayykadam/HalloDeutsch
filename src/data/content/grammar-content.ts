
import { CEFRLevel } from '../../types';

export interface GrammarTopic {
    id: string;
    title: string;
    titleDe: string;
    description: string;
    level: CEFRLevel;
    lessons: number;
    completedLessons: number;
    examples: Array<{ german: string; english: string }>;
}

export const grammarTopics: GrammarTopic[] = [
    // A1 Topics
    {
        id: 'a1-articles',
        title: 'Articles (der, die, das)',
        titleDe: 'Artikel',
        description: 'Learn the three genders in German and when to use each article. German nouns are either masculine (der), feminine (die), or neuter (das).',
        level: 'A1',
        lessons: 5,
        completedLessons: 3,
        examples: [
            { german: 'der Mann', english: 'the man (masculine)' },
            { german: 'die Frau', english: 'the woman (feminine)' },
            { german: 'das Kind', english: 'the child (neuter)' },
            { german: 'der Apfel', english: 'the apple (masculine)' },
            { german: 'die Sonne', english: 'the sun (feminine)' },
            { german: 'das Haus', english: 'the house (neuter)' },
            { german: 'der Hund', english: 'the dog (masculine)' },
            { german: 'die Katze', english: 'the cat (feminine)' },
            { german: 'das Buch', english: 'the book (neuter)' },
        ],
    },
    {
        id: 'a1-present-tense',
        title: 'Present Tense',
        titleDe: 'Präsens',
        description: 'Conjugate verbs in present tense for all persons. Regular verbs follow a predictable pattern.',
        level: 'A1',
        lessons: 6,
        completedLessons: 2,
        examples: [
            { german: 'Ich lerne Deutsch.', english: 'I am learning German.' },
            { german: 'Er spricht gut.', english: 'He speaks well.' },
            { german: 'Wir gehen nach Hause.', english: 'We are going home.' },
            { german: 'Sie trinkt Wasser.', english: 'She is drinking water.' },
            { german: 'Du wohnst in Berlin.', english: 'You live in Berlin.' },
            { german: 'Ihr spielt Fußball.', english: 'You (plural) are playing soccer.' },
            { german: 'Das Kind schläft.', english: 'The child is sleeping.' },
        ],
    },
    {
        id: 'a1-negation',
        title: 'Negation (nicht/kein)',
        titleDe: 'Verneinung',
        description: 'Learn how to make negative sentences in German using "nicht" (not) and "kein" (no/none).',
        level: 'A1',
        lessons: 3,
        completedLessons: 0,
        examples: [
            { german: 'Ich habe kein Auto.', english: "I don't have a car." },
            { german: 'Das ist nicht richtig.', english: "That's not correct." },
            { german: 'Er kommt nicht.', english: 'He is not coming.' },
            { german: 'Wir essen kein Fleisch.', english: 'We allow no meat / do not eat meat.' },
            { german: 'Das Wasser ist nicht kalt.', english: 'The water is not cold.' },
            { german: 'Ich habe keine Zeit.', english: 'I have no time.' },
            { german: 'Sie ist nicht müde.', english: 'She is not tired.' },
        ],
    },
    {
        id: 'a1-sentence-structure',
        title: 'Sentence Structure',
        titleDe: 'Satzbau',
        description: 'Basic German word order in statements and questions. The verb is usually in the second position.',
        level: 'A1',
        lessons: 4,
        completedLessons: 0,
        examples: [
            { german: 'Ich gehe heute ins Kino.', english: "I'm going to the cinema today." },
            { german: 'Gehst du heute ins Kino?', english: 'Are you going to the cinema today?' },
            { german: 'Wir lernen Deutsch in der Schule.', english: 'We learn German at school.' },
            { german: 'Wo wohnst du?', english: 'Where do you live?' },
            { german: 'Er spielt heute Fußball.', english: 'He is playing soccer today.' },
            { german: 'Wann kommt der Bus?', english: 'When is the bus coming?' },
            { german: 'Sie trinkt morgens Kaffee.', english: 'She drinks coffee in the morning.' },
            { german: 'Der Zug fährt schnell.', english: 'The train goes fast.' },
            { german: 'Meine Mutter kocht gern.', english: 'My mother likes to cook.' },
            { german: 'Wir spielen am Sonntag Tennis.', english: 'We play tennis on Sunday.' },
            { german: 'Der Lehrer hilft den Schülern.', english: 'The teacher helps the students.' },
            { german: 'Ich kaufe Brot im Supermarkt.', english: 'I buy bread at the supermarket.' },
            { german: 'Hast du Geschwister?', english: 'Do you have siblings?' },
            { german: 'Der Junge liest ein Buch.', english: 'The boy reads a book.' },
            { german: 'Wir besuchen Oma am Wochenende.', english: 'We visit grandma on the weekend.' },
            { german: 'Das Mädchen singt ein Lied.', english: 'The girl sings a song.' },
            { german: 'Ich stehe um sieben Uhr auf.', english: 'I get up at seven o\'clock.' },
            { german: 'Er arbeitet in einer Bank.', english: 'He works in a bank.' },
            { german: 'Sie lernen Deutsch online.', english: 'They learn German online.' },
            { german: 'Das Wetter ist heute schön.', english: 'The weather is beautiful today.' },
            { german: 'Mein Vater liest die Zeitung.', english: 'My father reads the newspaper.' },
            { german: 'Ich trinke keinen Alkohol.', english: 'I don\'t drink alcohol.' },
            { german: 'Wir fahren im Sommer nach Italien.', english: 'We drive to Italy in the summer.' },
            { german: 'Er isst gern Pizza.', english: 'He likes eating pizza.' },
        ],
    },
    {
        id: 'a1-m5-review',
        title: 'Module 5 Review',
        titleDe: 'Modul 5 Wiederholung',
        description: 'Review of regular verbs, stem-changing verbs, and sentence structure.',
        level: 'A1',
        lessons: 1,
        completedLessons: 0,
        examples: [
            { german: 'Ich mache meine Hausaufgaben.', english: 'I am doing my homework.' },
            { german: 'Du fährst nach Berlin.', english: 'You drive to Berlin.' },
            { german: 'Er liest ein Buch.', english: 'He reads a book.' },
            { german: 'Wir spielen Fußball.', english: 'We play soccer.' },
            { german: 'Ihr lernt Deutsch.', english: 'You (all) learn German.' },
            { german: 'Sie schlafen lange.', english: 'They sleep for a long time.' },
            { german: 'Heute koche ich.', english: 'Today I am cooking.' },
            { german: 'Sprichst du Englisch?', english: 'Do you speak English?' },
            { german: 'Ich esse gern Pizza.', english: 'I like eating pizza.' },
            { german: 'Er sieht fern.', english: 'He watches TV.' },
            { german: 'Wir gehen ins Kino.', english: 'We are going to the cinema.' },
            { german: 'Wann kommst du?', english: 'When are you coming?' },
            { german: 'Das Mädchen läuft schnell.', english: 'The girl runs fast.' },
            { german: 'Ich trinke Wasser.', english: 'I drink water.' },
            { german: 'Arbeitest du heute?', english: 'Are you working today?' },
        ],
    },
    // A2 Topics
    {
        id: 'a2-perfekt',
        title: 'Perfect Tense (Perfekt)',
        titleDe: 'Perfekt',
        description: 'Talk about past events using haben/sein + past participle.',
        level: 'A2',
        lessons: 8,
        completedLessons: 0,
        examples: [
            { german: 'Ich habe gegessen.', english: 'I have eaten.' },
            { german: 'Sie ist gefahren.', english: 'She has driven/gone.' },
        ],
    },
    {
        id: 'a2-dative',
        title: 'Dative Case',
        titleDe: 'Dativ',
        description: 'Learn the dative case for indirect objects.',
        level: 'A2',
        lessons: 6,
        completedLessons: 0,
        examples: [
            { german: 'Ich gebe dem Mann das Buch.', english: 'I give the man the book.' },
            { german: 'Sie hilft der Frau.', english: 'She helps the woman.' },
        ],
    },
    {
        id: 'a2-modal-verbs',
        title: 'Modal Verbs',
        titleDe: 'Modalverben',
        description: 'können, müssen, wollen, dürfen, sollen, mögen.',
        level: 'A2',
        lessons: 6,
        completedLessons: 0,
        examples: [
            { german: 'Ich kann schwimmen.', english: 'I can swim.' },
            { german: 'Du musst arbeiten.', english: 'You must work.' },
        ],
    },
    // B1 Topics
    {
        id: 'b1-konjunktiv-ii',
        title: 'Subjunctive II (Konjunktiv II)',
        titleDe: 'Konjunktiv II',
        description: 'Express wishes, hypothetical situations, and polite requests.',
        level: 'B1',
        lessons: 7,
        completedLessons: 0,
        examples: [
            { german: 'Ich würde gern helfen.', english: 'I would like to help.' },
            { german: 'Wenn ich reich wäre...', english: 'If I were rich...' },
        ],
    },
    {
        id: 'b1-passive',
        title: 'Passive Voice',
        titleDe: 'Passiv',
        description: 'Form and use passive constructions.',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Das Auto wird repariert.', english: 'The car is being repaired.' },
            { german: 'Der Brief wurde geschrieben.', english: 'The letter was written.' },
        ],
    },

    // ============================================
    // A2 Topics
    // ============================================
    {
        id: 'a2-perfekt',
        title: 'Introduction to Perfekt',
        titleDe: 'Einführung ins Perfekt',
        description: 'Learn the German past tense (Perfekt) - the most common way to talk about past events in spoken German.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Ich habe gestern Deutsch gelernt.', english: 'I learned German yesterday.' },
            { german: 'Er hat das Buch gelesen.', english: 'He read the book.' },
            { german: 'Wir haben Pizza gegessen.', english: 'We ate pizza.' },
            { german: 'Sie hat einen Brief geschrieben.', english: 'She wrote a letter.' },
            { german: 'Ich bin nach Berlin gefahren.', english: 'I went to Berlin.' },
            { german: 'Er ist um 8 Uhr aufgestanden.', english: 'He got up at 8 o\'clock.' },
            { german: 'Wir haben Fußball gespielt.', english: 'We played soccer.' },
            { german: 'Sie hat ihr Zimmer aufgeräumt.', english: 'She cleaned her room.' },
            { german: 'Ich habe den Film gesehen.', english: 'I watched the movie.' },
            { german: 'Er ist nach Hause gegangen.', english: 'He went home.' },
        ],
    },
    {
        id: 'a2-haben-sein',
        title: 'Haben vs. Sein',
        titleDe: 'Haben oder Sein',
        description: 'Learn which auxiliary verb to use - haben or sein - when forming the Perfekt tense.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Ich habe gegessen.', english: 'I ate. (haben + most verbs)' },
            { german: 'Ich bin gegangen.', english: 'I went. (sein + movement)' },
            { german: 'Er hat gearbeitet.', english: 'He worked.' },
            { german: 'Sie ist gelaufen.', english: 'She ran.' },
            { german: 'Wir haben gekauft.', english: 'We bought.' },
            { german: 'Er ist geflogen.', english: 'He flew.' },
            { german: 'Sie hat geschlafen.', english: 'She slept.' },
            { german: 'Ich bin aufgewacht.', english: 'I woke up. (sein + change of state)' },
            { german: 'Du hast telefoniert.', english: 'You called.' },
            { german: 'Sie ist eingeschlafen.', english: 'She fell asleep.' },
        ],
    },
    {
        id: 'a2-modal-verbs',
        title: 'Modal Verbs',
        titleDe: 'Modalverben',
        description: 'Express ability, permission, obligation, and wishes with German modal verbs.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Ich kann schwimmen.', english: 'I can swim.' },
            { german: 'Du musst arbeiten.', english: 'You must work.' },
            { german: 'Er will nach Hause gehen.', english: 'He wants to go home.' },
            { german: 'Sie möchte ein Eis.', english: 'She would like an ice cream.' },
            { german: 'Wir dürfen hier parken.', english: 'We are allowed to park here.' },
            { german: 'Ihr sollt mehr lernen.', english: 'You should study more.' },
            { german: 'Kannst du mir helfen?', english: 'Can you help me?' },
            { german: 'Ich muss zum Arzt gehen.', english: 'I have to go to the doctor.' },
            { german: 'Sie will Ärztin werden.', english: 'She wants to become a doctor.' },
            { german: 'Darf ich rauchen?', english: 'May I smoke?' },
        ],
    },
    {
        id: 'a2-dative',
        title: 'Dative Case',
        titleDe: 'Der Dativ',
        description: 'Master the dative case for indirect objects, certain prepositions, and verbs.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Ich gebe dir das Buch.', english: 'I give you the book.' },
            { german: 'Er hilft dem Mann.', english: 'He helps the man.' },
            { german: 'Sie dankt der Frau.', english: 'She thanks the woman.' },
            { german: 'Das Buch gehört mir.', english: 'The book belongs to me.' },
            { german: 'Ich komme aus Deutschland.', english: 'I come from Germany.' },
            { german: 'Er wohnt bei seiner Mutter.', english: 'He lives with his mother.' },
            { german: 'Wir fahren mit dem Zug.', english: 'We travel by train.' },
            { german: 'Nach dem Essen gehen wir.', english: 'After the meal we go.' },
            { german: 'Seit einem Jahr lerne ich.', english: 'For one year I have been learning.' },
            { german: 'Zu meinem Geburtstag komme.', english: 'Come to my birthday.' },
        ],
    },
    {
        id: 'a2-comparative',
        title: 'Comparatives & Superlatives',
        titleDe: 'Komparativ und Superlativ',
        description: 'Compare things and express preferences using comparative and superlative forms.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Er ist größer als ich.', english: 'He is taller than me.' },
            { german: 'Sie ist am schnellsten.', english: 'She is the fastest.' },
            { german: 'Das ist besser.', english: 'That is better.' },
            { german: 'Er ist der beste Spieler.', english: 'He is the best player.' },
            { german: 'Dieses Auto ist teurer.', english: 'This car is more expensive.' },
            { german: 'Das Essen ist am leckersten.', english: 'The food is the most delicious.' },
            { german: 'Sie ist so alt wie ich.', english: 'She is as old as me.' },
            { german: 'Er läuft schneller.', english: 'He runs faster.' },
            { german: 'Das ist die schönste Stadt.', english: 'That is the most beautiful city.' },
            { german: 'Ich habe mehr Zeit als du.', english: 'I have more time than you.' },
        ],
    },
    {
        id: 'a2-subordinate',
        title: 'Subordinate Clauses',
        titleDe: 'Nebensätze',
        description: 'Build complex sentences with subordinating conjunctions like weil, dass, wenn.',
        level: 'A2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Ich bleibe zu Hause, weil ich krank bin.', english: 'I stay home because I am sick.' },
            { german: 'Er sagt, dass er kommt.', english: 'He says that he is coming.' },
            { german: 'Wenn es regnet, bleibe ich drinnen.', english: 'If it rains, I stay inside.' },
            { german: 'Obwohl er müde ist, arbeitet er.', english: 'Although he is tired, he works.' },
            { german: 'Ich weiß, dass du Recht hast.', english: 'I know that you are right.' },
            { german: 'Falls du Zeit hast, ruf mich an.', english: 'If you have time, call me.' },
            { german: 'Während ich esse, lese ich.', english: 'While I eat, I read.' },
            { german: 'Ich freue mich, dass du da bist.', english: 'I am happy that you are here.' },
            { german: 'Weil er spät kam, verpasste er den Zug.', english: 'Because he came late, he missed the train.' },
            { german: 'Wenn ich Zeit habe, besuche ich dich.', english: 'When I have time, I will visit you.' },
        ],
    },

    // ============================================
    // B1 Topics
    // ============================================
    {
        id: 'b1-relative-clauses',
        title: 'Relative Clauses',
        titleDe: 'Relativsätze',
        description: 'Add detail to your sentences using relative pronouns (der, die, das, etc.).',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Der Mann, der dort steht, ist mein Vater.', english: 'The man who is standing there is my father.' },
            { german: 'Das Buch, das ich lese, ist spannend.', english: 'The book that I am reading is exciting.' },
            { german: 'Die Frau, die mir geholfen hat, war nett.', english: 'The woman who helped me was nice.' },
            { german: 'Das Haus, in dem ich wohne, ist alt.', english: 'The house in which I live is old.' },
            { german: 'Der Film, den wir gesehen haben, war gut.', english: 'The movie that we saw was good.' },
            { german: 'Die Kinder, denen ich helfe, sind fleißig.', english: 'The children whom I help are hardworking.' },
            { german: 'Das Restaurant, dessen Essen gut ist, ist teuer.', english: 'The restaurant whose food is good is expensive.' },
            { german: 'Die Stadt, in der ich geboren bin, ist klein.', english: 'The city in which I was born is small.' },
            { german: 'Der Lehrer, mit dem ich spreche, ist streng.', english: 'The teacher with whom I speak is strict.' },
            { german: 'Das Geschenk, das du mir gegeben hast, gefällt mir.', english: 'The gift that you gave me pleases me.' },
        ],
    },
    {
        id: 'b1-konjunktiv2',
        title: 'Konjunktiv II',
        titleDe: 'Konjunktiv II',
        description: 'Express hypotheticals, wishes, and polite requests using the subjunctive mood.',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Wenn ich reich wäre, würde ich reisen.', english: 'If I were rich, I would travel.' },
            { german: 'Ich würde gern kommen.', english: 'I would like to come.' },
            { german: 'Hätten Sie Zeit?', english: 'Would you have time?' },
            { german: 'Könnten Sie mir helfen?', english: 'Could you help me?' },
            { german: 'Ich wäre gern Arzt.', english: 'I would like to be a doctor.' },
            { german: 'Wenn ich Zeit hätte, würde ich lernen.', english: 'If I had time, I would study.' },
            { german: 'Er müsste mehr arbeiten.', english: 'He should work more.' },
            { german: 'Wir könnten ins Kino gehen.', english: 'We could go to the cinema.' },
            { german: 'Ich wünschte, ich wäre jünger.', english: 'I wish I were younger.' },
            { german: 'Das wäre sehr nett.', english: 'That would be very nice.' },
        ],
    },
    {
        id: 'b1-passive',
        title: 'Passive Voice',
        titleDe: 'Passiv',
        description: 'Understand and form passive constructions in German using werden + past participle.',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Das Haus wird gebaut.', english: 'The house is being built.' },
            { german: 'Das Buch wurde gelesen.', english: 'The book was read.' },
            { german: 'Die Arbeit ist erledigt worden.', english: 'The work has been completed.' },
            { german: 'Das Auto wird repariert.', english: 'The car is being repaired.' },
            { german: 'Die Briefe werden geschrieben.', english: 'The letters are being written.' },
            { german: 'Das Gebäude wurde 1990 gebaut.', english: 'The building was built in 1990.' },
            { german: 'Das muss gemacht werden.', english: 'That must be done.' },
            { german: 'Es kann nicht geändert werden.', english: 'It cannot be changed.' },
            { german: 'Der Kuchen wird gebacken.', english: 'The cake is being baked.' },
            { german: 'Die Tür wird geöffnet.', english: 'The door is being opened.' },
        ],
    },
    {
        id: 'b1-prepositions',
        title: 'Complex Prepositions',
        titleDe: 'Komplexe Präpositionen',
        description: 'Master genitive prepositions and verb+preposition combinations.',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Wegen des Wetters bleibe ich zu Hause.', english: 'Because of the weather I stay home.' },
            { german: 'Während der Ferien fahre ich weg.', english: 'During the holidays I go away.' },
            { german: 'Trotz des Regens gehen wir spazieren.', english: 'Despite the rain we go for a walk.' },
            { german: 'Ich warte auf den Bus.', english: 'I am waiting for the bus.' },
            { german: 'Sie freut sich auf die Party.', english: 'She is looking forward to the party.' },
            { german: 'Er denkt an seine Familie.', english: 'He thinks about his family.' },
            { german: 'Wir sprechen über das Problem.', english: 'We talk about the problem.' },
            { german: 'Ich interessiere mich für Musik.', english: 'I am interested in music.' },
            { german: 'Worauf wartest du?', english: 'What are you waiting for?' },
            { german: 'Darauf freue ich mich.', english: 'I am looking forward to that.' },
        ],
    },
    {
        id: 'b1-indirect-speech',
        title: 'Indirect Speech',
        titleDe: 'Indirekte Rede',
        description: 'Report what others said using indirect speech constructions.',
        level: 'B1',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Er sagt, dass er kommt.', english: 'He says that he is coming.' },
            { german: 'Sie meinte, sie sei müde.', english: 'She said she was tired.' },
            { german: 'Er fragte, ob ich komme.', english: 'He asked if I was coming.' },
            { german: 'Sie wollte wissen, wann wir ankommen.', english: 'She wanted to know when we arrive.' },
            { german: 'Er bat mich, ihm zu helfen.', english: 'He asked me to help him.' },
            { german: 'Sie sagte, ich solle warten.', english: 'She said I should wait.' },
            { german: 'Er erklärte, dass er es nicht wusste.', english: 'He explained that he did not know.' },
            { german: 'Sie behauptete, sie habe es gesehen.', english: 'She claimed she had seen it.' },
            { german: 'Er meinte, er könne nicht kommen.', english: 'He said he could not come.' },
            { german: 'Sie fragte, was ich mache.', english: 'She asked what I was doing.' },
        ],
    },

    // ============================================
    // B2 Topics
    // ============================================
    {
        id: 'b2-konjunktiv1',
        title: 'Konjunktiv I',
        titleDe: 'Konjunktiv I',
        description: 'Master formal indirect speech for journalism and academic writing.',
        level: 'B2',
        lessons: 4,
        completedLessons: 0,
        examples: [
            { german: 'Er sagte, er sei krank.', english: 'He said he was sick.' },
            { german: 'Die Ministerin erklärte, es gebe keine Probleme.', english: 'The minister explained there were no problems.' },
            { german: 'Man sagt, sie sei die Beste.', english: 'They say she is the best.' },
            { german: 'Er behaupte, er habe es nicht getan.', english: 'He claims he did not do it.' },
            { german: 'Sie betonte, die Lösung sei einfach.', english: 'She emphasized the solution was simple.' },
            { german: 'Der Sprecher sagte, sie hätten gewonnen.', english: 'The speaker said they had won.' },
            { german: 'Er meinte, er könne es erklären.', english: 'He said he could explain it.' },
            { german: 'Die Zeitung berichtet, der Präsident sei verreist.', english: 'The newspaper reports the president has traveled.' },
            { german: 'Man nimmt an, das Problem werde gelöst.', english: 'It is assumed the problem will be solved.' },
            { german: 'Er versicherte, er werde kommen.', english: 'He assured he would come.' },
        ],
    },
    {
        id: 'b2-advanced-passive',
        title: 'Advanced Passive',
        titleDe: 'Erweitertes Passiv',
        description: 'Explore passive alternatives and advanced constructions.',
        level: 'B2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Das Fenster ist geöffnet.', english: 'The window is open. (state passive)' },
            { german: 'Man sagt, dass...', english: 'It is said that... (man alternative)' },
            { german: 'Das lässt sich machen.', english: 'That can be done.' },
            { german: 'Das Problem lässt sich lösen.', english: 'The problem can be solved.' },
            { german: 'Das ist zu beachten.', english: 'That is to be noted.' },
            { german: 'Die Arbeit ist bis morgen abzugeben.', english: 'The work is to be submitted by tomorrow.' },
            { german: 'Hier spricht man Deutsch.', english: 'German is spoken here.' },
            { german: 'Das Buch liest sich leicht.', english: 'The book reads easily.' },
            { german: 'Es wurde viel gelacht.', english: 'There was a lot of laughing.' },
            { german: 'Das versteht sich von selbst.', english: 'That goes without saying.' },
        ],
    },
    {
        id: 'b2-nominalization',
        title: 'Nominalization',
        titleDe: 'Nominalisierung',
        description: 'Transform verbs and adjectives into nouns for formal academic style.',
        level: 'B2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Das Lesen macht mir Spaß.', english: 'Reading is fun for me.' },
            { german: 'Die Entwicklung ist wichtig.', english: 'The development is important.' },
            { german: 'Die Schönheit der Natur.', english: 'The beauty of nature.' },
            { german: 'Die Möglichkeit besteht.', english: 'The possibility exists.' },
            { german: 'Die Verbesserung ist nötig.', english: 'The improvement is necessary.' },
            { german: 'Bei der Ankunft des Zuges...', english: 'Upon arrival of the train...' },
            { german: 'Eine Entscheidung treffen.', english: 'To make a decision.' },
            { german: 'In Frage stellen.', english: 'To call into question.' },
            { german: 'Kritik üben.', english: 'To exercise criticism.' },
            { german: 'Zur Diskussion stehen.', english: 'To be up for discussion.' },
        ],
    },
    {
        id: 'b2-professional',
        title: 'Professional German',
        titleDe: 'Berufssprache',
        description: 'Communicate effectively in German professional environments.',
        level: 'B2',
        lessons: 5,
        completedLessons: 0,
        examples: [
            { german: 'Sehr geehrte Damen und Herren', english: 'Dear Sir or Madam' },
            { german: 'Mit freundlichen Grüßen', english: 'With kind regards' },
            { german: 'Ich beziehe mich auf Ihr Schreiben.', english: 'I refer to your letter.' },
            { german: 'Ich möchte Ihnen mitteilen...', english: 'I would like to inform you...' },
            { german: 'Darf ich einen anderen Vorschlag machen?', english: 'May I make another suggestion?' },
            { german: 'Ich sehe das anders.', english: 'I see it differently.' },
            { german: 'Zusammenfassend lässt sich sagen...', english: 'In summary, it can be said...' },
            { german: 'Wir möchten Sie zu einem Vorstellungsgespräch einladen.', english: 'We would like to invite you for an interview.' },
            { german: 'Könnten Sie mir weitere Informationen geben?', english: 'Could you give me more information?' },
            { german: 'Vielen Dank für Ihre Anfrage.', english: 'Thank you for your inquiry.' },
        ],
    },
];

// Helper to find topic by lesson content matching (fuzzy logic or mapping)
export const getGrammarTopicForLesson = (lessonTitle: string): GrammarTopic | undefined => {
    const title = lessonTitle.toLowerCase();

    // A1 matches
    if (title.includes('article')) return grammarTopics.find(t => t.id === 'a1-articles');
    if (title.includes('structure') || title.includes('question')) return grammarTopics.find(t => t.id === 'a1-sentence-structure');
    if (title.includes('negation') || title.includes('nicht') || title.includes('kein')) return grammarTopics.find(t => t.id === 'a1-negation');
    if (title.includes('review') || title.includes('wiederholung')) return grammarTopics.find(t => t.id === 'a1-m5-review');

    // A2 matches
    if (title.includes('perfekt') || title.includes('past tense')) return grammarTopics.find(t => t.id === 'a2-perfekt');
    if (title.includes('haben vs') || title.includes('haben oder')) return grammarTopics.find(t => t.id === 'a2-haben-sein');
    if (title.includes('modal')) return grammarTopics.find(t => t.id === 'a2-modal-verbs');
    if (title.includes('dativ') || title.includes('dative')) return grammarTopics.find(t => t.id === 'a2-dative');
    if (title.includes('comparative') || title.includes('superlative') || title.includes('komparativ')) return grammarTopics.find(t => t.id === 'a2-comparative');
    if (title.includes('subordinate') || title.includes('nebensatz') || title.includes('weil') || title.includes('dass')) return grammarTopics.find(t => t.id === 'a2-subordinate');
    if (title.includes('participle') || title.includes('partizip')) return grammarTopics.find(t => t.id === 'a2-perfekt');

    // B1 matches
    if (title.includes('relative') || title.includes('relativsatz')) return grammarTopics.find(t => t.id === 'b1-relative-clauses');
    if (title.includes('konjunktiv ii') || title.includes('würde') || title.includes('subjunctive')) return grammarTopics.find(t => t.id === 'b1-konjunktiv2');
    if (title.includes('passive') || title.includes('passiv')) return grammarTopics.find(t => t.id === 'b1-passive');
    if (title.includes('preposition') || title.includes('präposition') || title.includes('genitive')) return grammarTopics.find(t => t.id === 'b1-prepositions');
    if (title.includes('indirect') || title.includes('indirekte rede') || title.includes('reporting')) return grammarTopics.find(t => t.id === 'b1-indirect-speech');
    if (title.includes('polite') || title.includes('höflich')) return grammarTopics.find(t => t.id === 'b1-konjunktiv2');

    // B2 matches
    if (title.includes('konjunktiv i') || title.includes('konjunktiv 1')) return grammarTopics.find(t => t.id === 'b2-konjunktiv1');
    if (title.includes('advanced passive') || title.includes('zustandspassiv') || title.includes('lassen')) return grammarTopics.find(t => t.id === 'b2-advanced-passive');
    if (title.includes('nominal') || title.includes('nominalisierung')) return grammarTopics.find(t => t.id === 'b2-nominalization');
    if (title.includes('professional') || title.includes('business') || title.includes('beruf') || title.includes('meeting') || title.includes('interview')) return grammarTopics.find(t => t.id === 'b2-professional');

    // A1 verb as fallback
    if (title.includes('verb') || title.includes('present') || title.includes('sein') || title.includes('haben')) return grammarTopics.find(t => t.id === 'a1-present-tense');

    // Try fuzzy match on title
    return grammarTopics.find(t => title.includes(t.title.toLowerCase()));
};
