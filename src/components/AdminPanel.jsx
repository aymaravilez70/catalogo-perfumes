import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, Edit2, Trash2, Check, X, Upload, Image as ImageIcon, 
  Lock, LogOut, Search, RefreshCw, AlertCircle, Eye, EyeOff, 
  DollarSign, Sparkles, Tag, Layers, ArrowLeft
} from 'lucide-react';

const ADMIN_PIN = 'admin123'; // Clave por defecto para el cliente

export default function AdminPanel({ isOpen, onClose, onRefreshData, allPerfumes }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('joufab_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const initialFormState = {
    id: '',
    name: '',
    brand: '',
    price: '',
    gender: 'Unisex',
    category: 'Gourmand Especiado',
    description: '',
    occasions: '',
    badge: '',
    season_badge: 'Invierno / Otoño',
    best_season: 'invierno',
    best_moment: 'noche',
    image: '',
    notes_salida: '',
    notes_corazon: '',
    notes_base: '',
    tags: '',
    accords: '',
    is_active: true
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(allPerfumes || []);
      }
    } catch (err) {
      console.warn('Error al cargar de Supabase, usando catálogo local:', err);
      setProducts(allPerfumes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      fetchProducts();
    }
  }, [isAuthenticated, isOpen]);

  const showToast = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('joufab_admin_auth', 'true');
      setAuthError('');
      fetchProducts();
    } else {
      setAuthError('Contraseña incorrecta. (Prueba admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('joufab_admin_auth');
    setPinInput('');
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id || '',
      name: product.name || '',
      brand: product.brand || '',
      price: product.price || '',
      gender: product.gender || 'Unisex',
      category: product.category || '',
      description: product.description || '',
      occasions: product.occasions || '',
      badge: product.badge || '',
      season_badge: product.season_badge || '',
      best_season: product.best_season || 'todo-el-ano',
      best_moment: product.best_moment || 'versatil',
      image: product.image || '',
      notes_salida: product.notes?.salida?.join(', ') || '',
      notes_corazon: product.notes?.corazon?.join(', ') || '',
      notes_base: product.notes?.base?.join(', ') || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      accords: Array.isArray(product.accords) ? product.accords.join(', ') : '',
      is_active: product.is_active !== false
    });
    setIsModalOpen(true);
  };

  // Image file upload to Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('perfume-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('perfume-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      showToast('Imagen subida con éxito 📸');
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      showToast('No se pudo subir la imagen a Storage. Puedes pegar un enlace directo.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand) {
      showToast('Por favor completa el nombre y la marca', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const slugId = editingProduct 
        ? editingProduct.id 
        : formData.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      const payload = {
        id: slugId,
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        price: parseFloat(formData.price) || 0,
        gender: formData.gender,
        category: formData.category.trim(),
        description: formData.description.trim(),
        occasions: formData.occasions.trim(),
        badge: formData.badge.trim() || null,
        season_badge: formData.season_badge.trim() || 'Versátil',
        best_season: formData.best_season,
        best_moment: formData.best_moment,
        image: formData.image.trim() || '/assets/perfumes/default.jpg',
        notes: {
          salida: formData.notes_salida.split(',').map(s => s.trim()).filter(Boolean),
          corazon: formData.notes_corazon.split(',').map(s => s.trim()).filter(Boolean),
          base: formData.notes_base.split(',').map(s => s.trim()).filter(Boolean)
        },
        tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
        accords: formData.accords.split(',').map(s => s.trim()).filter(Boolean),
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('perfumes')
        .upsert(payload);

      if (error) throw error;

      showToast(editingProduct ? '¡Perfume actualizado!' : '¡Perfume creado exitosamente!');
      setIsModalOpen(false);
      fetchProducts();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Error al guardar:', err);
      showToast('Error al guardar en base de datos: ' + (err.message || 'Verifica la conexión'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) return;

    try {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast(`"${name}" eliminado.`);
      fetchProducts();
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Error al eliminar:', err);
      showToast('Error al eliminar perfume: ' + err.message, 'error');
    }
  };

  // Toggle active status
  const handleToggleActive = async (product) => {
    const newStatus = !product.is_active;
    try {
      const { error } = await supabase
        .from('perfumes')
        .update({ is_active: newStatus })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
      showToast(`Estado actualizado: ${newStatus ? 'En catálogo' : 'Oculto'}`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast('Error cambiando estado: ' + err.message, 'error');
    }
  };

  if (!isOpen) return null;

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      {/* Toast Alert */}
      {feedback && (
        <div className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded-xl font-medium shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${
          feedback.type === 'error' 
            ? 'bg-rose-950/90 text-rose-200 border-rose-600' 
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-600'
        }`}>
          {feedback.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      <div className="relative w-full max-w-5xl bg-stone-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-950/90 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
                Panel de Administración <span className="text-xs bg-amber-500/20 text-amber-300 font-sans px-2.5 py-0.5 rounded-full border border-amber-500/40">Joufab Cloud</span>
              </h2>
              <p className="text-xs text-stone-400">Gestiona productos, precios y fotos sin tocar código</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-100 mb-2">Acceso Administrador</h3>
            <p className="text-sm text-stone-400 max-w-sm mb-6">
              Ingresa la contraseña de control para gestionar el catálogo de perfumes.
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Contraseña (admin123)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-center text-lg tracking-widest focus:outline-none transition"
                  autoFocus
                />
                {authError && <p className="text-rose-400 text-xs mt-2 font-medium">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                Entrar al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 sm:p-6 bg-stone-900/50 border-b border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-stone-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={fetchProducts}
                  disabled={loading}
                  title="Recargar datos"
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenCreate}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-amber-500/20 transition"
                >
                  <Plus size={18} />
                  <span>Nuevo Perfume</span>
                </button>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-2.5 text-stone-400 hover:text-rose-400 bg-stone-950 hover:bg-rose-950/40 rounded-xl transition border border-stone-800"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            {/* Products Table / List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {loading ? (
                <div className="text-center py-16 text-stone-400">
                  <RefreshCw size={28} className="animate-spin mx-auto mb-3 text-amber-500" />
                  <p>Cargando productos de la base de datos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-stone-500">
                  <p>No se encontraron perfumes con ese criterio.</p>
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-stone-950/70 border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition hover:border-amber-500/40 ${
                      p.is_active !== false ? 'border-stone-800' : 'border-rose-900/40 opacity-60'
                    }`}
                  >
                    {/* Left: Image & Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl bg-stone-900 border border-stone-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={24} className="text-stone-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-stone-100 text-base">{p.name}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                            {p.brand}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-stone-400">
                          <span className="text-amber-400 font-bold font-sans text-sm">${p.price || 0}</span>
                          <span>•</span>
                          <span>{p.gender || 'Unisex'}</span>
                          <span>•</span>
                          <span className="truncate max-w-[160px]">{p.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
                      <button
                        onClick={() => handleToggleActive(p)}
                        title={p.is_active !== false ? 'Ocultar del catálogo' : 'Mostrar en catálogo'}
                        className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
                          p.is_active !== false
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700'
                        }`}
                      >
                        {p.is_active !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span className="hidden md:inline">{p.is_active !== false ? 'Visible' : 'Oculto'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2.5 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition"
                        title="Editar perfume"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-2.5 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition"
                        title="Eliminar perfume"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                    {editingProduct ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-100">
                      {editingProduct ? `Editar: ${editingProduct.name}` : 'Agregar Nuevo Perfume'}
                    </h3>
                    <p className="text-xs text-stone-400">Completa los datos del producto para el catálogo</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-100 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Basic info row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1.5 font-medium">Nombre del Perfume *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Khamrah Qahwa"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1.5 font-medium">Marca / Casa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Lattafa, Rasasi, Armaf"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1.5 font-medium">Precio ($ USD / Moneda)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="55.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1.5 font-medium">Género</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1.5 font-medium">Familia Olfativa / Categoría</label>
                    <input
                      type="text"
                      placeholder="Ej. Gourmand Especiado"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Upload / URL */}
                <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                  <label className="block text-xs text-stone-400 font-medium">Foto del Perfume</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.image && (
                      <div className="w-20 h-20 rounded-xl bg-stone-900 border border-stone-700 overflow-hidden flex-shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        placeholder="URL de la imagen (o súbela desde tu equipo abajo)"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-200 px-3 py-2 rounded-xl text-xs focus:outline-none"
                      />
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium cursor-pointer transition border border-stone-700">
                        <Upload size={14} className={uploadingImage ? 'animate-bounce' : ''} />
                        <span>{uploadingImage ? 'Subiendo imagen...' : 'Subir foto desde equipo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description & Occasions */}
                <div>
                  <label className="block text-xs text-stone-400 mb-1.5 font-medium">Descripción</label>
                  <textarea
                    rows={2}
                    placeholder="Descripción atractiva del aroma y personalidad..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1.5 font-medium">Ocasiones de uso recomendadas</label>
                  <input
                    type="text"
                    placeholder="Ej. Citas románticas, salidas nocturnas, clima frío..."
                    value={formData.occasions}
                    onChange={(e) => setFormData({ ...formData, occasions: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                {/* Olfactory Notes (Separated by commas) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Notas de Salida (Comas)</label>
                    <input
                      type="text"
                      placeholder="Canela, Cardamomo..."
                      value={formData.notes_salida}
                      onChange={(e) => setFormData({ ...formData, notes_salida: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Notas de Corazón (Comas)</label>
                    <input
                      type="text"
                      placeholder="Praliné, Flores..."
                      value={formData.notes_corazon}
                      onChange={(e) => setFormData({ ...formData, notes_corazon: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Notas de Fondo / Base</label>
                    <input
                      type="text"
                      placeholder="Café, Vainilla..."
                      value={formData.notes_base}
                      onChange={(e) => setFormData({ ...formData, notes_base: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Tags & Accords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Etiquetas / Tags (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="Café, Dulce, Cálido, Citas"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1 font-medium">Insignia / Badge especial (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Top Gourmand ☕ o Best Seller 🔥"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                    <span>{editingProduct ? 'Guardar Cambios' : 'Crear Perfume'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
