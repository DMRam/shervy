import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { db, storage } from './firebase/firebaseInit';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  date?: Date;
  tags?: string[];
}

export const TournamentGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('tous');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'ancien'>('recent');

  // Fetch images from Firebase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);

        // Try to fetch from Firestore first
        const imagesCollection = collection(db, 'tournament_images');
        const imagesQuery = query(imagesCollection, orderBy('uploadedAt', 'desc'));
        const querySnapshot = await getDocs(imagesQuery);

        const fetchedImages: GalleryImage[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedImages.push({
            id: doc.id,
            url: data.url,
            title: data.title || data.originalName?.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ') || 'Sans titre',
            description: data.description,
            date: data.uploadedAt?.toDate(),
            tags: data.tags
          } as GalleryImage);
        });

        // If no images in Firestore, try Storage
        if (fetchedImages.length === 0) {
          console.log('No images in Firestore, checking Storage...');
          const storageRef = ref(storage, 'tournament_gallery/');
          const result = await listAll(storageRef);

          const urls = await Promise.all(
            result.items.map(async (item) => {
              const url = await getDownloadURL(item);
              return {
                id: item.name,
                url,
                title: item.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '),
                description: 'Photo du tournoi',
                date: new Date(),
                tags: ['tournoi']
              };
            })
          );
          setImages(urls);
        } else {
          setImages(fetchedImages);
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des images :', err);
        setError('Impossible de charger les images de la galerie.');
        setImages(getSampleImages());
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const getSampleImages = (): GalleryImage[] => {
    return [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&auto=format&fit=crop',
        title: 'Moment du championnat',
        description: 'L\'équipe gagnante célèbre sa victoire',
        date: new Date('2024-03-15'),
        tags: ['vainqueur', 'célébration']
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop',
        title: 'Match final',
        description: 'Les moments intenses de la finale du tournoi',
        date: new Date('2024-03-15'),
        tags: ['finale', 'match']
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w-800&auto=format&fit=crop',
        title: 'Esprit d\'équipe',
        description: 'Les équipes démontrent un grand esprit sportif',
        date: new Date('2024-03-14'),
        tags: ['équipe', 'esprit']
      }
    ];
  };

  const getUniqueTags = () => {
    const allTags = images.flatMap(img => img.tags || []);
    return ['tous', ...Array.from(new Set(allTags))];
  };

  const filteredImages = filter === 'tous'
    ? images
    : images.filter(img => img.tags?.includes(filter));

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === 'recent') {
      return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
    } else {
      return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
    }
  });

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = sortedImages.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : sortedImages.length - 1;
    setSelectedImage(sortedImages[previousIndex]);
  }, [selectedImage, sortedImages]);

  const goToNext = useCallback(() => {
    if (!selectedImage) return;
    const currentIndex = sortedImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < sortedImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(sortedImages[nextIndex]);
  }, [selectedImage, sortedImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, goToPrevious, goToNext]);

  // Format date nicely
  const formatDate = (date?: Date) => {
    if (!date) return 'Date inconnue';
    return date.toLocaleDateString('fr-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Chargement des souvenirs du tournoi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-500 mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Impossible de charger la galerie</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <section id="galerie" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-700 rounded-full text-sm font-medium mb-3 border border-rose-200">
            Shervy 1 - Tournoi
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Moments de <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">Championnat</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Revivez les moments les plus excitants de notre tournoi inaugural
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Filtrer :</span>
              <div className="flex flex-wrap gap-2">
                {getUniqueTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilter(tag)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${filter === tag
                        ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {tag === 'tous' ? 'Toutes les photos' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'ancien')}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="recent">Plus récent d'abord</option>
                <option value="ancien">Plus ancien d'abord</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                aria-label="Vue grille"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-md transition-all ${viewMode === 'masonry'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                aria-label="Vue mosaïque"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
          }`}>
          <AnimatePresence>
            {sortedImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className={`relative group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid' : ''
                  }`}
                onClick={() => openLightbox(image)}
              >
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {image.title}
                        </h3>
                        {image.description && (
                          <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                            {image.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          {image.date && (
                            <span className="text-xs text-rose-100 bg-rose-600/30 backdrop-blur-sm px-2 py-1 rounded-full">
                              {formatDate(image.date)}
                            </span>
                          )}
                          <span className="text-xs text-white/90 bg-black/40 px-3 py-1 rounded-md">
                            Voir les détails
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Preview Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent">
                      <h3 className="text-sm font-semibold text-white line-clamp-1">
                        {image.title}
                      </h3>
                    </div>
                  </div>
                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {image.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-black/80 text-white text-xs rounded-md shadow"
                        >
                          {tag}
                        </span>
                      ))}
                      {image.tags.length > 2 && (
                        <span className="px-2 py-1 bg-black/80 text-white text-xs rounded-md">
                          +{image.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {sortedImages.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 text-rose-500 mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune image trouvée</h3>
            <p className="text-gray-600">Essayez un filtre différent ou revenez plus tard.</p>
          </div>
        )}

        {/* Stats */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg border border-rose-100">
                <div className="text-2xl font-bold text-rose-600 mb-1">{images.length}</div>
                <div className="text-sm text-gray-600 font-medium">Photos totales</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-100">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {new Set(images.flatMap(img => img.tags || [])).size}
                </div>
                <div className="text-sm text-gray-600 font-medium">Catégories</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-100">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {images.reduce((acc, img) => acc + (img.tags?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Étiquettes totales</div>
              </div>
              {/* <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-100">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {images[0]?.date ? formatDate(images[0].date) : 'S/O'}
                </div>
                <div className="text-sm text-gray-600 font-medium">Dernière mise à jour</div>
              </div> */}
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/90"
            />
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute -top-14 right-0 text-white hover:text-rose-300 transition-colors z-10"
                  aria-label="Fermer la visionneuse"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Fermer</span>
                    <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </button>
                <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                  <div className="grid lg:grid-cols-3">
                    {/* Image Section */}
                    <div className="lg:col-span-2">
                      <div className="relative h-[60vh] lg:h-[70vh] bg-gradient-to-br from-gray-50 to-gray-100">
                        <img
                          src={selectedImage.url}
                          alt={selectedImage.title}
                          className="w-full h-full object-contain p-4"
                        />
                        {/* Navigation Buttons */}
                        <button
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all"
                          aria-label="Image précédente"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-lg transition-all"
                          aria-label="Image suivante"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-md text-sm">
                          {sortedImages.findIndex(img => img.id === selectedImage.id) + 1} / {sortedImages.length}
                        </div>
                      </div>
                    </div>
                    {/* Info Panel */}
                    <div className="p-6 lg:p-8">
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-rose-600 to-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-500 font-medium">Photo du tournoi</span>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                          {selectedImage.title}
                        </h3>
                        {selectedImage.date && (
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(selectedImage.date)}</span>
                          </div>
                        )}
                      </div>
                      {selectedImage.description && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                          <p className="text-gray-700">{selectedImage.description}</p>
                        </div>
                      )}
                      {selectedImage.tags && selectedImage.tags.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Étiquettes</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedImage.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-3 py-1.5 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-700 text-sm rounded-md font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Lightbox Actions */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={goToPrevious}
                            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            aria-label="Image précédente"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={goToNext}
                            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            aria-label="Image suivante"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500 text-center">
                            Appuyez sur <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Échap</kbd> pour fermer •
                            Utilisez <kbd className="px-2 py-1 bg-gray-100 rounded text-xs mx-1">←</kbd> <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→</kbd> pour naviguer
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};