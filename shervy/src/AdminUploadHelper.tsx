import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDocs,
    Timestamp,
    query,
    orderBy,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db, storage } from './firebase/firebaseInit';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'shervy_admin_secret';

interface UploadedFile {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
    tournamentId?: string;
    tournamentName?: string;
    isFeatured?: boolean;
    storagePath?: string;
    metadata?: {
        title?: string;
        description?: string;
        tags?: string[];
    };
}

interface TournamentOption {
    id: string;
    name: string;
    slug?: string;
    location?: string;
    eventDate?: Date;
    coverUrl?: string;
    isPublished?: boolean;
}

const AdminUploadHelper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);

    const [tournaments, setTournaments] = useState<TournamentOption[]>([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    const [selectedPreviewTournament, setSelectedPreviewTournament] = useState<string>('all');

    const [metadata, setMetadata] = useState({
        tournamentId: '',
        tournamentName: '',
        title: '',
        description: '',
        tags: '',
        isFeatured: false,
    });

    const [newTournament, setNewTournament] = useState({
        name: '',
        slug: '',
        location: '',
        eventDate: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const auth = localStorage.getItem('shervy_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        loadTournaments();
        loadExistingFiles();
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('shervy_admin_auth', 'true');
        } else {
            alert('Incorrect password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('shervy_admin_auth');
    };

    const slugify = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const loadTournaments = async () => {
        try {
            setLoadingTournaments(true);

            const tournamentsQuery = query(
                collection(db, 'tournaments'),
                orderBy('eventDate', 'desc')
            );

            const snapshot = await getDocs(tournamentsQuery);

            const items: TournamentOption[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    name: data.name || 'Tournoi',
                    slug: data.slug || '',
                    location: data.location || '',
                    eventDate: data.eventDate?.toDate?.(),
                    coverUrl: data.coverUrl || '',
                    isPublished: data.isPublished,
                };
            });

            setTournaments(items);
        } catch (error) {
            console.error('Error loading tournaments:', error);
            alert('Could not load tournaments');
        } finally {
            setLoadingTournaments(false);
        }
    };

    const loadExistingFiles = async () => {
        try {
            setLoadingFiles(true);

            const metadataQuery = query(
                collection(db, 'tournament_images'),
                orderBy('uploadedAt', 'desc')
            );

            const metadataSnapshot = await getDocs(metadataQuery);

            const filesData: UploadedFile[] = metadataSnapshot.docs.map((docSnap) => {
                const data = docSnap.data();

                return {
                    id: docSnap.id,
                    name: data.fileName || data.originalName || 'image',
                    url: data.url,
                    size: data.size || 0,
                    uploadedAt: data.uploadedAt?.toDate?.() || new Date(),
                    tournamentId: data.tournamentId,
                    tournamentName: data.tournamentName,
                    isFeatured: Boolean(data.isFeatured),
                    storagePath: data.storagePath,
                    metadata: {
                        title: data.title || '',
                        description: data.description || '',
                        tags: Array.isArray(data.tags) ? data.tags : [],
                    },
                };
            });

            setUploadedFiles(filesData);
        } catch (error) {
            console.error('Error loading files:', error);
            alert('Could not load uploaded images');
        } finally {
            setLoadingFiles(false);
        }
    };

    const createTournament = async () => {
        if (!newTournament.name.trim()) {
            alert('Tournament name is required');
            return;
        }

        try {
            const slug = newTournament.slug.trim()
                ? slugify(newTournament.slug)
                : slugify(newTournament.name);

            const docRef = await addDoc(collection(db, 'tournaments'), {
                name: newTournament.name.trim(),
                slug,
                location: newTournament.location.trim(),
                eventDate: newTournament.eventDate
                    ? Timestamp.fromDate(new Date(newTournament.eventDate))
                    : null,
                coverUrl: '',
                isPublished: true,
                createdAt: Timestamp.now(),
            });

            const createdTournament: TournamentOption = {
                id: docRef.id,
                name: newTournament.name.trim(),
                slug,
                location: newTournament.location.trim(),
                eventDate: newTournament.eventDate ? new Date(newTournament.eventDate) : undefined,
                isPublished: true,
            };

            setTournaments((prev) => {
                const next = [createdTournament, ...prev];
                return next.sort((a, b) => {
                    const aTime = a.eventDate?.getTime() || 0;
                    const bTime = b.eventDate?.getTime() || 0;
                    return bTime - aTime;
                });
            });

            setMetadata((prev) => ({
                ...prev,
                tournamentId: createdTournament.id,
                tournamentName: createdTournament.name,
            }));

            setNewTournament({
                name: '',
                slug: '',
                location: '',
                eventDate: '',
            });

            alert('Tournament created successfully');
        } catch (error) {
            console.error('Error creating tournament:', error);
            alert('Failed to create tournament');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);

        const imageFiles = selected.filter(
            (file) =>
                file.type.startsWith('image/') &&
                ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)
        );

        setFiles((prev) => [...prev, ...imageFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('Please select files first');
            return;
        }

        if (!metadata.tournamentId || !metadata.tournamentName) {
            alert('Please select a tournament first');
            return;
        }

        setUploading(true);
        setProgress(0);

        const newlyUploaded: UploadedFile[] = [];

        for (let i = 0; i < files.length; i += 1) {
            const file = files[i];

            try {
                const timestamp = Date.now();
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const fileName = `${timestamp}_${sanitizedName}`;
                const storagePath = `tournament_gallery/${metadata.tournamentId}/${fileName}`;

                const storageRef = ref(storage, storagePath);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);

                const fileMetadata = {
                    tournamentId: metadata.tournamentId,
                    tournamentName: metadata.tournamentName,
                    title: metadata.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
                    description: metadata.description || '',
                    tags: metadata.tags
                        ? metadata.tags
                            .split(',')
                            .map((tag) => tag.trim().toLowerCase())
                            .filter(Boolean)
                        : [],
                    isFeatured: metadata.isFeatured,
                };

                const docRef = await addDoc(collection(db, 'tournament_images'), {
                    ...fileMetadata,
                    url,
                    thumbnailUrl: url,
                    storagePath,
                    fileName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: Timestamp.now(),
                });

                newlyUploaded.push({
                    id: docRef.id,
                    name: fileName,
                    url,
                    size: file.size,
                    uploadedAt: new Date(),
                    tournamentId: metadata.tournamentId,
                    tournamentName: metadata.tournamentName,
                    isFeatured: metadata.isFeatured,
                    storagePath,
                    metadata: {
                        title: fileMetadata.title,
                        description: fileMetadata.description,
                        tags: fileMetadata.tags,
                    },
                });

                setProgress(Math.round(((i + 1) / files.length) * 100));
            } catch (error) {
                console.error('Error uploading file:', error);
                alert(
                    `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'
                    }`
                );
            }
        }

        setUploadedFiles((prev) =>
            [...newlyUploaded, ...prev].sort(
                (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            )
        );

        setFiles([]);
        setMetadata((prev) => ({
            ...prev,
            title: '',
            description: '',
            tags: '',
            isFeatured: false,
        }));

        if (fileInputRef.current) fileInputRef.current.value = '';

        setUploading(false);
        setProgress(0);

        alert(`Successfully uploaded ${newlyUploaded.length} file(s)`);
    };

    const handleDelete = async (file: UploadedFile) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            if (file.storagePath) {
                const storageRef = ref(storage, file.storagePath);
                await deleteObject(storageRef);
            } else if (file.tournamentId && file.name) {
                const fallbackPath = `tournament_gallery/${file.tournamentId}/${file.name}`;
                const storageRef = ref(storage, fallbackPath);
                await deleteObject(storageRef);
            }

            await deleteDoc(doc(db, 'tournament_images', file.id));

            setUploadedFiles((prev) => prev.filter((item) => item.id !== file.id));
            alert('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    };

    const filteredUploadedFiles = useMemo(() => {
        if (selectedPreviewTournament === 'all') return uploadedFiles;
        return uploadedFiles.filter((file) => file.tournamentId === selectedPreviewTournament);
    }, [uploadedFiles, selectedPreviewTournament]);

    const totalSizeMb = useMemo(
        () => uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024,
        [uploadedFiles]
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-500 mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                        <p className="text-gray-600 mt-2">Enter password to access upload helper</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter admin password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Access Upload Helper
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 text-center mt-6">
                        This page is for tournament administrators only.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tournament Gallery Upload Helper</h1>
                        <p className="text-gray-600">Upload and manage tournament photos</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tournament Setup</h2>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select existing tournament
                                    </label>
                                    <select
                                        value={metadata.tournamentId}
                                        onChange={(e) => {
                                            const selected = tournaments.find((t) => t.id === e.target.value);
                                            setMetadata((prev) => ({
                                                ...prev,
                                                tournamentId: e.target.value,
                                                tournamentName: selected?.name || '',
                                            }));
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    >
                                        <option value="">Select tournament</option>
                                        {tournaments.map((tournament) => (
                                            <option key={tournament.id} value={tournament.id}>
                                                {tournament.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <div className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                                        {loadingTournaments
                                            ? 'Loading tournaments...'
                                            : `${tournaments.length} tournament(s) available`}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Create new tournament</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newTournament.name}
                                        onChange={(e) =>
                                            setNewTournament((prev) => ({ ...prev, name: e.target.value }))
                                        }
                                        placeholder="Tournament name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />

                                    <input
                                        type="text"
                                        value={newTournament.slug}
                                        onChange={(e) =>
                                            setNewTournament((prev) => ({ ...prev, slug: e.target.value }))
                                        }
                                        placeholder="Slug (optional)"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />

                                    <input
                                        type="text"
                                        value={newTournament.location}
                                        onChange={(e) =>
                                            setNewTournament((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                        placeholder="Location"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />

                                    <input
                                        type="date"
                                        value={newTournament.eventDate}
                                        onChange={(e) =>
                                            setNewTournament((prev) => ({ ...prev, eventDate: e.target.value }))
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    onClick={createTournament}
                                    className="mt-4 px-5 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-black transition-colors"
                                >
                                    Create Tournament
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Upload New Images</h2>
                                <span className="text-sm text-gray-500">Max 10MB per image</span>
                            </div>

                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${files.length > 0
                                        ? 'border-rose-400 bg-rose-50'
                                        : 'border-gray-300 hover:border-rose-300 hover:bg-rose-25'
                                    }`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />

                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-500 mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>

                                <p className="text-gray-700 mb-2">
                                    <span className="font-medium text-rose-500">Click to select</span> or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">PNG, JPG, WebP, GIF up to 10MB</p>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Selected Files ({files.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {files.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-orange-100 rounded flex items-center justify-center">
                                                        <span className="text-xs font-medium text-rose-600">
                                                            {file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Image Metadata</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={metadata.title}
                                            onChange={(e) =>
                                                setMetadata((prev) => ({ ...prev, title: e.target.value }))
                                            }
                                            placeholder="e.g., Championship Celebration"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-7">
                                        <input
                                            id="isFeatured"
                                            type="checkbox"
                                            checked={metadata.isFeatured}
                                            onChange={(e) =>
                                                setMetadata((prev) => ({ ...prev, isFeatured: e.target.checked }))
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                                        />
                                        <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                                            Mark as featured on homepage
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={metadata.description}
                                        onChange={(e) =>
                                            setMetadata((prev) => ({ ...prev, description: e.target.value }))
                                        }
                                        placeholder="Brief description of the image"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={metadata.tags}
                                        onChange={(e) =>
                                            setMetadata((prev) => ({ ...prev, tags: e.target.value }))
                                        }
                                        placeholder="e.g., winner, celebration, team-a"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || files.length === 0 || !metadata.tournamentId}
                                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {uploading ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading... {progress}%</span>
                                        </div>
                                    ) : (
                                        `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`
                                    )}
                                </button>

                                {uploading && (
                                    <div className="mt-4">
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Gallery Preview ({filteredUploadedFiles.length} images)
                                </h2>

                                <div className="flex gap-3">
                                    <select
                                        value={selectedPreviewTournament}
                                        onChange={(e) => setSelectedPreviewTournament(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    >
                                        <option value="all">All tournaments</option>
                                        {tournaments.map((tournament) => (
                                            <option key={tournament.id} value={tournament.id}>
                                                {tournament.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={loadExistingFiles}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {loadingFiles ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : filteredUploadedFiles.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No images uploaded yet</p>
                                    <p className="text-sm mt-1">Upload some images to see them here</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {filteredUploadedFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                                        >
                                            <img
                                                src={file.url}
                                                alt={file.metadata?.title || file.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white text-sm font-medium truncate">
                                                        {file.metadata?.title || file.name}
                                                    </p>
                                                    <p className="text-[11px] text-gray-200 truncate">
                                                        {file.tournamentName || 'No tournament'}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-300">
                                                                {new Date(file.uploadedAt).toLocaleDateString()}
                                                            </span>
                                                            {file.isFeatured && (
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(file);
                                                            }}
                                                            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Stats</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Images</span>
                                    <span className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Size</span>
                                    <span className="font-semibold text-gray-900">{totalSizeMb.toFixed(2)} MB</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Tournaments</span>
                                    <span className="font-semibold text-gray-900">{tournaments.length}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Featured Images</span>
                                    <span className="font-semibold text-gray-900">
                                        {uploadedFiles.filter((file) => file.isFeatured).length}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Last Upload</span>
                                    <span className="text-sm text-gray-900">
                                        {uploadedFiles.length > 0
                                            ? new Date(uploadedFiles[0].uploadedAt).toLocaleDateString()
                                            : 'Never'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Structure</h2>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <p className="font-medium text-gray-900 mb-1">Collection</p>
                                    <code>tournaments</code>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <p className="font-medium text-gray-900 mb-1">Collection</p>
                                    <code>tournament_images</code>
                                </div>
                                <div className="p-4 rounded-lg bg-gray-50 border">
                                    <p className="font-medium text-gray-900 mb-1">Storage path</p>
                                    <code>tournament_gallery/[tournamentId]/[fileName]</code>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                            <h2 className="text-xl font-semibold mb-2">How to use this</h2>
                            <ul className="space-y-2 text-sm text-rose-100 list-disc pl-5">
                                <li>Create the tournament first</li>
                                <li>Select the tournament before uploading</li>
                                <li>Use featured only for homepage highlights</li>
                                <li>Use tags for filtering and grouping</li>
                                <li>Keep only a few featured images per event</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUploadHelper;