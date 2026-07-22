import { Category, Product, Banner, CompanyInfo, ConstructionProject, HomeSectionInfo, PageHeaders, PopupItem } from '../types';

export const defaultCategories: Category[] = [
  {
    id: 'all',
    name: '전체상품',
    description: 'DADMDESIGN의 명품 가로 시설물 전체 라인업을 소개합니다.',
    icon: 'Grid'
  },
  {
    id: 'pergola',
    name: '파고라',
    description: '공원과 보행 공간에 격조 높은 휴식과 그늘을 선사하는 모던한 디자인 파고라',
    icon: 'Umbrella'
  },
  {
    id: 'pavilion',
    name: '전통형정자',
    description: '한국 고유의 멋과 기품을 담아낸 전통형 정자 및 야외 쉼터',
    icon: 'Landmark'
  },
  {
    id: 'bench',
    name: '옥외용벤치',
    description: '유려한 곡선과 최고급 천연 휴먼 목재가 주는 따뜻한 감각의 명품 야외 벤치',
    icon: 'Sofa'
  },
  {
    id: 'bin',
    name: '분리수거장',
    description: '거리 미관을 한층 높이고 유지관리가 뛰어난 위생적인 분리수거함 및 쉘터형 수거장',
    icon: 'Recycle'
  },
  {
    id: 'bicycle',
    name: '자전거보관대',
    description: '자전거와 모빌리티를 안전하고 깔끔하게 보관하는 전용 보관대 및 쉘터',
    icon: 'Bike'
  },
  {
    id: 'fitness',
    name: '야외운동시설물',
    description: '시민의 건강 증진을 위해 야외 공원에 설치하는 전문 운동 기구',
    icon: 'Dumbbell'
  },
  {
    id: 'bollard',
    name: '기타공공시설',
    description: '보행 안전과 경관 보존을 책임지는 볼라드, 플랜터, 화분대 등의 공공 시설물',
    icon: 'Trees'
  }
];

export const defaultBanners: Banner[] = [
  {
    id: 'banner1',
    title: '시간이 흘러도 품격을 잃지 않는 명품 조경시설물',
    subtitle: '조달청 나라장터 공식 등록 우수 조경 디자인 브랜드 DADMDESIGN',
    imageUrl: '/src/assets/images/street_pergola_1783302650051.jpg'
  },
  {
    id: 'banner2',
    title: '자연과 도심이 조화롭게 만나는 휴게 공간',
    subtitle: '천연 하드우드와 내구성 강화 메탈 공법의 혁신적인 융합 디자인',
    imageUrl: '/src/assets/images/street_bench_1783302667162.jpg'
  },
  {
    id: 'banner3',
    title: '지속 가능한 내일을 디자인하다',
    subtitle: '최고급 친환경 오일스테인 목재와 부식 방지 정전분체도장 스틸 프레임',
    imageUrl: '/src/assets/images/street_planter_1783302680596.jpg'
  }
];

