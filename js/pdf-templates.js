/**
 * pdf-templates.js
 * Contains templates and helper functions for generating PDF reports
 */

// Helper function to get learning theory descriptions
function getTheoryDescription(theory) {
    const theories = {
        "Universal Design for Learning (UDL)": "UDL is a framework that addresses the primary barrier to learning: inflexible curricula. It focuses on providing multiple means of engagement, representation, and action/expression to create accessible learning experiences.",
        "Constructivism": "Constructivism posits that learners actively construct knowledge through experience and reflection. This theory emphasizes the importance of prior knowledge, social interaction, and authentic contexts in building understanding.",
        "Direct Instruction": "Direct Instruction is a teaching approach that emphasizes well-developed lessons designed around small learning increments and clearly defined objectives. It focuses on explicit teaching with emphasis on curriculum fidelity.",
        "Cognitive Learning Theory": "Cognitive Learning Theory focuses on how information is processed, organized, stored, and retrieved. It emphasizes internal mental processes and organizing knowledge into meaningful patterns that facilitate understanding.",
        "Social Learning Theory": "Social Learning Theory proposes that new behaviors can be acquired through observation, modeling, and imitation. It emphasizes the importance of observing behaviors, attitudes, and emotional reactions of others.",
        "Experiential Learning": "Experiential Learning emphasizes learning through direct experience and focused reflection. It views learning as a process whereby knowledge is created through the transformation of experience."
    };
    
    return theories[theory] || "A framework that informs pedagogical practice based on research-supported principles.";
}

// Helper function to get style-specific applications
function getStyleApplication(styleId) {
    const applications = {
        1: "Your adaptability allows you to respond effectively to diverse student needs and learning contexts, creating inclusive environments where multiple pathways to success are available.",
        2: "Your empathetic approach creates safe spaces for emotional engagement with content, building strong learning communities where students feel valued and understood.",
        3: "Your structured approach ensures comprehensive coverage of curriculum requirements, providing students with clear learning pathways and well-organized progression through material.",
        4: "Your clarity and directness effectively communicate complex concepts, cutting through ambiguity to help students grasp essential knowledge and skills.",
        5: "Your dynamic presentation style engages large groups effectively, creating memorable learning experiences that inspire and maintain attention.",
        6: "Your focused approach delivers targeted learning experiences that address specific skills and concepts efficiently, particularly valuable in time-limited contexts."
    };
    
    return applications[styleId] || "Your teaching approach contributes distinct value to the educational experience of your students.";
}

