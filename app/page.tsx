import Link from "next/link";
import { ArrowRight, CalendarDays, MessageSquare, Link as LinkIcon, Bot, Layers, CheckCircle2, ChevronDown, Check, GraduationCap, Briefcase, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F7F9] font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 mx-auto max-w-7xl">
        <div className="text-xl font-medium tracking-tight">AgenticCal</div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          <Link href="#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
        </div>
        <Link href="/login" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-colors">
          Log in
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#111827] leading-[1.1] mb-6">
            AI-Driven Scheduling To Boost Your Productivity
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
            A platform that helps professionals manage calendars efficiently, handle meetings at scale with an AI agent, improving speed and quality across all channels, 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-black transition-colors">
              Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="#pricing" className="inline-flex items-center justify-center bg-white text-slate-900 px-8 py-4 rounded-full text-sm font-medium hover:bg-slate-50 transition-colors border border-slate-200">
              View Pricing
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-20 mt-32">
          {/* Integrations Card */}
          <div className="col-span-1 md:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-between border border-gray-100 shadow-sm">
            <div className="flex gap-4 mb-8 text-slate-400">
              <div className="w-10 h-10 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-blue-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-green-500">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center text-red-500">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Integrations</h3>
              <p className="text-sm text-slate-500">Connects seamlessly with Google Workspace, Office 365, Zoom, and your favorite tools.</p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-[#E2F5B6] to-[#C9ECA6] rounded-3xl p-8 flex flex-col justify-center text-[#1A4B29] shadow-sm">
            <h2 className="text-5xl font-semibold mb-2">10<span className="text-3xl">hrs+</span></h2>
            <p className="text-sm font-medium max-w-[200px]">saved per week by automating back-and-forth negotiations</p>
          </div>

          <div className="col-span-1 md:col-span-4 rounded-3xl overflow-hidden shadow-sm h-full hidden md:block">
             <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium text-purple-900 shadow-sm">
                 AI Agent Active
               </div>
             </div>
          </div>

          {/* Productivity */}
          <div className="col-span-1 md:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-end border border-gray-100 shadow-sm min-h-[200px]">
             <h2 className="text-5xl font-semibold mb-2">0</h2>
             <p className="text-sm text-slate-500">double bookings or timezone calculation errors</p>
          </div>

           {/* Automated Quality */}
           <div className="col-span-1 md:col-span-8 bg-gradient-to-r from-[#E0F2FE] to-[#F3FAFF] rounded-3xl p-8 border border-blue-50 shadow-sm relative overflow-hidden flex items-center justify-between">
             <div className="relative z-10 w-2/3">
               <h3 className="text-3xl font-medium text-slate-800 leading-tight mb-3">Natural Language<br/>Scheduling</h3>
               <p className="text-slate-600 text-sm max-w-sm">Just CC your AI assistant and let naturally phrase requests handle everything from booking to reschedules.</p>
             </div>
             <div className="hidden md:flex gap-2 text-slate-600 font-medium">
               {/* Abstract placeholder elements could go here */}
             </div>
          </div>
        </div>

        {/* Logos */}
        <div className="flex flex-wrap justify-between items-center opacity-40 grayscale gap-8 mb-32 px-8">
           <span className="text-xl font-bold tracking-widest">MODE</span>
           <span className="text-xl font-bold tracking-widest flex items-center gap-2"><Layers className="w-6 h-6"/> INTERCOM</span>
           <span className="text-xl font-bold tracking-widest flex items-center gap-2"><Bot className="w-6 h-6"/> Mosaic</span>
           <span className="text-xl font-bold tracking-widest flex items-center gap-2"><MessageSquare className="w-6 h-6"/> replicant</span>
           <span className="text-xl font-bold tracking-widest flex items-center gap-2"><Layers className="w-6 h-6"/> Canopy</span>
        </div>

        {/* Transformative Section */}
        <div className="text-center mb-32 pb-16 relative">
          <h2 className="text-4xl font-semibold mb-20">Drive Transformative<br/>Impact with AI</h2>
          
          <div className="max-w-5xl mx-auto flex flex-col relative" style={{ paddingBottom: '30vh' }}>
            <div className="sticky top-24 bg-[#EAE4F3] rounded-[2.5em] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-12 transition-all transform shadow-sm border border-white/50 mb-[20vh] z-10 min-h-[450px]">
              <div className="flex-1 text-left flex flex-col items-start gap-6">
                <div className="w-16 h-16 bg-[#D8CEEB] rounded-full flex items-center justify-center text-purple-700 shrink-0">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-3xl font-semibold text-slate-900 mb-4">Intelligent Scheduling</h4>
                  <p className="text-lg text-slate-700 max-w-md leading-relaxed">Automatically analyzes calendars to find the perfect meeting time across timezones, checking preferences and availability instantly.</p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium flex items-center hover:bg-black transition-colors mt-4">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="flex-1 w-full bg-white/40 rounded-3xl h-64 md:h-full min-h-[300px] border border-white/60 relative overflow-hidden backdrop-blur-sm flex items-center justify-center">
                <span className="text-purple-900/30 font-medium">Dashboard Interface Image</span>
              </div>
            </div>
            
            <div className="sticky top-32 bg-[#F6EDA7] rounded-[2.5em] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-12 transition-all transform shadow-xl border border-white/50 mb-[20vh] z-20 min-h-[450px]">
              <div className="flex-1 text-left flex flex-col items-start gap-6">
                <div className="w-16 h-16 bg-[#EBE087] rounded-full flex items-center justify-center text-yellow-700 shrink-0">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-3xl font-semibold text-slate-900 mb-4">Autonomous Negotiations</h4>
                  <p className="text-lg text-slate-700 max-w-md leading-relaxed">AI agent negotiates with guests directly via email to resolve conflicts without requiring any manual input from you.</p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium flex items-center hover:bg-black transition-colors mt-4">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="flex-1 w-full bg-white/40 rounded-3xl h-64 md:h-full min-h-[300px] border border-white/60 relative overflow-hidden backdrop-blur-sm flex items-center justify-center">
                <span className="text-yellow-900/30 font-medium">Agent Chat Image</span>
              </div>
            </div>
            
             <div className="sticky top-40 bg-[#D3F5ED] rounded-[2.5em] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-12 transition-all transform shadow-2xl border border-white/50 z-30 min-h-[450px]">
              <div className="flex-1 text-left flex flex-col items-start gap-6">
                <div className="w-16 h-16 bg-[#B5EBE0] rounded-full flex items-center justify-center text-teal-700 shrink-0">
                  <Layers className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-3xl font-semibold text-slate-900 mb-4">Seamless Integrations</h4>
                  <p className="text-lg text-slate-700 max-w-md leading-relaxed">Works perfectly with Google Calendar, Zoom, Outlook, and Microsoft Teams straight out of the box with one click.</p>
                </div>
                <button className="bg-[#1A1A1A] text-white px-8 py-4 rounded-full text-sm font-medium flex items-center hover:bg-black transition-colors mt-4">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="flex-1 w-full bg-white/40 rounded-3xl h-64 md:h-full min-h-[300px] border border-white/60 relative overflow-hidden backdrop-blur-sm flex items-center justify-center">
                <span className="text-teal-900/30 font-medium">Integrations Diagram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div id="use-cases" className="mt-40 mb-32">
           <div className="text-center max-w-2xl mx-auto mb-16">
             <h2 className="text-4xl font-semibold mb-4 text-slate-800">Who is AgenticCal For?</h2>
             <p className="text-sm text-slate-500">Whether you're managing a team, studying for finals, or just trying to get more done, we've got you covered.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {/* Students */}
             <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                 <GraduationCap className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-slate-800">Students</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                 Juggling lectures, assignments, and study groups? Let the AI find overlapping free time for group projects and automatically block out deep-work sessions for finals so you never fall behind.
               </p>
             </div>

             {/* Management */}
             <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                 <Briefcase className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-slate-800">Management</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                 Stop playing calendar Tetris. AgenticCal effortlessly organizes 1-on-1s, syncs with external clients, and navigates complex team availability, giving you back hours of administrative time.
               </p>
             </div>

             {/* Productivity Enthusiasts */}
             <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                 <Target className="w-7 h-7" />
               </div>
               <h3 className="text-xl font-semibold mb-3 text-slate-800">Productivity Enthusiasts</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                 Built for those who value every minute. Let the AI seamlessly track your progress, enforce strict time-blocking routines, and automatically reorganize your day when unexpected tasks arise.
               </p>
             </div>
           </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-32 grid md:grid-cols-2 gap-16 items-center">
           <div>
             <h2 className="text-sm font-semibold tracking-wider text-slate-500 uppercase mb-4">Why Choose Us</h2>
             <h3 className="text-3xl font-medium leading-tight mb-8 max-w-sm text-slate-800">
               Unleash the power of AI to turn your innovative <span className="text-slate-400">concepts into game-changing solutions!</span>
             </h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#E8F5FE] p-8 rounded-3xl">
                <h4 className="text-5xl font-semibold mb-2">42%</h4>
                <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">lower average handle time</p>
             </div>
             <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                <h4 className="text-5xl font-semibold mb-2">60<span className="text-2xl text-slate-400">k</span></h4>
                <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">monthly labor hours saved</p>
             </div>
             <div className="bg-[#F3E8FE] p-8 rounded-3xl">
                <h4 className="text-5xl font-semibold mb-2">5x</h4>
                <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">increase in support capacity</p>
             </div>
             <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
                <h4 className="text-5xl font-semibold mb-2 text-slate-400">80<span className="text-2xl">%</span></h4>
                <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">CSAT</p>
             </div>
           </div>
        </div>

        {/* Effortless Onboarding */}
        <div id="how-it-works" className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold mb-4 text-slate-800">Works perfectly within Google Calendar</h2>
            <p className="text-sm text-slate-500">Experience a magical AI scheduling assistant combined with the calendar interface you already know and love.</p>
          </div>

          <div className="bg-[#EAEFF4] rounded-3xl p-12 flex flex-col md:flex-row gap-12 items-center">
             <div className="flex-1">
               <h3 className="text-2xl font-medium mb-4 text-slate-800">No installation required. Manage everything directly inside your Google Calendar.</h3>
               <p className="text-sm text-slate-600 mb-8 max-w-md leading-relaxed">AgenticCal securely connects to your existing Google Calendar via API. There is no new heavy application to download, and no new interface your team has to learn.</p>

               <ul className="space-y-6">
                 <li>
                   <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800"><span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span> Zero App Installation</h4>
                   <p className="text-xs text-slate-500 ml-3.5 mt-1">Skip the tedious downloads. Our platform operates fully in the background as an invisible agent coordinating your Google APIs.</p>
                 </li>
                 <li>
                   <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800"><span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span> Instant 2-Way Sync</h4>
                   <p className="text-xs text-slate-500 ml-3.5 mt-1">Accept a meeting over email or move an event inside your Google Calendar app, and our AI instantly adjusts its understanding of your availability.</p>
                 </li>
                 <li>
                   <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800"><span className="w-1.5 h-1.5 bg-slate-800 rounded-full"></span> Familiar Workflows</h4>
                   <p className="text-xs text-slate-500 ml-3.5 mt-1">Use the mobile or desktop Google Calendar app exactly like you do right now. Our AI acts as a smart layer seamlessly wrapped around it.</p>
                 </li>
               </ul>
             </div>
             
             <div className="flex-1">
                 <div className="bg-white rounded-2xl p-4 shadow-sm w-full min-h-[300px] md:min-h-[400px] border border-gray-100 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-lg font-medium text-slate-700 shadow-sm">
                      Google Calendar Sync Active
                    </div>
                 </div>
             </div>
          </div>
        </div>

        {/* FAQs */}
        <div id="faq" className="max-w-3xl mx-auto mb-32 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">FAQ's : Write in the customer's voice</h2>
            <p className="text-sm text-slate-500 mb-10">AgenticCal offers a comprehensive suite of online calendar integrations, encompassing everything from Google Calendar to Outlook.</p>

            <div className="space-y-3 text-left">
              {[
                "Do I need to know how to code?",
                "I already have a custom domain. Can I use it with AgenticCal?",
                "Does AgenticCal include hosting for my website?",
                "Can I cancel my subscription at any time?"
              ].map((faq, i) => (
                <div key={i} className="bg-[#F8F9FA] hover:bg-[#F1F3F5] rounded-xl p-5 flex justify-between items-center cursor-pointer transition-colors border border-gray-100">
                  <span className="text-sm font-medium text-slate-700">{faq}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-semibold mb-4 text-slate-800">Simple, transparent pricing</h2>
            <p className="text-sm text-slate-500">Pick the plan that works best for your scheduling needs.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Basic Tier */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-xl font-medium mb-1">Basic</h3>
              <p className="text-xs text-slate-500 mb-6 h-8">Perfect for individuals starting out.</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$0</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Single Calendar Sync', '50,000 AI tokens/mo', 'Approx. 15 meetings scheduled', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-slate-100 text-slate-800 py-3 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors">Current Plan</button>
            </div>

            {/* Standard Tier */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-xl font-medium mb-1">Standard</h3>
              <p className="text-xs text-slate-500 mb-6 h-8">For busy professionals managing daily calls.</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">$10</span>
                <span className="text-slate-500 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Dual Calendar Sync', '300,000 AI tokens/mo', 'Approx. 100 meetings scheduled', 'Standard support', 'Custom booking limits'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[#1A1A1A] text-white py-3 rounded-xl text-sm font-medium hover:bg-black transition-colors">Start 14-Day Trial</button>
            </div>
            
            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-[#E2F5B6] to-[#C9ECA6] rounded-3xl p-8 shadow-sm flex flex-col transform md:-translate-y-2 relative border border-[#c1e89b]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1A4B29] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <h3 className="text-xl font-medium text-[#1A4B29] mb-1">Pro</h3>
              <p className="text-xs text-[#2A653A] mb-6 h-8">For power users who need advanced automation.</p>
              <div className="mb-6 text-[#1A4B29]">
                <span className="text-4xl font-semibold">$30</span>
                <span className="opacity-80 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Unlimited Calendar Sync', '1.5 Million AI tokens/mo', 'Approx. 500 meetings scheduled', 'Priority 24/7 support', 'Analytics dashboard', 'Custom domains'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#1A4B29] font-medium">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[#1A4B29] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#11331B] transition-colors">Upgrade to Pro</button>
            </div>

            {/* Customize Tier */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-xl font-medium">Customize</h3>
                 <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">Enterprise</span>
               </div>
              <p className="text-xs text-slate-500 mb-6 h-8">For large teams and specific security needs.</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold">Custom</span>
                <span className="text-slate-500 text-sm">/volume</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Everything in Pro', 'Custom AI API integrations', 'Unlimited pooled tokens', 'Self-hosted LLM endpoints', 'SLA guarantees', 'On-prem deployment'].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white border-2 border-slate-200 text-slate-800 py-3 rounded-xl text-sm font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-8 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-1">
            <div className="text-xl font-medium tracking-tight mb-4">AgenticCal</div>
            <p className="text-slate-500 mb-6 max-w-xs">
              AI-driven scheduling to boost your productivity. Never worry about double bookings again.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Product</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link href="#" className="hover:text-slate-900">Features</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Integrations</Link></li>
              <li><Link href="#pricing" className="hover:text-slate-900">Pricing</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Company</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link href="#" className="hover:text-slate-900">About Us</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Careers</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Blog</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-500">
              <li><Link href="#" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-slate-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgenticCal Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-slate-900"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg></Link>
            <Link href="#" className="hover:text-slate-900"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}