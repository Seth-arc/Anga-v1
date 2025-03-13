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