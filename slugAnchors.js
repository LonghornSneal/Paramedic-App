      if (typeof slugIDs !== 'undefined') {
        const container = document.createElement('div');
        container.id = 'slug-id-container';
        container.classList.add('hidden');
        slugIDs.forEach(id => {
          const div = document.createElement('div');
          div.id = id;
          div.dataset.branch = id;
          container.appendChild(div);
        });
        document.body.appendChild(container);
      }