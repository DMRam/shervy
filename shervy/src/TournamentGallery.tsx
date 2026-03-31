import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from './firebase/firebaseInit';

interface Tournament {
  id: string;
  name: string;
  date?: Date;
  coverUrl?: string;
  isActive?: boolean;
}

interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  date?: Date;
  tags?: string[];
  tournamentId: string;
  tournamentName?: string;
  isFeatured?: boolean;
}

interface TournamentGalleryProps {
  featuredOnly?: boolean;
  initialLimit?: number;
}

const PAGE_SIZE_DEFAULT = 12;

export const TournamentGallery = ({
  featuredOnly = false,
  initialLimit = PAGE_SIZE_DEFAULT,
}: TournamentGalleryProps) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('all');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'ancien'>('recent');
  const [filterTag, setFilterTag] = useState<string>('tous');
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const tournamentsRef = collection(db, 'tournaments');
        const tournamentsQuery = query(tournamentsRef, orderBy('eventDate', 'desc'));
        const snapshot = await getDocs(tournamentsQuery);

        const items: Tournament[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Tournoi',
            date: data.eventDate?.toDate?.() || data.date?.toDate?.(),
            coverUrl: data.coverUrl,
            isActive: data.isActive,
          };
        });

        setTournaments(items);

        if (items.length > 0) {
          setSelectedTournamentId(items[0].id);
        } else {
          setSelectedTournamentId('all');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des tournois:', err);
        setError('Impossible de charger les tournois.');
      }
    };

    fetchTournaments();
  }, []);

  const buildImagesQuery = (
    tournamentId: string,
    pageLimit: number,
    cursor?: QueryDocumentSnapshot<DocumentData> | null
  ) => {
    const imagesRef = collection(db, 'tournament_images');
    const constraints: any[] = [];

    if (tournamentId !== 'all') {
      constraints.push(where('tournamentId', '==', tournamentId));
    }

    if (featuredOnly) {
      constraints.push(where('isFeatured', '==', true));
    }

    constraints.push(orderBy('uploadedAt', 'desc'));
    constraints.push(limit(pageLimit));

    if (cursor) {
      constraints.push(startAfter(cursor));
    }

    return query(imagesRef, ...constraints);
  };

  const fetchImages = useCallback(
    async (
      tournamentId: string,
      append = false,
      cursor?: QueryDocumentSnapshot<DocumentData> | null
    ) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setLastVisible(null);
          setHasMore(true);
          setFilterTag('tous');
        }

        const imagesQuery = buildImagesQuery(
          tournamentId,
          initialLimit,
          append ? (cursor ?? null) : null
        );

        const snapshot = await getDocs(imagesQuery);

        const fetchedImages: GalleryImage[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            url: data.url,
            thumbnailUrl: data.thumbnailUrl,
            title:
              data.title ||
              data.originalName?.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') ||
              'Sans titre',
            description: data.description,
            date: data.uploadedAt?.toDate?.(),
            tags: data.tags || [],
            tournamentId: data.tournamentId || '',
            tournamentName: data.tournamentName,
            isFeatured: Boolean(data.isFeatured),
          };
        });

        setImages((prev) => (append ? [...prev, ...fetchedImages] : fetchedImages));
        setLastVisible(snapshot.docs.length ? snapshot.docs[snapshot.docs.length - 1] : null);
        setHasMore(snapshot.docs.length === initialLimit);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des images:', err);
        setError('Impossible de charger les images de la galerie.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [featuredOnly, initialLimit]
  );

  useEffect(() => {
    if (!selectedTournamentId) return;
    fetchImages(selectedTournamentId, false, null);
  }, [selectedTournamentId, fetchImages]);

  const getUniqueTags = () => {
    const allTags = images.flatMap((img) => img.tags || []);
    return ['tous', ...Array.from(new Set(allTags))];
  };

  const filteredImages =
    filterTag === 'tous'
      ? images
      : images.filter((img) => img.tags?.includes(filterTag));

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === 'recent') {
      return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
    }
    return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
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
    if (!selectedImage || sortedImages.length === 0) return;
    const currentIndex = sortedImages.findIndex((img) => img.id === selectedImage.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : sortedImages.length - 1;
    setSelectedImage(sortedImages[previousIndex]);
  }, [selectedImage, sortedImages]);

  const goToNext = useCallback(() => {
    if (!selectedImage || sortedImages.length === 0) return;
    const currentIndex = sortedImages.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = currentIndex < sortedImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(sortedImages[nextIndex]);
  }, [selectedImage, sortedImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, goToPrevious, goToNext]);

  const formatDate = (date?: Date) => {
    if (!date) return 'Date inconnue';
    return date.toLocaleDateString('fr-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    await fetchImages(selectedTournamentId, true, lastVisible);
  };

  const selectedTournament = tournaments.find((t) => t.id === selectedTournamentId);

  if (loading && images.length === 0) {
    return (
      <div className="min-h-[320px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-full border-4 border-white/10 border-t-rose-400 animate-spin" />
          <p className="mt-4 text-white/60">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-white">Impossible de charger la galerie</h3>
          <p className="mt-2 text-white/60">{error}</p>
          <button
            onClick={() => fetchImages(selectedTournamentId, false, null)}
            className="mt-4 rounded-xl bg-linear-to-r from-rose-500 to-orange-500 px-4 py-2 text-white hover:from-rose-600 hover:to-orange-600"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="galerie" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-rose-200">
            Galerie des tournois
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white">
            Moments de{' '}
            <span className="bg-linear-to-r from-rose-300 to-orange-300 bg-clip-text text-transparent">
              SherVy
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/65">
            Affiche seulement les meilleurs moments au départ, puis laisse les visiteurs explorer par tournoi.
          </p>
        </div>

        {/* Tournament filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTournamentId('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedTournamentId === 'all'
                ? 'bg-white text-rose-600'
                : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
              }`}
          >
            Tous les tournois
          </button>

          {tournaments.map((tournament) => (
            <button
              key={tournament.id}
              onClick={() => setSelectedTournamentId(tournament.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedTournamentId === tournament.id
                  ? 'bg-white text-rose-600'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                }`}
            >
              {tournament.name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {selectedTournamentId === 'all'
                  ? 'Toutes les photos'
                  : selectedTournament?.name || 'Tournoi'}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                {featuredOnly
                  ? 'Mode homepage: photos mises en avant seulement.'
                  : 'Galerie paginée par tournoi.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2">
                {getUniqueTags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${filterTag === tag
                        ? 'bg-white text-rose-600'
                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                      }`}
                  >
                    {tag === 'tous' ? 'Toutes les photos' : tag}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'ancien')}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <option value="recent" className="text-black">Plus récent d'abord</option>
                <option value="ancien" className="text-black">Plus ancien d'abord</option>
              </select>

              <div className="flex rounded-md border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md px-3 py-2 text-sm transition ${viewMode === 'grid'
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-white/60 hover:text-white'
                    }`}
                >
                  Grille
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`rounded-md px-3 py-2 text-sm transition ${viewMode === 'masonry'
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-white/60 hover:text-white'
                    }`}
                >
                  Mosaïque
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
          }
        >
          <AnimatePresence>
            {sortedImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className={`group cursor-pointer ${viewMode === 'masonry' ? 'break-inside-avoid' : ''}`}
                onClick={() => openLightbox(image)}
              >
                <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(244,63,94,0.30)]">
                  <div className="aspect-square overflow-hidden bg-white/5">
                    <img
                      src={image.thumbnailUrl || image.url}
                      alt={image.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="line-clamp-1 font-semibold text-white">
                        {image.title}
                      </h4>
                      {image.date && (
                        <span className="shrink-0 text-xs text-white/40">
                          {formatDate(image.date)}
                        </span>
                      )}
                    </div>

                    {image.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-white/65">
                        {image.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {image.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-rose-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {sortedImages.length === 0 && (
          <div className="py-16 text-center">
            <h3 className="text-xl font-semibold text-white">Aucune image trouvée</h3>
            <p className="mt-2 text-white/60">Essayez un autre tournoi ou un autre filtre.</p>
          </div>
        )}

        {/* Load more */}
        {hasMore && !featuredOnly && (
          <div className="mt-10 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded-xl bg-linear-to-r from-rose-500 to-orange-500 px-6 py-3 font-medium text-white hover:from-rose-600 hover:to-orange-600 disabled:opacity-60"
            >
              {loadingMore ? 'Chargement...' : 'Voir plus de photos'}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/90"
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="relative w-full max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute -top-14 right-0 z-10 text-white hover:text-rose-300"
                >
                  Fermer
                </button>

                <div className="overflow-hidden rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl">
                  <div className="grid lg:grid-cols-3">
                    <div className="relative lg:col-span-2 bg-black/5">
                      <div className="h-[60vh] lg:h-[72vh]">
                        <img
                          src={selectedImage.url}
                          alt={selectedImage.title}
                          className="h-full w-full object-contain p-4"
                        />
                      </div>

                      <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow"
                      >
                        ←
                      </button>

                      <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow"
                      >
                        →
                      </button>
                    </div>

                    <div className="p-6 lg:p-8">
                      <p className="text-sm font-medium text-rose-600">
                        {selectedImage.tournamentName || 'Tournoi'}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-gray-900">
                        {selectedImage.title}
                      </h3>

                      {selectedImage.date && (
                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(selectedImage.date)}
                        </p>
                      )}

                      {selectedImage.description && (
                        <div className="mt-6 rounded-lg bg-rose-50 p-4">
                          <h4 className="mb-2 text-sm font-semibold text-gray-700">
                            Description
                          </h4>
                          <p className="text-sm text-gray-700">
                            {selectedImage.description}
                          </p>
                        </div>
                      )}

                      {selectedImage.tags && selectedImage.tags.length > 0 && (
                        <div className="mt-6">
                          <h4 className="mb-3 text-sm font-semibold text-gray-700">
                            Étiquettes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedImage.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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