export const defaultCompanyInfo: CompanyInfo = {
  name: '주식회사 다듬디자인',
  englishName: 'DADMDESIGN CO., LTD.',
  representative: '임정자',
  tel: '053-327-0015',
  fax: '053-327-1015',
  email: 'dadmdesign@naver.com',
  address: '대구 북구 서변로21길 7, 102호',
  factoryAddress: '경북 김천 영남대로3251',
  businessNo: '',
  mailOrderNo: '',
  website: 'http://www.dadmdesign.co.kr',
  aboutUsTitle: '자연과 인간, 그리고 도시를 잇는 아름다움',
  aboutUsText: '주식회사 다듬디자인은 대한민국 조달청 나라장터 우수 조달 지정업체로서, 명품 야외 벤치, 파고라, 플랜터, 도시 환경 위생 시설물 등 프리미엄 가로 조경시설을 전문적으로 기획, 연구개발, 제작 및 직영 납품하고 있습니다. 오랜 시간 보장되는 압도적인 견고함과 자연주의적 마감 감각을 접목하여 조경 공간의 품격을 극대화하며, 대한민국 국토 경관 향상에 기여하고 있습니다.',
  aboutUsImage: '/src/assets/images/street_bench_1783302667162.jpg',
  mapAddress: '대구 북구 서변로21길 7',
  asAlertEmail: 'dadmdesign@naver.com',
  catalogAlertEmail: 'dadmdesign@naver.com',
  narajangterMarkUrl: '',
  historyList: [
    {
      id: 'h-1',
      year: '2026',
      yearShort: '26',
      badge: 'Global & Procurement Expansion',
      title: '조달청 우수 가로시설물 추가 지정 및 라인업 확대',
      bullets: [
        '조달청 나라장터 쇼핑몰 스마트 쉼터 파고라 신규 품목 등록 완료',
        '친환경 하드우드 샌딩 및 내후 가공 특허 디자인 2건 출원',
        '대단지 주택단지 테라스 조경 시공 누적 150개소 돌파'
      ]
    },
    {
      id: 'h-2',
      year: '2025',
      yearShort: '25',
      badge: 'R&D & Brand Award',
      title: '디자인 연구소 정식 인가 및 서울우수공공디자인 선정',
      bullets: [
        '다듬디자인 기업부설 가로설계 연구소 설립',
        '서울특별시 주관 제22회 우수공공디자인 조경 벤치 부문 우수 선정',
        '풍동 하중 안전 시험 및 샌딩 3단계 강화 공정 개발 적용'
      ]
    },
    {
      id: 'h-3',
      year: '2024',
      yearShort: '24',
      badge: 'Corporation Setup',
      title: '(주)다듬디자인 법인 전환 및 직접생산공장 등록',
      bullets: [
        '개인사업자에서 주식회사 다듬디자인 법인 격상 전환',
        '조달청 경쟁입찰 참가자격 획득 및 직접생산증명(가로시설물) 취득',
        '공장 및 제조 설비 통합 이전 완료 (야외 목재 가공 전용 라인 증설)'
      ]
    },
    {
      id: 'h-4',
      year: '2022',
      yearShort: '22',
      badge: 'Foundation',
      title: '다듬디자인 조경 스튜디오 설립',
      bullets: [
        '친환경 천연목재 기반 야외 가구 제작 전문 다듬디자인 설립',
        '전국 아파트 단지 특화 수주 협의 및 시공 개시'
      ]
    }
  ],
  carDirections: '네비게이션에 \'다듬디자인\' 또는 본사 주소인 대구 북구 서변로21길 7 검색. 방문 고객 전용 지상 무료 주차 2시간을 상시 지원합니다.',
  subwayDirections: '6호선 / 경의중앙선 / 공항철도 디지털미디어시티역 9번 출구에서 수색교 방면으로 도보 약 8분 거리(약 600m)에 위치하고 있습니다.',
  busDirections: '누리꿈스퀘어.MBC 및 첨단산업센터 버스정류장 하차 후 도보 2분. 지선 7711, 7730, 간선 271, 470, 광역 9711 버스 이용 시 편리합니다.'
};

