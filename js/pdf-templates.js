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
            activities: "Design a variety of activity types (discussions, simulations, projects, reflections) that offer students choices in how they engage with content and demonstrate learning.",
            communication: "Establish multiple channels (announcements, discussions, chats, video conferences) with clear guidelines for when and how to use each for different purposes.",
            support: "Create a comprehensive support ecosystem with academic resources, technical guides, and personal check-ins accessible through multiple pathways.",
            resources: "Develop diverse media formats (text, video, interactive elements) for key concepts to accommodate different learning preferences and needs.",
            evaluation: "Implement a mix of assessment types (formative, summative, self, peer) with options for different submission formats based on learning objectives."
        },
        2: { // Student-Centered
            activities: "Prioritize collaborative activities, reflective journaling, case discussions, and role-playing scenarios that foster emotional connection to the material.",
            communication: "Focus on creating dialogue-rich spaces with regular video check-ins, personal messages, and structured opportunities for peer-to-peer connection.",
            support: "Establish strong emotional support mechanisms including virtual office hours, peer mentoring systems, and regular one-on-one check-ins.",
            resources: "Develop narrative-driven, relationally-focused resources that emphasize personal stories, case studies, and real-world applications.",
            evaluation: "Design reflective assessments that emphasize personal growth, peer feedback, and portfolio development over traditional testing."
        },
        3: { // Official Curriculum
            activities: "Structure sequential learning activities with clear objectives, explicit instructions, and strong alignment to formal curriculum requirements.",
            communication: "Implement formal communication protocols with regular announcements, detailed guidelines, and structured Q&A opportunities.",
            support: "Create comprehensive study guides, detailed rubrics, structured review sessions, and systematic feedback mechanisms.",
            resources: "Develop meticulously organized, curriculum-aligned resources with clear connection to learning outcomes and assessment criteria.",
            evaluation: "Implement criterion-referenced assessments with regular checkpoints, clear mastery targets, and structured remediation opportunities."
        },
        4: { // Straight Facts
            activities: "Design focused learning activities that emphasize key concepts, worked examples, structured practice, and immediate application of knowledge.",
            communication: "Utilize direct, concise messaging with clear expectations, focused instructions, and efficient feedback mechanisms.",
            support: "Create step-by-step guides, targeted FAQs, and specific improvement strategies focused on essential knowledge and skills.",
            resources: "Develop streamlined, fact-focused content that highlights critical information and eliminates extraneous elements.",
            evaluation: "Implement objective assessments with clear metrics, specific feedback, and focus on accuracy and mastery of key concepts."
        },
        5: { // Big Conference
            activities: "Create engaging presentation-based activities with strong visual elements, demonstrations, and opportunities for large group interaction.",
            communication: "Utilize broadcast communications with dynamic delivery, audience engagement features, and professional presentation elements.",
            support: "Develop comprehensive resource libraries, recorded content, and structured Q&A sessions to support independent learning.",
            resources: "Create visually engaging, professionally produced content with emphasis on high production value and audience engagement.",
            evaluation: "Implement large-scale assessments with standardized feedback, comprehensive understanding checks, and automated grading when appropriate."
        },
        6: { // One-Off
            activities: "Design focused mini-lessons, targeted skill development exercises, and standalone learning modules that address specific competencies.",
            communication: "Utilize direct instruction with clear objectives, focused feedback, and specific guidance related to immediate learning goals.",
            support: "Create just-in-time resources, quick reference guides, and targeted assistance focused on specific tasks and challenges.",
            resources: "Develop modular, self-contained learning materials that can be accessed independently when needed for specific skills.",
            evaluation: "Implement immediate assessment with specific feedback and targeted skill checks focused on discrete learning outcomes."
        }
    };
    
    return components[styleId][component] || "Design components that align with your teaching style while meeting student needs in the online environment.";
}