// Helper function to get style-specific online component recommendations
function getStyleSpecificOnlineComponent(styleId, component) {
    const components = {
        1: { // All-Round Flexible
            content: "Provide content in multiple formats (text, video, audio, interactive) to accommodate different learning preferences and needs.",
            interaction: "Create diverse interaction opportunities including discussions, collaborative projects, and peer feedback with options for synchronous and asynchronous participation.",
            activities: "Design a variety of activity types (discussions, simulations, projects, reflections) that offer students choices in how they engage with content and demonstrate learning.",
            evaluation: "Implement a mix of assessment types (formative, summative, self, peer) with options for different submission formats based on learning objectives."
        },
        2: { // Student-Centered
            content: "Develop emotionally engaging content that incorporates personal stories, case studies, and real-world applications to foster connection with the material.",
            interaction: "Focus on creating dialogue-rich spaces with regular video check-ins, personal messages, and structured opportunities for peer-to-peer connection.",
            activities: "Prioritize collaborative activities, reflective journaling, case discussions, and role-playing scenarios that foster emotional connection to the material.",
            evaluation: "Design reflective assessments that emphasize personal growth, peer feedback, and portfolio development over traditional testing."
        },
        3: { // Official Curriculum
            content: "Create meticulously organized, curriculum-aligned content with clear connection to learning outcomes and assessment criteria.",
            interaction: "Implement formal interaction protocols with structured Q&A opportunities, guided discussions, and systematic feedback channels.",
            activities: "Structure sequential learning activities with clear objectives, explicit instructions, and strong alignment to formal curriculum requirements.",
            evaluation: "Implement criterion-referenced assessments with regular checkpoints, clear mastery targets, and structured remediation opportunities."
        },
        4: { // Straight Facts
            content: "Develop streamlined, fact-focused content that highlights critical information and eliminates extraneous elements for maximum clarity.",
            interaction: "Utilize direct, concise communication with clear expectations, focused questions, and efficient feedback mechanisms.",
            activities: "Design focused learning activities that emphasize key concepts, worked examples, structured practice, and immediate application of knowledge.",
            evaluation: "Implement objective assessments with clear metrics, specific feedback, and focus on accuracy and mastery of key concepts."
        },
        5: { // Big Conference
            content: "Create visually engaging, professionally produced content with emphasis on high production value and audience engagement techniques.",
            interaction: "Utilize broadcast-style communication with audience engagement features, polling, and structured Q&A sessions for large group interaction.",
            activities: "Create engaging presentation-based activities with strong visual elements, demonstrations, and opportunities for large group interaction.",
            evaluation: "Implement large-scale assessments with standardized feedback, comprehensive understanding checks, and automated grading when appropriate."
        },
        6: { // One-Off
            content: "Develop modular, self-contained content units that can be accessed independently when needed for specific skills or concepts.",
            interaction: "Utilize targeted, just-in-time communication with specific guidance related to immediate learning goals and challenges.",
            activities: "Design focused mini-lessons, targeted skill development exercises, and standalone learning modules that address specific competencies.",
            evaluation: "Implement immediate assessment with specific feedback and targeted skill checks focused on discrete learning outcomes."
        }
    };
    
    return components[styleId][component] || "Design components that align with your teaching style while meeting student needs in the online environment.";
}

// Function to get online module structure recommendations based on teaching style
function getModuleStructureRecommendations(styleId) {
    const moduleStructures = {
        1: { // All-Round Flexible and Adaptable Teacher
            approach: "Flexible, multi-path module structure with diverse learning resources",
            description: "Your adaptable teaching style benefits from a module structure that offers multiple pathways through content, accommodating diverse learning preferences and needs. This approach allows students to engage with material in ways that best suit their individual learning styles.",
            components: [
                "Multiple forms of content presentation (videos, readings, visualizations)",
                "Variety of assessment types to accommodate different learning preferences",
                "Regular check-in points that adapt based on student progress",
                "Optional extension activities for students who want deeper exploration",
                "Technology tools that support various learning approaches"
            ]
        },
        2: { // Student-Centered, Sensitive Teacher
            approach: "Community-focused module with emphasis on connection and reflection",
            description: "Your empathetic teaching style thrives in an online environment that prioritizes human connection and emotional engagement. This structure creates spaces for meaningful interaction and personal reflection throughout the learning journey.",
            components: [
                "Personal introduction activities and connection-building exercises",
                "Reflective journals and discussion spaces throughout the module",
                "Peer collaboration and group learning activities in small cohorts",
                "Emotionally engaging content with space for personal responses",
                "Supportive feedback mechanisms with emphasis on growth"
            ]
        },
        3: { // Official Curriculum Teacher
            approach: "Systematically structured module with clear learning pathways and objectives",
            description: "Your structured teaching approach benefits from a highly organized online environment with explicit progression through curriculum objectives. This framework provides students with clear expectations and comprehensive coverage of required material.",
            components: [
                "Comprehensive module outline with explicit learning outcomes",
                "Structured learning units that align precisely with assessment",
                "Regular formative assessment checkpoints with remediation options",
                "Clear grading policies and academic expectations",
                "Detailed study guides and structured review materials"
            ]
        },
        4: { // Straight Facts No-Nonsense Teacher
            approach: "Direct, fact-focused module with clear progression through concepts",
            description: "Your direct teaching style is enhanced by a streamlined online structure that emphasizes clarity and efficiency. This approach focuses on essential information and practical application, minimizing extraneous elements.",
            components: [
                "Concise, focused content delivery with essential information highlighted",
                "Step-by-step tutorials for complex procedures and concepts",
                "Regular knowledge checks with immediate feedback",
                "Practical application exercises with worked examples",
                "Structured Q&A forums for clarification of content"
            ]
        },
        5: { // Big Conference Teacher
            approach: "Presentation-focused module with engaging multimedia content",
            description: "Your dynamic presentation style translates to an online environment that emphasizes high-quality multimedia content and engaging delivery. This structure maintains student attention through professional presentation and interactive elements.",
            components: [
                "High-quality lecture videos as primary content delivery method",
                "Large group synchronous sessions with audience response activities",
                "Visually engaging content with professional presentation",
                "Dynamic content delivery with emphasis on maintaining attention",
                "Broadcast announcements and focused communication"
            ]
        },
        6: { // One-Off Teacher
            approach: "Modular, standalone units with focused skill development",
            description: "Your targeted teaching approach works well with a modular online structure that focuses on specific skills and concepts. This framework allows for efficient, just-in-time learning with immediate application and feedback.",
            components: [
                "Self-contained learning units that can be completed independently",
                "Just-in-time resources accessible at point of need",
                "Targeted mini-lessons focused on specific skills or concepts",
                "Quick reference guides and targeted support materials",
                "Immediate assessment with specific, actionable feedback"
            ]
        }
    };
    
    return moduleStructures[styleId];
}

