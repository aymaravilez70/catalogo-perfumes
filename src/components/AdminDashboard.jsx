import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Sparkles, Plus, Edit3, Trash2, Check, X, Upload, Image as ImageIcon, 
  Lock, LogOut, Search, RefreshCw, AlertCircle, Eye, EyeOff, 
  DollarSign, Tag, Layers, ArrowLeft, LayoutDashboard, Package, 
  Settings, ExternalLink, TrendingUp, ShieldCheck, Flame, 
  Filter, ChevronRight, BarChart3, HelpCircle, CheckCircle2,
  PieChart, Users, Phone, ArrowUpRight, Copy,
  CloudSnow, Flower2, Umbrella, Leaf, Sun, Moon, Clock, Compass, Hash, Star
} from 'lucide-react';

const DEFAULT_PIN = 'admin123';

export default function AdminDashboard({ onBackToStore, onDataChanged }) {
  // Auth state (safeguarded for Safari Private Mode)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('joufab_admin_auth') === 'true' || localStorage.getItem('joufab_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Navigation tab
  const [activeTab, setActiveTab] = useState('inventory'); // 'dashboard', 'inventory', 'create', 'settings'
  
  // Data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Toast Feedback
  const [toast, setToast] = useState(null);

  // Edit / Create state
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const initialForm = {
    id: '',
    num: '',
    rating: '4.9',
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
    is_active: true,
    inspired_by: '',
    niche_house: '',
    longevity: '8 - 10 horas',
    sillage: 'Alta / Pesada',
    similar_ids: [],
    reviews: [],
    votes_invierno: '8500',
    votes_primavera: '2500',
    votes_verano: '1200',
    votes_otono: '7000',
    votes_dia: '3500',
    votes_noche: '9200',
    olfactory_dulzor: '3',
    olfactory_frescura: '3',
    olfactory_intensidad: '4',
    olfactory_proyeccion: '4',
    olfactory_duracion: '4',
    olfactory_versatilidad: '4'
  };
  const [formData, setFormData] = useState(initialForm);

  // Custom Settings (Saved in LocalStorage for client convenience)
  const [customPin, setCustomPin] = useState(() => {
    try {
      return localStorage.getItem('joufab_custom_pin') || DEFAULT_PIN;
    } catch {
      return DEFAULT_PIN;
    }
  });
  const [newPinInput, setNewPinInput] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Fetch from Supabase
  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .order('created_at', { ascending: false })
        .order('num', { ascending: true });

      if (error) throw error;
      if (data) {
        const normalized = data.map(p => {
          const pVotes = p.votes || {};
          return {
            ...p,
            num: p.num || '',
            inspired_by: p.inspired_by || pVotes.inspired_by || '',
            niche_house: p.niche_house || pVotes.niche_house || '',
            longevity: p.longevity || pVotes.longevity || '8 - 10 horas',
            sillage: p.sillage || pVotes.sillage || 'Alta / Pesada',
            similar_ids: Array.isArray(p.similar_ids) ? p.similar_ids : (Array.isArray(pVotes.similar_ids) ? pVotes.similar_ids : []),
            reviews: Array.isArray(pVotes.reviews) ? pVotes.reviews : (Array.isArray(p.reviews) ? p.reviews : []),
            votes: {
              invierno: Number(pVotes.invierno) || 5000,
              primavera: Number(pVotes.primavera) || 2000,
              verano: Number(pVotes.verano) || 1000,
              otoño: Number(pVotes.otoño) || 4000,
              dia: Number(pVotes.dia) || 3000,
              noche: Number(pVotes.noche) || 7000,
              ...pVotes
            }
          };
        });

        // Ensure newly added products are at the top, followed by 01..15
        normalized.sort((a, b) => {
          const timeA = new Date(a.created_at || 0).getTime();
          const timeB = new Date(b.created_at || 0).getTime();
          if (timeB !== timeA) {
            return timeB - timeA;
          }
          const numA = parseInt(a.num, 10) || 999;
          const numB = parseInt(b.num, 10) || 999;
          return numA - numB;
        });

        setProducts(normalized);
      }
    } catch (err) {
      console.error('Error cargando catálogo:', err);
      showToast('Error al conectar con la base de datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    let validPin = DEFAULT_PIN;
    try {
      validPin = localStorage.getItem('joufab_custom_pin') || DEFAULT_PIN;
    } catch {}
    if (pinInput.trim() === validPin || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      try {
        if (rememberMe) {
          localStorage.setItem('joufab_admin_auth', 'true');
        }
        sessionStorage.setItem('joufab_admin_auth', 'true');
      } catch {}
      setAuthError('');
      loadData();
    } else {
      setAuthError('PIN incorrecto. (Por defecto: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('joufab_admin_auth');
      localStorage.removeItem('joufab_admin_auth');
    } catch {}
    setPinInput('');
  };

  // Switch to Create Mode
  const handleGoCreate = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    const nextNum = String(products.length + 1).padStart(2, '0');
    setFormData({
      ...initialForm,
      num: nextNum
    });
    setActiveTab('create');
  };

  // Preset handler for season/moment votes
  const handleApplyVotePreset = (presetKey) => {
    if (presetKey === 'invernal') {
      setFormData(prev => ({
        ...prev,
        votes_invierno: '12500',
        votes_primavera: '2000',
        votes_verano: '800',
        votes_otono: '9500',
        votes_dia: '2800',
        votes_noche: '11800',
        season_badge: 'Invierno / Noches',
        best_season: 'invierno',
        best_moment: 'noche'
      }));
      showToast('Plantilla aplicada: Invernal & Nocturno Intenso');
    } else if (presetKey === 'veraniego') {
      setFormData(prev => ({
        ...prev,
        votes_invierno: '1200',
        votes_primavera: '7500',
        votes_verano: '13000',
        votes_otono: '3000',
        votes_dia: '11500',
        votes_noche: '3200',
        season_badge: 'Verano / Día',
        best_season: 'verano',
        best_moment: 'dia'
      }));
      showToast('Plantilla aplicada: Fresco & Veraniego');
    } else if (presetKey === 'versatil') {
      setFormData(prev => ({
        ...prev,
        votes_invierno: '6500',
        votes_primavera: '7000',
        votes_verano: '5800',
        votes_otono: '6400',
        votes_dia: '7200',
        votes_noche: '6800',
        season_badge: 'Versátil / Todo el Año',
        best_season: 'todo-el-ano',
        best_moment: 'versatil'
      }));
      showToast('Plantilla aplicada: Versátil Todo el Año');
    } else if (presetKey === 'otonal') {
      setFormData(prev => ({
        ...prev,
        votes_invierno: '8500',
        votes_primavera: '3600',
        votes_verano: '1800',
        votes_otono: '11000',
        votes_dia: '3800',
        votes_noche: '9500',
        season_badge: 'Otoño / Citas',
        best_season: 'otono',
        best_moment: 'noche'
      }));
      showToast('Plantilla aplicada: Otoño Sensual & Citas');
    }
  };

  // Switch to Edit Mode
  const handleGoEdit = (product) => {
    setIsEditing(true);
    setCurrentEditId(product.id);
    const pVotes = product.votes || {};
    setFormData({
      id: product.id,
      num: product.num || '',
      rating: product.rating != null ? String(product.rating) : '4.9',
      name: product.name || '',
      brand: product.brand || '',
      price: product.price != null ? String(product.price) : '',
      gender: product.gender || 'Unisex',
      category: product.category || '',
      description: product.description || '',
      occasions: product.occasions || '',
      badge: product.badge || '',
      season_badge: product.season_badge || 'Versátil',
      best_season: product.best_season || 'todo-el-ano',
      best_moment: product.best_moment || 'versatil',
      image: product.image || '',
      notes_salida: product.notes?.salida?.join(', ') || '',
      notes_corazon: product.notes?.corazon?.join(', ') || '',
      notes_base: product.notes?.base?.join(', ') || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      accords: Array.isArray(product.accords) ? product.accords.join(', ') : '',
      is_active: product.is_active !== false,
      inspired_by: product.inspired_by || pVotes.inspired_by || '',
      niche_house: product.niche_house || pVotes.niche_house || '',
      longevity: product.longevity || pVotes.longevity || '8 - 10 horas',
      sillage: product.sillage || pVotes.sillage || 'Alta / Pesada',
      similar_ids: Array.isArray(product.similar_ids) ? product.similar_ids : (Array.isArray(pVotes.similar_ids) ? pVotes.similar_ids : []),
      reviews: Array.isArray(pVotes.reviews) ? pVotes.reviews : (Array.isArray(product.reviews) ? product.reviews : []),
      votes_invierno: String(pVotes.invierno ?? 8500),
      votes_primavera: String(pVotes.primavera ?? 2500),
      votes_verano: String(pVotes.verano ?? 1200),
      votes_otono: String(pVotes.otoño ?? 7000),
      votes_dia: String(pVotes.dia ?? 3500),
      votes_noche: String(pVotes.noche ?? 9200),
      olfactory_dulzor: String(pVotes.olfactory_profile?.dulzor ?? product.olfactory_profile?.dulzor ?? 3),
      olfactory_frescura: String(pVotes.olfactory_profile?.frescura ?? product.olfactory_profile?.frescura ?? 3),
      olfactory_intensidad: String(pVotes.olfactory_profile?.intensidad ?? product.olfactory_profile?.intensidad ?? 4),
      olfactory_proyeccion: String(pVotes.olfactory_profile?.proyeccion ?? product.olfactory_profile?.proyeccion ?? 4),
      olfactory_duracion: String(pVotes.olfactory_profile?.duracion ?? product.olfactory_profile?.duracion ?? 4),
      olfactory_versatilidad: String(pVotes.olfactory_profile?.versatilidad ?? product.olfactory_profile?.versatilidad ?? 4)
    });
    setActiveTab('create');
  };

  // Upload image to Supabase bucket
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `perfume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('perfume-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('perfume-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      showToast('¡Imagen subida correctamente!');
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      showToast('Error al subir imagen. Puedes pegar una URL directa.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.brand?.trim()) {
      showToast('Nombre y Marca son obligatorios', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const slugId = isEditing && currentEditId
        ? currentEditId 
        : formData.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

      const payload = {
        id: slugId,
        num: (formData.num || '').trim() || String(products.length + 1).padStart(2, '0'),
        name: (formData.name || '').trim(),
        brand: (formData.brand || '').trim(),
        price: parseFloat(formData.price) || 0,
        rating: parseFloat(formData.rating) || 4.9,
        gender: formData.gender || 'Unisex',
        category: (formData.category || '').trim(),
        description: (formData.description || '').trim(),
        occasions: (formData.occasions || '').trim(),
        badge: (formData.badge || '').trim() || null,
        season_badge: (formData.season_badge || '').trim() || 'Versátil',
        best_season: formData.best_season || 'invierno',
        best_moment: formData.best_moment || 'noche',
        image: (formData.image || '').trim() || '/assets/perfumes/default.jpg',
        votes: {
          invierno: parseInt(formData.votes_invierno, 10) || 5000,
          primavera: parseInt(formData.votes_primavera, 10) || 2000,
          verano: parseInt(formData.votes_verano, 10) || 1000,
          otoño: parseInt(formData.votes_otono, 10) || 4000,
          dia: parseInt(formData.votes_dia, 10) || 3000,
          noche: parseInt(formData.votes_noche, 10) || 7000,
          inspired_by: formData.inspired_by?.trim() || '',
          niche_house: formData.niche_house?.trim() || '',
          longevity: formData.longevity?.trim() || '8 - 10 horas',
          sillage: formData.sillage?.trim() || 'Alta / Pesada',
          similar_ids: Array.isArray(formData.similar_ids) ? formData.similar_ids : [],
          reviews: Array.isArray(formData.reviews) ? formData.reviews : [],
          olfactory_profile: {
            dulzor: parseInt(formData.olfactory_dulzor, 10) || 3,
            frescura: parseInt(formData.olfactory_frescura, 10) || 3,
            intensidad: parseInt(formData.olfactory_intensidad, 10) || 4,
            proyeccion: parseInt(formData.olfactory_proyeccion, 10) || 4,
            duracion: parseInt(formData.olfactory_duracion, 10) || 4,
            versatilidad: parseInt(formData.olfactory_versatilidad, 10) || 4
          }
        },
        notes: {
          salida: (formData.notes_salida || '').split(',').map(s => s.trim()).filter(Boolean),
          corazon: (formData.notes_corazon || '').split(',').map(s => s.trim()).filter(Boolean),
          base: (formData.notes_base || '').split(',').map(s => s.trim()).filter(Boolean)
        },
        tags: (formData.tags || '').split(',').map(s => s.trim()).filter(Boolean),
        accords: (formData.accords || '').split(',').map(s => s.trim()).filter(Boolean),
        is_active: formData.is_active,
        created_at: isEditing 
          ? (products.find(p => p.id === currentEditId)?.created_at || new Date().toISOString())
          : new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('perfumes')
        .upsert(payload);

      if (error) throw error;

      showToast(isEditing ? '¡Fragancia actualizada!' : '¡Nueva fragancia añadida!');
      setActiveTab('inventory');
      loadData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.error('Error al guardar:', err);
      showToast('Error al guardar: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`¿Confirmas eliminar definitivamente "${name}" del catálogo?`)) return;

    try {
      const { error } = await supabase
        .from('perfumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast(`"${name}" eliminado.`);
      loadData();
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error eliminando: ' + err.message, 'error');
    }
  };

  // Toggle active status
  const handleToggleStatus = async (product) => {
    const newStatus = !product.is_active;
    try {
      const { error } = await supabase
        .from('perfumes')
        .update({ is_active: newStatus })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, is_active: newStatus } : p));
      showToast(`Producto ${newStatus ? 'puesto a la venta' : 'ocultado'}`);
      if (onDataChanged) onDataChanged();
    } catch (err) {
      showToast('Error actualizando estado', 'error');
    }
  };

  // Update PIN in settings
  const handleUpdatePin = (e) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      showToast('El PIN debe tener al menos 4 caracteres', 'error');
      return;
    }
    localStorage.setItem('joufab_custom_pin', newPinInput.trim());
    setCustomPin(newPinInput.trim());
    setNewPinInput('');
    showToast('¡Contraseña de administrador actualizada con éxito!');
  };

  // Computed Metrics for Dashboard
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => p.is_active !== false).length;
    const inactive = total - active;
    const totalVal = products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);
    const avgPrice = total > 0 ? (totalVal / total).toFixed(2) : 0;
    
    // Brands count
    const brandsMap = {};
    products.forEach(p => {
      brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
    });
    const uniqueBrands = Object.keys(brandsMap).length;

    // Genders count
    const genders = {
      Masculino: products.filter(p => p.gender === 'Masculino').length,
      Femenino: products.filter(p => p.gender === 'Femenino').length,
      Unisex: products.filter(p => p.gender === 'Unisex').length
    };

    return { total, active, inactive, avgPrice, uniqueBrands, brandsMap, genders };
  }, [products]);

  // Unique brand options
  const brandOptions = useMemo(() => {
    const set = new Set(products.map(p => p.brand).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && p.is_active !== false) || 
                            (statusFilter === 'inactive' && p.is_active === false);

      return matchesSearch && matchesBrand && matchesGender && matchesStatus;
    });
  }, [products, searchTerm, brandFilter, genderFilter, statusFilter]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-stone-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-6 shadow-lg shadow-amber-500/10">
            <Lock size={30} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mb-2">
            Panel de Control
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mb-8 leading-relaxed">
            Ingresa tu clave de administrador para gestionar los productos, precios y fotos del catálogo.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                placeholder="Contraseña / PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 px-4 py-3.5 rounded-2xl text-center text-lg tracking-widest focus:outline-none transition shadow-inner"
                autoFocus
              />
              {authError && (
                <p className="text-rose-400 text-xs mt-2 font-medium flex items-center justify-center gap-1.5 animate-fadeIn">
                  <AlertCircle size={14} /> {authError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-700 text-amber-500 focus:ring-0" 
                />
                <span>Recordar sesión en este equipo</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-110 text-stone-950 font-bold py-3.5 rounded-2xl transition shadow-xl shadow-amber-500/20 active:scale-[0.98]"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center justify-between">
            <button
              onClick={onBackToStore}
              className="text-xs text-stone-400 hover:text-amber-400 transition flex items-center gap-1.5 mx-auto"
            >
              <ArrowLeft size={14} />
              <span>Volver a la tienda pública</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FULL DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-black">
      
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-2xl font-medium shadow-2xl flex items-center gap-3 border transition-all animate-bounce ${
          toast.type === 'error' 
            ? 'bg-rose-950 text-rose-200 border-rose-600' 
            : 'bg-emerald-950 text-emerald-200 border-emerald-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-stone-900 border-b md:border-b-0 md:border-r border-stone-800/80 flex md:flex-col justify-between p-4 sm:p-6 flex-shrink-0">
        <div className="space-y-6 w-full">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-stone-100 tracking-wider">JOUFAB</h1>
                <span className="text-[10px] uppercase tracking-widest text-amber-400/90 font-medium block">Admin Suite</span>
              </div>
            </div>
            
            <button
              onClick={onBackToStore}
              title="Ir al catálogo público"
              className="md:hidden p-2 text-stone-400 hover:text-stone-100 bg-stone-800 rounded-xl"
            >
              <ExternalLink size={18} />
            </button>
          </div>

          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Package size={18} />
              <span>Inventario ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <BarChart3 size={18} />
              <span>Métricas & Resumen</span>
            </button>

            <button
              onClick={handleGoCreate}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'create'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Plus size={18} />
              <span>{isEditing ? 'Editar Perfume' : 'Nuevo Perfume'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
              }`}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        <div className="hidden md:flex flex-col gap-2 pt-6 border-t border-stone-800">
          <button
            onClick={onBackToStore}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-amber-400 hover:bg-stone-800/50 transition"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={16} />
              <span>Ver Catálogo Web</span>
            </span>
            <ArrowUpRight size={14} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-stone-950">
        
        <header className="sticky top-0 z-30 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-100 capitalize">
              {activeTab === 'inventory' && 'Inventario de Fragancias'}
              {activeTab === 'dashboard' && 'Resumen & Estadísticas'}
              {activeTab === 'create' && (isEditing ? 'Editar Fragancia' : 'Agregar Nueva Fragancia')}
              {activeTab === 'settings' && 'Ajustes del Sistema'}
            </h2>
            <p className="text-xs text-stone-400 hidden sm:block">
              {activeTab === 'inventory' && 'Gestiona los precios, fotos y disponibilidad en tiempo real'}
              {activeTab === 'dashboard' && 'Visión general de marcas, géneros y valores del catálogo'}
              {activeTab === 'create' && 'Completa la ficha técnica del producto para publicarlo'}
              {activeTab === 'settings' && 'Seguridad de acceso y preferencias'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'inventory' && (
              <button
                onClick={handleGoCreate}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
              >
                <Plus size={16} />
                <span>Agregar Perfume</span>
              </button>
            )}

            <button
              onClick={loadData}
              disabled={loading}
              title="Sincronizar base de datos"
              className="p-2.5 bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 rounded-xl transition"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-amber-400' : ''} />
            </button>
          </div>
        </header>

        <div className="p-6 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, casa, categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 text-stone-200 pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="bg-stone-950 border border-stone-800 text-stone-300 py-2.5 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Todas las Casas</option>
                    {brandOptions.filter(b => b !== 'all').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="bg-stone-950 border border-stone-800 text-stone-300 py-2.5 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Todos los Géneros</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Unisex">Unisex</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-stone-950 border border-stone-800 text-stone-300 py-2.5 px-3 rounded-xl focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="active">Solo Activos (En Venta)</option>
                    <option value="inactive">Solo Ocultos</option>
                  </select>
                </div>
              </div>

              <div className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                  <div className="py-24 text-center text-stone-400">
                    <RefreshCw size={32} className="animate-spin mx-auto text-amber-500 mb-3" />
                    <p className="text-sm">Consultando base de datos en Supabase...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="py-20 text-center text-stone-500 space-y-3">
                    <Package size={40} className="mx-auto text-stone-600" />
                    <p className="text-sm font-medium">No se encontraron productos con esos filtros.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setBrandFilter('all'); setGenderFilter('all'); setStatusFilter('all'); }}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Limpiar filtros de búsqueda
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-stone-300">
                      <thead className="bg-stone-950 text-stone-400 font-serif uppercase tracking-wider text-[10px] border-b border-stone-800">
                        <tr>
                          <th className="px-5 py-3.5">Producto</th>
                          <th className="px-4 py-3.5">Casa / Marca</th>
                          <th className="px-4 py-3.5">Precio</th>
                          <th className="px-4 py-3.5">Género</th>
                          <th className="px-4 py-3.5">Familia Olfativa</th>
                          <th className="px-4 py-3.5 text-center">Estado</th>
                          <th className="px-5 py-3.5 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {filteredProducts.map((p) => (
                          <tr 
                            key={p.id}
                            className={`hover:bg-stone-800/40 transition ${
                              p.is_active === false ? 'opacity-60 bg-stone-950/40' : ''
                            }`}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ImageIcon size={20} className="text-stone-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    {p.num && (
                                      <span className="font-mono text-[10px] font-bold text-amber-400 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-800">
                                        #{p.num}
                                      </span>
                                    )}
                                    <span className="font-serif font-bold text-stone-100 text-sm block">
                                      {p.name}
                                    </span>
                                  </div>
                                  {p.inspired_by && (
                                    <span className="text-[10px] text-stone-400 block truncate max-w-[200px] mt-0.5">
                                      Insp: <span className="text-amber-300 font-medium">{p.inspired_by}</span>
                                    </span>
                                  )}
                                  {p.badge && (
                                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 inline-block mt-0.5">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3.5 font-medium text-stone-300">
                              <span className="bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800">
                                {p.brand}
                              </span>
                            </td>

                            <td className="px-4 py-3.5">
                              <span className="font-bold text-amber-400 text-sm">
                                ${p.price || 0}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-stone-400">
                              {p.gender || 'Unisex'}
                            </td>

                            <td className="px-4 py-3.5 text-stone-400 max-w-[180px] truncate">
                              {p.category}
                            </td>

                            <td className="px-4 py-3.5 text-center">
                              <button
                                onClick={() => handleToggleStatus(p)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition border flex items-center gap-1.5 mx-auto ${
                                  p.is_active !== false
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                                    : 'bg-stone-950 text-stone-500 border-stone-800 hover:bg-stone-800'
                                }`}
                              >
                                {p.is_active !== false ? (
                                  <>
                                    <Eye size={12} />
                                    <span>En Catálogo</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={12} />
                                    <span>Oculto</span>
                                  </>
                                )}
                              </button>
                            </td>

                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleGoEdit(p)}
                                  className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-xl transition border border-transparent hover:border-amber-500/40"
                                  title="Editar"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition border border-transparent hover:border-rose-500/40"
                                  title="Eliminar"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: METRICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-medium block">Total Perfumes</span>
                    <span className="text-3xl font-serif font-bold text-stone-100 mt-1 block">
                      {metrics.total}
                    </span>
                    <span className="text-[11px] text-emerald-400 mt-1 block">
                      {metrics.active} activos para venta
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Package size={24} />
                  </div>
                </div>

                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-medium block">Casas / Marcas</span>
                    <span className="text-3xl font-serif font-bold text-stone-100 mt-1 block">
                      {metrics.uniqueBrands}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Lattafa, Rasasi, Armaf...
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles size={24} />
                  </div>
                </div>

                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-medium block">Precio Promedio</span>
                    <span className="text-3xl font-serif font-bold text-amber-400 mt-1 block">
                      ${metrics.avgPrice}
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Por unidad
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <DollarSign size={24} />
                  </div>
                </div>

                <div className="bg-stone-900/80 border border-stone-800 p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-medium block">Estado del Servidor</span>
                    <span className="text-lg font-bold text-emerald-400 mt-1 block flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      Keep-Alive Activo
                    </span>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Auto-ping cada 3 días
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={24} />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-2xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-100 flex items-center gap-2">
                    <Layers size={18} className="text-amber-400" />
                    <span>Distribución por Casas de Perfumería</span>
                  </h3>

                  <div className="space-y-3">
                    {Object.entries(metrics.brandsMap).map(([brand, count]) => {
                      const pct = metrics.total > 0 ? ((count / metrics.total) * 100).toFixed(0) : 0;
                      return (
                        <div key={brand} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-stone-300">{brand}</span>
                            <span className="text-stone-400">{count} fragancias ({pct}%)</span>
                          </div>
                          <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-2xl space-y-4">
                  <h3 className="font-serif font-bold text-base text-stone-100 flex items-center gap-2">
                    <Users size={18} className="text-amber-400" />
                    <span>Segmentación por Género</span>
                  </h3>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center">
                      <span className="text-xs text-stone-400 block">Masculino</span>
                      <span className="text-2xl font-serif font-bold text-stone-100 mt-1 block">
                        {metrics.genders.Masculino}
                      </span>
                    </div>

                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center">
                      <span className="text-xs text-stone-400 block">Femenino</span>
                      <span className="text-2xl font-serif font-bold text-stone-100 mt-1 block">
                        {metrics.genders.Femenino}
                      </span>
                    </div>

                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center">
                      <span className="text-xs text-stone-400 block">Unisex</span>
                      <span className="text-2xl font-serif font-bold text-stone-100 mt-1 block">
                        {metrics.genders.Unisex}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 leading-relaxed flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Tip para el cliente:</strong> Las fragancias Unisex y Masculinas son actualmente las de mayor rotación en perfumería árabe de nicho.</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: CREATE / EDIT */}
          {activeTab === 'create' && (
            <div className="bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-6 border-b border-stone-800 mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">
                    {isEditing ? `Modificar: ${formData.name}` : 'Crear Ficha de Perfume'}
                  </h3>
                  <p className="text-xs text-stone-400">Los cambios se reflejarán de inmediato en el catálogo público</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs text-stone-400 hover:text-stone-100 flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 rounded-xl"
                >
                  <ArrowLeft size={14} />
                  <span>Volver al listado</span>
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* BLOQUE 1: DATOS GENERALES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Nombre del Perfume *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Khamrah Qahwa"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Casa / Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Lattafa, Rasasi, Armaf"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                      <Hash size={13} className="text-amber-400" />
                      <span>Número de Catálogo (#)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 16"
                      value={formData.num}
                      onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-300 font-mono font-bold px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Precio ($ USD / Moneda)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="55.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-amber-400 font-bold px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                      <Star size={13} className="text-amber-400" />
                      <span>Calificación (Rating / 5.0)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      placeholder="4.9"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 font-bold px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Género</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Familia Olfativa</label>
                    <input
                      type="text"
                      placeholder="Ej. Gourmand Especiado, Acuático Frutal..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Insignia / Badge Destacada (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. Top Ventas o Best Seller"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* BLOQUE 2: INSPIRACIÓN DE ALTA GAMA Y RENDIMIENTO */}
                <div className="bg-stone-950/90 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-sm">
                      <Sparkles size={16} />
                      <span>Inspiración de Alta Perfumería & Rendimiento</span>
                    </div>
                    <span className="text-[10px] text-stone-400 bg-stone-900 px-2.5 py-1 rounded-full border border-stone-800">
                      Ficha Sensorial Boutique
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Inspiración Olfativa / Perfume de Referencia
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Angels' Share (Kilian Paris), Aventus (Creed)..."
                        value={formData.inspired_by}
                        onChange={(e) => setFormData({ ...formData, inspired_by: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Casa Matriz de Referencia (Nicho / Diseñador)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Kilian Paris, Creed, Parfums de Marly..."
                        value={formData.niche_house}
                        onChange={(e) => setFormData({ ...formData, niche_house: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-400" />
                        <span>Fijación en Piel / Longevidad</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. 10 - 12 horas, 8 - 10 horas, +14 horas..."
                        value={formData.longevity}
                        onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
                        <Flame size={13} className="text-amber-400" />
                        <span>Estela / Proyección Olfativa</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Alta / Pesada, Moderada, Envolvente..."
                        value={formData.sillage}
                        onChange={(e) => setFormData({ ...formData, sillage: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Fragancias Similares Relacionadas (Manual) (PDF p. 6, Punto 9) */}
                  <div className="pt-4 border-t border-stone-800/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5">
                          <Sparkles size={13} className="text-amber-400" />
                          <span>Fragancias Similares / Relacionadas (Fijar Manualmente)</span>
                        </label>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Fija hasta 4 fragancias prioritarias para la sección "¿Te gusta? Te podría encantar". Si lo dejas vacío, el sistema las calculará automáticamente.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-400/90 self-start sm:self-center">
                        {(formData.similar_ids || []).length} / 4 fijadas
                      </span>
                    </div>

                    {/* Active Selected Chips */}
                    {(formData.similar_ids || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(formData.similar_ids || []).map((simId) => {
                          const simProd = products.find(p => p.id === simId || String(p.num) === String(simId));
                          return (
                            <span 
                              key={simId} 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium"
                            >
                              <span>{simProd ? `#${simProd.num} ${simProd.name} (${simProd.brand})` : simId}</span>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  similar_ids: (prev.similar_ids || []).filter(id => id !== simId)
                                }))}
                                className="hover:text-white p-0.5 text-amber-400 hover:bg-amber-500/20 rounded-md transition"
                                title="Quitar de sugerencias manuales"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Selector Dropdown */}
                    {(formData.similar_ids || []).length < 4 && (
                      <div className="flex items-center gap-2">
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !(formData.similar_ids || []).includes(val) && (formData.similar_ids || []).length < 4) {
                              setFormData(prev => ({
                                ...prev,
                                similar_ids: [...(prev.similar_ids || []), val]
                              }));
                            }
                          }}
                          className="w-full bg-stone-900 border border-stone-800 text-stone-300 text-xs px-3.5 py-2.5 rounded-xl focus:border-amber-500 focus:outline-none cursor-pointer"
                        >
                          <option value="">+ Seleccionar fragancia para relacionar...</option>
                          {products
                            .filter(p => p.id !== (currentEditId || formData.id) && !(formData.similar_ids || []).includes(p.id))
                            .map(p => (
                              <option key={p.id} value={p.id}>
                                #{p.num} {p.name} — {p.brand} ({p.category})
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* BLOQUE 3: CUÁNDO USARLO - VOTOS Y ESTACIONES */}
                <div className="bg-stone-950/90 p-5 rounded-2xl border border-stone-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-stone-200 font-serif font-bold text-sm">
                        <Flame size={16} className="text-amber-400" />
                        <span>Cuándo Usarlo (Votos y Rendimiento)</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Alimenta las barras estadísticas de popularidad y temporadas en la ficha del perfume
                      </p>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-500 mr-1">Plantillas:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyVotePreset('invernal')}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-cyan-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Aplicar votos altos para invierno y noche"
                      >
                        <CloudSnow size={12} />
                        <span>Invernal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyVotePreset('veraniego')}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-rose-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Aplicar votos altos para verano y día"
                      >
                        <Umbrella size={12} />
                        <span>Verano</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyVotePreset('versatil')}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-emerald-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Aplicar votos equilibrados para todo el año"
                      >
                        <Leaf size={12} />
                        <span>Versátil</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyVotePreset('otonal')}
                        className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-amber-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Aplicar votos altos para otoño y citas"
                      >
                        <Sparkles size={12} />
                        <span>Otoño</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Seasons Inputs */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Votos por Temporada / Clima
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      {/* Invierno */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1.5">
                          <CloudSnow size={14} />
                          <span>Invierno</span>
                        </label>
                        <input
                          type="number"
                          placeholder="8500"
                          value={formData.votes_invierno}
                          onChange={(e) => setFormData({ ...formData, votes_invierno: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-cyan-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      {/* Primavera */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-1.5">
                          <Flower2 size={14} />
                          <span>Primavera</span>
                        </label>
                        <input
                          type="number"
                          placeholder="2500"
                          value={formData.votes_primavera}
                          onChange={(e) => setFormData({ ...formData, votes_primavera: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      {/* Verano */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-rose-300 flex items-center gap-1.5 mb-1.5">
                          <Umbrella size={14} />
                          <span>Verano</span>
                        </label>
                        <input
                          type="number"
                          placeholder="1200"
                          value={formData.votes_verano}
                          onChange={(e) => setFormData({ ...formData, votes_verano: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-rose-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      {/* Otoño */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1.5">
                          <Leaf size={14} />
                          <span>Otoño</span>
                        </label>
                        <input
                          type="number"
                          placeholder="7000"
                          value={formData.votes_otono}
                          onChange={(e) => setFormData({ ...formData, votes_otono: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                    </div>
                  </div>

                  {/* 2 Moments Inputs */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Votos por Momento del Día
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Día */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1.5">
                          <Sun size={14} />
                          <span>Día</span>
                        </label>
                        <input
                          type="number"
                          placeholder="3500"
                          value={formData.votes_dia}
                          onChange={(e) => setFormData({ ...formData, votes_dia: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                      {/* Noche */}
                      <div className="bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 mb-1.5">
                          <Moon size={14} />
                          <span>Noche</span>
                        </label>
                        <input
                          type="number"
                          placeholder="9200"
                          value={formData.votes_noche}
                          onChange={(e) => setFormData({ ...formData, votes_noche: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 focus:border-indigo-400 text-stone-100 font-mono text-xs px-3 py-2 rounded-lg focus:outline-none"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Season Badge & Filter Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-800">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Insignia de Temporada (Badge)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Invierno / Noches, Todo el Año..."
                        value={formData.season_badge}
                        onChange={(e) => setFormData({ ...formData, season_badge: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Mejor Estación (Filtro)
                      </label>
                      <select
                        value={formData.best_season}
                        onChange={(e) => setFormData({ ...formData, best_season: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="invierno">Invierno</option>
                        <option value="primavera">Primavera</option>
                        <option value="verano">Verano</option>
                        <option value="otono">Otoño</option>
                        <option value="todo-el-ano">Todo el Año</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                        Momento Recomendado (Filtro)
                      </label>
                      <select
                        value={formData.best_moment}
                        onChange={(e) => setFormData({ ...formData, best_moment: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 px-3 py-2.5 rounded-xl text-xs focus:outline-none"
                      >
                        <option value="noche">Noche</option>
                        <option value="dia">Día</option>
                        <option value="versatil">Versátil / Día y Noche</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* BLOQUE 4: PERFIL SENSORIAL OLFATIVO (1 A 5 CÁPSULAS) */}
                <div className="bg-stone-950/90 p-5 rounded-2xl border border-stone-800 space-y-4">
                  <div className="border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2 text-stone-200 font-serif font-bold text-sm">
                      <Sparkles size={16} className="text-amber-400" />
                      <span>Perfil Sensorial Olfativo (1 a 5 Cápsulas)</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Define los niveles mostrados en la ficha del producto y en el comparador de fragancias
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Dulzor */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-amber-300 block">Dulzor</label>
                      <select
                        value={formData.olfactory_dulzor}
                        onChange={(e) => setFormData({ ...formData, olfactory_dulzor: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 font-mono"
                      >
                        <option value="1">1 - Sutil / Seco</option>
                        <option value="2">2 - Ligero</option>
                        <option value="3">3 - Equilibrado</option>
                        <option value="4">4 - Marcado</option>
                        <option value="5">5 - Muy Gourmand</option>
                      </select>
                    </div>

                    {/* Frescura */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-cyan-300 block">Frescura</label>
                      <select
                        value={formData.olfactory_frescura}
                        onChange={(e) => setFormData({ ...formData, olfactory_frescura: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="1">1 - Cálido / Denso</option>
                        <option value="2">2 - Moderada baja</option>
                        <option value="3">3 - Equilibrada</option>
                        <option value="4">4 - Fresco</option>
                        <option value="5">5 - Muy Vigorizante</option>
                      </select>
                    </div>

                    {/* Intensidad */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-rose-300 block">Intensidad</label>
                      <select
                        value={formData.olfactory_intensidad}
                        onChange={(e) => setFormData({ ...formData, olfactory_intensidad: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-rose-400 font-mono"
                      >
                        <option value="1">1 - Íntimo / Suave</option>
                        <option value="2">2 - Moderado suave</option>
                        <option value="3">3 - Presente</option>
                        <option value="4">4 - Potente</option>
                        <option value="5">5 - Imponente / Bestia</option>
                      </select>
                    </div>

                    {/* Proyección */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-purple-300 block">Proyección</label>
                      <select
                        value={formData.olfactory_proyeccion}
                        onChange={(e) => setFormData({ ...formData, olfactory_proyeccion: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-purple-400 font-mono"
                      >
                        <option value="1">1 - A ras de piel</option>
                        <option value="2">2 - Burbuja íntima</option>
                        <option value="3">3 - Moderada (1m)</option>
                        <option value="4">4 - Alta (1.5m - 2m)</option>
                        <option value="5">5 - Llena habitaciones</option>
                      </select>
                    </div>

                    {/* Duración */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-emerald-300 block">Duración</label>
                      <select
                        value={formData.olfactory_duracion}
                        onChange={(e) => setFormData({ ...formData, olfactory_duracion: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-400 font-mono"
                      >
                        <option value="1">1 - 3 a 5 horas</option>
                        <option value="2">2 - 5 a 6 horas</option>
                        <option value="3">3 - 6 a 8 horas</option>
                        <option value="4">4 - 8 a 12 horas</option>
                        <option value="5">5 - 14+ horas (Eterno)</option>
                      </select>
                    </div>

                    {/* Versatilidad */}
                    <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1.5">
                      <label className="text-xs font-semibold text-blue-300 block">Versatilidad</label>
                      <select
                        value={formData.olfactory_versatilidad}
                        onChange={(e) => setFormData({ ...formData, olfactory_versatilidad: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-400 font-mono"
                      >
                        <option value="1">1 - Solo ocasiones puntuales</option>
                        <option value="2">2 - Específico (Fiesta/Frío)</option>
                        <option value="3">3 - Moderada</option>
                        <option value="4">4 - Alta (Múltiples planes)</option>
                        <option value="5">5 - Firma total (Todo el año)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800 space-y-3">
                  <span className="block text-xs font-semibold text-stone-300">Fotografía del Producto</span>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl bg-stone-900 border border-stone-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={32} className="text-stone-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2.5 w-full">
                      <input
                        type="text"
                        placeholder="Enlace URL de la foto (o súbela desde tu equipo abajo)"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-200 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none"
                      />
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl text-xs font-semibold cursor-pointer transition border border-stone-700 shadow-md">
                        <Upload size={14} className={uploadingImage ? 'animate-bounce' : ''} />
                        <span>{uploadingImage ? 'Subiendo imagen a Supabase...' : 'Subir foto desde este celular o PC'}</span>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Descripción Sensorial</label>
                    <textarea
                      rows={3}
                      placeholder="Describe la personalidad y aroma del perfume..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-xs focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5">Ocasiones de Uso Recomendadas</label>
                    <textarea
                      rows={3}
                      placeholder="Ej. Citas especiales, fiestas nocturnas, clima frío..."
                      value={formData.occasions}
                      onChange={(e) => setFormData({ ...formData, occasions: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-xs focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Notas de Salida (separar con comas)</label>
                    <input
                      type="text"
                      placeholder="Canela, Cardamomo, Jengibre"
                      value={formData.notes_salida}
                      onChange={(e) => setFormData({ ...formData, notes_salida: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Notas de Corazón (separar con comas)</label>
                    <input
                      type="text"
                      placeholder="Praliné, Frutas, Flores"
                      value={formData.notes_corazon}
                      onChange={(e) => setFormData({ ...formData, notes_corazon: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Notas de Fondo (separar con comas)</label>
                    <input
                      type="text"
                      placeholder="Café, Vainilla, Ámbar"
                      value={formData.notes_base}
                      onChange={(e) => setFormData({ ...formData, notes_base: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Etiquetas / Tags de Búsqueda (Comas)</label>
                    <input
                      type="text"
                      placeholder="Café, Dulce, Seductor, Nocturno"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">Acordes Principales (Comas)</label>
                    <input
                      type="text"
                      placeholder="Cálido Especiado, Avainillado, Amaderado"
                      value={formData.accords}
                      onChange={(e) => setFormData({ ...formData, accords: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 text-stone-200 px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded bg-stone-900 border-stone-700 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-xs text-stone-300 cursor-pointer select-none">
                    <strong>Habilitar perfume en el catálogo público inmediatamente</strong> (desmarca si está agotado o en borrador)
                  </label>
                </div>

                {/* MODERACIÓN DE RESEÑAS DE CLIENTES (SUPABASE) */}
                {isEditing && (
                  <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-stone-200 font-serif font-bold text-sm">
                          <Star size={16} className="text-amber-400 fill-amber-400" />
                          <span>Reseñas de Clientes en Vivo (Supabase)</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Opiniones reales y calificaciones públicas enviadas por compradores para esta fragancia
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-amber-400 font-semibold self-start sm:self-center">
                        {(formData.reviews || []).length} opiniones
                      </span>
                    </div>

                    {(formData.reviews || []).length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-stone-800 rounded-xl">
                        <p className="text-xs text-stone-400">Aún no se han publicado reseñas para este perfume.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {(formData.reviews || []).map((rev, idx) => (
                          <div key={rev.id || idx} className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-start justify-between gap-3">
                            <div className="space-y-1 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-stone-100">{rev.name}</span>
                                <span className="text-[10px] text-stone-400">({rev.city || 'Ecuador'})</span>
                                <span className="text-[10px] text-amber-400 font-mono">★ {rev.rating}/5</span>
                                <span className="text-[10px] text-stone-500">• {rev.date}</span>
                              </div>
                              <p className="text-stone-300 italic font-light">"{rev.comment}"</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedReviews = (formData.reviews || []).filter((_, i) => i !== idx);
                                setFormData(prev => ({ ...prev, reviews: updatedReviews }));
                                showToast('Reseña retirada de la lista. Haz clic en "Guardar Cambios" para aplicar.', 'info');
                              }}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                              title="Eliminar esta reseña"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="px-6 py-3 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold px-8 py-3 rounded-xl text-sm transition shadow-xl shadow-amber-500/20 flex items-center gap-2"
                  >
                    {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
                    <span>{isEditing ? 'Guardar Cambios' : 'Publicar Perfume'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              
              <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-100">Contraseña del Panel</h3>
                    <p className="text-xs text-stone-400">Cambia el PIN de acceso para tu cliente</p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePin} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1.5">Nuevo PIN / Contraseña</label>
                    <input
                      type="password"
                      placeholder="Escribe la nueva clave..."
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 px-4 py-3 rounded-xl text-sm focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    Actualizar Contraseña
                  </button>
                </form>
              </div>

              <div className="bg-stone-900/80 border border-stone-800 p-6 rounded-3xl space-y-3 text-xs text-stone-400">
                <h4 className="font-serif font-bold text-sm text-stone-200">Información del Servidor</h4>
                <p>• <strong>Motor:</strong> Supabase PostgreSQL Cloud</p>
                <p>• <strong>Keep-Alive automatizado:</strong> GitHub Actions Cron Job (cada 3 días)</p>
                <p>• <strong>Almacenamiento de fotos:</strong> Supabase Storage Bucket (`perfume-images`)</p>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
