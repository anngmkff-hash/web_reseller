import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Briefcase, 
  TrendingUp, 
  MessageSquare, 
  Contact,
  Loader2,
  AlertCircle,
  UserPlus
} from 'lucide-react';

const API_URL = "http://localhost:5000/api";

// --- Tipe Data ---
type BaseItem = {
  id: number | string;
  title: string;
  description: string;
  icon: string;
};

type Benefit = BaseItem;

type HowItWorksStep = BaseItem;

type Testimonial = {
  id: number | string;
  name: string;
  role: string;
  content: string; // <-- SUDAH DIUBAH DARI 'quote'
  stars: number;
  avatar: string;
};

type ContactInfo = {
  id: number | string;
  phone: string;
  email: string;
  instagram: string;

};

// --- Tipe data untuk Registrations (pendaftaran) ---
type Registration = {
  id: number | string;
  fullName: string;
  email: string;
  whatsapp: string;
  city: string;
  createdAt?: string;
};

// --- Komponen Accordion ---
interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-4 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-5 font-medium text-gray-800 focus:outline-none"
      >
        <div className="flex items-center">
          <span className="mr-3 text-blue-600">{icon}</span>
          <span className="text-lg">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
      </button>
      {isOpen && (
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

// --- CRUD Manager untuk "Benefits" ---
const BenefitsManager: React.FC = () => {
  const [items, setItems] = useState<Benefit[]>([]);
  const [editingItem, setEditingItem] = useState<Benefit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/benefits`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: Benefit) => {
    const isNew = !item.id;
    const url = isNew ? `${API_URL}/benefits` : `${API_URL}/benefits/${item.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)});
      if (!response.ok) throw new Error('Gagal menyimpan data');
      
      const savedData: Benefit = await response.json(); // Tipe eksplisit
      
      if (isNew) {
        setItems([...items, savedData]);
      } else {
        setItems(items.map(i => (i.id === savedData.id ? savedData : i)));
      }
      setEditingItem(null);

      // **Auto refresh**: ambil data terbaru dari server
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number | string) => {
    // Kita gunakan konfirmasi bawaan browser untuk sementara
    // if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    try {
      const response = await fetch(`${API_URL}/benefits/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus data');
      setItems(items.filter(i => i.id !== id));

      // **Auto refresh**: ambil data terbaru dari server
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const ItemForm: React.FC<{ item: Benefit; onSave: (item: Benefit) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Nama Lucide Icon)</label>
          <input
            type="text"
            placeholder="Contoh: DollarSign"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" /> Simpan
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div className="flex justify-center items-center p-4"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Error: {error}. Pastikan server backend berjalan.</div>;

  return (
    <div>
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
      <button
        onClick={() => setEditingItem({ id: '', icon: '', title: '', description: '' })}
        className="my-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Baru
      </button>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:text-blue-800">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CRUD Manager untuk "How It Works" ---
const HowItWorksManager: React.FC = () => {
  const [items, setItems] = useState<HowItWorksStep[]>([]);
  const [editingItem, setEditingItem] = useState<HowItWorksStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/howitworks`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: HowItWorksStep) => {
    const isNew = !item.id;
    const url = isNew ? `${API_URL}/howitworks` : `${API_URL}/howitworks/${item.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)});
      if (!response.ok) throw new Error('Gagal menyimpan data');
      
      const savedData: HowItWorksStep = await response.json(); // Tipe eksplisit

      if (isNew) {
        setItems([...items, savedData]);
      } else {
        setItems(items.map(i => (i.id === savedData.id ? savedData : i)));
      }
      setEditingItem(null);

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number | string) => {
    // if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    try {
      const response = await fetch(`${API_URL}/howitworks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus data');
      setItems(items.filter(i => i.id !== id));

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const ItemForm: React.FC<{ item: HowItWorksStep; onSave: (item: HowItWorksStep) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ikon (Nama Lucide Icon)</label>
          <input
            type="text"
            placeholder="Contoh: UserPlus"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.icon}
            onChange={e => setFormData({ ...formData, icon: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" /> Simpan
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div className="flex justify-center items-center p-4"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Error: {error}. Pastikan server backend berjalan.</div>;

  return (
    <div>
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
      <button
        onClick={() => setEditingItem({ id: '', icon: '', title: '', description: '' })}
        className="my-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Baru
      </button>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
              <h4 className="font-bold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:text-blue-800">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CRUD Manager untuk "Testimonials" ---
const TestimonialsManager: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/testimonials`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: Testimonial) => {
    const isNew = !item.id;
    const url = isNew ? `${API_URL}/testimonials` : `${API_URL}/testimonials/${item.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)});
      if (!response.ok) throw new Error('Gagal menyimpan data');
      
      const savedData: Testimonial = await response.json(); // Tipe eksplisit

      if (isNew) {
        setItems([...items, savedData]);
      } else {
        setItems(items.map(i => (i.id === savedData.id ? savedData : i)));
      }
      setEditingItem(null);

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number | string) => {
    // if (!window.confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    try {
      const response = await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus data');
      setItems(items.filter(i => i.id !== id));

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const ItemForm: React.FC<{ item: Testimonial; onSave: (item: Testimonial) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role (Jabatan)</label>
            <input
              type="text"
              placeholder="Contoh: Reseller Aktif"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              required
            />
          </div>
        </div>
         <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bintang (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.stars}
              onChange={e => setFormData({ ...formData, stars: parseInt(e.target.value, 10) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (Inisial)</label>
            <input
              type="text"
              placeholder="Contoh: A"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.avatar}
              onChange={e => setFormData({ ...formData, avatar: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          {/* ----- PERUBAHAN DI SINI ----- */}
          <label className="block text-sm font-medium text-gray-700 mb-1">Isi Testimoni (Content)</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.content} // <-- DIUBAH
            onChange={e => setFormData({ ...formData, content: e.target.value })} // <-- DIUBAH
            rows={4}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" /> Simpan
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div className="flex justify-center items-center p-4"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Error: {error}. Pastikan server backend berjalan.</div>;

  return (
    <div>
      {editingItem && (
        <ItemForm
          item={editingItem}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
        />
      )}
      <button
        onClick={() => setEditingItem({ id: '', name: '', role: '', content: '', stars: 5, avatar: '' })} // <-- DIUBAH
        className="my-4 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
      >
        <Plus className="w-4 h-4 mr-2" /> Tambah Baru
      </button>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div>
              <h4 className="font-bold">{item.name} <span className="text-sm font-normal text-gray-500">({item.role})</span></h4>
              <p className="text-sm text-gray-600 italic">"{item.content}"</p> {/* <-- DIUBAH */}
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:text-blue-800">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:text-red-800">
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- CRUD Manager untuk "Contact Info" ---
const ContactInfoManager: React.FC = () => {
  const [info, setInfo] = useState<ContactInfo | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/contactinfo`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setInfo(data[0] || null); // Ambil data pertama, atau null jika kosong
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (item: ContactInfo) => {
    // Info kontak selalu di-update, tidak pernah baru
    const url = `${API_URL}/contactinfo/${item.id}`;
    const method = 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)});
      if (!response.ok) throw new Error('Gagal menyimpan data');
      const savedData = await response.json();
      setInfo(savedData);
      setEditing(false);

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const ItemForm: React.FC<{ item: ContactInfo; onSave: (item: ContactInfo) => void; onCancel: () => void }> = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-inner border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon (WA)</label>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Contoh: admin@bisnis.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input
            type="text"
            placeholder="Contoh: @username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={formData.instagram}
            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center">
            <Save className="w-4 h-4 mr-2" /> Simpan
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <div className="flex justify-center items-center p-4"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Error: {error}. Pastikan server backend berjalan.</div>;
  
  if (editing && info) {
    return (
      <ItemForm
        item={info}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div>
      {info ? (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-3">
          <p><strong>Telepon:</strong> {info.phone}</p>
          <p><strong>Email:</strong> {info.email}</p>
          <p><strong>Instagram:</strong> {info.instagram}</p>
          
          <button
            onClick={() => setEditing(true)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Info Kontak
          </button>
        </div>
      ) : (
        <p>Info kontak belum diatur.</p>
      )}
    </div>
  );
};

// --- NEW: CRUD Manager untuk "Registrations" (Pendaftaran Reseller) ---
const RegistrationsManager: React.FC = () => {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(`${API_URL}/registrations`);
    if (!response.ok) throw new Error('Gagal mengambil data pendaftaran');
    const data = await response.json();

    // ✅ Konversi nama kolom created_at → createdAt agar bisa dibaca di React
    const formatted = data.map((item: any) => ({
      ...item,
      createdAt: item.created_at,
    }));

    setItems(formatted);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const response = await fetch(`${API_URL}/registrations/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus data');
      setItems(items.filter(i => i.id !== id));

      // **Auto refresh**
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" /> Error: {error}
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">Nama Lengkap</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">WhatsApp</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Kota Asal</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Tanggal Daftar</th>
            <th className="px-4 py-2 text-center text-sm font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                Belum ada data pendaftar.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{item.fullName}</td>
                <td className="px-4 py-2 text-sm">{item.email}</td>
                <td className="px-4 py-2 text-sm">{item.whatsapp}</td>
                <td className="px-4 py-2 text-sm">{item.city}</td>
                <td className="px-4 py-2 text-sm">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus data"
                  >
                    <Trash className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Komponen App (Main Dashboard) ---
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            <AccordionItem title="Kelola Keuntungan" icon={<TrendingUp className="w-6 h-6" />}>
              <BenefitsManager />
            </AccordionItem>
            
            <AccordionItem title="Kelola Cara Kerja" icon={<Briefcase className="w-6 h-6" />}>
              <HowItWorksManager />
            </AccordionItem>
            
            <AccordionItem title="Kelola Testimoni" icon={<MessageSquare className="w-6 h-6" />}>
              <TestimonialsManager />
            </AccordionItem>

            <AccordionItem title="Kelola Info Kontak" icon={<Contact className="w-6 h-6" />}>
              <ContactInfoManager />
            </AccordionItem>

            {/* --- NEW Accordion: Registrations --- */}
            <AccordionItem title="Kelola Pendaftaran Reseller" icon={<UserPlus className="w-6 h-6" />}>
              <RegistrationsManager />
            </AccordionItem>

          </div>
        </div>
      </main>
    </div>
  );
}
