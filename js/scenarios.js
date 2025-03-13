/**
 * scenarios.js
 * Contains the assessment questions and teaching style definitions
 */

// Scenario data based on the SETS© assessment
const scenarios = [
    {
        id: 1,
        scenario: "You're preparing for tomorrow's lecture on advanced biochemistry. As you review your class roster, you notice it's a mixed group - some are first-year students while others are seniors. Your usual teaching approach would need significant adjustment.",
        question: "How likely are you to modify your teaching approach for this diverse audience?",
        styleMapping: 1 // Maps to Style One
    },
    {
        id: 2,
        scenario: "Your department suggests conducting a workshop using interactive games to teach complex statistical concepts. While the games seem engaging, you feel more confident with traditional PowerPoint presentations.",
        question: "How comfortable would you be leading this game-based learning session?",
        styleMapping: 2 // Maps to Style Two
    },
    {
        id: 3,
        scenario: "During a difficult lesson on molecular biology, you notice your students struggling to grasp key concepts. You have a creative idea to turn the cell's components into characters in a role-playing game.",
        question: "How likely are you to implement this game-based approach?",
        styleMapping: 2
    },
    {
        id: 4,
        scenario: "Your institution has implemented new learning outcomes that need to be met by the end of the semester. These outcomes differ from your personal teaching goals.",
        question: "How important is it to you to align your teaching with these external targets?",
        styleMapping: 3
    },
    {
        id: 5,
        scenario: "You've been asked to conduct a series of connected workshops, but you prefer teaching standalone topics without the need for follow-up sessions.",
        question: "How comfortable are you with self-contained, one-off teaching sessions?",
        styleMapping: 6
    },
    {
        id: 6,
        scenario: "During a crucial lecture, your carefully prepared visual aids and props malfunction. You must decide whether to continue without them or reschedule.",
        question: "How much do you believe props and visual aids impact your teaching effectiveness?",
        styleMapping: 6
    },
    {
        id: 7,
        scenario: "You're invited to give a keynote speech at an international conference with over 500 attendees. The topic is in your expertise, but the audience size is daunting.",
        question: "How comfortable would you feel addressing this large audience?",
        styleMapping: 5
    },
    {
        id: 8,
        scenario: "While planning tomorrow's lesson, you find yourself spending more time rehearsing your delivery than organizing student activities.",
        question: "How much do you focus on your role and presentation when preparing?",
        styleMapping: 5
    },
    {
        id: 9,
        scenario: "During a three-hour workshop, you notice students seem tired of sitting. You could continue your planned lecture or incorporate movement-based activities.",
        question: "How likely are you to maintain a standing, active teaching position?",
        styleMapping: 5
    },
    {
        id: 10,
        scenario: "You're teaching a complex topic with various interpretations. Students are asking for your personal views, but you prefer focusing on established facts.",
        question: "How important is it to stick to clear, factual content in your teaching?",
        styleMapping: 4
    },
    {
        id: 11,
        scenario: "A student's unexpected question leads to an interesting discussion, but it's taking you away from your planned lesson structure.",
        question: "How likely are you to redirect back to your planned content?",
        styleMapping: 4
    },
    {
        id: 12,
        scenario: "Your department needs someone to teach basic research skills applicable across different fields, rather than your specific expertise area.",
        question: "How comfortable are you teaching general, transferable skills?",
        styleMapping: 1
    },
    {
        id: 13,
        scenario: "You're passionate about teaching but haven't pursued formal teaching qualifications. Your institution is now offering certification programs.",
        question: "How important is formal teaching accreditation to you?",
        styleMapping: 3
    },
    {
        id: 14,
        scenario: "A struggling student requests regular one-on-one tutoring sessions. While you want to help, you prefer teaching larger groups.",
        question: "How comfortable are you with one-on-one teaching situations?",
        styleMapping: 6
    },
    {
        id: 15,
        scenario: "You've developed a successful lecture on climate change. Now you need to present it to both science and humanities students.",
        question: "How likely are you to keep the same delivery approach for different audiences?",
        styleMapping: 1
    },
    {
        id: 16,
        scenario: "During a seminar, students seem confused about effective study methods. You could either provide direct guidance or help them discover their own learning strategies.",
        question: "How likely are you to guide students in exploring their own learning approaches?",
        styleMapping: 2
    },
    {
        id: 17,
        scenario: "Your colleagues suggest adopting a new teaching methodology, but you've developed your own effective approach over years of experience.",
        question: "How confident are you in maintaining your personal teaching style?",
        styleMapping: 1
    },
    {
        id: 18,
        scenario: "You have the option to either teach a large lecture hall or provide individual tutorials. The content and preparation time would be the same.",
        question: "How much do you prefer one-on-one teaching situations?",
        styleMapping: 6
    },
    {
        id: 19,
        scenario: "You're teaching about historical conflicts and considering using role-play to help students understand different perspectives and emotional impacts.",
        question: "How valuable do you find emotional engagement through role-play in teaching?",
        styleMapping: 2
    },
    {
        id: 20,
        scenario: "During a serious topic discussion, you think of a relevant joke that could lighten the mood but might distract from the content.",
        question: "How comfortable are you using humor in your teaching?",
        styleMapping: 2
    },
    {
        id: 21,
        scenario: "Your classroom has comfortable seating arranged for group discussions, but you prefer to maintain an active, standing presence.",
        question: "How likely are you to remain standing throughout your teaching?",
        styleMapping: 5
    },
    {
        id: 22,
        scenario: "Your institution offers optional teaching accreditation. While your students give positive feedback, formal recognition could enhance your career.",
        question: "How important is official accreditation of your teaching abilities?",
        styleMapping: 3
    },
    {
        id: 23,
        scenario: "You're asked to lead a workshop with participants from various professional backgrounds - nurses, doctors, and administrators all together.",
        question: "How comfortable are you teaching multi-professional groups?",
        styleMapping: 4
    },
    {
        id: 24,
        scenario: "Your department is implementing a standardized curriculum. While it differs from your preferred teaching approach, it ensures consistency across courses.",
        question: "How important is following an external curriculum structure to you?",
        styleMapping: 3
    }
];

