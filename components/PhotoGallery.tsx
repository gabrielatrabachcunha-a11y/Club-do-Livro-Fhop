import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Download, Plus, X, Camera, Upload, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { GalleryPhoto, RecycleBinItem } from '../types';
import { DEFAULT_PHOTOS } from '../constants';

interface Props {
  isAdmin?: boolean;
}

const PhotoGallery: React.FC<Props> = ({ isAdmin = false }) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Delete Confirmation State
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = () => {
    try {
      const savedPhotos = localStorage.getItem('fhop_gallery_photos');
      if (savedPhotos) {
        return JSON.parse(savedPhotos);
      } else {
        return DEFAULT_PHOTOS;
      }
    } catch (e) {
      return DEFAULT_PHOTOS;
    }
  };

  useEffect(() => {
    // 1. Initial Load
    setPhotos(loadData());

    // 2. Listeners for sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fhop_gallery_photos') {
        setPhotos(loadData());
      }
    };
    const handleLocalUpdate = () => {
      setPhotos(loadData());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('fhop_data_update_photos', handleLocalUpdate);

    // 3. Polling for reliability (Updated to 1000ms for faster updates)
    const intervalId = setInterval(() => {
      const currentStored = loadData();
      if (JSON.stringify(currentStored) !== JSON.stringify(photos)) {
        setPhotos(currentStored);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fhop_data_update_photos', handleLocalUpdate);
      clearInterval(intervalId);
    };
  }, [photos]);

  const savePhotos = (updatedPhotos: GalleryPhoto[]) => {
    setPhotos(updatedPhotos);
    try {
      localStorage.setItem('fhop_gallery_photos', JSON.stringify(updatedPhotos));
      window.dispatchEvent(new Event('fhop_data_update_photos'));
    } catch (e) {
      alert('Erro de armazenamento: A cota de espaço do navegador pode estar cheia. Tente excluir fotos antigas da Lixeira.');
    }
  };

  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize logic to save storage space (Max 800px)
          const MAX_SIZE = 800;
          
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             // Compress to JPEG 70% quality
             resolve(canvas.toDataURL('image/jpeg', 0.7));
          } else {
             reject(new Error("Could not get canvas context"));
          }
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      try {
        const base64String = await processImageFile(e.target.files[0]);
        setNewPhotoUrl(base64String);
      } catch (error) {
        alert("Erro ao processar imagem. Tente uma imagem menor.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl) return;

    const newPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      url: newPhotoUrl,
      description: newPhotoDesc || 'Evento Club do Livro',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newPhoto, ...photos];
    savePhotos(updated);
    
    // Reset form
    setNewPhotoUrl('');
    setNewPhotoDesc('');
    setIsAdding(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmDelete = () => {
    if (!photoToDelete) return;
    const id = photoToDelete;

    // 1. Find item to delete
    const itemToDelete = photos.find(p => p.id === id);

    if (itemToDelete) {
      // 2. Move to Recycle Bin FIRST
      try {
        const binData = localStorage.getItem('fhop_recycle_bin');
        const bin: RecycleBinItem[] = binData ? JSON.parse(binData) : [];
        
        bin.push({
          deletedAt: new Date().toISOString(),
          type: 'photo',
          originalData: itemToDelete
        });
        
        localStorage.setItem('fhop_recycle_bin', JSON.stringify(bin));
        window.dispatchEvent(new Event('fhop_data_update_bin')); // Notify Recycle Bin
      } catch (e) {
        console.error("Erro ao mover para lixeira", e);
        alert("Não foi possível mover para a lixeira. O armazenamento pode estar cheio.");
        setPhotoToDelete(null);
        return; // Stop deletion to prevent data loss
      }

      // 3. Remove from Active List and Save
      const updated = photos.filter(p => p.id !== id);
      savePhotos(updated); // This handles the notification to users
    }
    
    setPhotoToDelete(null);
  };

  // If not admin and no photos, hide section completely
  if (!isAdmin && photos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
             <Camera size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Fotos do Club do Livro</h2>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            {isAdding ? <X size={16} /> : <Plus size={16} />}
            <span>{isAdding ? 'Cancelar' : 'Adicionar Foto'}</span>
          </button>
        )}
      </div>

      {/* Admin Add Form */}
      {isAdmin && isAdding && (
        <form onSubmit={handleAddPhoto} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 animate-in slide-in-from-top-2">
          
          <div className="flex space-x-4 mb-4 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${
                uploadMode === 'file' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload size={16} />
              <span>Carregar do Dispositivo</span>
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex items-center space-x-2 pb-2 text-sm font-medium transition-colors ${
                uploadMode === 'url' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon size={16} />
              <span>Usar Link (URL)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Imagem</label>
              
              {uploadMode === 'file' ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {newPhotoUrl ? (
                     <div className="relative h-32 w-full">
                       <img src={newPhotoUrl} alt="Preview" className="h-full w-full object-contain mx-auto rounded-lg" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <p className="text-white text-xs font-bold">Clique para alterar</p>
                       </div>
                     </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-500">
                      <Upload size={32} className="mb-2" />
                      <p className="text-sm font-medium">Clique para selecionar foto</p>
                      <p className="text-xs mt-1">Galeria ou Câmera</p>
                    </div>
                  )}
                  {isProcessing && <p className="text-xs text-blue-600 mt-2 animate-pulse">Processando imagem...</p>}
                </div>
              ) : (
                <div>
                   <input 
                    type="url" 
                    placeholder="https://exemplo.com/foto.jpg"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-2">Cole o link direto da imagem.</p>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição / Evento</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Encontro de Junho"
                value={newPhotoDesc}
                onChange={(e) => setNewPhotoDesc(e.target.value)}
                className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              
              <div className="mt-auto pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={!newPhotoUrl || isProcessing}
                  className={`px-6 py-3 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    !newPhotoUrl || isProcessing 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
                >
                  <Plus size={18} />
                  Salvar Foto
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
          <p>Nenhuma foto adicionada à galeria ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
              <img 
                src={photo.url} 
                alt={photo.description} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Erro+na+Imagem';
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-white font-medium truncate">{photo.description}</p>
                <p className="text-white/70 text-xs mb-3">{new Date(photo.date).toLocaleDateString('pt-BR')}</p>
                
                <div className="flex items-center space-x-2">
                  <a 
                    href={photo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    download={`fhop-foto-${photo.id}.jpg`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 rounded-lg transition-colors text-xs font-bold"
                  >
                    <Download size={14} />
                    <span>Baixar</span>
                  </a>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => setPhotoToDelete(photo.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200 border-t-4 border-red-500">
            <div className="flex flex-col items-center text-center">
               <div className="p-3 bg-red-100 rounded-full text-red-600 mb-4">
                 <AlertTriangle size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir Foto?</h3>
               <p className="text-slate-500 text-sm mb-6">
                 Deseja realmente excluir este item? Ele será movido para a lixeira e não aparecerá mais para os usuários.
               </p>
               
               <div className="flex w-full gap-3">
                 <button 
                   onClick={() => setPhotoToDelete(null)}
                   className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                 >
                   Não
                 </button>
                 <button 
                   onClick={confirmDelete}
                   className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                 >
                   Sim
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;