// Function to get online teaching strategies based on teaching style
function getOnlineTeachingStrategies(styleId) {
    const strategies = {
        1: [ // All-Round Flexible and Adaptable Teacher
            "Create a module structure that offers multiple pathways through the content",
            "Use a variety of media formats (video, text, interactive activities) for each learning unit",
            "Implement both synchronous and asynchronous learning opportunities",
            "Design assessments with multiple format options (written, video, presentations)",
            "Create regular check-in points throughout the module to monitor student progress",
            "Provide supplementary resources for students who want to explore topics further"
        ],
        2: [ // Student-Centered, Sensitive Teacher
            "Begin each module with personal introduction videos and student connection activities",
            "Create frequent discussion forums focused on emotional responses to content",
            "Implement peer review and collaborative assignments using group functions",
            "Schedule regular video conferencing sessions for personal connection",
            "Use reflective journaling throughout the learning experience",
            "Design assessments that connect content to personal experiences"
        ],
        3: [ // Official Curriculum Teacher
            "Create a detailed module structure with clear progression through curriculum objectives",
            "Develop comprehensive pre-module surveys to assess student knowledge",
            "Design structured learning units with clear assessment alignment",
            "Implement regular formative assessments and knowledge checks",
            "Create detailed rubrics and exemplars for all assessments",
            "Use catch-up activities for students who score below 50% on assessments"
        ],
        4: [ // Straight Facts No-Nonsense Teacher
            "Create concise video lectures focused on key concepts and facts",
            "Implement structured problem-solving activities with worked examples",
            "Design step-by-step tutorials for complex procedures",
            "Use concept mapping activities to show relationships between key ideas",
            "Create frequent knowledge check assessments with immediate feedback",
            "Provide clear documentation for all technology tools and resources"
        ],
        5: [ // Big Conference Teacher
            "Create high-quality, engaging video presentations as the central learning resource",
            "Implement audience response systems during live sessions",
            "Design large group activities that work well in video conferencing",
            "Create visually engaging presentation materials for all learning units",
            "Use broadcast communications effectively for announcements",
            "Develop resource libraries with supplementary materials"
        ],
        6: [ // One-Off Teacher
            "Create standalone learning modules that can be completed independently",
            "Design focused tutorials on specific skills with immediate application",
            "Implement just-in-time learning resources that students can access when needed",
            "Create targeted assessments that focus on specific competencies",
            "Use quick reference guides for all technical aspects of the course",
            "Develop targeted feedback mechanisms for each learning outcome"
        ]
    };
    
    return strategies[styleId] || [
        "Create a module structure aligned with your teaching preferences",
        "Develop content in formats that maximize student engagement",
        "Design activities that reflect your instructional strengths",
        "Implement assessment methods that align with your evaluation philosophy"
    ];
}

