// Load navbar and footer dynamically
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar-container', 'navbar.html');
    }
    if (document.getElementById('footer-container')) {
        loadComponent('footer-container', 'footer.html');
    }
});