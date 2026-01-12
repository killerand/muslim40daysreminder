import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="relative overflow-hidden py-12 text-center">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-pattern opacity-50" />
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-b from-gold/10 to-transparent blur-3xl" />
      
      <div className="relative z-10">
        {/* Bismillah */}
        <p className="mb-4 font-display text-2xl text-primary md:text-3xl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        
        {/* Main title */}
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-6 w-6 text-gold md:h-8 md:w-8" />
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            40 Days Reminder
          </h1>
          <Sparkles className="h-6 w-6 text-gold md:h-8 md:w-8" />
        </div>
        
        {/* Subtitle */}
        <p className="mt-4 text-muted-foreground">
          Following the Sunnah of personal grooming
        </p>
        
        {/* Hadith reference */}
        <div className="mx-auto mt-6 max-w-xl rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
          <p className="font-display text-sm italic text-muted-foreground md:text-base">
            "The fitrah consists of five things: circumcision, shaving the pubic region, 
            trimming the moustache, cutting the nails, and plucking the armpit hair."
          </p>
          <p className="mt-2 text-xs font-medium text-primary">
            — Sahih al-Bukhari & Muslim
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
