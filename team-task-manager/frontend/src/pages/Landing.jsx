import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  FolderKanban, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  ArrowRight,
  ChevronRight,
  Star,
  Layout,
  BarChart3,
  Globe
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
      title: "Real-time Kanban",
      desc: "Visualize your workflow and move tasks across stages with drag-and-drop simplicity.",
      icon: Layout,
      color: "bg-blue-500"
    },
    {
      title: "Team Analytics",
      desc: "Gain deep insights into team productivity with beautiful, data-driven dashboards.",
      icon: BarChart3,
      color: "bg-emerald-500"
    },
    {
      title: "Global Collaboration",
      desc: "Work together from anywhere. Invite members, assign roles, and stay in sync.",
      icon: Globe,
      color: "bg-indigo-500"
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "Free",
      desc: "Perfect for individuals and small side projects.",
      features: ["Up to 3 Projects", "Basic Kanban Board", "1GB Storage", "Community Support"],
      button: "Get Started",
      highlight: false
    },
    {
      name: "Professional",
      price: "$12",
      period: "/mo",
      desc: "Best for growing teams that need more power.",
      features: ["Unlimited Projects", "Advanced Analytics", "10GB Storage", "Priority Support", "Custom Branding"],
      button: "Start Free Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Advanced security and support for large organizations.",
      features: ["Everything in Pro", "SSO & SAML", "Unlimited Storage", "Dedicated Account Manager", "Custom Training"],
      button: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
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
            <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary py-2.5 px-6 rounded-xl text-sm shadow-xl shadow-primary-500/20">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-6 rounded-xl text-sm shadow-xl shadow-primary-500/20">
                  Sign up free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold mb-8 border border-primary-100 dark:border-primary-800">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>v2.0 is now live! Explore the new Kanban</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
              Deliver your best work <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Faster than ever.
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              The ultimate team collaboration platform. Manage tasks, track progress, and scale your organization with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="w-full sm:w-auto btn-primary py-4 px-10 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-2xl shadow-primary-500/30 group">
                {isAuthenticated ? 'Return to Dashboard' : 'Get Started for Free'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Watch Demo
              </button>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-20 relative mx-auto max-w-5xl group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-none overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-950 rounded-[2rem] aspect-[16/9] relative overflow-hidden border border-slate-200 dark:border-slate-800 p-4 sm:p-8">
                  {/* Mockup Sidebar */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                  </div>
                  
                  {/* Mockup Content */}
                  <div className="ml-20 flex flex-col gap-6">
                    {/* Mockup Topbar */}
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    </div>
                    
                    {/* Mockup Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-3 flex flex-col gap-2">
                           <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                           <div className="h-6 w-8 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Mockup Charts */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
                         <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded-full mb-6"></div>
                         <div className="flex items-end gap-2 h-24">
                           {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                             <div key={i} className="flex-1 bg-primary-500/20 rounded-t-md" style={{ height: `${h}%` }}></div>
                           ))}
                         </div>
                      </div>
                      <div className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                         <div className="w-24 h-24 rounded-full border-[10px] border-primary-500 border-t-slate-100 dark:border-t-slate-800 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overlay Gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 dark:from-slate-950/80 via-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-900 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
            Trusted by world-class teams
          </p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 grayscale opacity-40 contrast-125">
             {['MICROSOFT', 'AIRBNB', 'SLACK', 'NETFLIX', 'SPOTIFY'].map(logo => (
               <span key={logo} className="text-2xl font-black italic tracking-tighter">{logo}</span>
             ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 mb-4">Everything you need</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Powerful features for modern teams</h3>
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
              className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none transition-all group"
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

      {/* Testimonial */}
      <section className="py-24 px-6 bg-primary-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-3xl md:text-4xl font-bold text-white italic leading-tight mb-10">
            "TaskFlow completely transformed how our design team operates. The Kanban board is intuitive, and the analytics helped us cut our delivery time by 40%."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-white text-xl">S</div>
            <div className="text-left">
              <h5 className="font-black text-white leading-none">Sarah Jenkins</h5>
              <p className="text-primary-200 text-sm font-bold mt-1">Design Director at CreativeHub</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 mb-4">Pricing Plans</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Ready to boost your productivity?</h3>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <div 
              key={i} 
              className={`p-10 rounded-[2.5rem] border ${plan.highlight ? 'bg-white dark:bg-slate-900 border-primary-600 shadow-2xl relative' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}
              <h4 className="text-xl font-black dark:text-white mb-2">{plan.name}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-bold">{plan.period}</span>}
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
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
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center transition-all ${plan.highlight ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300'}`}
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>
            <p className="max-w-xs text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
              Empowering teams to achieve more with a streamlined task management experience.
            </p>
          </div>
          
          <div>
            <h5 className="font-black text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">Product</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">Company</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-black text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-[0.2em]">Legal</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold">
            &copy; 2026 TaskFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <div className="w-5 h-5 bg-slate-400 rounded-full"></div>
             <div className="w-5 h-5 bg-slate-400 rounded-full"></div>
             <div className="w-5 h-5 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