// Function to get recommendation details for each teaching style
function getStyleRecommendations(styleId) {
    const recommendations = {
        1: { // All-Round Flexible and Adaptable Teacher
            overview: "As an All-Round Flexible and Adaptable Teacher, you possess a remarkable ability to pivot and adjust your teaching methods to meet diverse student needs. Your teaching approach demonstrates a natural inclination toward inclusivity and versatility, making you particularly effective in diverse learning environments. This adaptability is your superpower – you can seamlessly shift between different teaching methods while maintaining high educational standards.",
            learningActivities: [
                "Incorporate varied instructional methods including lectures, group work, and hands-on activities",
                "Design activities that accommodate different skill levels and learning preferences",
                "Use multimedia resources to present content in multiple formats",
                "Implement both individual and collaborative learning opportunities"
            ],
            engagementStrategies: [
                "Provide choice in assignment formats and learning pathways",
                "Create flexible learning paths with multiple entry points",
                "Use technology to support diverse learning needs",
                "Incorporate real-world applications that connect to student interests"
            ],
            assessmentApproaches: [
                "Use diverse assessment methods that accommodate different strengths",
                "Implement both formative and summative assessments",
                "Allow multiple attempts or formats when appropriate",
                "Provide opportunities for self-assessment and reflection"
            ]
        },
        2: { // Student-Centered, Sensitive Teacher
            overview: "As a Student-Centered, Sensitive Teacher, you excel at building meaningful connections with your students and fostering a supportive learning community. Your empathetic and nurturing approach creates an environment where students feel valued and understood. Your natural ability to recognize and respond to individual student needs makes you particularly effective at creating inclusive and emotionally safe learning spaces.",
            learningActivities: [
                "Design role-playing scenarios that develop empathy and perspective-taking",
                "Implement small group discussions that foster connection and belonging",
                "Use case studies that highlight human experiences and emotional dimensions",
                "Create collaborative projects that build community and shared purpose"
            ],
            engagementStrategies: [
                "Foster emotional connections to content through personal narratives",
                "Create safe spaces for expression and authentic sharing",
                "Implement peer learning activities that build relationships",
                "Use narrative-based learning that connects to student experiences"
            ],
            assessmentApproaches: [
                "Use reflective assessments that emphasize personal growth",
                "Implement peer evaluation and feedback processes",
                "Create portfolio-based assessments that show development over time",
                "Focus on growth over grades with emphasis on improvement"
            ]
        },
        3: { // Official Curriculum Teacher
            overview: "As an Official Curriculum Teacher, you excel at creating clear learning pathways and maintaining high academic standards. Your structured and methodical approach ensures comprehensive coverage of essential learning objectives. Your commitment to systematic instruction and careful planning provides students with a solid foundation for academic success and ensures alignment with curriculum requirements.",
            learningActivities: [
                "Create structured lesson plans with clear progression through concepts",
                "Implement clear learning objectives aligned with curriculum standards",
                "Use systematic instruction sequences that build on prior knowledge",
                "Design aligned assessments that measure mastery of specific objectives"
            ],
            engagementStrategies: [
                "Use clear success criteria so students understand expectations",
                "Implement progress monitoring to track advancement toward goals",
                "Create milestone achievements to mark progress through curriculum",
                "Use competency-based progression with clear mastery indicators"
            ],
            assessmentApproaches: [
                "Develop criterion-referenced assessments aligned with objectives",
                "Create comprehensive assessment plans that measure all key outcomes",
                "Implement regular formative checks to ensure understanding",
                "Use detailed rubrics that clarify performance expectations"
            ]
        },
        4: { // Straight Facts No-Nonsense Teacher
            overview: "As a Straight Facts No-Nonsense Teacher, you excel at delivering clear, concise instruction focused on essential knowledge and skills. Your direct approach cuts through complexity to help students grasp key concepts efficiently. Your commitment to clarity and precision provides students with the fundamental understanding they need without unnecessary complications.",
            learningActivities: [
                "Create focused learning activities that emphasize key concepts",
                "Implement worked examples that demonstrate problem-solving processes",
                "Use direct instruction for complex or foundational concepts",
                "Design practice activities with immediate application of knowledge"
            ],
            engagementStrategies: [
                "Use clear explanations that eliminate confusion and ambiguity",
                "Implement visual organizers that highlight key information",
                "Create step-by-step guides for complex procedures",
                "Use frequent knowledge checks to ensure understanding"
            ],
            assessmentApproaches: [
                "Develop objective assessments with clear correct answers",
                "Create targeted quizzes focused on essential knowledge",
                "Implement immediate feedback mechanisms",
                "Use practical demonstrations of skill mastery"
            ]
        },
        5: { // Big Conference Teacher
            overview: "As a Big Conference Teacher, you excel at engaging large groups through dynamic presentation and commanding presence. Your confidence and ability to communicate effectively at scale creates memorable learning experiences. Your natural talent for maintaining audience attention and delivering content with impact makes you particularly effective when introducing important concepts to large groups.",
            learningActivities: [
                "Create engaging presentations with strong visual elements",
                "Implement demonstration activities that showcase processes",
                "Use audience response systems to maintain engagement",
                "Design activities that work well in large group settings"
            ],
            engagementStrategies: [
                "Use storytelling techniques that capture attention",
                "Implement multimedia presentations with high production value",
                "Create dynamic delivery with varied pace and emphasis",
                "Use strategic questioning to maintain audience involvement"
            ],
            assessmentApproaches: [
                "Develop comprehensive assessments that measure broad understanding",
                "Create standardized evaluation methods for consistent feedback",
                "Implement audience response systems for immediate checks",
                "Use automated grading when appropriate for efficiency"
            ]
        },
        6: { // One-Off Teacher
            overview: "As a One-Off Teacher, you excel at delivering targeted, efficient instruction that addresses specific skills or concepts. Your focused approach creates high-impact learning moments that efficiently build competency. Your ability to identify and address specific learning needs makes you particularly valuable in contexts requiring precise skill development and just-in-time learning.",
            learningActivities: [
                "Create focused mini-lessons targeting specific skills",
                "Implement targeted skill development exercises",
                "Use modular learning units that address discrete competencies",
                "Design just-in-time learning resources for point-of-need support"
            ],
            engagementStrategies: [
                "Use clear objectives that specify exactly what will be learned",
                "Implement immediate application of new skills",
                "Create focused attention through elimination of distractions",
                "Use targeted examples that illustrate specific applications"
            ],
            assessmentApproaches: [
                "Develop skill-specific assessments with clear success criteria",
                "Create immediate feedback mechanisms for rapid improvement",
                "Implement targeted skill checks focused on specific outcomes",
                "Use practical application tasks that demonstrate competency"
            ]
        }
    };
    
    return recommendations[styleId] || {
        overview: "Your teaching style reflects your unique approach to facilitating learning. The following recommendations are designed to leverage your natural strengths while providing opportunities for continued growth and development.",
        learningActivities: [
            "Design activities that align with your teaching preferences",
            "Implement a variety of instructional approaches",
            "Create opportunities for active student engagement",
            "Use authentic learning experiences"
        ],
        engagementStrategies: [
            "Foster student motivation through relevant content",
            "Create clear connections to learning objectives",
            "Implement strategies that maintain attention",
            "Use varied approaches to accommodate different learners"
        ],
        assessmentApproaches: [
            "Develop assessments aligned with learning objectives",
            "Create opportunities for meaningful feedback",
            "Implement both formative and summative assessment",
            "Use authentic assessment when possible"
        ]
    };
}

