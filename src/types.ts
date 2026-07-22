export interface Product {
  id: string;
  categoryId: string;
  name: string; // 모델명
  identificationNo: string; // 조달식별번호 / 식별번호
  size: string; // 제품 규격 (예: W2000 x D600 x H450)
  price: number; // 판매 금액
  images: string[]; // 이미지 경로 리스트 (첫번째가 대표 이미지)
  material: string; // 주요 재질 (예: 하드우드 천연목재, 고강도 알루미늄, 분체도장 스틸)
  finish: string; // 마감 처리 (예: 친환경 오일스테인 도장, 야외용 정전분체도장)
  featureText: string; // 제품 특징 요약 (예: 유려한 곡선 디자인과 우수한 내구성)
  description: string; // 제품 상세 설명 (마크다운 지원)
  drawingNo: string; // 도면 번호
  options: string; // 선택 사양 (예: LED 조명 추가 가능, 색상 변경 가능)
  hasCad: boolean; // CAD 도면 다운로드 여부
  hasPdf: boolean; // PDF 카탈로그 다운로드 여부
  isProcurement?: boolean; // 조달등록제품 여부
  isSignature?: boolean; // 시그니처 조달 우수제품 여부
  designMaterialEnabled?: boolean; // 설계자료 다운로드 활성화 여부
  designMaterialUrl?: string; // 설계자료 다운로드 URL (시놀로지 나스 등)
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface HistoryItem {
  id: string;
  year: string;
  yearShort: string;
  badge: string;
  title: string;
  bullets: string[];
}

export interface CompanyInfo {
  name: string; // 회사명
  englishName: string; // 영문 회사명
  representative: string; // 대표자
  tel: string; // 전화번호
  fax: string; // 팩스
  email: string; // 이메일
  address: string; // 주소
  factoryAddress?: string; // 공장 주소
  businessNo?: string; // 사업자등록번호
  mailOrderNo?: string; // 통신판매업신고번호
  website?: string; // 홈페이지 주소
  aboutUsText: string; // 회사소개 텍스트
  aboutUsTitle: string; // 회사소개 서브 타이틀
  aboutUsImage?: string; // 회사소개 대표 이미지
  mapAddress: string; // 지도 검색용 주소
  asAlertEmail?: string; // A/S 접수시 알림 수신 이메일
  catalogAlertEmail?: string; // 카탈로그 신청시 알림 수신 이메일
  historyList?: HistoryItem[]; // 회사연혁 리스트
  carDirections?: string; // 자가용 이용 안내
  subwayDirections?: string; // 지하철 이용 안내
  busDirections?: string; // 버스 이용 안내
  narajangterMarkUrl?: string; // 나라장터 마크 이미지 URL
}

export interface Inquiry {
  id: string;
  name: string; // 성함 / 업체명
  tel: string; // 연락처
  email: string; // 이메일
  title: string; // 제목
  content: string; // 내용
  productId?: string; // 문의 제품 ID
  productName?: string; // 문의 제품명
  status: 'pending' | 'reviewed'; // 처리 상태
  createdAt: string;
}

export interface Category {
  id: string;
  name: string; // 카테고리 명
  description: string; // 카테고리 설명
  icon?: string; // 카테고리 아이콘 명
  isProcurement?: boolean; // 조달등록 카테고리 노출 여부
  isGeneral?: boolean; // 일반제품 카테고리 노출 여부
}

export interface PriceData {
  id: string;
  yearMonth: string; // 예: "2026.07"
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface ConstructionProject {
  id: string;
  title: string;
  location: string;
  period: string;
  items: string;
  description: string;
  image: string;
  tag: string;
}

export interface HomeSectionInfo {
  slogan: string;
  title: string;
  description: string;
  point1Title: string;
  point1Text: string;
  point2Title: string;
  point2Text: string;
  point3Title: string;
  point3Text: string;
  imageUrl: string;
  imageTitle: string;
  imageSubtitle: string;
  catShowcaseSlogan?: string;
  catShowcaseTitle?: string;
  featuredSlogan?: string;
  featuredTitle?: string;
  procurementAutoPlayInterval?: number; // 조달 우수제품 자동 재생 간격 (초 단위)
}

export interface PageHeaderInfo {
  slogan: string;
  title: string;
  description: string;
}

export interface PageHeaders {
  about: PageHeaderInfo;
  procurement: PageHeaderInfo;
  products: PageHeaderInfo;
  inquiry: PageHeaderInfo;
  construction: PageHeaderInfo;
  catalog: PageHeaderInfo;
  as: PageHeaderInfo;
}

export interface PopupItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  width?: number; // Default 400
  height?: number; // Default 500
  left?: number;
  top?: number;
  createdAt: string;
}


