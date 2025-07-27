// src/pages/AdminPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const categories = [
    "Chef's Specials",
    "Chaat & Starters",
    "From the Tandoor",
    "Vegetarian Mains",
    "Non-Vegetarian Mains",
    "Biryani & Rice",
    "Breads & Sides",
    "Desserts",
    "Beverages"
];

const AdminPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null); // Starts as null
    const [formData, setFormData] = useState({
        name: '',
        category: categories[0],
        type: 'veg',
        price: '',
        description: '',
        hindiDescription: ''
    });
    const [mainImageFile, setMainImageFile] = useState(null);
    const [subImageFiles, setSubImageFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [englishPreview, setEnglishPreview] = useState(false);
    const [hindiPreview, setHindiPreview] = useState(false);
    const topOfFormRef = useRef(null);

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/foods');
            setFoods(data);
        } catch (error) {
            console.error('Failed to fetch foods', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        if (e.target.files[0]) {
            setMainImageFile(e.target.files[0]);
        }
    };

    const handleSubImagesChange = (e) => {
        setSubImageFiles([...e.target.files]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSubmit = new FormData();
        dataToSubmit.append('name', formData.name);
        dataToSubmit.append('category', formData.category);
        dataToSubmit.append('type', formData.type);
        dataToSubmit.append('price', formData.price);
        dataToSubmit.append('description', formData.description);
        dataToSubmit.append('hindiDescription', formData.hindiDescription);

        if (mainImageFile) {
            dataToSubmit.append('mainImage', mainImageFile);
        } else if (editingItem) {
            dataToSubmit.append('imageUrl', editingItem.imageUrl);
        }

        if (subImageFiles.length > 0) {
            subImageFiles.forEach(file => {
                dataToSubmit.append('subImages', file);
            });
        }

        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };

        try {
            if (editingItem) {
                await axios.put(`/api/foods/${editingItem.id}`, dataToSubmit, config);
            } else {
                await axios.post('/api/foods', dataToSubmit, config);
            }
            resetForm();
            fetchFoods();
        } catch (error) {
            console.error('Failed to save food item', error.response?.data?.message || error.message);
        } finally {
            setIsSubmitting(false); // --- CHANGED: Stop loading, regardless of success or failure ---
        }
    };

    const handleEdit = async (itemToEdit) => {
        try {
            // Fetch the full details for the item, including its subImages
            const { data } = await axios.get(`/api/foods/${itemToEdit.id}`);
            
            setEditingItem(data); // Set the complete item data for editing
            setFormData({
                name: data.name,
                category: data.category,
                type: data.type,
                price: parseFloat(data.price),
                description: data.description,
                hindiDescription: data.description_hindi || ''
            });
            setMainImageFile(null);
            setSubImageFiles([]);
                topOfFormRef.current?.scrollIntoView({ behavior: 'smooth' });
            

        } catch (error) {
            console.error("Failed to fetch item details for editing", error);
            alert("Could not load item details. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`/api/foods/${id}`, config);
                fetchFoods();
            } catch (error) {
                console.error('Failed to delete item', error);
            }
        }
    };

    const handleDeleteMainImage = async () => {
        if (!editingItem) return;
        if (window.confirm('Are you sure you want to delete the main image? This cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                // We use the existing update route, but send the item's data with a null imageUrl
                const dataToSubmit = {
                    ...formData,
                    imageUrl: null, // Signal to the backend to remove the image URL
                };

                await axios.put(`/api/foods/${editingItem.id}`, dataToSubmit, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update the state instantly to reflect the deletion
                setEditingItem(prev => ({ ...prev, imageUrl: null }));
                fetchFoods(); // Refresh the main list
                alert('Main image removed.');
            } catch (error) {
                console.error('Failed to delete main image', error);
                alert('Could not delete main image. Please try again.');
            }
        }
    };


    const handleDeleteSubImage = async (subImageId) => {
        if (window.confirm('Are you sure you want to delete this gallery image?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/subimages/${subImageId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update the state instantly to reflect the deletion in the UI
                setEditingItem(prev => ({
                    ...prev,
                    subImages: prev.subImages.filter(img => img.id !== subImageId)
                }));
                // Also refresh the main list to keep everything in sync
                fetchFoods();
            } catch (error) {
                console.error('Failed to delete sub-image', error);
                alert('Could not delete image. Please try again.');
            }
        }
    };

    const handleAiAutofill = async () => {
        if (!formData.name || !formData.category || !formData.type) {
            alert("Please fill in the Name, Category, and Type fields first.");
            return;
        }
        setIsGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/ai/generate-description', {
                name: formData.name,
                category: formData.category,
                type: formData.type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update the description field in the form data
            setFormData(prev => ({
                ...prev,
                description: data.englishDescription,
                hindiDescription: data.hindiDescription
            }));
        } catch (error) {
            console.error("Failed to generate description", error);
            alert("Could not generate AI description. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({ name: '', category: categories[0], type: 'veg', price: '', description: '', hindiDescription: '' });
        setMainImageFile(null);
        setSubImageFiles([]);
        setEnglishPreview(false);
        setHindiPreview(false);
    };

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Admin Panel</h1>
            <div ref={topOfFormRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h2>
                <form onSubmit={handleFormSubmit} key={editingItem ? editingItem.id : 'new'}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Text and select inputs */}
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                        <select name="category" value={formData.category} onChange={handleInputChange} className="p-2 border rounded dark:bg-gray-700 dark:text-white">{categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="p-2 border rounded dark:bg-gray-700 dark:text-white"><option value="veg">Veg</option><option value="non-veg">Non-Veg</option></select>
                        <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="Price" className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />

                        {/* Main Image Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Food Image</label>
                            {/* THIS IS THE FIX: Check if editingItem exists before accessing its properties */}
                            {editingItem && editingItem.imageUrl && (
                                <div className='mb-2 relative w-24 h-24'>
                                    <img src={editingItem.imageUrl} alt="Current main" className="w-full h-full object-cover rounded-md" />
                                    <button 
                                        type="button"
                                        onClick={handleDeleteMainImage}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                            <input type="file" name="mainImage" onChange={handleMainImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" required={!editingItem} />
                        </div>

                        {/* Sub-Images Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Gallery (Update not supported yet)</label>
                            <input type="file" name="subImages" multiple onChange={handleSubImagesChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                        </div>

                        {editingItem && editingItem.subImages && editingItem.subImages.length > 0 && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Gallery Images</label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {editingItem.subImages.map(img => (
                                        <div key={img.id} className="relative">
                                            <img src={img.image_url} alt="sub" className="w-full h-24 object-cover rounded-md" />
                                            <button 
                                                type="button"
                                                onClick={() => handleDeleteSubImage(img.id)}
                                                className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                            
                            
                            {/* --- UPDATED: English Description with Toggle --- */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <div className='flex items-center gap-4'>
                                    {/* Tab-like buttons to toggle view */}
                                    <div className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 flex">
                                        <button type="button" onClick={() => setEnglishPreview(false)} className={`px-2 py-0.5 rounded-md ${!englishPreview ? 'bg-green-600 text-white' : 'dark:text-gray-300'}`}>Write</button>
                                        <button type="button" onClick={() => setEnglishPreview(true)} className={`px-2 py-0.5 rounded-md ${englishPreview ? 'bg-green-600 text-white' : 'dark:text-gray-300'}`}>Preview</button>
                                    </div>
                                    <button type="button" onClick={handleAiAutofill} disabled={isGenerating} className="text-xs bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 disabled:bg-gray-400">
                                        {isGenerating ? 'Generating...' : '✨ AI Autofill'}
                                    </button>
                                </div>
                            </div>
                            {/* Conditionally render either textarea or preview */}
                            {englishPreview ? (
                                <div className="p-2 border rounded h-32 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="English Description (Markdown supported)" className="p-2 border rounded w-full h-32 dark:bg-gray-700 dark:text-white" required />
                            )}
                        </div>
                        
                        {/* --- UPDATED: Hindi Description with Toggle --- */}
                        <div className="md:col-span-2">
                             <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hindi Description</label>
                                <div className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 flex">
                                    <button type="button" onClick={() => setHindiPreview(false)} className={`px-2 py-0.5 rounded-md ${!hindiPreview ? 'bg-green-600 text-white' : 'dark:text-gray-300'}`}>Write</button>
                                    <button type="button" onClick={() => setHindiPreview(true)} className={`px-2 py-0.5 rounded-md ${hindiPreview ? 'bg-green-600 text-white' : 'dark:text-gray-300'}`}>Preview</button>
                                </div>
                            </div>
                            {hindiPreview ? (
                                <div className="p-2 border rounded h-32 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{formData.hindiDescription || "Nothing to preview..."}</ReactMarkdown>
                                </div>
                            ) : (
                                <textarea name="hindiDescription" value={formData.hindiDescription} onChange={handleInputChange} placeholder="Hindi Description (Markdown supported)" className="p-2 border rounded w-full h-32 dark:bg-gray-700 dark:text-white" />
                            )}
                        </div>
                    

                    </div>
                    <div className="mt-4 flex gap-4">
                        {/* --- CHANGED: The submit button is now aware of the loading state --- */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                        </button>
                        {editingItem && <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>}
                    </div>
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 dark:text-white">Existing Food Items</h2>
                <div className="mb-4">
                    <input type="text" placeholder="Search for a food item..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                </div>
                <div className="space-y-4">
                    {filteredFoods.map(food => (
                        <div key={food.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                             <div className="flex items-center gap-4">
                                <img src={food.imageUrl} alt={food.name} className="w-16 h-16 object-cover rounded-md" />
                                <div className='dark:text-white'>
                                    <p className="font-bold">{food.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">${parseFloat(food.price).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(food)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                                <button onClick={() => handleDelete(food.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;