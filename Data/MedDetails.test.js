// We recommend installing an extension to run jest tests.

describe('processItem', () => {
    let allDisplayableTopicsMap;
    let allSearchableTopics;
    let medicationData;
    let processItem;

    beforeEach(() => {
        allDisplayableTopicsMap = {};
        allSearchableTopics = [];
        medicationData = {
            'med1': { name: 'Aspirin', contraindications: ['allergy to aspirin'] },
            'med2': { name: 'Epinephrine' }
        };

        // Re-define processItem in test scope to use our test variables
        processItem = function(item, parentPath = '', parentIds = []) {
            const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
            const currentIds = item.type === 'category' ? [...parentIds, item.id] : parentIds;

            // Attach the details from our medication data object
            const detailsToAttach = medicationData[item.id];

            let fullItemDetails = {
                ...item,
                path: currentPath,
                details: detailsToAttach || null,
                categoryPath: parentIds
            };

            allDisplayableTopicsMap[item.id] = fullItemDetails;

            if (item.type === 'topic') {
                allSearchableTopics.push({ id: item.id, title: item.title, path: currentPath, categoryPath: parentIds });
            }

            if (item.children) {
                item.children.forEach(child => processItem(child, currentPath, currentIds));
            }
        };
    });

    it('should add a topic item to allDisplayableTopicsMap and allSearchableTopics', () => {
        const item = { id: 'med1', title: 'Aspirin', type: 'topic' };
        processItem(item);

        expect(allDisplayableTopicsMap['med1']).toMatchObject({
            id: 'med1',
            title: 'Aspirin',
            type: 'topic',
            path: 'Aspirin',
            details: medicationData['med1'],
            categoryPath: []
        });

        expect(allSearchableTopics).toContainEqual({
            id: 'med1',
            title: 'Aspirin',
            path: 'Aspirin',
            categoryPath: []
        });
    });

    it('should add a category item and process its children recursively', () => {
        const item = {
            id: 'cat1',
            title: 'Pain Meds',
            type: 'category',
            children: [
                { id: 'med1', title: 'Aspirin', type: 'topic' },
                { id: 'med2', title: 'Epinephrine', type: 'topic' }
            ]
        };
        processItem(item);

        expect(allDisplayableTopicsMap['cat1']).toMatchObject({
            id: 'cat1',
            title: 'Pain Meds',
            type: 'category',
            path: 'Pain Meds',
            details: null,
            categoryPath: []
        });

        expect(allDisplayableTopicsMap['med1']).toMatchObject({
            id: 'med1',
            title: 'Aspirin',
            type: 'topic',
            path: 'Pain Meds > Aspirin',
            details: medicationData['med1'],
            categoryPath: ['cat1']
        });

        expect(allDisplayableTopicsMap['med2']).toMatchObject({
            id: 'med2',
            title: 'Epinephrine',
            type: 'topic',
            path: 'Pain Meds > Epinephrine',
            details: medicationData['med2'],
            categoryPath: ['cat1']
        });

        expect(allSearchableTopics).toEqual([
            {
                id: 'med1',
                title: 'Aspirin',
                path: 'Pain Meds > Aspirin',
                categoryPath: ['cat1']
            },
            {
                id: 'med2',
                title: 'Epinephrine',
                path: 'Pain Meds > Epinephrine',
                categoryPath: ['cat1']
            }
        ]);
    });

    it('should handle nested categories and topics', () => {
        const item = {
            id: 'cat1',
            title: 'Root',
            type: 'category',
            children: [
                {
                    id: 'cat2',
                    title: 'Subcat',
                    type: 'category',
                    children: [
                        { id: 'med1', title: 'Aspirin', type: 'topic' }
                    ]
                }
            ]
        };
        processItem(item);

        expect(allDisplayableTopicsMap['cat2']).toMatchObject({
            id: 'cat2',
            title: 'Subcat',
            type: 'category',
            path: 'Root > Subcat',
            details: null,
            categoryPath: ['cat1']
        });

        expect(allDisplayableTopicsMap['med1']).toMatchObject({
            id: 'med1',
            title: 'Aspirin',
            type: 'topic',
            path: 'Root > Subcat > Aspirin',
            details: medicationData['med1'],
            categoryPath: ['cat1', 'cat2']
        });

        expect(allSearchableTopics).toEqual([
            {
                id: 'med1',
                title: 'Aspirin',
                path: 'Root > Subcat > Aspirin',
                categoryPath: ['cat1', 'cat2']
            }
        ]);
    });

    it('should set details to null if medicationData does not have the item id', () => {
        const item = { id: 'unknown', title: 'Unknown Med', type: 'topic' };
        processItem(item);

        expect(allDisplayableTopicsMap['unknown'].details).toBeNull();
    });
});