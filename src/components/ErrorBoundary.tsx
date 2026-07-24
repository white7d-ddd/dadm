import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Readonly<Props>;
  declare state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dadm_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed clearing storage:', e);
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 font-sans text-neutral-800">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
              !
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
                일시적인 실행 오류가 발생했습니다
              </h2>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                화면을 로딩하는 도중 오류가 발생하였습니다. 데이터 초기화 및 새로고침을 진행하시면 정상적으로 화면이 복구됩니다.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-neutral-100 p-3 rounded-xl text-left font-mono text-[11px] text-neutral-600 overflow-x-auto max-h-28">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                저장 데이터 초기화 후 복구
              </button>
              <button
                onClick={this.handleReload}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                단순 새로고침
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
