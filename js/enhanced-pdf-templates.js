/**
 * enhanced-pdf-templates.js
 * Enhanced templates with better text handling for PDF generation
 */

// Make sure the base PDF templates are loaded
if (!window.pdfTemplates) {
    window.pdfTemplates = {};
    console.error('Base PDF templates not loaded. Enhanced templates may not work correctly.');
}

// Check for required libraries
if (typeof html2canvas === 'undefined') {
    console.error('html2canvas library not loaded. Enhanced PDF templates require this library.');
}

if (typeof window.jspdf === 'undefined') {
    console.error('jsPDF library not loaded. Enhanced PDF templates require this library.');
}

// Log initialization
console.log('Initializing enhanced PDF templates...');

/**
 * Process HTML content to improve PDF text handling
 * @param {HTMLElement} container - Container with HTML content
 */
function processContentForPdf(container) {
    if (!container) return;
    
    console.log('Processing content for PDF...');
    
    // Process headings to handle long text
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        applyWordWrapping(heading);
        
        // Extra handling for potentially long headings
        if (heading.textContent.length > 40) {
            heading.style.lineHeight = '1.3';
            heading.style.marginBottom = '15px';
        }
    });
    
    // Process paragraphs for better text flow
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        applyWordWrapping(paragraph);
        paragraph.style.orphans = '3';
        paragraph.style.widows = '3';
    });
    
    // Handle list items
    const listItems = container.querySelectorAll('li');
    listItems.forEach(item => {
        applyWordWrapping(item);
    });
    
    // Handle grid layout for component items
    const componentGrid = container.querySelector('.component-grid');
    if (componentGrid) {
        // Add print-specific handling for grid items
        componentGrid.style.pageBreakInside = 'avoid';
        
        // Ensure grid items handle long content well
        const gridItems = componentGrid.querySelectorAll('.component-item');
        gridItems.forEach(item => {
            item.style.pageBreakInside = 'avoid';
            applyWordWrapping(item);
        });
    }
    
    // Special handling for module approach which might have long text
    const moduleApproach = container.querySelector('.module-approach');
    if (moduleApproach) {
        moduleApproach.style.maxWidth = '100%';
        moduleApproach.style.display = 'block';
        applyWordWrapping(moduleApproach);
    }
    
    // Handle potentially long text in theory boxes
    const theoryBoxes = container.querySelectorAll('.theory-box');
    theoryBoxes.forEach(box => {
        box.style.pageBreakInside = 'avoid';
        applyWordWrapping(box);
    });
    
    // Ensure major sections start on new pages in print
    const majorSections = container.querySelectorAll('.introduction-section, .profile-section, .recommendations-section, .online-section, .conclusion-section');
    majorSections.forEach((section, index) => {
        if (index > 0) { // Skip first section
            // Add a page break before this section
            const pageBreak = document.createElement('div');
            pageBreak.className = 'page-break';
            pageBreak.style.pageBreakBefore = 'always';
            pageBreak.style.height = '1px';
            
            section.parentNode.insertBefore(pageBreak, section);
        }
    });
    
    console.log('Content processing complete');
}

/**
 * Apply word wrapping and hyphenation to handle long text
 * @param {HTMLElement} element - Element to process
 */
function applyWordWrapping(element) {
    if (!element) return;
    
    // Apply CSS properties for better word wrapping
    element.style.overflowWrap = 'break-word';
    element.style.wordWrap = 'break-word';
    
    // Use hyphenation for very long words
    const text = element.textContent || '';
    if (text.length > 50 || text.split(' ').some(word => word.length > 15)) {
        element.style.hyphens = 'auto';
    }
}

// Enhanced wrapper for PDF content generation with better text handling
window.pdfTemplates.generateEnhancedPdfContent = function(userName, dominantStyle, scores, rankedStyles, institution = '', options = {}) {
    // Check if the base generatePdfContent function exists
    if (typeof window.pdfTemplates.generatePdfContent !== 'function') {
        console.error('Base PDF template function not found. Cannot generate enhanced content.');
        return '';
    }
    
    console.log('Generating enhanced PDF content...');
    
    // Generate the basic content
    const htmlContent = window.pdfTemplates.generatePdfContent(
        userName, 
        dominantStyle, 
        scores, 
        rankedStyles, 
        institution,
        options
    );
    
    // Create a temporary container to process the content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    
    // Process the content for better text handling
    processContentForPdf(tempContainer);
    
    // Also use text handling utilities if available
    if (window.textHandlingUtils && typeof window.textHandlingUtils.optimizeForPdf === 'function') {
        console.log('Applying additional text handling optimizations...');
        window.textHandlingUtils.optimizeForPdf(tempContainer);
    }
    
    console.log('Enhanced PDF content generation complete');
    
    // Return the processed HTML content
    return tempContainer.innerHTML;
};

/**
 * Generate a structured PDF with better page breaks and text handling
 * @param {Object} data - The data needed for the PDF
 * @param {Function} successCallback - Function to call on success
 */
