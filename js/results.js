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
    const detailedStyles = document.getElementById('detailed-styles');
    const downloadButton = document.getElementById('download-pdf');
    const newAssessmentButton = document.getElementById('new-assessment');
    const downloadDialog = document.getElementById('download-dialog');
    const cancelDownload = document.getElementById('cancel-download');
    const confirmDownload = document.getElementById('confirm-download');
    const userNameInput = document.getElementById('user-name');
    const saveResultsForm = document.getElementById('save-results-form');
    const skipSaveButton = document.getElementById('skip-save');
    const resultsActions = document.querySelector('.results-actions');
    
    // Load responses from localStorage
    const savedResponses = localStorage.getItem('angaAssessmentResponses');
    
    if (!savedResponses) {
        // No saved responses, redirect to assessment
        window.location.href = 'assessment.html';
        return;
    }
    
    const responses = JSON.parse(savedResponses);
    
    // Check if all questions have been answered
    if (responses.length < scenarios.length) {
        // Not all questions answered, redirect to assessment
        window.location.href = 'assessment.html';
        return;
    }
    
    // Calculate scores
    const scores = calculateScores(responses);
    
    // Get the dominant style (highest score)
    const dominantStyle = findDominantStyle(scores);
    
    // Rank styles by score
    const rankedStyles = rankStyles(scores);
    
    // Update the UI with results
    updateResultsUI(dominantStyle, scores, rankedStyles);
    
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
        
        // Store the data
        window.dataStorage.storeUserData(userData)
            .then(success => {
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
            });
    });
    
    // Handle skip button
    skipSaveButton.addEventListener('click', function() {
        // Hide the form section
        document.querySelector('.save-results-section').style.display = 'none';
        
        // Show download button
        resultsActions.style.display = 'flex';
        
        // Save anonymous results for research
        window.dataStorage.storeAnonymousResults({
            dominantStyle: dominantStyle.id,
            scores: scores
        });
    });
    
    // Add event listeners for download
    downloadButton.addEventListener('click', function() {
        downloadDialog.classList.add('active');
    });
    
    cancelDownload.addEventListener('click', function() {
        downloadDialog.classList.remove('active');
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
        
        // Short timeout to allow UI update before PDF generation
        setTimeout(() => {
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
                        }
                    </style>
                </head>
                <body>
                    ${htmlContent}
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
    
    // Update the UI with the results
    function updateResultsUI(dominantStyle, scores, rankedStyles) {
        // Update dominant style section
        mainStyleName.textContent = dominantStyle.name;
        mainStyleDescription.textContent = dominantStyle.description;
        mainStyleScore.textContent = `${scores[dominantStyle.id]}%`;
        
        // Create hexagon chart
        createHexagonChart(hexagonChart, scores);
        
        // Create bar chart
        createBarChart(barChart, rankedStyles);
        
        // Update detailed styles section
        detailedStyles.innerHTML = '';
        rankedStyles.forEach(style => {
            const styleElement = document.createElement('div');
            styleElement.classList.add('detailed-style');
            styleElement.innerHTML = `
                <h3 class="style-name">${style.name} (${style.score}%)</h3>
                <p class="style-description">${style.description}</p>
                <p class="style-theory"><strong>Aligned Learning Theory:</strong> ${style.theory}</p>
            `;
            detailedStyles.appendChild(styleElement);
        });
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
            circle.setAttribute('stroke', 'rgba(0, 0, 0, 0.05)');
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
            point.textContent = `Style ${style.id}`;
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
        svg.appendChild(path);
        
        hexContainer.appendChild(svg);
    }
    
    // Create bar chart visualization
    function createBarChart(container, rankedStyles) {
        container.innerHTML = '';
        
        const barsContainer = document.createElement('div');
        barsContainer.className = 'strength-bars-container';
        
        rankedStyles.forEach(style => {
            const barContainer = document.createElement('div');
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'strength-bar-label';
            labelDiv.innerHTML = `
                <span class="style-name">Style ${style.id}: ${style.name.split(' ')[0]}</span>
                <span class="style-score">${style.score}%</span>
            `;
            
            const barDiv = document.createElement('div');
            barDiv.className = 'strength-bar';
            
            const barFill = document.createElement('div');
            barFill.className = 'strength-bar-fill';
            barFill.style.width = '0%'; // Start at 0 for animation
            barFill.style.backgroundColor = style.color;
            barFill.textContent = `${style.score}%`;
            
            barDiv.appendChild(barFill);
            barContainer.appendChild(labelDiv);
            barContainer.appendChild(barDiv);
            
            barsContainer.appendChild(barContainer);
            
            // Animate the bar fill after a short delay
            setTimeout(() => {
                barFill.style.width = `${style.score}%`;
            }, 100 + (rankedStyles.indexOf(style) * 100)); // Stagger the animations
        });
        
        container.appendChild(barsContainer);
    }
});