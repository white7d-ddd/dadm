import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Edit2, Layers, Image, Building, ShieldCheck, AlertTriangle, ArrowUp, ArrowDown, MapPin, Calendar } from 'lucide-react';
import { Product, Category, Banner, CompanyInfo, ConstructionProject, HomeSectionInfo } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';
import { ICON_MAP, AVAILABLE_ICONS } from '../utils/iconMap';

// ==========================================
// 1. PRODUCT FORM MODAL (Add / Edit Product)
// ==========================================
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
}

export function ProductModal({ isOpen, onClose, product, categories, onSave }: ProductModalProps) {
  const [pName, setPName] = useState('');
  const [pCategoryId, setPCategoryId] = useState('');
  const [pIdentificationNo, setPIdentificationNo] = useState('');
  const [pSize, setPSize] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pMaterial, setPMaterial] = useState('');
  const [pFinish, setPFinish] = useState('');
  const [pFeatureText, setPFeatureText] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pDrawingNo, setPDrawingNo] = useState('');
  const [pOptions, setPOptions] = useState('');
  const [pHasCad, setPHasCad] = useState(false);
  const [pHasPdf, setPHasPdf] = useState(false);
  const [pIsProcurement, setPIsProcurement] = useState(false);
  const [pIsSignature, setPIsSignature] = useState(false);
  const [pDesignMaterialEnabled, setPDesignMaterialEnabled] = useState(false);
  const [pDesignMaterialUrl, setPDesignMaterialUrl] = useState('');
  const [pImageUrls, setPImageUrls] = useState<string[]>(['']);

  useEffect(() => {
    if (product) {
      setPName(product.name);
      setPCategoryId(product.categoryId);
      setPIdentificationNo(product.identificationNo);
      setPSize(product.size);
      setPPrice(product.price);
      setPMaterial(product.material);
      setPFinish(product.finish);
      setPFeatureText(product.featureText);
      setPDescription(product.description);
      setPDrawingNo(product.drawingNo);
      setPOptions(product.options);
      setPHasCad(product.hasCad);
      setPHasPdf(product.hasPdf);
      setPIsProcurement(product.isProcurement !== false);
      setPIsSignature(product.isSignature || false);
      setPDesignMaterialEnabled(product.designMaterialEnabled || false);
      setPDesignMaterialUrl(product.designMaterialUrl || '');
      setPImageUrls(product.images && product.images.length > 0 ? product.images : ['']);
    } else {
      setPName('');
      setPCategoryId(categories.filter(c => c.id !== 'all')[0]?.id || 'pergola');
      setPIdentificationNo('');
      setPSize('');
      setPPrice(0);
      setPMaterial('');
      setPFinish('');
      setPFeatureText('');
      setPDescription('');
      setPDrawingNo('');
      setPOptions('');
      setPHasCad(false);
      setPHasPdf(false);
      setPIsProcurement(false);
      setPIsSignature(false);
      setPDesignMaterialEnabled(false);
      setPDesignMaterialUrl('');
      setPImageUrls(['']);
    }
  }, [product, isOpen, categories]);

  const handleImageUrlChange = (idx: number, value: string) => {
    const updated = pImageUrls.map((url, i) => (i === idx ? value : url));
    setPImageUrls(updated);
  };

  const handleAddImageUrlField = () => {
    setPImageUrls([...pImageUrls, '']);
  };

  const handleRemoveImageUrlField = (idx: number) => {
    if (pImageUrls.length > 1) {
      setPImageUrls(pImageUrls.filter((_, i) => i !== idx));
    }
  };

  const convertSynologyUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.includes('/sharing/')) {
      try {
        const parsed = new URL(trimmed);
        const parts = parsed.pathname.split('/').filter(Boolean);
        const sharingIndex = parts.indexOf('sharing');
        if (sharingIndex !== -1 && parts[sharingIndex + 1]) {
          const shareId = parts[sharingIndex + 1];
          parsed.pathname = '/fbsharing/api/download';
          parsed.searchParams.set('id', shareId);
          return parsed.toString();
        }
      } catch (e) {
        // Fallback
      }
    }
    return trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pIdentificationNo.trim() || !pSize.trim()) {
      alert('필수 입력 요소를 기입해주세요.');
      return;
    }

    const cleanedImages = pImageUrls.filter(url => url.trim() !== '');
    const finalImages = cleanedImages.length > 0 ? cleanedImages : ['https://picsum.photos/seed/default/800/600'];

    const savedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      categoryId: pCategoryId,
      name: pName.trim(),
      identificationNo: pIdentificationNo.trim(),
      size: pSize.trim(),
      price: Number(pPrice) || 0,
      images: finalImages,
      material: pMaterial.trim() || '고밀도 친환경 원목 + 내후성 스틸 프레임',
      finish: pFinish.trim(),
      featureText: pFeatureText.trim(),
      description: pDescription.trim(),
      drawingNo: pDrawingNo.trim(),
      options: pOptions.trim(),
      hasCad: pHasCad,
      hasPdf: pHasPdf,
      isProcurement: pIsProcurement,
      isSignature: pIsSignature,
      designMaterialEnabled: pDesignMaterialEnabled,
      designMaterialUrl: convertSynologyUrl(pDesignMaterialUrl),
      createdAt: product?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(savedProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-6 shrink-0">
            <div>
              <h2 className="text-lg font-black text-neutral-900 font-sans tracking-tight">
                {product ? `제품 정보 수정: ${product.name}` : '새로운 제품 등록'}
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                규격 정보, 식별번호, 도면 및 상세 설명 문구를 직접 제어합니다.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">모델명 / 품명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="예: 다듬 하이엔드 스마트 파고라"
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">카테고리 분류 <span className="text-red-500">*</span></label>
                <select
                  value={pCategoryId}
                  onChange={(e) => setPCategoryId(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-neutral-950 font-sans"
                >
                  {categories.filter(c => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">조달식별번호 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={pIdentificationNo}
                  onChange={(e) => setPIdentificationNo(e.target.value)}
                  placeholder="8자리 조달식별번호 입력"
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">판매 단가 (KRW) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={pPrice}
                  onChange={(e) => setPPrice(Number(e.target.value))}
                  placeholder="숫자만 입력"
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">제품 규격 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={pSize}
                  onChange={(e) => setPSize(e.target.value)}
                  placeholder="예: W3000 x D3000 x H2400"
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2">주요 재질</label>
                <input
                  type="text"
                  value={pMaterial}
                  onChange={(e) => setPMaterial(e.target.value)}
                  placeholder="예: 하드우드(이페) + 내후성 고장력 스틸 분체도장"
                  className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-2">제품 한줄 요약 (주요 장점)</label>
              <input
                type="text"
                value={pFeatureText}
                onChange={(e) => setPFeatureText(e.target.value)}
                placeholder="예: 유려한 격자 디자인으로 공간 감성을 살린 시그니처 쉘터"
                className="w-full text-xs px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-2">제품 사진 링크 (대표사진 및 서브사진 리스트)</label>
              <div className="space-y-3">
                {pImageUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60">
                    {url && (
                      <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                        <img
                          src={getDirectImageUrl(url)}
                          alt="제품 사진 미리보기"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      placeholder="제품 이미지 다이렉트 URL 입력 (시놀로지 NAS 공유링크도 가능)"
                      className="w-full text-xs px-3 py-2 border border-neutral-200 bg-white rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                    />
                    {pImageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrlField(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer border border-red-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImageUrlField}
                  className="text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>추가 서브 사진 등록</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-150">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="modal-procurement-allowed"
                  checked={pIsProcurement}
                  onChange={(e) => setPIsProcurement(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 border-neutral-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="modal-procurement-allowed" className="text-xs font-bold text-emerald-800 cursor-pointer">조달등록제품으로 지정</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="modal-signature-allowed"
                  checked={pIsSignature}
                  onChange={(e) => setPIsSignature(e.target.checked)}
                  className="h-4 w-4 text-amber-600 border-neutral-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="modal-signature-allowed" className="text-xs font-bold text-amber-800 cursor-pointer">메인페이지 게시</label>
              </div>
            </div>

            {/* 설계자료 다운로드 설정 (시놀로지 나스 등) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-neutral-50 p-4 rounded-2xl border border-neutral-150">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="modal-design-material-enabled"
                    checked={pDesignMaterialEnabled}
                    onChange={(e) => setPDesignMaterialEnabled(e.target.checked)}
                    className="h-4 w-4 text-neutral-950 border-neutral-300 rounded focus:ring-neutral-950"
                  />
                  <label htmlFor="modal-design-material-enabled" className="text-xs font-bold text-neutral-700 cursor-pointer">
                    설계자료 다운로드 버튼 활성화
                  </label>
                </div>
                <p className="text-[10px] text-neutral-400">활성화 시 상세페이지 판매 금액 바로 아래에 설계자료 다운로드 버튼이 표출됩니다.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">설계자료 다운로드 URL (시놀로지 나스 등)</label>
                <input
                  type="text"
                  value={pDesignMaterialUrl}
                  disabled={!pDesignMaterialEnabled}
                  onChange={(e) => setPDesignMaterialUrl(e.target.value)}
                  placeholder="예: https://mynas.synology.me:5001/sharing/AbCdEf"
                  className="w-full text-xs px-3 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950 font-mono disabled:opacity-50 disabled:bg-neutral-100"
                />
                <p className="text-[9px] text-neutral-400 mt-1">
                  💡 시놀로지 나스 파일 공유 링크(<code className="bg-neutral-100 px-1 py-0.5 rounded">/sharing/</code>) 입력 시, 직접 다운로드가 가능한 fbsharing 직링크로 자동 파싱 적용됩니다.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-5 py-3 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                {product ? '변경 완료' : '신규 제품 등록'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


// ==========================================
// 2. CATEGORY MANAGER MODAL (Add / Edit / Delete Categories)
// ==========================================
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onUpdateCategories: (categories: Category[]) => void;
  availableIcons?: { name: string; label: string }[];
  onUpdateAvailableIcons?: (icons: { name: string; label: string }[]) => void;
}

export function CategoryModal({ 
  isOpen, 
  onClose, 
  categories, 
  products, 
  onUpdateCategories,
  availableIcons,
  onUpdateAvailableIcons
}: CategoryModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Layers');
  const [catIsProcurement, setCatIsProcurement] = useState(true);
  const [catIsGeneral, setCatIsGeneral] = useState(true);

  const openAdd = () => {
    setCatId('');
    setCatName('');
    setCatDesc('');
    setCatIcon('Layers');
    setCatIsProcurement(true);
    setCatIsGeneral(true);
    setIsAdding(true);
    setEditingCat(null);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatIcon(cat.icon || 'Layers');
    setCatIsProcurement(cat.isProcurement !== false);
    setCatIsGeneral(cat.isGeneral !== false);
    setIsAdding(false);
  };

  const handleMoveUp = (id: string) => {
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === id);
    if (index > 0) {
      const updated = [...nonAll];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      const allCat = categories.find(c => c.id === 'all') || {
        id: 'all',
        name: '전체상품',
        description: 'DADMDESIGN의 명품 가로 시설물 전체 라인업을 소개합니다.',
        icon: 'Grid'
      };
      onUpdateCategories([allCat, ...updated]);
    }
  };

  const handleMoveDown = (id: string) => {
    const nonAll = categories.filter(c => c.id !== 'all');
    const index = nonAll.findIndex(c => c.id === id);
    if (index < nonAll.length - 1 && index !== -1) {
      const updated = [...nonAll];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      const allCat = categories.find(c => c.id === 'all') || {
        id: 'all',
        name: '전체상품',
        description: 'DADMDESIGN의 명품 가로 시설물 전체 라인업을 소개합니다.',
        icon: 'Grid'
      };
      onUpdateCategories([allCat, ...updated]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId.trim() || !catName.trim()) {
      alert('분류 코드와 이름은 필수입니다.');
      return;
    }

    if (isAdding) {
      if (categories.some(c => c.id === catId.trim())) {
        alert('이미 존재하는 분류 코드입니다.');
        return;
      }
      const newCat: Category = {
        id: catId.trim().toLowerCase(),
        name: catName.trim(),
        description: catDesc.trim(),
        icon: catIcon,
        isProcurement: catIsProcurement,
        isGeneral: catIsGeneral
      };
      onUpdateCategories([...categories, newCat]);
    } else if (editingCat) {
      const updated = categories.map(c => {
        if (c.id === editingCat.id) {
          return {
            ...c,
            name: catName.trim(),
            description: catDesc.trim(),
            icon: catIcon,
            isProcurement: catIsProcurement,
            isGeneral: catIsGeneral
          };
        }
        return c;
      });
      onUpdateCategories(updated);
    }

    setIsAdding(false);
    setEditingCat(null);
  };

  const handleDelete = (id: string) => {
    if (id === 'all') {
      alert('시스템 기본 카테고리는 삭제할 수 없습니다.');
      return;
    }
    const hasProducts = products.some(p => p.categoryId === id);
    let confirmMsg = `정말로 이 카테고리를 삭제하시겠습니까?`;
    if (hasProducts) {
      confirmMsg = `경고! 이 카테고리에 소속된 제품이 존재합니다. 카테고리를 삭제하면 소속 제품들의 필터링이 올바르게 작동하지 않을 수 있습니다. 그래도 삭제하시겠습니까?`;
    }

    if (window.confirm(confirmMsg)) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-6 shrink-0">
            <div>
              <h2 className="text-lg font-black text-neutral-900 font-sans tracking-tight">
                카테고리 분류체계 조율반
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                상단 메뉴바 및 필터링 탭에 쓰이는 대분류들을 직접 생성, 조율, 삭제합니다.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            {/* Form */}
            {(isAdding || editingCat) && (
              <form onSubmit={handleSave} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 animate-fade-in">
                <h3 className="text-xs font-bold text-neutral-800 font-sans">
                  {isAdding ? '새 카테고리 추가 양식' : '카테고리 수정 양식'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1">분류 고유 코드 (ID)</label>
                    <input
                      type="text"
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      disabled={!isAdding}
                      placeholder="예: playground (영문 소문자)"
                      className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono disabled:bg-neutral-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-500 mb-1">카테고리 이름 (한글)</label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="예: 놀이시설물"
                      className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1">카테고리 상세 설명</label>
                  <input
                    type="text"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="예: 아이들의 창의성과 신체 발달을 돕는 안전한 공공 아웃도어 가구"
                    className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-100/50 p-4 rounded-xl border border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="modal-cat-is-procurement"
                      checked={catIsProcurement}
                      onChange={(e) => setCatIsProcurement(e.target.checked)}
                      className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900 cursor-pointer"
                    />
                    <label htmlFor="modal-cat-is-procurement" className="text-xs font-bold text-emerald-800 cursor-pointer">
                      조달등록제품 페이지 카테고리 노출
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="modal-cat-is-general"
                      checked={catIsGeneral}
                      onChange={(e) => setCatIsGeneral(e.target.checked)}
                      className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900 cursor-pointer"
                    />
                    <label htmlFor="modal-cat-is-general" className="text-xs font-bold text-amber-800 cursor-pointer">
                      일반 제품소개 페이지 카테고리 노출
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">카테고리 픽토그램 선택</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 bg-white p-3 border border-neutral-200 rounded-xl max-h-40 overflow-y-auto">
                    {(availableIcons || AVAILABLE_ICONS).map((ico) => {
                      const isUrl = ico.name.startsWith('http') || ico.name.startsWith('/');
                      const isSelected = catIcon === ico.name;
                      return (
                        <button
                          key={ico.name}
                          type="button"
                          onClick={() => setCatIcon(ico.name)}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white font-bold'
                              : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-100 hover:border-neutral-200 text-neutral-600'
                          }`}
                          title={ico.label}
                        >
                          {isUrl ? (
                            <img
                              src={ico.name}
                              alt={ico.label}
                              className={`w-5 h-5 object-contain ${isSelected ? 'invert brightness-0' : ''}`}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            (() => {
                              const IconComponent = ICON_MAP[ico.name] || Layers;
                              return <IconComponent size={20} className={isSelected ? 'text-white' : 'text-neutral-700'} />;
                            })()
                          )}
                          <span className="text-[9px] mt-1 line-clamp-1 select-none leading-none scale-90">{ico.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingCat(null); }}
                    className="bg-white hover:bg-neutral-150 text-neutral-700 text-xs font-bold px-4 py-2 border border-neutral-200 rounded-lg cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                  >
                    {isAdding ? '추가 완료' : '저장 완료'}
                  </button>
                </div>
              </form>
            )}

            {/* List */}
            {!isAdding && !editingCat && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-neutral-500">현재 등록된 카테고리 ({categories.length})</span>
                  <button
                    onClick={openAdd}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>새 카테고리 추가</span>
                  </button>
                </div>

                <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        <th className="py-3 px-4">코드 ID</th>
                        <th className="py-3 px-4">카테고리명</th>
                        <th className="py-3 px-4">제품 개수</th>
                        <th className="py-3 px-4 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {categories.map((cat) => {
                        const count = products.filter(p => p.categoryId === cat.id).length;
                        return (
                          <tr key={cat.id} className="hover:bg-neutral-50/50">
                            <td className="py-3 px-4 font-mono text-neutral-500 font-bold">{cat.id}</td>
                            <td className="py-3 px-4 font-bold text-neutral-900">
                              <div className="flex items-center space-x-2">
                                {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                  <img src={cat.icon} alt={cat.name} className="w-4 h-4 object-contain shrink-0" referrerPolicy="no-referrer" />
                                ) : (
                                  (() => {
                                    const IconComp = (cat.icon && ICON_MAP[cat.icon]) || Layers;
                                    return <IconComp size={15} className="text-neutral-500 shrink-0" />;
                                  })()
                                )}
                                <span>{cat.name}</span>
                                {cat.id !== 'all' && (
                                  <div className="flex items-center gap-1">
                                    {cat.isProcurement !== false && (
                                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-sans font-bold">
                                        조달
                                      </span>
                                    )}
                                    {cat.isGeneral !== false && (
                                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[9px] font-sans font-bold">
                                        일반
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-[10px] text-neutral-400 font-normal mt-0.5">{cat.description || '-'}</p>
                            </td>
                            <td className="py-3 px-4 text-neutral-500 font-mono font-bold">{cat.id === 'all' ? '-' : `${count}개`}</td>
                            <td className="py-3 px-4 text-right">
                              {cat.id !== 'all' ? (
                                <div className="flex justify-end space-x-1">
                                  <button
                                    onClick={() => handleMoveUp(cat.id)}
                                    disabled={categories.filter(c => c.id !== 'all').findIndex(c => c.id === cat.id) === 0}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                                    title="순서 위로"
                                  >
                                    <ArrowUp size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleMoveDown(cat.id)}
                                    disabled={categories.filter(c => c.id !== 'all').findIndex(c => c.id === cat.id) === categories.filter(c => c.id !== 'all').length - 1}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                                    title="순서 아래로"
                                  >
                                    <ArrowDown size={13} />
                                  </button>
                                  <button
                                    onClick={() => openEdit(cat)}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 cursor-pointer"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-400 font-bold">기본</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end shrink-0 rounded-b-3xl">
            <button
              onClick={onClose}
              className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


// ==========================================
// 3. HERO BANNER MANAGER MODAL (Edit banner slides)
// ==========================================
interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
}

export function BannerModal({ isOpen, onClose, banners, onUpdateBanners }: BannerModalProps) {
  const [fields, setFields] = useState<Banner[]>([]);

  useEffect(() => {
    setFields(banners);
  }, [banners, isOpen]);

  const handleFieldChange = (idx: number, key: keyof Banner, value: string) => {
    const updated = fields.map((b, i) => (i === idx ? { ...b, [key]: value } : b));
    setFields(updated);
  };

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: '새로운 랜드마크 슬라이드',
      subtitle: '서브 카피 문구 기재',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
    };
    setFields([...fields, newBanner]);
  };

  const handleRemoveBanner = (idx: number) => {
    if (fields.length <= 1) {
      alert('최소 1개 이상의 배너 슬라이드가 상주해야 합니다.');
      return;
    }
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBanners(fields);
    alert('홈페이지 메인 배너 슬라이드 구성이 반영되었습니다.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-6 shrink-0">
            <div>
              <h2 className="text-lg font-black text-neutral-900 font-sans tracking-tight">
                메인 배너 슬라이드 제어기
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                첫 화면 메인 비주얼 슬라이드의 이미지와 헤드라인, 순서를 다이렉트로 추가/수정합니다.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-grow">
            <div className="space-y-6">
              {fields.map((b, idx) => (
                <div key={b.id} className="relative p-5 rounded-2xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-200/60 pb-2">
                    <span className="text-xs font-bold text-neutral-700 font-mono">SLIDE #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBanner(idx)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 px-2.5 py-1 text-[11px] font-bold rounded-md border border-red-100 transition-colors cursor-pointer"
                    >
                      슬라이드 삭제
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1">메인 타이틀 헤드라인</label>
                      <input
                        type="text"
                        value={b.title}
                        onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1">서브 타이틀 설명 문구</label>
                      <input
                        type="text"
                        value={b.subtitle}
                        onChange={(e) => handleFieldChange(idx, 'subtitle', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-grow w-full">
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">배경 이미지 파일 경로 / 링크</label>
                      <input
                        type="text"
                        value={b.imageUrl}
                        onChange={(e) => handleFieldChange(idx, 'imageUrl', e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                        required
                      />
                    </div>
                    {b.imageUrl && (
                      <div className="w-24 h-12 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0 md:mt-5">
                        <img
                          src={getDirectImageUrl(b.imageUrl)}
                          alt="배너 프리뷰"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddBanner}
              className="w-full py-3.5 border-2 border-dashed border-neutral-300 hover:border-neutral-950 text-neutral-600 hover:text-neutral-950 text-xs font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer bg-white"
            >
              <Plus size={15} />
              <span>새로운 이미지 슬라이드 카드 추가</span>
            </button>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-5 py-3 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                배너 변경사항 저장하기
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


// ==========================================
// 4. COMPANY INFO MODAL (Edit company profiles)
// ==========================================
interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyInfo: CompanyInfo;
  onSave: (info: CompanyInfo) => void;
}

export function CompanyInfoModal({ isOpen, onClose, companyInfo, onSave }: CompanyInfoModalProps) {
  const [cName, setCName] = useState('');
  const [cEnglishName, setCEnglishName] = useState('');
  const [cRepresentative, setCRepresentative] = useState('');
  const [cTel, setCTel] = useState('');
  const [cFax, setCFax] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cFactoryAddress, setCFactoryAddress] = useState('');
  const [cMailOrderNo, setCMailOrderNo] = useState('');
  const [cWebsite, setCWebsite] = useState('');
  const [cAboutUsTitle, setCAboutUsTitle] = useState('');
  const [cAboutUsText, setCAboutUsText] = useState('');
  const [cAboutUsImage, setCAboutUsImage] = useState('');
  const [cMapAddress, setCMapAddress] = useState('');
  const [cAsAlertEmail, setCAsAlertEmail] = useState('');
  const [cCatalogAlertEmail, setCCatalogAlertEmail] = useState('');
  const [cNarajangterMarkUrl, setCNarajangterMarkUrl] = useState('');

  // New states for interactive History & Directions editing
  const [cHistoryList, setCHistoryList] = useState<any[]>([]);
  const [cCarDirections, setCCarDirections] = useState('');
  const [cSubwayDirections, setCSubwayDirections] = useState('');
  const [cBusDirections, setCBusDirections] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'basic' | 'philosophy' | 'history' | 'directions'>('basic');

  useEffect(() => {
    if (companyInfo) {
      setCName(companyInfo.name);
      setCEnglishName(companyInfo.englishName);
      setCRepresentative(companyInfo.representative);
      setCTel(companyInfo.tel);
      setCFax(companyInfo.fax || '');
      setCEmail(companyInfo.email);
      setCAsAlertEmail(companyInfo.asAlertEmail || companyInfo.email || 'dadmdesign@naver.com');
      setCCatalogAlertEmail(companyInfo.catalogAlertEmail || companyInfo.email || 'dadmdesign@naver.com');
      setCAddress(companyInfo.address);
      setCFactoryAddress(companyInfo.factoryAddress || '');
      setCMailOrderNo(companyInfo.mailOrderNo || '');
      setCWebsite(companyInfo.website || 'http://www.dadmdesign.co.kr');
      setCAboutUsTitle(companyInfo.aboutUsTitle);
      setCAboutUsText(companyInfo.aboutUsText);
      setCAboutUsImage(companyInfo.aboutUsImage || '/src/assets/images/street_bench_1783302667162.jpg');
      setCNarajangterMarkUrl(companyInfo.narajangterMarkUrl || '');
      setCMapAddress(companyInfo.mapAddress || '');

      setCHistoryList(companyInfo.historyList ? JSON.parse(JSON.stringify(companyInfo.historyList)) : []);
      setCCarDirections(companyInfo.carDirections || '');
      setCSubwayDirections(companyInfo.subwayDirections || '');
      setCBusDirections(companyInfo.busDirections || '');
    }
  }, [companyInfo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CompanyInfo = {
      name: cName.trim(),
      englishName: cEnglishName.trim(),
      representative: cRepresentative.trim(),
      tel: cTel.trim(),
      fax: cFax.trim(),
      email: cEmail.trim(),
      address: cAddress.trim(),
      factoryAddress: cFactoryAddress.trim(),
      businessNo: '', // 사업자등록번호 삭제
      mailOrderNo: cMailOrderNo.trim(),
      website: cWebsite.trim(),
      aboutUsTitle: cAboutUsTitle.trim(),
      aboutUsText: cAboutUsText.trim(),
      aboutUsImage: cAboutUsImage.trim(),
      mapAddress: cMapAddress.trim() || cAddress.trim(),
      asAlertEmail: cAsAlertEmail.trim(),
      catalogAlertEmail: cCatalogAlertEmail.trim(),
      narajangterMarkUrl: cNarajangterMarkUrl.trim(),
      historyList: cHistoryList,
      carDirections: cCarDirections.trim(),
      subwayDirections: cSubwayDirections.trim(),
      busDirections: cBusDirections.trim()
    };
    onSave(updated);
    alert('회사 소개 및 하단 고시정보가 업데이트되었습니다.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-6 shrink-0">
            <div>
              <h2 className="text-lg font-black text-neutral-900 font-sans tracking-tight">
                회사 정보 및 소개글 통합 제어소
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                회사의 주소, 경영이념, 연혁 및 오시는 길 등 모든 소개 데이터를 팝업 형태로 즉각 수정합니다.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sub Tab Navigation */}
          <div className="flex border-b border-neutral-100 px-6 bg-neutral-50 shrink-0 overflow-x-auto whitespace-nowrap">
            <button
              type="button"
              onClick={() => setActiveSubTab('basic')}
              className={`py-3 px-4 text-xs font-sans font-extrabold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'basic' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              기본 정보 & 하단 고시
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('philosophy')}
              className={`py-3 px-4 text-xs font-sans font-extrabold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'philosophy' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              경영이념 & 인사말
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('history')}
              className={`py-3 px-4 text-xs font-sans font-extrabold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'history' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              회사연혁 설정
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('directions')}
              className={`py-3 px-4 text-xs font-sans font-extrabold border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'directions' ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              오시는 길 안내
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow flex flex-col justify-between">
            <div className="flex-grow space-y-6">
              
              {/* TAB 1: BASIC INFO */}
              {activeSubTab === 'basic' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">회사명</label>
                    <input
                      type="text"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">대표이사명</label>
                      <input
                        type="text"
                        value={cRepresentative}
                        onChange={(e) => setCRepresentative(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">대표 전화번호</label>
                      <input
                        type="text"
                        value={cTel}
                        onChange={(e) => setCTel(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">대표 팩스번호</label>
                      <input
                        type="text"
                        value={cFax}
                        onChange={(e) => setCFax(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">공식 이메일 주소</label>
                    <input
                      type="email"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">A/S 하자접수 수신 이메일</label>
                      <input
                        type="email"
                        value={cAsAlertEmail}
                        onChange={(e) => setCAsAlertEmail(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">카탈로그 신청 수신 이메일</label>
                      <input
                        type="email"
                        value={cCatalogAlertEmail}
                        onChange={(e) => setCCatalogAlertEmail(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-neutral-100">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">본사 소재지 주소</label>
                      <input
                        type="text"
                        value={cAddress}
                        onChange={(e) => setCAddress(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">공장 소재지 주소 (선택)</label>
                      <input
                        type="text"
                        value={cFactoryAddress}
                        onChange={(e) => setCFactoryAddress(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">공식 홈페이지 주소 (선택)</label>
                      <input
                        type="text"
                        value={cWebsite}
                        onChange={(e) => setCWebsite(e.target.value)}
                        placeholder="예: http://www.dadmdesign.co.kr"
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHILOSOPHY & GREETINGS */}
              {activeSubTab === 'philosophy' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">경영이념 / 인사말 캐치프레이즈 타이틀</label>
                    <input
                      type="text"
                      value={cAboutUsTitle}
                      onChange={(e) => setCAboutUsTitle(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">인사말 본문 내용 (줄바꿈 자동 반영)</label>
                    <textarea
                      rows={6}
                      value={cAboutUsText}
                      onChange={(e) => setCAboutUsText(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 resize-y leading-relaxed font-sans"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                        <span>회사소개 대표 이미지 URL</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded text-[9px] uppercase font-sans">Synology NAS 지원</span>
                      </label>
                      <input
                        type="text"
                        value={cAboutUsImage}
                        onChange={(e) => setCAboutUsImage(e.target.value)}
                        placeholder="공유 이미지 주소 또는 로컬 파일 경로"
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                        required
                      />
                    </div>
                    <div className="md:col-span-1 bg-neutral-50 p-2 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-neutral-400 mb-1 block w-full text-center uppercase">미리보기</span>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                        {cAboutUsImage ? (
                          <img
                            src={getDirectImageUrl(cAboutUsImage)}
                            alt="About Us"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-about/300/150';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">이미지 없음</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                        <span>조달제품용 나라장터 마크 이미지 URL (선택)</span>
                      </label>
                      <input
                        type="text"
                        value={cNarajangterMarkUrl}
                        onChange={(e) => setCNarajangterMarkUrl(e.target.value)}
                        placeholder="공유 이미지 주소 또는 로컬 파일 경로"
                        className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                      />
                      <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                        조달 등록 품목의 이미지 좌측 하단에 오버레이로 표시될 나라장터 마크를 지정합니다. 
                        미지정 시 기본 둥근 태극 무늬 마크가 출력됩니다.
                      </p>
                    </div>
                    <div className="md:col-span-1 bg-neutral-50 p-2 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-neutral-400 mb-1 block w-full text-center uppercase">마크 프리뷰</span>
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 bg-white shadow-sm p-1.5 flex items-center justify-center">
                        {cNarajangterMarkUrl ? (
                          <img
                            src={getDirectImageUrl(cNarajangterMarkUrl)}
                            alt="나라장터 마크"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-mark/50/50';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path 
                              d="M 50 14 C 64 14 78 22 84 35 C 90 48 88 64 80 74 C 77 78 72 82 67 84 C 68 76 65 67 59 60 C 53 53 44 49 35 48 C 30 47.5 25 48 20 49 C 16 38 21 26 31 19 C 37 15 44 14 50 14 Z" 
                              fill="#cd2e3a" 
                            />
                            <path 
                              d="M 50 86 C 36 86 22 78 16 65 C 10 52 12 36 20 26 C 23 22 28 18 33 16 C 32 24 35 33 41 40 C 47 47 56 51 65 52 C 70 52.5 75 52 80 51 C 84 62 79 74 69 81 C 63 85 56 86 50 86 Z" 
                              fill="#0047a0" 
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPANY HISTORY (DYNAMIC EDITING) */}
              {activeSubTab === 'history' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-2xl border border-neutral-150">
                    <span className="text-[11px] text-neutral-500 font-sans">회사연혁 연도별 성장 스토리를 추가하거나 수정/정렬할 수 있습니다.</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newYear = new Date().getFullYear().toString();
                        setCHistoryList([
                          {
                            id: 'h-' + Date.now(),
                            year: newYear,
                            yearShort: newYear.slice(-2),
                            badge: 'New Milestone',
                            title: '새로운 성장 소식 기재',
                            bullets: ['추진 상세 내용을 적어주세요.']
                          },
                          ...cHistoryList
                        ]);
                      }}
                      className="bg-neutral-900 hover:bg-neutral-950 text-white text-[10px] font-sans font-extrabold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                    >
                      <Plus size={11} />
                      <span>새 연도 연혁 추가</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                    {cHistoryList.length === 0 ? (
                      <div className="text-center py-12 text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
                        등록된 회사연혁이 없습니다. 우측 상단의 추가 버튼을 이용해 첫 기록을 생성해주세요.
                      </div>
                    ) : (
                      cHistoryList.map((item, idx) => (
                        <div key={item.id || idx} className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50 relative space-y-3.5 shadow-sm transition-all hover:border-neutral-350">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('정말로 이 연혁 기록을 제거하시겠습니까?')) {
                                setCHistoryList(cHistoryList.filter((_, i) => i !== idx));
                              }
                            }}
                            className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-lg border border-neutral-200 transition-colors cursor-pointer"
                            title="이 연도 연혁 삭제"
                          >
                            <Trash2 size={13} />
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="sm:col-span-1">
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">연도 (4자리)</label>
                              <input
                                type="text"
                                value={item.year}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = [...cHistoryList];
                                  updated[idx] = { 
                                    ...item, 
                                    year: val, 
                                    yearShort: val.length >= 2 ? val.slice(-2) : val 
                                  };
                                  setCHistoryList(updated);
                                }}
                                className="w-full text-xs font-sans font-bold px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-950 text-neutral-800"
                                required
                              />
                            </div>
                            <div className="sm:col-span-1">
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">영문 태그 배지</label>
                              <input
                                type="text"
                                value={item.badge}
                                onChange={(e) => {
                                  const updated = [...cHistoryList];
                                  updated[idx] = { ...item, badge: e.target.value };
                                  setCHistoryList(updated);
                                }}
                                className="w-full text-xs font-sans px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-950 text-neutral-800"
                                required
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">한글 주요 핵심 성과</label>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...cHistoryList];
                                  updated[idx] = { ...item, title: e.target.value };
                                  setCHistoryList(updated);
                                }}
                                className="w-full text-xs font-sans font-bold px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-950 text-neutral-800"
                                required
                              />
                            </div>
                          </div>

                          {/* Bullet Points */}
                          <div className="space-y-1.5 pt-2 border-t border-neutral-100/60">
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide">세부 활동 기록 목록</label>
                            {item.bullets.map((bullet: string, bulletIdx: number) => (
                              <div key={bulletIdx} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updatedBullets = [...item.bullets];
                                    updatedBullets[bulletIdx] = e.target.value;
                                    const updated = [...cHistoryList];
                                    updated[idx] = { ...item, bullets: updatedBullets };
                                    setCHistoryList(updated);
                                  }}
                                  className="flex-grow text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-950"
                                  placeholder="세부 성과나 인증, 허가 및 출원 등의 상세 사항을 기록해주세요."
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedBullets = item.bullets.filter((_: any, bi: number) => bi !== bulletIdx);
                                    const updated = [...cHistoryList];
                                    updated[idx] = { ...item, bullets: updatedBullets };
                                    setCHistoryList(updated);
                                  }}
                                  className="text-neutral-400 hover:text-red-500 p-1.5 bg-white hover:bg-neutral-100 rounded-lg border border-neutral-200 cursor-pointer"
                                  title="목록에서 삭제"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedBullets = [...item.bullets, ''];
                                const updated = [...cHistoryList];
                                updated[idx] = { ...item, bullets: updatedBullets };
                                setCHistoryList(updated);
                              }}
                              className="inline-flex items-center text-[10px] font-sans font-bold text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all mt-1"
                            >
                              + 세부활동 세부내용 한 줄 추가
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: DIRECTIONS & TRANSIT */}
              {activeSubTab === 'directions' && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">본사</label>
                    <input
                      type="text"
                      value={cAddress}
                      onChange={(e) => setCAddress(e.target.value)}
                      placeholder="본사 도로명 주소 입력"
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">공장</label>
                    <input
                      type="text"
                      value={cFactoryAddress}
                      onChange={(e) => setCFactoryAddress(e.target.value)}
                      placeholder="제조 공장 도로명 주소 입력"
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>


                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-5 border-t border-neutral-100 flex justify-end space-x-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-5 py-3 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                {activeSubTab === 'history' ? '모든 연혁 및 정보 저장' : '설정된 모든 정보 저장'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ==========================================
// 5. CONSTRUCTION PROJECT FORM MODAL (Add / Edit Construction Case)
// ==========================================
interface ConstructionProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ConstructionProject | null;
  onSave: (savedProject: ConstructionProject) => void;
}

export function ConstructionProjectModal({ isOpen, onClose, project, onSave }: ConstructionProjectModalProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [items, setItems] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/src/assets/images/street_bench_1783302667162.jpg');
  const [tag, setTag] = useState('공동주택 조경');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setLocation(project.location);
      setPeriod(project.period);
      setItems(project.items);
      setDescription(project.description);
      setImage(project.image);
      setTag(project.tag);
    } else {
      setTitle('');
      setLocation('');
      setPeriod('');
      setItems('');
      setDescription('');
      setImage('/src/assets/images/street_bench_1783302667162.jpg');
      setTag('공동주택 조경');
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      alert('공사명과 공사위치는 필수 입력값입니다.');
      return;
    }

    const saved: ConstructionProject = {
      id: project ? project.id : `proj-${Date.now()}`,
      title: title.trim(),
      location: location.trim(),
      period: period.trim() || `${new Date().getFullYear()}.${String(new Date().getMonth()+1).padStart(2, '0')}`,
      items: items.trim() || '야외용 가로시설물 설치',
      description: description.trim(),
      image,
      tag: tag.trim() || '조경 시설물 시공'
    };

    onSave(saved);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-100"
        >
          {/* Header */}
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="bg-neutral-900 p-2 rounded-xl text-white">
                <Building size={16} />
              </div>
              <div>
                <h2 className="text-base font-black text-neutral-900 font-sans tracking-tight">
                  {project ? '시공 사례 실적 수정' : '새 시공 사례 실적 추가'}
                </h2>
                <p className="text-[10px] text-neutral-400 font-sans mt-0.5">건설사업 페이지에 소개될 정식 포트폴리오 정보 등록</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-left font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">실적 및 공사명</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 용인 역북 푸르지오 신축 단지 조경 시설 시공"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">분류 태그 (예: 공동주택 조경, 도시근린공원)</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="예: 공동주택 조경"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">공사 기간</label>
                <input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="예: 2026.04 - 2026.05"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">공사 위치 (소재지)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 경기도 용인시 처인구"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">납품 품목 요약</label>
                <input
                  type="text"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="예: 디자인 등벤치 20대, 평벤치 15대"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5">시공 실적 상세 설명</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="해당 현장의 구체적인 설계 사양, 특징, 보증 등을 상세히 적어주세요."
                className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 resize-y leading-relaxed"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                <span>대표 시공 사진 (선택 및 직접 입력)</span>
                <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded text-[9px] uppercase font-sans">Synology NAS 지원</span>
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { path: '/src/assets/images/street_bench_1783302667162.jpg', label: '벤치 시공' },
                  { path: '/src/assets/images/street_pergola_1783302650051.jpg', label: '파고라 시공' },
                  { path: '/src/assets/images/street_planter_1783302680596.jpg', label: '플랜터 시공' },
                  { path: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', label: '공사현장 일반' }
                ].map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setImage(preset.path)}
                    className={`p-1 border rounded-lg overflow-hidden text-center transition-all flex flex-col justify-between h-20 bg-neutral-50 cursor-pointer ${
                      image === preset.path ? 'border-neutral-950 ring-2 ring-neutral-950/20' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img src={preset.path} className="w-full h-12 object-cover rounded-md" alt="" />
                    <span className="text-[9px] font-bold text-neutral-600 truncate max-w-full block mt-1">{preset.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-center bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 mb-2">
                {image && (
                  <div className="w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                    <img
                      src={getDirectImageUrl(image)}
                      alt="시공 사진 미리보기"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-construction/200/200';
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="이미지 파일 경로 또는 외부 이미지 URL (시놀로지 NAS 공유링크도 가능)"
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-5 py-3 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                {project ? '수정 완료 및 저장' : '새 시공 실적 등록'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface HomeSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeSectionInfo: HomeSectionInfo;
  onSave: (savedInfo: HomeSectionInfo) => void;
}

export function HomeSectionModal({ isOpen, onClose, homeSectionInfo, onSave }: HomeSectionModalProps) {
  const [slogan, setSlogan] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [point1Title, setPoint1Title] = useState('');
  const [point1Text, setPoint1Text] = useState('');
  const [point2Title, setPoint2Title] = useState('');
  const [point2Text, setPoint2Text] = useState('');
  const [point3Title, setPoint3Title] = useState('');
  const [point3Text, setPoint3Text] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageSubtitle, setImageSubtitle] = useState('');
  const [catShowcaseSlogan, setCatShowcaseSlogan] = useState('');
  const [catShowcaseTitle, setCatShowcaseTitle] = useState('');
  const [featuredSlogan, setFeaturedSlogan] = useState('');
  const [featuredTitle, setFeaturedTitle] = useState('');
  const [procurementAutoPlayInterval, setProcurementAutoPlayInterval] = useState(2);

  useEffect(() => {
    if (homeSectionInfo) {
      setSlogan(homeSectionInfo.slogan);
      setTitle(homeSectionInfo.title);
      setDescription(homeSectionInfo.description);
      setPoint1Title(homeSectionInfo.point1Title);
      setPoint1Text(homeSectionInfo.point1Text);
      setPoint2Title(homeSectionInfo.point2Title);
      setPoint2Text(homeSectionInfo.point2Text);
      setPoint3Title(homeSectionInfo.point3Title);
      setPoint3Text(homeSectionInfo.point3Text);
      setImageUrl(homeSectionInfo.imageUrl);
      setImageTitle(homeSectionInfo.imageTitle);
      setImageSubtitle(homeSectionInfo.imageSubtitle);
      setCatShowcaseSlogan(homeSectionInfo.catShowcaseSlogan || 'DADMDESIGN Collections');
      setCatShowcaseTitle(homeSectionInfo.catShowcaseTitle || '공간의 격을 높이는 가로 시설물 제품군');
      setFeaturedSlogan(homeSectionInfo.featuredSlogan || 'Featured Products');
      setFeaturedTitle(homeSectionInfo.featuredTitle || '다듬디자인 시그니처 조달 우수제품');
      setProcurementAutoPlayInterval(homeSectionInfo.procurementAutoPlayInterval ?? 2);
    }
  }, [homeSectionInfo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HomeSectionInfo = {
      slogan: slogan.trim(),
      title: title.trim(),
      description: description.trim(),
      point1Title: point1Title.trim(),
      point1Text: point1Text.trim(),
      point2Title: point2Title.trim(),
      point2Text: point2Text.trim(),
      point3Title: point3Title.trim(),
      point3Text: point3Text.trim(),
      imageUrl: imageUrl.trim(),
      imageTitle: imageTitle.trim(),
      imageSubtitle: imageSubtitle.trim(),
      catShowcaseSlogan: catShowcaseSlogan.trim(),
      catShowcaseTitle: catShowcaseTitle.trim(),
      featuredSlogan: featuredSlogan.trim(),
      featuredTitle: featuredTitle.trim(),
      procurementAutoPlayInterval: Number(procurementAutoPlayInterval) || 2,
    };
    onSave(updated);
    alert('메인 소개문구 및 이미지가 업데이트되었습니다.');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl border border-neutral-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 p-6 shrink-0">
            <div>
              <h2 className="text-lg font-black text-neutral-900 font-sans tracking-tight">
                메인화면 소개문구 및 이미지 제어소
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                메인화면 3번째 영역인 경쟁력 요약 정보, 슬로건, 특징 포인트 및 우측 대표 이미지를 직접 수정합니다.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
            {/* Section Headers Editing */}
            <div className="space-y-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-100/80">
              <h3 className="text-xs font-bold text-neutral-900 tracking-wider uppercase flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                0. 메인페이지 각 코너 타이틀 & 슬로건 개별 편집
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Showcase Header */}
                <div className="bg-white p-3.5 rounded-xl border border-neutral-150/60 space-y-3">
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">가로시설물 제품군 영역 (카테고리 쇼케이스)</span>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">소제목 (Slogan)</label>
                    <input
                      type="text"
                      value={catShowcaseSlogan}
                      onChange={(e) => setCatShowcaseSlogan(e.target.value)}
                      placeholder="예: DADMDESIGN Collections"
                      className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">메인 타이틀 (Title)</label>
                    <input
                      type="text"
                      value={catShowcaseTitle}
                      onChange={(e) => setCatShowcaseTitle(e.target.value)}
                      placeholder="예: 공간의 격을 높이는 가로 시설물 제품군"
                      className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>
                </div>

                {/* Featured Products Header */}
                <div className="bg-white p-3.5 rounded-xl border border-neutral-150/60 space-y-3">
                  <span className="text-[10px] font-bold text-neutral-400 block uppercase">시그니처 조달 우수제품 영역 (피처드 슬라이더)</span>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">소제목 (Slogan)</label>
                    <input
                      type="text"
                      value={featuredSlogan}
                      onChange={(e) => setFeaturedSlogan(e.target.value)}
                      placeholder="예: Featured Products"
                      className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">메인 타이틀 (Title)</label>
                    <input
                      type="text"
                      value={featuredTitle}
                      onChange={(e) => setFeaturedTitle(e.target.value)}
                      placeholder="예: 다듬디자인 시그니처 조달 우수제품"
                      className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1 flex items-center justify-between">
                      <span>자동 롤링 재생 시간 (초)</span>
                      <span className="text-[9px] text-amber-600 font-bold">현재: {procurementAutoPlayInterval}초 간격</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={procurementAutoPlayInterval}
                      onChange={(e) => setProcurementAutoPlayInterval(Math.max(1, Number(e.target.value)))}
                      className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                      required
                    />
                    <p className="text-[9px] text-neutral-400 mt-1 leading-relaxed">
                      메인페이지의 시그니처 조달 우수제품 슬라이더가 자동으로 회전하는 시간 간격입니다 (최소 1초).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 tracking-wider uppercase">1. 상단 타이틀 & 설명</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">상단 슬로건 / 소제목</label>
                  <input
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="예: DADMDESIGN 경쟁력"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1.5">메인 타이틀 헤드라인</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 최상의 가로경관을 다듬다"
                    className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-sans font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1.5">대표 설명 본문</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="회사 경쟁력에 대한 전반적인 소개말을 입력해주세요."
                  className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 resize-y leading-relaxed"
                  required
                ></textarea>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 tracking-wider uppercase">2. 세부 경쟁력 포인트 (3개)</h3>
              
              {/* Point 1 */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-3">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">포인트 01</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 1 제목</label>
                    <input
                      type="text"
                      value={point1Title}
                      onChange={(e) => setPoint1Title(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 1 본문 설명</label>
                    <input
                      type="text"
                      value={point1Text}
                      onChange={(e) => setPoint1Text(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Point 2 */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-3">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">포인트 02</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 2 제목</label>
                    <input
                      type="text"
                      value={point2Title}
                      onChange={(e) => setPoint2Title(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 2 본문 설명</label>
                    <input
                      type="text"
                      value={point2Text}
                      onChange={(e) => setPoint2Text(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Point 3 */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/60 space-y-3">
                <span className="text-[10px] font-mono font-bold text-amber-500 uppercase block">포인트 03</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 3 제목</label>
                    <input
                      type="text"
                      value={point3Title}
                      onChange={(e) => setPoint3Title(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5">포인트 3 본문 설명</label>
                    <input
                      type="text"
                      value={point3Text}
                      onChange={(e) => setPoint3Text(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 border border-neutral-200 bg-white rounded-xl focus:outline-none focus:border-neutral-950"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 tracking-wider uppercase">3. 우측 대표 이미지 설정</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                      <span>이미지 URL 주소</span>
                      <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded text-[9px] uppercase font-sans">Synology NAS 지원</span>
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="이미지 URL 주소 또는 시놀로지 공유링크 (gofile.me/...)"
                      className="w-full text-xs px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">오버레이 배너 대제목</label>
                      <input
                        type="text"
                        value={imageTitle}
                        onChange={(e) => setImageTitle(e.target.value)}
                        placeholder="예: DADMDESIGN Signature"
                        className="w-full text-xs px-3.5 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5">오버레이 배너 소제목</label>
                      <input
                        type="text"
                        value={imageSubtitle}
                        onChange={(e) => setImageSubtitle(e.target.value)}
                        placeholder="예: 공공디자인 전문회사"
                        className="w-full text-xs px-3.5 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-neutral-400 mb-1 block w-full text-center uppercase">미리보기</span>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                    {imageUrl ? (
                      <img
                        src={getDirectImageUrl(imageUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback-home/300/150';
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">이미지 없음</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-5 py-3 rounded-xl border border-neutral-200 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                소개 영역 수정 및 저장
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
