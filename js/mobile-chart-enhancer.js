/**
 * Mobile Chart Enhancer
 * Improves chart display on mobile devices
 */
document.addEventListener('DOMContentLoaded', function() {
    // Only apply these changes on mobile devices
    if (window.innerWidth <= 480) {
        // Enhance hexagon chart for mobile
        enhanceHexagonChart();
        
        // Ensure all chart elements are visible
        setTimeout(function() {
            adjustChartHeights();
        }, 500); // Wait for charts to render
        
        // Listen for window resize events
        window.addEventListener('resize', function() {
            adjustChartHeights();
        });
    }
    
    /**
     * Enhances the hexagon chart for better mobile display
     */
    function enhanceHexagonChart() {
        const hexagonChart = document.getElementById('hexagon-chart');
        if (!hexagonChart) return;
        
        // Wait for the chart to be created
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const hexContainer = hexagonChart.querySelector('.hexagon-container');
                    if (hexContainer) {
                        // Center the hexagon container
                        hexContainer.style.transform = 'translateX(-50%)';
                        hexContainer.style.left = '50%';
                        hexContainer.style.position = 'relative';
                        
                        // Make hexagon points more visible
                        const hexPoints = hexagonChart.querySelectorAll('.hexagon-point');
                        hexPoints.forEach(point => {
                            point.style.fontSize = '10px';
                            point.style.fontWeight = 'bold';
                        });
                        
                        // Adjust hexagon value points
                        const valuePoints = hexagonChart.querySelectorAll('.hexagon-value');
                        valuePoints.forEach(point => {
                            point.style.width = '8px';
                            point.style.height = '8px';
                        });
                        
                        // Stop observing once we've made our changes
                        observer.disconnect();
                    }
                }
            });
        });
        
        // Start observing the hexagon chart
        observer.observe(hexagonChart, { childList: true, subtree: true });
    }
    
    /**
     * Adjusts chart heights based on their content
     */
    function adjustChartHeights() {
        // Get all chart cards
        const chartCards = document.querySelectorAll('.chart-card');
        
        chartCards.forEach(card => {
            // Get the content height
            const cardTitle = card.querySelector('.card-title');
            const chartContent = card.querySelector('.hexagon-chart, .bar-chart');
            
            if (cardTitle && chartContent) {
                const titleHeight = cardTitle.offsetHeight;
                const contentHeight = chartContent.scrollHeight;
                
                // Set minimum height to ensure content is visible
                const minHeight = titleHeight + contentHeight + 40; // 40px for padding
                card.style.minHeight = minHeight + 'px';
            }
        });
        
        // Specifically handle the bar chart
        const barChart = document.getElementById('bar-chart');
        if (barChart) {
            const strengthBars = barChart.querySelectorAll('.strength-bar');
            if (strengthBars.length > 0) {
                // Calculate needed height based on number of bars
                const neededHeight = strengthBars.length * 40; // 40px per bar
                barChart.style.minHeight = neededHeight + 'px';
                
                // Find the parent chart card and adjust its height
                const parentCard = barChart.closest('.chart-card');
                if (parentCard) {
                    const cardTitle = parentCard.querySelector('.card-title');
                    const titleHeight = cardTitle ? cardTitle.offsetHeight : 0;
                    parentCard.style.minHeight = (titleHeight + neededHeight + 40) + 'px';
                }
            }
        }
    }
}); 