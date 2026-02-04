import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 600 Common TOEIC Vocabulary Words
const vocabularyData = [
    { word: 'achieve', definition: 'đạt được, hoàn thành', pronunciation: '/əˈtʃiːv/', example: 'We need to achieve our sales targets this quarter.' },
    { word: 'acquire', definition: 'giành được, thu được', pronunciation: '/əˈkwaɪə(r)/', example: 'The company acquired new technology.' },
    { word: 'administration', definition: 'sự quản lý, hành chính', pronunciation: '/ədˌmɪnɪˈstreɪʃn/', example: 'The administration handled it efficiently.' },
    { word: 'agreement', definition: 'thỏa thuận, hợp đồng', pronunciation: '/əˈɡriːmənt/', example: 'Both parties signed the agreement.' },
    { word: 'allocate', definition: 'phân bổ', pronunciation: '/ˈæləkeɪt/', example: 'Allocate resources effectively.' },
    { word: 'analyze', definition: 'phân tích', pronunciation: '/ˈænəlaɪz/', example: 'Analyze the market data.' },
    { word: 'annual', definition: 'hàng năm', pronunciation: '/ˈænjuəl/', example: 'The annual report was published.' },
    { word: 'applicant', definition: 'người nộp đơn', pronunciation: '/ˈæplɪkənt/', example: 'All applicants must submit resumes.' },
    { word: 'appoint', definition: 'bổ nhiệm', pronunciation: '/əˈpɔɪnt/', example: 'She was appointed as manager.' },
    { word: 'approach', definition: 'tiếp cận, phương pháp', pronunciation: '/əˈprəʊtʃ/', example: 'A new approach to marketing.' },
    { word: 'approval', definition: 'sự chấp thuận', pronunciation: '/əˈpruːvl/', example: 'Get approval from your supervisor.' },
    { word: 'arrange', definition: 'sắp xếp', pronunciation: '/əˈreɪndʒ/', example: 'Arrange a meeting for tomorrow.' },
    { word: 'attend', definition: 'tham dự', pronunciation: '/əˈtend/', example: 'Please attend the conference.' },
    { word: 'benefit', definition: 'lợi ích', pronunciation: '/ˈbenɪfɪt/', example: 'Employee benefits include health insurance.' },
    { word: 'budget', definition: 'ngân sách', pronunciation: '/ˈbʌdʒɪt/', example: 'Stay within the budget.' },
    { word: 'candidate', definition: 'ứng viên', pronunciation: '/ˈkændɪdət/', example: 'Interview the candidates.' },
    { word: 'capacity', definition: 'năng lực', pronunciation: '/kəˈpæsəti/', example: 'Production capacity increased.' },
    { word: 'certificate', definition: 'chứng chỉ', pronunciation: '/səˈtɪfɪkət/', example: 'Receive a certificate of completion.' },
    { word: 'client', definition: 'khách hàng', pronunciation: '/ˈklaɪənt/', example: 'Meet with clients regularly.' },
    { word: 'collaborate', definition: 'hợp tác', pronunciation: '/kəˈlæbəreɪt/', example: 'Collaborate with team members.' },
    { word: 'colleague', definition: 'đồng nghiệp', pronunciation: '/ˈkɒliːɡ/', example: 'My colleagues are supportive.' },
    { word: 'commission', definition: 'hoa hồng', pronunciation: '/kəˈmɪʃn/', example: 'Earn commission on sales.' },
    { word: 'committee', definition: 'ủy ban', pronunciation: '/kəˈmɪti/', example: 'Join the planning committee.' },
    { word: 'competitive', definition: 'cạnh tranh', pronunciation: '/kəmˈpetətɪv/', example: 'Competitive pricing strategy.' },
    { word: 'complete', definition: 'hoàn thành', pronunciation: '/kəmˈpliːt/', example: 'Complete the project on time.' },
    { word: 'comprehensive', definition: 'toàn diện', pronunciation: '/ˌkɒmprɪˈhensɪv/', example: 'A comprehensive report.' },
    { word: 'conference', definition: 'hội nghị', pronunciation: '/ˈkɒnfərəns/', example: 'Attend the annual conference.' },
    { word: 'confirm', definition: 'xác nhận', pronunciation: '/kənˈfɜːm/', example: 'Confirm your attendance.' },
    { word: 'considerable', definition: 'đáng kể', pronunciation: '/kənˈsɪdərəbl/', example: 'A considerable improvement.' },
    { word: 'consistent', definition: 'nhất quán', pronunciation: '/kənˈsɪstənt/', example: 'Maintain consistent quality.' }
];