export const defaultProducts: Product[] = [
  {
    id: 'prod-01',
    categoryId: 'pergola',
    isProcurement: true,
    isSignature: true,
    name: '디럭스 스마트 휴게 파고라',
    identificationNo: '23450912',
    size: 'W4500 x D3200 x H2900 (mm)',
    price: 18500000,
    images: [
      '/src/assets/images/street_pergola_1783302650051.jpg',
      'https://picsum.photos/seed/pergola-detail1/800/600',
      'https://picsum.photos/seed/pergola-detail2/800/600'
    ],
    material: '고강도 알루미늄 구조재 + 고급 이페 천연목재 루버',
    finish: '야외용 내후성 정전분체도장 + 친환경 오일스테인 3회 도장',
    featureText: '스마트 LED 안심 야외 경관 조명 내장 및 친환경 태양광 루버 장착형 스마트 파고라',
    description: '### (주)다듬디자인 스마트 파고라 시리즈\n\n현대적인 도시 경관에 걸맞는 모던하고 시크한 메탈 그리드형 파고라입니다. 천정부에 고급 하드우드 루버를 차양 각도에 맞춰 수평 설계하여 자연스러운 투광율을 제공하며, 내부에는 스마트 디바이스 충전 시스템 및 야간 오토 LED 센서 조명이 내장되어 있습니다.\n\n#### 주요 특징\n- **친환경 내구성**: 열대 남미산 천연 이페 목재를 사용하여 해충과 휨 현상에 극도로 뛰어납니다.\n- **정밀 메탈 공법**: 고강도 압출 알루미늄 프레임을 레이저 CNC 정밀 절삭하여 녹물 배출 우려가 전혀 없습니다.\n- **도시 조화성**: 세련된 차콜 블랙 메탈과 웜톤 목재의 세련된 조화로 공원 및 휴게 정원에 안성맞춤입니다.',
    drawingNo: 'DADM-PG-2026A',
    options: '풍량 센서 연동 전동 블라인드 루버, 안개 분무 미스트 쿨링 시스템(선택)',
    hasCad: true,
    hasPdf: true,
    designMaterialEnabled: true,
    designMaterialUrl: 'https://mynas.synology.me:5001/fbsharing/api/download?id=AbCdEfGh',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-02',
    categoryId: 'bench',
    isProcurement: true,
    isSignature: true,
    name: '컴포트 하이브리드 야외 평벤치',
    identificationNo: '24103988',
    size: 'W1800 x D480 x H420 (mm)',
    price: 480000,
    images: [
      '/src/assets/images/street_bench_1783302667162.jpg',
      'https://picsum.photos/seed/bench-detail1/800/600',
      'https://picsum.photos/seed/bench-detail2/800/600'
    ],
    material: '고밀도 압출 친환경 합성목재 + 고강도 탄소강 스틸 프레임',
    finish: '야외 고내후성 우레탄 2차 하이브리드 코팅 + UV 자외선 차단 도료',
    featureText: '공학적인 최적의 인체 편의 곡면 설계 및 노출 콘크리트 베이스 하이브리드 평벤치',
    description: '### (주)다듬디자인 친환경 벤치 컬렉션\n\n대규모 아파트 숲, 근린 상가 광장, 수변 공원 산책로 등에 보편적이면서도 감각적으로 배치하기에 가장 훌륭한 스트레이트 디자인 야외 평벤치입니다.\n\n#### 설계 및 미학적 관점\n- **콘크리트 & 하드우드의 만남**: 하부 다리 부분에 매끈하게 라운딩 처리된 건축용 노출 콘크리트 공법을 도입하여 무게감과 흔들림 없는 안도감을 안겨줍니다.\n- **인체 가압 분산형 가공**: 앉는 면의 목재 엣지 라인을 다듬어 다리 저림이나 긁힘 등 사용 중 일어날 수 있는 경미한 안전사고를 미연에 방지합니다.',
    drawingNo: 'DADM-BC-409B',
    options: '하부 앵커 매립형 다리, 앙카 외부 노출형 다리 선택',
    hasCad: true,
    hasPdf: true,
    createdAt: '2026-02-11'
  },
  {
    id: 'prod-03',
    categoryId: 'bollard',
    isProcurement: true,
    isSignature: true,
    name: '라인 디자인 스틸 플랜터 세트',
    identificationNo: '23594012',
    size: 'W1200 x D500 x H650 (mm)',
    price: 720000,
    images: [
      '/src/assets/images/street_planter_1783302680596.jpg',
      'https://picsum.photos/seed/planter-detail1/800/600'
    ],
    material: 'EGI 전기아연도금 강판 2.0T + 멀바우 천연 하드우드 사이드 포인트',
    finish: '실외 전용 함체 폴리에스터 엠보 분체도장 + 우드 에어타이트 방수 실링',
    featureText: '빌딩 로비 및 광장 보행 통로용 토양 하중 변형 방지 이중 내부 보강대 가공 플랜터',
    description: '### (주)다듬디자인 가로 식재 플랜터\n\n인도와 화단을 구분하고, 도시의 콘크리트 바닥에 푸른 생명을 심기 위한 직사각형 모던 플랜터박스입니다. 사이드에 세련된 천연목재 스트라이프 데코 라인을 삽입하여 심플하지만 고급스러움을 잃지 않습니다.\n\n#### 특징\n- **이중 누수 배수 시스템**: 토사와 식물이 가중하는 습기로 철판이 부식되지 않도록 고탄성 아스팔트 프라이머 내부 방청 도장이 꼼꼼히 입혀져 있습니다.\n- **중량 안심 구조**: 흙 무게에 밀려 금속 외벽이 뚱뚱해지는 벌징 현상을 완벽 차단하기 위해 중앙 크로스 타이 보강 프레임이 격벽 형태로 고정되어 있습니다.',
    drawingNo: 'DADM-PL-701X',
    options: '하부 고정용 가로 조절좌 플레이트, 하부 히든 우레탄 바퀴 장착(실내용)',
    hasCad: true,
    hasPdf: false,
    createdAt: '2026-03-24'
  },
  {
    id: 'prod-04',
    categoryId: 'bin',
    isProcurement: true,
    isSignature: true,
    name: '디럭스 하이브리드 분리수거 쓰레기통',
    identificationNo: '21102934',
    size: 'W950 x D480 x H1020 (mm)',
    price: 1150000,
    images: [
      'https://picsum.photos/seed/trash-bin/800/600',
      'https://picsum.photos/seed/trash-bin-detail/800/600'
    ],
    material: 'STS304 최고급 스테인리스 스틸 + 방부 하드우드 전면 패널',
    finish: '스테인리스 헤어라인 아노다이징 + 오일코팅 스크래치 방지 처리',
    featureText: '투입구 비가림 후드 타입 설계 및 내부 침출수 수거용 드레인 포트 내장 휴지통',
    description: '### DADMDESIGN 가로 환경 정비 휴지통\n\n대한민국 전역 공원과 버스 정류장 근처 등 가로 보행 거리에 아름다움을 지키기 위해 고안된 최고급 대형 트윈 분리수거 쓰레기통입니다. 일반쓰레기용과 재활용용 투입구를 명확히 각인 처리하고 인서트 우드를 통해 시각적 친밀감을 높였습니다.',
    drawingNo: 'DADM-TR-102T',
    options: '내부 탈착형 대용량 PE 수거통(60L) 2개 세트 포함',
    hasCad: true,
    hasPdf: true,
    createdAt: '2026-04-05'
  },
  {
    id: 'prod-05',
    categoryId: 'bollard',
    isProcurement: true,
    isSignature: true,
    name: 'LED 라인 매립형 탄성 디자인 볼라드',
    identificationNo: '22894056',
    size: 'Ø165 x H850 (mm)',
    price: 320000,
    images: [
      'https://picsum.photos/seed/bollard1/800/600',
      'https://picsum.photos/seed/bollard2/800/600'
    ],
    material: '고탄성 폴리우레탄 충격 흡수 바디 + LED 고휘도 라인 조명 모듈',
    finish: '우레탄 무황변 고광택 UV 반사 하이그로시 마감',
    featureText: '차량 충돌 시 90도 벤딩 후 원형 복원력이 우수해 차량 및 보행자 동시 안전 보호 볼라드',
    description: '### DADMDESIGN 보행자 안전 볼라드\n\n차량이 인도로 돌입하는 것을 차단하고 보행자의 야간 안전을 위해 저전력 고휘도 LED 링 라이트를 탑재한 하이엔드 볼라드 시설물입니다. 내부 코어에 충격 흡수 스프링 버퍼를 내장하여 돌발 사고 시에도 2차 충격을 무력화합니다.',
    drawingNo: 'DADM-BL-011S',
    options: '태양광 자가발전 센서 헤드 탑재형 가동식 체인 걸이(옵션)',
    hasCad: false,
    hasPdf: true,
    createdAt: '2026-05-18'
  },
  {
    id: 'prod-06',
    categoryId: 'pergola',
    isProcurement: true,
    isSignature: true,
    name: '모던 큐빅 쉘터 파고라 (스틸&우드)',
    identificationNo: '23450915',
    size: 'W3600 x D3600 x H2700 (mm)',
    price: 15400000,
    images: [
      'https://picsum.photos/seed/pergola-cubic/800/600',
      'https://picsum.photos/seed/pergola-cubic2/800/600'
    ],
    material: '고장력 정사각 스틸 칼럼 + 적삼목(Red Cedar) 자연 천연목 목재 마감',
    finish: '불소수지 방청 엠보도장 + 실외 발수 UV차단 왁싱 코팅',
    featureText: '심플한 입방체 큐브 조형으로 도심 광장, 학교 야외 쉼터에 가장 잘 부합하는 에코 쉘터',
    description: '### DADMDESIGN 정사각 모던 쉘터\n\n가장 미니멀한 입방체 큐브 조형으로 기하학적인 깔끔한 레이아웃을 지향하는 쉘터 파고라입니다. 천정부와 측면부의 가림 슬랫 비율을 정밀하게 나누어, 시원하게 개방되면서도 정오의 뜨거운 햇빛은 안전하게 막아주는 자연 물리학적 각도를 적용했습니다.',
    drawingNo: 'DADM-PG-303C',
    options: '하부 일체형 야외 티테이블 세트 추가(별도)',
    hasCad: true,
    hasPdf: true,
    createdAt: '2026-05-20'
  },
  {
    id: 'prod-07',
    categoryId: 'bench',
    isProcurement: true,
    isSignature: true,
    name: '모던 라운드 가든 조경 벤치 (등받이형)',
    identificationNo: '24103989',
    size: 'W2000 x D620 x H780 (mm)',
    price: 680000,
    images: [
      'https://picsum.photos/seed/bench-round/800/600',
      'https://picsum.photos/seed/bench-round2/800/600'
    ],
    material: '최고급 하드우드 천연목 이페 + 주철 주조 프레임 다리',
    finish: '친환경 가든 전용 수성 스테인 도포 + 주조 무광 다크그레이 프라이머 방습 도금',
    featureText: '곡선의 우아함과 주조 무쇠 다리가 하중을 견고하게 받쳐주는 최고급 정원형 등받이 벤치',
    description: '### DADMDESIGN 클래식 가든 등벤치\n\n야외 벤치의 최고 존엄이라 불리는 남미산 이페 원목과 묵직한 주철 조형 다리를 조화시켜 오랫동안 가로 조경의 중심을 잡아줄 수 있는 시그니처 등받이 벤치입니다.\n\n#### 상세 특징\n- **천연 오일 마감**: 기계 건조 후 샌딩 과정을 여러 번 반복하여 손끝에 가시가 걸리지 않고 가죽처럼 부드러운 목질 표면을 유지합니다.\n- **무쇠 주조 프레임**: 바닷가 염분이나 극한의 한파 속에서도 다리가 삭거나 균열이 생기지 않도록 고온 전기로에서 뽑아낸 고급 주물 공법 다리입니다.',
    drawingNo: 'DADM-BC-772R',
    options: '중간 팔걸이 안티-라이잉 바(Anti-lying bar) 장착 가능',
    hasCad: true,
    hasPdf: true,
    createdAt: '2026-06-02'
  },
  {
    id: 'prod-08',
    categoryId: 'bollard',
    isProcurement: true,
    isSignature: true,
    name: '육각 헤링본 천연목 대형 플랜터',
    identificationNo: '23594015',
    size: 'W900 x D900 x H750 (mm)',
    price: 880000,
    images: [
      'https://picsum.photos/seed/planter-hex/800/600',
      'https://picsum.photos/seed/planter-hex2/800/600'
    ],
    material: '아피통 원목 외장재 + 아연도금 프레임 내부 보강함 + 전용 배수 시트 라이너',
    finish: '천연 아스팔트 하부 부패 방지 방수씰 코팅 + 오일 왁스 마감',
    featureText: '유니크한 육각형 헤링본 패턴 우드 외장으로 화초의 생명력과 세련미를 동시에 증폭하는 대형 플랜터',
    description: '### DADMDESIGN 입체 육각 플랜터 컬렉션\n\n백화점 야외 데크정원, 고급 테라스 가든, 도심 광장용 프리미엄 대형 우드 플랜터입니다. 입체적인 목재 가공 기술인 헤링본 패턴을 금속 함체 위에 결합해 타 사 가로 플랜터와 차별화된 극적인 디자인을 지향합니다.',
    drawingNo: 'DADM-PL-990H',
    options: '이동용 휠셋 캐스터 매립, 야간 하부 무드 간접 LED 라인 조립(옵션)',
    hasCad: false,
    hasPdf: false,
    createdAt: '2026-06-15'
  }
];