// Generate PDF content with enhanced instructional design copy
function generatePdfContent(userName, dominantStyle, scores, rankedStyles, institution = '', options = {}) {
    // Set default options
    const settings = {
        includeProfile: true,
        includeStrategies: true,
        includeOnline: true,
        ...options
    };
    
    // Get recommendations for the dominant style
    const recommendations = getStyleRecommendations(dominantStyle.id);
    const onlineStrategies = getOnlineTeachingStrategies(dominantStyle.id);
    const moduleStructure = getModuleStructureRecommendations(dominantStyle.id);
    
    // Personalized messages for each teaching style
    const personalizedMessages = {
        1: "Your adaptability is your greatest strength as an educator. You naturally adjust your approach to meet diverse student needs, creating inclusive learning environments where all students can thrive. Continue leveraging this flexibility to reach every learner in your classroom.",
        2: "Your empathetic approach creates powerful connections with your students. By prioritizing emotional engagement and small group dynamics, you foster a supportive learning environment where students feel valued and understood. This emotional intelligence is a rare and valuable gift in education.",
        3: "Your structured approach provides students with clear pathways to success. Your commitment to well-prepared, curriculum-aligned teaching ensures comprehensive coverage of essential learning objectives while maintaining high academic standards. This foundation gives students confidence in their educational journey.",
        4: "Your clarity and precision cut through complexity, delivering knowledge in a straightforward manner that resonates with students. Your ability to distill complex concepts into manageable components makes challenging subject matter accessible and actionable for your students.",
        5: "Your confidence and presence in front of large audiences creates memorable learning experiences. You have a natural ability to command attention and communicate ideas effectively at scale, making you particularly effective when delivering important concepts to large groups.",
        6: "Your focused approach to teaching creates high-impact learning moments. You excel at delivering targeted, efficient instruction that addresses specific skills or concepts, making you especially valuable in contexts requiring precise skill development and just-in-time learning."
    };
    
    // Get personalized message or fall back to original description
    const personalizedMessage = personalizedMessages[dominantStyle.id] || dominantStyle.description;
    
    // Format the date in a more professional way
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Build the HTML content based on the selected options
    let htmlContent = `
        <header>
            <div class="cover-page">
                <h1 class="title">Teaching Style Profile</h1>
                <p class="subtitle">Based on the Staffordshire Evaluation of Teaching Styles (SETS)©</p>
                <div class="user-details">
                    <p class="user-name">Prepared for: ${userName}${institution ? `<br><span class="institution">${institution}</span>` : ''}</p>
                    <p class="date">Generated on: ${formattedDate}</p>
                </div>
            </div>
            <div class="page-break"></div>
        </header>
        
        <section class="section introduction-section">
            <h2 class="section-title">Your Pedagogical Identity</h2>
            <p class="intro-text">
                Welcome to your personalized teaching style profile. This report illuminates your unique pedagogical approach and provides evidence-based strategies that align with your natural teaching inclinations. Understanding your teaching identity is a powerful step toward intentional practice and meaningful student engagement.
            </p>
            
            <div class="dominant-style">
                <div class="style-info">
                    <h3 class="style-name">${dominantStyle.name}</h3>
                    <p class="style-description">${personalizedMessage}</p>
                    <div class="theory-box">
                        <div class="theory-title">Aligned Learning Theory: ${dominantStyle.theory}</div>
                        <p class="theory-description">${getTheoryDescription(dominantStyle.theory)}</p>
                    </div>
                </div>
                <div class="style-score">
                    <div class="score-value">${scores[dominantStyle.id]}%</div>
                    <div class="score-label">Alignment</div>
                </div>
            </div>
            
            <p class="style-impact">
                Your dominant teaching style influences how you design learning experiences, facilitate interactions, assess student understanding, and create learning environments. The insights and recommendations in this report build upon your natural strengths while offering pathways for continued professional growth.
            </p>
        </section>
    `;
    
    // Add teaching style profile section if selected
    if (settings.includeProfile) {
        htmlContent += `
            <div class="page-break"></div>
            <section class="section profile-section">
                <h2 class="section-title">Your Teaching Style Profile</h2>
                
                <p class="section-intro">
                    Your teaching style profile reflects your pedagogical preferences and strengths. While your dominant style is ${dominantStyle.name}, you also incorporate elements from other teaching approaches. Understanding this profile helps you leverage your strengths while identifying areas for potential growth and adaptation.
                </p>
                
                <div class="profile-content">
                    ${rankedStyles.map((style, index) => `
                        <div class="style-item">
                            <div class="style-header">
                                <h3 class="style-name">${index + 1}. ${style.name}</h3>
                                <div class="style-score-small">${style.score}%</div>
                            </div>
                            <p class="style-description">${style.description}</p>
                            <p class="style-application">${getStyleApplication(style.id)}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="profile-reflection">
                    <h4>Reflection Point</h4>
                    <p>Consider how your teaching style profile aligns with your educational values and the needs of your students. Are there contexts where incorporating elements from your less dominant styles might enhance student learning? How might you intentionally develop versatility across different teaching approaches?</p>
                </div>
            </section>
        `;
    }
    
    // Add recommendations section if selected
    if (settings.includeStrategies) {
        htmlContent += `
            <div class="page-break"></div>
            <section class="section recommendations-section">
                <h2 class="section-title">Evidence-Based Practice Recommendations</h2>
                
                <p class="section-intro">
                    The following recommendations are designed to amplify your natural strengths as a ${dominantStyle.name}. These strategies are informed by both educational research and best practices in instructional design.
                </p>
                
                <p class="overview-text">${recommendations.overview}</p>
                
                <div class="recommendations">
                    <h3 class="subsection-title">Learning Activities: Designing Purposeful Engagement</h3>
                    <p class="subsection-intro">
                        Learning activities form the core of student experience, translating your instructional goals into meaningful engagement. The following activities leverage your strengths as a ${dominantStyle.name} to create authentic learning opportunities:
                    </p>
                    <ul class="recommendations-list">
                        ${recommendations.learningActivities.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </section>

            <section class="section">
                <div class="recommendations">
                    <h3 class="subsection-title">Enhancing Engagement: Creating Cognitive and Emotional Connection</h3>
                    <p class="subsection-intro">
                        Student engagement encompasses attention, interest, curiosity, and motivation—essential elements for effective learning. These strategies help foster deep engagement through approaches aligned with your teaching style:
                    </p>
                    <ul class="recommendations-list">
                        ${recommendations.engagementStrategies.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3 class="subsection-title">Assessment Approaches: Measuring Learning Authentically</h3>
                    <p class="subsection-intro">
                        Assessment is most effective when aligned with your teaching approach and learning objectives. These assessment strategies complement your ${dominantStyle.name} style while providing meaningful insights into student learning:
                    </p>
                    <ul class="recommendations-list">
                        ${recommendations.assessmentApproaches.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="implementation-note">
                    <h4>Implementation Strategy</h4>
                    <p>When implementing these recommendations, start with 1-2 strategies that most resonate with you and your current teaching context. After integrating these successfully, gradually incorporate additional approaches. This incremental implementation allows for thoughtful adaptation and reflection on impact.</p>
                </div>
            </section>
        `;
    }
    
    // Add online teaching strategies section if selected
    if (settings.includeOnline) {
        htmlContent += `
            <div class="page-break"></div>
            <section class="section online-section">
                <h2 class="section-title">Digital Pedagogies: Translating Your Teaching Style to Online Environments</h2>
                
                <p class="section-intro">
                    Online and blended learning environments offer unique opportunities and challenges for educators. This section explores how to effectively translate your teaching style into digital spaces while maintaining pedagogical integrity.
                </p>
                
                <h3 class="subsection-title">Strategic Approaches for Online Teaching</h3>
                <p class="strategic-intro">
                    As a ${dominantStyle.name}, your distinctive approach can be enhanced through these targeted online teaching strategies that preserve your pedagogical identity while optimizing the digital learning experience:
                </p>
                
                <div class="recommendations">
                    <ul class="recommendations-list online-strategies">
                        ${onlineStrategies.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </section>

            <section class="section">
                <div class="online-module">
                    <h3 class="subsection-title">Architecting Your Online Learning Environment</h3>
                    <p class="module-intro">
                        The structure of your online learning environment should reflect your pedagogical approach while incorporating principles of effective digital design. Based on your teaching style profile, we recommend the following framework:
                    </p>
                    
                    <p class="module-approach"><strong>${moduleStructure.approach}</strong></p>
                    
                    <p class="components-intro">${moduleStructure.description}</p>
                    
                    <div class="module-components">
                        <h4>Key Components for Your Online Learning Environment</h4>
                        
                        <div class="component-grid">
                            <div class="component-item">
                                <h4>Content Presentation</h4>
                                <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'content')}</p>
                            </div>
                            
                            <div class="component-item">
                                <h4>Student Interaction</h4>
                                <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'interaction')}</p>
                            </div>
                            
                            <div class="component-item">
                                <h4>Learning Activities</h4>
                                <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'activities')}</p>
                            </div>
                            
                            <div class="component-item">
                                <h4>Assessment & Feedback</h4>
                                <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'evaluation')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="digital-integration-note">
                        <h4>Digital Integration Reflection</h4>
                        <p>When developing your online teaching approach, consider how each digital tool and platform serves your pedagogical goals rather than adapting your teaching to fit the technology. Your teaching style should inform technology selection, not be constrained by it.</p>
                    </div>
                </div>
            </section>
            
            <div class="page-break"></div>
            <section class="section conclusion-section">
                <h2 class="section-title">Continuing Your Professional Development Journey</h2>
                
                <p class="conclusion-text">
                    Understanding your teaching style profile is just the beginning of a rewarding journey toward pedagogical excellence. As you implement the recommendations in this report, consider maintaining a reflective teaching journal to document your experiences, insights, and the impact on student learning.
                </p>
                
                <p class="conclusion-text">
                    Remember that teaching styles are not fixed traits but dynamic approaches that evolve through experience, reflection, and professional development. You may find that certain contexts call for adaptations of your natural style or incorporation of elements from other approaches.
                </p>
                
                <p class="conclusion-text">
                    We encourage you to share these insights with trusted colleagues and seek opportunities for collaborative reflection and growth. Professional learning communities can provide valuable perspectives and support as you refine your teaching approach.
                </p>
                
                <div class="final-reflection">
                    <p>Thank you for engaging in this exploration of your teaching identity. We hope these insights empower you to teach with greater intention, confidence, and impact.</p>
                </div>
            </section>
        `;
    }
    
    // Add footer
    htmlContent += `
        <footer class="footer">
            <div class="footer-content">
                <p>Generated by anga Teaching Styles Assessment</p>
                <p>Based on SETS© by Mohanna, Chambers & Wall (2007)</p>
            </div>
        </footer>
    `;
    
    return htmlContent;
}

// Export functions for use in results.js
window.pdfTemplates = {
    generatePdfContent,
    getTheoryDescription,
    getStyleApplication,
    getStyleSpecificOnlineComponent,
    getModuleStructureRecommendations,
    getStyleRecommendations,
    getOnlineTeachingStrategies
};