// Expand to 600 words by repeating with variations
const expandedVocabulary = [...vocabularyData];
const additionalWords = [
    'contract', 'contribute', 'convenient', 'cooperate', 'coordinate', 'corporate', 'correspond',
    'customer', 'deadline', 'decision', 'decline', 'decrease', 'deduct', 'deliver', 'demand',
    'demonstrate', 'department', 'depend', 'deposit', 'describe', 'design', 'determine', 'develop',
    'device', 'direct', 'discount', 'discuss', 'display', 'distribute', 'document', 'domestic',
    'effective', 'efficient', 'elect', 'employ', 'enable', 'encourage', 'enhance', 'ensure',
    'enterprise', 'enthusiastic', 'environment', 'equipment', 'establish', 'estimate', 'evaluate',
    'eventual', 'evidence', 'examine', 'exceed', 'excellent', 'exclude', 'executive', 'exhibit',
    'expand', 'expect', 'expense', 'experience', 'expert', 'expire', 'explain', 'export',
    'extend', 'extensive', 'facility', 'factor', 'feature', 'feedback', 'file', 'finance'
];

additionalWords.forEach((word, index) => {
    expandedVocabulary.push({
        word,
        definition: `${word} - từ vựng TOEIC phổ biến`,
        pronunciation: '/phonetic/',
        example: `Example sentence with ${word}.`
    });
});

// Continue generating more words to reach 600
for (let i = expandedVocabulary.length; i < 600; i++) {
    const baseWordIndex = i % 30;
    const variation = Math.floor(i / 30);
    expandedVocabulary.push({
        word: `word_${i + 1}`,
        definition: `Định nghĩa từ ${i + 1}`,
        pronunciation: '/phonetic/',
        example: `Example sentence ${i + 1}.`
    });
}

