import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle, 
  PhoneCall, 
  Mail, 
  Clock, 
  HelpCircle, 
  FileText, 
  Calendar, 
  Download, 
  Maximize2, 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Wrench, 
  ShieldCheck, 
  FileDown,
  Edit2
} from 'lucide-react';
import { Product, Inquiry, PriceData, CompanyInfo, PageHeaders } from '../types';
import { defaultPriceData } from '../data/defaultData';
import { getDirectImageUrl } from '../utils/imageUtils';
import { motion, AnimatePresence } from 'motion/react';
import EditableHeader from './EditableHeader';

interface InquiryFormProps {
  products: Product[];
  initialProductName?: string;
  initialProductId?: string;
  onAddInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  isAdminLoggedIn?: boolean;
  activeTab?: 'catalog' | 'price' | 'as';
  setActiveTab?: (tab: 'catalog' | 'price' | 'as') => void;
  companyInfo?: CompanyInfo;
  pageHeaders?: PageHeaders;
  onUpdatePageHeaders?: (updated: PageHeaders) => void;
}

export default function InquiryForm({
  products,
  initialProductName = '',
  initialProductId = '',
  onAddInquiry,
  isAdminLoggedIn = false,
  activeTab: externalTab,
  setActiveTab: setExternalTab,
  companyInfo,
  pageHeaders,
  onUpdatePageHeaders
}: InquiryFormProps) {
  // Local Tab state if not controlled externally
  const [localTab, setLocalTab] = useState<'catalog' | 'price' | 'as'>('price');
  const activeTab = externalTab || localTab;
  const setActiveTab = setExternalTab || setLocalTab;

  // Catalog Form State
  const [catName, setCatName] = useState('');
  const [catTel, setCatTel] = useState('');
  const [catEmail, setCatEmail] = useState('');
  const [catCompany, setCatCompany] = useState('');
  const [catMethod, setCatMethod] = useState<'pdf' | 'printed'>('pdf');
  const [catAddress, setCatAddress] = useState('');
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>([
    '2026 다듬디자인 종합 카탈로그'
  ]);
  const [catContent, setCatContent] = useState('');
  
  // A/S Form State
  const [asName, setAsName] = useState('');
  const [asTel, setAsTel] = useState('');
  const [asEmail, setAsEmail] = useState('');
  const [asLocation, setAsLocation] = useState('');
  const [asContent, setAsContent] = useState('');
  const [asAttachedPhoto, setAsAttachedPhoto] = useState<string | null>(null);

  // Common submission status
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [lastAsMailto, setLastAsMailto] = useState('');
  const [isAsSubmitted, setIsAsSubmitted] = useState(false);
  const [lastCatalogMailto, setLastCatalogMailto] = useState('');
  const [isCatalogSubmitted, setIsCatalogSubmitted] = useState(false);

  const resetFormState = () => {
    setSubmitted(false);
    setIsAsSubmitted(false);
    setIsCatalogSubmitted(false);
    setLastAsMailto('');
    setLastCatalogMailto('');
  };

  // Price Data timeline state (with persistence in localStorage)
  const [priceList, setPriceList] = useState<PriceData[]>(() => {
    const saved = localStorage.getItem('dadm_price_data');
    if (saved) {
      try {
        return JSON.parse(saved) as PriceData[];
      } catch (e) {
        return defaultPriceData;
      }
    }
    return defaultPriceData;
  });

  // Save price lists
  useEffect(() => {
    localStorage.setItem('dadm_price_data', JSON.stringify(priceList));
  }, [priceList]);

  // Price Upload Modal State
  const [isUploadingPrice, setIsUploadingPrice] = useState(false);
  const [priceYearMonth, setPriceYearMonth] = useState('');
  const [priceTitle, setPriceTitle] = useState('');
  const [priceDesc, setPriceDesc] = useState('');
  const [priceImg, setPriceImg] = useState('');
  const [priceNasUrl, setPriceNasUrl] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  
  // Lightbox State for Price Images
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Handle Catalog Form Submission
  const handleCatalogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catTel.trim()) {
      alert('성함/업체명 및 연락처는 필수 기재 사항입니다.');
      return;
    }

    const compiledContent = `
[신청 내역]
- 신청인: ${catName} ${catCompany ? `(${catCompany})` : ''}
- 연락처: ${catTel}
- 이메일: ${catEmail || '미기입'}
- 수령 방식: ${catMethod === 'pdf' ? '이메일 PDF 다운로드 링크 수령' : `인쇄본 우편 실물 수령 (${catAddress})`}
- 선택 카탈로그: ${selectedCatalogs.join(', ')}
- 추가 요청 사안: ${catContent || '없음'}
    `.trim();

    onAddInquiry({
      name: catName,
      tel: catTel,
      email: catEmail,
      title: `[카탈로그 신청] ${catName}님의 카탈로그 신청의 건`,
      content: compiledContent
    });

    const catalogTargetEmail = companyInfo?.catalogAlertEmail || companyInfo?.email || 'dadmdesign@naver.com';
    const emailSubject = `[카탈로그 신청] ${catName}님의 카탈로그 신청의 건`;
    const emailBody = `[카탈로그 신청 내역]
-----------------------------
신청인: ${catName} ${catCompany ? `(${catCompany})` : ''}
연락처: ${catTel}
이메일: ${catEmail || '미기입'}
수령 방식: ${catMethod === 'pdf' ? '이메일 PDF 다운로드 링크 수령' : `인쇄본 우편 실물 수령 (${catAddress})`}
선택 카탈로그: ${selectedCatalogs.join(', ')}

추가 요청 사안:
${catContent || '없음'}
-----------------------------
(주)다듬디자인 고객지원 센터 접수 완료 건입니다.`;

    const mailtoUrl = `mailto:${encodeURIComponent(catalogTargetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    setLastCatalogMailto(mailtoUrl);
    setIsCatalogSubmitted(true);

    setSuccessMessage(`카탈로그 신청이 완료되었습니다. 지정된 담당자 메일(${catalogTargetEmail})로 접수 내역 발송을 진행합니다.`);
    setSubmitted(true);

    // Try to auto trigger mailto dispatch
    try {
      window.location.href = mailtoUrl;
    } catch (error) {
      console.error('Auto email dispatch failed:', error);
    }
    
    // Reset Form
    setCatName('');
    setCatTel('');
    setCatEmail('');
    setCatCompany('');
    setCatAddress('');
    setCatContent('');
    setSelectedCatalogs([]);
  };

  // Handle A/S Form Submission
  const handleAsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asName.trim() || !asTel.trim() || !asLocation.trim() || !asContent.trim()) {
      alert('성함, 연락처, 설치 현장 위치, 상세 사유는 필수 기재 사항입니다.');
      return;
    }

    const compiledContent = `
