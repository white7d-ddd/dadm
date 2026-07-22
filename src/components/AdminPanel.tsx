import React, { useState, useEffect } from 'react';
import {
  Lock,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Layers,
  FileText,
  Building,
  Image,
  Database,
  CheckCircle,
  Eye,
  X,
  FileDown,
  FileUp,
  LogIn,
  AlertTriangle,
  User,
  UserCog,
  MessageSquare
} from 'lucide-react';
import { Product, Banner, CompanyInfo, Inquiry, Category, HomeSectionInfo, PopupItem } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';
import { ICON_MAP } from '../utils/iconMap';
import { HomeSectionModal } from './AdminModals';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  companyInfo: CompanyInfo;
  homeSectionInfo: HomeSectionInfo;
  inquiries: Inquiry[];
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateBanners: (banners: Banner[]) => void;
  onUpdateCompanyInfo: (info: CompanyInfo) => void;
  onUpdateHomeSectionInfo: (info: HomeSectionInfo) => void;
  onUpdateInquiries: (inquiries: Inquiry[]) => void;
  onUpdateCategories?: (categories: Category[]) => void;
  availableIcons?: { name: string; label: string }[];
  onUpdateAvailableIcons?: (icons: { name: string; label: string }[]) => void;
  popups?: PopupItem[];
  onUpdatePopups?: (popups: PopupItem[]) => void;
}

type AdminTab = 'products' | 'categories' | 'banners' | 'company' | 'home' | 'inquiries' | 'backup' | 'security' | 'popups';