export const defaultPriceData = [
  {
    id: 'price-2026-07',
    yearMonth: '2026.07',
    title: '2026년 07월 가로시설물 종합 조달 단가 및 자재비 고시표',
    description: '7월 정기 조달 단가표입니다. 고강도 친환경 합성 목재 및 고내후성 탄소강 프레임의 원자재 변동 추이가 반영되었으며, 쉘터형 파고라 및 하이브리드 디자인 벤치 28개 품목의 확정 단가가 수록되어 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-7a39e2d97dbc?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-07-01'
  },
  {
    id: 'price-2026-06',
    yearMonth: '2026.06',
    title: '2026년 06월 스마트 친환경 가로 시설 및 조경 파고라 표준단가',
    description: '6월 공원용 가로 휴게 쉼터 및 분리수거장 쉘터 신규 품목 추가 고시가 적용된 설계 표준단가표입니다. CAD 도면 승인용 자재 사양 요약본이 함께 수록되어 있어 즉각적인 설계 매핑이 가능합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-06-01'
  },
  {
    id: 'price-2026-05',
    yearMonth: '2026.05',
    title: '2026년 05월 공공기관 납품 전용 우수조달 디자인 벤치 표준단가',
    description: '5월 기준 전국 지방자치단체 및 공공기관 공원 정원 조경 설계에 의무 적용되는 디자인 벤치 및 볼라드 정식 고시단가표입니다. 천연목재 이페 가공 단가 및 주철 프레임 하중 검사 통과 내역서 포함.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-01'
  }
];

