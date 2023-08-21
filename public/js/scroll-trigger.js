document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.getElementById('scroll-Trigger');
    
    scrollButton.addEventListener('click', function() {
      const contentSection = document.querySelector('.about-container'); // The section you want to scroll to
      
      // Scroll to the top of the content section with smooth behavior
      contentSection.scrollIntoView({ behavior: 'smooth' });
    });
  });