import { AbbreviationGroups } from '../../Data/AbbreviationGroups.js';
import { slugify } from '../../Utils/slugify.js';

export function renderAbbreviationGroupDetail(groupId, contentArea) {
    const groupData = AbbreviationGroups[groupId];
    if (!groupData) {
        const fallback = document.createElement('div');
        fallback.className = 'p-4 bg-red-50 border border-red-200 text-red-700 rounded';
        fallback.textContent = `Abbreviation group "${groupId}" is not defined.`;
        contentArea.appendChild(fallback);
        return;
    }
    const container = document.createElement('section');
    container.className = 'abbrev-container';
    contentArea.appendChild(container);
    const controls = document.createElement('div');
    controls.className = 'abbrev-controls';
    container.appendChild(controls);
    const selectId = `${slugify(groupId)}-mode-select`;
    const modeLabel = document.createElement('label');
    modeLabel.className = 'abbrev-control-label';
    modeLabel.setAttribute('for', selectId);
    modeLabel.textContent = 'Display options:';
    controls.appendChild(modeLabel);
    const modeSelect = document.createElement('select');
    modeSelect.id = selectId;
    modeSelect.className = 'abbrev-mode-select';
    controls.appendChild(modeSelect);
    const modeOptions = [
        { value: 'term', label: 'term : abbrev.' },
        { value: 'abbrev', label: 'abbrev. : term' },
        { value: 'remove', label: 'remove' },
        { value: 'add', label: 'add' },
        { value: 'reorder', label: 're-organize' }
    ];
    modeOptions.forEach(opt => {
        const optionEl = document.createElement('option');
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        modeSelect.appendChild(optionEl);
    });
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'abbrev-reset-button';
    resetButton.textContent = 'RESET';
    controls.appendChild(resetButton);
    const modePanel = document.createElement('div');
    modePanel.className = 'abbrev-mode-panel hidden';
    container.appendChild(modePanel);
    const table = document.createElement('div');
    table.className = 'abbrev-table';
    container.appendChild(table);
    let customIdCounter = 0;
    const defaultItems = groupData.items.map((item, index) => ({
        id: `${groupId}-${index}`,
        term: (item.term ?? '').toString(),
        abbrev: (item.abbrev ?? '').toString(),
        overline: Boolean(item.overline),
        source: 'default'
    }));
    let activeItems = defaultItems.map(item => ({ ...item }));
    let removedItems = [];
    let orderMode = 'term';
    let mode = 'term';
    let isCustomOrder = false;
    function normalizeForSort(value) {
        return (value ?? '').toString().trim().toLowerCase();
    }

    function compareValues(a, b) {
        const av = normalizeForSort(a);
        const bv = normalizeForSort(b);
        if (av < bv) return -1;
        if (av > bv) return 1;
        return 0;
    }

    function getDisplayItems() {
        const items = activeItems.slice();
        if (!isCustomOrder) {
            const key = orderMode === 'abbrev' ? 'abbrev' : 'term';
            items.sort((a, b) => compareValues(a[key], b[key]));
        }
        return items;
    }

    function renderHeaderRow(hasActions) {
        const headerRow = document.createElement('div');
        headerRow.className = 'abbrev-row abbrev-header';
        if (hasActions) headerRow.classList.add('has-actions');
        const firstHeader = document.createElement('div');
        firstHeader.className = 'abbrev-cell abbrev-header-cell';
        firstHeader.textContent = orderMode === 'abbrev' ? 'Abbreviation' : 'Term';
        const secondHeader = document.createElement('div');
        secondHeader.className = 'abbrev-cell abbrev-header-cell';
        secondHeader.textContent = orderMode === 'abbrev' ? 'Term' : 'Abbreviation';
        headerRow.append(firstHeader, secondHeader);
        if (hasActions) {
            const spacer = document.createElement('div');
            spacer.className = 'abbrev-cell abbrev-header-cell action-header';
            spacer.textContent = mode === 'reorder' ? 'Order' : '';
            headerRow.appendChild(spacer);
        }
        return headerRow;
    }

    function renderTable() {
        table.innerHTML = '';
        const displayItems = getDisplayItems();
        const hasActions = mode === 'remove' || mode === 'reorder';
        table.appendChild(renderHeaderRow(hasActions));
        if (!displayItems.length) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'abbrev-empty';
            emptyRow.textContent = 'No abbreviations to display.';
            table.appendChild(emptyRow);
            return;
        }
        displayItems.forEach(item => {
            const row = document.createElement('div');
            row.className = 'abbrev-row';
            if (hasActions) row.classList.add('has-actions');
            const abbrevFirst = orderMode === 'abbrev';
            const firstValue = abbrevFirst ? item.abbrev : item.term;
            const secondValue = abbrevFirst ? item.term : item.abbrev;
            const firstCell = document.createElement('div');
            firstCell.className = 'abbrev-cell';
            firstCell.textContent = firstValue;
            const secondCell = document.createElement('div');
            secondCell.className = 'abbrev-cell';
            secondCell.textContent = secondValue;
            if (item.overline) {
                if (abbrevFirst) {
                    firstCell.classList.add('abbrev-overline');
                } else {
                    secondCell.classList.add('abbrev-overline');
                }
            }
            row.append(firstCell, secondCell);
            if (mode === 'remove') {
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'abbrev-row-action';
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', () => removeItem(item.id));
                row.appendChild(removeBtn);
            } else if (mode === 'reorder') {
                const actions = document.createElement('div');
                actions.className = 'abbrev-row-actions';
                const upBtn = document.createElement('button');
                upBtn.type = 'button';
                upBtn.className = 'abbrev-row-action';
                upBtn.textContent = '↑';
                upBtn.disabled = activeItems[0]?.id === item.id;
                upBtn.addEventListener('click', () => moveItem(item.id, -1));
                const downBtn = document.createElement('button');
                downBtn.type = 'button';
                downBtn.className = 'abbrev-row-action';
                downBtn.textContent = '↓';
                downBtn.disabled = activeItems[activeItems.length - 1]?.id === item.id;
                downBtn.addEventListener('click', () => moveItem(item.id, 1));
                actions.append(upBtn, downBtn);
                row.appendChild(actions);
            }
            table.appendChild(row);
        });
    }

    function removeItem(itemId) {
        const idx = activeItems.findIndex(it => it.id === itemId);
        if (idx === -1) return;
        const [removed] = activeItems.splice(idx, 1);
        removedItems.push(removed);
        removedItems.sort((a, b) => compareValues(a.term || a.abbrev, b.term || b.abbrev));
        updateUI();
    }

    function moveItem(itemId, delta) {
        const idx = activeItems.findIndex(it => it.id === itemId);
        if (idx === -1) return;
        const nextIndex = idx + delta;
        if (nextIndex < 0 || nextIndex >= activeItems.length) return;
        const [item] = activeItems.splice(idx, 1);
        activeItems.splice(nextIndex, 0, item);
        isCustomOrder = true;
        updateUI();
    }

    function addCustomItem(termValue, abbrevValue) {
        const term = termValue.trim();
        const abbrev = abbrevValue.trim();
        if (!term || !abbrev) {
            return { error: 'Both fields are required.' };
        }
        const exists = activeItems.some(it =>
            normalizeForSort(it.term) === normalizeForSort(term) &&
            normalizeForSort(it.abbrev) === normalizeForSort(abbrev)
        );
        if (exists) {
            return { error: 'That term and abbreviation already exist.' };
        }
        const newItem = {
            id: `${groupId}-custom-${customIdCounter++}`,
            term,
            abbrev,
            overline: false,
            source: 'custom'
        };
        activeItems.push(newItem);
        removedItems = removedItems.filter(it =>
            normalizeForSort(it.term) !== normalizeForSort(term) ||
            normalizeForSort(it.abbrev) !== normalizeForSort(abbrev)
        );
        return { error: null };
    }

    function restoreItems(idList) {
        if (!idList.length) return;
        idList.forEach(id => {
            const idx = removedItems.findIndex(item => item.id === id);
            if (idx !== -1) {
                activeItems.push(removedItems[idx]);
                removedItems.splice(idx, 1);
            }
        });
    }

    function resetState() {
        activeItems = defaultItems.map(item => ({ ...item }));
        removedItems = [];
        orderMode = 'term';
        mode = 'term';
        isCustomOrder = false;
        customIdCounter = 0;
    }

    function setMode(nextMode) {
        mode = nextMode;
        if (nextMode === 'term') {
            orderMode = 'term';
        } else if (nextMode === 'abbrev') {
            orderMode = 'abbrev';
        } else if (nextMode === 'reorder') {
            isCustomOrder = true;
        }
        updateUI();
    }

    function updateModePanel() {
        modePanel.innerHTML = '';
        if (mode === 'term' || mode === 'abbrev') {
            modePanel.classList.add('hidden');
            return;
        }
        modePanel.classList.remove('hidden');
        if (mode === 'remove') {
            const note = document.createElement('p');
            note.className = 'abbrev-mode-note';
            note.textContent = 'Select the remove button to temporarily hide abbreviations. Hidden items appear in the add view.';
            modePanel.appendChild(note);
        } else if (mode === 'reorder') {
            const note = document.createElement('p');
            note.className = 'abbrev-mode-note';
            note.textContent = 'Use the arrows to create a custom order. This order stays in place until you reset.';
            modePanel.appendChild(note);
        } else if (mode === 'add') {
            const form = document.createElement('form');
            form.className = 'abbrev-add-form';
            const termField = document.createElement('div');
            termField.className = 'abbrev-input-group';
            const termLabel = document.createElement('label');
            termLabel.textContent = 'term';
            termLabel.setAttribute('for', `${selectId}-term-input`);
            const termInput = document.createElement('input');
            termInput.id = `${selectId}-term-input`;
            termInput.type = 'text';
            termInput.className = 'abbrev-input';
            termField.append(termLabel, termInput);
            const abbrevField = document.createElement('div');
            abbrevField.className = 'abbrev-input-group';
            const abbrevLabel = document.createElement('label');
            abbrevLabel.textContent = 'abbrev.';
            abbrevLabel.setAttribute('for', `${selectId}-abbrev-input`);
            const abbrevInput = document.createElement('input');
            abbrevInput.id = `${selectId}-abbrev-input`;
            abbrevInput.type = 'text';
            abbrevInput.className = 'abbrev-input';
            abbrevField.append(abbrevLabel, abbrevInput);
            const submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.className = 'abbrev-row-action add';
            submitBtn.textContent = 'Add term';
            const feedback = document.createElement('p');
            feedback.className = 'abbrev-mode-feedback hidden';
            form.append(termField, abbrevField, submitBtn, feedback);
            form.addEventListener('submit', e => {
                e.preventDefault();
                const { error } = addCustomItem(termInput.value, abbrevInput.value);
                if (error) {
                    feedback.textContent = error;
                    feedback.classList.remove('hidden');
                } else {
                    termInput.value = '';
                    abbrevInput.value = '';
                    feedback.classList.add('hidden');
                    updateUI();
                }
            });
            modePanel.appendChild(form);
            const removedWrapper = document.createElement('div');
            removedWrapper.className = 'abbrev-removed-wrapper';
            if (removedItems.length) {
                const removedTitle = document.createElement('p');
                removedTitle.className = 'abbrev-mode-note';
                removedTitle.textContent = 'Previously removed abbreviations:';
                removedWrapper.appendChild(removedTitle);
                const list = document.createElement('div');
                list.className = 'abbrev-removed-list';
                removedItems.forEach(item => {
                    const checkboxId = `${item.id}-restore`;
                    const itemLabel = document.createElement('label');
                    itemLabel.className = 'abbrev-removed-item';
                    itemLabel.setAttribute('for', checkboxId);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = checkboxId;
                    checkbox.value = item.id;
                    const text = document.createElement('span');
                    const displayTerm = item.term || item.abbrev || '(blank)';
                    const displayAbbrev = item.abbrev || item.term || '(blank)';
                    text.textContent = `${displayTerm} - ${displayAbbrev}`;
                    itemLabel.append(checkbox, text);
                    list.appendChild(itemLabel);
                });
                const restoreBtn = document.createElement('button');
                restoreBtn.type = 'button';
                restoreBtn.className = 'abbrev-row-action restore';
                restoreBtn.textContent = 'Add selected';
                restoreBtn.addEventListener('click', () => {
                    const selected = Array.from(list.querySelectorAll('input:checked')).map(input => input.value);
                    restoreItems(selected);
                    updateUI();
                });
                removedWrapper.append(list, restoreBtn);
            } else {
                const emptyRemoved = document.createElement('p');
                emptyRemoved.className = 'abbrev-mode-note';
                emptyRemoved.textContent = 'No removed abbreviations to restore.';
                removedWrapper.appendChild(emptyRemoved);
            }
            modePanel.appendChild(removedWrapper);
        }
    }

    function updateUI() {
        renderTable();
        updateModePanel();
    }
    modeSelect.addEventListener('change', () => setMode(modeSelect.value));
    resetButton.addEventListener('click', () => {
        resetState();
        modeSelect.value = 'term';
        updateUI();
    });
    modeSelect.value = 'term';
    updateUI();
}