// Function to get online module structure recommendations based on teaching style
function getModuleStructureRecommendations(styleId) {
    const moduleStructures = {
        1: { // All-Round Flexible and Adaptable Teacher
            structure: "Flexible, multi-path module structure with diverse learning resources",
            components: [
                "Multiple forms of content presentation (videos, readings, visualizations)",
                "Variety of assessment types to accommodate different learning preferences",
                "Regular check-in points that adapt based on student progress",
                "Optional extension activities for students who want deeper exploration",
                "Technology tools that support various learning approaches"
            ]
        },
        2: { // Student-Centered, Sensitive Teacher
            structure: "Community-focused module with emphasis on connection and reflection",
            components: [
                "Personal introduction activities and connection-building exercises",
                "Reflective journals and discussion spaces throughout the module",
                "Peer collaboration and group learning activities in small cohorts",
                "Emotionally engaging content with space for personal responses",
                "Supportive feedback mechanisms with emphasis on growth"
            ]
        },
        3: { // Official Curriculum Teacher
            structure: "Systematically structured module with clear learning pathways and objectives",
            components: [
                "Comprehensive module outline with explicit learning outcomes",
                "Structured learning units that align precisely with assessment",
                "Regular formative assessment checkpoints with remediation options",
                "Clear grading policies and academic expectations",
                "Detailed study guides and structured review materials"
            ]
        },
        4: { // Straight Facts No-Nonsense Teacher
            structure: "Direct, fact-focused module with clear progression through concepts",
            components: [
                "Concise, focused content delivery with essential information highlighted",
                "Step-by-step tutorials for complex procedures and concepts",
                "Regular knowledge checks with immediate feedback",
                "Practical application exercises with worked examples",
                "Structured Q&A forums for clarification of content"
            ]
        },
        5: { // Big Conference Teacher
            structure: "Presentation-focused module with engaging multimedia content",
            components: [
                "High-quality lecture videos as primary content delivery method",
                "Large group synchronous sessions with audience response activities",
                "Visually engaging content with professional presentation",
                "Dynamic content delivery with emphasis on maintaining attention",
                "Broadcast announcements and focused communication"
            ]
        },
        6: { // One-Off Teacher
            structure: "Modular, standalone units with focused skill development",
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
            overview: "This teaching style naturally aligns with UDL's principles of providing multiple means of engagement, representation, and action/expression. As an All-Round Flexible and Adaptable Teacher, you possess a remarkable ability to pivot and adjust your teaching methods to meet diverse student needs. Your teaching approach demonstrates a natural inclination toward inclusivity and versatility, making you particularly effective in diverse learning environments. This adaptability is your superpower – you can seamlessly shift between different teaching methods while maintaining high educational standards.",
            learningActivities: [
                "Incorporate varied instructional methods including lectures, group work, and hands-on activities",
                "Design activities that accommodate different skill levels",
                "Use multimedia resources to present content in multiple formats",
                "Implement both individual and collaborative learning opportunities"
            ],
            enhancingEngagement: [
                "Provide choice in assignment formats",
                "Create flexible learning paths",
                "Use technology to support diverse learning needs",
                "Incorporate real-world applications"
            ],
            supportGuidance: [
                "Develop clear rubrics for assignments",
                "Offer multiple channels for student support",
                "Provide scaffolded learning materials",
                "Create accessible resources for all learners"
            ],
            communication: [
                "Use multiple communication channels",
                "Implement regular check-ins",
                "Provide both synchronous and asynchronous options",
                "Maintain consistent feedback loops"
            ],
            evaluation: [
                "Use diverse assessment methods",
                "Implement both formative and summative assessments",
                "Allow multiple attempts when appropriate",
                "Provide opportunities for self-assessment"
            ]
        },
        2: { // Student-Centered, Sensitive Teacher
            overview: "This style aligns with constructivist principles of active learning and knowledge construction through experience. Your empathetic and nurturing approach to teaching creates an environment where students feel valued and understood. As a Student-Centered, Sensitive Teacher, you excel at building meaningful connections with your students and fostering a supportive learning community. Your natural ability to recognize and respond to individual student needs makes you particularly effective at creating inclusive and emotionally safe learning spaces.",
            learningActivities: [
                "Design role-playing scenarios",
                "Implement small group discussions",
                "Use case studies",
                "Create collaborative projects"
            ],
            enhancingEngagement: [
                "Foster emotional connections to content",
                "Create safe spaces for expression",
                "Implement peer learning activities",
                "Use narrative-based learning"
            ],
            supportGuidance: [
                "Provide individualized feedback",
                "Create supportive learning communities",
                "Implement peer mentoring",
                "Offer emotional support resources"
            ],
            communication: [
                "Use empathetic communication strategies",
                "Implement active listening techniques",
                "Create opportunities for student voice",
                "Foster open dialogue"
            ],
            evaluation: [
                "Use reflective assessments",
                "Implement peer evaluation",
                "Create portfolio-based assessments",
                "Focus on growth over grades"
            ]
        },
        3: { // Official Curriculum Teacher
            overview: "This style aligns with systematic, explicit instruction methods focused on clear learning objectives. Your structured and methodical approach to teaching ensures comprehensive coverage of essential learning objectives. As an Official Curriculum Teacher, you excel at creating clear learning pathways and maintaining high academic standards. Your commitment to systematic instruction and careful planning provides students with a solid foundation for academic success.",
            learningActivities: [
                "Create structured lesson plans",
                "Implement clear learning objectives",
                "Use systematic instruction sequences",
                "Design aligned assessments"
            ],
            enhancingEngagement: [
                "Use clear success criteria",
                "Implement progress monitoring",
                "Create milestone achievements",
                "Use competency-based progression"
            ],
            supportGuidance: [
                "Provide detailed study guides",
                "Create structured review sessions",
                "Implement regular office hours",
                "Offer clear assignment guidelines"
            ],
            communication: [
                "Use formal communication channels",
                "Implement regular announcements",
                "Create clear documentation",
                "Maintain consistent messaging"
            ],
            evaluation: [
                "Use criterion-referenced assessments",
                "Implement regular checkpoints",
                "Create clear rubrics",
                "Focus on mastery learning"
            ]
        },
        4: { // Straight Facts No-Nonsense Teacher
            overview: "This style aligns with cognitive approaches focusing on information processing and knowledge organization. Your direct and focused approach to teaching cuts through complexity to deliver clear, actionable knowledge. As a Straight Facts No-Nonsense Teacher, you excel at presenting information in a logical, straightforward manner that resonates with students who appreciate clarity and precision. Your ability to distill complex concepts into manageable components makes you particularly effective at teaching challenging subject matter.",
            learningActivities: [
                "Create clear concept presentations",
                "Implement structured practice",
                "Use worked examples",
                "Design sequential learning activities"
            ],
            enhancingEngagement: [
                "Focus on essential concepts",
                "Use clear examples",
                "Implement immediate application",
                "Create focused learning paths"
            ],
            supportGuidance: [
                "Provide clear instructions",
                "Create step-by-step guides",
                "Implement targeted feedback",
                "Offer specific improvement strategies"
            ],
            communication: [
                "Use direct communication",
                "Implement clear expectations",
                "Create focused messages",
                "Maintain professional boundaries"
            ],
            evaluation: [
                "Use objective assessments",
                "Implement clear metrics",
                "Create specific feedback",
                "Focus on accuracy and mastery"
            ]
        },
        5: { // Big Conference Teacher
            overview: "This style aligns with observational learning and modeling principles. Your dynamic and engaging presentation style captures attention and inspires learning on a larger scale. As a Big Conference Teacher, you excel at creating memorable learning experiences that resonate with large groups of students. Your natural ability to command attention and deliver content in an engaging manner makes you particularly effective in lecture-based and presentation-oriented learning environments.",
            learningActivities: [
                "Design large group presentations",
                "Implement demonstration activities",
                "Use multimedia presentations",
                "Create interactive lectures"
            ],
            enhancingEngagement: [
                "Use audience response systems",
                "Implement dynamic presentations",
                "Create interactive elements",
                "Focus on visual engagement"
            ],
            supportGuidance: [
                "Provide lecture materials",
                "Create resource libraries",
                "Implement Q&A sessions",
                "Offer recorded content"
            ],
            communication: [
                "Use broadcast communications",
                "Implement audience interaction",
                "Create engaging presentations",
                "Maintain professional presence"
            ],
            evaluation: [
                "Use large-scale assessments",
                "Implement automated grading",
                "Create standardized feedback",
                "Focus on comprehensive understanding"
            ]
        },
        6: { // One-Off Teacher
            overview: "This style aligns with focused, experience-based learning opportunities. Your focused and efficient approach to teaching makes you particularly effective at delivering targeted, high-impact learning experiences. As a One-Off Teacher, you excel at creating concentrated learning opportunities that address specific skills or concepts. Your ability to design and deliver focused, standalone learning experiences makes you especially valuable in professional development and skill-based training contexts.",
            learningActivities: [
                "Create targeted mini-lessons",
                "Implement focused tutorials",
                "Use specific skill development",
                "Design standalone modules"
            ],
            enhancingEngagement: [
                "Focus on immediate application",
                "Implement quick wins",
                "Create clear outcomes",
                "Use targeted practice"
            ],
            supportGuidance: [
                "Provide just-in-time support",
                "Create quick reference guides",
                "Implement targeted assistance",
                "Offer specific resources"
            ],
            communication: [
                "Use direct instruction",
                "Implement focused feedback",
                "Create clear objectives",
                "Maintain specific focus"
            ],
            evaluation: [
                "Use immediate assessment",
                "Implement specific feedback",
                "Create targeted checkpoints",
                "Focus on skill mastery"
            ]
        }
    };
    
    // Return the recommendations for the requested style or a default if not found
    return recommendations[styleId] || {
        overview: "Your teaching style represents a unique approach to education that can be enhanced through targeted strategies.",
        learningActivities: [],
        enhancingEngagement: [],
        supportGuidance: [],
        communication: [],
        evaluation: []
    };
}

