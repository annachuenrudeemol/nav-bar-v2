document.addEventListener('DOMContentLoaded', function() {
    // Track current active page
    let currentPageName = 'Overview';
    
    // Track current nav version
    let currentNavVersion = 'Click to expand';
    
    // V5: true when panel was opened via expand button (don't "return to active" on mouseleave)
    let v5PanelOpenedByExpand = false;
    
    // V5/V6: true when user manually closed the panel (prevent hover from reopening)
    let panelManuallyClosed = false;
    
    // V4/V5: true when mouse is over submenu panel (keep hovered group when moving to panel)
    let mouseInSubmenuPanel = false;
    
    // Function to update page content based on active page
    function updatePageContent(pageName) {
        currentPageName = pageName;
        const pageTitleMain = document.getElementById('page-title-main');
        const illustrationTitle = document.getElementById('illustration-title');
        
        // Update page header
        if (pageTitleMain) {
            pageTitleMain.textContent = pageName;
        }
        
        // Update illustration text
        if (illustrationTitle) {
            illustrationTitle.textContent = pageName;
        }
    }

    // Right Panel functionality
    const sidebar = document.querySelector('.sidebar');
    const submenuPanel = document.getElementById('submenu-panel');
    const submenuItemsContainer = document.getElementById('submenu-items');
    const submenuSectionHeader = document.getElementById('submenu-section-header');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    
    // Enterprise Reporting Panel - renders the Figma-accurate panel (node 723:6772)
    function renderEnterpriseReportingPanel(panel, itemsContainer, shouldNavigate = true) {
        if (!panel) return;
        
        panel.classList.add('enterprise-reporting');
        
        // Build the Enterprise panel HTML
        const panelContent = panel.querySelector('.submenu-panel-content');
        if (!panelContent) return;
        
        // Create enterprise panel wrapper matching Figma exactly
        const enterprisePanel = document.createElement('div');
        enterprisePanel.className = 'enterprise-panel';
        enterprisePanel.innerHTML = `
            <div class="enterprise-panel-header">
                <span class="enterprise-panel-title">Reporting</span>
                <button class="submenu-panel-close-btn enterprise-panel-close-btn" aria-label="Close panel" type="button">
                    <i class="fas fa-angles-left"></i>
                </button>
            </div>
            
            <div class="enterprise-main-content">
                <div class="enterprise-views-section">
                    <div class="enterprise-publishers-wrapper">
                        <div class="enterprise-publishers-scroll">
                            <div class="enterprise-publishers-list">
                                <div class="enterprise-publisher" data-publisher="all">
                                    <div class="enterprise-publisher-row">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">All publishers</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="all-overview">
                                                <span class="enterprise-list-item-text">Overview</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item" data-view="all-performance">
                                                <span class="enterprise-list-item-text">Performance summary</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="all-report-1">
                                                <span class="enterprise-list-item-text">Cross-publisher report</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="all-report-2">
                                                <span class="enterprise-list-item-text">Monthly summary</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="enterprise-publisher${shouldNavigate ? ' expanded' : ''}" data-publisher="google">
                                    <div class="enterprise-publisher-row${shouldNavigate ? ' selected' : ''}">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">Google</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="all-campaigns">
                                                <span class="enterprise-list-item-text">All campaigns</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item${shouldNavigate ? ' active' : ''}" data-view="favorite-view-2">
                                                <span class="enterprise-list-item-text">Favorite view 2</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn pinned" aria-label="Unpin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="report-1">
                                                <span class="enterprise-list-item-text">Report name</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="report-2">
                                                <span class="enterprise-list-item-text">Report name</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="report-3">
                                                <span class="enterprise-list-item-text">Report name</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="enterprise-publisher" data-publisher="bing">
                                    <div class="enterprise-publisher-row">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">Bing</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="bing-campaigns">
                                                <span class="enterprise-list-item-text">All campaigns</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item" data-view="bing-ads">
                                                <span class="enterprise-list-item-text">Ads performance</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="bing-report-1">
                                                <span class="enterprise-list-item-text">Bing monthly report</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="bing-report-2">
                                                <span class="enterprise-list-item-text">Search trends</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="enterprise-publisher" data-publisher="trivago">
                                    <div class="enterprise-publisher-row">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">Trivago</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="trivago-hotels">
                                                <span class="enterprise-list-item-text">Hotel listings</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item" data-view="trivago-bookings">
                                                <span class="enterprise-list-item-text">Booking metrics</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="trivago-report-1">
                                                <span class="enterprise-list-item-text">Trivago insights</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="trivago-report-2">
                                                <span class="enterprise-list-item-text">Rate comparison</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="enterprise-publisher" data-publisher="tripadvisor">
                                    <div class="enterprise-publisher-row">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">Tripadvisor</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="tripadvisor-reviews">
                                                <span class="enterprise-list-item-text">Reviews dashboard</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item" data-view="tripadvisor-listings">
                                                <span class="enterprise-list-item-text">Listings overview</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="tripadvisor-report-1">
                                                <span class="enterprise-list-item-text">Traveler insights</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="tripadvisor-report-2">
                                                <span class="enterprise-list-item-text">Seasonal trends</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="enterprise-publisher" data-publisher="booking">
                                    <div class="enterprise-publisher-row">
                                        <div class="enterprise-publisher-left">
                                            <span class="enterprise-publisher-name">Booking</span>
                                        </div>
                                        <i class="fas fa-chevron-right enterprise-publisher-chevron"></i>
                                    </div>
                                    <div class="enterprise-publisher-content">
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">VIEWS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-view="booking-properties">
                                                <span class="enterprise-list-item-text">Properties</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                            <div class="enterprise-list-item" data-view="booking-revenue">
                                                <span class="enterprise-list-item-text">Revenue tracking</span>
                                                <div class="enterprise-list-item-actions">
                                                    <button class="enterprise-pin-btn" aria-label="Pin"><i class="fas fa-thumbtack"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="enterprise-section-group">
                                            <div class="enterprise-section-divider">
                                                <span class="enterprise-section-divider-text">REPORTS</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="booking-report-1">
                                                <span class="enterprise-list-item-text">Booking analytics</span>
                                            </div>
                                            <div class="enterprise-list-item" data-report="booking-report-2">
                                                <span class="enterprise-list-item-text">Occupancy report</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="enterprise-create-btn" type="button" aria-label="Create">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        
        panelContent.appendChild(enterprisePanel);
        
        // Add event listeners for publishers (expand/collapse)
        enterprisePanel.querySelectorAll('.enterprise-publisher').forEach(pub => {
            const row = pub.querySelector('.enterprise-publisher-row');
            if (row) {
                row.addEventListener('click', function() {
                    // Toggle expanded state
                    const wasExpanded = pub.classList.contains('expanded');
                    
                    // Toggle this publisher (allow multiple to be open)
                    // Don't add 'selected' just for expanding - only when a page inside is active
                    if (wasExpanded) {
                        pub.classList.remove('expanded');
                    } else {
                        pub.classList.add('expanded');
                    }
                });
            }
        });
        
        // Add event listeners for list items (views/reports)
        enterprisePanel.querySelectorAll('.enterprise-list-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remove active from all items
                enterprisePanel.querySelectorAll('.enterprise-list-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Remove selected from all publisher rows, then add to parent publisher
                enterprisePanel.querySelectorAll('.enterprise-publisher-row').forEach(r => r.classList.remove('selected'));
                const parentPublisher = this.closest('.enterprise-publisher');
                if (parentPublisher) {
                    parentPublisher.querySelector('.enterprise-publisher-row')?.classList.add('selected');
                }
                
                const viewName = this.querySelector('.enterprise-list-item-text')?.textContent;
                if (viewName && shouldNavigate) {
                    updatePageContent(viewName);
                }
            });
        });
        
        // Add event listeners for pin buttons
        enterprisePanel.querySelectorAll('.enterprise-pin-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('pinned');
            });
        });
        
        // Add event listener for create button
        const createBtn = enterprisePanel.querySelector('.enterprise-create-btn');
        if (createBtn) {
            createBtn.addEventListener('click', function() {
                if (shouldNavigate) {
                    updatePageContent('New Report');
                }
            });
        }
        
        // Add event listener for close button
        const closeBtn = enterprisePanel.querySelector('.enterprise-panel-close-btn');
        if (closeBtn) {
            // Use capture phase so we run first and no other handler can reopen the panel
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                v5PanelOpenedByExpand = false;
                panelManuallyClosed = true;
                // Hide panel immediately
                if (submenuPanel) {
                    submenuPanel.classList.remove('visible');
                    submenuPanel.classList.remove('enterprise-reporting');
                }
                // Defer DOM cleanup so click isn't retargeted to element under cursor
                setTimeout(function() {
                    if (submenuPanel) {
                        const ep = submenuPanel.querySelector('.enterprise-panel');
                        if (ep) ep.remove();
                    }
                    v5PanelOpenedByExpand = false;
                }, 50);
            }, true);
        }
        
        // Set initial page if navigating
        if (shouldNavigate) {
            updatePageContent('Favorite view 2');
        }
    }
                
    // Function to show right panel with submenu items
    function showSubmenuPanel(categoryName, categoryButton) {
        // Enterprise: never reopen if user closed the panel (only hamburger/nav click can reopen)
        if (currentNavVersion === 'Enterprise' && panelManuallyClosed) {
            return;
        }
        // Reset manually closed flag since panel is being opened (not for Enterprise - cleared in click handlers only)
        if (currentNavVersion !== 'Enterprise') {
            panelManuallyClosed = false;
        }
        
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
        
        // Hide Reporting panel footer when switching to another category
        if (submenuPanel) {
            submenuPanel.classList.remove('has-panel-footer');
            submenuPanel.classList.remove('enterprise-reporting');
            // Remove any existing enterprise panel
            const existingEnterprisePanel = submenuPanel.querySelector('.enterprise-panel');
            if (existingEnterprisePanel) {
                existingEnterprisePanel.remove();
            }
        }
        const submenuPanelFooterEl = document.getElementById('submenu-panel-footer');
        if (submenuPanelFooterEl) {
            submenuPanelFooterEl.setAttribute('aria-hidden', 'true');
        }
        
        // Clear existing submenu items
        if (submenuItemsContainer) {
            submenuItemsContainer.innerHTML = '';
        }
        
        // Enterprise Reporting panel - completely custom layout (V6 + Reporting ONLY)
        if (categoryName === 'Reporting' && currentNavVersion === 'Enterprise') {
            renderEnterpriseReportingPanel(submenuPanel, submenuItemsContainer);
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            return;
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
                        document.querySelectorAll('.hover-card-item').forEach(i => i.classList.remove('active'));
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
                    document.querySelectorAll('.hover-card-item').forEach(i => i.classList.remove('active'));
                    
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
                    document.querySelectorAll('.hover-card-item').forEach(i => i.classList.remove('active'));
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
        // Enterprise: never reopen if user closed the panel (only hamburger/nav click can reopen)
        if (currentNavVersion === 'Enterprise' && panelManuallyClosed) {
            return;
        }
        // Reset manually closed flag since panel is being opened (not for Enterprise - cleared in click handlers only)
        if (currentNavVersion !== 'Enterprise') {
            panelManuallyClosed = false;
        }
        
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
        
        // Hide Reporting panel footer when switching to another category
        if (submenuPanel) {
            submenuPanel.classList.remove('has-panel-footer');
            submenuPanel.classList.remove('enterprise-reporting');
            // Remove any existing enterprise panel
            const existingEnterprisePanel2 = submenuPanel.querySelector('.enterprise-panel');
            if (existingEnterprisePanel2) {
                existingEnterprisePanel2.remove();
            }
        }
        const submenuPanelFooterEl2 = document.getElementById('submenu-panel-footer');
        if (submenuPanelFooterEl2) {
            submenuPanelFooterEl2.setAttribute('aria-hidden', 'true');
        }
        
        // Clear existing submenu items
        if (submenuItemsContainer) {
            submenuItemsContainer.innerHTML = '';
        }
        
        // Enterprise Reporting panel - completely custom layout (V6 + Reporting ONLY)
        if (categoryName === 'Reporting' && currentNavVersion === 'Enterprise') {
            renderEnterpriseReportingPanel(submenuPanel, submenuItemsContainer, false);
            if (submenuPanel) {
                submenuPanel.classList.add('visible');
            }
            return;
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
            const showChevron = hasNested && nestedItems.length > 0;
            
            // Preserve active state: mark item active if it matches current page
            const isItemActive = !showChevron && itemText === currentPageName;
            const submenuItem = document.createElement('div');
            submenuItem.className = `submenu-item ${showChevron ? 'has-nested' : ''} ${isItemActive ? 'active' : ''}`;
            
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
                    const isNestedActive = nestedText === currentPageName;
                    
                    const nestedItemEl = document.createElement('div');
                    nestedItemEl.className = `submenu-nested-item ${isNestedActive ? 'active' : ''}`;
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
                        document.querySelectorAll('.hover-card-item').forEach(i => i.classList.remove('active'));
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
                
                // If current page is in this group, keep parent expanded and active
                const activeNestedText = Array.from(nestedItems).map(n => n.getAttribute('data-nested-item')).find(t => t === currentPageName);
                if (activeNestedText) {
                    submenuItem.classList.add('active', 'expanded');
                    const chevron = submenuItem.querySelector('.submenu-item-chevron');
                    if (chevron) {
                        chevron.classList.remove('fa-chevron-right');
                        chevron.classList.add('fa-chevron-down');
                    }
                }
                
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
                    document.querySelectorAll('.hover-card-item').forEach(i => i.classList.remove('active'));
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
            submenuPanel.classList.remove('enterprise-reporting');
            // Clean up enterprise panel if present
            const enterprisePanel = submenuPanel.querySelector('.enterprise-panel');
            if (enterprisePanel) {
                enterprisePanel.remove();
            }
        }
        v5PanelOpenedByExpand = false;
    }
    
    // Hamburger toggle - shows/hides right panel
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            
            if (isPanelVisible) {
                hideSubmenuPanel();
            } else {
                // Enterprise: clear manually-closed flag so panel can open
                if (currentNavVersion === 'Enterprise') {
                    panelManuallyClosed = false;
                }
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
    
    // Panel close button (double chevron) - collapses the panel
    const submenuPanelCloseBtn = document.getElementById('submenu-panel-close-btn');
    if (submenuPanelCloseBtn) {
        submenuPanelCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (currentNavVersion === 'Enterprise') {
                panelManuallyClosed = true;
            }
            hideSubmenuPanel();
        });
    }
    const submenuPanelCreateBtn = document.querySelector('.submenu-panel-create-btn');
    if (submenuPanelCreateBtn) {
        submenuPanelCreateBtn.addEventListener('click', function() {
            updatePageContent('New report');
        });
    }
    
    // Click outside to close panel (for Click to expand, Click to navigate, Hover to preview, and Final version versions)
    document.addEventListener('click', function(e) {
        if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate' || currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
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
        // Also clear all hover card item active states
        document.querySelectorAll('.hover-card-item').forEach(item => {
            item.classList.remove('active');
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
            
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            const categoryName = this.getAttribute('aria-label') || 'Menu';
            const firstPageName = getFirstPageInCategory(this);
            
            // Hover to expand: Always switch pages on click
            if (currentNavVersion === 'Hover to expand') {
                this.classList.remove('show-hover-card');
                clearAllActiveStates();
                this.classList.add('active');
                updatePageContent(firstPageName);
                // Update the submenu panel to show this category
                if (isPanelVisible) {
                    showSubmenuPanel(categoryName, this);
                }
                return;
            }
            
            // Click to navigate (V3)
            if (currentNavVersion === 'Click to navigate') {
                this.classList.remove('show-hover-card');
                
                if (!isPanelVisible) {
                    // Panel is collapsed - navigate to first page AND open panel
                    clearAllActiveStates();
                    this.classList.add('active');
                    updatePageContent(firstPageName);
                    showSubmenuPanel(categoryName, this);
                } else {
                    // Panel is expanded - just switch submenu panel, don't navigate
                    showSubmenuPanelWithoutNavigation(categoryName, this);
                }
                return;
            }
            
            // Final version / Enterprise (V5/V6) - clicking nav icon opens panel
            if (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') {
                this.classList.remove('show-hover-card');
                panelManuallyClosed = false; // Reset when user clicks to open
                
                if (currentNavVersion === 'Enterprise' && !isPanelVisible) {
                    // Enterprise collapsed: open panel to this group only, don't navigate
                    v5PanelOpenedByExpand = true;
                    showSubmenuPanelWithoutNavigation(categoryName, this);
                } else {
                    // Final version, or Enterprise when panel already expanded: navigate and show panel
                    clearAllActiveStates();
                    this.classList.add('active');
                    updatePageContent(firstPageName);
                    if (!isPanelVisible) {
                        v5PanelOpenedByExpand = true;
                    }
                    showSubmenuPanel(categoryName, this);
                }
                return;
            }
            
            // Click to expand behavior (V1)
            clearAllActiveStates();
            this.classList.add('active');
            
            if (!isPanelVisible) {
                // Panel is collapsed - navigate to first page, keep hover card open
                updatePageContent(firstPageName);
                
                // Select the first page in the hover card
                const hoverCard = this.querySelector('.hover-card:not(.create-hover-card)');
                if (hoverCard) {
                    const hoverCardItems = hoverCard.querySelectorAll('.hover-card-item');
                    hoverCardItems.forEach(item => item.classList.remove('active'));
                    // Find and select the first item (matching first page)
                    hoverCardItems.forEach(item => {
                        const itemText = item.querySelector('span')?.textContent;
                        if (itemText === firstPageName) {
                            item.classList.add('active');
                        }
                    });
                }
                // Don't hide hover card - let mouseleave handle it
            } else {
                // Panel is open - hide hover card and update panel content
                this.classList.remove('show-hover-card');
                showSubmenuPanel(categoryName, this);
            }
        });
        
        // Tooltip functionality for Hover to expand version
        let tooltipTimeout;
        let v4HoverTimeout;
        
        button.addEventListener('mouseenter', () => {
            const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
            // Show tooltip for V2 always, or V3 when panel is expanded
            if (currentNavVersion === 'Hover to expand' || 
                (currentNavVersion === 'Click to navigate' && isPanelVisible)) {
                // Show tooltip with delay
                tooltipTimeout = setTimeout(() => {
                    button.classList.add('show-tooltip');
                }, 250);
            }
            
            // V4 & V5 & Enterprise: Preview submenu panel on hover when expanded
            if ((currentNavVersion === 'Hover to preview' || currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') && isPanelVisible && !panelManuallyClosed) {
                // V5/Enterprise: Now in "hover preview" mode, so mouseleave should return to active
                if (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') {
                    v5PanelOpenedByExpand = false;
                }
                // Clear any pending hover timeout
                clearTimeout(v4HoverTimeout);
                
                // Add small delay before changing panel to avoid accidental switches
                v4HoverTimeout = setTimeout(() => {
                    const categoryName = button.getAttribute('aria-label') || 'Menu';
                    // Instant swap - no fading animation
                    showSubmenuPanelWithoutNavigation(categoryName, button);
                }, 80); // Small hover delay before panel changes
            }
        });
        
        button.addEventListener('mouseleave', () => {
            if (currentNavVersion === 'Hover to expand' || currentNavVersion === 'Click to navigate') {
                clearTimeout(tooltipTimeout);
                button.classList.remove('show-tooltip');
            }
            
            // Clear V4/V5 hover timeout if mouse leaves before delay completes
            clearTimeout(v4HoverTimeout);
            
            // V4 & V5: Return to active category when mouse leaves
            if (currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
                const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                // V5: Don't restore if panel was opened via expand button or manually closed
                if ((currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') && (v5PanelOpenedByExpand || panelManuallyClosed)) {
                    return;
                }
                if (isPanelVisible) {
                    // Find the active button
                    const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
                    if (activeButton && activeButton !== button) {
                        // Longer delay to allow moving between icons without flash-back
                        setTimeout(() => {
                            // Check if we're now hovering over a different nav button or the panel
                            const hoveredButton = sidebar.querySelector('.nav-icon-btn.expandable:hover');
                            if (!hoveredButton && !mouseInSubmenuPanel) {
                                // Not hovering any button or panel, return to active with fade
                                const categoryName = activeButton.getAttribute('aria-label') || 'Menu';
                                
                                // For Enterprise Reporting, only skip if already showing Reporting panel
                                if (currentNavVersion === 'Enterprise' && categoryName === 'Reporting' && submenuPanel.classList.contains('enterprise-reporting')) {
                                    return;
                                }
                                
                                // Add fading class for smooth return
                                if (submenuItemsContainer) {
                                    submenuItemsContainer.classList.add('fading');
                                }
                                if (submenuSectionHeader) {
                                    submenuSectionHeader.classList.add('fading');
                                }
                                
                                setTimeout(() => {
                                    if ((currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
                                        showSubmenuPanelWithoutNavigation(categoryName, activeButton);
                                    } else {
                                        showSubmenuPanel(categoryName, activeButton);
                                    }
                                    
                                    // Fade in the returned content
                                    requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                            if (submenuItemsContainer) {
                                                submenuItemsContainer.classList.remove('fading');
                                            }
                                            if (submenuSectionHeader) {
                                                submenuSectionHeader.classList.remove('fading');
                                            }
                                        });
                                    });
                                }, 200);
                            }
                        }, 150);
                    }
                }
            }
        });
        
        // Hide tooltip on click
        button.addEventListener('click', () => {
            clearTimeout(tooltipTimeout);
            button.classList.remove('show-tooltip');
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
                }, 250);
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
            
            // Hide hover card immediately when button is clicked (except V1/V4/V5 collapsed)
            button.addEventListener('click', () => {
                const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                // For V1/V4/V5 when panel is collapsed, don't hide the card on click
                if ((currentNavVersion === 'Click to expand' || currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) && !isPanelVisible) {
                    return; // Let the main click handler deal with it
                }
                hideCardImmediately();
            });
            
            button.addEventListener('mouseenter', () => {
                const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                // Show hover cards for V1 always; V3/V4/V5 only when panel is collapsed
                if (currentNavVersion === 'Click to expand' ||
                    ((currentNavVersion === 'Hover to preview' || currentNavVersion === 'Click to navigate' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) && !isPanelVisible)) {
                    cancelHide();
                    showCard();
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate' || currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
                    clearTimeout(showTimeout);
                    scheduleHide();
                }
            });
            
            hoverCard.addEventListener('mouseenter', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate' || currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
                    cancelHide();
                }
            });
            hoverCard.addEventListener('mouseleave', () => {
                if (currentNavVersion === 'Click to expand' || currentNavVersion === 'Click to navigate' || currentNavVersion === 'Hover to preview' || (currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
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
                    
                    // Clear ALL active states first (icons and ALL hover card items)
                    clearAllActiveStates();
                    
                    // Set this hover card item and button as active
                    this.classList.add('active');
                    button.classList.add('active');
                    
                    // Hide the hover card
                    button.classList.remove('show-hover-card');
                    clearTimeout(showTimeout);
                    clearTimeout(hideTimeout);
                    
                    const categoryName = button.getAttribute('aria-label') || 'Menu';
                    const isPanelVisible = submenuPanel && submenuPanel.classList.contains('visible');
                    
                    // For V3, open panel if collapsed. Enterprise: only navigate, do not expand panel
                    if (currentNavVersion === 'Click to navigate' && !isPanelVisible) {
                        showSubmenuPanel(categoryName, button);
                    } else if (currentNavVersion !== 'Enterprise' && isPanelVisible) {
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
                }, 300);
            }
            
            function scheduleHide() {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    createBtn.classList.remove('show-hover-card');
                }, 200);
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
        const previousVersion = currentNavVersion;
        currentNavVersion = version;
        const appContainer = document.querySelector('.app-container');
        const menuToggleBtn = document.getElementById('menu-toggle-btn');
        const hoverCards = document.querySelectorAll('.hover-card:not(.create-hover-card)');
        
        // Remove all version classes first
        if (appContainer) {
            appContainer.classList.remove('nav-version-1', 'nav-version-2', 'nav-version-3', 'nav-version-4', 'nav-version-5', 'nav-version-6');
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
        } else if (version === 'Hover to preview') {
            // Hover to preview (V4): Like V1, but hovering icons in expanded state previews submenu
            if (appContainer) {
                appContainer.classList.add('nav-version-4');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = '';
            }
            hoverCards.forEach(card => {
                card.style.display = '';
            });
        } else if (version === 'Final version') {
            // Final version (V5): Create at top, main nav, then Tools & Settings (Figma order)
            if (appContainer) {
                appContainer.classList.add('nav-version-5');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = '';
            }
            hoverCards.forEach(card => {
                card.style.display = '';
            });
            // Move Create button to top of sidebar for V5
            const createBtn = document.querySelector('.create-btn');
            const sidebarTop = document.querySelector('.sidebar-top');
            if (createBtn && sidebarTop) {
                sidebarTop.insertBefore(createBtn, sidebarTop.firstChild);
            }
        } else if (version === 'Enterprise') {
            // Enterprise (V6): hide create button, show hamburger; Reporting panel uses Enterprise design
            if (appContainer) {
                appContainer.classList.add('nav-version-5', 'nav-version-6');
            }
            if (menuToggleBtn) {
                menuToggleBtn.style.display = '';
            }
            hoverCards.forEach(card => {
                card.style.display = '';
            });
            // Hide the create button for Enterprise
            const createBtn = document.querySelector('.create-btn');
            if (createBtn) {
                createBtn.style.display = 'none';
            }
        } else if (previousVersion === 'Final version' || previousVersion === 'Enterprise') {
            // When switching away from V5 or Enterprise, move Create button back to bottom and show it
            const createBtn = document.querySelector('.create-btn');
            const sidebarBottom = document.querySelector('.sidebar-bottom');
            if (createBtn && sidebarBottom) {
                createBtn.style.display = '';
                sidebarBottom.appendChild(createBtn);
            }
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
        submenuPanel.addEventListener('mouseenter', function() {
            mouseInSubmenuPanel = true;
        });
        submenuPanel.addEventListener('mouseleave', function(e) {
            mouseInSubmenuPanel = false;
            
            // Check if we're moving to the sidebar
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && (relatedTarget.closest('.sidebar') || relatedTarget.closest('.submenu-panel'))) {
                return;
            }
            
            if (currentNavVersion === 'Hover to expand') {
                hideSubmenuPanel();
            }
            
            // V4/V5/Enterprise: Return to active category with fade when leaving panel
            if (currentNavVersion === 'Hover to preview' || currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') {
                // Don't return if panel was opened via expand button or manually closed
                if ((currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise') && (v5PanelOpenedByExpand || panelManuallyClosed)) {
                    return;
                }
                
                const activeButton = sidebar.querySelector('.nav-icon-btn.expandable.active');
                if (activeButton) {
                    const categoryName = activeButton.getAttribute('aria-label') || 'Menu';
                    
                    // For Enterprise Reporting, only skip if already showing Reporting panel
                    if (currentNavVersion === 'Enterprise' && categoryName === 'Reporting' && submenuPanel.classList.contains('enterprise-reporting')) {
                        return;
                    }
                    
                    // Add fading class for smooth return
                    if (submenuItemsContainer) {
                        submenuItemsContainer.classList.add('fading');
                    }
                    if (submenuSectionHeader) {
                        submenuSectionHeader.classList.add('fading');
                    }
                    
                    setTimeout(() => {
                        if ((currentNavVersion === 'Final version' || currentNavVersion === 'Enterprise')) {
                            showSubmenuPanelWithoutNavigation(categoryName, activeButton);
                        } else {
                            showSubmenuPanel(categoryName, activeButton);
                        }
                        
                        // Fade in the returned content
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                if (submenuItemsContainer) {
                                    submenuItemsContainer.classList.remove('fading');
                                }
                                if (submenuSectionHeader) {
                                    submenuSectionHeader.classList.remove('fading');
                                }
                            });
                        });
                    }, 200);
                }
            }
        });
    }
    
    // V5: Expand button click handlers
    document.querySelectorAll('.hover-card-expand-btn').forEach(expandBtn => {
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Only work in V5
            if (currentNavVersion !== 'Final version' && currentNavVersion !== 'Enterprise') return;
            
            // Find the parent nav button
            const navButton = this.closest('.nav-icon-btn.expandable');
            if (!navButton) return;
            
            const categoryName = navButton.getAttribute('aria-label') || 'Menu';
            
            // Hide the hover card
            navButton.classList.remove('show-hover-card');
            
            // Mark that panel was opened by expand (so we don't "return to active" when mouseleave fires)
            v5PanelOpenedByExpand = true;
            
            // Show the submenu panel with this category (don't navigate or change active state)
            showSubmenuPanelWithoutNavigation(categoryName, navButton);
        });
    });

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
        // First .sidebar-nav (search nav in current HTML) – create at top goes here as first icon
        const firstNav = sidebarTop ? sidebarTop.querySelector('.sidebar-nav') : null;
        
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
                    // Move create button to top of sidebar: insert as first item in first nav
                    if (firstNav) {
                        firstNav.insertBefore(createBtn, firstNav.firstChild);
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
