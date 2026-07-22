import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Download, FileDown, MessageSquare, Edit3, Trash2, ShieldAlert } from 'lucide-react';
import { Product, Category, CompanyInfo } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';

interface ProductDetailProps {
  product: Product;
  categories: Category[];
  companyInfo: CompanyInfo;
  onBack: () => void;
  onInquiry?: (productName: string, productId: string) => void;
  onDelete?: (productId: string) => void;
  onEdit?: (product: Product) => void;
  isAdminLoggedIn?: boolean;
}

export default function ProductDetail({
  product,
  categories,
  companyInfo,
  onBack,
  onInquiry,
  onDelete,
  onEdit,
  isAdminLoggedIn = false
}: ProductDetailProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || '조경시설물';

  // Currency utility
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' })
      .format(value)
      .replace('₩', '') + ' 원';
  };

  const handleCadDownload = () => {
    alert(`[도면 다운로드] 모델명: ${product.name}의 CAD 도면 파일(${product.drawingNo || 'DADM-CAD-01'}.dwg) 다운로드를 시작합니다.`);
  };

  const handlePdfDownload = () => {
    alert(`[카탈로그 다운로드] 모델명: ${product.name}의 상세 기술사양 PDF 카탈로그 파일을 다운로드합니다.`);
  };

  const handleConfirmDelete = () => {
    if (window.confirm('정말로 이 제품을 카탈로그에서 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      onDelete?.(product.id);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10" id={`product-detail-view-${product.id}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-neutral-500 hover:text-neutral-900 text-sm font-sans font-medium transition-colors cursor-pointer"
            id="detail-back-btn"
          >
            <ArrowLeft size={16} />
            <span>이전 목록으로</span>
          </button>
          
          <div className="flex items-center space-x-2 text-xs font-sans text-neutral-400">
            <span>Home</span>
            <ChevronRight size={12} />
            <span>제품소개</span>
            <ChevronRight size={12} />
            <span className="text-neutral-900 font-medium">{categoryName}</span>
          </div>
        </div>

        {/* Top Split Section: Large Images & Technical Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Images Gallery Block (Left 7-columns) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Huge Main Image Display */}
            <div className="relative aspect-4/3 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-100">
              <img
                src={getDirectImageUrl(product.images[activeImageIdx])}
                alt={product.name}
                className="w-full h-full object-cover animate-fade-in"
                referrerPolicy="no-referrer"
                id="detail-main-img"
              />
              {product.isProcurement && (
                <div className="absolute bottom-3 left-3 z-10 w-10 h-10 bg-white/95 rounded-full p-2 shadow-md flex items-center justify-center border border-neutral-200">
                  {companyInfo.narajangterMarkUrl ? (
                    <img
                      src={getDirectImageUrl(companyInfo.narajangterMarkUrl)}
                      alt="나라장터 마크"
                      className="w-full h-full object-contain rounded-full"
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
              )}
            </div>

            {/* Sub-thumbnails (Exactly 3 slots, aligned matching aspect ratio, blends with background if empty) */}
            <div className="grid grid-cols-3 gap-3" id="detail-thumbnails-row">
              {[0, 1, 2].map((idx) => {
                const imgUrl = product.images?.[idx];
                if (imgUrl) {
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-full aspect-4/3 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIdx === idx 
                          ? 'border-neutral-950 shadow-sm scale-[0.98]' 
                          : 'border-neutral-200/80 hover:border-neutral-400 bg-neutral-50'
                      }`}
                    >
                      <img
                        src={getDirectImageUrl(imgUrl)}
                        alt={`${product.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                } else {
                  return (
                    <div
                      key={idx}
                      className="w-full aspect-4/3 rounded-lg bg-white border border-transparent"
                    />
                  );
                }
              })}
            </div>
          </div>

          {/* Technical Specifications Table Block (Right 5-columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Product Category and Title */}
              <div className="mb-4">
                <span className="text-xs font-sans font-semibold tracking-wider text-neutral-400 uppercase bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">
                  {categoryName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-sans tracking-tight mt-3">
                  {product.name}
                </h1>
                {product.featureText && (
                  <p className="text-xs font-sans text-neutral-500 mt-2 italic leading-relaxed">
                    {product.featureText}
                  </p>
                )}
              </div>

              {/* Specification Table (Styled exactly like Urbanscape product specification table) */}
              <div className="border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50 shadow-sm mt-6">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <tbody>
                    <tr className="border-b border-neutral-200/60">
                      <td className="w-1/3 bg-neutral-100/80 px-4 py-3.5 text-neutral-500 font-bold">모델명</td>
                      <td className="px-4 py-3.5 text-neutral-900 font-mono font-bold">{product.name}</td>
                    </tr>
                    <tr className="border-b border-neutral-200/60">
                      <td className="bg-neutral-100/80 px-4 py-3.5 text-neutral-500 font-bold">조달식별번호</td>
                      <td className="px-4 py-3.5 text-neutral-900 font-mono font-semibold">{product.identificationNo}</td>
                    </tr>
                    <tr className="border-b border-neutral-200/60">
                      <td className="bg-neutral-100/80 px-4 py-3.5 text-neutral-500 font-bold">제품 규격</td>
                      <td className="px-4 py-3.5 text-neutral-700 font-medium leading-relaxed">{product.size}</td>
                    </tr>
                    <tr className="border-b border-neutral-200/60">
                      <td className="bg-neutral-100/80 px-4 py-3.5 text-neutral-500 font-bold">대표 재질</td>
                      <td className="px-4 py-3.5 text-neutral-700">{product.material}</td>
                    </tr>
                    <tr>
                      <td className="bg-neutral-100/80 px-4 py-3.5 text-neutral-500 font-bold">판매 금액</td>
                      <td className="px-4 py-3.5 text-neutral-950 font-mono font-extrabold text-sm sm:text-base tracking-tight">
                        {formatPrice(product.price)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 설계자료 다운로드 버튼 (판매 금액 하단) */}
              {product.designMaterialEnabled && (
                <div className="mt-5" id={`design-material-download-section-${product.id}`}>
                  <a
                    href={product.designMaterialUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.015] active:scale-[0.985] transition-all duration-250 flex items-center justify-center space-x-3 group cursor-pointer border border-neutral-950"
                  >
                    <Download size={18} className="text-white group-hover:translate-y-0.5 transition-transform duration-200" />
                    <span className="font-sans font-black text-sm tracking-wide text-white">
                      설계자료 다운로드
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Actions Sidebar Box */}
            <div className="space-y-4 mt-8">
              {/* Admin Direct Management Controls */}
              {isAdminLoggedIn && (
                <div className="p-4 bg-amber-50/50 border border-amber-200/70 rounded-xl space-y-3">
                  <div className="flex items-center space-x-1.5 text-amber-800 text-[11px] font-extrabold">
                    <ShieldAlert size={14} />
                    <span>실시간 제품 데이터 직접 제어반</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={() => onEdit?.(product)}
                      className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 font-sans font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>제품 수정</span>
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-100 hover:border-red-600 font-sans font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>제품 삭제</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