// Generate PDF content with enhanced instructional design copy
function generatePdfContent(userName, dominantStyle, scores, rankedStyles, institution = '', options = {}) {
    // Set default options
    const defaults = {
        includeProfile: true,
        includeRecommendations: true,
        includeOnline: true
    };
    
    const settings = { ...defaults, ...options };
    
    // Get the detailed recommendations for the dominant style
    const styleRecommendations = getStyleRecommendations(dominantStyle.id);
    const moduleStructure = getModuleStructureRecommendations(dominantStyle.id);
    
    // Build the HTML content based on the selected options
    let htmlContent = `
        <header>
            <h1 class="title">Teaching Style Profile</h1>
            <p class="subtitle">Based on the Staffordshire Evaluation of Teaching Styles (SETS)©</p>
            <p class="user-name">Prepared for: ${userName}${institution ? ` - ${institution}` : ''}</p>
            <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
        </header>
        
        <section class="section introduction-section">
            <h2 class="section-title">Your Pedagogical Identity</h2>
            <p class="intro-text">
                Welcome to your personalized teaching style profile. This report illuminates your unique pedagogical approach and provides evidence-based strategies that align with your natural teaching inclinations. Understanding your teaching identity is a powerful step toward intentional practice and meaningful student engagement. As educators, our teaching styles reflect not only our professional expertise but also our values, beliefs, and approaches to fostering learning environments.
            </p>
            
            <div class="dominant-style">
                <div class="style-info">
                    <h3 class="style-name">${dominantStyle.name}</h3>
                    <p>${dominantStyle.description}</p>
                    <div class="theory-box">
                        <div class="theory-title">Aligned Learning Theory: ${dominantStyle.theory}</div>
                        <p class="theory-description">${getTheoryDescription(dominantStyle.theory)}</p>
                    </div>
                </div>
                <div class="style-score">
                    ${scores[dominantStyle.id]}%
                </div>
            </div>
            
            <p class="style-impact">
                Your dominant teaching style influences how you design learning experiences, facilitate interactions, assess student understanding, and create learning environments. The insights and recommendations in this report build upon your natural strengths while offering pathways for continued professional growth and adaptability across diverse educational contexts.
            </p>
        </section>
    `;
    
    // Add profile section if selected
    if (settings.includeProfile) {
        htmlContent += `
            <section class="section">
                <h2 class="section-title">Teaching Style Profile: Your Pedagogical Ecosystem</h2>
                
                <p class="section-intro">
                    While your dominant teaching style represents your primary approach, your complete profile reveals the rich interplay of multiple teaching modalities that form your pedagogical ecosystem. This multidimensional perspective acknowledges that effective educators often draw from diverse approaches to meet learning objectives and student needs. Understanding your complete profile helps you leverage secondary strengths and identify areas for potential growth.
                </p>
                
                <div class="profile-content">
                    ${rankedStyles.map(style => `
                        <div class="style-item">
                            <h3 class="style-name">${style.name} (${style.score}%)</h3>
                            <p>${style.description}</p>
                            <p class="style-application">
                                <strong>Instructional Impact:</strong> ${getStyleApplication(style.id)}
                            </p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="profile-reflection">
                    <h4>Reflection Opportunity</h4>
                    <p>Consider how your style profile aligns with your teaching context, subject matter, and the diverse needs of your students. What aspects of other teaching styles might you intentionally incorporate to enhance your effectiveness in specific learning scenarios?</p>
                </div>
            </section>
        `;
    }
    
    // Add recommendations section if selected
    if (settings.includeRecommendations) {
        htmlContent += `
            <section class="section">
                <h2 class="section-title">Evidence-Based Practice Recommendations</h2>
                
                <p class="section-intro">
                    The following recommendations are designed to amplify your natural strengths as a ${dominantStyle.name}. These strategies are informed by both educational research and best practices in instructional design. Each category focuses on a different aspect of the teaching and learning process, providing actionable approaches that align with your pedagogical identity while maximizing student engagement and achievement.
                </p>
                
                <p>${styleRecommendations.overview}</p>
                
                <div class="recommendations">
                    <h3 class="subsection-title">Learning Activities: Designing Purposeful Engagement</h3>
                    <p class="subsection-intro">
                        Learning activities form the core of student experience, translating your instructional goals into meaningful engagement. The following activities leverage your strengths as a ${dominantStyle.name} to create authentic learning opportunities:
                    </p>
                    <ul>
                        ${styleRecommendations.learningActivities.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3 class="subsection-title">Enhancing Engagement: Creating Cognitive and Emotional Connection</h3>
                    <p class="subsection-intro">
                        Student engagement encompasses attention, interest, curiosity, and motivation—essential elements for effective learning. These strategies help foster deep engagement through approaches aligned with your teaching style:
                    </p>
                    <ul>
                        ${styleRecommendations.enhancingEngagement.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3 class="subsection-title">Support and Guidance: Scaffolding the Learning Journey</h3>
                    <p class="subsection-intro">
                        Effective learning requires appropriate guidance that provides structure while encouraging autonomy. These support mechanisms leverage your natural approach to mentoring and facilitating:
                    </p>
                    <ul>
                        ${styleRecommendations.supportGuidance.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3 class="subsection-title">Communication: Fostering Clarity and Connection</h3>
                    <p class="subsection-intro">
                        Communication is the vehicle through which teaching and learning unfold. These strategies optimize your communication approach to enhance understanding, build relationships, and create inclusive learning communities:
                    </p>
                    <ul>
                        ${styleRecommendations.communication.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                    
                    <h3 class="subsection-title">Evaluation: Assessing for Growth and Understanding</h3>
                    <p class="subsection-intro">
                        Assessment and evaluation provide insights into student learning while guiding instructional decisions. These evaluation methods align with your approach while providing meaningful feedback for both you and your students:
                    </p>
                    <ul>
                        ${styleRecommendations.evaluation.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="implementation-note">
                    <h4>Implementation Approach</h4>
                    <p>Consider implementing these recommendations incrementally, selecting one or two strategies from each category to integrate into your current practice. Reflection on the impact of these changes will help you refine your approach and build upon successful implementations.</p>
                </div>
            </section>
        `;
    }
    
    // Add online teaching strategies section if selected
    if (settings.includeOnline) {
        htmlContent += `
            <section class="section">
                <h2 class="section-title">Digital Pedagogies: Translating Your Teaching Style to Online Environments</h2>
                
                <p class="section-intro">
                    Online and blended learning environments offer unique opportunities and challenges for educators. This section explores how to effectively translate your teaching style into digital spaces while maintaining pedagogical integrity. The transition to online teaching isn't merely about technology—it's about thoughtfully redesigning learning experiences to leverage both your instructional strengths and the affordances of digital tools.
                </p>
                
                <h3 class="subsection-title">Strategic Approaches for Online Teaching</h3>
                <p class="strategic-intro">
                    As a ${dominantStyle.name}, your distinctive approach can be enhanced through these targeted online teaching strategies that preserve your pedagogical identity while optimizing the digital learning experience:
                </p>
                
                <div class="recommendations">
                    <ul>
                        ${getOnlineTeachingStrategies(dominantStyle.id).map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="online-module">
                    <h3 class="subsection-title">Architecting Your Online Learning Environment</h3>
                    <p class="module-intro">
                        The structure of your online learning environment should reflect your pedagogical approach while incorporating principles of effective digital design. Based on your teaching style profile, we recommend the following framework:
                    </p>
                    
                    <p class="module-approach"><strong>${moduleStructure.structure}</strong></p>
                    
                    <div class="module-components">
                        <p>Key architectural elements to incorporate:</p>
                        <ul>
                            ${moduleStructure.components.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <h3 class="subsection-title">Essential Components of Effective Online Modules</h3>
                    <p class="components-intro">
                        Regardless of teaching style, comprehensive online learning experiences should address five crucial dimensions. The following recommendations show how to adapt each dimension to align with your natural approach as a ${dominantStyle.name}:
                    </p>
                    
                    <div class="component-grid">
                        <div class="component-item">
                            <h4>Learning Activities</h4>
                            <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'activities')}</p>
                        </div>
                        
                        <div class="component-item">
                            <h4>Communication</h4>
                            <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'communication')}</p>
                        </div>
                        
                        <div class="component-item">
                            <h4>Support and Guidance</h4>
                            <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'support')}</p>
                        </div>
                        
                        <div class="component-item">
                            <h4>Resources</h4>
                            <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'resources')}</p>
                        </div>
                        
                        <div class="component-item">
                            <h4>Evaluation</h4>
                            <p>${getStyleSpecificOnlineComponent(dominantStyle.id, 'evaluation')}</p>
                        </div>
                    </div>
                    
                    <div class="digital-integration-note">
                        <h4>Digital Integration Reflection</h4>
                        <p>When developing your online teaching approach, consider how each digital tool and platform serves your pedagogical goals rather than adapting your teaching to fit the technology. Your teaching style should inform technology selection, not be constrained by it.</p>
                    </div>
                </div>
            </section>
            
            <section class="section">
                <h2 class="section-title">Continuing Your Professional Development Journey</h2>
                
                <p class="conclusion-text">
                    Understanding your teaching style profile is just the beginning of a rewarding journey toward pedagogical excellence. As you implement the recommendations in this report, consider maintaining a reflective teaching journal to document your experiences, insights, and the impact on student learning. This reflective practice can deepen your understanding of your teaching identity while guiding intentional growth.
                </p>
                
                <p class="conclusion-text">
                    Remember that teaching styles are not fixed traits but dynamic approaches that evolve through experience, reflection, and professional development. You may find that certain contexts call for adaptations of your natural style or incorporation of elements from other approaches. This flexibility, informed by self-awareness, is a hallmark of teaching excellence.
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
            <p>Generated by Anga Teaching Styles Assessment</p>
            <p>Based on SETS© by Mohanna, Chambers & Wall (2007)</p>
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