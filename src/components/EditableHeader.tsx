import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { PageHeaders } from '../types';

interface EditableHeaderProps {
  pageKey: keyof PageHeaders;
  pageHeaders: PageHeaders;
  isAdminLoggedIn: boolean;
  onUpdateHeaders: (updated: PageHeaders) => void;
  extraTitleContent?: React.ReactNode;
  icon?: React.ReactNode;
  centered?: boolean;
}

export default function EditableHeader({
  pageKey,
  pageHeaders,
  isAdminLoggedIn,
  onUpdateHeaders,
  extraTitleContent,
  icon,
  centered = false
}: EditableHeaderProps) {
  const header = pageHeaders[pageKey];
  const [isEditing, setIsEditing] = useState(false);
  const [slogan, setSlogan] = useState(header?.slogan || '');
  const [title, setTitle] = useState(header?.title || '');
  const [description, setDescription] = useState(header?.description || '');

  // Reset inputs when headers change or modal toggles
  React.useEffect(() => {
    if (header) {
      setSlogan(header.slogan);
      setTitle(header.title);
      setDescription(header.description);
    }
  }, [header, isEditing]);

  const handleSave = () => {
    const updated = {
      ...pageHeaders,
      [pageKey]: {
        slogan: header?.slogan || '',
        title: title.trim(),
        description: description.trim()
      }
    };
    onUpdateHeaders(updated);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (header) {
      setTitle(header.title);
      setDescription(header.description);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8 w-full text-left shadow-sm ${centered ? 'max-w-xl mx-auto' : ''}`}>
        <h3 className="text-xs font-black text-neutral-800 mb-4 flex items-center space-x-1.5 uppercase tracking-wider">
          <Edit3 size={14} className="text-amber-500" />
          <span>페이지 상단부 텍스트 수정 ({
            pageKey === 'about' ? '회사 소개' :
            pageKey === 'procurement' ? '조달등록 제품' :
            pageKey === 'products' ? '제품소개' :
            pageKey === 'inquiry' ? '고객지원' :
            pageKey === 'construction' ? '건설사업' :
            pageKey === 'catalog' ? '카탈로그 신청' :
            pageKey === 'as' ? 'A/S 하자접수' : pageKey
          })</span>
        </h3>
        <div className="space-y-4 font-sans text-xs">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 mb-1">메인 타이틀 (Title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 mb-1">설명 문구 (Description)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 leading-relaxed font-medium"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleCancel}
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-sans font-bold text-[11px] px-3.5 py-2 rounded-lg cursor-pointer flex items-center space-x-1 transition-all"
            >
              <X size={12} />
              <span>취소</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-[11px] px-3.5 py-2 rounded-lg cursor-pointer flex items-center space-x-1 transition-all"
            >
              <Check size={12} />
              <span>저장하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group w-full ${centered ? 'text-center' : 'text-center sm:text-left'}`}>
      {isAdminLoggedIn && (
        <div className={`absolute z-20 opacity-100 transition-opacity ${centered ? '-top-6 left-1/2 -translate-x-1/2' : '-top-2 right-0'}`}>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-md flex items-center space-x-1 cursor-pointer transition-all hover:scale-105"
          >
            <Edit3 size={12} />
            <span>상단 텍스트 수정</span>
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h1 className={`text-2xl sm:text-3xl font-black text-neutral-950 font-sans tracking-tight mt-1.5 flex flex-wrap items-center gap-1.5 ${centered ? 'justify-center' : 'justify-center sm:justify-start'}`}>
          {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
          <span>{header?.title}</span>
          {extraTitleContent}
        </h1>
        
        <p className={`text-xs sm:text-sm text-neutral-400 font-sans mt-2 max-w-xl leading-relaxed whitespace-pre-line ${centered ? 'mx-auto' : 'mx-auto sm:mx-0'}`}>
          {header?.description}
        </p>
      </div>
    </div>
  );
}