function generateStructuredPdf(data, successCallback) {
    console.log('Starting structured PDF generation...');
    
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF library not loaded');
        if (typeof successCallback === 'function') {
            successCallback(false, 'jsPDF library not loaded');
        }
        return;
    }
    
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas library not loaded');
        if (typeof successCallback === 'function') {
            successCallback(false, 'html2canvas library not loaded');
        }
        return;
    }

    const { jsPDF } = window.jspdf;
    
    // Create PDF document
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;
    
    // Generate HTML content with enhanced text processing
    const htmlContent = window.pdfTemplates.generateEnhancedPdfContent(
        data.userName, 
        data.dominantStyle, 
        data.scores, 
        data.rankedStyles, 
        data.institution,
        data.options
    );
    
    // Create a temporary container with the content
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '800px';
    tempContainer.style.fontFamily = 'Poppins, sans-serif';
    tempContainer.innerHTML = htmlContent;
    
    // Apply enhanced PDF optimizations
    if (window.enhancePdfGeneration) {
        console.log('Applying enhanced PDF generation optimizations...');
        window.enhancePdfGeneration(tempContainer);
    }
    
    document.body.appendChild(tempContainer);
    
    // Add page numbering function
    function addPageNumbers() {
        const totalPages = pdf.internal.getNumberOfPages();
        
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            
            // Skip page number on cover page
            if (i > 1) {
                // Add page number
                pdf.setFontSize(10);
                pdf.setTextColor(100);
                pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 70, pdfHeight - 25);
                
                // Add footer line
                pdf.setDrawColor(200);
                pdf.line(margin, pdfHeight - 40, pdfWidth - margin, pdfHeight - 40);
                
                // Add logo to top right corner (except cover page)
                pdf.setFontSize(14);
                pdf.setTextColor(30, 30, 44);
                pdf.setFont(undefined, 'bold');
                pdf.text('anga', pdfWidth - 60, 30);
                
                // Add subtle decorative line
                pdf.setDrawColor(10, 132, 255, 0.5);
                pdf.setLineWidth(0.5);
                pdf.line(pdfWidth - 80, 32, pdfWidth - 40, 32);
            }
        }
    }
    
    // Function to finalize PDF after all sections are processed
    function finalizePdf() {
        console.log('Finalizing PDF...');
        
        // Add page numbers and footer
        addPageNumbers();
        
        // Generate filename with sanitized username
        const sanitizedName = data.userName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${sanitizedName}_Teaching_Style_Profile.pdf`;
        
        // Save or return the PDF
        if (typeof successCallback === 'function') {
            try {
                // Save the PDF
                pdf.save(fileName);
                successCallback(true);
                console.log('PDF saved successfully');
            } catch (error) {
                console.error('Error saving PDF:', error);
                successCallback(false, error);
            }
        } else {
            pdf.save(fileName);
            console.log('PDF saved successfully');
        }
        
        // Clean up
        if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
    }
    
    // Process container sections to create better PDF pages
    const sections = tempContainer.querySelectorAll('.section, header');
    let currentPage = 1;
    let currentY = margin;
    
    console.log(`Processing ${sections.length} sections for PDF...`);
    
    // Start processing sections
    processSection(0);
    
    // Process sections sequentially with better page breaks
    function processSection(index) {
        if (index >= sections.length) {
            // All sections processed, finish PDF
            finalizePdf();
            return;
        }
        
        console.log(`Processing section ${index + 1} of ${sections.length}...`);
        
        const section = sections[index];
        
        // Check if this is a major section that should start on a new page
        const isMajorSection = section.classList.contains('introduction-section') || 
                            section.classList.contains('profile-section') || 
                            section.classList.contains('recommendations-section') || 
                            section.classList.contains('online-section') || 
                            section.classList.contains('conclusion-section');
        
        if (isMajorSection && currentPage > 1) {
            pdf.addPage();
            currentPage++;
            currentY = margin;
        }
        
        html2canvas(section, {
            scale: 2.5,
            useCORS: true,
            logging: false,
            backgroundColor: 'white',
            allowTaint: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth - (margin * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Check if section will fit on current page
            if (currentY + imgHeight > pdfHeight - margin) {
                // Section won't fit, add a new page
                pdf.addPage();
                currentPage++;
                currentY = margin;
                
                // Add section to the new page
                pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            } else {
                // Section fits on current page
                pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
            }
            
            // Update current Y position for next section
            currentY += imgHeight + 30; // 30pt spacing between sections
            
            // Process next section
            processSection(index + 1);
        }).catch(error => {
            console.error('Error converting section to image:', error);
            // Continue with next section despite error
            processSection(index + 1);
        });
    }
}

// Add structured PDF generation to pdfTemplates namespace
window.pdfTemplates.generateStructuredPdf = generateStructuredPdf;

// Log that the enhanced PDF templates have been loaded
console.log('Enhanced PDF templates loaded successfully');