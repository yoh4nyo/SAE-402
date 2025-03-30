document.addEventListener('DOMContentLoaded', function() {

    // Sélection des éléments HTML
    const allPaths = document.querySelectorAll('.map-container svg path'); // Pour la carte
    const chinaModalElement = document.getElementById('chinaModal'); // Pour la modale
    const feedbackToastElement = document.getElementById('feedbackToast'); // Pour le feedback
    const modelViewerElement = document.querySelector('model-viewer'); // Pour les hotspots

    // --- Gestion des erreurs ---
    let elementsOk = true;
    if (!chinaModalElement) {
        console.error("ERREUR : L'élément HTML avec l'ID 'chinaModal' est introuvable.");
        elementsOk = false;
    }
    if (!feedbackToastElement) {
        console.error("ERREUR : L'élément HTML avec l'ID 'feedbackToast' est introuvable.");
        elementsOk = false;
    }
    if (allPaths.length === 0) {
         console.error("ERREUR : Aucun élément <path> trouvé dans le SVG.");
         elementsOk = false;
    }
    if (!modelViewerElement) {
         console.error("ERREUR : L'élément <model-viewer> est introuvable.");
         elementsOk = false; 
    }


    const chinaModalInstance = new bootstrap.Modal(chinaModalElement);
    const feedbackToastInstance = new bootstrap.Toast(feedbackToastElement, {
        delay: 1500
    });

    // Pour les clics sur la carte SVG
    allPaths.forEach(path => {
        path.addEventListener('click', function(event) {
            const clickedPath = event.currentTarget;

            if (clickedPath.classList.contains('China')) {
                // Ferme d'abord les annotations de hotspots si elles sont ouvertes
                const openHotspots = modelViewerElement.querySelectorAll('.Hotspot.annotation-visible');
                openHotspots.forEach(hs => hs.classList.remove('annotation-visible'));
                // Affiche la modale
                chinaModalInstance.show();
            } else {
                if (clickedPath.tagName.toLowerCase() === 'path' && !chinaModalElement.contains(event.target)) {
                     // On affiche le toast
                     feedbackToastInstance.show();
                }
            }
        });
    });

    // Script pour les hotspots dans le model-viewer
    const hotspots = modelViewerElement.querySelectorAll('.Hotspot');

    if (hotspots.length > 0) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();

                const clickedHotspot = event.currentTarget;
                const wasVisible = clickedHotspot.classList.contains('annotation-visible');

                hotspots.forEach(otherHotspot => {
                    if (otherHotspot !== clickedHotspot) {
                       otherHotspot.classList.remove('annotation-visible');
                    }
                });

                // Toggle l'annotation du hotspot cliqué
                if (wasVisible) {
                    clickedHotspot.classList.remove('annotation-visible'); // Le fermer
                } else {
                    clickedHotspot.classList.add('annotation-visible'); // L'ouvrir
                }
            });
        });

         // Cacher les hotspots quand la modale se ferme
         chinaModalElement.addEventListener('hidden.bs.modal', event => {
            hotspots.forEach(hotspot => {
                hotspot.classList.remove('annotation-visible');
            });
         })

    } else { // Gestion des erreurs si aucun hotspot n'est trouvé
        console.warn("Aucun hotspot trouvé dans model-viewer.");
    }

});