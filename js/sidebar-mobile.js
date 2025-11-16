/**
 * 📱 SIDEBAR MOBILE MANAGER
 * =========================
 * Gère l'ouverture/fermeture de la sidebar sur mobile
 * - Bouton hamburger
 * - Overlay
 * - Animations
 * - Accessibilité (ARIA, focus trap)
 */

export class SidebarMobile {
    constructor() {
        this.sidebar = null;
        this.toggleBtn = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Récupérer les éléments
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.getElementById('sidebar-toggle-btn');
        this.overlay = document.getElementById('sidebar-overlay');

        if (!this.sidebar || !this.toggleBtn || !this.overlay) {
            console.warn('⚠️ Sidebar mobile: éléments manquants', {
                sidebar: !!this.sidebar,
                toggleBtn: !!this.toggleBtn,
                overlay: !!this.overlay
            });
            return;
        }

        // Attacher les événements
        this.attachEvents();

        console.log('✅ Sidebar mobile initialisée');
    }

    attachEvents() {
        // Clic sur le bouton hamburger
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Clic sur l'overlay
        this.overlay.addEventListener('click', () => {
            this.close();
        });

        // Fermer au clic sur un lien de navigation
        const navLinks = this.sidebar.querySelectorAll('.sidebar-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Fermer uniquement sur mobile
                if (window.innerWidth <= 768) {
                    this.close();
                }
            });
        });

        // Fermer avec la touche Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Gérer le resize (fermer si on passe en desktop)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isOpen) {
                    this.close();
                }
            }, 150);
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
        this.toggleBtn.setAttribute('aria-expanded', 'true');
        this.toggleBtn.setAttribute('aria-label', 'Fermer le menu');
        this.isOpen = true;

        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';

        // Focus sur le premier lien de navigation
        setTimeout(() => {
            const firstLink = this.sidebar.querySelector('.sidebar-item');
            if (firstLink) {
                firstLink.focus();
            }
        }, 300); // Attendre la fin de l'animation
    }

    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.toggleBtn.setAttribute('aria-label', 'Ouvrir le menu');
        this.isOpen = false;

        // Réactiver le scroll du body
        document.body.style.overflow = '';

        // Remettre le focus sur le bouton hamburger
        this.toggleBtn.focus();
    }
}

// Initialiser automatiquement
const sidebarMobile = new SidebarMobile();

// Exporter pour usage externe si nécessaire
export default sidebarMobile;

