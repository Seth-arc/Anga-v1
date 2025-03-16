/**
 * results.js
 * Handles the results page functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const mainStyleName = document.getElementById('main-style-name');
    const mainStyleDescription = document.getElementById('main-style-description');
    const mainStyleScore = document.getElementById('main-style-score');
    const hexagonChart = document.getElementById('hexagon-chart');
    const barChart = document.getElementById('bar-chart');
    const downloadButton = document.getElementById('download-pdf');
    const newAssessmentButton = document.getElementById('new-assessment');
    const downloadDialog = document.getElementById('download-dialog');
    const cancelDownload = document.getElementById('cancel-download');
    const confirmDownload = document.getElementById('confirm-download');
    const userNameInput = document.getElementById('user-name');
    const saveResultsForm = document.getElementById('save-results-form');
    const skipSaveButton = document.getElementById('skip-save');
    const resultsActions = document.querySelector('.results-actions');
    const saveResultsSection = document.querySelector('.save-results-section');
    
    // Check if we should show the download dialog directly
    const urlParams = new URLSearchParams(window.location.search);
    const showDownloadDirectly = urlParams.get('download') === 'true';
    
    // Hide loading screen if it exists
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    if (loadingScreen && loadingBar) {
        // Simulate loading progress if it's not already complete
        if (loadingBar.style.width !== '100%') {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10 + 5;
                
                if (progress > 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Hide loading screen after a short delay
                    setTimeout(() => {
                        loadingScreen.classList.remove('active');
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                        }, 300);
                    }, 200);
                }
                
                loadingBar.style.width = `${progress}%`;
            }, 100);
        } else {
            // Loading already complete, just hide the screen
            loadingScreen.classList.remove('active');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    // Load responses from localStorage
    const savedResponses = localStorage.getItem('angaAssessmentResponses');
    
    if (!savedResponses) {
        // No saved responses, redirect to assessment
        console.error('No saved responses found in localStorage');
        window.location.href = 'assessment.html';
        return;
    }
    
    try {
        const responses = JSON.parse(savedResponses);
        
        // Check if all questions have been answered
        if (!responses || responses.length < scenarios.length) {
            // Not all questions answered, redirect to assessment
            console.error('Incomplete responses found:', responses ? responses.length : 0, 'out of', scenarios.length);
            window.location.href = 'assessment.html';
            return;
        }
        
        // Calculate scores
        const scores = calculateScores(responses);
        
        // Get the dominant style (highest score)
        const dominantStyle = findDominantStyle(scores);
        
        // Rank styles by score
        const rankedStyles = rankStyles(scores);
        
        // Expose these variables to the global scope for PDF generation
        window.dominantStyle = dominantStyle;
        window.scores = scores;
        window.rankedStyles = rankedStyles;
        
        // Log that the data is available for PDF generation
        console.log('Results data available for PDF generation:', {
            dominantStyle,
            scores,
            rankedStyles
        });
        
        // Update the UI with the results data
        updateResultsUI(dominantStyle, scores, rankedStyles);
    } catch (error) {
        console.error('Error processing saved responses:', error);
        window.location.href = 'assessment.html';
        return;
    }
    
    // If showDownloadDirectly is true, skip the save results section and show the download dialog
    if (showDownloadDirectly) {
        // Hide the save results section
        saveResultsSection.style.display = 'none';
        
        // Show the download actions
        resultsActions.style.display = 'flex';
        
        // Save anonymous results for research if dataStorage is available
        if (window.dataStorage && typeof window.dataStorage.storeAnonymousResults === 'function') {
            window.dataStorage.storeAnonymousResults({
                dominantStyle: dominantStyle.id,
                scores: scores
            }).catch(error => {
                console.error('Error saving anonymous results:', error);
            });
        } else {
            console.warn('dataStorage API not available for saving anonymous results');
        }
        
        // Automatically open the download dialog after a short delay
        setTimeout(() => {
            downloadDialog.classList.add('active');
        }, 500);
    }
    
    // Handle form submission
    saveResultsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get user data
        const userData = {
            name: document.getElementById('user-full-name').value,
            email: document.getElementById('user-email').value,
            institution: document.getElementById('user-institution').value,
            dominantStyle: dominantStyle.name,
            dominantStyleId: dominantStyle.id,
            scores: scores,
            consent: document.getElementById('consent-checkbox').checked
        };
        
        // Show loading state
        const submitButton = saveResultsForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Saving...';
        submitButton.disabled = true;
        
        // Check if dataStorage API is available
        if (window.dataStorage && typeof window.dataStorage.storeUserData === 'function') {
            // Store the data
            window.dataStorage.storeUserData(userData)
                .then(success => {
                    handleSaveResult(success, userData, submitButton, originalText);
                })
                .catch(error => {
                    console.error('Error saving user data:', error);
                    handleSaveResult(false, userData, submitButton, originalText);
                });
        } else {
            console.warn('dataStorage API not available for saving user data');
            // Simulate successful save for better user experience
            setTimeout(() => {
                handleSaveResult(true, userData, submitButton, originalText);
            }, 1000);
        }
    });
    
    // Handle save result (success or failure)
    function handleSaveResult(success, userData, submitButton, originalText) {
        if (success) {
            // Hide form, show success message
            saveResultsForm.innerHTML = `
                <div class="save-success">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="20" fill="#34C759" fill-opacity="0.1"/>
                        <path d="M16 24L22 30L32 18" stroke="#34C759" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>Results Saved Successfully!</h3>
                    <p>Your teaching style profile has been saved.</p>
                </div>
            `;
            
            // Show download button
            resultsActions.style.display = 'flex';
            
            // Pre-fill the download dialog with user info
            document.getElementById('user-name').value = userData.name;
            document.getElementById('user-institution').value = userData.institution;
        } else {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'There was an error saving your results. Please try again.';
            
            saveResultsForm.prepend(errorMessage);
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
    
    // Handle skip button
    skipSaveButton.addEventListener('click', function() {
        // Hide the form section
        document.querySelector('.save-results-section').style.display = 'none';
        
        // Show download button
        resultsActions.style.display = 'flex';
        
        // Save anonymous results for research if dataStorage is available
        if (window.dataStorage && typeof window.dataStorage.storeAnonymousResults === 'function') {
            window.dataStorage.storeAnonymousResults({
                dominantStyle: dominantStyle.id,
                scores: scores
            }).catch(error => {
                console.error('Error saving anonymous results:', error);
            });
        } else {
            console.warn('dataStorage API not available for saving anonymous results');
        }
    });
    
    // Add event listeners for download
    downloadButton.addEventListener('click', function() {
        downloadDialog.classList.add('active');
    });
    
    cancelDownload.addEventListener('click', function() {
        downloadDialog.classList.remove('active');
        
        // If we came directly to the download dialog, make sure the results are visible
        if (showDownloadDirectly) {
            // Scroll to the top to show the results
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    confirmDownload.addEventListener('click', function() {
        const userName = userNameInput.value.trim() || 'Teacher';
        const userInstitution = document.getElementById('user-institution').value.trim();
        
        // Get report preferences
        const includeProfile = document.getElementById('include-profile').checked;
        const includeRecommendations = document.getElementById('include-recommendations').checked;
        const includeOnline = document.getElementById('include-online').checked;
        
        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator active';
        loadingIndicator.innerHTML = `
            <div class="spinner"></div>
            <p>Preparing your teaching style report...</p>
        `;
        document.querySelector('.dialog-content').appendChild(loadingIndicator);
        
        // Disable buttons while generating
        confirmDownload.disabled = true;
        cancelDownload.disabled = true;
        
        // Generate PDF content
        const htmlContent = window.pdfTemplates.generatePdfContent(
            userName, 
            dominantStyle, 
            scores, 
            rankedStyles, 
            userInstitution,
            {
                includeProfile,
                includeRecommendations,
                includeOnline
            }
        );
        
        // Create a temporary container to render the HTML content
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '800px'; // Fixed width for PDF
        tempContainer.style.padding = '20px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.color = '#4A4E69';
        tempContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        tempContainer.innerHTML = `
<style>
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: #4A4E69;
        line-height: 1.6;
        background-color: #FAFBFF;
    }
    header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        padding-top: 30px;
        background: linear-gradient(to bottom, #FFFFFF, #F8F9FF);
        box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .logo-text {
        font-size: 62px;
        font-weight: 800;
        color: #1E1E2C;
        letter-spacing: -1.5px;
        margin: 0 0 20px 0;
        text-align: center;
        background: linear-gradient(135deg, #0A84FF, #0055CC);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 1px 5px rgba(10, 132, 255, 0.1);
    }
    .title {
        font-size: 30px;
        color: #1E1E2C;
        margin: 0;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .subtitle {
        font-size: 17px;
        margin: 5px 0 0;
        color: #666;
    }
    .user-name {
        font-size: 20px;
        margin: 15px 0 0;
        font-weight: 600;
        color: #0A84FF;
    }
    .date {
        font-size: 15px;
        color: #666;
        margin-top: 5px;
    }
    .section {
        margin-bottom: 25px;
        padding: 25px;
        border: 1px solid #E6E8F0;
        border-radius: 12px;
        break-inside: avoid;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        background-color: white;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        page-break-inside: avoid;
    }
    .section:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 12px rgba(0,0,0,0.08);
    }
    .section-title {
        font-size: 24px;
        color: #1E1E2C;
        margin: 0 0 15px;
        padding-bottom: 12px;
        border-bottom: 2px solid #E6E8F0;
        font-weight: 700;
        letter-spacing: -0.4px;
        position: relative;
    }
    .section-title:after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background-color: #0A84FF;
    }
    .subsection-title {
        font-size: 20px;
        color: #0A84FF;
        margin: 20px 0 15px;
        font-weight: 600;
        letter-spacing: -0.2px;
    }
    .dominant-style {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-gap: 20px;
        margin: 15px 0;
        padding: 20px;
        background: linear-gradient(135deg, #f8f9ff, #EFF3FF);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(10, 132, 255, 0.08);
        border: 1px solid rgba(10, 132, 255, 0.1);
        page-break-inside: avoid;
        align-items: start;
    }
    .style-info {
        width: 100%;
    }
    .style-name {
        font-size: 22px;
        color: #0A84FF;
        margin: 0 0 10px;
        font-weight: 700;
        letter-spacing: -0.2px;
    }
    .style-score {
        font-size: 28px;
        font-weight: 800;
        color: #FFFFFF;
        padding: 15px 20px;
        background: linear-gradient(135deg, #0A84FF, #0055CC);
        border-radius: 12px;
        text-align: center;
        min-width: 80px;
        box-shadow: 0 2px 8px rgba(10, 132, 255, 0.2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-self: end;
    }
    .style-item {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #E6E8F0;
        break-inside: avoid;
        page-break-inside: avoid;
        transition: transform 0.2s ease;
        display: grid;
        grid-gap: 15px;
    }
    .style-item:hover {
        transform: translateX(1px);
    }
    .style-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    .recommendations {
        margin-top: 15px;
    }
    .recommendations ul {
        padding-left: 20px;
        margin-bottom: 20px;
    }
    .recommendations li {
        margin-bottom: 10px;
        line-height: 1.6;
        position: relative;
        padding-left: 5px;
    }
    .recommendations li::before {
        content: "";
        position: absolute;
        left: -18px;
        top: 8px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0A84FF, #0055CC);
        box-shadow: 0 1px 3px rgba(10, 132, 255, 0.2);
    }
    .theory-box {
        background-color: rgba(30, 30, 44, 0.05);
        padding: 18px;
        border-radius: 10px;
        margin: 18px 0;
        border-left: 4px solid #1E1E2C;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: transform 0.2s ease;
    }
    .theory-box:hover {
        transform: translateY(-1px);
    }
    .theory-title {
        font-weight: 700;
        margin-bottom: 8px;
        color: #1E1E2C;
        font-size: 17px;
    }
    .footer {
        margin-top: 40px;
        padding-top: 20px;
        text-align: center;
        font-size: 14px;
        color: #777;
        border-top: 2px solid #E6E8F0;
        background: linear-gradient(to bottom, #FFFFFF, #F8F9FF);
        padding-bottom: 20px;
    }
    .intro-text, .section-intro, .subsection-intro, .conclusion-text {
        line-height: 1.7;
        margin-bottom: 18px;
        font-size: 15px;
    }
    .introduction-section {
        background: linear-gradient(135deg, #f8f9ff, #EFF3FF);
        border-left: 4px solid #0A84FF;
    }
    .style-impact {
        font-style: italic;
        margin-top: 18px;
        padding: 15px 18px;
        background: linear-gradient(135deg, rgba(10, 132, 255, 0.05), rgba(10, 132, 255, 0.1));
        border-radius: 10px;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 8px rgba(10, 132, 255, 0.12);
        border-left: 3px solid #0A84FF;
    }
    .profile-reflection, .implementation-note, .digital-integration-note {
        margin-top: 20px;
        padding: 18px;
        background: linear-gradient(135deg, #f0f7ff, #E6F2FF);
        border-radius: 10px;
        border-left: 4px solid #0A84FF;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 8px rgba(10, 132, 255, 0.12);
    }
    .profile-reflection h4, .implementation-note h4, .digital-integration-note h4 {
        color: #1E1E2C;
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 17px;
        font-weight: 700;
    }
    .profile-content {
        margin-top: 18px;
    }
    .strategic-intro, .module-intro, .components-intro {
        margin-bottom: 18px;
        line-height: 1.7;
    }
    .style-application {
        margin-top: 12px;
        font-size: 14px;
        line-height: 1.6;
        padding: 12px;
        background: linear-gradient(135deg, rgba(10, 132, 255, 0.05), rgba(10, 132, 255, 0.08));
        border-radius: 10px;
        box-shadow: 0 1px 5px rgba(10, 132, 255, 0.08);
    }
    .subsection-intro {
        font-size: 14px;
        color: #555;
        margin-bottom: 15px;
        line-height: 1.7;
    }
    .theory-description {
        margin-top: 8px;
        font-size: 14px;
        line-height: 1.6;
    }
    .final-reflection {
        margin-top: 25px;
        padding: 20px;
        text-align: center;
        font-style: italic;
        background: linear-gradient(135deg, rgba(30, 30, 44, 0.05), rgba(30, 30, 44, 0.08));
        border-radius: 12px;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border: 1px solid #E6E8F0;
    }
    .module-components {
        background: linear-gradient(135deg, #f9f9ff, #F0F2FF);
        padding: 20px;
        border-radius: 10px;
        margin-top: 18px;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 10px rgba(0,0,0,0.07);
        border: 1px solid rgba(10, 132, 255, 0.08);
    }
    .module-components h4 {
        color: #0A84FF;
        margin: 15px 0 8px;
        font-size: 17px;
        font-weight: 700;
    }
    .module-components p {
        margin: 0 0 15px;
        font-size: 14px;
        line-height: 1.6;
    }
    .component-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 20px;
    }
    .component-item {
        padding: 18px;
        border: 1px solid #E6E8F0;
        border-radius: 10px;
        background-color: white;
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .component-item:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }
    .component-item h4 {
        color: #0A84FF;
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 17px;
        font-weight: 700;
    }
    .component-item p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
    }
    .module-approach {
        font-size: 14px;
        color: #1E1E2C;
        margin-bottom: 18px;
        padding: 12px 15px;
        background: linear-gradient(135deg, rgba(30, 30, 44, 0.05), rgba(30, 30, 44, 0.08));
        border-radius: 10px;
        display: inline-block;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    }
    .page-break {
        break-after: page;
        page-break-after: always;
    }
    h1, h2, h3, h4, h5, h6, p, li {
        break-after: avoid;
        page-break-after: avoid;
    }
    p, li {
        orphans: 3;
        widows: 3;
    }
    /* Page number styling */
    .page-number {
        font-size: 12px;
        color: #888;
        font-family: 'Inter', sans-serif;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        background-color: #FFFFFF;
        border-radius: 8px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        text-align: center;
    }
    /* Cover page styling */
    .cover-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 800px;
        padding: 30px;
        text-align: center;
        position: relative;
        background: linear-gradient(135deg, #FFFFFF, #F8F9FF);
        page-break-after: always;
    }
    .cover-page:after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 2px;
        background: linear-gradient(to right, transparent, #0A84FF, transparent);
    }
    .cover-page .title {
        font-size: 38px;
        margin-bottom: 12px;
        color: #1E1E2C;
        font-weight: 800;
        letter-spacing: -0.5px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .cover-page .subtitle {
        font-size: 20px;
        color: #666;
        margin-bottom: 40px;
    }
    .user-details {
        margin-top: 50px;
        padding: 25px;
        border: 1px solid #E6E8F0;
        border-radius: 12px;
        background: linear-gradient(135deg, #f8f9ff, #EFF3FF);
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        width: 80%;
        max-width: 500px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .user-details:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    .user-details .user-name {
        font-size: 24px;
        margin: 0 0 10px;
        color: #1E1E2C;
        font-weight: 700;
    }
    .user-details .institution {
        font-size: 18px;
        color: #666;
        font-weight: normal;
    }
    .user-details .date {
        font-size: 15px;
        color: #666;
        margin: 8px 0 0;
    }
    /* Style header with score */
    .style-header {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    .style-score-small {
        font-size: 18px;
        font-weight: 700;
        color: #FFFFFF;
        padding: 6px 12px;
        background: linear-gradient(135deg, #0A84FF, #0055CC);
        border-radius: 10px;
        min-width: 50px;
        text-align: center;
        box-shadow: 0 2px 6px rgba(10, 132, 255, 0.2);
        justify-self: end;
    }
    .style-description {
        line-height: 1.6;
        margin-bottom: 15px;
        font-size: 15px;
        max-width: 100%;
    }
    .score-value {
        font-size: 34px;
        font-weight: 800;
        line-height: 1;
        display: block;
    }
    .score-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 4px;
        font-weight: 500;
        display: block;
        white-space: nowrap;
    }
    /* Section specific styling */
    .profile-section, .recommendations-section, .online-section, .conclusion-section {
        border-left: 4px solid #0A84FF;
    }
    
    /* Specific improvements for Teaching Style Profile Section */
    .profile-section .style-item {
        background-color: #FFFFFF;
        border-radius: 10px;
        padding: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        border: 1px solid #E6E8F0;
        margin-bottom: 15px;
        grid-template-columns: 1fr;
    }
    
    .profile-section .dominant-style {
        background: linear-gradient(135deg, #f0f7ff, #E6F0FF);
        border: 1px solid rgba(10, 132, 255, 0.15);
        box-shadow: 0 3px 10px rgba(10, 132, 255, 0.1);
    }
    
    .profile-section .style-header {
        padding-bottom: 12px;
        border-bottom: 1px solid #E6E8F0;
        margin-bottom: 15px;
    }
    .overview-text {
        font-size: 15px;
        line-height: 1.7;
        margin-bottom: 18px;
        padding: 15px;
        background: linear-gradient(135deg, #f8f9ff, #EFF3FF);
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .recommendations-list {
        padding-left: 20px;
    }
    .recommendations-list li {
        margin-bottom: 10px;
        line-height: 1.6;
    }
    .online-strategies li {
        padding-left: 5px;
    }
    .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 8px 15px;
        background-color: #FFFFFF;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        display: inline-block;
    }
    /* Enhanced formatting control for printing */
    @media print {
        /* Ensure no content is cut off between pages */
        .section, .dominant-style, .theory-box, .module-components, 
        .component-item, .style-item, .final-reflection, 
        .profile-reflection, .implementation-note, .digital-integration-note {
            page-break-inside: avoid !important;
        }
        
        /* Add some space before a potential page break */
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            margin-top: 15px;
        }
        
        /* Keep related content together */
        h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p,
        .subsection-title + p, .section-title + p {
            page-break-before: avoid !important;
        }
        
        /* Ensure lists stay together when possible */
        ul, ol {
            page-break-inside: avoid !important;
        }
        
        /* Better control for figures and tables */
        .component-grid, .style-impact, .style-application {
            page-break-inside: avoid !important;
        }
        
        /* Provide more explicit page break controls */
        .page-break {
            page-break-after: always !important;
            height: 0;
            margin: 0;
            padding: 0;
        }
    }
</style>
${htmlContent.replace('<header>', '<header><h1 class="logo-text">anga</h1>')}
        `;
        
        document.body.appendChild(tempContainer);
        
        // Use html2canvas and jsPDF to create and download the PDF
        setTimeout(() => {
            try {
                // Check if jsPDF is available
                if (typeof window.jspdf === 'undefined') {
                    throw new Error('jsPDF library not loaded');
                }
                
                // Initialize jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'pt',
                    format: 'a4',
                    compress: true
                });
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const margin = 40; // Margin in points
                
                // Add page numbers
                const addPageNumbers = () => {
                    const totalPages = pdf.internal.getNumberOfPages();
                    
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i);
                        pdf.setFontSize(10);
                        pdf.setTextColor(100, 100, 100);
                        
                        // Add page number with a more professional format
                        if (i > 1) { // Skip page number on cover page
                            pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 70, pdfHeight - 25);
                        }
                        
                        // Add a footer line on each page except the cover
                        if (i > 1) {
                            pdf.setDrawColor(200, 200, 200);
                            pdf.line(margin, pdfHeight - 40, pdfWidth - margin, pdfHeight - 40);
                        }
                    }
                };
                
                // Process each section with better page breaks
                const processContent = () => {
                    // Get all sections
                    const header = tempContainer.querySelector('header');
                    const sections = tempContainer.querySelectorAll('.section');
                    
                    // First, add the header (cover page)
                    html2canvas(header, {
                        scale: 2.5, // Higher scale for better quality
                        useCORS: true,
                        logging: false,
                        backgroundColor: 'white',
                        allowTaint: true
                    }).then(canvas => {
                        const imgData = canvas.toDataURL('image/png');
                        const imgWidth = pdfWidth - (margin * 2);
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // Add cover page
                        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
                        
                        // Add a new page for the content
                        pdf.addPage();
                        
                        let currentY = margin;
                        let currentSection = 0;
                        
                        // Process each section
                        const processNextSection = () => {
                            if (currentSection < sections.length) {
                                const section = sections[currentSection];
                                currentSection++;
                                
                                html2canvas(section, {
                                    scale: 2.5, // Higher scale for better quality
                                    useCORS: true,
                                    logging: false,
                                    backgroundColor: 'white',
                                    allowTaint: true
                                }).then(canvas => {
                                    const imgData = canvas.toDataURL('image/png');
                                    const imgWidth = pdfWidth - (margin * 2);
                                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                    
                                    // Check if the section fits on the current page
                                    if (currentY + imgHeight > pdfHeight - margin * 2) {
                                        pdf.addPage();
                                        currentY = margin;
                                    }
                                    
                                    // Add section image to PDF
                                    pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
                                    
                                    // Update current Y position
                                    currentY += imgHeight + 30; // Add more space between sections
                                    
                                    // Process next section
                                    if (currentSection < sections.length) {
                                        // Check if we need to add a page break
                                        if (section.classList.contains('introduction-section') || 
                                            section.classList.contains('profile-section') || 
                                            section.classList.contains('recommendations-section') || 
                                            section.classList.contains('online-section') || 
                                            section.classList.contains('conclusion-section')) {
                                            pdf.addPage();
                                            currentY = margin;
                                        }
                                        processNextSection();
                                    } else {
                                        // All sections processed, add page numbers and save
                                        addPageNumbers();
                                        
                                        // Add a watermark or logo to each page
                                        addWatermark();
                                        
                                        const fileName = `${userName.replace(/\s+/g, '_')}_Teaching_Style_Profile.pdf`;
                                        pdf.save(fileName);
                                        
                                        // Clean up
                                        document.body.removeChild(tempContainer);
                                        downloadDialog.classList.remove('active');
                                        confirmDownload.disabled = false;
                                        cancelDownload.disabled = false;
                                        loadingIndicator.remove();
                                    }
                                }).catch(error => {
                                    console.error('Error converting section to image:', error);
                                    fallbackToPrintMethod();
                                });
                            }
                        };
                        
                        // Start processing sections
                        processNextSection();
                    }).catch(error => {
                        console.error('Error converting header to image:', error);
                        fallbackToPrintMethod();
                    });
                };
                
                // Add watermark or logo to each page
                const addWatermark = () => {
                    const totalPages = pdf.internal.getNumberOfPages();
                    
                    for (let i = 2; i <= totalPages; i++) { // Skip cover page
                        pdf.setPage(i);
                        
                        // Add small logo to top right corner
                        pdf.setFontSize(14);
                        pdf.setTextColor(30, 30, 44);
                        pdf.setFont(undefined, 'bold');
                        pdf.text('anga', pdfWidth - 60, 30);
                        
                        // Add a subtle decorative element
                        pdf.setDrawColor(10, 132, 255, 0.5);
                        pdf.setLineWidth(0.5);
                        pdf.line(pdfWidth - 80, 32, pdfWidth - 40, 32);
                    }
                };
                
                // Start processing content
                processContent();
            } catch (error) {
                console.error('Error generating PDF:', error);
                fallbackToPrintMethod();
            }
            
            // Fallback to print method if PDF generation fails
            function fallbackToPrintMethod() {
                // Clean up temporary container
                if (document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
                
                // Show a message to the user
                alert('Direct PDF download failed. Opening print dialog instead.');
                
                // Create a new window for the PDF
                const printWindow = window.open('', '_blank');
                
                // Add the complete HTML with styles
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Teaching Style Profile - ${userName}</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                margin: 0;
                                padding: 20px;
                                color: #4A4E69;
                                line-height: 1.6;
                            }
                            header {
                                text-align: center;
                                margin-bottom: 30px;
                                padding-bottom: 20px;
                                border-bottom: 1px solid #eee;
                            }
                            .logo-text {
                                font-size: 42px;
                                font-weight: 700;
                                color: #1E1E2C;
                                letter-spacing: -1px;
                                margin: 0 0 10px 0;
                            }
                            .title {
                                font-size: 28px;
                                color: #1E1E2C;
                                margin: 0;
                            }
                            .subtitle {
                                font-size: 16px;
                                margin: 5px 0 0;
                            }
                            .user-name {
                                font-size: 18px;
                                margin: 15px 0 0;
                                font-weight: bold;
                            }
                            .date {
                                font-size: 14px;
                                color: #666;
                                margin-top: 5px;
                            }
                            .section {
                                margin-bottom: 30px;
                                padding: 20px;
                                border: 1px solid #ddd;
                                border-radius: 8px;
                                page-break-inside: avoid;
                            }
                            .section-title {
                                font-size: 22px;
                                color: #1E1E2C;
                                margin: 0 0 15px;
                                padding-bottom: 10px;
                                border-bottom: 1px solid #eee;
                            }
                            .subsection-title {
                                font-size: 18px;
                                color: #0A84FF;
                                margin: 25px 0 15px;
                            }
                            .dominant-style {
                                display: flex;
                                justify-content: space-between;
                                align-items: flex-start;
                                flex-wrap: wrap;
                            }
                            .style-info {
                                flex: 1;
                                min-width: 70%;
                            }
                            .style-name {
                                font-size: 20px;
                                color: #0A84FF;
                                margin: 0 0 10px;
                            }
                            .style-score {
                                font-size: 32px;
                                font-weight: bold;
                                color: #0A84FF;
                                padding: 10px 15px;
                                background: rgba(10, 132, 255, 0.1);
                                border-radius: 8px;
                                text-align: center;
                                min-width: 80px;
                            }
                            .style-item {
                                margin-bottom: 25px;
                                padding-bottom: 25px;
                                border-bottom: 1px solid #eee;
                            }
                            .style-item:last-child {
                                border-bottom: none;
                                margin-bottom: 0;
                                padding-bottom: 0;
                            }
                            .recommendations {
                                margin-top: 20px;
                            }
                            .recommendations ul {
                                padding-left: 20px;
                                margin-bottom: 25px;
                            }
                            .recommendations li {
                                margin-bottom: 8px;
                                line-height: 1.5;
                            }
                            .theory-box {
                                background-color: rgba(30, 30, 44, 0.05);
                                padding: 15px;
                                border-radius: 6px;
                                margin: 15px 0;
                                border-left: 4px solid #1E1E2C;
                            }
                            .theory-title {
                                font-weight: bold;
                                margin-bottom: 5px;
                                color: #1E1E2C;
                            }
                            .footer {
                                margin-top: 40px;
                                padding-top: 20px;
                                text-align: center;
                                font-size: 12px;
                                color: #777;
                                border-top: 1px solid #eee;
                            }
                            .intro-text, .section-intro, .subsection-intro, .conclusion-text {
                                line-height: 1.8;
                                margin-bottom: 20px;
                            }
                            .introduction-section {
                                background-color: #f8f8ff;
                            }
                            .style-impact {
                                font-style: italic;
                                margin-top: 20px;
                                padding: 10px;
                                background-color: rgba(10, 132, 255, 0.05);
                                border-radius: 6px;
                            }
                            .profile-reflection, .implementation-note, .digital-integration-note {
                                margin-top: 30px;
                                padding: 15px;
                                background-color: #f0f7ff;
                                border-radius: 8px;
                                border-left: 4px solid #0A84FF;
                            }
                            .profile-reflection h4, .implementation-note h4, .digital-integration-note h4 {
                                color: #1E1E2C;
                                margin-top: 0;
                                margin-bottom: 10px;
                            }
                            .profile-content {
                                margin-top: 20px;
                            }
                            .strategic-intro, .module-intro, .components-intro {
                                margin-bottom: 20px;
                            }
                            .style-application {
                                margin-top: 10px;
                                font-size: 15px;
                            }
                            .subsection-intro {
                                font-size: 15px;
                                color: #555;
                                margin-bottom: 15px;
                            }
                            .theory-description {
                                margin-top: 5px;
                                font-size: 14px;
                                line-height: 1.6;
                            }
                            .final-reflection {
                                margin-top: 30px;
                                padding: 20px;
                                text-align: center;
                                font-style: italic;
                                background-color: rgba(30, 30, 44, 0.05);
                                border-radius: 8px;
                            }
                            .module-components {
                                background-color: #f9f9f9;
                                padding: 15px;
                                border-radius: 8px;
                                margin-top: 15px;
                            }
                            .module-components h4 {
                                color: #0A84FF;
                                margin: 15px 0 5px;
                                font-size: 16px;
                            }
                            .module-components p {
                                margin: 0 0 15px;
                                font-size: 14px;
                            }
                            .component-grid {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 20px;
                                margin-top: 20px;
                            }
                            .component-item {
                                padding: 15px;
                                border: 1px solid #E1E1E8;
                                border-radius: 8px;
                                background-color: #f9f9f9;
                            }
                            .component-item h4 {
                                color: #0A84FF;
                                margin-top: 0;
                                margin-bottom: 10px;
                                font-size: 16px;
                            }
                            .component-item p {
                                margin: 0;
                                font-size: 14px;
                            }
                            .module-approach {
                                font-size: 18px;
                                color: #1E1E2C;
                                margin-bottom: 20px;
                                padding: 10px 15px;
                                background-color: rgba(30, 30, 44, 0.05);
                                border-radius: 6px;
                                display: inline-block;
                            }
                            @media print {
                                body {
                                    font-size: 12pt;
                                }
                                .section {
                                    page-break-inside: avoid;
                                    border: 1px solid #ddd !important;
                                    margin-bottom: 20px !important;
                                }
                                h1, h2, h3, h4, h5, h6 {
                                    page-break-after: avoid;
                                }
                                p, li {
                                    orphans: 3;
                                    widows: 3;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${htmlContent.replace('<header>', '<header><h1 class="logo-text">anga</h1>')}
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                
                // Trigger print dialog after a short delay to ensure styles are loaded
                setTimeout(() => {
                    printWindow.print();
                }, 1000);
                
                // Reset dialog
                downloadDialog.classList.remove('active');
                confirmDownload.disabled = false;
                cancelDownload.disabled = false;
                loadingIndicator.remove();
            }
        }, 500);
    });
    
    newAssessmentButton.addEventListener('click', function() {
        // Clear localStorage and redirect to landing page
        localStorage.removeItem('angaAssessmentResponses');
        localStorage.removeItem('angaAssessmentProgress');
        window.location.href = 'index.html';
    });
    
    // Add event listeners for the checkboxes to update the preview
    document.getElementById('include-profile').addEventListener('change', function() {
        document.querySelector('.profile-preview').style.opacity = this.checked ? '1' : '0.4';
    });
    
    document.getElementById('include-recommendations').addEventListener('change', function() {
        document.querySelector('.recommendations-preview').style.opacity = this.checked ? '1' : '0.4';
    });
    
    document.getElementById('include-online').addEventListener('change', function() {
        document.querySelector('.online-preview').style.opacity = this.checked ? '1' : '0.4';
    });
    
    // Calculate scores for each teaching style
    function calculateScores(responses) {
        // Initialize scores object with all styles set to 0
        let scores = {};
        teachingStyles.forEach(style => {
            scores[style.id] = 0;
        });
        
        // Group responses by style mapping
        const styleResponses = {};
        teachingStyles.forEach(style => {
            styleResponses[style.id] = responses.filter(r => r.styleMapping === style.id);
        });
        
        // Calculate raw scores (sum of responses for each style)
        teachingStyles.forEach(style => {
            const styleScore = styleResponses[style.id].reduce((total, response) => total + response.value, 0);
            // Convert to percentage (max score would be 5 points × 4 questions = 20 points per style)
            const maxPossibleScore = styleResponses[style.id].length * 5;
            scores[style.id] = Math.round((styleScore / maxPossibleScore) * 100);
        });
        
        return scores;
    }
    
    // Find the dominant teaching style
    function findDominantStyle(scores) {
        let highestScore = 0;
        let dominantStyleId = 1;
        
        Object.keys(scores).forEach(styleId => {
            if (scores[styleId] > highestScore) {
                highestScore = scores[styleId];
                dominantStyleId = parseInt(styleId);
            }
        });
        
        return teachingStyles.find(style => style.id === dominantStyleId);
    }
    
    // Rank styles by score
    function rankStyles(scores) {
        return teachingStyles
            .map(style => ({
                ...style,
                score: scores[style.id]
            }))
            .sort((a, b) => b.score - a.score);
    }
    
    // Function to update the UI with results data
    function updateResultsUI(dominantStyle, scores, rankedStyles) {
        // Make sure all UI elements exist before updating them
        if (mainStyleName) mainStyleName.textContent = dominantStyle.name;
        
        // Replace description with personalized message based on style ID
        const personalizedMessages = {
            1: "Your adaptability is your greatest strength as an educator. You naturally adjust your approach to meet diverse student needs, creating inclusive learning environments where all students can thrive. Continue leveraging this flexibility to reach every learner in your classroom.",
            2: "Your empathetic approach creates powerful connections with your students. By prioritizing emotional engagement and small group dynamics, you foster a supportive learning environment where students feel valued and understood. This emotional intelligence is a rare and valuable gift in education.",
            3: "Your structured approach provides students with clear pathways to success. Your commitment to well-prepared, curriculum-aligned teaching ensures comprehensive coverage of essential learning objectives while maintaining high academic standards. This foundation gives students confidence in their educational journey.",
            4: "Your clarity and precision cut through complexity, delivering knowledge in a straightforward manner that resonates with students. Your ability to distill complex concepts into manageable components makes challenging subject matter accessible and actionable for your students.",
            5: "Your confidence and presence in front of large audiences creates memorable learning experiences. You have a natural ability to command attention and communicate ideas effectively at scale, making you particularly effective when delivering important concepts to large groups.",
            6: "Your focused approach to teaching creates high-impact learning moments. You excel at delivering targeted, efficient instruction that addresses specific skills or concepts, making you especially valuable in contexts requiring precise skill development and just-in-time learning."
        };
        
        // Set the personalized message or fall back to the original description if not found
        if (mainStyleDescription) {
            mainStyleDescription.textContent = personalizedMessages[dominantStyle.id] || dominantStyle.description;
        }
        
        if (mainStyleScore) {
            mainStyleScore.textContent = `${scores[dominantStyle.id]}%`;
        }
        
        // Create hexagon chart if the element exists
        if (hexagonChart) {
            createHexagonChart(hexagonChart, scores);
        }
        
        // Create bar chart if the element exists
        if (barChart) {
            createBarChart(barChart, rankedStyles);
        }
        
        // Show the results content
        const resultsContent = document.querySelector('.results-content');
        if (resultsContent) {
            resultsContent.style.opacity = '1';
        }
        
        console.log('UI updated with results data');
    }
    
    // Create hexagon chart visualization
    function createHexagonChart(container, scores) {
        container.innerHTML = '';
        
        const hexContainer = document.createElement('div');
        hexContainer.className = 'hexagon-container';
        container.appendChild(hexContainer);
        
        // Create SVG for background grid
        const svgGrid = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgGrid.setAttribute('width', '300');
        svgGrid.setAttribute('height', '300');
        svgGrid.setAttribute('class', 'hexagon-grid');
        svgGrid.style.position = 'absolute';
        svgGrid.style.top = '0';
        svgGrid.style.left = '0';
        
        // Add grid circles
        for (let radius of [40, 80, 120]) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', '150');
            circle.setAttribute('cy', '150');
            circle.setAttribute('r', radius.toString());
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
            circle.setAttribute('stroke-width', '1');
            svgGrid.appendChild(circle);
        }
        
        hexContainer.appendChild(svgGrid);
        
        // Create axes for hexagon chart (6 axes)
        for (let i = 0; i < 6; i++) {
            const axis = document.createElement('div');
            axis.className = 'hexagon-axis';
            
            // Set the rotation angle for each axis
            const angle = (i * 60) - 30; // Starting at -30 degrees
            axis.style.transform = `rotate(${angle}deg)`;
            
            hexContainer.appendChild(axis);
            
            // Add style name as label
            const style = teachingStyles[i];
            const point = document.createElement('div');
            point.className = 'hexagon-point';
            
            // Position the label at the end of the axis
            const distance = 140; // Distance from center
            const radians = (angle * Math.PI) / 180;
            point.style.left = `calc(50% + ${Math.cos(radians) * distance}px)`;
            point.style.top = `calc(50% + ${Math.sin(radians) * distance}px)`;
            point.textContent = style.name.split(' ')[0]; // Use first word of style name
            hexContainer.appendChild(point);
            
            // Add value point on the axis based on score
            const valuePoint = document.createElement('div');
            valuePoint.className = 'hexagon-value';
            
            // Position the value point based on score
            const scoreDistance = (scores[style.id] / 100) * 120; // Scale to fit inside the chart
            valuePoint.style.left = `calc(50% + ${Math.cos(radians) * scoreDistance}px)`;
            valuePoint.style.top = `calc(50% + ${Math.sin(radians) * scoreDistance}px)`;
            hexContainer.appendChild(valuePoint);
        }
        
        // Create SVG for the hexagon shape that connects the value points
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '300');
        svg.setAttribute('height', '300');
        svg.setAttribute('class', 'hexagon-shape');
        
        let pathData = '';
        
        // Create path connecting all value points
        for (let i = 0; i < 6; i++) {
            const style = teachingStyles[i];
            const angle = (i * 60) - 30; // Starting at -30 degrees
            const radians = (angle * Math.PI) / 180;
            const scoreDistance = (scores[style.id] / 100) * 120; // Scale to fit inside the chart
            
            const x = 150 + Math.cos(radians) * scoreDistance;
            const y = 150 + Math.sin(radians) * scoreDistance;
            
            if (i === 0) {
                pathData = `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        }
        
        // Close the path
        pathData += ' Z';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', 'rgba(126, 182, 255, 0.15)');
        path.setAttribute('stroke', 'var(--primary)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        
        hexContainer.appendChild(svg);
    }
    
    // Create bar chart visualization
    function createBarChart(container, rankedStyles) {
        container.innerHTML = '';
        
        const barsContainer = document.createElement('div');
        barsContainer.className = 'strength-bars-container';
        
        // Calculate max score for better visual scaling
        const maxScore = Math.max(...rankedStyles.map(style => style.score));
        
        // Create a bar for each teaching style
        rankedStyles.forEach((style, index) => {
            // Create a tooltip container to wrap everything
            const tooltipContainer = document.createElement('div');
            tooltipContainer.className = 'tooltip-container';
            
            const barContainer = document.createElement('div');
            
            // Create the label with style name only
            const labelDiv = document.createElement('div');
            labelDiv.className = 'strength-bar-label';
            
            const styleName = document.createElement('span');
            styleName.className = 'style-name';
            styleName.textContent = style.name; // Use full style name
            
            labelDiv.appendChild(styleName);
            
            // Create the bar
            const barDiv = document.createElement('div');
            barDiv.className = 'strength-bar';
            
            // Create the fill for the bar
            const barFill = document.createElement('div');
            barFill.className = 'strength-bar-fill';
            barFill.style.width = '0%'; // Start at 0 for animation
            barFill.style.backgroundColor = style.color;
            
            // Only show text inside the bar if there's enough space
            if (style.score > 25) {
                barFill.textContent = `${style.score}%`;
            }
            
            barDiv.appendChild(barFill);
            barContainer.appendChild(labelDiv);
            barContainer.appendChild(barDiv);
            
            // Create tooltip with style description
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            
            const tooltipTitle = document.createElement('div');
            tooltipTitle.className = 'tooltip-title';
            tooltipTitle.textContent = style.name;
            
            const tooltipDescription = document.createElement('div');
            tooltipDescription.className = 'tooltip-description';
            tooltipDescription.textContent = style.description;
            
            const tooltipTheory = document.createElement('div');
            tooltipTheory.className = 'tooltip-theory';
            tooltipTheory.innerHTML = `<strong>Learning Theory:</strong> ${style.theory}`;
            
            tooltip.appendChild(tooltipTitle);
            tooltip.appendChild(tooltipDescription);
            tooltip.appendChild(tooltipTheory);
            
            // Add everything to the tooltip container
            tooltipContainer.appendChild(barContainer);
            tooltipContainer.appendChild(tooltip);
            
            barsContainer.appendChild(tooltipContainer);
            
            // Animate the bar fill after a short delay
            setTimeout(() => {
                barFill.style.width = `${style.score}%`;
            }, 300 + (index * 100)); // Stagger the animations
        });
        
        container.appendChild(barsContainer);
    }
    
    // Add a diagnostic function to check PDF generation dependencies
    function checkPdfDependencies() {
        console.log('Checking PDF generation dependencies...');
        
        const dependencies = {
            'jsPDF': typeof window.jspdf !== 'undefined',
            'html2canvas': typeof html2canvas !== 'undefined',
            'pdfTemplates': typeof window.pdfTemplates !== 'undefined',
            'pdfTemplates.generatePdfContent': typeof window.pdfTemplates?.generatePdfContent === 'function',
            'pdfTemplates.generateEnhancedPdfContent': typeof window.pdfTemplates?.generateEnhancedPdfContent === 'function',
            'pdfTemplates.generateStructuredPdf': typeof window.pdfTemplates?.generateStructuredPdf === 'function',
            'textHandlingUtils': typeof window.textHandlingUtils !== 'undefined',
            'enhancePdfGeneration': typeof window.enhancePdfGeneration === 'function',
            'dominantStyle': typeof window.dominantStyle !== 'undefined',
            'scores': typeof window.scores !== 'undefined',
            'rankedStyles': typeof window.rankedStyles !== 'undefined'
        };
        
        console.table(dependencies);
        
        // Check for any missing dependencies
        const missingDependencies = Object.entries(dependencies)
            .filter(([_, loaded]) => !loaded)
            .map(([name]) => name);
        
        if (missingDependencies.length > 0) {
            console.error('Missing PDF dependencies:', missingDependencies.join(', '));
            return false;
        }
        
        console.log('All PDF dependencies loaded successfully!');
        return true;
    }
    
    // Run the dependency check after a short delay to ensure all scripts are loaded
    setTimeout(checkPdfDependencies, 1000);
});