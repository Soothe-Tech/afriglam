import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { storeApi } from '../../services/storeApi';
import { Modal } from '../../components/Modal';

const Products: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [rows, setRows] = React.useState<Product[]>([]);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editPrice, setEditPrice] = React.useState('');
  const [editImageUrl, setEditImageUrl] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const tabs = ['All', 'Wigs', 'Braids', 'Extensions', 'Care', 'Makeup', 'Skincare', 'Fragrance'];

  React.useEffect(() => {
    setLoading(true);
    storeApi
      .getProducts('all')
      .then((result) => setRows(result))
      .finally(() => setLoading(false));
  }, []);

  const visible = rows.filter((product) => {
    const tabMatch = activeTab === 'All' || product.category === activeTab;
    const q = query.toLowerCase();
    const searchMatch = !q || product.name.toLowerCase().includes(q) || product.sku.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  const removeProduct = (id: string) => {
    storeApi.deleteProduct(id).then((response) => {
      if (!response.ok) {
        setStatusMessage(response.error ?? 'Failed to delete product.');
        return;
      }
      setRows((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage('Product deleted successfully.');
    });
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setEditName(product.name);
    setEditPrice(String(product.price_pln));
    setEditImageUrl(product.image);
  };

  const saveEdit = async () => {
    if (!editing) return;
    const response = await storeApi.updateProduct(editing.id, {
      name: editName,
      price_pln: Number(editPrice),
      image: editImageUrl,
    });
    if (!response.ok) {
      setStatusMessage(response.error ?? 'Failed to update product.');
      return;
    }
    setRows((prev) =>
      prev.map((item) =>
        item.id === editing.id ? { ...item, name: editName, price_pln: Number(editPrice), image: editImageUrl } : item
      )
    );
    setEditing(null);
    setStatusMessage('Product updated successfully.');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Products</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your product catalogue and inventory.</p>
        </div>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-admin-primary hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-admin-primary/20">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-bold text-sm">Add Product</span>
        </Link>
      </div>
      {statusMessage && <p className="text-sm text-slate-500">{statusMessage}</p>}

      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-admin-primary" placeholder="Search products..." />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">Loading products...</div>
          ) : visible.length === 0 ? (
            <div className="p-8 text-sm text-slate-500">No products match the current filters.</div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {visible.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                          {product.image ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-400 text-2xl" aria-hidden>image</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{product.name}</span>
                          {product.isNew && <span className="text-[10px] text-admin-primary uppercase font-bold tracking-wide">New Arrival</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.category}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        product.status === 'In Stock'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : product.status === 'Low Stock'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        <span className={`size-1.5 rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-emerald-500'
                            : product.status === 'Low Stock'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}></span>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">{product.price_pln} PLN</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} className="p-2 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/10 rounded-lg transition-colors" aria-label={`Edit ${product.name}`}>
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => removeProduct(product.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" aria-label={`Delete ${product.name}`}>
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : 'Edit product'}
        actions={
          <>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Save</button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase text-slate-500">Product Name</label>
          <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <label className="block text-xs font-semibold uppercase text-slate-500">Price PLN</label>
          <input value={editPrice} onChange={(e) => setEditPrice(e.target.value)} type="number" className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" />
          <label className="block text-xs font-semibold uppercase text-slate-500">Product Image</label>
          <label className="w-full rounded-lg border border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-slate-600 cursor-pointer">
            Upload new image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const upload = await storeApi.uploadProductImage(file);
                if (!upload.ok || !upload.url) {
                  setStatusMessage(upload.error ?? 'Failed to upload image.');
                  return;
                }
                setEditImageUrl(upload.url);
              }}
            />
          </label>
          {editImageUrl && <img src={editImageUrl} alt="Edit preview" className="w-full h-40 object-cover rounded-lg border border-slate-200 dark:border-white/10" />}
        </div>
      </Modal>
    </div>
  );
};

export default Products;
