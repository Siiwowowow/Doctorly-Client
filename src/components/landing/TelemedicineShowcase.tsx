/* eslint-disable react/no-unescaped-entities */
import { Video, Mic, Share2, MoreHorizontal, MessageSquare, PhoneOff, CheckCircle2, FileText, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function TelemedicineShowcase() {
  const t = useTranslations("showcase");
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-doctorly-text mb-4 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {/* Dashboard Showcase Composition */}
        <div className="relative max-w-6xl mx-auto flex justify-center">
          
          {/* Main Dashboard UI (70% width style on large screens) */}
          <div className="w-full lg:w-[85%] bg-[#F8FAFC] rounded-[24px] border border-gray-200 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
            
            {/* Left side: Video Area (2/3 width) */}
            <div className="flex-1 p-4 flex flex-col gap-4">
              
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-doctorly-primary flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-doctorly-primary text-white rounded-md flex items-center justify-center text-xs">D</div>
                    Doctorly
                  </span>
                </div>
                <div className="bg-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm text-gray-700 flex items-center gap-1.5 border border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-doctorly-accent animate-pulse"></span>
                  {t("secureConnection")}
                </div>
              </div>

              {/* Video Grid */}
              <div className="flex-1 bg-gray-900 rounded-2xl relative overflow-hidden min-h-[350px] md:min-h-[450px]">
                <Image 
                  src="/doctor/doctor2.png" 
                  alt="Doctor" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
                
                {/* Doctor Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  Dr. Anjali Sharma
                </div>

                {/* Patient PiP */}
                <div className="absolute top-4 right-4 w-28 h-40 md:w-36 md:h-48 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg relative">
                  <Image 
                    src="/doctor/doctor1.png" 
                    alt="Patient" 
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                    {t("you")}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20">
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-10 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors shadow-lg shadow-red-500/20 ml-2">
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right side: Chat & Details (1/3 width) */}
            <div className="w-full md:w-80 bg-white border-l border-gray-100 p-5 flex flex-col gap-4">
              
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Aisha Khan</p>
                  <p className="text-[11px] text-gray-500">Female, 32 Yrs</p>
                </div>
              </div>

              <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t("liveChat")}</span>
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex-1 p-3 flex flex-col gap-3 bg-white text-sm">
                  <div className="bg-gray-100 text-gray-700 p-2 rounded-lg rounded-tl-none w-fit max-w-[85%] text-xs">
                    {t("chatMsg1")}
                  </div>
                  <div className="bg-doctorly-secondary/50 text-doctorly-primary p-2 rounded-lg rounded-tr-none w-fit max-w-[85%] self-end text-xs">
                    {t("chatMsg2")}
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <input type="text" placeholder={t("typeMessage")} className="w-full bg-gray-50 rounded-lg px-3 py-1.5 text-xs outline-none" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">{t("digitalPrescription")}</p>
                  <p className="text-[10px] text-green-700 mb-2">{t("updatedAgo")}</p>
                  <button className="text-[10px] bg-white text-green-700 px-2.5 py-1 rounded-md font-semibold border border-green-200 hover:bg-green-50">{t("viewDetails")}</button>
                </div>
              </div>

            </div>
          </div>

          {/* Floating Decorational UI Elements */}
          <div className="hidden lg:flex absolute top-10 -left-12 bg-white px-4 py-2.5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 items-center gap-2 z-20 animate-in slide-in-from-left-8 duration-700">
            <span className="w-2 h-2 rounded-full bg-doctorly-accent"></span>
            <span className="text-sm font-semibold text-gray-800">{t("doctorOnline")}</span>
          </div>

          <div className="hidden lg:flex absolute bottom-20 -right-8 bg-white px-4 py-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 items-center gap-3 z-20 animate-in slide-in-from-right-8 duration-700 delay-300">
            <div className="w-8 h-8 rounded-full bg-doctorly-accent/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-doctorly-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{t("prescriptionReady")}</p>
              <p className="text-[10px] text-gray-500">{t("availableToDownload")}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