// Teaching style definitions
const teachingStyles = [
    {
        id: 1,
        name: "All-Round Flexible and Adaptable Teacher",
        description: "This teacher can use lots of different skills, can teach both peers and juniors, and is very aware of the whole environment both in teaching and of the learners.",
        theory: "Universal Design for Learning (UDL)",
        color: "#1B998B"
    },
    {
        id: 2,
        name: "Student-Centered, Sensitive Teacher",
        description: "This teacher is very student-centered, teaches in small groups, with emotions to the fore, using role play and drama, and is not comfortable doing straight presentations.",
        theory: "Constructivism",
        color: "#FF9F1C"
    },
    {
        id: 3,
        name: "Official Curriculum Teacher",
        description: "This teacher is very well prepared as a teacher, accredited, is very aware of and teaches to the formal curriculum and follows external targets for teaching.",
        theory: "Direct Instruction",
        color: "#2E294E"
    },
    {
        id: 4,
        name: "Straight Facts No-Nonsense Teacher",
        description: "This teacher likes to teach the clear facts, with straight talking, concentrating on specific skills, and much prefers not to be involved with multi-disciplinary teaching and learning.",
        theory: "Cognitive Learning Theory",
        color: "#4A4E69"
    },
    {
        id: 5,
        name: "Big Conference Teacher",
        description: "This teacher likes nothing better than to stand up in front of a big audience. This teacher does not like sitting in groups or one to one teaching.",
        theory: "Social Learning Theory",
        color: "#D62828"
    },
    {
        id: 6,
        name: "One-Off Teacher",
        description: "This teacher likes to deliver small self-contained bits of teaching, on a one to one basis, with no props to help and no follow up.",
        theory: "Experiential Learning",
        color: "#A8E0CC"
    }
];