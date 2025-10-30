// Modern JavaScript for Interactive Features (static copy)
// NOTE: This file is a snapshot of the main /assets/js/script.js. Keep it in sync
// with the main project and update API_BASE when your backend is deployed.

// API base URL (placeholder) — replace with your backend URL when ready
var API_BASE = 'https://api.example.com';
class PodcastWebsite {
	constructor() {
		this.init();
	}

	init() {
		this.setupThemeToggle();
		this.setupLightbox();
		this.setupSmoothScroll();
		this.setupVideoModals();
		this.setupLikeButtons();
		this.setupCommentForms();
		this.setupMobileMenu();
	}

	// Dark/Light Mode Toggle
	setupThemeToggle() {
		var toggle = document.getElementById('themeToggle');
		var icon = toggle && toggle.querySelector('i');

		// Check for saved theme or prefer-color-scheme
		var savedTheme = localStorage.getItem('theme');
		var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
			document.body.classList.add('dark-mode');
			if (icon) icon.className = 'fas fa-sun';
		}

		if (toggle) {
			toggle.addEventListener('click', function () {
				document.body.classList.toggle('dark-mode');
				var isDark = document.body.classList.contains('dark-mode');
				localStorage.setItem('theme', isDark ? 'dark' : 'light');

				if (icon) {
					icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
				}
			});
		}
	}

	// Lightbox for Gallery
	setupLightbox() {
		const lightbox = document.getElementById('lightbox');
		const lightboxImg = document.getElementById('lightbox-img');
		const closeBtn = document.querySelector('.lightbox-close');
		const galleryItems = document.querySelectorAll('.gallery-item');

		galleryItems.forEach(function (item) {
			item.addEventListener('click', function () {
				var img = item.querySelector('img');
				var imgSrc = img && img.src;
				if (imgSrc) {
					lightboxImg.src = imgSrc;
					if (lightbox) lightbox.style.display = 'flex';
					document.body.style.overflow = 'hidden';
				}
			});
		});

		if (closeBtn) {
			closeBtn.addEventListener('click', function () {
				if (lightbox) lightbox.style.display = 'none';
				document.body.style.overflow = 'auto';
			});
		}

		if (lightbox) {
			lightbox.addEventListener('click', function (e) {
				if (e.target === lightbox) {
					lightbox.style.display = 'none';
					document.body.style.overflow = 'auto';
				}
			});
		}
	}

	// Smooth Scrolling for Navigation
	setupSmoothScroll() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault();
				const target = document.querySelector(this.getAttribute('href'));
				if (target) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			});
		});
	}

	// Video Modal Functionality
	setupVideoModals() {
		const videoCards = document.querySelectorAll('.video-card');
        
		videoCards.forEach(function (card) {
			var playBtn = card.querySelector('.play-button');
			var videoId = card.dataset && card.dataset.videoId;
			if (playBtn) {
				playBtn.addEventListener('click', function () {
					this.openVideoModal ? this.openVideoModal(videoId) : null;
				}.bind(this));
			}
		}.bind(this));
	}

	openVideoModal(videoId) {
		const modal = document.createElement('div');
		modal.className = 'video-modal';
		modal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.9);
			z-index: 3000;
			display: flex;
			justify-content: center;
			align-items: center;
		`;

		modal.innerHTML = `
			<div style="position: relative; width: 90%; max-width: 800px;">
				<button class="video-close" style="
					position: absolute;
					top: -40px;
					right: 0;
					background: none;
					border: none;
					color: white;
					font-size: 2rem;
					cursor: pointer;
				">×</button>
				<div style="position: relative; padding-bottom: 56.25%; height: 0;">
					<iframe 
						src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
						style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
						frameborder="0" 
						allow="autoplay; encrypted-media" 
						allowfullscreen>
					</iframe>
				</div>
			</div>
		`;

		document.body.appendChild(modal);
		document.body.style.overflow = 'hidden';

		// Close modal functionality
		const closeBtn = modal.querySelector('.video-close');
		closeBtn.addEventListener('click', () => {
			document.body.removeChild(modal);
			document.body.style.overflow = 'auto';
		});

		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				document.body.removeChild(modal);
				document.body.style.overflow = 'auto';
			}
		});
	}

	// Like Button Functionality
	setupLikeButtons() {
		document.querySelectorAll('.like-btn').forEach(btn => {
			btn.addEventListener('click', async function() {
				const postId = this.dataset.postId;
				const likeCount = this.querySelector('.like-count');
                
				try {
					const response = await fetch(API_BASE + '/includes/like-handler.php', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ post_id: postId })
					});

					const result = await response.json();
                    
					if (result.success) {
						likeCount.textContent = result.likes;
						this.classList.toggle('liked');
					}
				} catch (error) {
					console.error('Error:', error);
				}
			});
		});
	}

	// Comment Form Handling
	setupCommentForms() {
		document.querySelectorAll('.comment-form').forEach(form => {
			form.addEventListener('submit', async function(e) {
				e.preventDefault();
                
				const formData = new FormData(this);
				const submitBtn = this.querySelector('button[type="submit"]');
				const originalText = submitBtn.textContent;

				try {
					submitBtn.textContent = 'Posting...';
					submitBtn.disabled = true;

					const response = await fetch(API_BASE + '/includes/comment-handler.php', {
						method: 'POST',
						body: formData
					});

					const result = await response.json();
                    
					if (result.success) {
						this.reset();
						this.insertAdjacentHTML('beforebegin', `
							<div class="alert alert-success">
								Thank you for your comment! It will be visible after approval.
							</div>
						`);
                        
						// Remove alert after 3 seconds
						setTimeout(() => {
							const alert = this.previousElementSibling;
							if (alert && alert.classList.contains('alert-success')) {
								alert.remove();
							}
						}, 3000);
					} else {
						alert('Error: ' + result.message);
					}
				} catch (error) {
					console.error('Error:', error);
					alert('An error occurred while posting your comment.');
				} finally {
					submitBtn.textContent = originalText;
					submitBtn.disabled = false;
				}
			});
		});
	}

	// Mobile Menu Toggle
	setupMobileMenu() {
		const navContainer = document.querySelector('.nav-container');
		const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');
		// Remove duplicate mobile buttons if present (keep the first one)
		const existingBtns = Array.from(document.querySelectorAll('.mobile-menu-btn'));
		if (existingBtns.length > 1) {
			existingBtns.slice(1).forEach(btn => btn.remove());
		}
		let mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-menu-btn');
		const backdrop = document.getElementById('mobileMenuBackdrop');

		// If there's no markup-provided mobile button, bail gracefully.
		// We intentionally do NOT auto-create the toggle here to avoid duplicate toggles
		// when header markup already includes one. Ensure `includes/header.php` contains
		// a button with id="mobileMenuBtn" and class="mobile-menu-btn".
		if (!mobileMenuBtn) {
			console.warn('Mobile menu button (#mobileMenuBtn) not found in DOM — mobile menu will not be initialized.');
			return;
		}

		const focusableSelector = 'a, button, [tabindex]:not([tabindex="-1"])';
		let lastFocusedEl = null;

		function openMenu() {
			mobileMenuBtn.setAttribute('aria-expanded', 'true');
			navMenu.classList.add('active');
			navMenu.setAttribute('aria-hidden', 'false');
			if (backdrop) backdrop.classList.add('active');
			document.body.style.overflow = 'hidden';
			lastFocusedEl = document.activeElement;
			// Focus the first focusable element inside the menu
			var first = navMenu.querySelector(focusableSelector);
			if (first && typeof first.focus === 'function') first.focus();
			document.addEventListener('keydown', onKeyDown);
		}

		function closeMenu() {
			mobileMenuBtn.setAttribute('aria-expanded', 'false');
			navMenu.classList.remove('active');
			navMenu.setAttribute('aria-hidden', 'true');
			if (backdrop) backdrop.classList.remove('active');
			document.body.style.overflow = '';
			document.removeEventListener('keydown', onKeyDown);
			// return focus to the element that had it before opening
			try { if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus(); } catch (e) { /* ignore */ }
		}

		function toggleMenu() {
			if (navMenu.classList.contains('active')) closeMenu(); else openMenu();
		}

		// Click & touch handlers
		mobileMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
		mobileMenuBtn.addEventListener('touchstart', (e) => { e.stopPropagation(); toggleMenu(); }, { passive: true });

		// Backdrop click closes menu
		if (backdrop) {
			backdrop.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); });
		}

		// Close when clicking/tapping outside the menu
		document.addEventListener('click', (e) => {
			if (!navMenu.classList.contains('active')) return;
			const target = e.target;
			if (!navMenu.contains(target) && !mobileMenuBtn.contains(target)) {
				closeMenu();
			}
		}, true);

		// Also handle touchstart for better mobile responsiveness
		document.addEventListener('touchstart', (e) => {
			if (!navMenu.classList.contains('active')) return;
			const target = e.target;
			if (!navMenu.contains(target) && !mobileMenuBtn.contains(target)) {
				closeMenu();
			}
		}, { passive: true, capture: true });

		// Keyboard handling: Escape to close, Tab to trap focus
		function onKeyDown(e) {
			if (e.key === 'Escape' || e.key === 'Esc') {
				closeMenu();
				return;
			}

			if (e.key === 'Tab' && navMenu.classList.contains('active')) {
				const focusables = Array.from(navMenu.querySelectorAll(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
				if (focusables.length === 0) { e.preventDefault(); return; }
				const idx = focusables.indexOf(document.activeElement);
				if (e.shiftKey) {
					if (idx === 0 || document.activeElement === mobileMenuBtn) {
						e.preventDefault();
						focusables[focusables.length - 1].focus();
					}
				} else {
					if (idx === focusables.length - 1) {
						e.preventDefault();
						focusables[0].focus();
					}
				}
			}
		}

		// Ensure menu state resets on resize (desktop layout)
		window.addEventListener('resize', () => {
			if (window.innerWidth > 768) {
				navMenu.classList.remove('active');
				navMenu.setAttribute('aria-hidden', 'false');
				mobileMenuBtn.setAttribute('aria-expanded', 'false');
				if (backdrop) backdrop.classList.remove('active');
				document.body.style.overflow = '';
			}
		});
	}
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	// Feature-detect backdrop-filter support; add fallback class for older browsers (EdgeHTML)
	try {
		if (!(window.CSS && CSS.supports && (CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)')))) {
			document.documentElement.classList.add('no-backdrop-filter');
		}
	} catch (e) {
		// ignore feature detection errors
	}

	new PodcastWebsite();
});

// Utility functions
function showNotification(message, type = 'success') {
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.textContent = message;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 1rem 2rem;
		background: ${type === 'success' ? '#4CAF50' : '#f44336'};
		color: white;
		border-radius: 5px;
		z-index: 4000;
		animation: slideIn 0.3s ease;
	`;

	document.body.appendChild(notification);

	setTimeout(() => {
		notification.remove();
	}, 3000);
}

// CSS for animations
const style = document.createElement('style');
style.textContent = `
	@keyframes slideIn {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
    
	.liked {
		color: #FF4757 !important;
	}
    
	.alert {
		padding: 1rem;
		border-radius: 5px;
		margin-bottom: 1rem;
	}
    
	.alert-success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}
`;
document.head.appendChild(style);