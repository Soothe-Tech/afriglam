import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { storeApi } from '../../services/storeApi';

const AddProduct: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Wigs');
  const [sku, setSku] = useState('');
  const [pricePln, setPricePln] = useState('');
  const [priceNgn, setPriceNgn] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Low Stock' | 'Out of Stock'>('In Stock');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const generateDescription = async () => {
    setError('');
    setMessage('');
    if (!productName) {
      setError('Please enter a product name first.');
      return;
    }

    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!geminiKey) {
      setDescription("Experience the ultimate luxury with our " + productName + ". Hand-crafted to perfection, this product embodies the essence of African heritage blended with modern European elegance. Suitable for all skin types and designed for long-lasting wear.");
      setMessage('Description generated with fallback template.');
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a luxurious, marketing-focused product description for a beauty product named "${productName}". Target audience is modern women in Nigeria and Poland. Keep it under 100 words.`,
      });
      setDescription(response.text || '');
    } catch (generationError) {
      console.error("AI Generation Error:", generationError);
      setError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setError('');
    setMessage('');
    setUploadingImage(true);
    const response = await storeApi.uploadProductImage(file);
    setUploadingImage(false);
    if (!response.ok || !response.url) {
      setError(response.error ?? 'Failed to upload image.');
      return;
    }
    setImageUrl(response.url);
    setMessage('Product image uploaded successfully.');
  };

  const publishProduct = async () => {
    setError('');
    setMessage('');
    if (!productName || !description || !sku || !pricePln || !priceNgn || !imageUrl) {
      setError('Please complete all required fields and upload an image before publishing.');
      return;
    }

    setIsPublishing(true);
    const result = await storeApi.createProduct({
      name: productName,
      description,
      category,
      sku,
      price_pln: Number(pricePln),
      price_ngn: Number(priceNgn),
      status: stockStatus,
      image: imageUrl,
    });
    setIsPublishing(false);

    if (!result.ok) {
      setError(result.error ?? 'Failed to publish product.');
      return;
    }

    setMessage('Product published successfully.');
  };

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto w-full gap-8 p-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Add New Product</h1>
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-amber-500"></span>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Draft - Last saved 2 mins ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            {message && <p className="mb-3 text-sm text-emerald-500">{message}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Product Title</label>
                <input 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary px-4 py-2.5 placeholder:text-slate-400" 
                  placeholder="e.g. Royal Silk Wig - 24 Inch" 
                  type="text"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                   <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Description</label>
                   <button 
                     onClick={generateDescription}
                     disabled={isGenerating}
                     className="text-xs flex items-center gap-1 text-admin-primary font-bold hover:text-emerald-400 disabled:opacity-50"
                   >
                     <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                     {isGenerating ? 'Generating...' : 'Generate with AI'}
                   </button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 p-4 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:border-admin-primary focus:ring-admin-primary" 
                  placeholder="Describe the product features, materials, and care instructions..."
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5">
                  <option>Wigs</option>
                  <option>Braids</option>
                  <option>Extensions</option>
                  <option>Care</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Media Gallery</h3>
             </div>
             <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
               <div className="bg-admin-primary/10 p-3 rounded-full mb-3 text-admin-primary">
                 <span className="material-symbols-outlined text-3xl">cloud_upload</span>
               </div>
               <p className="text-slate-900 dark:text-white font-medium">{uploadingImage ? 'Uploading image...' : 'Click to upload or drag and drop'}</p>
               <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
               />
             </label>
             {imageUrl && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <img src={imageUrl} alt="Uploaded product" className="w-full h-48 object-cover" />
              </div>
             )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="lg:col-span-1 flex flex-col gap-8">
           <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pricing</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Base Price (PLN)</label>
                <input value={pricePln} onChange={(e) => setPricePln(e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary px-4 py-2.5" placeholder="0.00" type="number"/>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Base Price (NGN)</label>
                <input value={priceNgn} onChange={(e) => setPriceNgn(e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary px-4 py-2.5" placeholder="0" type="number"/>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">SKU</label>
                <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:border-admin-primary focus:ring-admin-primary px-4 py-2.5" placeholder="AFG-001" type="text"/>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1.5">Stock Status</label>
                <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value as 'In Stock' | 'Low Stock' | 'Out of Stock')} className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5">
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
               </div>
             </div>
           </div>
           
           <button onClick={publishProduct} disabled={isPublishing} className="w-full py-3 bg-admin-primary hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-colors disabled:opacity-60">
             {isPublishing ? 'Publishing...' : 'Publish Product'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
