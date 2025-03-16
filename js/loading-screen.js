/**
 * loading-screen.js
 * Handles the shared loading screen component across the application
 */

// Create and insert the loading screen when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove any existing loading screens
    const existingLoadingScreens = document.querySelectorAll('.loading-screen');
    existingLoadingScreens.forEach(screen => screen.remove());
    
    // Create the loading screen element
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loadingScreen';
    loadingScreen.className = 'loading-screen';
    
    // Set the HTML content with abstract animation elements
    loadingScreen.innerHTML = `
        <div class="abstract-animation">
            <div class="animation-circle circle-1"></div>
            <div class="animation-circle circle-2"></div>
            <div class="animation-circle circle-3"></div>
            <div class="animation-hexagon"></div>
        </div>
        <div class="loading-progress">
            <div class="loading-bar" id="loadingBar"></div>
        </div>
    `;
    
    // Insert at the beginning of the body
    document.body.insertBefore(loadingScreen, document.body.firstChild);
    
    // Initialize the loading screen functionality
    initLoadingScreen();
    
    // If we're on the results page, make sure the loading screen is active
    if (window.location.pathname.includes('results.html')) {
        loadingScreen.classList.add('active');
    }
});

// Initialize loading screen handler
function initLoadingScreen() {
    // Get loading screen elements
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    
    if (!loadingScreen || !loadingBar) return;
    
    // Function to show loading screen with custom text
    window.showLoadingScreen = function(targetPage) {
        // Show loading screen
        loadingScreen.classList.add('active');
        
        // Reset loading bar to ensure it starts from 0
        loadingBar.style.width = '0%';
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5 + 2;
            
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                
                // Redirect to target page after loading completes
                setTimeout(() => {
                    console.log('Navigation to:', targetPage);
                    window.location.href = targetPage || 'assessment.html';
                }, 500);
            }
            
            loadingBar.style.width = `${progress}%`;
        }, 150);
    };
    
    // Add click event to start assessment button if it exists
    const startButton = document.getElementById('start-assessment');
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoadingScreen('assessment.html');
        });
    }
    
    // Add click event to view results button if it exists
    const viewResultsButton = document.querySelector('#next-button[data-view-results="true"]');
    if (viewResultsButton) {
        viewResultsButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoadingScreen('results.html');
        });
    }
    
    // Add click event to new assessment button if it exists
    const newAssessmentButton = document.getElementById('new-assessment');
    if (newAssessmentButton) {
        newAssessmentButton.addEventListener('click', function(e) {
            e.preventDefault();
            showLoadingScreen('assessment.html?new=true');
        });
    }
} 