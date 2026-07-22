import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  defaultCategories,
  defaultProducts,
  defaultBanners,
  defaultCompanyInfo,
  defaultConstructionProjects,
  defaultHomeSectionInfo,
  defaultPageHeaders,
  defaultPopups
} from './data/defaultData';
import { Category, Product, Banner, CompanyInfo, Inquiry, ConstructionProject, HomeSectionInfo, PageHeaders, PopupItem } from './types';
import { ICON_MAP, AVAILABLE_ICONS } from './utils/iconMap';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import InquiryForm from './components/InquiryForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import EditableHeader from './components/EditableHeader';
import ConstructionPortfolio from './components/ConstructionPortfolio';
import PopupDisplay from './components/PopupDisplay';
import { getDirectImageUrl } from './utils/imageUtils';
import {
  ProductModal,
  CategoryModal,
  BannerModal,
  CompanyInfoModal,
  ConstructionProjectModal,
  HomeSectionModal
} from './components/AdminModals';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  TreePine,
  Wrench,
  Search,
  MessageSquare,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Compass,
  Plus,
  Edit3,
  Play,
  Pause
} from 'lucide-react';

const INITIAL_MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: '최민준 팀장 / 삼우종합건설',
    tel: '010-8888-9912',
    email: 'mj.choi@samwoo.co.kr',
    title: '[긴급] 아파트 조경용 디자인 등벤치 35대 납품 및 앙카 시공 단가 문의',
    content: '안녕하세요. 삼우종합건설 조경사업부 최민준 팀장입니다.\n용인 역북 신축 단지 조경 공사 관련하여 다듬디자인의 [컴포트 하이브리드 야외 평벤치]와 [모던 라운드 가든 조경 벤치] 총 35대를 납품받고자 합니다.\n\n1. 설치 장소: 경기도 용인시 역북동 아파트 현장 내 보행로\n2. 요청 사항: 하부 주철 프레임 색상을 다크 블랙으로 변경 제작 가능한지 여부와, 시공 전문 인력 파견을 포함한 최종 세금계산서 발행 견적서를 메일로 받아보고 싶습니다.',
    productId: 'prod-02',
    productName: '컴포트 하이브리드 야외 평벤치',
    status: 'pending',
    createdAt: '2026-07-04'
  },
  {
    id: 'inq-2',
    name: '박수아 주임 / 가림조경디자인',
    tel: '02-777-3456',
    email: 'sa.park@garimland.co.kr',
    title: '디럭스 스마트 휴게 파고라 CAD 설계 평면/입면도 도면 송부 요청',
    content: '조경 설계 제안서 작성을 위해 [디럭스 스마트 휴게 파고라] 도면이 필요합니다.\n나라장터 식별번호를 도면 설명에 매핑해야 하여, 원본 dwg 설계 도면 파일을 메일로 발송해 주시면 감사하겠습니다.\n\n또한 미스트 분사 옵션을 추가했을 때 전기 및 설비 배선 인입 조건도 같이 가이드 문서로 보내주시면 감사하겠습니다.',
    productId: 'prod-01',
    productName: '디럭스 스마트 휴게 파고라',
    status: 'reviewed',
    createdAt: '2026-07-02'
  }
];