export const defaultConstructionProjects: ConstructionProject[] = [
  {
    id: 'proj-1',
    title: '용인 역북 푸르지오 신축 단지 조경 시설 시공',
    location: '경기도 용인시 처인구 역북동',
    period: '2026.04 - 2026.05',
    items: '디자인 등벤치 20대, 평벤치 15대, 휴게 쉘터 2동',
    description: '단지 내 주요 보행 산책로 및 중앙 테라스 쉼터 구역에 고급 이페 원목 등받이 벤치와 평벤치를 맞춤 앙카식으로 견고하게 설치 완료하였습니다. 콘크리트 베이스 하이브리드 공법을 적용하여 장기 하중에도 흔들림 없는 완벽한 내구성을 실현하였습니다.',
    image: '/src/assets/images/street_bench_1783302667162.jpg',
    tag: '공동주택 조경'
  },
  {
    id: 'proj-2',
    title: '수성 지구 신도시 중앙호수공원 스마트 휴게 공간 조성',
    location: '대구광역시 수성구 중앙호수공원',
    period: '2026.02 - 2026.03',
    items: '대형 스마트 LED 파고라 쉘터 5동, 디자인 쓰레기통 12세트',
    description: '수변 산책로 광장에 자가발전 태양광 센서 조명이 탑재된 디럭스 스마트 파고라를 연동하여 설치하였습니다. 밤길 안심 조명 설계 및 스마트 충전 기기 등 시민 편의 중심의 인터랙티브 쉼터 조성 사업입니다.',
    image: '/src/assets/images/street_pergola_1783302650051.jpg',
    tag: '도시근린공원'
  },
  {
    id: 'proj-3',
    title: '상암 하늘공원 산책로 친환경 테라스 쉼터 시공',
    location: '서울특별시 마포구 상암동',
    period: '2025.10 - 2025.11',
    items: '스틸 라인 플랜터 30세트, 프리미엄 트윈 쓰레기통 15대',
    description: '공공 이용률이 극도로 높은 하늘공원 진입 광장과 산책로에 수목 생육 보호를 겸한 이중 보강 금속 플랜터와 STS304 고밀도 방부 우드 쓰레기통을 시공하였습니다. 잦은 기후 변화와 수분 노출에도 부식이 일어나지 않도록 내부 특수 방수 방청 씰링 마감을 더했습니다.',
    image: '/src/assets/images/street_planter_1783302680596.jpg',
    tag: '공공기관 납품'
  }
];

