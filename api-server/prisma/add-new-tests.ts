import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNewTests() {
    console.log('📝 Adding 2 new test sets...');

    // Test 2: TOEIC Mini Test - Reading Comprehension
    const test2 = await prisma.test.create({
        data: {
            title: 'TOEIC Mini Test 2 - Reading Skills',
            type: 'MINI',
            duration: 1200, // 20 minutes
            parts: {
                create: [
                    {
                        partNumber: 5,
                        questions: {
                            create: [
                                {
                                    content: 'The company will _____ a new product line next quarter.',
                                    options: {
                                        A: 'launch',
                                        B: 'launches',
                                        C: 'launched',
                                        D: 'launching'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Will" is followed by the base form of the verb.'
                                },
                                {
                                    content: 'All employees must _____ the new safety regulations.',
                                    options: {
                                        A: 'follow',
                                        B: 'following',
                                        C: 'follows',
                                        D: 'followed'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Modal verb "must" requires base form.'
                                },
                                {
                                    content: 'The meeting has been _____ until next Monday.',
                                    options: {
                                        A: 'postpone',
                                        B: 'postponed',
                                        C: 'postponing',
                                        D: 'postpones'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Present perfect passive voice requires past participle.'
                                },
                                {
                                    content: 'Ms. Chen is _____ for the marketing department.',
                                    options: {
                                        A: 'responsible',
                                        B: 'responsibly',
                                        C: 'responsibility',
                                        D: 'respond'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Adjective "responsible" complements "is".'
                                },
                                {
                                    content: 'The project was completed _____ than expected.',
                                    options: {
                                        A: 'quick',
                                        B: 'quickly',
                                        C: 'quicker',
                                        D: 'more quickly'
                                    },
                                    correctOpt: 'D',
                                    explanation: 'Comparative adverb form with "than".'
                                },
                                {
                                    content: 'Please submit your report _____ Friday.',
                                    options: {
                                        A: 'by',
                                        B: 'on',
                                        C: 'at',
                                        D: 'in'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"By" indicates a deadline.'
                                },
                                {
                                    content: 'The budget _____ approved by the board of directors.',
                                    options: {
                                        A: 'are',
                                        B: 'was',
                                        C: 'were',
                                        D: 'been'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Singular subject "budget" requires singular verb "was".'
                                },
                                {
                                    content: 'We need someone _____ can speak both English and Japanese.',
                                    options: {
                                        A: 'which',
                                        B: 'what',
                                        C: 'who',
                                        D: 'whom'
                                    },
                                    correctOpt: 'C',
                                    explanation: '"Who" is the correct relative pronoun for people as subject.'
                                },
                                {
                                    content: 'The conference will be held _____ the Grand Hotel.',
                                    options: {
                                        A: 'at',
                                        B: 'on',
                                        C: 'in',
                                        D: 'to'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"At" is used for specific venues/locations.'
                                },
                                {
                                    content: 'Despite _____ weather, the event was successful.',
                                    options: {
                                        A: 'a bad',
                                        B: 'the bad',
                                        C: 'bad',
                                        D: 'badly'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Definite article "the" refers to specific weather conditions.'
                                },
                                {
                                    content: 'The new policy will _____ effect next month.',
                                    options: {
                                        A: 'take',
                                        B: 'make',
                                        C: 'give',
                                        D: 'put'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Idiomatic expression "take effect".'
                                },
                                {
                                    content: 'Mr. Park _____ as CEO for five years.',
                                    options: {
                                        A: 'works',
                                        B: 'worked',
                                        C: 'has worked',
                                        D: 'is working'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Present perfect for actions continuing from past to present.'
                                },
                                {
                                    content: 'The document must be signed _____ both parties.',
                                    options: {
                                        A: 'with',
                                        B: 'by',
                                        C: 'from',
                                        D: 'to'
                                    },
                                    correctOpt: 'B',
                                    explanation: '"By" indicates the agent in passive voice.'
                                },
                                {
                                    content: 'Our sales team achieved _____ results this quarter.',
                                    options: {
                                        A: 'impress',
                                        B: 'impressing',
                                        C: 'impressive',
                                        D: 'impressively'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Adjective "impressive" modifies noun "results".'
                                },
                                {
                                    content: 'The manager asked _____ the report by tomorrow.',
                                    options: {
                                        A: 'complete',
                                        B: 'completing',
                                        C: 'to complete',
                                        D: 'completed'
                                    },
                                    correctOpt: 'C',
                                    explanation: '"Asked" is followed by infinitive "to + verb".'
                                },
                                {
                                    content: '_____ the training session, employees received certificates.',
                                    options: {
                                        A: 'During',
                                        B: 'After',
                                        C: 'Before',
                                        D: 'While'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Logical sequence: certificates given after training.'
                                },
                                {
                                    content: 'The product launch was _____ successful.',
                                    options: {
                                        A: 'high',
                                        B: 'height',
                                        C: 'highly',
                                        D: 'higher'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Adverb "highly" modifies adjective "successful".'
                                },
                                {
                                    content: 'We are looking for candidates _____ excellent communication skills.',
                                    options: {
                                        A: 'with',
                                        B: 'of',
                                        C: 'for',
                                        D: 'at'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"With" indicates possession of skills.'
                                },
                                {
                                    content: 'The deadline can be _____ if necessary.',
                                    options: {
                                        A: 'extend',
                                        B: 'extends',
                                        C: 'extended',
                                        D: 'extending'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Passive voice requires past participle after "be".'
                                },
                                {
                                    content: 'Please _____ me know if you have any questions.',
                                    options: {
                                        A: 'let',
                                        B: 'lets',
                                        C: 'letting',
                                        D: 'to let'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Imperative form uses base verb.'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
    console.log(`✅ Created Test 2: ${test2.title}`);

    // Test 3: TOEIC Mini Test - Grammar Focus
    const test3 = await prisma.test.create({
        data: {
            title: 'TOEIC Mini Test 3 - Grammar Practice',
            type: 'MINI',
            duration: 1200, // 20 minutes
            parts: {
                create: [
                    {
                        partNumber: 5,
                        questions: {
                            create: [
                                {
                                    content: 'The factory operates _____ hours a day.',
                                    options: {
                                        A: 'twenty-four',
                                        B: 'twenty-fours',
                                        C: 'twentieth-four',
                                        D: 'twenty-fourth'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Compound number is hyphenated and not pluralized.'
                                },
                                {
                                    content: 'Customers are required to _____ their receipts.',
                                    options: {
                                        A: 'keep',
                                        B: 'keeping',
                                        C: 'kept',
                                        D: 'keeps'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Required to" is followed by base form.'
                                },
                                {
                                    content: 'The presentation was _____ prepared and well received.',
                                    options: {
                                        A: 'careful',
                                        B: 'carefully',
                                        C: 'care',
                                        D: 'caring'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Adverb "carefully" modifies verb "prepared".'
                                },
                                {
                                    content: '_____ arriving at the office, please sign in.',
                                    options: {
                                        A: 'Upon',
                                        B: 'During',
                                        C: 'While',
                                        D: 'Since'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Upon" + gerund indicates immediate action.'
                                },
                                {
                                    content: 'The contract will be renewed _____ it expires.',
                                    options: {
                                        A: 'before',
                                        B: 'after',
                                        C: 'while',
                                        D: 'during'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Logical: renewal happens before expiration.'
                                },
                                {
                                    content: 'We appreciate your _____ in this matter.',
                                    options: {
                                        A: 'cooperate',
                                        B: 'cooperating',
                                        C: 'cooperation',
                                        D: 'cooperative'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Noun "cooperation" follows possessive adjective.'
                                },
                                {
                                    content: 'The software update should _____ within an hour.',
                                    options: {
                                        A: 'complete',
                                        B: 'be completed',
                                        C: 'completing',
                                        D: 'completed'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Passive voice: update is being completed.'
                                },
                                {
                                    content: 'Mr. Thompson is known _____ his innovative ideas.',
                                    options: {
                                        A: 'for',
                                        B: 'with',
                                        C: 'as',
                                        D: 'to'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Known for" is the correct collocation.'
                                },
                                {
                                    content: 'The meeting room is available _____ 2 PM today.',
                                    options: {
                                        A: 'until',
                                        B: 'during',
                                        C: 'while',
                                        D: 'since'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Until" indicates a time limit.'
                                },
                                {
                                    content: 'She is _____ qualified candidate for the position.',
                                    options: {
                                        A: 'a most',
                                        B: 'the most',
                                        C: 'most',
                                        D: 'more'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Superlative with definite article "the".'
                                },
                                {
                                    content: 'The invoice must be paid _____ 30 days.',
                                    options: {
                                        A: 'within',
                                        B: 'during',
                                        C: 'for',
                                        D: 'since'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Within" indicates a time period for completion.'
                                },
                                {
                                    content: 'The team worked _____ to meet the deadline.',
                                    options: {
                                        A: 'diligent',
                                        B: 'diligently',
                                        C: 'diligence',
                                        D: 'more diligent'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Adverb "diligently" modifies verb "worked".'
                                },
                                {
                                    content: '_____ feedback is essential for improvement.',
                                    options: {
                                        A: 'Construct',
                                        B: 'Constructive',
                                        C: 'Construction',
                                        D: 'Constructively'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Adjective "constructive" modifies noun "feedback".'
                                },
                                {
                                    content: 'The company\'s profits have _____ significantly.',
                                    options: {
                                        A: 'increase',
                                        B: 'increases',
                                        C: 'increased',
                                        D: 'increasing'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Present perfect requires past participle.'
                                },
                                {
                                    content: 'Employees should _____ their supervisor if they will be late.',
                                    options: {
                                        A: 'notify',
                                        B: 'notification',
                                        C: 'notifies',
                                        D: 'notifying'
                                    },
                                    correctOpt: 'A',
                                    explanation: 'Modal "should" requires base form.'
                                },
                                {
                                    content: 'The new regulations will be _____ starting next month.',
                                    options: {
                                        A: 'effect',
                                        B: 'effective',
                                        C: 'effectively',
                                        D: 'effectiveness'
                                    },
                                    correctOpt: 'B',
                                    explanation: 'Adjective "effective" complements "be".'
                                },
                                {
                                    content: 'Access to the building is restricted _____ authorized personnel.',
                                    options: {
                                        A: 'to',
                                        B: 'for',
                                        C: 'with',
                                        D: 'by'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"Restricted to" is the correct collocation.'
                                },
                                {
                                    content: 'The seminar was _____ informative and engaging.',
                                    options: {
                                        A: 'each',
                                        B: 'both',
                                        C: 'either',
                                        D: 'neither'
                                    },
                                    correctOpt: 'B',
                                    explanation: '"Both...and" connects two items.'
                                },
                                {
                                    content: 'The application deadline has been _____ to June 30.',
                                    options: {
                                        A: 'extend',
                                        B: 'extends',
                                        C: 'extended',
                                        D: 'extending'
                                    },
                                    correctOpt: 'C',
                                    explanation: 'Present perfect passive requires past participle.'
                                },
                                {
                                    content: 'All visitors must register _____ reception.',
                                    options: {
                                        A: 'at',
                                        B: 'on',
                                        C: 'in',
                                        D: 'to'
                                    },
                                    correctOpt: 'A',
                                    explanation: '"At" is used for specific locations/desks.'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });
    console.log(`✅ Created Test 3: ${test3.title}`);

    console.log('🎉 Successfully added 2 new test sets!');
}

addNewTests()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
