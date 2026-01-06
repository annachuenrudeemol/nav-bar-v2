document.addEventListener('DOMContentLoaded', function() {
    // Track current active page
    let currentPageName = 'Campaigns'; // Default to Campaigns
    
    function initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    initIcons();
    setTimeout(initIcons, 100);

    // Function to update page content based on active page
    function updatePageContent(pageName) {
        currentPageName = pageName;
        const campaignsContent = document.getElementById('campaigns-content');
        const templateContent = document.getElementById('page-template-content');
        const pageTitle = document.getElementById('page-template-title');
        const pageSubtitle = document.getElementById('page-template-subtitle');
        
        if (pageName === 'Campaigns') {
            // Show campaigns content, hide template
            if (campaignsContent) campaignsContent.style.display = 'flex';
            if (templateContent) templateContent.style.display = 'none';
        } else {
            // Show template, hide campaigns content
            if (campaignsContent) campaignsContent.style.display = 'none';
            if (templateContent) templateContent.style.display = 'flex';
            
            // Update template text
            if (pageTitle) {
                pageTitle.textContent = pageName;
            }
            if (pageSubtitle) {
                pageSubtitle.textContent = `This page would show ${pageName.toLowerCase()}.`;
            }
        }
        
        // Update tabs
        updateTabs(pageName);
    }

    // Function to update tab labels based on page name
    function updateTabs(pageName) {
        const tabs = document.querySelectorAll('.tab');
        const tabLabels = [
            `${pageName} view`,
            `Custom ${pageName.toLowerCase()} view`,
            `Custom ${pageName.toLowerCase()} view`
        ];
        
        tabs.forEach((tab, index) => {
            const label = tab.querySelector('.tab-label');
            if (label && tabLabels[index]) {
                label.textContent = tabLabels[index];
            }
        });
        
        // Reinitialize icons after updating
        setTimeout(initIcons, 50);
    }

    // Sidebar expand/collapse toggle
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const wasExpanded = sidebar.classList.contains('expanded');
            
            if (!wasExpanded) {
                // Expanding - toggle immediately
                sidebar.classList.toggle('expanded');
                // Sidebar is now expanded - add expanding class for delayed animation
                sidebar.classList.add('expanding');
                
                // Force a reflow to ensure the expanding class is applied
                void sidebar.offsetHeight;
                
                // First, ensure all submenus are collapsed initially (even if they have expanded class in HTML)
                // This ensures they animate in with the delay
                document.querySelectorAll('.nav-submenu').forEach(submenu => {
                    submenu.classList.remove('expanded');
                });
                
                // Show submenus for active sections with a delay for animation
                setTimeout(() => {
                    // Sync active state from hover cards to submenu items (only the first one found)
                    const activeButtons = document.querySelectorAll('.nav-icon-btn.expandable[data-active-item]');
                    if (activeButtons.length > 0) {
                        // Only process the first active button to ensure only one page is selected
                        const btn = activeButtons[0];
                        const activeItemText = btn.getAttribute('data-active-item');
                        if (activeItemText) {
                            // Clear all active states first to ensure only one page is selected
                            clearAllActiveStates();
                            
                            const navSection = btn.closest('.nav-section');
                            if (navSection) {
                                const submenu = navSection.querySelector('.nav-submenu');
                                if (submenu) {
                                    // Find matching submenu item by text
                                    const submenuItems = submenu.querySelectorAll('.nav-submenu-item');
                                    submenuItems.forEach(subItem => {
                                        const subItemText = subItem.querySelector('.nav-submenu-content span')?.textContent?.trim();
                                        if (subItemText === activeItemText.trim()) {
                                            subItem.classList.add('active');
                                        }
                                    });
                                    
                                    // Expand the submenu and button
                                    submenu.classList.add('expanded');
                                    btn.classList.add('expanded');
                                    btn.classList.add('active');
                                }
                            }
                        }
                    } else {
                        // Check if there's already an active submenu item (from initial HTML state)
                        const activeSubItem = document.querySelector('.nav-submenu-item.active');
                        if (activeSubItem) {
                            const navSection = activeSubItem.closest('.nav-section');
                            if (navSection) {
                                const submenu = navSection.querySelector('.nav-submenu');
                                const activeBtn = navSection.querySelector('.nav-icon-btn.expandable');
                                if (submenu && activeBtn) {
                                    // Expand the submenu and button with animation delay
                                    submenu.classList.add('expanded');
                                    activeBtn.classList.add('expanded');
                                    activeBtn.classList.add('active');
                                }
                            }
                        }
                    }
                    
                    // Remove expanding class after animation completes
                    setTimeout(() => {
                        sidebar.classList.remove('expanding');
                    }, 600); // Wait for transition to complete (0.05s delay + 0.3s transition + 0.25s submenu delay)
                }, 50); // Small delay to ensure expanding class is applied
            } else {
                // Sidebar is now collapsing - add collapsing class for delayed animation
                sidebar.classList.add('collapsing');
                
                // Force a reflow to ensure the collapsing class is applied
                void sidebar.offsetHeight;
                
                // Hide all submenus first
                document.querySelectorAll('.nav-submenu').forEach(submenu => {
                    submenu.classList.remove('expanded');
                });
                document.querySelectorAll('.nav-icon-btn.expandable').forEach(btn => {
                    btn.classList.remove('expanded');
                });
                
                // Delay before starting the collapse animation
                setTimeout(() => {
                    sidebar.classList.remove('expanded');
                    
                    // Remove collapsing class after animation completes
                    setTimeout(() => {
                        sidebar.classList.remove('collapsing');
                    }, 350);
                }, 50); // Delay before collapse animation starts
            }
            
            // Reinitialize icons after toggle to update chevron rotations
            setTimeout(initIcons, 100);
        });
    }

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => {
                t.classList.remove('active');
                const badge = t.querySelector('.tab-badge');
                if (badge) badge.classList.remove('active');
            });
            this.classList.add('active');
            const badge = this.querySelector('.tab-badge');
            if (badge) badge.classList.add('active');
        });
    });

    // Helper function to clear all active states
    function clearAllActiveStates() {
        // Remove active from all nav buttons (except menu-toggle and primary)
        document.querySelectorAll('.nav-icon-btn').forEach(btn => {
            if (!btn.classList.contains('menu-toggle-btn') && !btn.classList.contains('primary')) {
                btn.classList.remove('active');
                // Also remove data-active-item attribute to prevent stale state
                btn.removeAttribute('data-active-item');
            }
        });
        // Remove active from all submenu items
        document.querySelectorAll('.nav-submenu-item').forEach(item => {
            item.classList.remove('active');
        });
        // Remove active from all hover card items
        document.querySelectorAll('.hover-card-item').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Expandable nav sections
    const expandableButtons = document.querySelectorAll('.nav-icon-btn.expandable');
    expandableButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!sidebar.classList.contains('expanded')) {
                // When collapsed, navigate to the first item in the hover card
                e.stopPropagation();
                clearAllActiveStates();
                
                // Find the first hover card item
                const hoverCard = this.querySelector('.hover-card');
                if (hoverCard) {
                    const firstItem = hoverCard.querySelector('.hover-card-item');
                    if (firstItem) {
                        // Set the first item as active
                        firstItem.classList.add('active');
                        
                        // Store which item should be active so it persists when sidebar expands
                        const span = firstItem.querySelector('span');
                        const itemText = span?.textContent || '';
                        this.setAttribute('data-active-item', itemText);
                        
                        // Update page content
                        if (itemText) {
                            updatePageContent(itemText);
                        }
                    }
                }
                
                // Set the button as active
                this.classList.add('active');
                
                // Keep hover card visible after click
                this.classList.add('show-hover-card');
                return;
            }
            e.stopPropagation();
            const navSection = this.closest('.nav-section');
            if (!navSection) return;
            
            const submenu = navSection.querySelector('.nav-submenu');
            if (!submenu) return;
            
            const isExpanded = submenu.classList.contains('expanded');
            
            // Check if any submenu item in this section is active
            const hasActiveItem = submenu.querySelector('.nav-submenu-item.active') !== null;
            
            // Don't clear active states - keep the selected page active
            // Don't set the button as active - it's just a folder
            
            // Only allow collapsing if no items are active in this section
            if (!isExpanded) {
                // Always allow expanding
                submenu.classList.add('expanded');
                this.classList.add('expanded');
            } else if (!hasActiveItem) {
                // Only allow collapsing if no items are active
                submenu.classList.remove('expanded');
                this.classList.remove('expanded');
            }
            // If hasActiveItem is true, do nothing (prevent collapse)
            
            // Update chevron icon
            setTimeout(initIcons, 50);
        });
    });

    // Submenu item clicks
    document.querySelectorAll('.nav-submenu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const navSection = this.closest('.nav-section');
            const submenu = navSection.querySelector('.nav-submenu');
            const parentButton = navSection.querySelector('.nav-icon-btn.expandable');
            
            // Clear all active states first
            clearAllActiveStates();
            
            // Add active to clicked submenu item
            this.classList.add('active');
            
            // Make parent button active so it shows as selected (blue) when a child page is selected
            if (parentButton) {
                parentButton.classList.add('active');
            }
            
            // Get page name and update content
            const pageNameSpan = this.querySelector('.nav-submenu-content span');
            const pageName = pageNameSpan ? pageNameSpan.textContent.trim() : '';
            if (pageName) {
                updatePageContent(pageName);
            }
        });
    });

    // Sidebar navigation icon buttons (for non-expandable items)
    const navIconButtons = document.querySelectorAll('.nav-icon-btn:not(.expandable)');
    navIconButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('primary') || this.classList.contains('menu-toggle-btn')) {
                return;
            }
            e.stopPropagation();
            
            // Clear all active states first
            clearAllActiveStates();
            
            // Set this button as active
            this.classList.add('active');
        });
    });

    // Tabs scrollable container fade indicators
    const tabsContainer = document.querySelector('.tabs');
    if (tabsContainer) {
        function updateScrollIndicators() {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainer;
            tabsContainer.classList.remove('scrollable-left', 'scrollable-right');
            if (scrollWidth > clientWidth) {
                if (scrollLeft > 0) tabsContainer.classList.add('scrollable-left');
                if (scrollLeft < scrollWidth - clientWidth - 1) tabsContainer.classList.add('scrollable-right');
            }
        }
        updateScrollIndicators();
        tabsContainer.addEventListener('scroll', updateScrollIndicators);
        window.addEventListener('resize', updateScrollIndicators);
        setTimeout(updateScrollIndicators, 100);
    }

    // Hover card functionality (only when sidebar is collapsed)
    document.querySelectorAll('.nav-icon-btn').forEach(button => {
        const hoverCard = button.querySelector('.hover-card');
        if (!hoverCard) return;
        
        let showTimeout, hideTimeout;
        
        function showCard() {
            // Only show if sidebar is NOT expanded
            if (sidebar && sidebar.classList.contains('expanded')) {
                return;
            }
            clearTimeout(hideTimeout);
            clearTimeout(showTimeout);
            showTimeout = setTimeout(() => {
                if (!sidebar || !sidebar.classList.contains('expanded')) {
                    button.classList.add('show-hover-card');
                    
                    // Restore active state if this button has an active item
                    const activeItemText = button.getAttribute('data-active-item');
                    if (activeItemText) {
                        const hoverCard = button.querySelector('.hover-card');
                        if (hoverCard) {
                            const items = hoverCard.querySelectorAll('.hover-card-item');
                            items.forEach(item => {
                                const itemText = item.querySelector('span')?.textContent || '';
                                if (itemText === activeItemText) {
                                    item.classList.add('active');
                                }
                            });
                        }
                    }
                }
            }, 300);
        }
        
        function scheduleHide() {
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                button.classList.remove('show-hover-card');
            }, 100);
        }
        
        function cancelHide() {
            clearTimeout(hideTimeout);
        }
        
        button.addEventListener('mouseenter', (e) => {
            cancelHide();
            showCard();
        });
        
        button.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
            scheduleHide();
        });
        
        hoverCard.addEventListener('mouseenter', cancelHide);
        hoverCard.addEventListener('mouseleave', () => {
            // Don't close if there's an active item
            const hasActiveItem = button.getAttribute('data-active-item');
            if (!hasActiveItem) {
                clearTimeout(showTimeout);
                button.classList.remove('show-hover-card');
            }
        });
    });

    // Hover card item clicks (only when sidebar is collapsed)
    // Use event delegation on document to catch all clicks
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('expanded')) return;
        
        const clickedItem = e.target.closest('.hover-card-item');
        if (!clickedItem) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const hoverCard = clickedItem.closest('.hover-card');
        const parentButton = hoverCard ? hoverCard.closest('.nav-icon-btn') : null;
        
        console.log('=== HOVER CARD ITEM CLICKED ===');
        console.log('Item:', clickedItem);
        console.log('Item text:', clickedItem.querySelector('span')?.textContent);
        
        // Clear all active states first to ensure only one page is selected
        clearAllActiveStates();
        
        // Add active to clicked hover card item
        clickedItem.classList.add('active');
        
        // Make parent button active
        if (parentButton && !parentButton.classList.contains('primary') && !parentButton.classList.contains('menu-toggle-btn')) {
            parentButton.classList.add('active');
            // Keep hover card visible after click
            parentButton.classList.add('show-hover-card');
            
            // Store which item should be active so it persists when hover card reopens
            const span = clickedItem.querySelector('span');
            const itemText = span?.textContent || '';
            parentButton.setAttribute('data-active-item', itemText);
            
            // Update page content
            if (itemText) {
                updatePageContent(itemText);
            }
        }
        
        // Force a reflow and check
        void clickedItem.offsetHeight;
        
        console.log('After click - Has active class:', clickedItem.classList.contains('active'));
        console.log('Computed background:', window.getComputedStyle(clickedItem).backgroundColor);
        console.log('Computed span color:', window.getComputedStyle(clickedItem.querySelector('span')).color);
        console.log('Active class list:', clickedItem.className);
    }, true); // Use capture phase to catch it early

    // Initialize page content on load
    updatePageContent(currentPageName);
});