export const defaultHomeSectionInfo: HomeSectionInfo = {
  slogan: 'Our Integrity & Trust',
  title: '나라가 보장하는 안심 공정 & 우수 자재',
  description: '(주)다듬디자인은 전 생산 라인을 경기도 공장에서 엄격히 직영 가동합니다. 최첨단 CNC 정밀 절삭 레이저 프레임 공정물과 100% 천연 하드우드 목재 원료만을 엄선하여, 혹독한 계절 변화에서도 비틀림이나 녹물 배출 없는 초강력 조경 수명 보증을 선사합니다.',
  point1Title: '국가 우수조달 공동 브랜드',
  point1Text: '조달청 나라장터 종합쇼핑몰 정식 제품 등록 및 직접생산증명 필한 정식 인증 함체',
  point2Title: '친환경 최고 등급 하드우드 천연목재',
  point2Text: '열대 남미산 천연 이페(Ipe), 멀바우 및 친환경 탄화 처리 오일 에스테인 3회 이상 가공 완료',
  point3Title: '도면 및 CAD 완벽 기술 설계 협조',
  point3Text: '조경설계사무소를 위한 세부 dwg 설계 도면 제공 및 3D 모델링 랜더링 스펙 지원 서비스',
  imageUrl: '/src/assets/images/street_pergola_1783302650051.jpg',
  imageTitle: '수성 지구 신도시 중앙호수공원 납품 현장',
  imageSubtitle: '대형 스마트 LED 쉘터 파고라 단지 설치 완공 전경',
  catShowcaseSlogan: 'DADMDESIGN Collections',
  catShowcaseTitle: '공간의 격을 높이는 가로 시설물 제품군',
  featuredSlogan: 'Featured Products',
  featuredTitle: '다듬디자인 시그니처 조달 우수제품',
  procurementAutoPlayInterval: 2
};