export default function App() {
  // Page Navigation State
  const [activePage, setActivePage] = useState<'home' | 'products' | 'procurement' | 'about' | 'inquiry' | 'admin' | 'construction'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [aboutTab, setAboutTab] = useState<'philosophy' | 'history' | 'directions'>('philosophy');
  const [inquiryTab, setInquiryTab] = useState<'catalog' | 'price' | 'as'>('price');
  
  // Category Filtering & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local Storage Database Synchronizer States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(defaultCompanyInfo);
  const [homeSectionInfo, setHomeSectionInfo] = useState<HomeSectionInfo>(defaultHomeSectionInfo);
  const [pageHeaders, setPageHeaders] = useState<PageHeaders>(defaultPageHeaders);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [constructionProjects, setConstructionProjects] = useState<ConstructionProject[]>([]);
  const [popups, setPopups] = useState<PopupItem[]>([]);
  
  // Dynamic Available Icons (Pictograms) State
  const [availableIcons, setAvailableIcons] = useState<{ name: string; label: string }[]>(() => {
    const cached = localStorage.getItem('dadm_available_icons');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // ignore
      }
    }
    return AVAILABLE_ICONS;
  });

  const handleUpdateAvailableIcons = (updatedIcons: { name: string; label: string }[]) => {
    setAvailableIcons(updatedIcons);
    localStorage.setItem('dadm_available_icons', JSON.stringify(updatedIcons));
  };
  
  // Admin Authorization State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Modal State Hooks for direct inline editing
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductData, setEditingProductData] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ConstructionProject | null>(null);
  const [isHomeSectionModalOpen, setIsHomeSectionModalOpen] = useState(false);

  // Signature products rotating states
  const [sigIndex, setSigIndex] = useState(0);
  const [isSigAutoPlaying, setIsSigAutoPlaying] = useState(true);

  // Inline Admin Save Handlers
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: ConstructionProject) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProjectCase = (id: string) => {
    const updated = constructionProjects.filter(p => p.id !== id);
    handleUpdateConstructionProjects(updated);
  };

  const handleSaveProjectCaseDirectly = (savedProject: ConstructionProject) => {
    const exists = constructionProjects.some(p => p.id === savedProject.id);
    let updated: ConstructionProject[];
    if (exists) {
      updated = constructionProjects.map(p => p.id === savedProject.id ? savedProject : p);
    } else {
      updated = [...constructionProjects, savedProject];
    }
    handleUpdateConstructionProjects(updated);
  };

  const handleSaveProductDirectly = (savedProduct: Product) => {
    const exists = products.some(p => p.id === savedProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map(p => p.id === savedProduct.id ? savedProduct : p);
    } else {
      updated = [savedProduct, ...products];
    }
    handleUpdateProducts(updated);
  };

  const handleUpdateCategoriesDirectly = (updatedCats: Category[]) => {
    handleUpdateCategories(updatedCats);
  };

  const handleUpdateBannersDirectly = (updatedBanners: Banner[]) => {
    handleUpdateBanners(updatedBanners);
  };

  const handleUpdateCompanyInfoDirectly = (updatedInfo: CompanyInfo) => {
    handleUpdateCompanyInfo(updatedInfo);
  };

  const handleUpdateHomeSectionInfoDirectly = (updatedInfo: HomeSectionInfo) => {
    setHomeSectionInfo(updatedInfo);
    localStorage.setItem('dadm_home_section', JSON.stringify(updatedInfo));
  };

  const handleUpdatePageHeaders = (updatedHeaders: PageHeaders) => {
    setPageHeaders(updatedHeaders);
    localStorage.setItem('dadm_page_headers', JSON.stringify(updatedHeaders));
  };

  const handleUpdatePopups = (updatedPopups: PopupItem[]) => {
    setPopups(updatedPopups);
    localStorage.setItem('dadm_popups', JSON.stringify(updatedPopups));
  };

  // Inquiry prefill triggers
  const [prefilledProductName, setPrefilledProductName] = useState('');
  const [prefilledProductId, setPrefilledProductId] = useState('');

  // 1. Initial hydration from local Storage
  useEffect(() => {
    const cachedProducts = localStorage.getItem('dadm_products');
    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts) as Product[];
        const sanitized = parsed.map(p => {
          if (p.categoryId === 'planter') {
            return { ...p, categoryId: 'bollard' };
          }
          return p;
        });
        setProducts(sanitized);
        localStorage.setItem('dadm_products', JSON.stringify(sanitized));
      } catch (e) {
        setProducts(defaultProducts);
      }
    } else {
      setProducts(defaultProducts);
      localStorage.setItem('dadm_products', JSON.stringify(defaultProducts));
    }

    const cachedCategories = localStorage.getItem('dadm_categories');
    if (cachedCategories) {
      try {
        setCategories(JSON.parse(cachedCategories));
      } catch (e) {
        setCategories(defaultCategories);
      }
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('dadm_categories', JSON.stringify(defaultCategories));
    }

    const cachedBanners = localStorage.getItem('dadm_banners');
    if (cachedBanners) {
      try {
        setBanners(JSON.parse(cachedBanners));
      } catch (e) {
        setBanners(defaultBanners);
      }
    } else {
      setBanners(defaultBanners);
      localStorage.setItem('dadm_banners', JSON.stringify(defaultBanners));
    }

    const cachedCompany = localStorage.getItem('dadm_company');
    if (cachedCompany) {
      try {
        const parsed = JSON.parse(cachedCompany) as CompanyInfo;
        // Automatically overwrite if cached company info is outdated
        if (
          parsed.name !== defaultCompanyInfo.name ||
          parsed.representative !== defaultCompanyInfo.representative ||
          parsed.address !== defaultCompanyInfo.address ||
          parsed.factoryAddress !== defaultCompanyInfo.factoryAddress ||
          parsed.tel !== defaultCompanyInfo.tel ||
          parsed.fax !== defaultCompanyInfo.fax ||
          parsed.email !== defaultCompanyInfo.email
        ) {
          setCompanyInfo(defaultCompanyInfo);
          localStorage.setItem('dadm_company', JSON.stringify(defaultCompanyInfo));
        } else {
          setCompanyInfo(parsed);
        }
      } catch (e) {
        setCompanyInfo(defaultCompanyInfo);
      }
    } else {
      setCompanyInfo(defaultCompanyInfo);
      localStorage.setItem('dadm_company', JSON.stringify(defaultCompanyInfo));
    }

    const cachedHomeSection = localStorage.getItem('dadm_home_section');
    if (cachedHomeSection) {
      try {
        setHomeSectionInfo(JSON.parse(cachedHomeSection));
      } catch (e) {
        setHomeSectionInfo(defaultHomeSectionInfo);
      }
    } else {
      setHomeSectionInfo(defaultHomeSectionInfo);
      localStorage.setItem('dadm_home_section', JSON.stringify(defaultHomeSectionInfo));
    }

    const cachedInquiries = localStorage.getItem('dadm_inquiries');
    if (cachedInquiries) {
      try {
        setInquiries(JSON.parse(cachedInquiries));
      } catch (e) {
        setInquiries(INITIAL_MOCK_INQUIRIES);
      }
    } else {
      setInquiries(INITIAL_MOCK_INQUIRIES);
      localStorage.setItem('dadm_inquiries', JSON.stringify(INITIAL_MOCK_INQUIRIES));
    }

    const cachedConstruction = localStorage.getItem('dadm_construction_projects');
    if (cachedConstruction) {
      try {
        setConstructionProjects(JSON.parse(cachedConstruction));
      } catch (e) {
        setConstructionProjects(defaultConstructionProjects);
      }
    } else {
      setConstructionProjects(defaultConstructionProjects);
      localStorage.setItem('dadm_construction_projects', JSON.stringify(defaultConstructionProjects));
    }

    const cachedPopups = localStorage.getItem('dadm_popups');
    if (cachedPopups) {
      try {
        setPopups(JSON.parse(cachedPopups));
      } catch (e) {
        setPopups(defaultPopups);
      }
    } else {
      setPopups(defaultPopups);
      localStorage.setItem('dadm_popups', JSON.stringify(defaultPopups));
    }

    const cachedPageHeaders = localStorage.getItem('dadm_page_headers');
    if (cachedPageHeaders) {
      try {
        setPageHeaders({ ...defaultPageHeaders, ...JSON.parse(cachedPageHeaders) });
      } catch (e) {
        setPageHeaders(defaultPageHeaders);
      }
    } else {
      setPageHeaders(defaultPageHeaders);
      localStorage.setItem('dadm_page_headers', JSON.stringify(defaultPageHeaders));
    }

    // Auth status session cache
    const cachedAuth = sessionStorage.getItem('dadm_admin_logged');
    if (cachedAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Signature products rotating auto-play timer (관리자 지정 간격 또는 기본 2초마다 반복 재생)
  const signatureProducts = products.filter(p => p.isSignature);
  const sigProductsToDisplay = signatureProducts.length > 0 ? signatureProducts : products;
  const displayCount = Math.min(6, sigProductsToDisplay.length);
  const playInterval = (homeSectionInfo?.procurementAutoPlayInterval ?? 2) * 1000;

  useEffect(() => {
    if (!isSigAutoPlaying || sigProductsToDisplay.length <= displayCount) return;
    const interval = setInterval(() => {
      setSigIndex((prev) => (prev + displayCount) % sigProductsToDisplay.length);
    }, playInterval);
    return () => clearInterval(interval);
  }, [isSigAutoPlaying, sigProductsToDisplay.length, displayCount, playInterval]);

  const displayedSigProducts = [];
  if (sigProductsToDisplay.length > 0) {
    for (let i = 0; i < displayCount; i++) {
      const p = sigProductsToDisplay[(sigIndex + i) % sigProductsToDisplay.length];
      if (p) {
        displayedSigProducts.push({
          ...p,
          uniqueKey: `${p.id}-${sigIndex}-${i}` // sigIndex를 포함해 키를 변경함으로써 나타나고 사라지는 애니메이션(AnimatePresence) 발동
        });
      }
    }
  }

  // Write changes back to localStorage on update
  const handleUpdateProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('dadm_products', JSON.stringify(updatedProds));
  };

  const handleUpdateConstructionProjects = (updatedProjects: ConstructionProject[]) => {
    setConstructionProjects(updatedProjects);
    localStorage.setItem('dadm_construction_projects', JSON.stringify(updatedProjects));
  };

  const handleUpdateBanners = (updatedBanners: Banner[]) => {
    setBanners(updatedBanners);
    localStorage.setItem('dadm_banners', JSON.stringify(updatedBanners));
  };

  const handleUpdateCompanyInfo = (updatedCompany: CompanyInfo) => {
    setCompanyInfo(updatedCompany);
    localStorage.setItem('dadm_company', JSON.stringify(updatedCompany));
  };

  const handleUpdateInquiries = (updatedInquiries: Inquiry[]) => {
    setInquiries(updatedInquiries);
    localStorage.setItem('dadm_inquiries', JSON.stringify(updatedInquiries));
  };

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('dadm_categories', JSON.stringify(updatedCategories));
  };

  // Login handlers
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('dadm_admin_logged', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('dadm_admin_logged');
  };

  // Submit inquiry
  const handleAddInquiry = (newInq: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const fullInq: Inquiry = {
      ...newInq,
      id: `inq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [fullInq, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('dadm_inquiries', JSON.stringify(updated));
  };

  // Trigger Inquiry from product detail
  const handleProductInquiryTrigger = (productName: string, productId: string) => {
    setPrefilledProductName(productName);
    setPrefilledProductId(productId);
    setActivePage('inquiry');
  };

  // Delete product from catalog
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    handleUpdateProducts(updated);
    setSelectedProductId(null);
  };

  // Reset prefills when navigated away
  useEffect(() => {
    if (activePage !== 'inquiry') {
      setPrefilledProductName('');
      setPrefilledProductId('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    if (activePage === 'procurement' && p.isProcurement === false) {
      return false;
    }
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      searchLower === '' ||
      p.name.toLowerCase().includes(searchLower) ||
      p.identificationNo.toLowerCase().includes(searchLower) ||
      p.material.toLowerCase().includes(searchLower) ||
      p.featureText.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  // Fetch product detail if requested
  const activeProductDetail = products.find(p => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-800 antialiased selection:bg-neutral-900 selection:text-white">
      
      {/* Header element */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        setSelectedProductId={setSelectedProductId}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        companyInfo={companyInfo}
        isAdminLoggedIn={isAdminLoggedIn}
        aboutTab={aboutTab}
        setAboutTab={setAboutTab}
        inquiryTab={inquiryTab}
        setInquiryTab={setInquiryTab}
      />

      {/* Main Body */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE */}
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16 pb-20"
              id="view-home"
            >
              <Hero
                banners={banners}
                setActivePage={setActivePage}
                setSelectedCategory={setSelectedCategory}
                isAdminLoggedIn={isAdminLoggedIn}
                onEditBanners={() => setIsBannerModalOpen(true)}
              />

              {/* Category Showcase Grid (Bento style) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6">
                  <span className="text-neutral-400 font-mono text-[10px] uppercase font-bold tracking-widest">
                    {homeSectionInfo.catShowcaseSlogan || 'DADMDESIGN Collections'}
                  </span>
                  <h2 className="text-2xl font-black text-neutral-900 font-sans tracking-tight mt-1.5 flex items-center justify-center gap-2">
                    <span>{homeSectionInfo.catShowcaseTitle || '공간의 격을 높이는 가로 시설물 제품군'}</span>
                    {isAdminLoggedIn && (
                      <button
                        onClick={() => setIsHomeSectionModalOpen(true)}
                        className="inline-flex items-center justify-center p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm border border-amber-400 transition-all cursor-pointer hover:scale-105"
                        title="메인화면 텍스트 수정 (팝업)"
                      >
                        <Edit3 size={11} />
                      </button>
                    )}
                  </h2>
                </div>

                {/* Admin Direct Category Control Button */}
                {isAdminLoggedIn && (
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-xs px-5 py-3 rounded-xl shadow-md border border-amber-400 transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>카테고리 전체 관리 (추가 / 수정 / 삭제)</span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.filter(c => c.id !== 'all' && c.isGeneral !== false).map((cat, idx) => {
                    const count = products.filter(p => p.categoryId === cat.id).length;
                    const isUrl = cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/'));
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setActivePage('products');
                          setSelectedProductId(null);
                        }}
                        className="group bg-neutral-50 hover:bg-neutral-900 border border-neutral-200/60 rounded-3xl p-8 text-center transition-all hover:-translate-y-1.5 hover:shadow-lg duration-300 cursor-pointer flex flex-col justify-between h-52 relative"
                      >
                        <div className="mx-auto bg-white group-hover:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 group-hover:border-neutral-700 transition-colors shadow-sm flex items-center justify-center w-20 h-20 shrink-0">
                          {isUrl ? (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="w-9 h-9 object-contain group-hover:invert group-hover:brightness-200 transition-all"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            (() => {
                              const IconComponent = (cat.icon && ICON_MAP[cat.icon]) || Layers;
                              return <IconComponent size={36} className="text-neutral-800 group-hover:text-white transition-colors" />;
                            })()
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 group-hover:text-white font-sans transition-colors">
                            {cat.name}
                          </h3>
                          <span className="block text-[11px] text-neutral-400 group-hover:text-neutral-400 font-mono mt-1 font-bold">
                            {count} 품종 수록
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Featured Products */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-neutral-50/50 rounded-3xl py-12 border border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                      {homeSectionInfo.featuredSlogan || 'Featured Products'}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <h2 className="text-xl sm:text-2xl font-black text-neutral-950 font-sans tracking-tight flex items-center gap-2">
                        <span>{homeSectionInfo.featuredTitle || '다듬디자인 시그니처 조달 우수제품'}</span>
                        {isAdminLoggedIn && (
                          <button
                            onClick={() => setIsHomeSectionModalOpen(true)}
                            className="inline-flex items-center justify-center p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm border border-amber-400 transition-all cursor-pointer hover:scale-105"
                            title="메인화면 텍스트 수정 (팝업)"
                          >
                            <Edit3 size={11} />
                          </button>
                        )}
                      </h2>
                      
                      {/* Play / Pause Toggle Button */}
                      <button
                        onClick={() => setIsSigAutoPlaying(!isSigAutoPlaying)}
                        className={`px-2.5 py-1.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                          isSigAutoPlaying 
                            ? 'bg-neutral-950 text-white border-neutral-900 hover:bg-neutral-800' 
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 shadow-xs'
                        }`}
                        title={isSigAutoPlaying ? "자동 재생 일시정지" : "자동 재생 시작 (2초 간격)"}
                      >
                        {isSigAutoPlaying ? (
                          <div className="flex items-center space-x-1">
                            <Pause size={11} className="stroke-[2.5px] animate-pulse text-amber-400" />
                            <span className="text-[10px] font-sans font-black">2초 자동 재생 중</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Play size={11} className="stroke-[2.5px]" />
                            <span className="text-[10px] font-sans font-bold">재생 일시정지</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Admin Direct Product Registration Button */}
                    {isAdminLoggedIn && (
                      <button
                        onClick={() => {
                          setEditingProductData(null);
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md border border-amber-400 transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>새 제품 등록 (추가)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActivePage('products');
                        setSelectedCategory('all');
                        setSelectedProductId(null);
                      }}
                      className="group flex items-center space-x-1.5 text-xs font-sans font-bold text-neutral-900 hover:text-neutral-700 transition-colors cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-neutral-200/60 shadow-sm"
                    >
                      <span>전체 수록 카탈로그 ({products.length})</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div 
                  className="w-full min-h-[600px] flex items-center justify-center"
                  onMouseEnter={() => setIsSigAutoPlaying(false)}
                  onMouseLeave={() => setIsSigAutoPlaying(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={sigIndex}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {displayedSigProducts.map((p) => (
                        <div key={p.id} className="h-full">
                          <ProductCard
                            product={p}
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setActivePage('products');
                            }}
                            isAdminLoggedIn={isAdminLoggedIn}
                            onEdit={() => {
                              setEditingProductData(p);
                              setIsProductModalOpen(true);
                            }}
                            onDelete={() => {
                              if (confirm('이 제품을 정말로 영구 삭제하시겠습니까?')) {
                                handleDeleteProduct(p.id);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </section>

              {/* Company competitive edge summary */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left (5 span): competitive benefits list */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                        {homeSectionInfo.slogan}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 font-sans tracking-tight mt-1 leading-tight whitespace-pre-line">
                        {homeSectionInfo.title}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs sm:text-sm text-neutral-500 font-sans leading-relaxed">
                        {homeSectionInfo.description}
                      </p>
 
                      {/* Admin Direct Main Page Control Button */}
                      {isAdminLoggedIn && (
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setIsHomeSectionModalOpen(true);
                            }}
                            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md border border-amber-400 transition-all cursor-pointer"
                          >
                            <Edit3 size={13} />
                            <span>메인화면 소개문구 & 이미지 직접 수정 (팝업)</span>
                          </button>
                        </div>
                      )}
                    </div>
 
                    <div className="space-y-4 pt-2">
                      <div className="flex items-start space-x-3">
                        <div className="bg-emerald-50 text-emerald-600 w-6 h-6 flex items-center justify-center rounded-lg border border-emerald-100 mt-0.5 shrink-0 text-[10px] font-sans select-none">
                          ■
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-sans">{homeSectionInfo.point1Title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed font-sans">{homeSectionInfo.point1Text}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-emerald-50 text-emerald-600 w-6 h-6 flex items-center justify-center rounded-lg border border-emerald-100 mt-0.5 shrink-0 text-[10px] font-sans select-none">
                          ■
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-sans">{homeSectionInfo.point2Title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed font-sans">{homeSectionInfo.point2Text}</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-emerald-50 text-emerald-600 w-6 h-6 flex items-center justify-center rounded-lg border border-emerald-100 mt-0.5 shrink-0 text-[10px] font-sans select-none">
                          ■
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-neutral-900 font-sans">{homeSectionInfo.point3Title}</h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed font-sans">{homeSectionInfo.point3Text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  {/* Right (7 span): Big scenic hero image */}
                  <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-16/9 shadow-2xl border border-neutral-100 bg-neutral-100">
                    <img
                      src={getDirectImageUrl(homeSectionInfo.imageUrl)}
                      alt="Landscape architecture"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent z-10 flex items-end p-6 sm:p-10">
                      <div className="text-white max-w-md">
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block mb-1">DADMDESIGN Signature</span>
                        <h3 className="text-base sm:text-lg font-black font-sans tracking-tight">{homeSectionInfo.imageTitle}</h3>
                        <p className="text-[11px] text-neutral-300 font-sans mt-1">{homeSectionInfo.imageSubtitle}</p>
                      </div>
                    </div>
                  </div>
 
                </div>
              </section>

              {/* Dynamic Overlay Popups */}
              <PopupDisplay popups={popups} />

            </motion.div>
          )}

          {/* PRODUCTS LIST & DETAILS VIEW */}
          {(activePage === 'products' || activePage === 'procurement') && (
            <motion.div
              key={activePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-10 pb-20"
              id="view-products"
            >
              {selectedProductId && activeProductDetail ? (
                /* 2a. Product Detail Sub-view */
                <ProductDetail
                  product={activeProductDetail}
                  categories={categories}
                  companyInfo={companyInfo}
                  onBack={() => setSelectedProductId(null)}
                  onInquiry={handleProductInquiryTrigger}
                  onDelete={handleDeleteProduct}
                  onEdit={(p) => {
                    setEditingProductData(p);
                    setIsProductModalOpen(true);
                  }}
                  isAdminLoggedIn={isAdminLoggedIn}
                />
              ) : (
                /* 2b. Main Product Listing State */
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  
                  {/* Category Banner Title info */}
                  <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6 items-start">
                    <div className="w-full">
                      <EditableHeader
                        pageKey={activePage === 'procurement' ? 'procurement' : 'products'}
                        pageHeaders={pageHeaders}
                        isAdminLoggedIn={isAdminLoggedIn}
                        onUpdateHeaders={handleUpdatePageHeaders}
                        extraTitleContent={
                          selectedCategory !== 'all' ? (
                            <span className="text-neutral-500 font-extrabold ml-1">
                              : {categories.find(c => c.id === selectedCategory)?.name}
                            </span>
                          ) : null
                        }
                      />
                    </div>

                    {/* Inline Admin Controls for Catalog management */}
                    {isAdminLoggedIn && (
                      <div className="flex flex-wrap gap-2 shrink-0 justify-center sm:justify-start">
                        <button
                          onClick={() => {
                            setEditingProductData(null);
                            setIsProductModalOpen(true);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Plus size={14} className="stroke-[2.5px]" />
                          <span>새 제품 등록</span>
                        </button>
                        <button
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-250 font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Layers size={14} />
                          <span>카테고리 편집</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Filtering Controls Row (Stacked Vertically: Category buttons on top (2x size), Search box below) */}
                  <div className="flex flex-col gap-6 border-b border-neutral-100 pb-6 mb-8">
                    
                    {/* Categories Row (Buttons text size matches search box, slightly rounded corners, wraps when they overflow) */}
                    <div className="flex flex-wrap gap-2.5 w-full" id="category-tab-rail">
                      {categories.filter(cat => {
                        if (activePage === 'procurement') {
                          return cat.id === 'all' || cat.isProcurement !== false;
                        } else {
                          return cat.id === 'all' || cat.isGeneral !== false;
                        }
                      }).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-4 py-2 rounded-lg text-sm sm:text-base font-sans font-bold whitespace-nowrap transition-all border cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-neutral-950 border-neutral-900 text-white shadow-sm'
                              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-neutral-900'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>

                    {/* Integrated Search Box (Moved under the categories) */}
                    <div className="relative w-full max-w-xl">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
                        <Search size={18} />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="모델명, 규격, 재질, 조달번호 검색..."
                        className="w-full text-sm sm:text-base pl-12 pr-4 py-3 border border-neutral-200 rounded-full bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 focus:shadow-md transition-all"
                        id="catalog-search-input"
                      />
                    </div>

                  </div>

                  {/* Grid Listing View */}
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                      <p className="text-xs sm:text-sm text-neutral-400 font-sans">
                        검색 조건에 부합하는 가로 조경 가구 제품이 전시관에 존재하지 않습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="products-catalog-grid">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onClick={() => setSelectedProductId(p.id)}
                          isAdminLoggedIn={isAdminLoggedIn}
                          narajangterMarkUrl={companyInfo.narajangterMarkUrl}
                          onEdit={() => {
                            setEditingProductData(p);
                            setIsProductModalOpen(true);
                          }}
                          onDelete={() => {
                            if (window.confirm(`정말로 '${p.name}' 제품을 카탈로그에서 삭제하시겠습니까?`)) {
                              handleDeleteProduct(p.id);
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}

          {/* ABOUT COMPANY PAGE */}
          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-16 pb-24"
              id="view-about"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                
                {/* Intro Hero */}
                <div className="text-center space-y-4">
                  <EditableHeader
                    pageKey="about"
                    pageHeaders={pageHeaders}
                    isAdminLoggedIn={isAdminLoggedIn}
                    onUpdateHeaders={handleUpdatePageHeaders}
                    centered={true}
                  />
                  {isAdminLoggedIn && (
                    <div className="flex justify-center mb-6 pt-2">
                      <button
                        onClick={() => setIsCompanyModalOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 border border-amber-400 text-white font-sans font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <Edit3 size={14} />
                        <span>회사 기본 정보 & 인사말 상세 수정</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center border-b border-neutral-200" id="about-tab-switcher">
                  <div className="flex space-x-6 sm:space-x-12">
                    <button
                      onClick={() => setAboutTab('philosophy')}
                      className={`py-4 px-2 font-sans font-extrabold text-sm sm:text-base tracking-wide border-b-2 transition-colors cursor-pointer ${
                        aboutTab === 'philosophy'
                          ? 'border-neutral-950 text-neutral-950'
                          : 'border-transparent text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      경영이념 / 인사말
                    </button>
                    <button
                      onClick={() => setAboutTab('history')}
                      className={`py-4 px-2 font-sans font-extrabold text-sm sm:text-base tracking-wide border-b-2 transition-colors cursor-pointer ${
                        aboutTab === 'history'
                          ? 'border-neutral-950 text-neutral-950'
                          : 'border-transparent text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      회사연혁
                    </button>
                    <button
                      onClick={() => setAboutTab('directions')}
                      className={`py-4 px-2 font-sans font-extrabold text-sm sm:text-base tracking-wide border-b-2 transition-colors cursor-pointer ${
                        aboutTab === 'directions'
                          ? 'border-neutral-950 text-neutral-950'
                          : 'border-transparent text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      오시는 길
                    </button>
                  </div>
                </div>

                {/* TAB 1: Philosophy / Greetings */}
                {aboutTab === 'philosophy' && (
                  <div className="space-y-16 animate-fade-in" id="about-tab-philosophy">
                    {/* Big Philosophy Image */}
                    <div className="aspect-21/9 bg-neutral-100 border border-neutral-100 rounded-3xl overflow-hidden shadow-lg">
                      <img
                        src={getDirectImageUrl(companyInfo.aboutUsImage || '/src/assets/images/street_bench_1783302667162.jpg')}
                        alt="Company concept"
                        className="w-full h-full object-cover object-center animate-fade-in"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* GREETINGS & CORE NARRATIVE */}
                    <div className="max-w-3xl mx-auto space-y-6">
                      <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-950 tracking-tight leading-snug border-b border-neutral-100 pb-4 text-center">
                        "{companyInfo.aboutUsTitle}"
                      </h2>
                      <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed whitespace-pre-line text-justify">
                        {companyInfo.aboutUsText}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: Company History */}
                {aboutTab === 'history' && (
                  <div className="space-y-12 animate-fade-in" id="about-tab-history">
                    <div className="relative border-l border-neutral-200 ml-4 md:ml-8 pl-8 sm:pl-12 space-y-12 py-4">
                      {(!companyInfo.historyList || companyInfo.historyList.length === 0) ? (
                        <div className="text-center py-12 text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-2xl font-sans">
                          등록된 회사 연혁이 없습니다. 관리자 모드에서 연혁을 등록해주세요.
                        </div>
                      ) : (
                        companyInfo.historyList.map((item, idx) => (
                          <div key={item.id || idx} className="relative">
                            <span className="absolute -left-[41px] sm:-left-[57px] top-1.5 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-neutral-950 text-white border border-white shadow-sm ring-4 ring-neutral-50 font-sans text-[10px] sm:text-xs font-black">
                              {item.yearShort || (item.year ? item.year.slice(-2) : '')}
                            </span>
                            <div className="space-y-3">
                              {item.badge && (
                                <span className="inline-block bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                                  {item.badge}
                                </span>
                              )}
                              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 font-sans">
                                {item.title} <span className="text-xs text-neutral-400 font-medium ml-1.5">({item.year}년)</span>
                              </h3>
                              {item.bullets && item.bullets.length > 0 && (
                                <ul className="text-xs sm:text-sm text-neutral-500 space-y-1.5 list-disc pl-5 leading-relaxed font-sans">
                                  {item.bullets.map((bullet, bIdx) => (
                                    <li key={bIdx}>{bullet}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: Directions / Location */}
                {aboutTab === 'directions' && (
                  <div className="space-y-10 animate-fade-in" id="about-tab-directions">
                    {/* CORPORATE INFORMATION TABLE */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
                      <h3 className="text-base font-bold text-neutral-950 font-sans border-b border-neutral-100 pb-4">
                        본사 및 공장 소재지 정보
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-xs sm:text-sm font-sans">
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">상호명</span>
                          <span className="text-neutral-900 font-bold text-right">{companyInfo.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">대표전화</span>
                          <span className="text-neutral-900 font-mono font-bold text-right">{companyInfo.tel}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">대표자</span>
                          <span className="text-neutral-900 font-medium text-right">{companyInfo.representative}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">팩스번호</span>
                          <span className="text-neutral-900 font-mono text-right">{companyInfo.fax || '정보 없음'}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">홈페이지</span>
                          <span className="text-neutral-900 font-mono text-right">
                            <a href={companyInfo.website || 'http://www.dadmdesign.co.kr'} target="_blank" rel="noopener noreferrer" className="hover:underline text-neutral-900">
                              {companyInfo.website?.replace(/^https?:\/\//, '') || 'www.dadmdesign.co.kr'}
                            </a>
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5">
                          <span className="text-neutral-400 font-medium shrink-0">이메일</span>
                          <span className="text-neutral-900 font-mono text-right">{companyInfo.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5 gap-4">
                          <span className="text-neutral-400 font-medium shrink-0">본사</span>
                          <span className="text-neutral-900 font-medium text-right">{companyInfo.address}</span>
                        </div>
                        <div className="flex justify-between border-b border-neutral-50 pb-2.5 gap-4">
                          <span className="text-neutral-400 font-medium shrink-0">공장</span>
                          <span className="text-neutral-900 font-medium text-right">{companyInfo.factoryAddress || '경북 김천 영남대로3251'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Google Map Integration */}
                    <div className="bg-white text-neutral-900 relative overflow-hidden">
                      <div className="relative z-10 space-y-8">
                        {/* Map content starts directly */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* 1. Headquarters (본사) */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-neutral-900 font-sans break-all">본사 : {companyInfo.address}</h4>
                              </div>
                            </div>

                            {/* Live Interactive Map for Headquarters */}
                            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                              <div className="bg-neutral-50 h-64 relative">
                                <iframe
                                  title="Headquarters Map"
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  scrolling="no"
                                  marginHeight={0}
                                  marginWidth={0}
                                  src={`https://maps.google.com/maps?q=${encodeURIComponent(companyInfo.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                  className="w-full h-full border-0 grayscale-[5%] contrast-[105%]"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          </div>

                          {/* 2. Factory (공장) */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-bold text-neutral-900 font-sans break-all">공장 : {companyInfo.factoryAddress || '경북 김천 영남대로3251'}</h4>
                              </div>
                            </div>

                            {/* Live Interactive Map for Factory */}
                            <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                              <div className="bg-neutral-50 h-64 relative">
                                <iframe
                                  title="Factory Map"
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  scrolling="no"
                                  marginHeight={0}
                                  marginWidth={0}
                                  src={`https://maps.google.com/maps?q=${encodeURIComponent(companyInfo.factoryAddress || '경북 김천 영남대로3251')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                  className="w-full h-full border-0 grayscale-[5%] contrast-[105%]"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* ONLINE INQUIRY PAGE */}
          {activePage === 'inquiry' && (
            <motion.div
              key="inquiry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="view-inquiry"
            >
              <InquiryForm
                products={products}
                initialProductName={prefilledProductName}
                initialProductId={prefilledProductId}
                onAddInquiry={handleAddInquiry}
                isAdminLoggedIn={isAdminLoggedIn}
                activeTab={inquiryTab}
                setActiveTab={setInquiryTab}
                companyInfo={companyInfo}
                pageHeaders={pageHeaders}
                onUpdatePageHeaders={handleUpdatePageHeaders}
              />
            </motion.div>
          )}

          {/* ADMINISTRATOR CONSOLE PANEL */}
          {activePage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="view-admin"
            >
              <AdminPanel
                products={products}
                categories={categories}
                banners={banners}
                companyInfo={companyInfo}
                homeSectionInfo={homeSectionInfo}
                inquiries={inquiries}
                isAdminLoggedIn={isAdminLoggedIn}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                onUpdateProducts={handleUpdateProducts}
                onUpdateBanners={handleUpdateBanners}
                onUpdateCompanyInfo={handleUpdateCompanyInfo}
                onUpdateHomeSectionInfo={handleUpdateHomeSectionInfoDirectly}
                onUpdateInquiries={handleUpdateInquiries}
                onUpdateCategories={handleUpdateCategories}
                availableIcons={availableIcons}
                onUpdateAvailableIcons={handleUpdateAvailableIcons}
                popups={popups}
                onUpdatePopups={handleUpdatePopups}
              />
            </motion.div>
          )}

          {/* CONSTRUCTION PORTFOLIO PAGE */}
          {activePage === 'construction' && (
            <motion.div
              key="construction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              id="view-construction"
            >
              <ConstructionPortfolio
                companyInfo={companyInfo}
                projects={constructionProjects}
                isAdminLoggedIn={isAdminLoggedIn}
                onAdd={handleOpenAddProject}
                onEdit={handleOpenEditProject}
                onDelete={handleDeleteProjectCase}
                onInquiryTrigger={() => {
                  setActivePage('inquiry');
                  setPrefilledProductName('건설사업 시공 제안 상담');
                  setPrefilledProductId('');
                }}
                pageHeaders={pageHeaders}
                onUpdatePageHeaders={handleUpdatePageHeaders}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer element */}
      <Footer
        companyInfo={companyInfo}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Direct Inline Admin Modals */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setEditingProductData(null);
          }}
          product={editingProductData}
          categories={categories}
          onSave={handleSaveProductDirectly}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          products={products}
          onUpdateCategories={handleUpdateCategoriesDirectly}
          availableIcons={availableIcons}
          onUpdateAvailableIcons={handleUpdateAvailableIcons}
        />
      )}

      {isBannerModalOpen && (
        <BannerModal
          isOpen={isBannerModalOpen}
          onClose={() => setIsBannerModalOpen(false)}
          banners={banners}
          onUpdateBanners={handleUpdateBannersDirectly}
        />
      )}

      {isCompanyModalOpen && (
        <CompanyInfoModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          companyInfo={companyInfo}
          onSave={handleUpdateCompanyInfoDirectly}
        />
      )}

      {isProjectModalOpen && (
        <ConstructionProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSave={handleSaveProjectCaseDirectly}
        />
      )}

      {isHomeSectionModalOpen && (
        <HomeSectionModal
          isOpen={isHomeSectionModalOpen}
          onClose={() => setIsHomeSectionModalOpen(false)}
          homeSectionInfo={homeSectionInfo}
          onSave={handleUpdateHomeSectionInfoDirectly}
        />
      )}

    </div>
  );
}
