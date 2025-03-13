/**
 * app.js
 * Main application functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize floating elements animation
    initFloatingElements();
    
    // Add navigation event listeners
    initNavigation();
    
    // Add smooth scroll animations 
    initSmoothScroll();
    
    // Check for returning users
    checkPreviousSession();
});

// Initialize floating background elements
function initFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    // Create additional decorative elements
    for (let i = 0; i < 8; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-dot');
        
        // Random position, size and delay
        const size = 4 + Math.random() * 8;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 15 + Math.random() * 20;
        
        element.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: ${top}%;
            left: ${left}%;
            background-color: ${Math.random() > 0.5 ? 'var(--horizon-blue)' : 'var(--zenith-green)'};
            border-radius: 50%;
            opacity: ${0.1 + Math.random() * 0.2};
            animation: float ${duration}s ease-in-out infinite alternate;
            animation-delay: -${delay}s;
        `;
        
        container.appendChild(element);
    }
}

// Initialize navigation
function initNavigation() {
    const startButton = document.getElementById('start-assessment');
    
    if (startButton) {
        startButton.addEventListener('click', function() {
            window.location.href = 'assessment.html';
        });
    }
}

// Initialize smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Check if user has a previous session
function checkPreviousSession() {
    const savedResponses = localStorage.getItem('angaAssessmentResponses');
    const savedProgress = localStorage.getItem('angaAssessmentProgress');
    
    if (savedResponses && savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Only show resume option if not completed and has made some progress
        if (progress.currentQuestion > 1 && progress.currentQuestion < 24) {
            // Create and display resume session element
            const landingContent = document.querySelector('.landing-content');
            
            if (landingContent) {
                const resumeSession = document.createElement('div');
                resumeSession.classList.add('resume-session');
                resumeSession.innerHTML = `
                    <div class="resume-card">
                        <div class="resume-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12L14 14M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="var(--horizon-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="resume-content">
                            <h3>Continue your assessment</h3>
                            <p>You have an assessment in progress (Question ${progress.currentQuestion} of 24)</p>
                        </div>
                        <button id="resume-button" class="button button-outline">Resume</button>
                    </div>
                `;
                
                landingContent.appendChild(resumeSession);
                
                // Add event listener to resume button
                document.getElementById('resume-button').addEventListener('click', function() {
                    window.location.href = 'assessment.html?resume=true';
                });
            }
        }
    }
}