export const defaultPageHeaders: PageHeaders = {
  about: {
    slogan: 'About DADMDESIGN',
    title: '다듬디자인을 소개합니다',
    description: '최고의 랜드마크를 완성하는 프리미엄 조경 디자인 가구의 선두주자'
  },
  procurement: {
    slogan: '나라장터 조달청 종합쇼핑몰 등재제품',
    title: '조달등록제품 전시관',
    description: '엄격한 조달 표준 규격을 충족하여 신뢰할 수 있는 우수 조달 가로 시설물 리스트입니다.'
  },
  products: {
    slogan: 'DADMDESIGN Catalog',
    title: '제품 전시관',
    description: '조달청 등재 최상의 품질을 보장합니다. 최고의 품질과 감각적인 디자인으로 공간의 품격을 높입니다.'
  },
  inquiry: {
    slogan: 'Customer Support Center',
    title: '다듬디자인 고객지원 센터',
    description: '필요하신 자료 요청부터 시공 후 사후 하자 서비스까지 원스톱으로 지원해 드립니다. 온라인 접수 즉시 당사 엔지니어가 직접 검토 후 신속하게 메일과 문자, 유선으로 응대하겠습니다.'
  },
  construction: {
    slogan: 'Construction Portfolio',
    title: '건설사업 및 시공 실적',
    description: '다듬디자인의 엄격한 자재 선별과 완벽한 밀착 직영 시공팀이 완성한 격조 높은 조경 시설 현장들입니다.'
  },
  catalog: {
    slogan: '',
    title: '종합 카탈로그 / 지면용 도면 브로셔 신청',
    description: '원하시는 제품군의 정밀 설계 규격과 카탈로그를 바로 요청하실 수 있습니다.'
  },
  as: {
    slogan: '',
    title: '옥외 가로시설물 신속 하자접수 및 유지보수 신청',
    description: '다듬디자인 명품 하자보증 보장 서비스입니다. 접수해주시면 긴급 모바일 긴급 출동팀이 현장으로 긴급 배정됩니다.'
  }
};

export const defaultPopups: PopupItem[] = [
  {
    id: 'popup-1',
    title: '다듬디자인 하반기 특별 조달 등록 안내',
    content: '당사의 스마트 파고라 2개 모델이 조달청 우수 조달 가로시설물로 공식 지정 완료되었습니다. 자세한 카탈로그는 고객지원 탭에서 신청 가능합니다.',
    imageUrl: '/src/assets/images/street_pergola_1783302650051.jpg',
    linkUrl: '',
    isActive: true,
    width: 440,
    height: 520,
    left: 80,
    top: 100,
    createdAt: '2026-07-12'
  }
];



