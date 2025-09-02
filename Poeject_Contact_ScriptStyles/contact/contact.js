// Initialize EmailJS
emailjs.init('91W20dPhzyxCS7O2J'); // Replace with your actual public key

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const statusMessage = document.getElementById('status-message');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    statusMessage.innerHTML = '';
    statusMessage.className = 'status-message';
    
    // Send email using EmailJS
    emailjs.sendForm('service_heby8ck', 'template_c2tschp', this)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Show success message
            statusMessage.innerHTML = ' Message sent successfully! I\'ll get back to you soon.';
            statusMessage.className = 'status-message success';
            
            // Reset form
            document.getElementById('contact-form').reset();
            
        }, function(error) {
            console.log('FAILED...', error);
            
            // Show error message
            statusMessage.innerHTML = ' Failed to send message. Please try again or contact me directly.';
            statusMessage.className = 'status-message error';
        })
        .finally(function() {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        });
});
document.addEventListener("DOMContentLoaded", function() {
  if (window.matchMedia("(max-width: 480px)").matches) {
    var indicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', function() {
      if (!indicator) return;
      if (window.scrollY > 10) {
        indicator.style.opacity = '0';
      } else {
        indicator.style.opacity = '1';
      }
    });
  }
});

