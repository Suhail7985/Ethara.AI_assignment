import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Star,
  Layout,
  BarChart3,
  Globe,
  Users
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Landing = () => {
  const { isAuthenticated } = useAuthStore();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const features = [
    {
      title: "Workspace",
      desc: "Manage projects with ease using our intuitive interface.",
      icon: Layout,
      color: "bg-blue-500"
    },
    {
      title: "Analytics",
      desc: "Track team performance with real-time data insights.",
      icon: BarChart3,
      color: "bg-emerald-500"
    },
    {
      title: "Collaboration",
      desc: "Connect your team and stay in sync across all devices.",
      icon: Globe,
      color: "bg-indigo-500"
    }
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      desc: "For individuals starting out.",
      features: ["3 Projects", "Basic Kanban", "Community Support"],
      button: "Get Started"
    },
    {
      name: "Pro",
      price: "$12",
      period: "/mo",
      desc: "For growing teams.",
      features: ["Unlimited Projects", "Analytics", "Priority Support"],
      button: "Try Free",
      highlight: true
    },
    {
      name: "Scale",
      price: "Custom",
      desc: "For large organizations.",
      features: ["Enterprise Security", "Custom Roles", "Dedicated Support"],
      button: "Contact"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-500 selection:text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              TaskFlow
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2.5 px-6 rounded-xl text-sm shadow-xl shadow-primary-500/20">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-6 rounded-xl text-sm shadow-xl shadow-primary-500/20">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 border border-primary-100 dark:border-primary-800">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Workspace Optimized</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
              Work with speed. <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Deliver Excellence.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              A comprehensive task management suite designed for high-performance teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto btn-primary py-4 px-10 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary-500/30 group">
                {isAuthenticated ? 'Enter App' : 'Get Started'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-20 relative mx-auto max-w-5xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] aspect-[16/9] relative overflow-hidden border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
                  <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                  </div>
                  
                  <div className="ml-20 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex flex-col gap-2">
                           <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                           <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 dark:from-slate-950/80 via-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 mb-4">Core Benefits</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Built for scale</h3>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all group"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-24 px-6 bg-primary-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-3xl md:text-4xl font-bold text-white italic leading-tight mb-10">
            "Streamlined operations and clear visibility into our team's progress."
          </blockquote>
        </div>
      </section>

      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 mb-4">Pricing</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Flexible options</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <div 
              key={i} 
              className={`p-10 rounded-[2.5rem] border ${plan.highlight ? 'bg-white dark:bg-slate-900 border-primary-600 shadow-2xl relative' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Popular
                </div>
              )}
              <h4 className="text-xl font-black dark:text-white mb-2">{plan.name}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-bold">{plan.period}</span>}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8">
                {plan.desc}
              </p>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link 
                to="/register" 
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center transition-all ${plan.highlight ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'}`}
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold">
            &copy; 2026 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
