import { slugify } from '../../Utils/slugify.js';
import { CricothyrotomyContent } from '../../Data/CricothyrotomyContent.js';

const equipmentMetadata = new Map();

function resolveCricReference(refId) {
    if (!refId || !CricothyrotomyContent?.references) {
        return null;
    }
    return CricothyrotomyContent.references[refId] || null;
}

function renderCitationList(target, citationIds = []) {
    if (!target || !Array.isArray(citationIds) || citationIds.length === 0) {
        return;
    }
    const entries = citationIds
        .map(resolveCricReference)
        .filter(Boolean);
    if (!entries.length) {
        return;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'cric-citations';
    const label = document.createElement('span');
    label.className = 'cric-citations-label';
    label.textContent = entries.length === 1 ? 'Source:' : 'Sources:';
    wrapper.appendChild(label);
    entries.forEach((entry, index) => {
        if (index > 0) {
            const separator = document.createElement('span');
            separator.className = 'cric-citations-separator';
            separator.textContent = '·';
            wrapper.appendChild(separator);
        }
        if (entry.href) {
            const link = document.createElement('a');
            link.href = entry.href;
            link.target = '_blank';
            link.rel = 'noopener';
            link.className = 'cric-citation-link';
            link.textContent = entry.label || entry.href;
            wrapper.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.className = 'cric-citation-text';
            span.textContent = entry.label || '';
            wrapper.appendChild(span);
        }
    });
    target.appendChild(wrapper);
}

function registerCricEquipment(key) {
    if (!key || !CricothyrotomyContent?.equipmentCatalog) {
        return null;
    }
    if (!equipmentMetadata.has(key)) {
        const entry = CricothyrotomyContent.equipmentCatalog[key];
        if (entry) {
            equipmentMetadata.set(key, entry);
        }
    }
    return equipmentMetadata.get(key) || null;
}

function applyEquipmentDataset(el, key, entry) {
    if (!el || !entry) {
        return;
    }
    const photo = entry.image || {};
    if (photo.src) {
        el.dataset.equipmentImage = photo.src;
    }
    if (photo.alt) {
        el.dataset.equipmentAlt = photo.alt;
    }
    if (photo.caption) {
        el.dataset.equipmentCaption = photo.caption;
    }
    const credit = photo.credit || entry.credit || '';
    if (credit) {
        el.dataset.equipmentCredit = credit;
    }
    if (photo.sourceNote) {
        el.dataset.equipmentSourceNote = photo.sourceNote;
    }
    const href = photo.href || entry.href;
    if (href) {
        el.dataset.equipmentSource = href;
    }
    if (photo.hrefLabel || entry.hrefLabel) {
        el.dataset.equipmentSourceLabel = photo.hrefLabel || entry.hrefLabel;
    }
    el.classList.add('equipment-popover-trigger');
    el.dataset.equipmentKey = key;
}

function createEquipmentChip(key) {
    const entry = registerCricEquipment(key);
    if (!entry) {
        return null;
    }
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'cric-equipment-chip';
    chip.textContent = entry.name || key;
    applyEquipmentDataset(chip, key, entry);
    return chip;
}

function buildCricSectionHeading(topic, sectionId, suffix, titleText) {
    const heading = document.createElement('h3');
    heading.className = 'detail-section-title';
    const anchorBase = sectionId ? `${sectionId}-${suffix}` : suffix;
    heading.id = slugify(`${topic.id}-${anchorBase}`);
    heading.textContent = titleText;
    return heading;
}

function renderCricSection(topic, parentVariant, sectionData, contentArea, sectionIndex) {
    const module = document.createElement('div');
    module.className = 'cric-module';
    const sectionId = sectionData.id || `${parentVariant.id || 'section'}-${sectionIndex + 1}`;
    if (sectionData.displayTitle) {
        const moduleTitle = document.createElement('h2');
        moduleTitle.className = 'cric-module-title';
        moduleTitle.textContent = sectionData.displayTitle;
        moduleTitle.id = slugify(`${topic.id}-${sectionId}-title`);
        module.appendChild(moduleTitle);
    }
    const layout = document.createElement('div');
    layout.className = 'cric-layout';
    const mainColumn = document.createElement('div');
    mainColumn.className = 'cric-main';
    const rail = document.createElement('aside');
    rail.className = 'cric-rail';
    layout.append(mainColumn, rail);
    module.appendChild(layout);
    renderCricBanner(sectionData, parentVariant, topic, sectionId, mainColumn);
    renderCricToggleGroups(sectionData, topic, sectionId, mainColumn);
    renderCricWorkflow(sectionData, topic, sectionId, mainColumn);
    renderCricReferences(sectionData, parentVariant, topic, sectionId, mainColumn);
    renderCricMedia(sectionData, topic, sectionId, rail);
    renderCricKit(sectionData, parentVariant, topic, sectionId, rail);
    contentArea.appendChild(module);
}

function renderCricBanner(sectionData, parentVariant, topic, sectionId, container) {
    const bannerData = sectionData.banner || {};
    const section = document.createElement('section');
    section.className = 'cric-section cric-banner';
    const heading = buildCricSectionHeading(topic, sectionId, 'procedure-indication', 'Procedure Indication');
    section.appendChild(heading);
    const ageRange = sectionData.ageRange ?? parentVariant.ageRange;
    if (ageRange) {
        const age = document.createElement('p');
        age.className = 'cric-banner-age';
        age.textContent = ageRange;
        section.appendChild(age);
    }
    if (bannerData.headline) {
        const headline = document.createElement('p');
        headline.className = 'cric-banner-headline';
        headline.textContent = bannerData.headline;
        section.appendChild(headline);
    }
    if (Array.isArray(bannerData.summary) && bannerData.summary.length) {
        const list = document.createElement('ul');
        list.className = 'cric-banner-summary';
        bannerData.summary.forEach(point => {
            const li = document.createElement('li');
            li.textContent = point;
            list.appendChild(li);
        });
        section.appendChild(list);
    }
    if (bannerData.caution) {
        const caution = document.createElement('div');
        caution.className = 'cric-banner-caution';
        const label = document.createElement('span');
        label.className = 'cric-banner-caution-label';
        label.textContent = 'Caution';
        const text = document.createElement('span');
        text.className = 'cric-banner-caution-text';
        text.textContent = bannerData.caution;
        caution.append(label, text);
        section.appendChild(caution);
    }
    renderCitationList(section, bannerData.citations || []);
    container.appendChild(section);
}

function renderCricToggleGroups(sectionData, topic, sectionId, container) {
    const groups = Array.isArray(sectionData.toggles) ? sectionData.toggles : [];
    if (!groups.length) {
        return;
    }
    const section = document.createElement('section');
    section.className = 'cric-section cric-toggle-section';
    const heading = buildCricSectionHeading(topic, sectionId, 'clinical-support', 'Clinical Support Guides');
    section.appendChild(heading);
    groups.forEach((group, groupIndex) => {
        const groupEl = document.createElement('div');
        groupEl.className = `cric-toggle-group cric-toggle-${group.color || 'green'}`;
        const label = document.createElement('div');
        label.className = 'cric-toggle-label';
        label.textContent = group.label;
        groupEl.appendChild(label);
        const buttonsWrap = document.createElement('div');
        buttonsWrap.className = 'cric-toggle-buttons';
        groupEl.appendChild(buttonsWrap);
        const description = document.createElement('div');
        description.className = 'cric-toggle-description';
        groupEl.appendChild(description);
        const options = Array.isArray(group.options) ? group.options : [];
        const selectOption = (index) => {
            const selected = options[index];
            buttonsWrap.querySelectorAll('.cric-toggle-button').forEach((btn, idx) => {
                const isActive = idx === index;
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            description.innerHTML = '';
            if (selected?.description) {
                const text = document.createElement('p');
                text.className = 'cric-toggle-body';
                text.textContent = selected.description;
                description.appendChild(text);
            }
            renderCitationList(description, selected?.citations || []);
        };
        options.forEach((option, optionIndex) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cric-toggle-button';
            btn.dataset.toggleGroup = `${groupIndex}`;
            btn.dataset.toggleOption = `${optionIndex}`;
            btn.textContent = option.label;
            btn.addEventListener('click', () => selectOption(optionIndex));
            buttonsWrap.appendChild(btn);
        });
        if (options.length) {
            selectOption(0);
        }
        renderCitationList(groupEl, group.citations || []);
        section.appendChild(groupEl);
    });
    container.appendChild(section);
}

function renderCricWorkflow(sectionData, topic, sectionId, container) {
    const steps = Array.isArray(sectionData.workflow) ? sectionData.workflow : [];
    if (!steps.length) {
        return;
    }
    const section = document.createElement('section');
    section.className = 'cric-section cric-workflow-section';
    const heading = buildCricSectionHeading(topic, sectionId, 'procedure-workflow', 'Procedure Workflow');
    section.appendChild(heading);
    const list = document.createElement('ol');
    list.className = 'cric-steps';
    steps.forEach((step, index) => {
        const item = document.createElement('li');
        item.className = 'cric-step';
        const header = document.createElement('div');
        header.className = 'cric-step-header';
        const number = document.createElement('span');
        number.className = 'cric-step-number';
        number.textContent = String(step?.step ?? index + 1);
        header.appendChild(number);
        const title = document.createElement('h4');
        title.className = 'cric-step-title';
        title.textContent = step?.title || `Step ${index + 1}`;
        header.appendChild(title);
        item.appendChild(header);
        if (step?.detail) {
            const detail = document.createElement('p');
            detail.className = 'cric-step-detail';
            detail.textContent = step.detail;
            item.appendChild(detail);
        }
        const equipmentKeys = Array.isArray(step?.equipment) ? [...new Set(step.equipment)] : [];
        if (equipmentKeys.length) {
            const equipmentWrap = document.createElement('div');
            equipmentWrap.className = 'cric-step-equipment';
            equipmentKeys.forEach((key) => {
                const chip = createEquipmentChip(key);
                if (chip) {
                    equipmentWrap.appendChild(chip);
                }
            });
            if (equipmentWrap.children.length) {
                item.appendChild(equipmentWrap);
            }
        }
        renderCitationList(item, step?.citations || []);
        list.appendChild(item);
    });
    section.appendChild(list);
    container.appendChild(section);
}

function renderCricMedia(sectionData, topic, sectionId, target) {
    const videoData = sectionData?.media?.video;
    if (!videoData) {
        return;
    }
    const section = document.createElement('section');
    section.className = 'cric-rail-card cric-media-card';
    const heading = buildCricSectionHeading(topic, sectionId, 'training-video', 'Training Video');
    heading.classList.add('cric-rail-title');
    section.appendChild(heading);
    if (videoData.title) {
        const title = document.createElement('p');
        title.className = 'cric-media-title';
        title.textContent = videoData.title;
        section.appendChild(title);
    }
    if (videoData.src) {
        const video = document.createElement('video');
        video.className = 'cric-video-player';
        video.controls = true;
        const preloadSetting = videoData.preload || 'auto';
        video.preload = preloadSetting;
        video.setAttribute('playsinline', 'true');
        const source = document.createElement('source');
        source.src = videoData.src;
        source.type = 'video/webm';
        video.appendChild(source);
        video.appendChild(document.createTextNode('Your browser does not support the video tag.'));
        section.appendChild(video);
        if (preloadSetting === 'auto') {
            requestAnimationFrame(() => video.load());
        }
        const download = document.createElement('a');
        download.href = videoData.src;
        download.className = 'cric-video-download';
        download.textContent = 'Download video';
        download.setAttribute('download', '');
        section.appendChild(download);
    } else if (videoData.placeholder) {
        const placeholder = document.createElement('div');
        placeholder.className = 'cric-video-placeholder';
        placeholder.textContent = videoData.note || 'Need Video Still!!!';
        section.appendChild(placeholder);
    }
    if (videoData.caption) {
        const caption = document.createElement('p');
        caption.className = 'cric-video-caption';
        caption.textContent = videoData.caption;
        section.appendChild(caption);
    }
    renderCitationList(section, videoData.citations || []);
    target.appendChild(section);
}

function renderCricKit(sectionData, parentVariant, topic, sectionId, target) {
    const sectionEquipment = Array.isArray(sectionData.equipment) ? sectionData.equipment : [];
    const fallbackEquipment = Array.isArray(parentVariant?.equipment) ? parentVariant.equipment : [];
    const equipmentKeys = [...new Set(sectionEquipment.length ? sectionEquipment : fallbackEquipment)];
    if (!equipmentKeys.length) {
        return;
    }
    const section = document.createElement('section');
    section.className = 'cric-rail-card cric-kit-card';
    const heading = buildCricSectionHeading(topic, sectionId, 'procedure-kit', 'Procedure Kit');
    heading.classList.add('cric-rail-title');
    section.appendChild(heading);
    const list = document.createElement('div');
    list.className = 'cric-kit-list';
    equipmentKeys.forEach((key) => {
        const chip = createEquipmentChip(key);
        if (chip) {
            list.appendChild(chip);
        }
    });
    if (list.children.length) {
        section.appendChild(list);
        target.appendChild(section);
    }
}

function renderCricReferences(sectionData, parentVariant, topic, sectionId, container) {
    const refIds = Array.isArray(sectionData.references) && sectionData.references.length
        ? [...new Set(sectionData.references)]
        : Array.isArray(parentVariant?.references) ? [...new Set(parentVariant.references)] : [];
    if (!refIds.length) {
        return;
    }
    const section = document.createElement('section');
    section.className = 'cric-section cric-reference-section';
    const heading = buildCricSectionHeading(topic, sectionId, 'references', 'References');
    section.appendChild(heading);
    const list = document.createElement('ul');
    list.className = 'cric-reference-list';
    refIds.forEach((id) => {
        const ref = resolveCricReference(id);
        if (!ref) {
            return;
        }
        const item = document.createElement('li');
        if (ref.href) {
            const link = document.createElement('a');
            link.href = ref.href;
            link.target = '_blank';
            link.rel = 'noopener';
            link.className = 'cric-reference-link';
            link.textContent = ref.label || ref.href;
            item.appendChild(link);
        } else {
            item.textContent = ref.label || id;
        }
        list.appendChild(item);
    });
    if (list.children.length) {
        section.appendChild(list);
        container.appendChild(section);
    }
}

export function renderCricothyrotomyDetail(topic, details, contentArea) {
    const variants = Array.isArray(CricothyrotomyContent?.variants) ? CricothyrotomyContent.variants : [];
    const variantId = details?.variant || 'adult';
    const variantData = variants.find(variant => variant.id === variantId) || variants[0];
    if (!variantData) {
        contentArea.insertAdjacentHTML('beforeend', '<div class="text-gray-500 italic">Cricothyrotomy content unavailable.</div>');
        return;
    }
    let sectionsData = Array.isArray(variantData.sections) && variantData.sections.length
        ? variantData.sections
        : [variantData];
    if (details?.section) {
        const matchedSection = sectionsData.find(section => section?.id === details.section);
        if (matchedSection) {
            sectionsData = [matchedSection];
        }
    }
    sectionsData.forEach((sectionData, index) => {
        if (details?.section && sectionData?.id !== details.section) {
            return;
        }
        renderCricSection(topic, variantData, sectionData, contentArea, index);
    });
}
