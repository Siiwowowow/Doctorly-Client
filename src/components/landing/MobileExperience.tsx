import { Smartphone, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function MobileExperience() {
  const t = useTranslations("mobileExperience");
  return (
    <section className="py-24 bg-doctorly-bg overflow-hidden border-y border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <div className="order-2 lg:order-1 relative h-[500px] flex justify-center">
            {/* Phone Mockup Frame */}
            <div className="relative w-[280px] h-[580px] bg-black rounded-[40px] border-[10px] border-black shadow-2xl overflow-hidden z-10 transform lg:-rotate-6 hover:rotate-0 transition-transform duration-500">
              
              {/* Screen Content */}
              <div className="absolute inset-0 bg-white overflow-hidden">
                <div className="bg-doctorly-primary h-40 rounded-b-3xl p-6 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold">Doctorly</span>
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{t("hiAisha")}</h3>
                  <p className="text-xs text-white/80">{t("howAreYou")}</p>
                </div>
                
                <div className="px-4 -mt-6">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="text-sm font-bold">Dr. Sharma</p>
                        <p className="text-[10px] text-gray-500">Video Consult • 11:30 AM</p>
                      </div>
                    </div>
                    <Button className="w-full h-8 text-xs bg-doctorly-primary text-white rounded-lg">{t("joinCall")}</Button>
                  </div>
                  
                  <h4 className="font-bold text-sm mb-3 text-gray-800">{t("topSpecialties")}</h4>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl"></div>
                        <div className="w-8 h-2 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-10 lg:-right-10 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 z-20 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{t("appAvailable")}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-bold text-doctorly-text mb-6 tracking-tight leading-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-doctorly-text hover:bg-black text-white rounded-xl h-14 px-8 text-base font-bold flex items-center gap-2">
                <Download className="w-5 h-5" /> {t("appStore")}
              </Button>
              <Button className="bg-doctorly-text hover:bg-black text-white rounded-xl h-14 px-8 text-base font-bold flex items-center gap-2">
                <Download className="w-5 h-5" /> {t("googlePlay")}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
