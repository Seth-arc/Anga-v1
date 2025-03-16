/**
 * assessment.js
 * Handles the assessment page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    
    loadingScreen.classList.add('active');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.remove('active');
            }, 300);
        }
        
        loadingBar.style.width = `${progress}%`;
    }, 100);
    
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
    const scaleLabels = document.querySelector('.scale-labels');
    
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
    nextButton.addEventListener('click', function() {
        // Check if we're on the last question and have all responses
        if (state.currentQuestion === state.totalQuestions - 1 && 
            state.responses.length === state.totalQuestions) {
            // Make sure to save the state before navigating
            saveState();
            
            // Use the shared loading screen function if available
            if (typeof showLoadingScreen === 'function') {
                showLoadingScreen('results.html');
            } else {
                // Fallback to direct navigation if the function isn't available
                window.location.href = 'results.html';
            }
        } else {
            // Not the last question, proceed normally
            goToNextQuestion();
        }
    });
    
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
            // Show mini loading animation between questions
            showMiniLoading(() => {
                state.currentQuestion++;
                updateUI();
            });
        }
        // The else case (last question) is now handled in the click event listener
    }
    
    // Go to the previous question
    function goToPreviousQuestion() {
        if (state.currentQuestion > 0) {
            // Show mini loading animation between questions
            showMiniLoading(() => {
                state.currentQuestion--;
                updateUI();
            });
        }
    }
    
    // Show a mini loading animation between questions
    function showMiniLoading(callback) {
        // Fade out current content
        const scenarioCard = document.querySelector('.scenario-card');
        const scenarioContext = document.querySelector('.scenario-context');
        const scenarioPrompt = document.querySelector('.scenario-prompt');
        
        // Remove fade-in classes
        if (scenarioContext && scenarioPrompt) {
            scenarioContext.classList.remove('fade-in');
            scenarioPrompt.classList.remove('fade-in');
        }
        
        scenarioCard.style.opacity = '0';
        scenarioCard.style.transform = 'translateY(10px)';
        
        // Execute callback after short delay
        setTimeout(() => {
            callback();
            
            // Fade in new content
            setTimeout(() => {
                scenarioCard.style.opacity = '1';
                scenarioCard.style.transform = 'translateY(0)';
            }, 50);
        }, 300);
    }
    
    // Determine appropriate scale labels based on the question
    function getScaleLabelsForQuestion(question) {
        // Default labels
        let leftLabel = "Strongly Disagree";
        let middleLabel = "Neutral";
        let rightLabel = "Strongly Agree";
        
        // Check for specific question patterns and set appropriate labels
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes("how comfortable")) {
            leftLabel = "Very Uncomfortable";
            middleLabel = "Neutral";
            rightLabel = "Very Comfortable";
        } 
        else if (questionLower.includes("how likely")) {
            leftLabel = "Very Unlikely";
            middleLabel = "Somewhat Likely";
            rightLabel = "Very Likely";
        }
        else if (questionLower.includes("how important")) {
            leftLabel = "Not Important";
            middleLabel = "Moderately Important";
            rightLabel = "Very Important";
        }
        else if (questionLower.includes("how much")) {
            leftLabel = "Very Little";
            middleLabel = "Moderately";
            rightLabel = "Very Much";
        }
        else if (questionLower.includes("how often")) {
            leftLabel = "Very Rarely";
            middleLabel = "Sometimes";
            rightLabel = "Very Often";
        }
        else if (questionLower.includes("how effective")) {
            leftLabel = "Not Effective";
            middleLabel = "Moderately Effective";
            rightLabel = "Very Effective";
        }
        else if (questionLower.includes("how confident")) {
            leftLabel = "Not Confident";
            middleLabel = "Somewhat Confident";
            rightLabel = "Very Confident";
        }
        else if (questionLower.includes("how willing")) {
            leftLabel = "Not Willing";
            middleLabel = "Somewhat Willing";
            rightLabel = "Very Willing";
        }
        else if (questionLower.includes("how frequently")) {
            leftLabel = "Very Infrequently";
            middleLabel = "Occasionally";
            rightLabel = "Very Frequently";
        }
        
        return { leftLabel, middleLabel, rightLabel };
    }
    
    // Update the UI based on current state
    function updateUI() {
        const currentScenario = scenarios[state.currentQuestion];
        
        // Update text content
        scenarioNumber.textContent = state.currentQuestion + 1;
        
        // Split the scenario text and question if needed
        const scenarioContent = parseScenarioContent(currentScenario.scenario, currentScenario.question);
        scenarioText.textContent = scenarioContent.context;
        scenarioQuestion.textContent = scenarioContent.question;
        
        // Update scale labels based on the question
        const { leftLabel, middleLabel, rightLabel } = getScaleLabelsForQuestion(currentScenario.question);
        const labelElements = scaleLabels.querySelectorAll('span');
        if (labelElements.length >= 3) {
            labelElements[0].textContent = leftLabel;
            labelElements[1].textContent = middleLabel;
            labelElements[2].textContent = rightLabel;
        }
        
        // Update progress indicators
        const progressPercentage = ((state.currentQuestion + 1) / state.totalQuestions) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update the progress text with proper formatting for the gradient effect
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
            }
        }
        
        // Update next button text
        if (state.currentQuestion === state.totalQuestions - 1) {
            nextButton.textContent = 'Finish';
        } else {
            nextButton.textContent = 'Next';
        }
        
        // Update scenario icon
        updateScenarioIcon(currentScenario);
        
        // Add fade-in animation to scenario content
        const scenarioContext = document.querySelector('.scenario-context');
        const scenarioPrompt = document.querySelector('.scenario-prompt');
        
        if (scenarioContext && scenarioPrompt) {
            scenarioContext.classList.remove('fade-in');
            scenarioPrompt.classList.remove('fade-in');
            
            setTimeout(() => {
                scenarioContext.classList.add('fade-in');
                
                // Add a slight delay for the question to appear after the context
                setTimeout(() => {
                    scenarioPrompt.classList.add('fade-in');
                }, 200);
            }, 50);
        }
    }
    
    // Parse scenario content to separate context from question
    function parseScenarioContent(scenarioText, questionText) {
        // If the scenario already contains the question, extract it
        if (scenarioText.includes(questionText)) {
            const contextPart = scenarioText.replace(questionText, '').trim();
            return {
                context: contextPart,
                question: questionText
            };
        }
        
        // Check if the scenario ends with a question mark - if so, try to split at the last sentence
        if (scenarioText.trim().endsWith('?')) {
            // Find the last sentence that ends with a question mark
            const lastQuestionMarkIndex = scenarioText.lastIndexOf('?');
            if (lastQuestionMarkIndex > 0) {
                // Find the start of the question (look for the previous period or beginning of text)
                let questionStartIndex = scenarioText.lastIndexOf('.', lastQuestionMarkIndex - 1);
                questionStartIndex = questionStartIndex === -1 ? 0 : questionStartIndex + 1;
                
                const extractedQuestion = scenarioText.substring(questionStartIndex, lastQuestionMarkIndex + 1).trim();
                const extractedContext = scenarioText.substring(0, questionStartIndex).trim();
                
                return {
                    context: extractedContext,
                    question: extractedQuestion || questionText // Fallback to provided question if extraction fails
                };
            }
        }
        
        // Otherwise, return them as provided
        return {
            context: scenarioText,
            question: questionText
        };
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