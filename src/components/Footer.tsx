import React from 'react';
import { User } from 'lucide-react';
import { CompanyInfo } from '../types';

interface FooterProps {
  companyInfo: CompanyInfo;
  activePage?: string;
  setActivePage: (page: any) => void;
}

export default function Footer({ companyInfo, activePage, setActivePage }: FooterProps) {
  return (
    <footer className="bg-neutral-900 text-neutral-400 font-sans text-xs border-t border-neutral-800" id="dadm-footer">
      
      {/* Top row with helpful quick items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-neutral-800/60 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-extrabold text-neutral-200 tracking-tight">DADMDESIGN 다듬디자인</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-300">
          <button
            onClick={() => setActivePage('about')}
            className="hover:text-white transition-colors cursor-pointer text-xs"
          >
            회사소개
          </button>
          <button
            onClick={() => setActivePage('products')}
            className="hover:text-white transition-colors cursor-pointer text-xs"
          >
            제품소개
          </button>
          <button
            onClick={() => setActivePage('inquiry')}
            className="hover:text-white transition-colors cursor-pointer text-xs"
          >
            온라인견적문의
          </button>
          <button
            onClick={() => setActivePage('admin')}
            className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer text-xs font-mono font-semibold"
          >
            <User size={12} />
            <span>ADMIN LOGIN</span>
          </button>
        </div>
      </div>

      {/* Middle row with formal business registration fields */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          
          {/* Corporate Identity single row */}
          <div className="w-full">
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-x-2 lg:gap-x-2 gap-y-2 text-neutral-300 text-xs md:text-[13px] lg:text-[13.5px] xl:text-sm font-medium whitespace-nowrap leading-relaxed">
              <span>상호명 : <strong className="text-neutral-100 font-bold">{companyInfo.name}</strong></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>대표이사 : <span className="text-neutral-200">{companyInfo.representative}</span></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>전화 : <span className="font-mono text-neutral-100 font-bold">{companyInfo.tel}</span></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>팩스 : <span className="font-mono text-neutral-200">{companyInfo.fax || '정보 없음'}</span></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>이메일 : <span className="font-mono text-neutral-200">{companyInfo.email}</span></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>본사 : <span className="text-neutral-200">{companyInfo.address}</span></span>
              <span className="text-neutral-700 font-light hidden lg:inline">|</span>
              <span>공장 : <span className="text-neutral-200">{companyInfo.factoryAddress || '경북 김천 영남대로3251'}</span></span>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-400 pt-4 mt-3 leading-relaxed border-t border-neutral-800/60">
              본 웹사이트에 수록된 파고라, 쉘터, 벤치, 플랜터 등의 디자인 권리 및 설계 도면 파일 저작권은 (주)다듬디자인에 있습니다. 무단 복제 및 도용을 엄격히 금지합니다.
            </p>
          </div>

        </div>
      </div>

    </footer>
  );
}
