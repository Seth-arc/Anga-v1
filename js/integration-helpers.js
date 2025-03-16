/**
 * integration-helpers.js
 * Helper functions to integrate the enhanced PDF generation with the existing code
 */

/**
 * Initialize enhanced PDF functionality by hooking into the existing event handlers
 */
function initEnhancedPdfGeneration() {
    // Check if required elements exist
    const downloadButton = document.getElementById('download-pdf');
    const confirmDownload = document.getElementById('confirm-download');
    
    if (!downloadButton || !confirmDownload) {
        console.warn('PDF download buttons not found, skipping enhanced PDF initialization');
        return;
    }
    
    // Check if required libraries and functions are available
    if (!window.pdfTemplates) {
        console.error('PDF templates not loaded, cannot initialize enhanced PDF generation');
        return;
    }
    
    if (!window.pdfTemplates.generateEnhancedPdfContent) {
        console.error('Enhanced PDF templates not loaded, falling back to basic PDF generation');
        return;
    }
    
    if (!window.textHandlingUtils) {
        console.warn('Text handling utilities not loaded, PDF generation may have formatting issues');
    }
    
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library not loaded, enhanced PDF generation may fail');
    }
    
    // Store original event handler
    const originalHandler = confirmDownload.onclick;
    
    // Replace with enhanced handler
    confirmDownload.onclick = function(event) {
        // Prevent default behavior and original handler
        event.preventDefault();
        
        // Get user data
        const userName = document.getElementById('user-name').value.trim() || 'Teacher';
        const userInstitution = document.getElementById('user-institution').value.trim();
        
        // Get report preferences
        const includeProfile = document.getElementById('include-profile').checked;
        const includeRecommendations = document.getElementById('include-recommendations').checked;
        const includeOnline = document.getElementById('include-online').checked;
        
        // Get dialog element
        const downloadDialog = document.getElementById('download-dialog');
        
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
        const cancelDownload = document.getElementById('cancel-download');
        if (cancelDownload) {
            cancelDownload.disabled = true;
        }
        
        // Get the necessary data from the global scope
        // These variables should be available from results.js
        const dominantStyle = window.dominantStyle || {};
        const scores = window.scores || {};
        const rankedStyles = window.rankedStyles || [];
        
        // Log the data to help with debugging
        console.log('PDF Generation Data:', {
            dominantStyle,
            scores,
            rankedStyles
        });
        
        // Check if enhanced PDF generation is available
        if (window.pdfTemplates && window.pdfTemplates.generateStructuredPdf) {
            try {
                // Use the enhanced PDF generation with better text handling
                window.pdfTemplates.generateStructuredPdf({
                    userName,
                    dominantStyle,
                    scores,
                    rankedStyles,
                    institution: userInstitution,
                    options: {
                        includeProfile,
                        includeRecommendations,
                        includeOnline
                    }
                }, function(success, error) {
                    // Clean up UI
                    confirmDownload.disabled = false;
                    if (cancelDownload) cancelDownload.disabled = false;
                    if (loadingIndicator) loadingIndicator.remove();
                    
                    if (success) {
                        // Close dialog
                        if (downloadDialog) {
                            downloadDialog.classList.remove('active');
                        }
                    } else {
                        // Show error and fall back to original functionality
                        console.error('Enhanced PDF generation failed:', error);
                        
                        // Fall back to original handler
                        if (typeof originalHandler === 'function') {
                            originalHandler.call(confirmDownload, event);
                        } else {
                            console.error('No fallback handler available for PDF generation');
                            alert('PDF generation failed. Please try again later.');
                            
                            // Reset UI
                            if (downloadDialog) {
                                downloadDialog.classList.remove('active');
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error in enhanced PDF generation:', error);
                
                // Fall back to original handler
                if (typeof originalHandler === 'function') {
                    originalHandler.call(confirmDownload, event);
                }
            }
        } else {
            // Enhanced PDF generation not available, use original handler
            if (typeof originalHandler === 'function') {
                originalHandler.call(confirmDownload, event);
            }
        }
    };
    
    console.log('Enhanced PDF generation initialized');
}

/**
 * Utility function to preview the PDF in a new window
 * Can be used for debugging or providing a preview feature
 */
function previewPdf(userName, dominantStyle, scores, rankedStyles, institution = '') {
    // Create a new window
    const previewWindow = window.open('', '_blank');
    
    // Generate the HTML content
    const htmlContent = window.pdfTemplates.generatePdfContent(
        userName, 
        dominantStyle, 
        scores, 
        rankedStyles, 
        institution,
        {
            includeProfile: true,
            includeRecommendations: true,
            includeOnline: true
        }
    );
    
    // Write the HTML to the new window
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PDF Preview - ${userName}</title>
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
                    line-height: 1.3;
                    overflow-wrap: break-word;
                }
                .subtitle {
                    font-size: 16px;
                    margin: 5px 0 0;
                    overflow-wrap: break-word;
                }
                .user-name {
                    font-size: 18px;
                    margin: 15px 0 0;
                    font-weight: bold;
                    overflow-wrap: break-word;
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
                    line-height: 1.3;
                    overflow-wrap: break-word;
                }
                .subsection-title {
                    font-size: 18px;
                    color: #0A84FF;
                    margin: 25px 0 15px;
                    line-height: 1.3;
                    overflow-wrap: break-word;
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
                    line-height: 1.3;
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
                }
                .profile-content {
                    margin-top: 20px;
                }
                .strategic-intro, .module-intro, .components-intro {
                    margin-bottom: 20px;
                    overflow-wrap: break-word;
                }
                .style-application {
                    margin-top: 10px;
                    font-size: 15px;
                    overflow-wrap: break-word;
                }
                .subsection-intro {
                    font-size: 15px;
                    color: #555;
                    margin-bottom: 15px;
                    overflow-wrap: break-word;
                }
                .theory-description {
                    margin-top: 5px;
                    font-size: 14px;
                    line-height: 1.6;
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
                }
                .module-components p {
                    margin: 0 0 15px;
                    font-size: 14px;
                    overflow-wrap: break-word;
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
                    overflow-wrap: break-word;
                }
                .component-item p {
                    margin: 0;
                    font-size: 14px;
                    overflow-wrap: break-word;
                }
                .module-approach {
                    font-size: 18px;
                    color: #1E1E2C;
                    margin-bottom: 20px;
                    padding: 10px 15px;
                    background-color: rgba(30, 30, 44, 0.05);
                    border-radius: 6px;
                    display: inline-block;
                    overflow-wrap: break-word;
                    max-width: 100%;
                }
                .preview-controls {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    gap: 10px;
                }
                .preview-controls button {
                    padding: 10px 20px;
                    background-color: #0A84FF;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .preview-controls button:hover {
                    background-color: #0069d9;
                }
                @media print {
                    .preview-controls {
                        display: none;
                    }
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
                    .component-grid {
                        display: block;
                    }
                    .component-item {
                        margin-bottom: 20px;
                    }
                    .cover-page {
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        page-break-after: always;
                    }
                }
            </style>
        </head>
        <body>
            ${htmlContent.replace('<header>', '<header><h1 class="logo-text">anga</h1>')}
            <div class="preview-controls">
                <button onclick="window.print()">Print PDF</button>
                <button onclick="window.close()">Close Preview</button>
            </div>
        </body>
        </html>
    `);
    
    previewWindow.document.close();
}

/**
 * Create a progress indicator for PDF generation
 * @returns {Object} Interface for controlling the progress indicator
 */
function createProgressIndicator() {
    const container = document.createElement('div');
    container.className = 'pdf-progress-container';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.backgroundColor = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    container.style.zIndex = '9999';
    container.style.width = '300px';
    container.style.textAlign = 'center';
    
    const title = document.createElement('h3');
    title.textContent = 'Generating PDF';
    title.style.margin = '0 0 15px 0';
    title.style.color = '#1E1E2C';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'pdf-progress-bar';
    progressBar.style.height = '8px';
    progressBar.style.backgroundColor = '#eee';
    progressBar.style.borderRadius = '4px';
    progressBar.style.overflow = 'hidden';
    progressBar.style.marginBottom = '10px';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'pdf-progress-fill';
    progressFill.style.height = '100%';
    progressFill.style.backgroundColor = '#0A84FF';
    progressFill.style.width = '0%';
    progressFill.style.transition = 'width 0.3s ease';
    
    const status = document.createElement('p');
    status.className = 'pdf-progress-status';
    status.textContent = 'Preparing document...';
    status.style.margin = '10px 0 0 0';
    status.style.fontSize = '14px';
    status.style.color = '#666';
    
    // Assemble the elements
    progressBar.appendChild(progressFill);
    container.appendChild(title);
    container.appendChild(progressBar);
    container.appendChild(status);
    
    // Add to document
    document.body.appendChild(container);
    
    // Return interface for updating
    return {
        updateProgress: function(percent, message) {
            progressFill.style.width = `${percent}%`;
            if (message) {
                status.textContent = message;
            }
        },
        complete: function(success = true) {
            container.style.backgroundColor = success ? '#f8f9ff' : '#fff0f0';
            title.textContent = success ? 'PDF Generated!' : 'PDF Generation Failed';
            status.textContent = success ? 'Your download will begin shortly.' : 'Please try again or use the print option.';
            progressFill.style.width = '100%';
            progressFill.style.backgroundColor = success ? '#34C759' : '#FF3B30';
            
            // Remove after delay
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 2000);
        }
    };
}

/**
 * Check browser compatibility for PDF generation
 * @returns {Object} Compatibility information
 */
function checkBrowserCompatibility() {
    // Check for problematic browsers/configurations
    const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.indexOf('Trident/') !== -1;
    const isOldEdge = navigator.userAgent.indexOf('Edge/') !== -1;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    // Aggregate results
    const potential_issues = [];
    
    if (isIE) potential_issues.push('Internet Explorer');
    if (isOldEdge) potential_issues.push('Old Edge browser');
    if (isSafari) potential_issues.push('Safari (may have PDF generation limitations)');
    if (hasLowMemory) potential_issues.push('Low memory device');
    
    return {
        compatible: potential_issues.length === 0,
        issues: potential_issues
    };
}

/**
 * Function to load scripts sequentially
 * @param {Array} scripts - Array of script URLs to load
 * @param {Function} callback - Function to call when all scripts are loaded
 */
function loadScripts(scripts, callback) {
    if (scripts.length === 0) {
        if (typeof callback === 'function') callback();
        return;
    }
    
    const script = document.createElement('script');
    script.src = scripts[0];
    script.onload = function() {
        loadScripts(scripts.slice(1), callback);
    };
    document.head.appendChild(script);
}

// Export the functions
window.pdfUtils = {
    initEnhancedPdfGeneration,
    previewPdf,
    createProgressIndicator,
    checkBrowserCompatibility,
    loadScripts
};

// Auto-initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if the PDF download functionality exists on this page
    if (document.getElementById('download-pdf')) {
        // Check browser compatibility first
        const compatibility = checkBrowserCompatibility();
        if (!compatibility.compatible) {
            console.warn('Browser compatibility issues detected:', compatibility.issues);
            // Still initialize but log warning
        }
        
        initEnhancedPdfGeneration();
        console.log('PDF utilities initialized');
    }
});