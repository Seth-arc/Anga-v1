/**
 * Mobile Tooltip Handler
 * Enhances tooltip functionality on mobile devices
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only apply these changes on mobile devices
    if (window.innerWidth <= 480) {
        // Track the currently visible tooltip
        let currentVisibleTooltip = null;
        
        // Wait for the DOM to be fully ready and for charts to be rendered
        setTimeout(function() {
            setupTooltips();
            
            // Set up a MutationObserver to watch for dynamically added tooltips
            observeTooltipChanges();
        }, 1000); // Increased timeout to ensure charts are fully rendered
        
        /**
         * Sets up tooltip functionality for mobile
         */
        function setupTooltips() {
            console.log('Setting up mobile tooltips');
            const tooltipContainers = document.querySelectorAll('.tooltip-container');
            console.log('Found tooltip containers:', tooltipContainers.length);
            
            // For each tooltip container
            tooltipContainers.forEach(container => {
                attachTooltipHandlers(container);
            });
            
            // Close tooltips when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.tooltip') && !e.target.closest('.tooltip-container')) {
                    if (currentVisibleTooltip) {
                        currentVisibleTooltip.classList.remove('visible');
                        currentVisibleTooltip = null;
                        document.body.classList.remove('tooltip-active');
                    }
                }
            });
        }
        
        /**
         * Attaches event handlers to a tooltip container
         */
        function attachTooltipHandlers(container) {
            const tooltip = container.querySelector('.tooltip');
            if (!tooltip) return;
            
            // Remove any existing event listeners
            const newContainer = container.cloneNode(true);
            container.parentNode.replaceChild(newContainer, container);
            
            // Get the tooltip from the new container
            const newTooltip = newContainer.querySelector('.tooltip');
            
            // Prevent default hover behavior on mobile by adding click handler
            newContainer.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Tooltip container clicked');
                
                // If this tooltip is already visible, do nothing
                if (currentVisibleTooltip === newTooltip) return;
                
                // Hide any other visible tooltips
                if (currentVisibleTooltip) {
                    currentVisibleTooltip.classList.remove('visible');
                    currentVisibleTooltip = null;
                }
                
                // Show this tooltip
                newTooltip.classList.add('visible');
                currentVisibleTooltip = newTooltip;
                
                // Add overlay class to body
                document.body.classList.add('tooltip-active');
            });
            
            // Add click event to close button
            newTooltip.addEventListener('click', function(e) {
                // Check if the click is in the top-right corner (where our close button is)
                const rect = newTooltip.getBoundingClientRect();
                const closeButtonArea = {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.top + 40,
                    left: rect.right - 40
                };
                
                if (
                    e.clientX >= closeButtonArea.left && 
                    e.clientX <= closeButtonArea.right && 
                    e.clientY >= closeButtonArea.top && 
                    e.clientY <= closeButtonArea.bottom
                ) {
                    // Hide the tooltip
                    newTooltip.classList.remove('visible');
                    currentVisibleTooltip = null;
                    
                    // Remove overlay class from body
                    document.body.classList.remove('tooltip-active');
                    
                    e.stopPropagation();
                }
            });
        }
        
        /**
         * Observes changes to the DOM to detect dynamically added tooltips
         */
        function observeTooltipChanges() {
            // Target the bar chart container which will contain the tooltips
            const barChart = document.getElementById('bar-chart');
            if (!barChart) return;
            
            // Create a new observer
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Check if any tooltip containers were added
                        const newTooltipContainers = barChart.querySelectorAll('.tooltip-container');
                        if (newTooltipContainers.length > 0) {
                            console.log('New tooltip containers detected:', newTooltipContainers.length);
                            newTooltipContainers.forEach(container => {
                                attachTooltipHandlers(container);
                            });
                        }
                    }
                });
            });
            
            // Start observing the bar chart for changes
            observer.observe(barChart, {
                childList: true,
                subtree: true
            });
            
            console.log('Observing bar chart for tooltip changes');
        }
    }
}); 