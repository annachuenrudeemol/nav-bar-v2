document.addEventListener('DOMContentLoaded', function() {
    // Track current active page
    let currentPageName = 'Campaigns'; // Default to Campaigns
    
    // Font Awesome icons don't need initialization - they work automatically

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
        
        // Font Awesome icons don't need reinitialization
    }

    // Right Panel functionality
    const sidebar = document.querySelector('.sidebar');
    const submenuPanel = document.getElementById('submenu-panel');
    const submenuItemsContainer = document.getElementById('submenu-items');
    const submenuSectionHeader = document.getElementById('submenu-section-header');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
                
    // Function to show right panel with submenu items
    function showSubmenuPanel(categoryName, categoryButton) {
        // Get submenu data from the button's section
        const navSection = categoryButton.closest('.nav-section');
        const submenuData = navSection.querySelector('.nav-submenu-data');
        
        if (!submenuData) return;
                
        // Update section header
        if (submenuSectionHeader) {
            const label = submenuSectionHeader.querySelector('.submenu-section-label');
            if (label) {
                label.textContent = categoryName.toUpperCase();
            }
        }
        
        // Clear existing submenu items
        if (submenuItemsContainer) {
            submenuItemsContainer.innerHTML = '';
        }
        
        // Create submenu items from data
        const items = submenuData.querySelectorAll('[data-item]');
        items.forEach((item, index) => {
            const itemText = item.getAttribute('data-item');
            const itemIcon = item.getAttribute('data-icon');
            const hasNested = item.getAttribute('data-has-nested') === 'true';
            const isActive = index === 0 && !hasNested; // First item is active by default, but not if it has nested items
            
            const submenuItem = document.createElement('div');
            submenuItem.className = `submenu-item ${hasNested ? 'has-nested' : ''} ${isActive ? 'active' : ''}`;
            
            // Check if this item has nested items
            const nestedItems = item.querySelectorAll('[data-nested-item]');
            
            if (hasNested && nestedItems.length > 0) {
                // Create parent item with chevron - match regular item structure
                submenuItem.innerHTML = `
                    <div class="submenu-item-content">
                        <span class="submenu-item-text">${itemText}</span>
                        <i class="fas fa-chevron-right submenu-item-chevron"></i>
                    </div>
                `;
                
                if (submenuItemsContainer) {
                    submenuItemsContainer.appendChild(submenuItem);
                }
                
                // Create nested items container
                const nestedContainer = document.createElement('div');
                nestedContainer.className = 'submenu-nested-items';
                
                nestedItems.forEach((nestedItem, nestedIndex) => {
                    const nestedText = nestedItem.getAttribute('data-nested-item');
                    const nestedIcon = nestedItem.getAttribute('data-nested-icon');
                    const isNestedActive = nestedIndex === 0 && index === 0; // First nested item is active by default if parent is first item
                    
                    const nestedItemEl = document.createElement('div');
                    nestedItemEl.className = `submenu-nested-item ${isNestedActive ? 'active' : ''}`;
                    nestedItemEl.innerHTML = `
                        <div class="submenu-nested-item-content">
                            <span class="submenu-nested-item-text">${nestedText}</span>
                        </div>
                    `;
                    
                    // Add click handler for nested item
                    nestedItemEl.addEventListener('click', function(e) {
                        e.stopPropagation();
                        // Update active state for nested items only (keep parent active)
                        document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Keep parent item active
                        const parentItem = this.closest('.submenu-item.has-nested');
                        if (parentItem) {
                            parentItem.classList.add('active');
                        }
                        
                        // Update page content
                        updatePageContent(nestedText);
                    });
                    
                    nestedContainer.appendChild(nestedItemEl);
                });
                
                submenuItem.appendChild(nestedContainer);
                
                // Add click handler for parent (expand/collapse nested items) - AFTER nested container is created
                submenuItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Clear active states from other items
                    document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                    
                    // Set this parent item as active
                    this.classList.add('active');
                    
                    // Ensure expanded state
                    if (!this.classList.contains('expanded')) {
                        this.classList.add('expanded');
                    }
                    
                    // Update chevron icon
                    const chevron = this.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        chevron.classList.remove('fa-chevron-right');
                        chevron.classList.add('fa-chevron-down');
                    }
                    
                    // Find and activate the first nested item
                    const nestedContainer = this.querySelector('.submenu-nested-items');
                    if (nestedContainer) {
                        const firstNestedItem = nestedContainer.querySelector('.submenu-nested-item');
                        if (firstNestedItem) {
                            firstNestedItem.classList.add('active');
                            const firstNestedText = firstNestedItem.querySelector('.submenu-nested-item-text')?.textContent;
                            if (firstNestedText) {
                                updatePageContent(firstNestedText);
                            }
                        }
                    }
                });
                
                // Expand by default if it's the first item and set as active
                if (index === 0) {
                    submenuItem.classList.add('expanded');
                    submenuItem.classList.add('active');
                    const chevron = submenuItem.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        chevron.classList.remove('fa-chevron-right');
                        chevron.classList.add('fa-chevron-down');
                    }
                    // Activate first nested item
                    const firstNestedItem = nestedContainer.querySelector('.submenu-nested-item');
                    if (firstNestedItem) {
                        firstNestedItem.classList.add('active');
                        const firstNestedText = firstNestedItem.querySelector('.submenu-nested-item-text')?.textContent;
                        if (firstNestedText) {
                            updatePageContent(firstNestedText);
                        }
                    }
                }
            } else {
                // Regular item without nested items
                submenuItem.innerHTML = `
                    <div class="submenu-item-content">
                        <span class="submenu-item-text">${itemText}</span>
                    </div>
                `;
                                    
                // Add click handler
                submenuItem.addEventListener('click', function() {
                    // Update active state
                    document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update page content
                    updatePageContent(itemText);
                });
                
                if (submenuItemsContainer) {
                    submenuItemsContainer.appendChild(submenuItem);
                }
            }
        });
        
        // Show the panel
        if (submenuPanel) {
            submenuPanel.classList.add('visible');
        }
    }
    
    // Function to hide right panel
    function hideSubmenuPanel() {
        if (submenuPanel) {
            submenuPanel.classList.remove('visible');
                                }
                            }
    
    
    // Hamburger toggle - shows/hides right panel (sidebar stays at 64px)
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            
            if (isPanelVisible) {
                // Hide right panel
                hideSubmenuPanel();
            } else {
                // Show right panel - if there's an active category, show its submenu
                const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
                if (activeButton) {
                    const categoryName = activeButton.querySelector('.nav-label')?.textContent || 
                                         activeButton.getAttribute('aria-label') || 
                                         'Analytics';
                    showSubmenuPanel(categoryName, activeButton);
                } else {
                    // If no active category, activate the first one (Analytics) by default
                    const firstButton = sidebar.querySelector('.nav-icon-btn.expandable');
                    if (firstButton) {
                        firstButton.classList.add('active');
                        const categoryName = firstButton.querySelector('.nav-label')?.textContent || 
                                             firstButton.getAttribute('aria-label') || 
                                             'Analytics';
                        showSubmenuPanel(categoryName, firstButton);
                    }
                }
            }
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
                e.stopPropagation();
            
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            
            if (!isPanelVisible) {
                // When right panel is not visible, use hover card functionality
                clearAllActiveStates();
                
                // Find the first hover card item
                const hoverCard = this.querySelector('.hover-card');
                if (hoverCard) {
                    const firstItem = hoverCard.querySelector('.hover-card-item');
                    if (firstItem) {
                        // Set the first item as active
                        firstItem.classList.add('active');
                        
                        // Store which item should be active
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
            
            // When right panel is visible, update it with clicked category
            clearAllActiveStates();
            this.classList.add('active');
            
            // Get category name from nav-label or aria-label
            const categoryName = this.querySelector('.nav-label')?.textContent || 
                                 this.getAttribute('aria-label') || 
                                 'Menu';
            
            // Show right panel with submenu items
            showSubmenuPanel(categoryName, this);
            
            // Set first submenu item as active and update page
            setTimeout(() => {
                const firstSubmenuItem = submenuItemsContainer?.querySelector('.submenu-item');
                if (firstSubmenuItem) {
                    // Check if it has nested items
                    const firstNestedItem = firstSubmenuItem.querySelector('.submenu-nested-item.active');
                    if (firstNestedItem) {
                        const nestedItemText = firstNestedItem.querySelector('.submenu-nested-item-text')?.textContent;
                        if (nestedItemText) {
                            updatePageContent(nestedItemText);
                        }
                    } else {
                        const firstItemText = firstSubmenuItem.querySelector('.submenu-item-text')?.textContent;
                        if (firstItemText) {
                            updatePageContent(firstItemText);
                        }
                    }
                }
            }, 0);
        });
    });

    // Submenu items are now handled in showSubmenuPanel function above

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
