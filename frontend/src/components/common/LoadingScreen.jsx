import IetLogo from "./IetLogo";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-center px-4" style={{ minHeight: '100vh' }}>
      <div className="flex flex-col items-center gap-4">
        <IetLogo className="w-24 h-24" />
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">IET LUCKNOW</h1>
        <p className="text-xl md:text-2xl font-black tracking-wider text-black">LOADING</p>
        <div className="flex gap-2 mt-2">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse delay-150" />
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
}