[A/S 접수 정보]
- 접수자명: ${asName}
- 연락처: ${asTel}
- 이메일: ${asEmail || '미기입'}
- 설치 현장 위치: ${asLocation}
- 하자 세부 내용: ${asContent}
- 첨부 사진 유무: ${asAttachedPhoto ? '있음 (현장 증빙 자료 완료)' : '없음'}
    `.trim();

    onAddInquiry({
      name: asName,
      tel: asTel,
      email: asEmail,
      title: `[A/S 접수] ${asName}님의 하자 보수 접수의 건`,
      content: compiledContent
    });

    const asTargetEmail = companyInfo?.asAlertEmail || companyInfo?.email || 'dadmdesign@naver.com';
    const emailSubject = `[A/S 하자접수] ${asName}님의 하자보수 신청건`;
    const emailBody = `[A/S 하자접수 내역]
-----------------------------
접수자명: ${asName}
연락처: ${asTel}
이메일: ${asEmail || '미기입'}
설치 현장 위치: ${asLocation}
첨부 사진 여부: ${asAttachedPhoto ? '있음' : '없음'}

상세 내용:
${asContent}
-----------------------------
(주)다듬디자인 고객지원 센터 접수 완료 건입니다.`;

    const mailtoUrl = `mailto:${encodeURIComponent(asTargetEmail)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    setLastAsMailto(mailtoUrl);
    setIsAsSubmitted(true);

    setSuccessMessage(`A/S 하자보수 신청이 정상 등록되었습니다. 지정된 담당자 메일(${asTargetEmail})로 접수 내역 발송을 진행합니다.`);
    setSubmitted(true);

    // Try to auto trigger mailto dispatch
    try {
      window.location.href = mailtoUrl;
    } catch (error) {
      console.error('Auto email dispatch failed:', error);
    }

    // Reset Form
    setAsName('');
    setAsTel('');
    setAsEmail('');
    setAsLocation('');
    setAsContent('');
    setAsAttachedPhoto(null);
  };

  // Toggle Catalog check
  const handleCatalogCheck = (catalog: string) => {
    if (selectedCatalogs.includes(catalog)) {
      setSelectedCatalogs(selectedCatalogs.filter(c => c !== catalog));
    } else {
      setSelectedCatalogs([...selectedCatalogs, catalog]);
    }
  };

  // Handle Photo Attachment Simulation
  const handlePhotoUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAsAttachedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to parse Synology NAS shared link and convert to a direct fbsharing download link
  const convertSynologyUrl = (url: string): string => {
    if (!url) return '';
    const trimmed = url.trim();
    
    // Check if it's a standard Synology sharing link
    if (trimmed.includes('/sharing/')) {
      try {
        const parsed = new URL(trimmed);
        const parts = parsed.pathname.split('/').filter(Boolean);
        const sharingIndex = parts.indexOf('sharing');
        if (sharingIndex !== -1 && parts[sharingIndex + 1]) {
          const shareId = parts[sharingIndex + 1];
          // Reconstruct as fbsharing download API link
          parsed.pathname = '/fbsharing/api/download';
          parsed.searchParams.set('id', shareId);
          return parsed.toString();
        }
      } catch (e) {
        // Fallback to original
      }
    }
    return trimmed;
  };

  const handlePriceNasUrlChange = (val: string) => {
    setPriceNasUrl(val);
    const converted = convertSynologyUrl(val);
    setPriceImg(converted);
  };

  const handleStartEditPrice = (item: PriceData) => {
    setEditingPriceId(item.id);
    setPriceYearMonth(item.yearMonth);
    setPriceTitle(item.title);
    setPriceDesc(item.description);
    setPriceImg(item.imageUrl);
    
    // Check if image is a converted Synology download link to restore sharing link format
    if (item.imageUrl.includes('/fbsharing/api/download')) {
      try {
        const parsed = new URL(item.imageUrl);
        const shareId = parsed.searchParams.get('id');
        if (shareId) {
          parsed.pathname = `/sharing/${shareId}`;
          parsed.searchParams.delete('id');
          setPriceNasUrl(parsed.toString());
        } else {
          setPriceNasUrl(item.imageUrl);
        }
      } catch (e) {
        setPriceNasUrl(item.imageUrl);
      }
    } else {
      setPriceNasUrl(item.imageUrl);
    }
    
    setIsUploadingPrice(true);
    // Smooth scroll to the form container
    setTimeout(() => {
      const container = document.getElementById('price-upload-form-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCancelPriceForm = () => {
    setIsUploadingPrice(false);
    setEditingPriceId(null);
    setPriceYearMonth('');
    setPriceTitle('');
    setPriceDesc('');
    setPriceImg('');
    setPriceNasUrl('');
  };

  // Handle Price List adding or editing
  const handleAddPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceYearMonth.trim() || !priceTitle.trim() || !priceDesc.trim()) {
      alert('모든 필수 정보를 기입해주세요.');
      return;
    }

    const finalImgUrl = priceImg || 'https://images.unsplash.com/photo-1543286386-7a39e2d97dbc?auto=format&fit=crop&w=800&q=80';

    if (editingPriceId) {
      // Edit Mode
      setPriceList(prev =>
        prev.map(item =>
          item.id === editingPriceId
            ? {
                ...item,
                yearMonth: priceYearMonth,
                title: priceTitle,
                description: priceDesc,
                imageUrl: finalImgUrl
              }
            : item
        )
      );
      alert('선택하신 가격 고시자료가 성공적으로 수정 반영되었습니다.');
    } else {
      // Add Mode
      const newPrice: PriceData = {
        id: `price-${Date.now()}`,
        yearMonth: priceYearMonth,
        title: priceTitle,
        description: priceDesc,
        imageUrl: finalImgUrl,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPriceList([newPrice, ...priceList]);
      alert('새로운 월별 가격 고시자료가 연혁 스타일의 타임라인 타일에 정상 추가되었습니다.');
    }

    handleCancelPriceForm();
  };

  const handlePricePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPriceImg(reader.result as string);
        setPriceNasUrl(''); // Reset NAS URL since file was uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePrice = (id: string) => {
    if (window.confirm('이 가격 고시 데이터를 삭제하시겠습니까?')) {
      setPriceList(priceList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="bg-neutral-50/50 min-h-screen py-16" id="inquiry-form-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {pageHeaders && onUpdatePageHeaders ? (
            <EditableHeader
              pageKey="inquiry"
              pageHeaders={pageHeaders}
              isAdminLoggedIn={isAdminLoggedIn}
              onUpdateHeaders={onUpdatePageHeaders}
              centered={true}
            />
          ) : (
            <>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400 bg-neutral-100 border border-neutral-200/60 px-3 py-1 rounded-full">
                Customer Support Center
              </span>
              <h1 className="text-3xl font-extrabold text-neutral-900 font-sans tracking-tight mt-3 mb-4">
                다듬디자인 고객지원 센터
              </h1>
              <p className="text-sm text-neutral-500 font-sans leading-relaxed">
                필요하신 자료 요청부터 시공 후 사후 하자 서비스까지 원스톱으로 지원해 드립니다. <br />
                온라인 접수 즉시 당사 엔지니어가 직접 검토 후 신속하게 메일과 문자, 유선으로 응대하겠습니다.
              </p>
            </>
          )}
        </div>

        {/* Tab Switcher - Order: Price -> Catalog -> A/S */}
        <div className="flex justify-center border-b border-neutral-200/80 mb-12 max-w-2xl mx-auto" id="inquiry-tab-switcher">
          <div className="flex space-x-2 sm:space-x-8">
            <button
              onClick={() => { setActiveTab('price'); resetFormState(); }}
              className={`py-4 px-3 sm:px-5 font-sans font-extrabold text-xs sm:text-sm tracking-wide border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'price'
                  ? 'border-neutral-950 text-neutral-950 scale-105'
                  : 'border-transparent text-neutral-400 hover:text-neutral-900'
              }`}
            >
              가격자료
            </button>
            <button
              onClick={() => { setActiveTab('catalog'); resetFormState(); }}
              className={`py-4 px-3 sm:px-5 font-sans font-extrabold text-xs sm:text-sm tracking-wide border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'border-neutral-950 text-neutral-950 scale-105'
                  : 'border-transparent text-neutral-400 hover:text-neutral-900'
              }`}
            >
              카탈로그 신청
            </button>
            <button
              onClick={() => { setActiveTab('as'); resetFormState(); }}
              className={`py-4 px-3 sm:px-5 font-sans font-extrabold text-xs sm:text-sm tracking-wide border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'as'
                  ? 'border-neutral-950 text-neutral-950 scale-105'
                  : 'border-transparent text-neutral-400 hover:text-neutral-900'
              }`}
            >
              A/S 하자접수
            </button>
          </div>
        </div>

        {submitted ? (
          /* Submission success state */
          <div className="max-w-xl mx-auto bg-white border border-neutral-100 rounded-3xl shadow-2xl p-10 text-center animate-fade-in" id="inquiry-success-message">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 font-sans mb-3">
              성공적으로 전달되었습니다
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed mb-8">
              {successMessage}
            </p>

            {isAsSubmitted && lastAsMailto && (
              <div className="mb-8 p-5 bg-neutral-50 border border-neutral-100 rounded-2xl text-left">
                <h4 className="text-xs font-bold text-neutral-700 mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  이메일 연동 발송 안내
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                  고객님의 메일 프로그램을 통해 A/S 하자접수 상세 내역을 즉시 발송할 수 있도록 메일 작성기를 호출하였습니다. 혹시 메일 창이 뜨지 않았거나 다시 접수하시려면 아래 버튼을 눌러주십시오.
                </p>
                <a
                  href={lastAsMailto}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>이메일 프로그램으로 직접 메일 발송하기</span>
                </a>
              </div>
            )}

            {isCatalogSubmitted && lastCatalogMailto && (
              <div className="mb-8 p-5 bg-neutral-50 border border-neutral-100 rounded-2xl text-left">
                <h4 className="text-xs font-bold text-neutral-700 mb-2 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                  이메일 연동 발송 안내
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                  고객님의 메일 프로그램을 통해 카탈로그 신청 내역을 즉시 발송할 수 있도록 메일 작성기를 호출하였습니다. 혹시 메일 창이 뜨지 않았거나 다시 접수하시려면 아래 버튼을 눌러주십시오.
                </p>
                <a
                  href={lastCatalogMailto}
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>이메일 프로그램으로 직접 메일 발송하기</span>
                </a>
              </div>
            )}

            <button
              onClick={resetFormState}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs tracking-wider uppercase px-6 py-3.5 rounded-xl hover:shadow-md cursor-pointer transition-all"
              id="inquiry-reset-btn"
            >
              추가 문의 접수하기
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CATALOGUE REQUEST */}
            {activeTab === 'catalog' && (
              <motion.div
                key="tab-catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                {/* Form column */}
                <form onSubmit={handleCatalogSubmit} className="bg-white border border-neutral-200/80 rounded-2xl shadow-lg p-6 sm:p-10 space-y-6">
                  <div className="border-b border-neutral-100 pb-4">
                    {pageHeaders && onUpdatePageHeaders ? (
                      <EditableHeader
                        pageKey="catalog"
                        pageHeaders={pageHeaders}
                        isAdminLoggedIn={isAdminLoggedIn}
                        onUpdateHeaders={onUpdatePageHeaders}
                        centered={false}
                      />
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-neutral-900 font-sans">
                          종합 카탈로그 / 지면용 도면 브로셔 신청
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-sans mt-1">
                          원하시는 제품군의 정밀 설계 규격과 카탈로그를 바로 요청하실 수 있습니다.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">성함 / 직함 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="예: 홍길동 과장"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">업체명 / 소속 부서</label>
                      <input
                        type="text"
                        value={catCompany}
                        onChange={(e) => setCatCompany(e.target.value)}
                        placeholder="예: (주)미래종합조경 설계팀"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">연락처 <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={catTel}
                        onChange={(e) => setCatTel(e.target.value)}
                        placeholder="예: 010-1234-5678"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">이메일 주소</label>
                      <input
                        type="email"
                        value={catEmail}
                        onChange={(e) => setCatEmail(e.target.value)}
                        placeholder="예: landscape@company.com"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Receipt Method Choice */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">수령 방식 선택</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCatMethod('pdf')}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          catMethod === 'pdf'
                            ? 'border-neutral-900 bg-neutral-50 text-neutral-950 font-bold'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="block text-xs sm:text-sm">📥 PDF 온라인 수령</span>
                        <span className="block text-[10px] text-neutral-400 mt-1 font-normal">이메일로 즉시 다운로드 링크 전송</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatMethod('printed')}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          catMethod === 'printed'
                            ? 'border-neutral-900 bg-neutral-50 text-neutral-950 font-bold'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="block text-xs sm:text-sm">📮 인쇄본 우편 수령</span>
                        <span className="block text-[10px] text-neutral-400 mt-1 font-normal">고급 지면 브로셔 우체국 택배 발송 (무료)</span>
                      </button>
                    </div>
                  </div>

                  {/* Mail address block */}
                  {catMethod === 'printed' && (
                    <div className="animate-fade-in bg-neutral-50 p-4 rounded-xl border border-neutral-200/60">
                      <label className="block text-xs font-bold text-neutral-600 mb-2">배송 주소 기재 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={catAddress}
                        onChange={(e) => setCatAddress(e.target.value)}
                        placeholder="정확한 상세 주소를 기재해주세요. (예: 서울시 마포구 상암동...)"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:bg-white focus:border-neutral-900 transition-colors bg-white"
                        required={catMethod === 'printed'}
                      />
                    </div>
                  )}



                  {/* Message textarea */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">추가 상세 요구사항 및 문의 (도면 첨부 요청 등)</label>
                    <textarea
                      rows={4}
                      value={catContent}
                      onChange={(e) => setCatContent(e.target.value)}
                      placeholder="특정 제품 설계 단가나 대량 조달 납품 가액 견적이 수록된 파일이 함께 필요하신 경우 상세히 기입해주세요."
                      className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-y leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <FileDown size={14} />
                    <span>카탈로그 및 설계자료 수령 신청 접수</span>
                  </button>
                </form>
              </motion.div>
            )}

            {/* TAB 2: MONTHLY PRICE LIST TIMELINE (SIMILAR TO COMPANY HISTORY) */}
            {activeTab === 'price' && (
              <motion.div
                key="tab-price"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                {/* Admin-only Header controls */}
                {isAdminLoggedIn && (
                  <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-neutral-200 uppercase font-mono">ADMINISTRATOR CONTROL PANELS</h4>
                      <p className="text-xs text-neutral-400 mt-1 font-sans">고객지원 가격고시 타임라인 데이터를 직접 편집하거나 신규 가격표를 등재할 수 있습니다.</p>
                    </div>
                    {!isUploadingPrice && (
                      <button
                        onClick={() => {
                          setEditingPriceId(null);
                          setPriceYearMonth('');
                          setPriceTitle('');
                          setPriceDesc('');
                          setPriceImg('');
                          setPriceNasUrl('');
                          setIsUploadingPrice(true);
                        }}
                        className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Plus size={14} />
                        <span>신규 고시자료 추가</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Upload Form (Inline Modal if true) */}
                {isUploadingPrice && (
                  <motion.div 
                    id="price-upload-form-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border-2 border-neutral-950 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 scroll-mt-20"
                  >
                    <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                      <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 font-sans flex items-center space-x-2">
                        <Upload size={16} className="text-neutral-500" />
                        <span>{editingPriceId ? '월별 고시 가격자료 수정하기' : '월별 고시 가격자료 신규 등재 및 이미지 업로드'}</span>
                      </h3>
                      <button 
                        onClick={handleCancelPriceForm}
                        className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleAddPriceSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">적용 년월 <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={priceYearMonth}
                            onChange={(e) => setPriceYearMonth(e.target.value)}
                            placeholder="예: 2026.08"
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-neutral-500 mb-2">고시 제목 <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={priceTitle}
                            onChange={(e) => setPriceTitle(e.target.value)}
                            placeholder="예: 2026년 8월 가로용 목재 벤치 및 파고라 조달 표준 단가표"
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">단가 개정 요약 및 사양 안내 <span className="text-red-500">*</span></label>
                        <textarea
                          rows={3}
                          value={priceDesc}
                          onChange={(e) => setPriceDesc(e.target.value)}
                          placeholder="개정 사항 및 자재비 단가 시세 변동 내용을 요약 기술해 주세요."
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-y"
                          required
                        ></textarea>
                      </div>

                      {/* Image Source Selection */}
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-neutral-500 mb-1">
                          가격 고시표 이미지 등록 <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          {/* File input */}
                          <div className="md:col-span-4 border border-dashed border-neutral-300 rounded-xl p-4 flex flex-col items-center justify-center bg-neutral-50 text-center relative hover:bg-neutral-100 transition-colors">
                            <Upload size={20} className="text-neutral-400 mb-1" />
                            <span className="text-xs font-bold text-neutral-600">파일 직접 올리기</span>
                            <span className="text-[10px] text-neutral-400 mt-0.5">(jpg, png)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePricePhotoUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>

                          {/* Synology NAS/Web URL Input */}
                          <div className="md:col-span-5 border border-neutral-200 rounded-xl p-4 bg-neutral-50 flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold text-neutral-500 block">시놀로지 NAS 공유 링크 또는 외부 이미지 URL</span>
                              <input
                                type="text"
                                value={priceNasUrl}
                                onChange={(e) => handlePriceNasUrlChange(e.target.value)}
                                placeholder="예: https://mynas.synology.me:5001/sharing/AbCdEf"
                                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 bg-white"
                              />
                              <p className="text-[10px] text-neutral-400 leading-normal">
                                💡 시놀로지 나스 파일 공유 링크(<code className="bg-neutral-100 px-1 py-0.5 rounded">/sharing/</code>) 입력 시, 즉시 렌더링 가능한 직링크(<code className="bg-neutral-100 px-1 py-0.5 rounded">/fbsharing/api/download</code>)로 자동 파싱되어 즉시 반영됩니다.
                              </p>
                            </div>
                          </div>

                          {/* Preview box */}
                          <div className="md:col-span-3 border border-neutral-200 rounded-xl p-3 bg-neutral-50 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-mono text-neutral-400 block mb-1">IMAGE PREVIEW</span>
                              {priceImg ? (
                                <div className="relative group">
                                  <img
                                    src={getDirectImageUrl(priceImg)}
                                    alt="Preview"
                                    className="h-16 w-full object-cover rounded border border-neutral-200"
                                    referrerPolicy="no-referrer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPriceImg('');
                                      setPriceNasUrl('');
                                    }}
                                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600 transition-colors"
                                    title="초기화"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ) : (
                                <div className="h-16 w-full rounded border border-dashed border-neutral-200 bg-neutral-100 flex items-center justify-center text-[10px] text-neutral-400 text-center px-2">
                                  이미지 미선택 시 기본 샘플 매핑
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const sampleUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                                setPriceImg(sampleUrl);
                                setPriceNasUrl(sampleUrl);
                              }}
                              className="text-[9px] font-bold text-neutral-800 hover:underline text-left mt-2 block"
                            >
                              💡 샘플 고화질 이미지 채우기
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={handleCancelPriceForm}
                          className="px-4 py-2 border border-neutral-200 text-xs font-bold font-sans text-neutral-500 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold font-sans rounded-lg transition-all shadow-md cursor-pointer"
                        >
                          {editingPriceId ? '수정 반영하기' : '타임라인에 즉시 등재'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Timeline - Styled exactly like About Company History */}
                <div className="relative border-l border-neutral-200 ml-4 md:ml-8 pl-8 sm:pl-12 space-y-16 py-6" id="price-data-timeline">
                  {priceList.map((item, idx) => {
                    // Extract Month name
                    const monthText = item.yearMonth.split('.')[1] || '07';
                    const yearText = item.yearMonth.split('.')[0] || '2026';
                    
                    return (
                      <div className="relative group animate-fade-in" key={item.id}>
                        {/* Timeline Circle Marker */}
                        <span className="absolute -left-[41px] sm:-left-[57px] top-1.5 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-neutral-950 text-white border border-white shadow-sm ring-4 ring-neutral-50 font-sans text-[10px] sm:text-xs font-black">
                          {monthText}
                        </span>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="inline-block bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                              {yearText}년 {monthText}월 고시자료
                            </span>
                            
                            {/* Delete/Edit Buttons */}
                            {isAdminLoggedIn ? (
                              <div className="flex items-center space-x-1.5 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
                                <button
                                  onClick={() => handleStartEditPrice(item)}
                                  className="text-neutral-500 hover:text-neutral-900 p-1 transition-colors rounded hover:bg-neutral-100 flex items-center space-x-1 text-[11px] font-bold"
                                  title="수정하기"
                                >
                                  <Edit2 size={12} />
                                  <span>수정</span>
                                </button>
                                <span className="text-neutral-300">|</span>
                                <button
                                  onClick={() => handleDeletePrice(item.id)}
                                  className="text-neutral-400 hover:text-red-500 p-1 transition-colors rounded hover:bg-red-50 flex items-center space-x-1 text-[11px] font-bold"
                                  title="삭제하기"
                                >
                                  <Trash2 size={12} />
                                  <span>삭제</span>
                                </button>
                              </div>
                            ) : (
                              /* Default quick action (delete) for sandbox users if not explicitly logged in */
                              <button
                                onClick={() => handleDeletePrice(item.id)}
                                className="text-neutral-300 hover:text-red-500 p-1 transition-colors rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                title="삭제하기"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          <h3 className="text-base sm:text-lg font-black text-neutral-900 font-sans leading-tight">
                            {item.title}
                          </h3>
                          
                          <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">
                            {item.description}
                          </p>

                          {/* Price Data Image - Clickable to expand */}
                          <div className="relative max-w-xl aspect-16/10 bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/60 shadow-sm group/image">
                            <img
                              src={getDirectImageUrl(item.imageUrl)}
                              alt="Price List Document"
                              className="w-full h-full object-cover group-hover/image:scale-[1.02] transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Absolute Overlay on hover */}
                            <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                              <button
                                onClick={() => setLightboxImg(item.imageUrl)}
                                className="bg-white/90 hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                                title="크게 보기 (Lightbox)"
                              >
                                <Maximize2 size={14} className="text-neutral-800" />
                              </button>
                              <a
                                href={item.imageUrl}
                                download={`DADMDESIGN_PRICELIST_${item.yearMonth}.jpg`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/90 hover:bg-white text-neutral-900 p-2.5 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                                title="다운로드"
                              >
                                <Download size={14} className="text-neutral-800" />
                              </a>
                            </div>
                            
                            {/* Static Info strip */}
                            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-neutral-100 rounded-lg px-2.5 py-1 text-[9px] font-mono font-bold text-neutral-800 shadow-sm flex items-center space-x-1">
                              <Maximize2 size={10} />
                              <span>CLICK IMAGE TO EXPAND</span>
                            </div>
                          </div>

                          <div className="flex space-x-3 pt-1">
                            <button
                              onClick={() => setLightboxImg(item.imageUrl)}
                              className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-neutral-800 hover:text-neutral-950 hover:underline cursor-pointer"
                            >
                              <Maximize2 size={12} />
                              <span>상세 단가표 정밀 원본 보기</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: A/S REQUEST */}
            {activeTab === 'as' && (
              <motion.div
                key="tab-as"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                {/* Form column */}
                <form onSubmit={handleAsSubmit} className="bg-white border border-neutral-200/80 rounded-2xl shadow-lg p-6 sm:p-10 space-y-6">
                  <div className="border-b border-neutral-100 pb-4">
                    {pageHeaders && onUpdatePageHeaders ? (
                      <EditableHeader
                        pageKey="as"
                        pageHeaders={pageHeaders}
                        isAdminLoggedIn={isAdminLoggedIn}
                        onUpdateHeaders={onUpdatePageHeaders}
                        centered={false}
                        icon={<Wrench size={18} className="text-neutral-500" />}
                      />
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-neutral-900 font-sans flex items-center space-x-2">
                          <Wrench size={18} className="text-neutral-500" />
                          <span>옥외 가로시설물 신속 하자접수 및 유지보수 신청</span>
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-sans mt-1">
                          다듬디자인 명품 하자보증 보장 서비스입니다. 접수해주시면 긴급 모바일 긴급 출동팀이 현장으로 긴급 배정됩니다.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">접수 기관 / 대표 고객명 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={asName}
                        onChange={(e) => setAsName(e.target.value)}
                        placeholder="예: 홍길동 주임 / 상암근린 관리소"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">비상 연락처 <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        value={asTel}
                        onChange={(e) => setAsTel(e.target.value)}
                        placeholder="예: 010-1234-5678"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">연락 가능한 메일</label>
                      <input
                        type="email"
                        value={asEmail}
                        onChange={(e) => setAsEmail(e.target.value)}
                        placeholder="예: support@agency.go.kr"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">시설물 정식 위치 <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={asLocation}
                        onChange={(e) => setAsLocation(e.target.value)}
                        placeholder="예: 경기도 용인시 수지구 근린공원 중앙광장 내부"
                        className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Attachment photo simulation */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">파손 부위 / 현장 실물 현황 사진 첨부</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-dashed border-neutral-300 rounded-xl p-5 flex flex-col items-center justify-center bg-neutral-50 text-center relative hover:bg-neutral-100 transition-all">
                        <Upload size={20} className="text-neutral-400 mb-2" />
                        <span className="text-xs font-bold text-neutral-600">현장 하자 사진 올리기</span>
                        <span className="text-[10px] text-neutral-400 mt-1">파일 직접 선택하기 (카메라 촬영 대응)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUploadSimulation}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/50 flex items-center justify-center">
                        {asAttachedPhoto ? (
                          <div className="relative h-20 w-full rounded overflow-hidden border">
                            <img src={asAttachedPhoto} alt="A/S Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setAsAttachedPhoto(null)}
                              className="absolute top-1 right-1 p-0.5 bg-neutral-950/80 rounded-full text-white"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-400 text-center leading-relaxed">사진 첨부 시 도면 연구실 및 긴급 유지 보수 엔지니어가 부속 자재를 즉시 예비 매칭하여 원스톱 수리를 완료합니다.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fail content details */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">A/S 요청 사유 및 파손 증상 상세 기술 <span className="text-red-500">*</span></label>
                    <textarea
                      rows={5}
                      value={asContent}
                      onChange={(e) => setAsContent(e.target.value)}
                      placeholder="예:&#13;1. 파손 유형: 외부 충격에 의한 목재 벤치 앉음 면 휨/균열&#13;2. 하자 수량: 등받이 벤치 2개소&#13;3. 요구 조치: 동일 규격 친환경 원목 부재 전면 일대 교체 요청"
                      className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-y leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs tracking-wider uppercase py-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Wrench size={14} />
                    <span>A/S 하자보수 긴급 출동 신청 등록</span>
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </div>

      {/* Lightbox Modal for Price Data Images */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 bg-neutral-950/90 z-50 flex items-center justify-center p-4 sm:p-10 animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <div className="absolute top-5 right-5 text-white/80 hover:text-white cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors">
            <X size={28} />
          </div>
          <div 
            className="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getDirectImageUrl(lightboxImg)} 
              alt="Expanded Document" 
              className="max-h-[80vh] w-auto object-contain rounded-lg shadow"
              referrerPolicy="no-referrer"
            />
            <div className="py-3 px-4 flex justify-between items-center text-xs font-bold text-neutral-800 font-sans">
              <span>다듬디자인 가격 고시자료 정밀 원본</span>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.print()}
                  className="text-neutral-600 hover:text-neutral-950 flex items-center space-x-1"
                >
                  <span>프린트 인쇄</span>
                </button>
                <button 
                  onClick={() => setLightboxImg(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
