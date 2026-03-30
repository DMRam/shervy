import React, { useState, useRef, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db, storage } from './firebase/firebaseInit';

const ADMIN_PASSWORD = import.meta.env.VITE_FIREBASE_ADMIN_PASSWORD;

interface UploadedFile {
    id: string;
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
    metadata?: {
        title?: string;
        description?: string;
        tags?: string[];
    };
}

const AdminUploadHelper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        tags: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check if already authenticated
    useEffect(() => {
        const auth = localStorage.getItem('shervy_admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            loadExistingFiles();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('shervy_admin_auth', 'true');
            loadExistingFiles();
        } else {
            alert('Incorrect password');
        }
    };

    // Replace this section in the loadExistingFiles function:

    const loadExistingFiles = async () => {
        try {
            setLoadingFiles(true);

            // Load from Storage
            const storageRef = ref(storage, 'tournament_gallery/');
            const result = await listAll(storageRef);

            const filesData = await Promise.all(
                result.items.map(async (item) => {
                    const url = await getDownloadURL(item);

                    // Get metadata differently - we need to store it in Firestore
                    // or calculate it from what we know
                    return {
                        id: item.name,
                        name: item.name,
                        url,
                        size: 0, // We don't have size from StorageReference directly
                        uploadedAt: new Date(), // We'll get actual date from Firestore
                    };
                })
            );

            // Always try to load metadata from Firestore
            const metadataSnapshot = await getDocs(collection(db, 'tournament_images'));
            const metadataMap = new Map();

            metadataSnapshot.forEach(doc => {
                const data = doc.data();
                metadataMap.set(data.fileName, {
                    ...data,
                    id: data.fileName,
                    uploadedAt: data.uploadedAt?.toDate() || new Date(),
                });
            });

            // Merge metadata with files
            const mergedFiles = filesData.map(file => {
                const metadata = metadataMap.get(file.id);
                return {
                    ...file,
                    ...metadata, // This will override file properties with metadata
                    size: metadata?.size || file.size,
                    uploadedAt: metadata?.uploadedAt || file.uploadedAt,
                };
            });

            // Sort by upload date, newest first
            mergedFiles.sort((a, b) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            );

            setUploadedFiles(mergedFiles);
        } catch (error) {
            console.error('Error loading files:', error);

            // If Firestore fails, show at least the images we can get from Storage
            if (uploadedFiles.length === 0) {
                alert('Could not load metadata, but showing available images');
            }
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);

        // Filter only image files
        const imageFiles = selected.filter(file =>
            file.type.startsWith('image/') &&
            ['image/jpeg', 'image/png', 'image/webp', '/image/gif'].includes(file.type)
        );

        setFiles(prev => [...prev, ...imageFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert('Please select files first');
            return;
        }

        setUploading(true);
        setProgress(0);

        const uploadedUrls: UploadedFile[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                // Create unique filename with timestamp
                const timestamp = Date.now();
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const fileName = `${timestamp}_${sanitizedName}`;

                const storageRef = ref(storage, `tournament_gallery/${fileName}`);

                // Upload to Firebase Storage
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);

                // Prepare metadata
                const fileMetadata = {
                    title: metadata.title || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
                    description: metadata.description || '',
                    tags: metadata.tags
                        ? metadata.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
                        : [],
                };

                // Save to Firestore for metadata
                await addDoc(collection(db, 'tournament_images'), {
                    ...fileMetadata,
                    url,
                    fileName,
                    originalName: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: Timestamp.now(),
                });

                uploadedUrls.push({
                    id: fileName,
                    name: fileName,
                    url,
                    size: file.size,
                    uploadedAt: new Date(),
                    metadata: fileMetadata,
                });

                // Update progress
                setProgress(Math.round(((i + 1) / files.length) * 100));

            } catch (error) {
                console.error('Error uploading file:', error);
                alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        // Add uploaded files to the list
        setUploadedFiles(prev => [...uploadedUrls, ...prev]);

        // Reset form
        setFiles([]);
        setMetadata({ title: '', description: '', tags: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';

        setUploading(false);
        setProgress(0);
        alert(`Successfully uploaded ${uploadedUrls.length} file(s)`);
    };

    const handleDelete = async (fileId: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            // Delete from Storage
            const storageRef = ref(storage, `tournament_gallery/${fileId}`);
            await deleteObject(storageRef);

            // Try to delete from Firestore
            const metadataSnapshot = await getDocs(collection(db, 'tournament_images'));
            metadataSnapshot.forEach(async (docSnapshot) => {
                const data = docSnapshot.data();
                if (data.fileName === fileId) {
                    await deleteDoc(doc(db, 'tournament_images', docSnapshot.id));
                }
            });

            // Update local state
            setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
            alert('File deleted successfully');
        } catch (error) {
            console.error('Error deleting file:', error);
            alert('Error deleting file');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('shervy_admin_auth');
    };

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
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                required
                            />
                        </div>
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
                {/* Header */}
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
                    {/* Left Column - Upload Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Upload Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Upload New Images</h2>
                                <span className="text-sm text-gray-500">Max 10MB per image</span>
                            </div>

                            {/* File Drop Zone */}
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

                            {/* Selected Files */}
                            {files.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Selected Files ({files.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
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

                            {/* Metadata Inputs */}
                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Image Metadata (Optional)</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={metadata.title}
                                        onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g., Championship Celebration"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={metadata.description}
                                        onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
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
                                        onChange={(e) => setMetadata(prev => ({ ...prev, tags: e.target.value }))}
                                        placeholder="e.g., winner, celebration, team-a"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Upload Button */}
                            <div className="mt-8">
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading || files.length === 0}
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

                        {/* Gallery Preview */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Gallery Preview ({uploadedFiles.length} images)
                            </h2>

                            {loadingFiles ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : uploadedFiles.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No images uploaded yet</p>
                                    <p className="text-sm mt-1">Upload some images to see them here</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {uploadedFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="group relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
                                        >
                                            <img
                                                src={file.url}
                                                alt={file.metadata?.title || file.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white text-sm font-medium truncate">
                                                        {file.metadata?.title || file.name}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span className="text-xs text-gray-300">
                                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(file.id);
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

                    {/* Right Column - Stats & Instructions */}
                    <div className="space-y-8">
                        {/* Stats Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Stats</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Images</span>
                                    <span className="text-2xl font-bold text-gray-900">{uploadedFiles.length}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b">
                                    <span className="text-gray-600">Total Size</span>
                                    <span className="font-semibold text-gray-900">
                                        {(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
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

                            <div className="mt-8 p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
                                <button
                                    onClick={loadExistingFiles}
                                    className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    Refresh Gallery
                                </button>
                            </div>
                        </div>

                        {/* Instructions Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Select Images</h4>
                                        <p className="text-sm text-gray-600">Choose tournament photos from your computer</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Add Metadata (Optional)</h4>
                                        <p className="text-sm text-gray-600">Add titles, descriptions, and tags for better organization</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Upload</h4>
                                        <p className="text-sm text-gray-600">Click upload to add images to the tournament gallery</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Verify</h4>
                                        <p className="text-sm text-gray-600">Check the gallery preview to ensure everything looks good</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
                                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
                                    <li>Use descriptive titles for better SEO</li>
                                    <li>Add relevant tags for filtering</li>
                                    <li>Optimal image size: 1200x800px</li>
                                    <li>Use JPG for photos, PNG for graphics</li>
                                </ul>
                            </div>
                        </div>

                        {/* Storage Info */}
                        <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
                            <h2 className="text-xl font-semibold mb-2">Storage Location</h2>
                            <p className="text-rose-100 mb-4">
                                Images are uploaded to Firebase Storage under:
                            </p>
                            <code className="block bg-black/20 p-3 rounded-lg text-sm font-mono break-all">
                                /tournament_gallery/
                            </code>
                            <p className="text-sm text-rose-100 mt-4">
                                Metadata is saved in Firestore collection: <strong>tournament_images</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUploadHelper;