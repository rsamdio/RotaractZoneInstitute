// RZI Event Website - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all interactive features
  initSmoothScrolling();
  initScheduleTabs();
  initHeaderScroll();
  initAnimations();
  initHamburgerMenu();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
        
        // Close mobile menu if open
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        if (hamburger && mobileNav && mobileNav.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// Update active navigation link
function updateActiveNavLink(activeId) {
  const navLinks = document.querySelectorAll('.site-nav__link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === activeId) {
      link.classList.add('active');
    }
  });
}

// Schedule tabs functionality
function initScheduleTabs() {
  const tabs = document.querySelectorAll('.schedule-tab');
  const scheduleDays = document.querySelectorAll('.schedule-day');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetDay = this.getAttribute('data-day');
      
      // Remove active class from all tabs and days
      tabs.forEach(t => t.classList.remove('active'));
      scheduleDays.forEach(day => day.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding day
      this.classList.add('active');
      const targetDayElement = document.getElementById(targetDay);
      if (targetDayElement) {
        targetDayElement.classList.add('active');
      }
    });
  });
}


// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      // More opaque and stronger blur when scrolled
      header.classList.add('scrolled');
      header.style.background = 'rgba(15, 23, 42, 0.98)';
      header.style.backdropFilter = 'blur(20px)';
      header.style.borderBottom = '1px solid rgba(51, 65, 85, 0.3)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      // Default state when at top
      header.classList.remove('scrolled');
      header.style.background = 'rgba(15, 23, 42, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
      header.style.borderBottom = '1px solid var(--color-dark-surface-light)';
      header.style.boxShadow = 'none';
    }
  });
}

// Initialize scroll animations
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.feature-card, .speaker-card, .schedule-item, .registration-card');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Utility function to show toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <div class="toast__icon">${icons[type] || icons.info}</div>
    <div class="toast__content">
      <div class="toast__message">${message}</div>
    </div>
    <button class="toast__close">×</button>
  `;
  
  // Add toast styles if not already present
  if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast {
        position: fixed;
        top: 24px;
        right: 24px;
        background: var(--color-dark-surface);
        border: 1px solid var(--color-dark-surface-light);
        border-radius: var(--radius-lg);
        padding: 16px 20px;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
      }
      
      .toast--success { border-color: var(--color-secondary); }
      .toast--error { border-color: var(--color-danger); }
      .toast--warning { border-color: var(--color-accent-orange); }
      .toast--info { border-color: var(--color-primary); }
      
      .toast__icon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
      }
      
      .toast--success .toast__icon { background: var(--color-secondary); color: white; }
      .toast--error .toast__icon { background: var(--color-danger); color: white; }
      .toast--warning .toast__icon { background: var(--color-accent-orange); color: white; }
      .toast--info .toast__icon { background: var(--color-primary); color: white; }
      
      .toast__message {
        color: var(--color-text-primary);
        font-weight: 500;
      }
      
      .toast__close {
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .toast__close:hover {
        color: var(--color-text-primary);
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  });
  
  // Add slideOutRight animation if not present
  if (!document.querySelector('#toast-animations')) {
    const animationStyle = document.createElement('style');
    animationStyle.id = 'toast-animations';
    animationStyle.textContent = `
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100%);
        }
      }
    `;
    document.head.appendChild(animationStyle);
  }
}

// Hamburger menu functionality
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  
  if (!hamburger || !mobileNav) return;
  
  // Toggle mobile menu
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileNav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close menu when clicking on mobile nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Export functions for potential external use
window.RZIEvent = {
  showToast
};
