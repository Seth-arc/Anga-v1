/**
 * text-handling-utils.js
 * Utility functions for handling text in PDF generation
 */

// Namespace for text handling utilities
window.textHandlingUtils = (function() {
    /**
     * Determines if text needs special handling based on length and content
     * @param {string} text - The text to check
     * @return {boolean} - Whether the text needs special handling
     */
    function needsSpecialHandling(text) {
        if (!text) return false;
        
        // Check for very long text
        if (text.length > 100) return true;
        
        // Check for very long words (15+ characters)
        const words = text.split(' ');
        if (words.some(word => word.length > 15)) return true;
        
        // Check for text without spaces (could be a URL or long identifier)
        if (text.length > 30 && !text.includes(' ')) return true;
        
        return false;
    }
    
    /**
     * Applies hyphenation and word wrapping to an HTML element
     * @param {HTMLElement} element - The element to process
     */
    function applyTextHandling(element) {
        if (!element) return;
        
        // Apply text handling CSS properties
        element.style.overflowWrap = 'break-word';
        element.style.wordWrap = 'break-word';
        
        // Apply hyphenation for elements with potentially long words
        const text = element.textContent || '';
        if (needsSpecialHandling(text)) {
            element.style.hyphens = 'auto';
            
            // For elements with very long content, ensure line height is appropriate
            if (text.length > 200) {
                element.style.lineHeight = '1.5';
            }
        }
        
        // Process child elements recursively, except for pre and code elements
        if (!element.tagName || (element.tagName.toLowerCase() !== 'pre' && element.tagName.toLowerCase() !== 'code')) {
            Array.from(element.children).forEach(child => {
                applyTextHandling(child);
            });
        }
    }
    
    /**
     * Processes a container for optimal text display in PDFs
     * @param {HTMLElement} container - The container to process
     */
    function processContainer(container) {
        if (!container) return;
        
        // Apply text handling to all relevant elements
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const paragraphs = container.querySelectorAll('p');
        const listItems = container.querySelectorAll('li');
        const divs = container.querySelectorAll('div');
        
        // Apply to headings
        headings.forEach(heading => {
            applyTextHandling(heading);
            
            // Ensure headings have appropriate line height
            heading.style.lineHeight = '1.5';
            
            // Add bottom margin to ensure spacing
            heading.style.marginBottom = '15px';
        });
        
        // Apply to paragraphs
        paragraphs.forEach(paragraph => {
            applyTextHandling(paragraph);
            
            // Ensure paragraphs have appropriate line height
            paragraph.style.lineHeight = '1.5';
        });
        
        // Apply to list items
        listItems.forEach(item => {
            applyTextHandling(item);
            
            // Ensure list items have appropriate spacing
            item.style.marginBottom = '8px';
        });
        
        // Apply to select divs that likely contain text
        divs.forEach(div => {
            // Skip divs that are likely containers or have special styling
            if (div.classList.contains('section') || 
                div.classList.contains('component-grid') ||
                div.children.length > 5) {
                return;
            }
            
            applyTextHandling(div);
        });
    }
    
    /**
     * Adjusts grid layouts based on content length
     * @param {HTMLElement} container - The container with grid layouts
     */
    function adjustGridLayouts(container) {
        if (!container) return;
        
        const grids = container.querySelectorAll('.component-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.component-item');
            
            // Check if any grid item has very long content
            let hasLongContent = false;
            items.forEach(item => {
                const text = item.textContent || '';
                if (text.length > 150) {
                    hasLongContent = true;
                }
            });
            
            // If any item has long content, switch to single column
            if (hasLongContent && items.length > 0) {
                grid.style.gridTemplateColumns = '1fr';
                
                // Add more spacing between items
                items.forEach(item => {
                    item.style.marginBottom = '25px';
                });
            }
        });
    }
    
    /**
     * Optimizes text for PDF rendering
     * @param {HTMLElement} container - The container to process
     */
    function optimizeForPdf(container) {
        if (!container) return;
        
        // Process main components
        processContainer(container);
        
        // Adjust grid layouts
        adjustGridLayouts(container);
        
        // Handle specific elements that might cause issues
        
        // Module approach - might have long text
        const moduleApproaches = container.querySelectorAll('.module-approach');
        moduleApproaches.forEach(approach => {
            approach.style.display = 'block';
            approach.style.maxWidth = '100%';
            applyTextHandling(approach);
        });
        
        // Style descriptions - might have long text
        const styleDescriptions = container.querySelectorAll('.style-description');
        styleDescriptions.forEach(description => {
            description.style.maxWidth = '100%';
            applyTextHandling(description);
        });
        
        // Handle dominant style layout for responsive display
        const dominantStyles = container.querySelectorAll('.dominant-style');
        dominantStyles.forEach(style => {
            const info = style.querySelector('.style-info');
            const score = style.querySelector('.style-score');
            
            if (info && score) {
                // Ensure score has proper spacing when it flows below on smaller screens
                score.style.marginTop = '15px';
            }
        });
        
        // Handle section headers
        const sectionHeaders = container.querySelectorAll('.style-header');
        sectionHeaders.forEach(header => {
            header.style.flexWrap = 'wrap';
            
            const scoreElement = header.querySelector('.style-score-small');
            if (scoreElement) {
                scoreElement.style.marginTop = '10px';
            }
        });
        
        // Handle any potentially overflowing content
        const theoryBoxes = container.querySelectorAll('.theory-box');
        theoryBoxes.forEach(box => {
            box.style.overflow = 'hidden';
            applyTextHandling(box);
        });
    }
    
    /**
     * Formats strings to be safe for PDF filenames
     * @param {string} name - The name to format
     * @return {string} - Sanitized name safe for filenames
     */
    function formatSafeFilename(name) {
        if (!name) return 'document';
        
        // Remove special characters and replace spaces with underscores
        return name.replace(/[^a-zA-Z0-9]/g, '_')
                  .replace(/_+/g, '_') // Replace multiple underscores with single
                  .replace(/^_|_$/g, '') // Remove leading/trailing underscores
                  .substring(0, 50); // Limit length
    }
    
    /**
     * Detects if text contains very long words that might break layout
     * @param {string} text - The text to analyze
     * @return {boolean} - Whether text contains problematic content
     */
    function hasLongWords(text) {
        if (!text) return false;
        
        const words = text.split(/\s+/);
        return words.some(word => word.length > 20);
    }
    
    /**
     * Applies smart text truncation if needed
     * @param {HTMLElement} element - Element containing text
     * @param {number} maxLength - Maximum character length
     */
    function applySmartTruncation(element, maxLength = 100) {
        if (!element) return;
        
        const text = element.textContent || '';
        
        if (text.length > maxLength) {
            // Check if the element has a display attribute that might make truncation problematic
            const computedStyle = window.getComputedStyle(element);
            const display = computedStyle.getPropertyValue('display');
            
            // Don't truncate flex or grid items
            if (display === 'flex' || display === 'grid') {
                return;
            }
            
            // Apply ellipsis styling
            element.style.whiteSpace = 'nowrap';
            element.style.overflow = 'hidden';
            element.style.textOverflow = 'ellipsis';
            element.style.maxWidth = '100%';
            
            // Store full text as data attribute for tooltip
            element.setAttribute('data-full-text', text);
            
            // Add title attribute for hover tooltip
            element.setAttribute('title', text);
        }
    }
    
    /**
     * Enhanced HTML to PDF conversion with text handling optimizations
     * Call this function to improve PDF generation with better text handling
     */
    function enhancePdfGeneration(container, options = {}) {
        if (!container) {
            console.error('No container provided for PDF enhancement');
            return;
        }
        
        // Default options
        const settings = {
            applyTextHandling: true,
            adjustGridLayouts: true,
            processHeadings: true,
            processParagraphs: true,
            ...options
        };
        
        // First pass - apply text handling
        if (settings.applyTextHandling) {
            optimizeForPdf(container);
        }
        
        // Second pass - check if any specific elements need special handling after the first pass
        if (settings.processHeadings) {
            const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                // Check if heading is very wide
                if (heading.scrollWidth > heading.clientWidth) {
                    // Apply smaller font size to overflowing headings
                    const currentSize = parseInt(window.getComputedStyle(heading).fontSize);
                    heading.style.fontSize = `${Math.max(currentSize - 2, 14)}px`;
                }
            });
        }
        
        // Apply adjustments to improve print rendering
        if (settings.processParagraphs) {
            const paragraphs = container.querySelectorAll('p');
            paragraphs.forEach(paragraph => {
                // Ensure paragraphs don't break across pages too awkwardly
                paragraph.style.orphans = '3';
                paragraph.style.widows = '3';
                paragraph.style.pageBreakInside = 'avoid';
            });
        }
        
        return container;
    }
    
    // Return public API
    return {
        needsSpecialHandling,
        applyTextHandling,
        processContainer,
        adjustGridLayouts,
        optimizeForPdf,
        formatSafeFilename,
        hasLongWords,
        applySmartTruncation,
        enhancePdfGeneration
    };
})();

// Export the enhancePdfGeneration function globally for direct access
window.enhancePdfGeneration = window.textHandlingUtils.enhancePdfGeneration;

// Log that the text handling utilities have been loaded
console.log('Text handling utilities loaded successfully');