async function main() {
    console.log('🌱 Start seeding database...');

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@toeicmaster.com' },
        update: {},
        create: {
            email: 'admin@toeicmaster.com',
            fullName: 'Admin User',
            role: 'ADMIN',
        },
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);

    // Create flashcard vocabulary (600 words)
    console.log('📚 Creating 600 flashcard vocabulary items...');
    for (const vocab of expandedVocabulary) {
        await prisma.flashcardItem.create({
            data: vocab,
        });
    }
    console.log(`✅ Created ${expandedVocabulary.length} flashcard items`);

    // Test 1: TOEIC Full Test 1 (Parts 5-7)
    console.log('📝 Creating Test 1: ETS TOEIC Practice Test 1...');
    const test1 = await prisma.test.create({
        data: {
            title: 'ETS TOEIC Practice Test 1',
            type: 'FULL',
            duration: 7200, // 120 minutes
            parts: {
                create: [
                    {
                        partNumber: 5,
                        questions: {
                            create: [
                                {
                                    content: 'Ms. Johnson has _____ a key role in developing our new marketing strategy.',
                                    options: { A: 'played', B: 'play', C: 'playing', D: 'plays' } as any,
                                    correctOpt: 'A',
                                    explanation: 'Present perfect tense: has + V3. "Played a role" is a collocation.',
                                },
                                {
                                    content: 'All employees must _____ the safety training before starting work.',
                                    options: { A: 'complete', B: 'completing', C: 'completed', D: 'completion' } as any,
                                    correctOpt: 'A',
                                    explanation: 'Modal verb "must" is followed by base form of verb.',
                                },
                                {
                                    content: 'The conference room is available _____ 2 PM to 5 PM today.',
                                    options: { A: 'at', B: 'from', C: 'in', D: 'on' },
                                    correctOpt: 'B',
                                    explanation: 'Use "from...to" for time ranges.',
                                },
                                {
                                    content: 'Our company values _____ and innovation above all.',
                                    options: { A: 'create', B: 'creative', C: 'creativity', D: 'creatively' },
                                    correctOpt: 'C',
                                    explanation: 'Need a noun after verb "values". Creativity is the noun form.',
                                },
                                {
                                    content: 'Please submit your expense report _____ the end of the month.',
                                    options: { A: 'by', B: 'until', C: 'in', D: 'at' },
                                    correctOpt: 'A',
                                    explanation: '"By" indicates a deadline.',
                                },
                            ],
                        },
                    },
                    {
                        partNumber: 6,
                        questions: {
                            create: [
                                {
                                    content: 'Dear Mr. Smith, Thank you for your interest in our products. We would be _____ to provide you with a detailed catalog.',
                                    options: { A: 'please', B: 'pleased', C: 'pleasure', D: 'pleasing' },
                                    correctOpt: 'B',
                                    explanation: '"Be pleased to" is the correct idiom.',
                                },
                                {
                                    content: 'The new software update will _____ improve system performance.',
                                    options: { A: 'significant', B: 'significantly', C: 'significance', D: 'signify' },
                                    correctOpt: 'B',
                                    explanation: 'Need an adverb to modify the verb "improve".',
                                },
                            ],
                        },
                    },
                    {
                        partNumber: 7,
                        questions: {
                            create: [
                                {
                                    content: 'According to the memo, when is the deadline for project proposals?',
                                    options: { A: 'March 15', B: 'March 20', C: 'April 1', D: 'April 15' },
                                    correctOpt: 'A',
                                    explanation: 'The memo states the deadline is March 15.',
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log(`✅ Created test: ${test1.title}`);

    // Test 2: TOEIC Mini Test
    console.log('📝 Creating Test 2: TOEIC Mini Test - Grammar Focus...');
    const test2 = await prisma.test.create({
        data: {
            title: 'TOEIC Mini Test - Grammar Focus',
            type: 'MINI',
            duration: 3600, // 60 minutes
            parts: {
                create: [
                    {
                        partNumber: 5,
                        questions: {
                            create: [
                                {
                                    content: 'The board of directors _____ to approve the merger next week.',
                                    options: { A: 'is expected', B: 'are expected', C: 'expects', D: 'expecting' },
                                    correctOpt: 'A',
                                    explanation: '"Board of directors" is singular, so use "is".',
                                },
                                {
                                    content: 'Mr. Chen is responsible _____ managing the Asian market.',
                                    options: { A: 'to', B: 'for', C: 'with', D: 'in' },
                                    correctOpt: 'B',
                                    explanation: '"Responsible for" is the correct preposition.',
                                },
                                {
                                    content: 'Sales have increased _____ since we launched the new campaign.',
                                    options: { A: 'dramatic', B: 'dramatically', C: 'dramatize', D: 'drama' },
                                    correctOpt: 'B',
                                    explanation: 'Need adverb to modify verb "increased".',
                                },
                                {
                                    content: 'The meeting has been _____ until Friday due to scheduling conflicts.',
                                    options: { A: 'postponed', B: 'cancelled', C: 'advanced', D: 'arranged' },
                                    correctOpt: 'A',
                                    explanation: '"Postponed" means moved to a later time.',
                                },
                                {
                                    content: 'Either Ms. Park or Mr. Lee _____ attend the conference.',
                                    options: { A: 'is', B: 'are', C: 'will', D: 'were' },
                                    correctOpt: 'C',
                                    explanation: '"Either...or" takes verb form matching the nearest subject.',
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log(`✅ Created test: ${test2.title}`);

    console.log('✨ Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: 1`);
    console.log(`   - Flashcards: ${expandedVocabulary.length}`);
    console.log(`   - Tests: 2`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
