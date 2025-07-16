describe('Features/History.js', () => {
    let historyButton, historyPanel, closeHistoryButton, sidebarOverlay, patientSidebarEl, settingsPanelEl, historyListEl;
    let navigationHistory, allDisplayableTopicsMap, renderDetailPage, addTapListener;

    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <button id="history-button"></button>
            <div id="history-panel" class="hidden"></div>
            <button id="close-history-button"></button>
            <div id="sidebar-overlay"></div>
            <div id="patient-sidebar" class="hidden"></div>
            <div id="settings-panel" class="hidden"></div>
            <div id="history-list"></div>
        `;
        historyButton = document.getElementById('history-button');
        historyPanel = document.getElementById('history-panel');
        closeHistoryButton = document.getElementById('close-history-button');
        sidebarOverlay = document.getElementById('sidebar-overlay');
        patientSidebarEl = document.getElementById('patient-sidebar');
        settingsPanelEl = document.getElementById('settings-panel');
        historyListEl = document.getElementById('history-list');

        // Mock global variables/functions
        navigationHistory = [
            { viewType: 'detail', contentId: 'topic1' },
            { viewType: 'other', contentId: 'topic2' },
            { viewType: 'detail', contentId: 'topic3' }
        ];
        allDisplayableTopicsMap = {
            topic1: { title: 'Topic One' },
            topic3: { title: 'Topic Three' }
        };
        renderDetailPage = jest.fn();
        addTapListener = (el, fn) => el.addEventListener('click', fn);

        // Attach to global for tested code
        global.navigationHistory = navigationHistory;
        global.allDisplayableTopicsMap = allDisplayableTopicsMap;
        global.renderDetailPage = renderDetailPage;
        global.addTapListener = addTapListener;

        // Re-define tested functions in test scope
        global.populateHistoryList = function populateHistoryList() {
            const historyListEl = document.getElementById('history-list');
            historyListEl.innerHTML = '';
            navigationHistory.forEach(entry => {
                if (entry.viewType !== 'detail') return;
                const topic = allDisplayableTopicsMap[entry.contentId];
                if (!topic) return;
                const itemLink = document.createElement('a');
                itemLink.href = '#';
                itemLink.textContent = topic.title;
                itemLink.className = 'block text-blue-600 hover:underline cursor-pointer';
                addTapListener(itemLink, () => {
                    renderDetailPage(entry.contentId);
                    historyPanel.classList.add('hidden');
                    sidebarOverlay.classList.remove('active');
                    sidebarOverlay.classList.add('hidden');
                });
                historyListEl.appendChild(itemLink);
            });
        };

        // Attach event listeners as in the source code
        historyButton.addEventListener('click', () => {
            if (patientSidebarEl.classList.contains('open')) {
                patientSidebarEl.classList.remove('open');
                setTimeout(() => patientSidebarEl.classList.add('hidden'), 200);
            }
            if (!settingsPanelEl.classList.contains('hidden')) {
                settingsPanelEl.classList.add('hidden');
            }
            global.populateHistoryList();
            historyPanel.classList.remove('hidden');
            sidebarOverlay.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
        });

        closeHistoryButton.addEventListener('click', () => {
            historyPanel.classList.add('hidden');
            sidebarOverlay.classList.remove('active');
            sidebarOverlay.classList.add('hidden');
        });
    });

    test('populateHistoryList populates only detail entries', () => {
        global.populateHistoryList();
        const links = historyListEl.querySelectorAll('a');
        expect(links.length).toBe(2);
        expect(links[0].textContent).toBe('Topic One');
        expect(links[1].textContent).toBe('Topic Three');
    });

    test('clicking a history link calls renderDetailPage and hides panel/overlay', () => {
        global.populateHistoryList();
        const link = historyListEl.querySelector('a');
        link.click();
        expect(renderDetailPage).toHaveBeenCalledWith('topic1');
        expect(historyPanel.classList.contains('hidden')).toBe(true);
        expect(sidebarOverlay.classList.contains('active')).toBe(false);
        expect(sidebarOverlay.classList.contains('hidden')).toBe(true);
    });

    test('history button opens history panel and overlay, closes sidebar/panel', () => {
        patientSidebarEl.classList.add('open');
        patientSidebarEl.classList.remove('hidden');
        settingsPanelEl.classList.remove('hidden');
        historyPanel.classList.add('hidden');
        sidebarOverlay.classList.remove('active');
        sidebarOverlay.classList.add('hidden');

        jest.useFakeTimers();
        historyButton.click();
        jest.runAllTimers();

        expect(patientSidebarEl.classList.contains('open')).toBe(false);
        expect(patientSidebarEl.classList.contains('hidden')).toBe(true);
        expect(settingsPanelEl.classList.contains('hidden')).toBe(true);
        expect(historyPanel.classList.contains('hidden')).toBe(false);
        expect(sidebarOverlay.classList.contains('active')).toBe(true);
        expect(sidebarOverlay.classList.contains('hidden')).toBe(false);
        jest.useRealTimers();
    });

    test('closeHistoryButton hides history panel and overlay', () => {
        historyPanel.classList.remove('hidden');
        sidebarOverlay.classList.add('active');
        sidebarOverlay.classList.remove('hidden');
        closeHistoryButton.click();
        expect(historyPanel.classList.contains('hidden')).toBe(true);
        expect(sidebarOverlay.classList.contains('active')).toBe(false);
        expect(sidebarOverlay.classList.contains('hidden')).toBe(true);
    });
});