export default function AdminPanel({
  products,
  categories,
  banners,
  companyInfo,
  homeSectionInfo,
  inquiries,
  isAdminLoggedIn,
  onLogin,
  onLogout,
  onUpdateProducts,
  onUpdateBanners,
  onUpdateCompanyInfo,
  onUpdateHomeSectionInfo,
  onUpdateInquiries,
  onUpdateCategories,
  availableIcons,
  onUpdateAvailableIcons,
  popups = [],
  onUpdatePopups
}: AdminPanelProps) {
  // Admin credentials state loaded from localStorage
  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem('dadm_admin_username') || 'admin';
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('dadm_admin_password') || 'admin';
  });



  // Login Input States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Security Modification Tab state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isHomePopupOpen, setIsHomePopupOpen] = useState(false);

  // Form Fields State - Categories
  const [isEditingCategory, setIsEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIsProcurement, setCatIsProcurement] = useState(true);
  const [catIsGeneral, setCatIsGeneral] = useState(true);
  const [catIcon, setCatIcon] = useState('Layers');

  // Form Fields State - New Pictogram Library Item
  const [newPictoName, setNewPictoName] = useState('Sprout');
  const [newPictoLabel, setNewPictoLabel] = useState('');
  const [pictoType, setPictoType] = useState<'icon' | 'url'>('icon');
  const [customPictoUrl, setCustomPictoUrl] = useState('');

  // Inquiry detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Form Fields State - Products
  const [pName, setPName] = useState('');
  const [pCategoryId, setPCategoryId] = useState('pergola');
  const [pIdentificationNo, setPIdentificationNo] = useState('');
  const [pSize, setPSize] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pMaterial, setPMaterial] = useState('');
  const [pFinish, setPFinish] = useState('');
  const [pFeatureText, setPFeatureText] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pDrawingNo, setPDrawingNo] = useState('');
  const [pOptions, setPOptions] = useState('');
  const [pHasCad, setPHasCad] = useState(true);
  const [pHasPdf, setPHasPdf] = useState(true);
  const [pIsProcurement, setPIsProcurement] = useState(true);
  const [pIsSignature, setPIsSignature] = useState(true);
  const [pDesignMaterialEnabled, setPDesignMaterialEnabled] = useState(false);
  const [pDesignMaterialUrl, setPDesignMaterialUrl] = useState('');
  const [pImageUrls, setPImageUrls] = useState<string[]>(['']);

  // Form Fields State - Company
  const [cName, setCName] = useState(companyInfo.name);
  const [cEnglishName, setCEnglishName] = useState(companyInfo.englishName);
  const [cRepresentative, setCRepresentative] = useState(companyInfo.representative);
  const [cTel, setCTel] = useState(companyInfo.tel);
  const [cFax, setCFax] = useState(companyInfo.fax);
  const [cEmail, setCEmail] = useState(companyInfo.email);
  const [cAsAlertEmail, setCAsAlertEmail] = useState(companyInfo.asAlertEmail || companyInfo.email || 'dadmdesign@naver.com');
  const [cCatalogAlertEmail, setCCatalogAlertEmail] = useState(companyInfo.catalogAlertEmail || companyInfo.email || 'dadmdesign@naver.com');
  const [cAddress, setCAddress] = useState(companyInfo.address);
  const [cFactoryAddress, setCFactoryAddress] = useState(companyInfo.factoryAddress || '');
  const [cMailOrderNo, setCMailOrderNo] = useState(companyInfo.mailOrderNo);
  const [cWebsite, setCWebsite] = useState(companyInfo.website || 'http://www.dadmdesign.co.kr');
  const [cAboutUsTitle, setCAboutUsTitle] = useState(companyInfo.aboutUsTitle);
  const [cAboutUsText, setCAboutUsText] = useState(companyInfo.aboutUsText);
  const [cAboutUsImage, setCAboutUsImage] = useState(companyInfo.aboutUsImage || '/src/assets/images/street_bench_1783302667162.jpg');
  const [cNarajangterMarkUrl, setCNarajangterMarkUrl] = useState(companyInfo.narajangterMarkUrl || '');

  // Form Fields State - Home Section
  const [hSlogan, setHSlogan] = useState(homeSectionInfo.slogan);
  const [hTitle, setHTitle] = useState(homeSectionInfo.title);
  const [hDescription, setHDescription] = useState(homeSectionInfo.description);
  const [hPoint1Title, setHPoint1Title] = useState(homeSectionInfo.point1Title);
  const [hPoint1Text, setHPoint1Text] = useState(homeSectionInfo.point1Text);
  const [hPoint2Title, setHPoint2Title] = useState(homeSectionInfo.point2Title);
  const [hPoint2Text, setHPoint2Text] = useState(homeSectionInfo.point2Text);
  const [hPoint3Title, setHPoint3Title] = useState(homeSectionInfo.point3Title);
  const [hPoint3Text, setHPoint3Text] = useState(homeSectionInfo.point3Text);
  const [hImageUrl, setHImageUrl] = useState(homeSectionInfo.imageUrl);
  const [hImageTitle, setHImageTitle] = useState(homeSectionInfo.imageTitle);
  const [hImageSubtitle, setHImageSubtitle] = useState(homeSectionInfo.imageSubtitle);
  const [hProcurementAutoPlayInterval, setHProcurementAutoPlayInterval] = useState(homeSectionInfo.procurementAutoPlayInterval ?? 2);
  const [homeSaved, setHomeSaved] = useState(false);

  // Form Fields State - Popups
  const [isAddingPopup, setIsAddingPopup] = useState(false);
  const [isEditingPopup, setIsEditingPopup] = useState<PopupItem | null>(null);
  const [popupIdToDelete, setPopupIdToDelete] = useState<string | null>(null);

  const [popupTitle, setPopupTitle] = useState('');
  const [popupContent, setPopupContent] = useState('');
  const [popupImageUrl, setPopupImageUrl] = useState('');
  const [popupLinkUrl, setPopupLinkUrl] = useState('');
  const [popupIsActive, setPopupIsActive] = useState(true);
  const [popupWidth, setPopupWidth] = useState(400);
  const [popupHeight, setPopupHeight] = useState(500);
  const [popupLeft, setPopupLeft] = useState(80);
  const [popupTop, setPopupTop] = useState(100);

  const openAddPopup = () => {
    setPopupTitle('');
    setPopupContent('');
    setPopupImageUrl('');
    setPopupLinkUrl('');
    setPopupIsActive(true);
    setPopupWidth(400);
    setPopupHeight(500);
    setPopupLeft(80);
    setPopupTop(100);
    setIsAddingPopup(true);
    setIsEditingPopup(null);
  };

  const openEditPopup = (pop: PopupItem) => {
    setIsEditingPopup(pop);
    setPopupTitle(pop.title);
    setPopupContent(pop.content);
    setPopupImageUrl(pop.imageUrl || '');
    setPopupLinkUrl(pop.linkUrl || '');
    setPopupIsActive(pop.isActive);
    setPopupWidth(pop.width || 400);
    setPopupHeight(pop.height || 500);
    setPopupLeft(pop.left || 80);
    setPopupTop(pop.top || 100);
    setIsAddingPopup(false);
  };

  const handleSavePopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupTitle.trim() || !popupContent.trim()) {
      alert('필수 입력 요소를 기입해주세요.');
      return;
    }

    const popupData: PopupItem = {
      id: isEditingPopup ? isEditingPopup.id : `popup-${Date.now()}`,
      title: popupTitle,
      content: popupContent,
      imageUrl: convertSynologyUrl(popupImageUrl),
      linkUrl: popupLinkUrl,
      isActive: popupIsActive,
      width: Number(popupWidth) || 400,
      height: Number(popupHeight) || 500,
      left: Number(popupLeft) || 80,
      top: Number(popupTop) || 100,
      createdAt: isEditingPopup ? isEditingPopup.createdAt : new Date().toISOString().split('T')[0]
    };

    if (onUpdatePopups) {
      if (isAddingPopup) {
        onUpdatePopups([popupData, ...popups]);
      } else {
        onUpdatePopups(popups.map(p => p.id === popupData.id ? popupData : p));
      }
      alert('팝업 설정이 성공적으로 저장되었습니다.');
    }

    setIsAddingPopup(false);
    setIsEditingPopup(null);
  };

  const handleDeletePopup = (id: string) => {
    if (window.confirm('정말로 이 팝업을 삭제하시겠습니까? 메인 페이지 노출 목록에서 완전 삭제됩니다.')) {
      if (onUpdatePopups) {
        onUpdatePopups(popups.filter(p => p.id !== id));
      }
    }
  };


  const handleHomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHomeSectionInfo({
      ...homeSectionInfo,
      slogan: hSlogan,
      title: hTitle,
      description: hDescription,
      point1Title: hPoint1Title,
      point1Text: hPoint1Text,
      point2Title: hPoint2Title,
      point2Text: hPoint2Text,
      point3Title: hPoint3Title,
      point3Text: hPoint3Text,
      imageUrl: hImageUrl,
      imageTitle: hImageTitle,
      imageSubtitle: hImageSubtitle,
      procurementAutoPlayInterval: Number(hProcurementAutoPlayInterval) || 2,
    });
    setHomeSaved(true);
    setTimeout(() => setHomeSaved(false), 3000);
  };

  // Form Fields State - Banners
  const [bannerFields, setBannerFields] = useState<Banner[]>(banners);

  // Handles Login with username and password
  const handleAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validate credentials against state/localStorage
    const isMatched = usernameInput.trim() === adminUsername && passwordInput === adminPassword;

    if (isMatched) {
      onLogin();
      setLoginError('');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // Open Add Product Dialog
  const openAddProduct = () => {
    setPName('');
    setPCategoryId('pergola');
    setPIdentificationNo(String(Math.floor(10000000 + Math.random() * 90000000)));
    setPSize('W2000 x D600 x H450 (mm)');
    setPPrice(500000);
    setPMaterial('아카시아 천연목재 + 분체도장 스틸');
    setPFinish('야외 가로용 정전분체 마감');
    setPFeatureText('수려한 경관 연출을 위한 최신식 다목적 시설물');
    setPDescription('제품에 대한 상세 설명을 여기에 마크다운/텍스트 형식으로 편하게 기술하세요.');
    setPDrawingNo('DADM-' + Math.floor(100 + Math.random() * 900) + 'X');
    setPOptions('색상 지정 도장 가능, 목재 종류 변경 옵션');
    setPHasCad(true);
    setPHasPdf(true);
    setPIsProcurement(true);
    setPIsSignature(true);
    setPDesignMaterialEnabled(false);
    setPDesignMaterialUrl('');
    setPImageUrls(['https://picsum.photos/seed/' + Math.floor(Math.random() * 100) + '/800/600']);
    setIsAddingProduct(true);
    setIsEditingProduct(null);
  };

  // Open Edit Product Dialog
  const openEditProduct = (prod: Product) => {
    setIsEditingProduct(prod);
    setPName(prod.name);
    setPCategoryId(prod.categoryId);
    setPIdentificationNo(prod.identificationNo);
    setPSize(prod.size);
    setPPrice(prod.price);
    setPMaterial(prod.material);
    setPFinish(prod.finish);
    setPFeatureText(prod.featureText);
    setPDescription(prod.description);
    setPDrawingNo(prod.drawingNo);
    setPOptions(prod.options);
    setPHasCad(prod.hasCad);
    setPHasPdf(prod.hasPdf);
    setPIsProcurement(prod.isProcurement !== false);
    setPIsSignature(prod.isSignature || false);
    setPDesignMaterialEnabled(prod.designMaterialEnabled || false);
    setPDesignMaterialUrl(prod.designMaterialUrl || '');
    setPImageUrls(prod.images.length > 0 ? prod.images : ['https://picsum.photos/seed/edit/800/600']);
    setIsAddingProduct(false);
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

  // Save Add/Edit Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pIdentificationNo.trim() || !pSize.trim()) {
      alert('필수 입력 요소를 기입해주세요.');
      return;
    }

    // Filter empty image URLs
    const cleanedImages = pImageUrls.filter(url => url.trim() !== '');
    const finalImages = cleanedImages.length > 0 ? cleanedImages : ['https://picsum.photos/seed/default/800/600'];

    if (isAddingProduct) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        categoryId: pCategoryId,
        name: pName,
        identificationNo: pIdentificationNo,
        size: pSize,
        price: Number(pPrice) || 0,
        images: finalImages,
        material: pPMaterialHelper(),
        finish: pFinish,
        featureText: pFeatureText,
        description: pDescription,
        drawingNo: pDrawingNo,
        options: pOptions,
        hasCad: pHasCad,
        hasPdf: pHasPdf,
        isProcurement: pIsProcurement,
        isSignature: pIsSignature,
        designMaterialEnabled: pDesignMaterialEnabled,
        designMaterialUrl: convertSynologyUrl(pDesignMaterialUrl),
        createdAt: new Date().toISOString().split('T')[0]
      };
      onUpdateProducts([newProd, ...products]);
    } else if (isEditingProduct) {
      const updatedList = products.map((p) => {
        if (p.id === isEditingProduct.id) {
          return {
            ...p,
            categoryId: pCategoryId,
            name: pName,
            identificationNo: pIdentificationNo,
            size: pSize,
            price: Number(pPrice) || 0,
            images: finalImages,
            material: pPMaterialHelper(),
            finish: pFinish,
            featureText: pFeatureText,
            description: pDescription,
            drawingNo: pDrawingNo,
            options: pOptions,
            hasCad: pHasCad,
            hasPdf: pHasPdf,
            isProcurement: pIsProcurement,
            isSignature: pIsSignature,
            designMaterialEnabled: pDesignMaterialEnabled,
            designMaterialUrl: convertSynologyUrl(pDesignMaterialUrl)
          };
        }
        return p;
      });
      onUpdateProducts(updatedList);
    }

    setIsAddingProduct(false);
    setIsEditingProduct(null);
  };

  const pPMaterialHelper = () => {
    return pMaterial || '고밀도 친환경 원목 + 내후성 스틸 프레임';
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('정말로 이 제품을 삭제하시겠습니까? 관련 모든 규격 및 도면 매핑이 삭제됩니다.')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Save Company Profile info
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedInfo: CompanyInfo = {
      name: cName,
      englishName: cEnglishName,
      representative: cRepresentative,
      tel: cTel,
      fax: cFax,
      email: cEmail,
      address: cAddress,
      factoryAddress: cFactoryAddress,
      businessNo: '',
      mailOrderNo: cMailOrderNo,
      website: cWebsite,
      aboutUsTitle: cAboutUsTitle,
      aboutUsText: cAboutUsText,
      aboutUsImage: cAboutUsImage,
      mapAddress: cAddress,
      asAlertEmail: cAsAlertEmail,
      catalogAlertEmail: cCatalogAlertEmail,
      narajangterMarkUrl: cNarajangterMarkUrl,
      historyList: companyInfo.historyList,
      carDirections: companyInfo.carDirections,
      subwayDirections: companyInfo.subwayDirections,
      busDirections: companyInfo.busDirections
    };
    onUpdateCompanyInfo(updatedInfo);
    alert('회사 기본 프로필 정보가 사이트 전체에 성공적으로 즉시 수정되었습니다.');
  };

  // Save Banner custom modifications
  const handleSaveBanners = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBanners(bannerFields);
    alert('홈페이지 대형 메인 슬라이드 배너 정보가 즉시 저장 및 업데이트되었습니다.');
  };

  const handleBannerFieldChange = (idx: number, field: keyof Banner, val: string) => {
    const updated = bannerFields.map((b, i) => {
      if (i === idx) {
        return { ...b, [field]: val };
      }
      return b;
    });
    setBannerFields(updated);
  };

  // Toggle Inquiry reviewed status
  const handleToggleInquiryStatus = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const nextStatus = inq.status === 'pending' ? 'reviewed' : 'pending';
        return { ...inq, status: nextStatus as 'pending' | 'reviewed' };
      }
      return inq;
    });
    onUpdateInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({
        ...selectedInquiry,
        status: selectedInquiry.status === 'pending' ? 'reviewed' : 'pending'
      });
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('이 문의 로그 내역을 영구히 삭제하시겠습니까?')) {
      onUpdateInquiries(inquiries.filter(i => i.id !== id));
      setSelectedInquiry(null);
    }
  };

  // Open Add Category
  const openAddCategory = () => {
    setCatId('');
    setCatName('');
    setCatDescription('');
    setCatIcon('Layers');
    setCatIsProcurement(true);
    setCatIsGeneral(true);
    setIsAddingCategory(true);
    setIsEditingCategory(null);
  };

  // Open Edit Category
  const openEditCategory = (cat: Category) => {
    setIsEditingCategory(cat);
    setCatId(cat.id);
    setCatName(cat.name);
    setCatDescription(cat.description);
    setCatIcon(cat.icon || 'Layers');
    setCatIsProcurement(cat.isProcurement !== false);
    setCatIsGeneral(cat.isGeneral !== false);
    setIsAddingCategory(false);
  };

  // Save Category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId.trim() || !catName.trim()) {
      alert('분류 코드와 분류명은 필수 항목입니다.');
      return;
    }
    
    // Check if duplicate ID when adding
    if (isAddingCategory) {
      if (categories.some(c => c.id === catId.trim())) {
        alert('이미 존재하는 분류 코드입니다. 다른 분류 코드를 기입해주세요.');
        return;
      }
      
      const newCat: Category = {
        id: catId.trim(),
        name: catName.trim(),
        description: catDescription.trim(),
        icon: catIcon,
        isProcurement: catIsProcurement,
        isGeneral: catIsGeneral
      };
      if (onUpdateCategories) {
        onUpdateCategories([...categories, newCat]);
      }
    } else if (isEditingCategory) {
      const updatedList = categories.map((c) => {
        if (c.id === isEditingCategory.id) {
          return {
            ...c,
            name: catName.trim(),
            description: catDescription.trim(),
            icon: catIcon,
            isProcurement: catIsProcurement,
            isGeneral: catIsGeneral
          };
        }
        return c;
      });
      if (onUpdateCategories) {
        onUpdateCategories(updatedList);
      }
    }
    
    setIsAddingCategory(false);
    setIsEditingCategory(null);
  };

  // Delete Category
  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
      alert('전체상품 분류는 기본 시스템 분류로 삭제할 수 없습니다.');
      return;
    }
    const hasProducts = products.some(p => p.categoryId === id);
    let confirmMsg = '정말로 이 카테고리를 삭제하시겠습니까?';
    if (hasProducts) {
      confirmMsg = '주의! 이 카테고리에 소속된 제품들이 존재합니다. 카테고리를 삭제하면 소속된 제품들의 분류 필터링이 비정상적으로 동작할 수 있습니다. 그래도 정말 삭제하시겠습니까?';
    }
    
    if (window.confirm(confirmMsg)) {
      if (onUpdateCategories) {
        onUpdateCategories(categories.filter(c => c.id !== id));
      }
    }
  };

  // Add Pictogram to library
  const handleAddPictogram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPictoLabel.trim()) {
      alert('픽토그램 라벨명을 입력해주세요.');
      return;
    }

    let finalPictoName = '';
    if (pictoType === 'url') {
      if (!customPictoUrl.trim()) {
        alert('시놀로지 NAS 공유링크 또는 이미지 URL을 입력해주세요.');
        return;
      }

      // Convert URL (especially gofile.me) to a direct download/image link
      let rawUrl = customPictoUrl.trim();
      if (rawUrl.includes('gofile.me')) {
        if (!rawUrl.includes('?download') && !rawUrl.includes('&download')) {
          rawUrl = rawUrl.includes('?') ? `${rawUrl}&download` : `${rawUrl}?download`;
        }
      }
      finalPictoName = rawUrl;
    } else {
      finalPictoName = newPictoName;
    }

    const currentList = availableIcons || [];
    if (currentList.some(ico => ico.name === finalPictoName)) {
      alert('이미 라이브러리에 등록된 픽토그램 아이콘 또는 URL입니다.');
      return;
    }
    const updated = [
      ...currentList,
      { name: finalPictoName, label: newPictoLabel.trim() }
    ];
    if (onUpdateAvailableIcons) {
      onUpdateAvailableIcons(updated);
      alert('새로운 픽토그램이 라이브러리에 등록되었습니다!');
      setNewPictoLabel('');
      setCustomPictoUrl('');
    }
  };

  // Delete Pictogram from library
  const handleDeletePictogram = (nameToDelete: string) => {
    const isUsed = categories.some(c => c.icon === nameToDelete);
    if (isUsed) {
      const activeCatNames = categories.filter(c => c.icon === nameToDelete).map(c => c.name).join(', ');
      alert(`경고: 이 픽토그램은 현재 카테고리 [${activeCatNames}]에서 사용 중이므로 삭제할 수 없습니다. 다른 픽토그램으로 변경한 뒤 삭제해주세요.`);
      return;
    }
    
    if (window.confirm('선택하신 픽토그램을 라이브러리에서 정말 삭제하시겠습니까?')) {
      const currentList = availableIcons || [];
      const updated = currentList.filter(ico => ico.name !== nameToDelete);
      if (onUpdateAvailableIcons) {
        onUpdateAvailableIcons(updated);
        alert('픽토그램이 삭제되었습니다.');
      }
    }
  };

  // Backup data triggers (Save DB as JSON file)
  const handleExportDB = () => {
    const backupObj = {
      products,
      categories,
      banners,
      companyInfo,
      inquiries
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DADM_DESIGN_DB_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restore DB from uploaded JSON file
  const handleImportDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.products && parsed.banners && parsed.companyInfo) {
          onUpdateProducts(parsed.products);
          onUpdateBanners(parsed.banners);
          onUpdateCompanyInfo(parsed.companyInfo);
          if (parsed.categories && onUpdateCategories) {
            onUpdateCategories(parsed.categories);
          }
          if (parsed.inquiries) onUpdateInquiries(parsed.inquiries);
          alert('가상 데이터베이스 복원이 성공적으로 완료되었습니다! 웹사이트 내용이 즉시 갱신되었습니다.');
          window.location.reload();
        } else {
          alert('올바르지 않은 백업 파일 규격입니다.');
        }
      } catch (err) {
        alert('JSON 복원 도중 파싱 에러가 발생했습니다: ' + String(err));
      }
    };
    fileReader.readAsText(files[0]);
  };

  // Add/Remove Multi-image support inside edit form
  const handleAddImageUrlField = () => {
    setPImageUrls([...pImageUrls, '']);
  };

  const handleRemoveImageUrlField = (idx: number) => {
    const filtered = pImageUrls.filter((_, i) => i !== idx);
    setPImageUrls(filtered.length > 0 ? filtered : ['']);
  };

  const handleImageUrlChange = (idx: number, value: string) => {
    const updated = pImageUrls.map((url, i) => (i === idx ? value : url));
    setPImageUrls(updated);
  };

  // 1. LOGIN SCREEN RENDER
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-neutral-900 min-h-screen flex items-center justify-center px-4 py-16" id="admin-login-screen">
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Neon Top Ambient Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-800 via-neutral-200 to-neutral-800" />

          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-neutral-900 flex items-center justify-center border border-neutral-800 text-white mb-4">
              <User size={22} className="text-neutral-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white font-sans">
              다듬디자인 관리자모드
            </h2>
            <p className="text-xs font-mono tracking-widest text-neutral-500 uppercase mt-1">
              AUTHORIZED ACCESS ONLY
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label htmlFor="admin-id" className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">
                관리자 아이디 (ID)
              </label>
              <input
                type="text"
                id="admin-id"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="아이디를 입력하세요"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-sans tracking-wide transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">
                관리자 비밀번호
              </label>
              <input
                type="password"
                id="admin-pass"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full text-xs sm:text-sm px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 font-sans tracking-wide transition-colors"
                required
              />
              {loginError && (
                <p className="text-xs text-red-500 font-sans mt-2 flex items-center space-x-1">
                  <AlertTriangle size={12} className="shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-neutral-50 hover:bg-neutral-200 text-neutral-900 font-sans font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl cursor-pointer shadow-md hover:scale-[1.02] active:scale-98 transition-all"
              id="admin-login-submit"
            >
              <LogIn size={14} />
              <span>로그인 인증</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN RENDER
  return (
    <div className="bg-neutral-50 min-h-screen py-10" id="admin-dashboard-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <Settings size={12} />
              <span>DADM Management System</span>
            </div>
            <h1 className="text-2xl font-black text-neutral-900 font-sans tracking-tight mt-1">
              종합 관리자 데스크톱
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[11px] font-semibold">
              ● 관리자 모드 활성화됨
            </span>
            <button
              onClick={onLogout}
              className="text-xs font-sans font-bold text-neutral-500 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-400 px-4 py-2 rounded-lg cursor-pointer transition-all"
              id="admin-logout-btn"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* Sidebar & Editor Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation Rails (3 span) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="block px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-bold">
                컨텐츠 제어
              </span>
              
              <button
                onClick={() => { setActiveTab('products'); setIsEditingProduct(null); setIsAddingProduct(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Layers size={15} />
                <span>제품 가상 수록소 ({products.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('categories'); setIsEditingCategory(null); setIsAddingCategory(false); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Settings size={15} />
                <span>카테고리 분류 제어 ({categories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('banners')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'banners'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Image size={15} />
                <span>메인 슬라이드 배너 ({banners.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'company'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Building size={15} />
                <span>회사 기본 프로필 수정</span>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'home'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Image size={15} />
                <span>메인화면 본문 & 이미지 수정</span>
              </button>

              <button
                onClick={() => { setActiveTab('popups'); setIsAddingPopup(false); setIsEditingPopup(null); }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'popups'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <MessageSquare size={15} className="text-amber-500" />
                <span>메인 팝업 공지 제어 ({popups.length})</span>
              </button>
            </div>

            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="block px-3 py-2 text-[10px] font-mono tracking-wider uppercase text-neutral-400 font-bold">
                고객 피드백 & 시스템
              </span>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText size={15} />
                  <span>실시간 온라인 문의함</span>
                </div>
                {inquiries.filter(i => i.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-mono font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                    {inquiries.filter(i => i.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'backup'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Database size={15} />
                <span>데이터 수동 백업 / 복원</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'security'
                    ? 'bg-neutral-900 text-white font-bold shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <UserCog size={15} />
                <span>관리자 계정 변경</span>
              </button>
            </div>

            {/* Synology NAS Integration Guide Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white space-y-3.5 shadow-md mt-4">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-neutral-800 rounded-lg text-amber-400">
                  <Database size={15} />
                </span>
                <span className="text-xs font-bold font-sans tracking-wide">시놀로지 NAS 이미지 공유 연동</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                본 홈페이지의 모든 이미지 입력 필드에는 <strong>시놀로지 나스(Synology NAS)</strong> 파일 공유 링크를 그대로 사용할 수 있습니다.
              </p>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-1 font-sans text-[10px] text-neutral-300">
                <p className="font-bold text-amber-400">사용법:</p>
                <p className="leading-relaxed">1. NAS File Station에서 이미지 우클릭</p>
                <p className="leading-relaxed">2. <strong className="text-white">공유(Share)</strong> 클릭</p>
                <p className="leading-relaxed">3. 생성된 링크(<code className="bg-neutral-800 px-1 rounded text-amber-400 font-mono">gofile.me/...</code> 또는 <code className="bg-neutral-800 px-1 rounded text-amber-400 font-mono">/sharing/...</code> 경로)를 복사하여 이미지 입력란에 그대로 등록</p>
              </div>
              <p className="text-[9px] text-neutral-500 font-sans leading-relaxed">
                ※ 시스템이 실시간으로 direct stream URL로 변환하여 엑스박스 없이 완벽하게 렌더링합니다.
              </p>
            </div>
          </div>

          {/* Right Work Desk Panel (9 span) */}
          <div className="lg:col-span-9 bg-white border border-neutral-200/80 rounded-3xl shadow-sm p-6 sm:p-8 min-h-[480px]">
            
            {/* TAB 1: PRODUCT LIST & EDITOR PANEL */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in" id="panel-products-tab">
                {(!isAddingProduct && !isEditingProduct) ? (
                  /* Standard List State */
                  <>
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 font-sans">
                          조경 시설물 리스트업 관리
                        </h2>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          홈페이지에 전시되는 전체 조경 제품 데이터를 등록, 수정, 삭제합니다.
                        </p>
                      </div>
                      <button
                        onClick={openAddProduct}
                        className="flex items-center space-x-1 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                        id="add-new-product-btn"
                      >
                        <Plus size={14} />
                        <span>새 제품 등록</span>
                      </button>
                    </div>

                    {/* Desktop Tables layout */}
                    <div className="overflow-x-auto border border-neutral-100 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-100">
                            <th className="px-4 py-3">대표 이미지</th>
                            <th className="px-4 py-3">모델명 (조달번호)</th>
                            <th className="px-4 py-3">카테고리</th>
                            <th className="px-4 py-3">규격 / 단가</th>
                            <th className="px-4 py-3 text-right">관리 가공</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {products.map((p) => {
                            const catName = categories.find(c => c.id === p.categoryId)?.name || '기타';
                            return (
                              <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-4 py-3 w-20">
                                  <img
                                    src={getDirectImageUrl(p.images[0])}
                                    alt={p.name}
                                    className="w-14 aspect-4/3 object-cover rounded-md border border-neutral-200"
                                    referrerPolicy="no-referrer"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-bold text-neutral-950">{p.name}</div>
                                  <div className="font-mono text-[10px] text-neutral-400 mt-0.5">
                                    식별번호: {p.identificationNo}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-col gap-1 items-start">
                                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                      {catName}
                                    </span>
                                    {p.isProcurement && (
                                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                        조달등록
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-neutral-600 font-medium">{p.size}</div>
                                  <div className="font-mono font-bold text-neutral-900 mt-0.5">
                                    {p.price.toLocaleString()} 원
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right space-x-1">
                                  <button
                                    onClick={() => openEditProduct(p)}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer inline-flex"
                                    title="수정"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer inline-flex"
                                    title="삭제"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  /* Form State: Add or Edit */
                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 font-sans">
                          {isAddingProduct ? '신규 제품 데이터 등록' : '기존 제품 데이터 편집'}
                        </h2>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          조달 규격 및 식별번호를 정밀하게 입력하면 카탈로그에 자동 정렬 반영됩니다.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsAddingProduct(false); setIsEditingProduct(null); }}
                        className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">모델명 / 품명 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="예: 다듬 스틸 가든 벤치"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">카테고리 <span className="text-red-500">*</span></label>
                        <select
                          value={pCategoryId}
                          onChange={(e) => setPCategoryId(e.target.value)}
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:border-neutral-900"
                        >
                          {categories.filter(c => c.id !== 'all').map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">조달식별번호 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={pIdentificationNo}
                          onChange={(e) => setPIdentificationNo(e.target.value)}
                          placeholder="8자리 조달 코드 기입"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
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
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">제품 규격 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={pSize}
                          onChange={(e) => setPSize(e.target.value)}
                          placeholder="예: W1800 x D450 x H420 (mm)"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-2">주요 재질</label>
                        <input
                          type="text"
                          value={pMaterial}
                          onChange={(e) => setPMaterial(e.target.value)}
                          placeholder="예: 천연목재(이페) + 알루미늄 다리"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">한줄 요약 (특징)</label>
                      <input
                        type="text"
                        value={pFeatureText}
                        onChange={(e) => setPFeatureText(e.target.value)}
                        placeholder="예: 유려한 격자 무늬 프레임과 최고급 남미산 하드우드의 조화"
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">제품 이미지 URL 목록 (대표 및 서브 사진)</label>
                      <div className="space-y-3">
                        {pImageUrls.map((url, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            {url && (
                              <div className="w-12 h-12 rounded bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
                                <img
                                  src={getDirectImageUrl(url)}
                                  alt="제품 상세 사진 프리뷰"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                              placeholder="https://images.unsplash.com/... 또는 /src/assets/images/..."
                              className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                            />
                            {pImageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImageUrlField(idx)}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 cursor-pointer text-xs shrink-0"
                              >
                                삭제
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddImageUrlField}
                          className="text-xs font-sans font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition-all cursor-pointer"
                        >
                          + 추가 사진 링크 추가
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="procurement-allowed"
                          checked={pIsProcurement}
                          onChange={(e) => setPIsProcurement(e.target.checked)}
                          className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                        />
                        <label htmlFor="procurement-allowed" className="text-xs font-bold text-emerald-700">조달등록제품으로 등재</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="signature-allowed"
                          checked={pIsSignature}
                          onChange={(e) => setPIsSignature(e.target.checked)}
                          className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                        />
                        <label htmlFor="signature-allowed" className="text-xs font-bold text-amber-700">메인페이지 게시</label>
                      </div>
                    </div>

                    {/* 설계자료 다운로드 설정 (시놀로지 나스 등) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="design-material-allowed"
                            checked={pDesignMaterialEnabled}
                            onChange={(e) => setPDesignMaterialEnabled(e.target.checked)}
                            className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                          />
                          <label htmlFor="design-material-allowed" className="text-xs font-bold text-neutral-700 cursor-pointer">설계자료 다운로드 버튼 활성화</label>
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
                          className="w-full text-xs px-3 py-2 border border-neutral-200 bg-white rounded-lg focus:outline-none focus:border-neutral-900 font-mono disabled:opacity-50 disabled:bg-neutral-100"
                        />
                        <p className="text-[9px] text-neutral-400 mt-1">
                          💡 시놀로지 나스 파일 공유 링크(<code className="bg-neutral-100 px-1 py-0.5 rounded">/sharing/</code>) 입력 시, 직접 다운로드가 가능한 fbsharing 직링크로 자동 파싱 적용됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => { setIsAddingProduct(false); setIsEditingProduct(null); }}
                        className="text-xs font-sans font-bold text-neutral-500 hover:bg-neutral-100 px-5 py-3 rounded-xl transition-all cursor-pointer border border-neutral-200"
                      >
                        취소하기
                      </button>
                      
                      <button
                        type="submit"
                        className="text-xs font-sans font-bold text-white bg-neutral-900 hover:bg-neutral-800 px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer"
                        id="save-product-submit"
                      >
                        적용 및 저장 완료
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB: CATEGORY MANAGEMENT */}
            {activeTab === 'categories' && (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="panel-categories-tab">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-neutral-900 font-sans">
                      카테고리 분류체계 제어반
                    </h2>
                    <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                      홈페이지 상단 메뉴 및 제품 필터링에 노출되는 제품 분류군을 실시간으로 추가, 수정, 삭제합니다.
                    </p>
                  </div>
                  
                  {!isAddingCategory && !isEditingCategory && (
                    <button
                      onClick={openAddCategory}
                      className="bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Plus size={14} />
                      <span>새 카테고리 등록</span>
                    </button>
                  )}
                </div>

                {/* ADD/EDIT FORM */}
                {(isAddingCategory || isEditingCategory) && (
                  <form onSubmit={handleSaveCategory} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 animate-fade-in">
                    <h3 className="text-xs font-bold text-neutral-800 font-sans">
                      {isAddingCategory ? '새로운 카테고리 등록 양식' : '선택한 카테고리 속성 변경 양식'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">카테고리 영문 코드 (ID)</label>
                        <input
                          type="text"
                          value={catId}
                          onChange={(e) => setCatId(e.target.value)}
                          placeholder="예: pergola (소문자 권장, 고유해야 함)"
                          disabled={!isAddingCategory}
                          className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 font-mono"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">카테고리 표시 한글 이름</label>
                        <input
                          type="text"
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          placeholder="예: 그늘막"
                          className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-sans"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">카테고리 상세 요약 설명</label>
                      <input
                        type="text"
                        value={catDescription}
                        onChange={(e) => setCatDescription(e.target.value)}
                        placeholder="예: 쾌적하고 조화로운 도심 하이엔드 그늘 공간 조성용 아웃도어 구조물"
                        className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-100/50 p-4 rounded-xl border border-neutral-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="cat-is-procurement"
                          checked={catIsProcurement}
                          onChange={(e) => setCatIsProcurement(e.target.checked)}
                          className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900 cursor-pointer"
                        />
                        <label htmlFor="cat-is-procurement" className="text-xs font-bold text-emerald-800 cursor-pointer">
                          조달등록제품 페이지 카테고리 노출
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="cat-is-general"
                          checked={catIsGeneral}
                          onChange={(e) => setCatIsGeneral(e.target.checked)}
                          className="h-4 w-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900 cursor-pointer"
                        />
                        <label htmlFor="cat-is-general" className="text-xs font-bold text-amber-800 cursor-pointer">
                          일반 제품소개 페이지 카테고리 노출
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-neutral-500">카테고리 픽토그램 선택</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-white p-3 border border-neutral-200 rounded-xl max-h-48 overflow-y-auto">
                        {(availableIcons || []).map((ico) => {
                          const isUrl = ico.name.startsWith('http') || ico.name.startsWith('/');
                          const isSelected = catIcon === ico.name;
                          return (
                            <button
                              key={ico.name}
                              type="button"
                              onClick={() => setCatIcon(ico.name)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-neutral-950 bg-neutral-950 text-white font-bold shadow-sm scale-102'
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

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsAddingCategory(false); setIsEditingCategory(null); }}
                        className="bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold px-4 py-2 rounded-lg border border-neutral-200 transition-all cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        {isAddingCategory ? '카테고리 등록' : '변경사항 저장'}
                      </button>
                    </div>
                  </form>
                )}

                {/* CATEGORIES LIST TABLE */}
                {!isAddingCategory && !isEditingCategory && (
                  <div className="overflow-x-auto rounded-xl border border-neutral-100 bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                          <th className="py-3.5 px-4 font-sans">분류 코드 (ID)</th>
                          <th className="py-3.5 px-4 font-sans">한글 이름</th>
                          <th className="py-3.5 px-4 font-sans">설명 요약</th>
                          <th className="py-3.5 px-4 font-sans text-right">제어</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {categories.map((cat) => {
                          const productCount = products.filter(p => p.categoryId === cat.id).length;
                          return (
                            <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="py-3.5 px-4 font-mono text-xs font-bold text-neutral-500">
                                {cat.id}
                              </td>
                              <td className="py-3.5 px-4 font-sans text-xs font-extrabold text-neutral-900">
                                <div className="flex items-center flex-wrap gap-1.5">
                                  {cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/')) ? (
                                    <img src={cat.icon} alt={cat.name} className="w-4 h-4 object-contain shrink-0" referrerPolicy="no-referrer" />
                                  ) : (
                                    (() => {
                                      const IconComp = (cat.icon && ICON_MAP[cat.icon]) || Layers;
                                      return <IconComp size={14} className="text-neutral-500 shrink-0" />;
                                    })()
                                  )}
                                  <span>{cat.name}</span>
                                  {cat.id !== 'all' && (
                                    <>
                                      <span className="font-mono text-[9px] text-neutral-400 font-normal">
                                        ({productCount}개 제품)
                                      </span>
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
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-sans text-xs text-neutral-500 max-w-xs truncate">
                                {cat.description || '-'}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  {cat.id !== 'all' ? (
                                    <>
                                      <button
                                        onClick={() => openEditCategory(cat)}
                                        className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all cursor-pointer"
                                        title="카테고리 수정"
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                        title="카테고리 삭제"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-neutral-400 font-bold px-2 py-1 bg-neutral-100 rounded-md select-none font-sans">
                                      시스템 기본
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pictogram Library Management Section */}
                <div className="border-t border-neutral-100 pt-8 mt-8 space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-neutral-950 font-sans flex items-center gap-2">
                      <Image size={16} className="text-neutral-500" />
                      <span>메인페이지 카테고리용 픽토그램 라이브러리 관리</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-sans mt-1">
                      카테고리 지정 시 선택할 수 있는 제품 픽토그램(아이콘) 목록을 추가하거나 삭제하여 관리합니다. 조경시설물과 연계할 수 있는 다양한 아이콘들을 라이브러리에 연계할 수 있습니다.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Current Pictograms Grid */}
                    <div className="lg:col-span-7 space-y-3">
                      <span className="text-[11px] font-bold text-neutral-500 block">현재 라이브러리 등록 픽토그램 (총 {(availableIcons || []).length}개)</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 bg-neutral-50 p-4 border border-neutral-200/60 rounded-2xl max-h-80 overflow-y-auto">
                        {(availableIcons || []).map((ico) => {
                          const isUrl = ico.name.startsWith('http') || ico.name.startsWith('/');
                          return (
                            <div key={ico.name} className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl p-2.5 shadow-sm group hover:border-neutral-300 transition-colors">
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-800 shrink-0 flex items-center justify-center w-8 h-8">
                                  {isUrl ? (
                                    <img src={ico.name} alt={ico.label} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                                  ) : (
                                    (() => {
                                      const IconComponent = ICON_MAP[ico.name] || Layers;
                                      return <IconComponent size={18} />;
                                    })()
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-neutral-900 truncate leading-tight">{ico.label}</p>
                                  <p className="text-[9px] text-neutral-400 font-mono truncate leading-none mt-0.5" title={ico.name}>{ico.name}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeletePictogram(ico.name)}
                                className="text-neutral-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                title="픽토그램 삭제"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add New Pictogram Form */}
                    <div className="lg:col-span-5 bg-neutral-50 border border-neutral-200 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-extrabold text-neutral-800 font-sans">
                        새로운 픽토그램 추가
                      </h4>

                      <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                        <button
                          type="button"
                          onClick={() => setPictoType('icon')}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                            pictoType === 'icon'
                              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                              : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          기본 아이콘 선택 (Lucide)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPictoType('url')}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg text-center transition-all cursor-pointer ${
                            pictoType === 'url'
                              ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200/50'
                              : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          NAS 공유링크 / 외부 이미지 URL
                        </button>
                      </div>

                      <form onSubmit={handleAddPictogram} className="space-y-4">
                        {pictoType === 'icon' ? (
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 mb-1.5">1. 픽토그램 아이콘 선택</label>
                            <div className="grid grid-cols-5 gap-2 bg-white p-3 border border-neutral-200 rounded-xl h-36 overflow-y-auto">
                              {Object.keys(ICON_MAP).map((iconName) => {
                                const IconComponent = ICON_MAP[iconName];
                                const isSelected = newPictoName === iconName;
                                const isAlreadyAdded = (availableIcons || []).some(ico => ico.name === iconName);
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    disabled={isAlreadyAdded}
                                    onClick={() => setNewPictoName(iconName)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                      isSelected
                                        ? 'border-neutral-950 bg-neutral-950 text-white font-bold'
                                        : isAlreadyAdded
                                        ? 'opacity-30 border-neutral-100 bg-neutral-50 text-neutral-300 cursor-not-allowed'
                                        : 'border-neutral-100 bg-neutral-50/50 hover:bg-neutral-100 hover:border-neutral-200 text-neutral-600'
                                    }`}
                                    title={iconName}
                                  >
                                    <IconComponent size={16} />
                                    <span className="text-[8px] mt-0.5 line-clamp-1 scale-90 font-mono leading-none">{iconName}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-500 mb-1.5">1. 시놀로지 NAS 공유 링크 또는 웹 이미지 URL 입력</label>
                            <input
                              type="url"
                              value={customPictoUrl}
                              onChange={(e) => setCustomPictoUrl(e.target.value)}
                              placeholder="https://gofile.me/6xXyz/abcdef"
                              className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-sans"
                            />
                            <div className="mt-1.5 bg-neutral-100/50 border border-neutral-200 p-2.5 rounded-lg text-[9px] text-neutral-500 font-sans space-y-1">
                              <p className="font-bold text-neutral-700">💡 시놀로지 NAS 공유링크 등록 가이드:</p>
                              <p>• NAS File Station에서 파일 선택 후 <b>[공유]</b> 링크 생성</p>
                              <p>• gofile.me 링크 입력 시, 다이렉트 이미지 호출을 위해 자동으로 <b>?download</b> 매개변수를 주소 끝에 부착합니다.</p>
                              <p>• 공유 시 권한이 '공개(모든 사용자)' 상태인지 꼭 확인하세요.</p>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 mb-1.5">2. 픽토그램 한글 라벨 (대표명)</label>
                          <input
                            type="text"
                            value={newPictoLabel}
                            onChange={(e) => setNewPictoLabel(e.target.value)}
                            placeholder="예: 조형파고라, 꽃화분대, 전통정자"
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center space-x-2 shadow-sm cursor-pointer transition-colors"
                        >
                          <Plus size={13} />
                          <span>선택한 픽토그램 추가</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HERO BANNER MANAGEMENT */}
            {activeTab === 'banners' && (
              <form onSubmit={handleSaveBanners} className="space-y-8 animate-fade-in" id="panel-banners-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    메인 홈 화면 대형 슬라이드 배너 수정
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    홈페이지 전면에 노출되는 캐러셀 슬라이드의 이미지와 텍스트를 바로 변경합니다.
                  </p>
                </div>

                <div className="space-y-6">
                  {bannerFields.map((b, idx) => (
                    <div key={b.id} className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/60 relative">
                      <span className="absolute top-4 right-4 bg-neutral-900 text-white font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        슬라이드 {idx + 1}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">대타이틀</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => handleBannerFieldChange(idx, 'title', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-sans"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">서브 슬로건 구절</label>
                          <input
                            type="text"
                            value={b.subtitle}
                            onChange={(e) => handleBannerFieldChange(idx, 'subtitle', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-sans"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-grow w-full">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1.5">배경 이미지 파일 경로 / 링크</label>
                          <input
                            type="text"
                            value={b.imageUrl}
                            onChange={(e) => handleBannerFieldChange(idx, 'imageUrl', e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
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

                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
                    id="save-banners-btn"
                  >
                    배너 슬라이드 설정값 최종 적용
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: COMPANY GENERAL PROFILE */}
            {activeTab === 'company' && (
              <form onSubmit={handleSaveCompany} className="space-y-6 animate-fade-in" id="panel-company-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    회사 공식 기본 프로필 설정
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    회사 소개 페이지 및 모든 푸터 영역의 공식 기재 주소, 사업자정보 등을 실시간 변경합니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-2">상호 / 회사명</label>
                  <input
                    type="text"
                    value={cName}
                    onChange={(e) => setCName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">대표자명</label>
                    <input
                      type="text"
                      value={cRepresentative}
                      onChange={(e) => setCRepresentative(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">대표 전화번호</label>
                    <input
                      type="text"
                      value={cTel}
                      onChange={(e) => setCTel(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">팩스번호</label>
                    <input
                      type="text"
                      value={cFax}
                      onChange={(e) => setCFax(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">대표 이메일</label>
                    <input
                      type="email"
                      value={cEmail}
                      onChange={(e) => setCEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">A/S 하자접수 수신 이메일</label>
                    <input
                      type="email"
                      value={cAsAlertEmail}
                      onChange={(e) => setCAsAlertEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">카탈로그 신청 수신 이메일</label>
                    <input
                      type="email"
                      value={cCatalogAlertEmail}
                      onChange={(e) => setCCatalogAlertEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">본사 소재지 주소</label>
                    <input
                      type="text"
                      value={cAddress}
                      onChange={(e) => setCAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">공장 소재지 주소 (선택)</label>
                    <input
                      type="text"
                      value={cFactoryAddress}
                      onChange={(e) => setCFactoryAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6 space-y-4">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider uppercase">소개글 편집</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">회사 소개 서브타이틀</label>
                    <input
                      type="text"
                      value={cAboutUsTitle}
                      onChange={(e) => setCAboutUsTitle(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">대표 인사말 / 회사 소개 전문</label>
                    <textarea
                      rows={5}
                      value={cAboutUsText}
                      onChange={(e) => setCAboutUsText(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-y leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                        <span>회사소개 대표 이미지 URL</span>
                        <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-neutral-950 font-bold rounded text-[9px] uppercase font-sans">Synology NAS 지원</span>
                      </label>
                      <input
                        type="text"
                        value={cAboutUsImage}
                        onChange={(e) => setCAboutUsImage(e.target.value)}
                        placeholder="시놀로지 공유 링크 (gofile.me/...) 또는 이미지 주소"
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                        required
                      />
                      <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                        회사 소개 페이지(About Us) 최상단에 가로로 넓게 들어갈 배너 이미지를 설정합니다. 
                        시놀로지 NAS의 파일 링크(<code className="bg-neutral-100 px-1 rounded text-neutral-600 font-mono">gofile.me/...</code>)를 그대로 입력하시면 스트리밍 주소로 자동 연동됩니다.
                      </p>
                    </div>

                    <div className="md:col-span-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-neutral-400 mb-1.5 block w-full text-center uppercase tracking-wide">이미지 프리뷰</span>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                        {cAboutUsImage ? (
                          <img
                            src={getDirectImageUrl(cAboutUsImage)}
                            alt="About Us Preview"
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

                  {/* 나라장터 마크 이미지 URL */}
                  <div className="border-t border-neutral-100 pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 flex items-center">
                          <span>조달제품용 나라장터 마크 이미지 URL (선택)</span>
                        </label>
                        <input
                          type="text"
                          value={cNarajangterMarkUrl}
                          onChange={(e) => setCNarajangterMarkUrl(e.target.value)}
                          placeholder="마크 이미지 URL 또는 시놀로지 파일 링크"
                          className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                        />
                        <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                          조달 등록 품목의 이미지 좌측 하단에 오버레이로 표시될 나라장터 마크를 지정합니다. 
                          미지정 시 기본 둥근 태극 무늬 마크가 자동으로 출력됩니다.
                        </p>
                      </div>

                      <div className="md:col-span-1 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-bold text-neutral-400 mb-1.5 block w-full text-center uppercase tracking-wide">마크 프리뷰</span>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200 bg-white shadow-sm p-1.5 flex items-center justify-center">
                          {cNarajangterMarkUrl ? (
                            <img
                              src={getDirectImageUrl(cNarajangterMarkUrl)}
                              alt="나라장터 마크 프리뷰"
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
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-all"
                    id="save-company-btn"
                  >
                    회사 정보 실시간 적용
                  </button>
                </div>
              </form>
            )}

            {/* TAB: MAIN PAGE CONTENT & IMAGE EDITING */}
            {activeTab === 'home' && (
              <form onSubmit={handleHomeSubmit} className="space-y-6 animate-fade-in" id="panel-home-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    메인페이지 하단 소개 영역 및 이미지 편집
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    홈페이지의 '신뢰 및 강점(Section 3)' 영역에 들어가는 문구와 우측 메인 연출 이미지를 자유롭게 수정할 수 있습니다.
                  </p>
                </div>

                {/* POPUP EDIT OPTION BANNER */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-neutral-950 font-sans uppercase">
                      새로운 기능
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 font-sans">
                      팝업창(모달)으로 더 편리하게 수정해보세요!
                    </h3>
                    <p className="text-[11px] text-neutral-500 leading-normal">
                      아래 입력 폼 외에도, 넓은 화면의 전용 팝업 에디터를 통해 실시간 이미지 미리보기와 정밀 편집을 한눈에 진행할 수 있습니다.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHomePopupOpen(true)}
                    className="shrink-0 bg-neutral-950 hover:bg-neutral-800 text-white font-sans font-black text-xs px-4.5 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>메인 텍스트 팝업 수정창 열기</span>
                  </button>
                </div>

                {homeSaved && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold font-sans animate-pulse">
                    ✓ 메인페이지 설정이 안전하게 실시간 저장되었습니다!
                  </div>
                )}

                <div className="border-t border-neutral-100 pt-4 space-y-5">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider uppercase">기본 텍스트 및 타이틀</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">상단 소형 슬로건</label>
                      <input
                        type="text"
                        value={hSlogan}
                        onChange={(e) => setHSlogan(e.target.value)}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">메인 타이틀 (줄바꿈 가능)</label>
                      <textarea
                        rows={2}
                        value={hTitle}
                        onChange={(e) => setHTitle(e.target.value)}
                        className="w-full text-xs sm:text-sm px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-2">중앙 상세 설명 본문</label>
                    <textarea
                      rows={4}
                      value={hDescription}
                      onChange={(e) => setHDescription(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 resize-y leading-relaxed"
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6 space-y-5">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider uppercase">하단 강점 특징 3가지 포인트</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-3">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">포인트 1 (첫번째 강점)</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">소제목</label>
                          <input
                            type="text"
                            value={hPoint1Title}
                            onChange={(e) => setHPoint1Title(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">상세 설명</label>
                          <input
                            type="text"
                            value={hPoint1Text}
                            onChange={(e) => setHPoint1Text(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-3">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">포인트 2 (두번째 강점)</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">소제목</label>
                          <input
                            type="text"
                            value={hPoint2Title}
                            onChange={(e) => setHPoint2Title(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">상세 설명</label>
                          <input
                            type="text"
                            value={hPoint2Text}
                            onChange={(e) => setHPoint2Text(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 space-y-3">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">포인트 3 (세번째 강점)</span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">소제목</label>
                          <input
                            type="text"
                            value={hPoint3Title}
                            onChange={(e) => setHPoint3Title(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">상세 설명</label>
                          <input
                            type="text"
                            value={hPoint3Text}
                            onChange={(e) => setHPoint3Text(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6 space-y-5">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider uppercase">우측 메인 연출 이미지 및 하단 캡션 정보</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-500 mb-2">연출 이미지 주소 (URL 또는 프로젝트 내 이미지 경로)</label>
                      <input
                        type="text"
                        value={hImageUrl}
                        onChange={(e) => setHImageUrl(e.target.value)}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                        required
                      />
                      <p className="text-[10px] text-neutral-400 mt-1.5 leading-relaxed">
                        기본 권장 경로: <code className="bg-neutral-100 px-1 rounded">/src/assets/images/street_pergola_1783302650051.jpg</code> 또는 외부 사진 호스팅 URL을 사용하십시오.
                      </p>
                    </div>

                    <div className="md:col-span-1 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-neutral-400 mb-2 block w-full text-center">실시간 프리뷰</span>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 bg-neutral-200">
                        {hImageUrl ? (
                          <img
                            src={getDirectImageUrl(hImageUrl)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/fallback/300/200';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">이미지 없음</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">이미지 내 검은 배경 타이틀</label>
                      <input
                        type="text"
                        value={hImageTitle}
                        onChange={(e) => setHImageTitle(e.target.value)}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2">이미지 내 검은 배경 서브타이틀</label>
                      <input
                        type="text"
                        value={hImageSubtitle}
                        onChange={(e) => setHImageSubtitle(e.target.value)}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6 space-y-5">
                  <h3 className="text-xs font-bold text-neutral-700 tracking-wider uppercase">조달 우수제품 슬라이더 자동 재생 설정</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 mb-2 flex items-center justify-between">
                        <span>자동 롤링 재생 시간 (초 단위)</span>
                        <span className="text-[10px] text-amber-600 font-bold">현재 설정: {hProcurementAutoPlayInterval}초 간격</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={hProcurementAutoPlayInterval}
                        onChange={(e) => setHProcurementAutoPlayInterval(Math.max(1, Number(e.target.value)))}
                        className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                        required
                      />
                      <p className="text-[10px] text-neutral-400 mt-1.5 leading-relaxed">
                        메인페이지의 '시그니처 조달 우수제품' 슬라이더 제품들이 자동으로 회전하며 넘어가는 초 단위 시간입니다 (최소 1초, 권장 2초~5초).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-all hover:scale-[1.01]"
                  >
                    메인화면 설정 저장 및 즉시 반영
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: LIVE ONLINE INQUIRIES BOX */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 animate-fade-in" id="panel-inquiries-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    온라인 신규 상담 문의 접수 내역
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    고객이 제품 카탈로그 또는 견적 문의폼을 통해 접수한 상담 로그 리스트입니다.
                  </p>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                    <p className="text-neutral-400 text-xs font-sans">
                      접수된 온라인 견적 문의 로그가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-4 rounded-xl border transition-all ${
                          inq.status === 'pending'
                            ? 'bg-amber-50/30 border-amber-200'
                            : 'bg-white border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center space-x-2.5">
                            <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                              inq.status === 'pending'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-neutral-100 text-neutral-500'
                            }`}>
                              {inq.status === 'pending' ? '미처리 대기' : '처리 완료'}
                            </span>
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                              {inq.name}
                            </span>
                            <span className="text-neutral-400 text-[10px] font-mono">
                              {inq.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="p-1.5 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 rounded-lg transition-all cursor-pointer inline-flex text-xs"
                              title="자세히 보기"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => handleToggleInquiryStatus(inq.id)}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer inline-flex text-xs ${
                                inq.status === 'pending'
                                  ? 'text-amber-600 hover:bg-amber-100'
                                  : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900'
                              }`}
                              title={inq.status === 'pending' ? '완료 처리' : '대기 변경'}
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg transition-all cursor-pointer inline-flex text-xs"
                              title="삭제"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-neutral-800 font-sans font-medium line-clamp-1">
                          {inq.title}
                        </div>

                        {inq.productName && (
                          <div className="mt-1.5 text-[10px] font-sans text-neutral-400 flex items-center space-x-1">
                            <span>연관조사제품:</span>
                            <strong className="text-neutral-600 font-semibold underline">{inq.productName}</strong>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: BACKUP & RESTORE DATABASE JSON */}
            {activeTab === 'backup' && (
              <div className="space-y-6 animate-fade-in" id="panel-backup-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    데이터베이스 영구 백업 및 복구
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    현재 브라우저에 저장된 모든 제품 내역, 회사 연락처, 견적 로그를 한꺼번에 JSON 백업하여 오프라인 영구 보관할 수 있습니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {/* Export Box */}
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-150 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-sans mb-2 flex items-center space-x-2">
                        <FileDown size={16} className="text-neutral-400" />
                        <span>백업용 JSON 파일 추출 (내보내기)</span>
                      </h3>
                      <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                        현재까지 입력한 신형 제품 구성품, 슬라이드 배너, 고객 견적 문의 대장 전체를 하나의 로컬 설정 파일로 내려받습니다.
                      </p>
                    </div>

                    <button
                      onClick={handleExportDB}
                      className="mt-6 w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs py-3 rounded-lg cursor-pointer transition-all shadow-sm"
                      id="export-db-btn"
                    >
                      <FileDown size={13} />
                      <span>DB 다운로드</span>
                    </button>
                  </div>

                  {/* Import Box */}
                  <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-150 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-sans mb-2 flex items-center space-x-2">
                        <FileUp size={16} className="text-neutral-400" />
                        <span>백업용 JSON 파일 복원 (가져오기)</span>
                      </h3>
                      <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                        이전에 내보냈던 백업 JSON을 업로드하면, 즉시 로컬 데이터베이스가 덮어씌워져 모든 정보가 그대로 완벽 복원됩니다.
                      </p>
                    </div>

                    <div className="mt-6 relative">
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportDB}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="import-db-input"
                      />
                      <button
                        type="button"
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-700 font-sans font-bold text-xs py-3 rounded-lg pointer-events-none transition-all"
                      >
                        <FileUp size={13} />
                        <span>백업 파일 올리기</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 mt-6">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">가져오기 주의사항</h4>
                    <p className="text-[10px] text-amber-800 font-sans mt-1 leading-relaxed">
                      가져오기 복원을 수행하면 현재 브라우저에 기재해두었던 정보가 완전히 덮어씌워지므로, 기존 자료를 보관하고 싶다면 미리 백업 다운로드해 두시기를 권장합니다.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: SECURITY / ADMIN ACCOUNT CONFIG */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in" id="panel-security-tab">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 font-sans">
                    관리자 로그인 계정 및 비밀번호 변경
                  </h2>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    관리콘솔 접근을 제어하는 아이디(ID)와 비밀번호를 변경하여 보안을 강화합니다.
                  </p>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const targetUser = newUsername.trim();
                  const targetPass = newPassword;
                  
                  if (!targetUser) {
                    alert('새 아이디를 기입해주세요.');
                    return;
                  }
                  if (targetPass.length < 4) {
                    alert('비밀번호는 최소 4자 이상으로 입력해야 합니다.');
                    return;
                  }
                  if (targetPass !== confirmPassword) {
                    alert('새 비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.');
                    return;
                  }

                  localStorage.setItem('dadm_admin_username', targetUser);
                  localStorage.setItem('dadm_admin_password', targetPass);
                  setAdminUsername(targetUser);
                  setAdminPassword(targetPass);
                  
                  setNewUsername('');
                  setNewPassword('');
                  setConfirmPassword('');
                  
                  alert('관리자 계정 정보가 성공적으로 변경되었습니다.');
                }} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-150 space-y-5 max-w-xl">
                  
                  <div>
                    <span className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">
                      현재 등록된 아이디
                    </span>
                    <div className="bg-neutral-100 border border-neutral-200 text-neutral-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold">
                      {adminUsername}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 tracking-wider mb-2 uppercase">
                      새로운 아이디 (ID)
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="변경할 아이디를 기입하세요"
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 tracking-wider mb-2 uppercase">
                      새로운 비밀번호
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="최소 4자 이상의 새 비밀번호"
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 tracking-wider mb-2 uppercase">
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호 확인"
                      className="w-full text-xs sm:text-sm px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs py-3 rounded-xl cursor-pointer shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <span>관리자 계정 변경 저장</span>
                  </button>

                </form>

              </div>
            )}

            {/* TAB 7: POPUP NOTICES MANAGEMENT */}
            {activeTab === 'popups' && (
              <div className="space-y-6 animate-fade-in" id="panel-popups-tab">
                {(!isAddingPopup && !isEditingPopup) ? (
                  /* Standard List State */
                  <>
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 font-sans">
                          메인 페이지 팝업 공지 관리
                        </h2>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          홈페이지 메인 접속 시 노출되는 팝업 공지들을 추가, 수정, 비활성화 혹은 삭제합니다.
                        </p>
                      </div>
                      <button
                        onClick={openAddPopup}
                        className="flex items-center space-x-1 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                        id="add-new-popup-btn"
                      >
                        <Plus size={14} />
                        <span>새 팝업 등록</span>
                      </button>
                    </div>

                    {popups.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                        <MessageSquare size={36} className="text-neutral-300 mx-auto mb-2" />
                        <p className="text-xs text-neutral-400 font-sans">등록된 팝업 공지가 없습니다. 우측 상단의 새 팝업 등록 버튼을 클릭해 첫 공지를 등록해 보세요.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {popups.map((pop) => (
                          <div
                            key={pop.id}
                            className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase">
                                  등록일: {pop.createdAt}
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  pop.isActive
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                                }`}>
                                  {pop.isActive ? '노출 중' : '비활성'}
                                </span>
                              </div>

                              <div className="flex gap-4 mb-4">
                                {pop.imageUrl && (
                                  <div className="w-20 h-24 shrink-0 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center">
                                    <img
                                      src={getDirectImageUrl(pop.imageUrl)}
                                      alt={pop.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                                <div className="space-y-1">
                                  <h3 className="text-sm font-bold text-neutral-900 font-sans leading-tight">
                                    {pop.title}
                                  </h3>
                                  <p className="text-xs text-neutral-500 font-sans line-clamp-3 whitespace-pre-wrap leading-relaxed">
                                    {pop.content}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-neutral-50 border border-neutral-150/80 rounded-xl p-3 space-y-1.5 text-[10px] font-mono text-neutral-500">
                                <div className="flex justify-between">
                                  <span>창 크기(가로 x 세로):</span>
                                  <span className="font-bold text-neutral-700">{pop.width}px x {pop.height}px</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>배치 위치(좌측 / 상단):</span>
                                  <span className="font-bold text-neutral-700">{pop.left}px / {pop.top}px</span>
                                </div>
                                {pop.linkUrl && (
                                  <div className="flex justify-between truncate gap-2">
                                    <span>이동 링크:</span>
                                    <span className="font-bold text-neutral-700 underline truncate select-all">{pop.linkUrl}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                             <div className="flex justify-end items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
                              {popupIdToDelete === pop.id ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-sans text-red-600 font-bold animate-pulse">정말 삭제하시겠습니까?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onUpdatePopups) {
                                        onUpdatePopups(popups.filter(p => p.id !== pop.id));
                                      }
                                      setPopupIdToDelete(null);
                                    }}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs rounded-lg transition-all cursor-pointer"
                                  >
                                    삭제
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPopupIdToDelete(null)}
                                    className="px-3 py-1 border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600 font-sans font-bold text-xs rounded-lg transition-all cursor-pointer"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      if (onUpdatePopups) {
                                        onUpdatePopups(popups.map(p => p.id === pop.id ? { ...p, isActive: !p.isActive } : p));
                                      }
                                    }}
                                    className="px-3 py-1.5 text-xs font-sans font-semibold border border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700 rounded-lg cursor-pointer transition-all"
                                  >
                                    {pop.isActive ? '일시 정지' : '노출 활성화'}
                                  </button>
                                  <button
                                    onClick={() => openEditPopup(pop)}
                                    className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                    title="수정"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => setPopupIdToDelete(pop.id)}
                                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="삭제"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Form State: Add or Edit */
                  <form onSubmit={handleSavePopup} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-neutral-900 font-sans">
                          {isAddingPopup ? '신규 메인 팝업 등록' : '팝업 공지 정보 수정'}
                        </h2>
                        <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                          메인 화면에 오버레이 형태로 전시될 팝업의 텍스트, 이미지, 크기 및 위치 정보를 구성합니다.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsAddingPopup(false); setIsEditingPopup(null); }}
                        className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">팝업 제목 (식별용) <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={popupTitle}
                            onChange={(e) => setPopupTitle(e.target.value)}
                            placeholder="예: 2026년 상반기 조달 우수조경 카탈로그 발간 공지"
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">팝업 본문 안내 문구 <span className="text-red-500">*</span></label>
                          <textarea
                            rows={6}
                            value={popupContent}
                            onChange={(e) => setPopupContent(e.target.value)}
                            placeholder="팝업 본문에 노출할 텍스트를 기입해 주세요."
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-sans whitespace-pre-wrap"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">이미지 주소 (Synology NAS 공유 및 외부 URL 지원)</label>
                          <input
                            type="text"
                            value={popupImageUrl}
                            onChange={(e) => setPopupImageUrl(e.target.value)}
                            placeholder="https://gofile.me/... 또는 이미지 URL"
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">팝업 클릭 시 이동 링크 (선택)</label>
                          <input
                            type="text"
                            value={popupLinkUrl}
                            onChange={(e) => setPopupLinkUrl(e.target.value)}
                            placeholder="https:// 또는 내부 페이지명"
                            className="w-full text-xs sm:text-sm px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-neutral-50 border border-neutral-150 rounded-2xl">
                          <h4 className="text-xs font-bold text-neutral-700 mb-3 flex items-center gap-1.5">
                            <Settings size={13} className="text-neutral-400" />
                            <span>팝업 크기 및 화면 노출 좌표 설정 (PC 기준)</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 mb-1">가로 크기 (Width, px)</label>
                              <input
                                type="number"
                                value={popupWidth}
                                onChange={(e) => setPopupWidth(Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 mb-1">세로 크기 (Height, px)</label>
                              <input
                                type="number"
                                value={popupHeight}
                                onChange={(e) => setPopupHeight(Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 mb-1">좌측 마진 (Left, px)</label>
                              <input
                                type="number"
                                value={popupLeft}
                                onChange={(e) => setPopupLeft(Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-neutral-500 mb-1">상단 마진 (Top, px)</label>
                              <input
                                type="number"
                                value={popupTop}
                                onChange={(e) => setPopupTop(Number(e.target.value))}
                                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-950 font-mono"
                              />
                            </div>
                          </div>
                          <p className="text-[9px] text-neutral-400 mt-3 leading-relaxed">
                            ※ 모바일 화면 비율에서는 디자인 정밀도 유지를 위해 자동으로 화면 정중앙 배치(가로폭에 맞춘 반응형 축소)로 최적화 전환됩니다.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-500 mb-2">즉시 홈페이지 노출 및 활성화 여부</label>
                          <div className="flex items-center space-x-3 bg-neutral-50 border border-neutral-150 p-3.5 rounded-xl">
                            <input
                              type="checkbox"
                              id="popup-active-chk"
                              checked={popupIsActive}
                              onChange={(e) => setPopupIsActive(e.target.checked)}
                              className="h-4.5 w-4.5 accent-neutral-900 border-neutral-300 rounded cursor-pointer"
                            />
                            <label htmlFor="popup-active-chk" className="text-xs text-neutral-700 font-sans cursor-pointer select-none">
                              <strong>활성화 상태</strong> (체크 시 메인 페이지에서 즉시 노출됩니다.)
                            </label>
                          </div>
                        </div>

                        {popupImageUrl && (
                          <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/30">
                            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-2">이미지 실시간 정밀 프리뷰</span>
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 bg-white flex items-center justify-center relative">
                              <img
                                src={getDirectImageUrl(popupImageUrl)}
                                alt="실시간 팝업 프리뷰"
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://picsum.photos/seed/error/400/300';
                                }}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => { setIsAddingPopup(false); setIsEditingPopup(null); }}
                        className="px-5 py-2.5 border border-neutral-200 hover:border-neutral-400 text-neutral-700 font-sans font-bold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        취소하기
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs rounded-xl cursor-pointer transition-all shadow-sm"
                      >
                        {isAddingPopup ? '팝업 등록 완료' : '정보 수정 저장'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* DETAILED INQUIRY MODAL (Full inquiry reading drawer) */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="inquiry-detail-modal">
          <div className="bg-white border border-neutral-100 max-w-xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-neutral-400">CUSTOMER INQUIRY LOG</span>
                <h3 className="text-base font-bold text-neutral-950 font-sans mt-0.5">상담 접수 상세 내역</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <span className="block text-[10px] text-neutral-400 font-semibold mb-1">성함 / 업체명</span>
                  <strong className="text-neutral-800 text-sm">{selectedInquiry.name}</strong>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <span className="block text-[10px] text-neutral-400 font-semibold mb-1">접수 시각</span>
                  <strong className="text-neutral-800 text-sm font-mono">{selectedInquiry.createdAt}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <span className="block text-[10px] text-neutral-400 font-semibold mb-1">연락처</span>
                  <strong className="text-neutral-800 text-sm font-mono">{selectedInquiry.tel}</strong>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <span className="block text-[10px] text-neutral-400 font-semibold mb-1">이메일</span>
                  <strong className="text-neutral-800 text-sm font-mono">{selectedInquiry.email || '기재 안함'}</strong>
                </div>
              </div>

              {selectedInquiry.productName && (
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <span className="block text-[10px] text-neutral-400 font-semibold mb-1">관련 의뢰 제품</span>
                  <strong className="text-neutral-900 text-xs underline">{selectedInquiry.productName} (ID: {selectedInquiry.productId})</strong>
                </div>
              )}

              <div className="border-t border-neutral-100 pt-4">
                <span className="block text-[10px] text-neutral-400 font-semibold mb-1.5">문의 제목</span>
                <p className="text-neutral-900 font-bold leading-relaxed">{selectedInquiry.title}</p>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <span className="block text-[10px] text-neutral-400 font-semibold mb-1.5">문의 및 견적 세부 내역</span>
                <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100 font-sans text-xs sm:text-sm whitespace-pre-line max-h-48 overflow-y-auto">
                  {selectedInquiry.content}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-between gap-3">
              <button
                onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                className="text-xs font-sans font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer border border-red-100"
              >
                영구 삭제
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleInquiryStatus(selectedInquiry.id)}
                  className={`text-xs font-sans font-bold px-4 py-2 rounded-xl cursor-pointer transition-all ${
                    selectedInquiry.status === 'pending'
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {selectedInquiry.status === 'pending' ? '완료 처리하기' : '대기중으로 변경'}
                </button>
                
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs px-5 py-2 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  닫기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
      
      {isHomePopupOpen && (
        <HomeSectionModal
          isOpen={isHomePopupOpen}
          onClose={() => setIsHomePopupOpen(false)}
          homeSectionInfo={homeSectionInfo}
          onSave={onUpdateHomeSectionInfo}
        />
      )}

    </div>
  );
}
