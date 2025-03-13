/**
 * assessment.js
 * Handles the assessment page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the assessment state
    let state = {
        currentQuestion: 0,
        responses: [],
        totalQuestions: scenarios.length
    };
    
    // Get DOM elements
    const scenarioNumber = document.getElementById('scenario-number');
    const scenarioText = document.getElementById('scenario-text');
    const scenarioQuestion = document.getElementById('scenario-question');
    const scenarioIcon = document.querySelector('.scenario-icon');
    const radioInputs = document.querySelectorAll('input[name="response"]');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressFill = document.getElementById('progress-fill');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    
    // Check for resume
    const urlParams = new URLSearchParams(window.location.search);
    const shouldResume = urlParams.get('resume') === 'true';
    
    if (shouldResume) {
        loadSavedState();
    } else {
        // Start fresh
        resetLocalStorage();
    }
    
    // Initialize the UI with the first question
    updateUI();
    
    // Add event listeners
    radioInputs.forEach(input => {
        input.addEventListener('change', handleResponseChange);
    });
    
    prevButton.addEventListener('click', goToPreviousQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    
    // Handle response selection
    function handleResponseChange() {
        const selectedValue = parseInt(document.querySelector('input[name="response"]:checked').value);
        
        // Update or add the response
        const existingResponseIndex = state.responses.findIndex(r => r.questionId === scenarios[state.currentQuestion].id);
        
        if (existingResponseIndex !== -1) {
            state.responses[existingResponseIndex].value = selectedValue;
        } else {
            state.responses.push({
                questionId: scenarios[state.currentQuestion].id,
                value: selectedValue,
                styleMapping: scenarios[state.currentQuestion].styleMapping
            });
        }
        
        // Enable the next button
        nextButton.disabled = false;
        
        // Save state to localStorage
        saveState();
    }
    
    // Go to the next question
    function goToNextQuestion() {
        if (state.currentQuestion < state.totalQuestions - 1) {
            state.currentQuestion++;
            updateUI();
        } else {
            // We're at the last question, go to results
            if (state.responses.length === state.totalQuestions) {
                window.location.href = 'results.html';
            }
        }
    }
    
    // Go to the previous question
    function goToPreviousQuestion() {
        if (state.currentQuestion > 0) {
            state.currentQuestion--;
            updateUI();
        }
    }
    
    // Update the UI based on current state
    function updateUI() {
        const currentScenario = scenarios[state.currentQuestion];
        
        // Update text content
        scenarioNumber.textContent = state.currentQuestion + 1;
        scenarioText.textContent = currentScenario.scenario;
        scenarioQuestion.textContent = currentScenario.question;
        
        // Update progress indicators
        const progressPercentage = (state.responses.length / state.totalQuestions) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        currentQuestionEl.textContent = state.currentQuestion + 1;
        totalQuestionsEl.textContent = state.totalQuestions;
        
        // Update navigation buttons
        prevButton.disabled = state.currentQuestion === 0;
        
        // Check if there's a response for this question
        const currentResponse = state.responses.find(r => r.questionId === currentScenario.id);
        
        // Update radio buttons
        radioInputs.forEach(input => {
            input.checked = false;
        });
        
        if (currentResponse) {
            const radioToCheck = document.querySelector(`input[name="response"][value="${currentResponse.value}"]`);
            if (radioToCheck) {
                radioToCheck.checked = true;
                nextButton.disabled = false;
            }
        } else {
            nextButton.disabled = true;
        }
        
        // Update next button text
        if (state.currentQuestion === state.totalQuestions - 1) {
            nextButton.textContent = 'View Results';
        } else {
            nextButton.textContent = 'Next';
        }
        
        // Update scenario icon (create simple SVG based on scenario ID)
        updateScenarioIcon(currentScenario);
        
        // Add fade-in animation
        scenarioText.classList.remove('fade-in');
        scenarioQuestion.classList.remove('fade-in');
        
        setTimeout(() => {
            scenarioText.classList.add('fade-in');
            scenarioQuestion.classList.add('fade-in');
        }, 50);
    }
    
    // Create a unique icon for each scenario
    function updateScenarioIcon(scenario) {
        const styleMapping = scenario.styleMapping;
        const style = teachingStyles.find(s => s.id === styleMapping);
        const color = style ? style.color : '#0A84FF';
        
        // Create SVG icon based on style and scenario ID
        let svgTemplate = '';
        
        switch (styleMapping) {
            case 1: // Flexible
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="24" fill="${color}" opacity="0.1"/>
                        <path d="M24 24C28 20 36 20 40 24M24 40C28 44 36 44 40 40M20 32H44" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
                break;
            case 2: // Student-centered
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="28" r="8" fill="${color}" opacity="0.1"/>
                        <circle cx="40" cy="28" r="8" fill="${color}" opacity="0.1"/>
                        <circle cx="32" cy="42" r="8" fill="${color}" opacity="0.1"/>
                        <circle cx="24" cy="28" r="3" fill="${color}"/>
                        <circle cx="40" cy="28" r="3" fill="${color}"/>
                        <circle cx="32" cy="42" r="3" fill="${color}"/>
                        <path d="M24 28L32 42L40 28" stroke="${color}" stroke-width="2"/>
                    </svg>
                `;
                break;
            case 3: // Curriculum
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="16" width="32" height="32" rx="4" fill="${color}" opacity="0.1"/>
                        <path d="M20 24H44M20 32H44M20 40H36" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
                break;
            case 4: // Straight facts
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 32L28 44L48 20" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="32" cy="32" r="20" stroke="${color}" stroke-width="2" stroke-dasharray="4 4"/>
                    </svg>
                `;
                break;
            case 5: // Big conference
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="20" cy="24" width="24" height="16" rx="2" fill="${color}" opacity="0.1"/>
                        <circle cx="20" cy="36" r="4" fill="${color}" opacity="0.2"/>
                        <circle cx="32" cy="36" r="4" fill="${color}" opacity="0.2"/>
                        <circle cx="44" cy="36" r="4" fill="${color}" opacity="0.2"/>
                        <circle cx="32" cy="20" r="6" fill="${color}"/>
                    </svg>
                `;
                break;
            case 6: // One-off
                svgTemplate = `
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 24L44 40M44 24L20 40M24 32H40" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="32" cy="32" r="16" stroke="${color}" stroke-width="2"/>
                    </svg>
                `;
                break;
        }
        
        scenarioIcon.innerHTML = svgTemplate;
    }
    
    // Save state to localStorage
    function saveState() {
        localStorage.setItem('angaAssessmentResponses', JSON.stringify(state.responses));
        localStorage.setItem('angaAssessmentProgress', JSON.stringify({
            currentQuestion: state.currentQuestion,
            totalQuestions: state.totalQuestions
        }));
    }
    
    // Load state from localStorage
    function loadSavedState() {
        const savedResponses = localStorage.getItem('angaAssessmentResponses');
        const savedProgress = localStorage.getItem('angaAssessmentProgress');
        
        if (savedResponses && savedProgress) {
            state.responses = JSON.parse(savedResponses);
            const progress = JSON.parse(savedProgress);
            state.currentQuestion = progress.currentQuestion;
        }
    }
    
    // Reset localStorage for a fresh start
    function resetLocalStorage() {
        localStorage.removeItem('angaAssessmentResponses');
        localStorage.removeItem('angaAssessmentProgress');
    }
});