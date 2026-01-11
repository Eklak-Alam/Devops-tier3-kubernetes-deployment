export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">KubeDeploy</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Automating your infrastructure from code to container to cloud.
            </p>
          </div>

          {[ 
            { title: 'Product', links: ['Features', 'Integrations', 'Pricing'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Community'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-zinc-100 font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-zinc-500 hover:text-blue-400 text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">
            © 2026 Eklak Dev. All rights reserved.
          </p>
          <div className="flex gap-6">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-zinc-500 text-xs">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}