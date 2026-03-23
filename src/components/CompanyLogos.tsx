import { motion } from "framer-motion";

const companies = [
  { name: "Google", color: "from-blue-500 to-green-500" },
  { name: "Microsoft", color: "from-blue-600 to-cyan-500" },
  { name: "Meta", color: "from-blue-500 to-indigo-600" },
  { name: "Amazon", color: "from-orange-500 to-yellow-500" },
  { name: "Netflix", color: "from-red-600 to-red-500" },
  { name: "Stripe", color: "from-violet-600 to-indigo-500" },
  { name: "Vercel", color: "from-foreground to-foreground/70" },
  { name: "Shopify", color: "from-green-500 to-emerald-500" },
];

const CompanyLogos = () => {
  return (
    <section className="py-12 px-4 border-b border-border bg-muted/20 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 font-medium">
          Our graduates work at top companies worldwide
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 items-center"
          >
            {[...companies, ...companies, ...companies].map((company, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-6 py-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/60 transition-colors"
              >
                <span className={`text-lg font-bold bg-gradient-to-r ${company.color} bg-clip-text text-transparent`}>
                  {company.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
