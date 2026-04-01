import React, { useEffect, useRef } from 'react';
import { Linkedin, Github, Mail, ChevronDown, ExternalLink, Phone, Globe } from 'lucide-react';

export default function App() {
  const canvasRef = useRef(null);

  // Neuron network background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let neurons = [];

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      neurons = [];
      const neuronCount = Math.floor((window.innerWidth * window.innerHeight) / 20000); // Responsive density

      for (let i = 0; i < neuronCount; i++) {
        neurons.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          soma: 2.5, // soma radius
          firing: false,
          fireTime: 0,
          fireDuration: 200, // ms
          nextFireTime: Math.random() * 5000 + 2000 // Random fire delay
        });
      }
    };

    const drawNeuron = (neuron) => {
      const firingProgress = neuron.fireTime / neuron.fireDuration;
      
      // Draw axon/dendrites (branching lines)
      const branchCount = 3;
      for (let i = 0; i < branchCount; i++) {
        const angle = (i / branchCount) * Math.PI * 2;
        const length = 30 + (neuron.firing ? firingProgress * 15 : 0);
        const endX = neuron.x + Math.cos(angle) * length;
        const endY = neuron.y + Math.sin(angle) * length;
        
        ctx.beginPath();
        ctx.strokeStyle = neuron.firing 
          ? `rgba(100, 200, 255, ${0.6 * (1 - firingProgress)})`
          : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = neuron.firing ? 2 : 1;
        ctx.moveTo(neuron.x, neuron.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      // Draw soma (cell body)
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.soma, 0, Math.PI * 2);
      
      if (neuron.firing) {
        // Firing: bright blue glow
        ctx.fillStyle = `rgba(100, 200, 255, ${0.8 + firingProgress * 0.4})`;
        // Add glow
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      
      // Update and draw neurons
      for (let i = 0; i < neurons.length; i++) {
        let n = neurons[i];
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off edges
        if (n.x - 50 < 0 || n.x + 50 > canvas.width) n.vx = -n.vx;
        if (n.y - 50 < 0 || n.y + 50 > canvas.height) n.vy = -n.vy;

        // Clamp to bounds
        n.x = Math.max(50, Math.min(canvas.width - 50, n.x));
        n.y = Math.max(50, Math.min(canvas.height - 50, n.y));

        // Update firing state
        if (n.firing) {
          n.fireTime += 16;
          if (n.fireTime >= n.fireDuration) {
            n.firing = false;
            n.fireTime = 0;
            n.nextFireTime = currentTime + Math.random() * 5000 + 2000;
          }
        } else if (currentTime >= n.nextFireTime && Math.random() > 0.98) {
          n.firing = true;
          n.fireTime = 0;
        }

        drawNeuron(n);

        // Connect neurons with synapses
        for (let j = i + 1; j < neurons.length; j++) {
          let n2 = neurons[j];
          let dx = n.x - n2.x;
          let dy = n.y - n2.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            const baseOpacity = 0.15 - distance / 1500;
            
            // Synapse lights up when either neuron fires
            if (n.firing || n2.firing) {
              const progressN = n.firing ? n.fireTime / n.fireDuration : 0;
              const progressN2 = n2.firing ? n2.fireTime / n2.fireDuration : 0;
              const progress = Math.max(progressN, progressN2);
              ctx.strokeStyle = `rgba(100, 200, 255, ${baseOpacity + 0.4 * (1 - progress)})`;
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${baseOpacity})`;
              ctx.lineWidth = 0.5;
            }
            
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-200 relative flex flex-col overflow-x-hidden selection:bg-gray-700 selection:text-white scroll-smooth" style={{fontFamily: 'Space Grotesk'}}>
      {/* Network Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Sticky Navigation */}
      <nav className="fixed top-0 z-50 flex justify-between items-center px-6 py-5 md:px-12 w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="font-bold text-white text-lg tracking-widest uppercase">
          Mayank
        </div>
        <div className="hidden md:flex space-x-8 text-sm text-gray-400 font-medium">
          <a href="#home" className="hover:text-white transition-colors duration-300">home</a>
          <a href="#about" className="hover:text-white transition-colors duration-300">about</a>
          <a href="#career" className="hover:text-white transition-colors duration-300">career</a>
          <a href="#papers" className="hover:text-white transition-colors duration-300">papers</a>
          <a href="#projects" className="hover:text-white transition-colors duration-300">projects</a>
          <a href="#coursework" className="hover:text-white transition-colors duration-300">coursework</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="home" className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-24 px-6 gap-12 md:gap-24 w-full max-w-6xl mx-auto md:flex-row">
        
        {/* Profile Image */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-2xl"></div>
          <img
            src="/IMG_6201.JPG.jpeg"
            alt="Mayank Sharma"
            className="w-64 h-64 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] rounded-full object-cover shadow-2xl relative z-10" style={{boxShadow: '0 0 60px rgba(255, 255, 255, 0.3), 0 0 40px rgba(100, 200, 255, 0.2)'}}
          />
        </div>

        {/* Introduction Text */}
        <div className="flex flex-col items-start max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Hello,<br />
            I'm Mayank<br />
            Welcome to my portfolio!
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            3rd year undergrad at IIT Dharwad pursuing Engineering Physics
          </p>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mt-8">
            <a href="https://www.linkedin.com/in/mayank-sharma-aa3648287/" target="_blank" rel="noreferrer" className="glow-hover bg-[#1f1f1f] p-3.5 rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 group">
              <Linkedin className="w-6 h-6 text-gray-300 group-hover:text-white" strokeWidth={1.5} />
            </a>
            <a href="https://github.com/p9dt" target="_blank" rel="noreferrer" className="glow-hover bg-[#1f1f1f] p-3.5 rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 group">
              <Github className="w-6 h-6 text-gray-300 group-hover:text-white" strokeWidth={1.5} />
            </a>
            <a href="mailto:ep23bt009@iitdh.ac.in" className="glow-hover bg-[#1f1f1f] p-3.5 rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 group">
              <Mail className="w-6 h-6 text-gray-300 group-hover:text-white" strokeWidth={1.5} />
            </a>
            <a href="tel:+919634778805" className="glow-hover bg-[#1f1f1f] p-3.5 rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 group">
              <Phone className="w-6 h-6 text-gray-300 group-hover:text-white" strokeWidth={1.5} />
            </a>
            <a href="https://orcid.org/0009-0007-2238-1931" target="_blank" rel="noreferrer" className="glow-hover bg-[#1f1f1f] p-3.5 rounded-full hover:bg-gray-700 hover:scale-110 transition-all duration-300 group">
              <Globe className="w-6 h-6 text-gray-300 group-hover:text-white" strokeWidth={1.5} />
            </a>
          </div>
        </div>

      </main>

      {/* Down Arrow Indicator */}
      <div className="relative z-10 pb-12 flex justify-center w-full mt-[-60px]">
        <a href="#about" className="animate-bounce cursor-pointer">
          <ChevronDown className="w-12 h-12 text-gray-400 hover:text-white transition-colors duration-300" strokeWidth={3} />
        </a>
      </div>

      {/* About Section */}
      <section id="about" className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">about</h2>
          
          <div className="mb-12 glow-hover bg-white/5 p-6 rounded-lg border border-white/10">
            <p className="text-gray-300 leading-relaxed mb-4">
              Hello! I am an undergraduate student pursuing my degree in Engineering Physics at IIT Dharwad.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              My areas of interest are neuromorphic computing and quantum computing, and the application of physics to develop new forms of computing.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              My previous work has focused on memristor-based models and synaptic plasticity, using experimental data to simulate neural networks.
            </p>
            <p className="text-gray-300 leading-relaxed">
              I am interested in the application of ideas from condensed matter and quantum systems to the development of new forms of computing.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Education</h3>
            <div className="glow-hover bg-white/5 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-lg font-bold text-gray-200">Indian Institute of Technology Dharwad</h4>
              <p className="text-gray-400 mt-1">Bachelor of Technology in Engineering Physics</p>
              <div className="flex justify-between mt-4 text-sm text-gray-500">
                <span>Aug 2023 - Present</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section id="career" className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">career</h2>
          
          <div className="border-l-2 border-white/20 pl-6 ml-4 relative">
            {/* Timeline dot */}
            <div className="absolute w-4 h-4 bg-gray-400 rounded-full -left-[9px] top-2 border-4 border-[#0a0a0a]"></div>
            
            <h3 className="text-xl font-bold text-white">IASC-INSA-NASI Summer Research Fellow</h3>
            <h4 className="text-gray-400 mt-1 mb-2">CSIR-National Physical Laboratory (NPL) • New Delhi, India</h4>
            <p className="text-sm text-gray-500 mb-6 font-semibold">May 2025 – Jul 2025</p>
            
            <ul className="list-disc list-outside ml-4 text-gray-300 space-y-3 leading-relaxed">
              <li>Synthesized and characterized SnS₂ nanomaterials and fabricated memristive devices demonstrating synaptic plasticity (PPF, PPD, LTP, LTD).</li>
              <li>Performed electrical characterization using probe stations and source-measure units; analysed device I-V characteristics and variability.</li>
              <li>Integrated experimentally measured device parameters into neural network models, achieving 95.5% classification accuracy on the MNIST dataset.</li>
            </ul>
          </div>

          <div className="border-l-2 border-white/20 pl-6 ml-4 relative mt-12 pt-4">
             {/* Timeline dot */}
             <div className="absolute w-4 h-4 bg-gray-600 rounded-full -left-[9px] top-6 border-4 border-[#0a0a0a]"></div>
             <h3 className="text-xl font-bold text-white">Positions of Responsibility</h3>
             <h4 className="text-gray-400 mt-1 mb-4">IIT Dharwad</h4>
             <ul className="list-disc list-outside ml-4 text-gray-300 space-y-2">
                <li><strong className="text-gray-200">Club Secretary:</strong> Foc.us, Photography and Films Club</li>
                <li><strong className="text-gray-200">Student Mentor:</strong> Student Mentorship Program (SMP)</li>
             </ul>
          </div>
        </div>
      </section>

      {/* Papers Section */}
      <section id="papers" className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">papers</h2>
          
          <div className="space-y-8">
            {/* Paper 1 */}
            <div className="glow-hover bg-white/5 p-6 md:p-8 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                Resistive Switching and Synapse Properties of Bilayered CuO/MAPЫ3 Nanometer-Thick Films
              </h3>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                Megha Rana, Riya Malik, <strong className="text-gray-200">Mayank Sharma</strong>, Raj Saha, Prathamesh Ramedwar, Chandeep E. C., Suraj P. Khanna, Ritu Srivastava, Chandra Kant Suman
              </p>
              <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                <span className="text-sm font-semibold text-gray-500">ACS Applied Nano Materials, 2025</span>
                <a href="https://doi.org/10.1021/acsanm.5c04416" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                  DOI: 10.1021/acsanm.5c04416 <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Paper 2 */}
            <div className="glow-hover bg-white/5 p-6 md:p-8 rounded-lg border border-white/10 hover:border-white/20 transition-all group">
              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                Structural engineering of SnS₂ nanoflowers for neuromorphic applications
              </h3>
              <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                Megha Rana, Riya Malik, Mandvi Chauhan, <strong className="text-gray-200">Mayank Sharma</strong>, Ruchita Joshi, Omwati Rana, Suraj P. Khanna, Ritu Srivastava, Chandra Kant Suman*
              </p>
              <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                <span className="text-sm font-semibold text-gray-500">Journal of Materials Science: Materials in Electronics, 2026</span>
                <a href="https://doi.org/10.1007/s10854-026-16751-w" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                  DOI: 10.1007/s10854-026-16751-w <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">projects</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Project 1 */}
            <div className="glow-hover bg-white/5 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Quantum Variational Classifier for MNIST</h3>
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-4">Personal Project • Feb 2025</p>
              <ul className="list-disc list-outside ml-4 text-gray-400 space-y-2 text-sm flex-grow">
                <li>Implemented a hybrid quantum-classical classifier for handwritten digit classification (digits 0-3) using Penny Lane and PyTorch.</li>
                <li>Reproduced a Variational Quantum Classifier architecture employing Strongly Entangling Layers for quantum feature encoding.</li>
                <li>Integrated quantum circuits with PyTorch autograd to enable gradient-based optimisation and benchmarking against classical models.</li>
              </ul>
              <a href="https://github.com/p9dt" target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View on GitHub <ExternalLink size={14} />
              </a>
            </div>

            {/* Project 2 */}
            <div className="glow-hover bg-white/5 p-6 rounded-lg border border-white/10 hover:border-white/20 transition-all flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Quantum Communication: BB84 & E91 Protocols</h3>
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-4">Personal Project • Feb 2025</p>
              <ul className="list-disc list-outside ml-4 text-gray-400 space-y-2 text-sm flex-grow">
                <li>Simulated BB84 and E91 quantum key distribution protocols using Penny Lane to study secure quantum communication.</li>
                <li>Developed a Streamlit-based interactive visualisation of basis choice, photon transmission, and key reconciliation.</li>
              </ul>
              <a href="https://github.com/p9dt" target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                View on GitHub <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Coursework Section */}
      <section id="coursework" className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">coursework</h2>
          
          <div className="space-y-10">
            {/* Physics Core */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20"></span>
                Physics Core
                <span className="flex-grow h-[1px] bg-white/10"></span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Quantum Physics & Applications', 'Quantum Mechanics I', 'Intro to Quantum Information & Computation', 'Classical Mechanics', 'Statistical Physics', 'Electrodynamics', 'Electricity & Magnetism', 'Advanced Physics Laboratory'].map(course => (
                  <span key={course} className="glow-hover bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* CS & Math */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20"></span>
                Computer Science & Math
                <span className="flex-grow h-[1px] bg-white/10"></span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Data Structures and Algorithms', 'Computer Architecture', 'Computer Programming', 'Calculus', 'Linear Algebra', 'Differential Equations I', 'Intro to Probability', 'Data Analysis'].map(course => (
                  <span key={course} className="glow-hover bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Engineering & Electronics */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/20"></span>
                Electrical & Electronics
                <span className="flex-grow h-[1px] bg-white/10"></span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {['Electronic Devices', 'Signals and Systems', 'Intro to Analog Circuits', 'Digital Systems', 'Digital Signal Processing', 'Intro to Electrical Systems & Electronics'].map(course => (
                  <span key={course} className="glow-hover bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-colors">
                    {course}
                  </span>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Certifications & Technical Skills Section */}
      <section className="relative z-10 py-24 border-t border-white/5 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 tracking-widest lowercase">certifications & skills</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Certifications</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Basics of Quantum Information (IBM) <span className="text-gray-500 text-sm ml-2">Dec 2024</span></li>
                <li>CeNse Winter School on Semiconductor Technology (IISC) <span className="text-gray-500 text-sm ml-2">Dec 2024</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Technical Skills</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-gray-300 font-semibold mb-2">Programming & Libraries</h4>
                  <div className="flex flex-wrap gap-2">
                    {['C/C++', 'Python', 'NumPy', 'Pandas', 'Qiskit', 'PennyLane', 'Cirq'].map(skill => (
                      <span key={skill} className="glow-hover bg-white/10 px-3 py-1 rounded text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-300 font-semibold mb-2">Experimental & Device Physics</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Memristive device fabrication, I-V analysis, device modelling, synaptic plasticity measurements (PPF, PPD, LTP, LTD).
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-300 font-semibold mb-2">Software & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {['MATLAB', 'LTSpice', 'VS Code', 'Jupyter Notebook', 'LaTeX'].map(skill => (
                      <span key={skill} className="glow-hover bg-white/10 px-3 py-1 rounded text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Mayank Sharma. All rights reserved.</p>
      </footer>
    </div>
  );
}
