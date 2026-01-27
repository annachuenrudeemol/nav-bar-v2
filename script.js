document.addEventListener('DOMContentLoaded', function() {
    // Track current active page
    let currentPageName = 'Overview';
    
    // Track current nav version
    let currentNavVersion = 'Click to expand';
    
    // Function to update page content based on active page
    function updatePageContent(pageName) {
        currentPageName = pageName;
        const pageTitleMain = document.getElementById('page-title-main');
        const pageDescription = document.getElementById('page-description');
        const illustrationTitle = document.getElementById('illustration-title');
        const illustrationSubtitle = document.getElementById('illustration-subtitle');
        
        // Update page header
        if (pageTitleMain) {
            pageTitleMain.textContent = pageName;
        }
        if (pageDescription) {
            pageDescription.textContent = `Page description would go here.`;
        }
        
        // Update illustration text
        if (illustrationTitle) {
            illustrationTitle.textContent = pageName;
        }
        if (illustrationSubtitle) {
            illustrationSubtitle.textContent = `Page description would go here.`;
        }
    }

    // Right Panel functionality
    const sidebar = document.querySelector('.sidebar');
    const submenuPanel = document.getElementById('submenu-panel');
    const submenuItemsContainer = document.getElementById('submenu-items');
    const submenuSectionHeader = document.getElementById('submenu-section-header');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
                
    // Function to show right panel with submenu items
    function showSubmenuPanel(categoryName, categoryButton) {
        // Get submenu data from the button's section or from the button's next sibling
        let submenuData = null;
        const navSection = categoryButton.closest('.nav-section');
        if (navSection) {
            submenuData = navSection.querySelector('.nav-submenu-data');
        } else {
            // For bottom section items like Tools & Settings
            submenuData = categoryButton.nextElementSibling;
            if (submenuData && !submenuData.classList.contains('nav-submenu-data')) {
                submenuData = null;
            }
        }
        
        // Update section header with title case
        if (submenuSectionHeader) {
            const title = submenuSectionHeader.querySelector('.submenu-section-title');
            if (title) {
                title.textContent = categoryName;
            }
        }
        
        // Clear existing submenu items
        if (submenuItemsContainer) {
            submenuItemsContainer.innerHTML = '';
        }
        
        // Special case for Overview - show workflow customization panel
        if (categoryName === 'Overview') {
            if (submenuItemsContainer) {
                submenuItemsContainer.innerHTML = `
                    <div class="overview-panel">
                        <div class="overview-header">
                            <div class="overview-title">Customize your workflow</div>
                            <div class="overview-description">This changes what your workflow looks like.</div>
                        </div>
                        <div class="workflow-options">
                            <div class="workflow-option active" data-workflow="tile">
                                <div class="workflow-preview tile-preview">
                                    <div class="preview-tile"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Tile</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                            <div class="workflow-option" data-workflow="panel">
                                <div class="workflow-preview panel-preview">
                                    <div class="preview-panel"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Panel</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                            <div class="workflow-option" data-workflow="editor">
                                <div class="workflow-preview editor-preview">
                                    <div class="preview-editor"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Editor</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add click handlers for workflow options
                submenuItemsContainer.querySelectorAll('.workflow-option').forEach(option => {
                    option.addEventListener('click', function() {
                        submenuItemsContainer.querySelectorAll('.workflow-option').forEach(o => o.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            }
            
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            updatePageContent(categoryName);
            return;
        }
        
        // If no submenu data or empty, just show the panel with the category name
        if (!submenuData) {
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            updatePageContent(categoryName);
            return;
        }
        
        // Create submenu items from data
        const items = submenuData.querySelectorAll(':scope > [data-item]');
        
        if (items.length === 0) {
            // No items - just show panel
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            updatePageContent(categoryName);
            return;
        }
        
        items.forEach((item, index) => {
            const itemText = item.getAttribute('data-item');
            const itemIcon = item.getAttribute('data-icon');
            const hasNested = item.getAttribute('data-has-nested') === 'true';
            const nestedItems = item.querySelectorAll('[data-nested-item]');
            const isActive = index === 0;
            
            const submenuItem = document.createElement('div');
            submenuItem.className = `submenu-item ${hasNested && nestedItems.length > 0 ? 'has-nested' : ''} ${isActive ? 'active' : ''}`;
            
            // Determine if we should show chevron (only if there are nested items)
            const showChevron = hasNested && nestedItems.length > 0;
            
            if (showChevron) {
                submenuItem.innerHTML = `
                    <div class="submenu-item-header">
                        <div class="submenu-item-left">
                            <i class="fas ${itemIcon} submenu-item-icon"></i>
                            <span class="submenu-item-text">${itemText}</span>
                        </div>
                        <i class="fas fa-chevron-right submenu-item-chevron"></i>
                    </div>
                `;
            } else {
                submenuItem.innerHTML = `
                    <div class="submenu-item-left">
                        <i class="fas ${itemIcon} submenu-item-icon"></i>
                        <span class="submenu-item-text">${itemText}</span>
                    </div>
                `;
            }
            
            if (submenuItemsContainer) {
                submenuItemsContainer.appendChild(submenuItem);
            }
            
            // If has nested items, create nested container
            if (showChevron) {
                const nestedContainer = document.createElement('div');
                nestedContainer.className = 'submenu-nested-items';
                
                nestedItems.forEach((nestedItem, nestedIndex) => {
                    const nestedText = nestedItem.getAttribute('data-nested-item');
                    const isNestedActive = nestedIndex === 0 && isActive;
                    
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
                        document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        updatePageContent(nestedText);
                    });
                    
                    nestedContainer.appendChild(nestedItemEl);
                });
                
                submenuItem.appendChild(nestedContainer);
                
                // Add click handler for parent (expand/collapse)
                submenuItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Clear active states from other items
                    document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                    
                    // Set this parent item as active
                    this.classList.add('active');
                    
                    // Toggle expanded state
                    this.classList.toggle('expanded');
                    
                    // Update chevron icon
                    const chevron = this.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        if (this.classList.contains('expanded')) {
                            chevron.classList.remove('fa-chevron-right');
                            chevron.classList.add('fa-chevron-down');
                        } else {
                            chevron.classList.remove('fa-chevron-down');
                            chevron.classList.add('fa-chevron-right');
                        }
                    }
                    
                    // Activate first nested item if expanding
                    if (this.classList.contains('expanded')) {
                        const firstNestedItem = this.querySelector('.submenu-nested-item');
                        if (firstNestedItem) {
                            firstNestedItem.classList.add('active');
                            const firstNestedText = firstNestedItem.querySelector('.submenu-nested-item-text')?.textContent;
                            if (firstNestedText) {
                                updatePageContent(firstNestedText);
                            }
                        }
                    }
                });
                
                // Expand by default if it's the first item
                if (isActive) {
                    submenuItem.classList.add('expanded');
                    // Update chevron to down when auto-expanded
                    const chevron = submenuItem.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        chevron.classList.remove('fa-chevron-right');
                        chevron.classList.add('fa-chevron-down');
                    }
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
                submenuItem.addEventListener('click', function() {
                    document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    updatePageContent(itemText);
                });
                
                // Set first item as active page
                if (isActive) {
                    updatePageContent(itemText);
                }
            }
        });
        
        // Show the panel
        if (submenuPanel) {
            submenuPanel.classList.add('visible');
        }
    }
    
    // Function to show right panel WITHOUT navigating (just for browsing)
    function showSubmenuPanelWithoutNavigation(categoryName, categoryButton) {
        // Get submenu data from the button's section or from the button's next sibling
        let submenuData = null;
        const navSection = categoryButton.closest('.nav-section');
        if (navSection) {
            submenuData = navSection.querySelector('.nav-submenu-data');
        } else {
            submenuData = categoryButton.nextElementSibling;
            if (submenuData && !submenuData.classList.contains('nav-submenu-data')) {
                submenuData = null;
            }
        }
        
        // Update section header with title case
        if (submenuSectionHeader) {
            const title = submenuSectionHeader.querySelector('.submenu-section-title');
            if (title) {
                title.textContent = categoryName;
            }
        }
        
        // Clear existing submenu items
        if (submenuItemsContainer) {
            submenuItemsContainer.innerHTML = '';
        }
        
        // Special case for Overview - show workflow customization panel
        if (categoryName === 'Overview') {
            if (submenuItemsContainer) {
                submenuItemsContainer.innerHTML = `
                    <div class="overview-panel">
                        <div class="overview-header">
                            <div class="overview-title">Customize your workflow</div>
                            <div class="overview-description">This changes what your workflow looks like.</div>
                        </div>
                        <div class="workflow-options">
                            <div class="workflow-option active" data-workflow="tile">
                                <div class="workflow-preview tile-preview">
                                    <div class="preview-tile"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Tile</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                            <div class="workflow-option" data-workflow="panel">
                                <div class="workflow-preview panel-preview">
                                    <div class="preview-panel"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Panel</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                            <div class="workflow-option" data-workflow="editor">
                                <div class="workflow-preview editor-preview">
                                    <div class="preview-editor"></div>
                                </div>
                                <div class="workflow-text">
                                    <div class="workflow-name">Editor</div>
                                    <div class="workflow-desc">Best for blabla workflow.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add click handlers for workflow options
                submenuItemsContainer.querySelectorAll('.workflow-option').forEach(option => {
                    option.addEventListener('click', function() {
                        submenuItemsContainer.querySelectorAll('.workflow-option').forEach(o => o.classList.remove('active'));
                        this.classList.add('active');
                    });
                });
            }
            
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            return;
        }
        
        // If no submenu data or empty, just show the panel with the category name
        if (!submenuData) {
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            return;
        }
        
        // Create submenu items from data
        const items = submenuData.querySelectorAll(':scope > [data-item]');
        
        if (items.length === 0) {
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            return;
        }
        
        items.forEach((item, index) => {
            const itemText = item.getAttribute('data-item');
            const itemIcon = item.getAttribute('data-icon');
            const hasNested = item.getAttribute('data-has-nested') === 'true';
            const nestedItems = item.querySelectorAll('[data-nested-item]');
            
            const submenuItem = document.createElement('div');
            submenuItem.className = `submenu-item ${hasNested && nestedItems.length > 0 ? 'has-nested' : ''}`;
            
            const showChevron = hasNested && nestedItems.length > 0;
            
            if (showChevron) {
                submenuItem.innerHTML = `
                    <div class="submenu-item-header">
                        <div class="submenu-item-left">
                            <i class="fas ${itemIcon} submenu-item-icon"></i>
                            <span class="submenu-item-text">${itemText}</span>
                        </div>
                        <i class="fas fa-chevron-right submenu-item-chevron"></i>
                    </div>
                `;
            } else {
                submenuItem.innerHTML = `
                    <div class="submenu-item-left">
                        <i class="fas ${itemIcon} submenu-item-icon"></i>
                        <span class="submenu-item-text">${itemText}</span>
                    </div>
                `;
            }
            
            if (submenuItemsContainer) {
                submenuItemsContainer.appendChild(submenuItem);
            }
            
            if (showChevron) {
                const nestedContainer = document.createElement('div');
                nestedContainer.className = 'submenu-nested-items';
                
                nestedItems.forEach((nestedItem, nestedIndex) => {
                    const nestedText = nestedItem.getAttribute('data-nested-item');
                    
                    const nestedItemEl = document.createElement('div');
                    nestedItemEl.className = 'submenu-nested-item';
                    nestedItemEl.innerHTML = `
                        <div class="submenu-nested-item-content">
                            <span class="submenu-nested-item-text">${nestedText}</span>
                        </div>
                    `;
                    
                    // Click handler navigates to the page
                    nestedItemEl.addEventListener('click', function(e) {
                        e.stopPropagation();
                        document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                        document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                        submenuItem.classList.add('active');
                        
                        // Now actually navigate
                        clearAllActiveStates();
                        categoryButton.classList.add('active');
                        updatePageContent(nestedText);
                    });
                    
                    nestedContainer.appendChild(nestedItemEl);
                });
                
                submenuItem.appendChild(nestedContainer);
                
                // Click handler for parent (expand/collapse)
                submenuItem.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('expanded');
                    
                    const chevron = this.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        if (this.classList.contains('expanded')) {
                            chevron.classList.remove('fa-chevron-right');
                            chevron.classList.add('fa-chevron-down');
                        } else {
                            chevron.classList.remove('fa-chevron-down');
                            chevron.classList.add('fa-chevron-right');
                        }
                    }
                });
            } else {
                // Regular item - clicking navigates
                submenuItem.addEventListener('click', function() {
                    document.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Now actually navigate
                    clearAllActiveStates();
                    categoryButton.classList.add('active');
                    updatePageContent(itemText);
                });
            }
        });
        
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
    
    // Hamburger toggle - shows/hides right panel
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            
            if (isPanelVisible) {
                hideSubmenuPanel();
            } else {
                const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
                if (activeButton) {
                    const categoryName = activeButton.getAttribute('aria-label') || 'Menu';
                    showSubmenuPanel(categoryName, activeButton);
                } else {
                    const firstButton = sidebar.querySelector('.nav-icon-btn.expandable');
                    if (firstButton) {
                        firstButton.classList.add('active');
                        const categoryName = firstButton.getAttribute('aria-label') || 'Menu';
                        showSubmenuPanel(categoryName, firstButton);
                    }
                }
            }
        });
    }
    
    // Click outside to close panel (for Click to expand version)
    document.addEventListener('click', function(e) {
        if (currentNavVersion === 'Click to expand') {
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            if (isPanelVisible) {
                // Check if click is outside sidebar and submenu panel
                const clickedInsideSidebar = sidebar && sidebar.contains(e.target);
                const clickedInsidePanel = submenuPanel && submenuPanel.contains(e.target);
                
                if (!clickedInsideSidebar && !clickedInsidePanel) {
                    hideSubmenuPanel();
                }
            }
        }
    });

    // Helper function to clear all active states
    function clearAllActiveStates() {
        document.querySelectorAll('.nav-icon-btn').forEach(btn => {
            if (!btn.classList.contains('menu-toggle-btn') && !btn.classList.contains('primary')) {
                btn.classList.remove('active');
            }
        });
    }

    // Helper function to get the first page name from a category's submenu data
    function getFirstPageInCategory(categoryButton) {
        const navSection = categoryButton.closest('.nav-section');
        let submenuData = null;
        
        if (navSection) {
            submenuData = navSection.querySelector('.nav-submenu-data');
        } else {
            // For bottom section items like Tools & Settings
            submenuData = categoryButton.nextElementSibling;
            if (submenuData && !submenuData.classList.contains('nav-submenu-data')) {
                submenuData = null;
            }
        }
        
        if (submenuData) {
            const firstItem = submenuData.querySelector('[data-item]');
            if (firstItem) {
                // Check if first item has nested items
                const hasNested = firstItem.getAttribute('data-has-nested') === 'true';
                const firstNestedItem = firstItem.querySelector('[data-nested-item]');
                
                if (hasNested && firstNestedItem) {
                    // Return the first nested item's name
                    return firstNestedItem.getAttribute('data-nested-item');
                }
                // Return the first item's name
                return firstItem.getAttribute('data-item');
            }
        }
        
        // Fallback to category name if no submenu items
        return categoryButton.getAttribute('aria-label') || 'Menu';
    }

    // Expandable nav sections
    const expandableButtons = document.querySelectorAll('.nav-icon-btn.expandable');
    expandableButtons.forEach(button => {
        // Click handler
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Hide any hover card
            this.classList.remove('show-hover-card');
            
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            const categoryName = this.getAttribute('aria-label') || 'Menu';
            const firstPageName = getFirstPageInCategory(this);
            
            // Hover to expand: Always switch pages on click
            if (currentNavVersion === 'Hover to expand') {
                clearAllActiveStates();
                this.classList.add('active');
                updatePageContent(firstPageName);
                // Update the submenu panel to show this category
                if (isPanelVisible) {
                    showSubmenuPanel(categoryName, this);
                }
                return;
            }
            
            // Click to navigate: Navigate to first page AND open panel
            if (currentNavVersion === 'Click to navigate') {
                clearAllActiveStates();
                this.classList.add('active');
                updatePageContent(firstPageName);
                showSubmenuPanel(categoryName, this);
                return;
            }
            
            // Click to expand behavior (V1)
            clearAllActiveStates();
            this.classList.add('active');
            
            if (!isPanelVisible) {
                // Panel is collapsed - just navigate to first page, don't open panel
                updatePageContent(firstPageName);
            } else {
                // Panel is open - update panel content
                showSubmenuPanel(categoryName, this);
            }
        });
        
        // Tooltip functionality for Hover to expand version
        let tooltipTimeout;
        
        button.addEventListener('mouseenter', () => {
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            // Show tooltip for V2 always, or V3 when panel is expanded
            if (currentNavVersion === 'Hover to expand' || 
                (currentNavVersion === 'Click to navigate' && isPanelVisible)) {
                // Show tooltip with delay
                tooltipTimeout = setTimeout(() => {
                    button.classList.add('show-tooltip');
                }, 400);
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (currentNavVersion === 'Hover to expand' || currentNavVersion === 'Click to navigate') {
                clearTimeout(tooltipTimeout);
                button.classList.remove('show-tooltip');
            }
        });
        
        // Hover card functionality for nav buttons (Click to expand version)
        const hoverCard = button.querySelector('.hover-card:not(.create-hover-card)');
        if (hoverCard) {
            let showTimeout, hideTimeout;
            
            function showCard() {
                clearTimeout(hideTimeout);
                clearTimeout(showTimeout);
                showTimeout = setTimeout(() => {
                    button.classList.add('show-hover-card');
                }, 400);
            }
            
            function scheduleHide() {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    button.classList.remove('show-hover-card');
                }, 150);
            }
            
            function cancelHide() {
                clearTimeout(hideTimeout);
            }
            
            function hideCardImmediately() {
                clearTimeout(showTimeout);
                clearTimeout(hideTimeout);
                button.classList.remove('show-hover-card');
            }
            
            // Hide hover card immediately when button is clicked
            button.addEventListener('click', hideCardImmediately);
            
            button.addEventListener('mouseenter', () => {
                const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                // Show hover cards for V1 always, or V3 when panel is collapsed
                if (currentNavVersion === 'Click to expand' || 
                    (currentNavVersion === 'Click to navigate' && !isPanelVisible)) {
                    cancelHide();
                    showCard();
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate') {
                    clearTimeout(showTimeout);
                    scheduleHide();
                }
            });
            
            hoverCard.addEventListener('mouseenter', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate') {
                    cancelHide();
                }
            });
            hoverCard.addEventListener('mouseleave', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate') {
                    clearTimeout(showTimeout);
                    button.classList.remove('show-hover-card');
                }
            });
            
            // Click handlers for hover card items
            const hoverCardItems = hoverCard.querySelectorAll('.hover-card-item');
            hoverCardItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Get the page name from the item
                    const pageName = this.querySelector('span')?.textContent || '';
                    
                    // Update page content
                    if (pageName) {
                        updatePageContent(pageName);
                    }
                    
                    // Clear all hover card item active states and set this one
                    hoverCardItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Hide the hover card
                    button.classList.remove('show-hover-card');
                    clearTimeout(showTimeout);
                    clearTimeout(hideTimeout);
                    
                    // Set the nav button as active
                    clearAllActiveStates();
                    button.classList.add('active');
                    
                    const categoryName = button.getAttribute('aria-label') || 'Menu';
                    const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                    
                    // For V3, open panel if collapsed
                    if (currentNavVersion === 'Click to navigate' && !isPanelVisible) {
                        showSubmenuPanel(categoryName, button);
                    } else if (isPanelVisible) {
                        showSubmenuPanel(categoryName, button);
                    }
                    
                    // After panel is shown, find and select the correct submenu item
                    if (pageName && submenuItemsContainer) {
                        // Clear all active states in submenu
                        submenuItemsContainer.querySelectorAll('.submenu-item').forEach(i => i.classList.remove('active'));
                        submenuItemsContainer.querySelectorAll('.submenu-nested-item').forEach(i => i.classList.remove('active'));
                        
                        // Find and activate the matching item
                        submenuItemsContainer.querySelectorAll('.submenu-item').forEach(submenuItem => {
                            const itemText = submenuItem.querySelector('.submenu-item-text')?.textContent;
                            if (itemText === pageName) {
                                submenuItem.classList.add('active');
                            }
                        });
                        
                        // Also check nested items
                        submenuItemsContainer.querySelectorAll('.submenu-nested-item').forEach(nestedItem => {
                            const nestedText = nestedItem.querySelector('.submenu-nested-item-text')?.textContent;
                            if (nestedText === pageName) {
                                nestedItem.classList.add('active');
                                // Also expand the parent
                                const parentItem = nestedItem.closest('.submenu-item');
                                if (parentItem) {
                                    parentItem.classList.add('expanded');
                                    const chevron = parentItem.querySelector('.submenu-item-chevron');
                                    if (chevron) {
                                        chevron.classList.remove('fa-chevron-right');
                                        chevron.classList.add('fa-chevron-down');
                                    }
                                }
                            }
                        });
                    }
                });
            });
        }
    });

    // Hover card functionality for create button
    const createBtn = document.querySelector('.create-btn');
    if (createBtn) {
        const hoverCard = createBtn.querySelector('.hover-card');
        if (hoverCard) {
            let showTimeout, hideTimeout;
            
            function showCard() {
                clearTimeout(hideTimeout);
                clearTimeout(showTimeout);
                showTimeout = setTimeout(() => {
                    createBtn.classList.add('show-hover-card');
                }, 500);
            }
            
            function scheduleHide() {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    createBtn.classList.remove('show-hover-card');
                }, 100);
            }
            
            function cancelHide() {
                clearTimeout(hideTimeout);
            }
            
            createBtn.addEventListener('mouseenter', () => {
                cancelHide();
                showCard();
            });
            
            createBtn.addEventListener('mouseleave', () => {
                clearTimeout(showTimeout);
                scheduleHide();
            });
            
            hoverCard.addEventListener('mouseenter', cancelHide);
            hoverCard.addEventListener('mouseleave', () => {
                clearTimeout(showTimeout);
                createBtn.classList.remove('show-hover-card');
            });
        }
    }

    // Initialize: Show panel with active category on load
    const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
    if (activeButton) {
        const categoryName = activeButton.getAttribute('aria-label') || 'Menu';
        showSubmenuPanel(categoryName, activeButton);
    }
    
    // Initialize page content
    updatePageContent(currentPageName);

    // Version switching function
    function switchNavVersion(version) {
        currentNavVersion = version;
        const appContainer = document.querySelector('.app-container');
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        const hoverCards = document.querySelectorAll('.hover-card:not(.create-hover-card)');
        
        // Remove all version classes first
        if (appContainer) {
            appContainer.classList.remove('nav-version-1', 'nav-version-2', 'nav-version-3');
        }
        
        // Close submenu panel when switching versions
        hideSubmenuPanel();
        
        if (version === 'Click to expand') {
            // Click to expand: Hamburger menu, click to expand, hover cards enabled
            if (appContainer) {
                appContainer.classList.add('nav-version-1');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = '';
            }
            hoverCards.forEach(card => {
                card.style.display = '';
            });
        } else if (version === 'Hover to expand') {
            // Hover to expand: No hamburger, expand on hover, no hover cards
            if (appContainer) {
                appContainer.classList.add('nav-version-2');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = 'none';
            }
            hoverCards.forEach(card => {
                card.style.display = 'none';
            });
        } else if (version === 'Click to navigate') {
            // Click to navigate: Hamburger menu, click navigates AND opens panel, hover cards enabled
            if (appContainer) {
                appContainer.classList.add('nav-version-3');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = '';
            }
            hoverCards.forEach(card => {
                card.style.display = '';
            });
        }
    }
    
    // Sidebar hover handlers for Hover to expand
    if (sidebar) {
        sidebar.addEventListener('mouseenter', function() {
            if (currentNavVersion === 'Hover to expand') {
                const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
                if (activeButton) {
                    const categoryName = activeButton.getAttribute('aria-label') || 'Menu';
                    showSubmenuPanel(categoryName, activeButton);
                } else {
                    const firstButton = sidebar.querySelector('.nav-icon-btn.expandable');
                    if (firstButton) {
                        const categoryName = firstButton.getAttribute('aria-label') || 'Menu';
                        showSubmenuPanelWithoutNavigation(categoryName, firstButton);
                    }
                }
            }
        });
        
        sidebar.addEventListener('mouseleave', function(e) {
            if (currentNavVersion === 'Hover to expand') {
                // Check if we're moving to the submenu panel
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && (relatedTarget.closest('.submenu-panel') || relatedTarget.closest('.sidebar'))) {
                    return;
                }
                hideSubmenuPanel();
            }
        });
    }
    
    // Submenu panel hover handlers for Hover to expand
    if (submenuPanel) {
        submenuPanel.addEventListener('mouseleave', function(e) {
            if (currentNavVersion === 'Hover to expand') {
                // Check if we're moving to the sidebar
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && (relatedTarget.closest('.sidebar') || relatedTarget.closest('.submenu-panel'))) {
                    return;
                }
                hideSubmenuPanel();
            }
        });
    }

    // Version Select Dropdown functionality
    const versionSelect = document.getElementById('version-select');
    const versionDropdown = document.getElementById('version-dropdown');
    
    if (versionSelect && versionDropdown) {
        // Toggle dropdown on click
        versionSelect.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close any other open dropdowns first
            document.querySelectorAll('.version-select.active').forEach(select => {
                if (select !== this) {
                    select.classList.remove('active');
                    select.nextElementSibling?.classList.remove('visible');
                }
            });
            
            this.classList.toggle('active');
            versionDropdown.classList.toggle('visible');
        });
        
        // Handle option selection
        versionDropdown.querySelectorAll('.version-select-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Update selected text
                const value = this.getAttribute('data-value');
                versionSelect.querySelector('.version-select-text').textContent = value;
                
                // Update active state
                versionDropdown.querySelectorAll('.version-select-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                
                // Switch nav version
                switchNavVersion(value);
                
                // Close dropdown
                versionSelect.classList.remove('active');
                versionDropdown.classList.remove('visible');
            });
        });
        
        // Hover state handling for options
        versionDropdown.querySelectorAll('.version-select-option').forEach(option => {
            option.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            option.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!versionSelect.contains(e.target) && !versionDropdown.contains(e.target)) {
                versionSelect.classList.remove('active');
                versionDropdown.classList.remove('visible');
            }
        });
        
        // Close dropdown on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                versionSelect.classList.remove('active');
                versionDropdown.classList.remove('visible');
            }
        });
    }
    
    // Create Button Position Toggle
    const positionToggle = document.getElementById('create-position-toggle');
    if (positionToggle) {
        const toggleOptions = positionToggle.querySelectorAll('.toggle-option');
        const appContainer = document.querySelector('.app-container');
        const createBtn = document.querySelector('.create-btn');
        const sidebarBottom = document.querySelector('.sidebar-bottom');
        const sidebarTop = document.querySelector('.sidebar-top');
        const hamburgerNav = sidebarTop ? sidebarTop.querySelector('.sidebar-nav:first-child') : null;
        
        // Store original parent for returning button to bottom
        const originalParent = createBtn ? createBtn.parentElement : null;
        
        positionToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const clickedOption = e.target.closest('.toggle-option');
            if (!clickedOption) return;
            
            const position = clickedOption.getAttribute('data-position');
            
            // Update active state
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            clickedOption.classList.add('active');
            
            // Update app container class and move button
            if (appContainer && createBtn) {
                if (position === 'top') {
                    appContainer.classList.add('create-top');
                    // Move create button into hamburger nav (or create a group)
                    if (hamburgerNav) {
                        hamburgerNav.appendChild(createBtn);
                    }
                } else {
                    appContainer.classList.remove('create-top');
                    // Move create button back to sidebar-bottom
                    if (sidebarBottom) {
                        sidebarBottom.appendChild(createBtn);
                    }
                }
            }
        });
    }
    
    // Initialize with Click to expand
    switchNavVersion('Click to expand');
});
